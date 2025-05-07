<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomImageResource extends JsonResource
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
               'room_id' => $this->room_id,
               'image_path' => $this->image_path ? asset('storage/' . $this->image_path) : null,
               'is_primary' => $this->is_primary,
               'created_at' => $this->created_at,
               'updated_at' => $this->updated_at,
          ];
     }
}
