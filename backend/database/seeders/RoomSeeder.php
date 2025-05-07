<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hotels = Hotel::all();

        $roomTypes = [
            'Standard' => [
                'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Heating'],
                'price_range' => [100, 150],
                'capacity' => [2, 2],
                'bed_numbers' => 1
            ],
            'Deluxe' => [
                'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Heating', 'Mini Bar', 'Coffee Maker', 'Balcony'],
                'price_range' => [200, 300],
                'capacity' => [2, 3],
                'bed_numbers' => 2
            ],
            'Suite' => [
                'amenities' => [
                    'WiFi',
                    'TV',
                    'Air Conditioning',
                    'Heating',
                    'Mini Bar',
                    'Coffee Maker',
                    'Balcony',
                    'Ocean View',
                    'Jacuzzi',
                    'Living Room'
                ],
                'price_range' => [400, 600],
                'capacity' => [4, 4],
                'bed_numbers' => 2
            ],
            'Presidential Suite' => [
                'amenities' => [
                    'WiFi',
                    'TV',
                    'Air Conditioning',
                    'Heating',
                    'Mini Bar',
                    'Coffee Maker',
                    'Balcony',
                    'Ocean View',
                    'Jacuzzi',
                    'Private Pool',
                    'Butler Service',
                    'Living Room',
                    'Dining Room'
                ],
                'price_range' => [800, 1200],
                'capacity' => [6, 6],
                'bed_numbers' => 3
            ],
        ];

        foreach ($hotels as $hotel) {
            $floor = 1;

            foreach ($roomTypes as $type => $details) {
                // Create 2-4 rooms of each type per hotel
                $numRooms = rand(2, 4);

                for ($i = 1; $i <= $numRooms; $i++) {
                    $roomNumber = $floor . str_pad($i, 2, '0', STR_PAD_LEFT); // e.g., 101, 102, etc.

                    Room::create([
                        'hotel_id' => $hotel->id,
                        'name' => "$type Room",
                        'room_number' => $roomNumber,
                        'type' => $type,
                        'floor' => $floor,
                        'description' => $this->getDescription($type),
                        'bed_numbers' => $details['bed_numbers'],
                        'capacity' => rand($details['capacity'][0], $details['capacity'][1]),
                        'price_per_night' => rand($details['price_range'][0], $details['price_range'][1]),
                        'is_available' => true,
                        'amenities' => $details['amenities'],
                    ]);
                }

                $floor++;
            }
        }
    }

    private function getDescription(string $type): string
    {
        $descriptions = [
            'Standard' => 'Comfortable and cozy room with essential amenities for a pleasant stay.',
            'Deluxe' => 'Spacious room with modern amenities and a private balcony offering city views.',
            'Suite' => 'Luxurious suite featuring separate living area and premium amenities for an elevated experience.',
            'Presidential Suite' => 'Ultimate luxury accommodation with exclusive amenities, stunning views, and personalized service.',
        ];

        return $descriptions[$type];
    }
}
