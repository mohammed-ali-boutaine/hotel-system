<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function toggleWishlist(Request $request, $hotelId)
    {
        $user = Auth::user();

        // Ensure the user is a client
        if ($user->role !== 'client') {
            return response()->json(['message' => 'Only clients can manage wishlists'], 403);
        }

        try {
            // Check if the hotel exists
            $hotel = Hotel::findOrFail($hotelId);

            if ($user->wishlist()->where('hotel_id', $hotelId)->exists()) {
                $user->wishlist()->detach($hotelId);
                return response()->json(['message' => 'Hotel removed from wishlist']);
            } else {
                $user->wishlist()->attach($hotelId);
                return response()->json(['message' => 'Hotel added to wishlist']);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Hotel not found'], 404);
        }
    }

    public function getWishlist()
    {
        try {
            $user = Auth::user();

            // Ensure the user is a client
            if ($user->role !== 'client') {
                return response()->json(['message' => 'Only clients can view wishlists'], 403);
            }

            // Fetch the client's wishlist
            $wishlist = $user->wishlist()
                ->withAvg('reviews', 'rating')
                ->withAvg('rooms', 'price_per_night')
                ->withMin('rooms', 'price_per_night')
                ->orderByRaw('profile_path IS NULL') // Push hotels without profile image to bottom
                ->orderByDesc('reviews_avg_rating')
                ->with(['rooms' => function ($query) {
                    $query->limit(2);
                }, 'rooms.images'])
                ->get();

            // Process rooms and images data
            $wishlist->transform(function ($hotel) {
                $roomCount = $hotel->rooms->count();

                if ($roomCount === 1) {
                    // For hotels with one room, keep all images
                    // No changes needed
                } else {
                    // For hotels with multiple rooms, limit to 2 rooms with 3 images each
                    $hotel->rooms = $hotel->rooms->take(2)->each(function ($room) {
                        $room->images = $room->images->take(3);
                    });
                }

                return $hotel;
            });

            return response()->json([
                'data' => $wishlist
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching wishlist: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error fetching wishlist: ' . $e->getMessage()], 500);
        }
    }
}
