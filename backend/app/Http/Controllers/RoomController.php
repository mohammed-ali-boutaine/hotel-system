<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Hotel;
use App\Models\Review;
use App\Models\Booking;
use App\Models\RoomImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($hotelId)
    {
        $rooms = Room::with(['images', 'hotel'])
            ->where('hotel_id', $hotelId)
            ->get();
        return response()->json(['data' => $rooms], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $hotelId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'room_number' => 'required|string|max:50',
            'type' => 'required|string|max:50',
            'floor' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'bed_numbers' => 'required|integer|min:1',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|min:0|max:999999.99',
            'is_available' => 'boolean',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
        ]);

        // Check if room number is unique within the hotel
        $exists = Room::where('hotel_id', $hotelId)
            ->where('room_number', $validated['room_number'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Room number already exists in this hotel'
            ], 422);
        }

        $validated['hotel_id'] = $hotelId;

        try {
            DB::beginTransaction();
            $room = Room::create($validated);
            DB::commit();
            return response()->json(['message' => 'Room created successfully!', 'room' => $room], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the detailed error for debugging
            \Illuminate\Support\Facades\Log::error('Error creating room: ' . $e->getMessage() . ' Stack Trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error creating room', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $room = Room::with(['images', 'hotel'])->findOrFail($id);
        return response()->json(['data' => $room], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'room_number' => 'sometimes|required|string|max:50',
            'type' => 'sometimes|required|string|max:50',
            'floor' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'bed_numbers' => 'sometimes|required|integer|min:1',
            'capacity' => 'sometimes|required|integer|min:1',
            'price_per_night' => 'sometimes|required|numeric|min:0|max:999999.99',
            'is_available' => 'sometimes|boolean',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
        ]);

        // If room number is being updated, check for uniqueness
        if (isset($validated['room_number'])) {
            $exists = Room::where('hotel_id', $room->hotel_id)
                ->where('room_number', $validated['room_number'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Room number already exists in this hotel'
                ], 422);
            }
        }

        try {
            DB::beginTransaction();
            $room->update($validated);
            DB::commit();
            return response()->json(['data' => $room], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error updating room', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            $room = Room::findOrFail($id);
            $room->delete();
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error deleting room', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Upload room image
     */
    public function uploadImage(Request $request, $roomId)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_primary' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            DB::beginTransaction();
            $room = Room::findOrFail($roomId);
            $imagePath = $request->file('image')->store('room_images', 'public');

            // If this is marked as primary, remove primary status from other images
            if ($request->is_primary) {
                RoomImage::where('room_id', $roomId)->update(['is_primary' => false]);
            }

            $image = RoomImage::create([
                'room_id' => $roomId,
                'image_path' => $imagePath,
                'is_primary' => $request->is_primary ?? false
            ]);
            DB::commit();
            return response()->json(['data' => $image], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the detailed error for debugging
            \Illuminate\Support\Facades\Log::error('Error uploading image: ' . $e->getMessage() . ' Stack Trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error uploading image', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Check room availability for specific dates
     */
    public function checkAvailability(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $room = Room::findOrFail($id);
        $isAvailable = $room->isAvailableForDates($request->check_in, $request->check_out);

        return response()->json([
            'is_available' => $isAvailable,
            'room' => $room
        ]);
    }

    /**
     * Search rooms with filters
     */
    public function search(Request $request)
    {
        $query = Room::query();

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        if ($request->has('min_price')) {
            $query->where('price_per_night', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        if ($request->has('capacity')) {
            $query->where('capacity', '>=', $request->capacity);
        }

        if ($request->has('amenities')) {
            $query->whereJsonContains('amenities', $request->amenities);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('is_available')) {
            $query->where('is_available', $request->is_available);
        }

        $rooms = $query->with(['images', 'hotel'])->get();

        return response()->json(['data' => $rooms]);
    }

    /**
     * Display all rooms owned by the current owner
     */
    public function ownerRooms()
    {
        try {
            $ownerId = auth('api')->id();

            $rooms = Room::with(['images', 'hotel'])
                ->whereHas('hotel', function ($query) use ($ownerId) {
                    $query->where('owner_id', $ownerId);
                })
                ->get();

            return response()->json(['data' => $rooms], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching owner rooms', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all rooms (admin only)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function adminRooms()
    {
        $rooms = Room::with(['hotel'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'rooms' => $rooms
        ]);
    }

    /**
     * Get owner statistics including total hotels, rooms, average rating, and revenue
     */
    public function ownerStatistics()
    {
        try {
            $ownerId = auth('api')->id();

            // Get total hotels
            $totalHotels = Hotel::where('owner_id', $ownerId)->count();

            // Get total rooms
            $totalRooms = Room::whereHas('hotel', function ($query) use ($ownerId) {
                $query->where('owner_id', $ownerId);
            })->count();

            // Get average rating for hotels owned by the owner
            $averageRating = Review::whereHas('hotel', function ($query) use ($ownerId) {
                $query->where('owner_id', $ownerId);
            })->avg('rating') ?? 0;

            // Get total revenue from bookings
            $totalRevenue = Booking::whereHas('room.hotel', function ($query) use ($ownerId) {
                $query->where('owner_id', $ownerId);
            })->sum('total_price');

            // Get monthly revenue for the last 6 months
            $monthlyRevenue = Booking::whereHas('room.hotel', function ($query) use ($ownerId) {
                $query->where('owner_id', $ownerId);
            })
                ->where('created_at', '>=', now()->subMonths(6))
                // Use EXTRACT for PostgreSQL compatibility
                ->selectRaw('EXTRACT(MONTH FROM created_at) as month, EXTRACT(YEAR FROM created_at) as year, SUM(total_price) as revenue')
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();

            // Get room occupancy rate
            $totalBookings = Booking::whereHas('room.hotel', function ($query) use ($ownerId) {
                $query->where('owner_id', $ownerId);
            })->count();

            $occupancyRate = $totalRooms > 0 ? ($totalBookings / $totalRooms) * 100 : 0;

            return response()->json([
                'data' => [
                    'total_hotels'    => $totalHotels,
                    'total_rooms'     => $totalRooms,
                    'average_rating'  => round($averageRating, 2),
                    'total_revenue'   => round($totalRevenue, 2),
                    'monthly_revenue' => $monthlyRevenue,
                    'occupancy_rate'  => round($occupancyRate, 2),
                    'total_bookings'  => $totalBookings
                ]
            ], 200);
        } catch (\Exception $e) {
            // Log the detailed error for debugging
            \Illuminate\Support\Facades\Log::error('Error fetching owner statistics: ' . $e->getMessage() . ' Stack Trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error fetching owner statistics', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display hotel owner bookings
     */
    public function ownerBookings()
    {
        try {
            $ownerId = auth('api')->id();

            $bookings = Booking::whereHas('room.hotel', function ($query) use ($ownerId) {
                $query->where('owner_id', $ownerId);
            })->with('room.hotel')->get();

            return response()->json(['data' => $bookings], 200);
        } catch (\Exception $e) {
            // Log the detailed error for debugging
            \Illuminate\Support\Facades\Log::error('Error fetching owner bookings: ' . $e->getMessage() . ' Stack Trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error fetching owner bookings', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display hotel bookings
     */
    public function hotelBookings($hotelId)
    {
        try {
            $bookings = Booking::whereHas('room', function ($query) use ($hotelId) {
                $query->where('hotel_id', $hotelId);
            })->with('room')->get();

            return response()->json(['data' => $bookings], 200);
        } catch (\Exception $e) {
            // Log the detailed error for debugging
            \Illuminate\Support\Facades\Log::error('Error fetching hotel bookings: ' . $e->getMessage() . ' Stack Trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error fetching hotel bookings', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Admin method to delete any room
     */
    public function adminDeleteRoom(Request $request, $id)
    {
        try {
            $user = $request->user();

            // Check if user is admin
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }

            $room = Room::with('images')->findOrFail($id);

            // Get room information for the response
            $roomInfo = [
                'id' => $room->id,
                'name' => $room->name,
                'hotel_id' => $room->hotel_id,
                'hotel_name' => $room->hotel->name ?? 'Unknown Hotel'
            ];

            // Delete room images first
            foreach ($room->images as $image) {
                if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
                $image->delete();
            }

            // Delete the room
            $room->delete();

            return response()->json([
                'message' => "Room '{$roomInfo['name']}' has been deleted successfully by admin",
                'deleted_room' => $roomInfo
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Room not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting room: ' . $e->getMessage()], 500);
        }
    }
}
