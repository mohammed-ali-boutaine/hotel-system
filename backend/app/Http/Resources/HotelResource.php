<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Handle coordinate field safely
        $coordinate = $this->coordinate;
        if (is_string($coordinate)) {
            $coordinate = json_decode($coordinate);
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'profile_path' => $this->profile_path ? asset('storage/' . $this->profile_path) : null,
            'cover_path' => $this->cover_path ? asset('storage/' . $this->cover_path) : null,
            'coordinate' => $coordinate,
            'owner_id' => $this->owner_id,
            'owner' => $this->whenLoaded('owner'),
            'tags' => $this->whenLoaded('tags'),
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
            'reviews' => $this->whenLoaded('reviews'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'rooms_avg_price_per_night' => $this->when(isset($this->rooms_avg_price_per_night), $this->rooms_avg_price_per_night),
            'rooms_min_price_per_night' => $this->when(isset($this->rooms_min_price_per_night), $this->rooms_min_price_per_night),
            'reviews_avg_rating' => $this->when(isset($this->reviews_avg_rating), $this->reviews_avg_rating),
        ];
    }
}
