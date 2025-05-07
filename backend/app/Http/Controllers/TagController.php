<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use PDOException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Throwable;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $tags = Tag::get();
            return response()->json(["data" => $tags], 200);
        } catch (PDOException $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    /**
     * Search products by name
     */
    public function search(string $name)
    {
        try {
            $tags = Tag::where('name', 'like', "%{$name}%")->get();
            return response()->json(["data" => $tags], 200);
        } catch (Throwable $e) {
            return response()->json(["message" => "Search failed: " . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon_path' => 'sometimes||mimes:jpeg,png,jpg,gif,filesvg,ico|max:2048'
        ]);

        try {
            $iconName = 'default-tag-icon.ico';

            if ($request->hasFile('icon_path')) {
                $file = $request->file('icon_path');
                $extension = $file->getClientOriginalExtension();
                $cleanTagName = Str::slug($request->name);
                $iconName = $cleanTagName . '_' . Str::uuid() . '.' . $extension;
                $file->storeAs('icons', $iconName, 'public');
            }

            $tag = Tag::create([
                "name" => $request->name,
                "icon_path" => $iconName
            ]);

            return response()->json([
                "data" => $tag,
                'message' => 'Tag created successfully'
            ], 201);
        } catch (PDOException $e) {
            if ($iconName && Storage::disk('public')->exists('icons/' . $iconName)) {
                Storage::disk('public')->delete('icons/' . $iconName);
            }

            return response()->json(["message" => "Failed to create tag: " . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $tag = Tag::findOrFail($id);

            return response()->json(["data" => $tag], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(["message" => "Tag not found"], 404);
        } catch (PDOException $e) {
            return response()->json(["message" => "Failed to retrieve tag: " . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon_path' => 'sometimes|file|mimes:jpeg,png,jpg,gif,svg,ico|max:2048',
        ]);

        try {
            $tag = Tag::findOrFail($id);
            $oldIconPath = $tag->icon_path;

            if ($request->hasFile('icon_path')) {
                $file = $request->file('icon_path');
                $extension = $file->getClientOriginalExtension();
                $cleanTagName = Str::slug($request->name ?? $tag->name);
                $iconName = $cleanTagName . '_' . Str::uuid() . '.' . $extension;
                $file->storeAs('icons', $iconName, 'public');
                $tag->icon_path = $iconName;

                if ($oldIconPath && Storage::disk('public')->exists('icons/' . $oldIconPath)) {
                    Storage::disk('public')->delete('icons/' . $oldIconPath);
                }
            }

            if ($request->has('name')) {
                $tag->name = $request->name;
            }

            $tag->save();
            return response()->json(["data" => $tag, "message" => "Tag updated successfully"], 200);
        } catch (PDOException $e) {
            if (
                isset($iconName) && $iconName !== $oldIconPath &&
                Storage::disk('public')->exists('icons/' . $iconName)
            ) {
                Storage::disk('public')->delete('icons/' . $iconName);
            }

            return response()->json(["message" => "Failed to update tag: " . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $tag = Tag::findOrFail($id);

            if ($tag->icon_path && Storage::disk('public')->exists('icons/' . $tag->icon_path)) {
                Storage::disk('public')->delete('icons/' . $tag->icon_path);
            }

            $tag->delete();
            return response()->json(["message" => "Tag deleted successfully"], 200);
        } catch (PDOException $e) {
            return response()->json(["message" => "Failed to delete tag: " . $e->getMessage()], 500);
        }
    }
}
