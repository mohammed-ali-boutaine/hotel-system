<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
     /**
      * Transform the resource into an array.
      *
      * @return array<string, mixed>
      */
     public function toArray(Request $request): array
     {
          return [
               'id' => $this->id,
               'hotel_id' => $this->hotel_id,
               'name' => $this->name,
               'room_number' => $this->room_number,
               'type' => $this->type,
               'floor' => $this->floor,
               'description' => $this->description,
               'bed_numbers' => $this->bed_numbers,
               'capacity' => $this->capacity,
               'price_per_night' => $this->price_per_night,
               'is_available' => $this->is_available,
               'amenities' => $this->amenities,
               'images' => RoomImageResource::collection($this->whenLoaded('images')),
               'created_at' => $this->created_at,
               'updated_at' => $this->updated_at,
          ];
     }
}
