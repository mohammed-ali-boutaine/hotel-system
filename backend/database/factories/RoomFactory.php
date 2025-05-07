<?php

namespace Database\Factories;
use App\Models\Room;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    protected $model = Room::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'owner_id' => User::factory(), // Creates a new user for the owner
            'hotel_id' => $this->faker->randomElement([1, 2]), // Assigns hotel_id as 1 or 2
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'bed_numbers' => $this->faker->numberBetween(1, 5),
            'capacity' => $this->faker->numberBetween(1, 10),
            'price_per_night' => $this->faker->randomFloat(2, 50, 500),
            'is_available' => $this->faker->boolean(),
            'amenities' => json_encode($this->faker->randomElements(['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'], 2)),
        ];
    }
}
