<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Validation\ValidationException;


class JWTAuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     * Apply middleware.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     // Apply auth middleware to all methods except register and login
    //     // $this->middleware('auth:api', ['except' => ['login', 'register']]);
    //     // Apply throttle middleware specifically to the login method
    //     $this->middleware('throttle:5,1')->only('login'); // 5 attempts per 1 minute
    // }

    // User registration
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'profile_path' => 'nullable|file|image|max:10240',
            'role' => 'required|in:client,owner'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $userData = [
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'role' => $request->get('role'),
        ];

        // Handle profile image upload
        if ($request->hasFile('profile_path')) {
            $file = $request->file('profile_path');
            $extension = $file->getClientOriginalExtension();
            $filename = 'userprofile_' . Str::uuid() . '.' . $extension;
            $path = $file->storeAs('user-profiles', $filename, 'public');

            if (!$path) {
                throw new \Exception('Failed to store profile image');
            }

            $userData['profile_path'] = $path;
        }

        $user = User::create($userData);
        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    // User login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $remberMe = $request->get('remember');

        try {
            if (! $token = JWTAuth::attempt($credentials, $remberMe)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            // Get the authenticated user.
            $user = auth()->user();

            return response()->json(compact('user', 'token'), 201);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    // Get authenticated user
    public function getUser()
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            Log::error('JWT Token Error: ' . $e->getMessage());

            // Check if the token is expired
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                return response()->json(['error' => 'Token has expired'], 401);
            }

            return response()->json(['error' => 'Invalid token'], 400);
        }

        return response()->json(compact('user'));
    }

    // User logout
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Update the authenticated user (full update).
     * Requires all fields to be present.
     */
    public function updateUser(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:6|confirmed', // Use 'sometimes' if password update is optional even for PUT, or 'required' if it must always be provided for a full update. Adjust based on your requirements.
            // Add other required fields for a full user profile update
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->only(['name', 'email']); // Include all fields expected for a full update

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User successfully updated',
            'user' => $user
        ], 200);
    }

    /**
     * Partially update the authenticated user.
     * Only updates the fields provided in the request.
     */

    public function patchUser(Request $request)
    {
        $user = Auth::user();

        try {
            // Validation
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
                'password' => 'sometimes|string|min:6|confirmed',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'profile_path' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg,ico|max:2048',
            ]);

            // Store old profile path
            $oldProfilePath = $user->profile_path;

            // Handle file upload
            try {
                if ($request->hasFile('profile_path')) {
                    $file = $request->file('profile_path');
                    $extension = $file->getClientOriginalExtension();
                    $filename = 'userprofile_' . Str::uuid() . '.' . $extension;
                    $relativePath = 'user-profiles/' . $filename;

                    $file->storeAs('user-profiles', $filename, 'public');
                    $validated['profile_path'] = $relativePath;
                } elseif ($request->exists('profile_path') && is_null($request->input('profile_path'))) {
                    // If user wants to remove their profile picture
                    $validated['profile_path'] = null;
                }
            } catch (\Exception $e) {
                return response()->json(['message' => 'File upload failed'], 500);
            }

            // Handle password hashing
            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Start transaction
            DB::beginTransaction();

            try {
                // Update user
                $user->update($validated);

                // Commit transaction
                DB::commit();

                // Delete old profile image if a new one was uploaded or if profile was removed
                if (
                    (isset($validated['profile_path']) && $oldProfilePath && $oldProfilePath !== $validated['profile_path']) ||
                    (array_key_exists('profile_path', $validated) && is_null($validated['profile_path']) && $oldProfilePath)
                ) {
                    Storage::disk('public')->delete($oldProfilePath);
                }

                return response()->json([
                    'message' => 'User successfully updated',
                    'user' => $user->fresh()
                ], 200);
            } catch (\Exception $e) {
                DB::rollBack();

                // Delete newly uploaded file if transaction failed
                if (isset($validated['profile_path'])) {
                    Storage::disk('public')->delete($validated['profile_path']);
                }

                return response()->json(['message' => 'User update failed'], 500);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred'], 500);
        }
    }

    /**
     * Get all users (admin only)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllUsers()
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Admin method to delete a user
     */
    public function adminDeleteUser(Request $request, $userId)
    {
        try {
            $admin = $request->user();

            // Check if user is admin
            if ($admin->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }

            // Check if trying to delete self
            if ($userId == $admin->id) {
                return response()->json(['message' => 'Cannot delete yourself.'], 400);
            }

            $user = User::findOrFail($userId);

            // Store user info for response
            $userInfo = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ];

            // Delete profile image if exists
            if ($user->profile_path && Storage::disk('public')->exists($user->profile_path)) {
                Storage::disk('public')->delete($user->profile_path);
            }

            // Delete the user
            $user->delete();

            return response()->json([
                'message' => "User '{$userInfo['name']}' has been deleted successfully",
                'deleted_user' => $userInfo
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'User not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting user: ' . $e->getMessage()], 500);
        }
    }
}
