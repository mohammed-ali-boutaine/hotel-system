<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

class HotelFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Hotel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Hotel',
            'description' => $this->faker->paragraph(3),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'country' => $this->faker->country(),
            'profile_path' => 'hotels/profiles/default-profile.jpg',
            'cover_path' => 'hotels/covers/default-cover.jpg',
            'coordinate' => json_encode([
                'lat' => $this->faker->latitude(),
                'lng' => $this->faker->longitude(),
            ]),
            'owner_id' => User::factory(),
        ];
    }
}
