<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomImageFactory extends Factory
{
    protected $model = RoomImage::class;

    public function definition()
    {
        return [
            'room_id' => Room::inRandomOrder()->first()->id ?? 1,
            'image_path' => $this->faker->imageUrl(800, 600, 'room'),
        ];
    }
}
