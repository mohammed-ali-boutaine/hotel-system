<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample owners if they don't exist
        $owners = User::where('role', 'owner')->take(3)->get();

        if ($owners->isEmpty()) {
            $owners = User::factory()->count(3)->create([
                'role' => 'owner'
            ]);
        }

        $hotelData = [
            [
                'name' => 'Grand Plaza Hotel',
                'address' => '123 Main Street',
                'city' => 'New York',
                'country' => 'USA',
                'description' => 'Luxury hotel in the heart of Manhattan',
                'phone' => '+1-212-555-0123',
                'email' => 'info@grandplaza.com',
                'website' => 'www.grandplaza.com',
                'coordinate' => ['lat' => 40.7128, 'lng' => -74.0060],
            ],
            [
                'name' => 'Seaside Resort & Spa',
                'address' => '789 Beach Road',
                'city' => 'Miami',
                'country' => 'USA',
                'description' => 'Beachfront resort with world-class spa facilities',
                'phone' => '+1-305-555-0789',
                'email' => 'info@seasideresort.com',
                'website' => 'www.seasideresort.com',
                'coordinate' => ['lat' => 25.7617, 'lng' => -80.1918],
            ],
            [
                'name' => 'Mountain View Lodge',
                'address' => '456 Pine Avenue',
                'city' => 'Denver',
                'country' => 'USA',
                'description' => 'Cozy mountain retreat with stunning views',
                'phone' => '+1-303-555-0456',
                'email' => 'info@mountainviewlodge.com',
                'website' => 'www.mountainviewlodge.com',
                'coordinate' => ['lat' => 39.7392, 'lng' => -104.9903],
            ],
        ];

        foreach ($hotelData as $index => $hotel) {
            Hotel::create(array_merge($hotel, [
                'owner_id' => $owners[$index]->id,
                'profile_path' => null, // You can add default images here
                'cover_path' => null,
            ]));
        }
    }
}
