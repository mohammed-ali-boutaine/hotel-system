<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            'cancellation_reason' => $this->cancellation_reason,
            'check_in' => $this->check_in->format('Y-m-d'),
            'check_out' => $this->check_out->format('Y-m-d'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'duration_days' => $this->getDurationInDays(),
            'number_of_guests' => $this->number_of_guests,
            'room' => [
                'amenities' => $this->room->amenities ?? [],
                'capacity' => $this->room->capacity,
                'hotel' => [
                    'id' => $this->room->hotel->id,
                    'name' => $this->room->hotel->name,
                    'address' => $this->room->hotel->address,
                    'city' => $this->room->hotel->city,
                    'country' => $this->room->hotel->country,
                    'phone' => $this->room->hotel->phone,
                    'email' => $this->room->hotel->email
                ],
                'id' => $this->room->id,
                'images' => $this->room->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                        'is_primary' => $image->is_primary
                    ];
                })->toArray(),
                'name' => $this->room->name,
                'price_per_night' => $this->room->price_per_night,
                'type' => $this->room->type
            ],
            'special_requests' => $this->special_requests,
            'status' => $this->status,
            'total_price' => $this->total_price,
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s')
        ];
    }
}
