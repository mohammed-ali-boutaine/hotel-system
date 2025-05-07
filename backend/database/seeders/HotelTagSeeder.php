<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class HotelTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hotelTags = [
            ['hotel_id' => 1, 'tag_id' => 1], // Luxury Hotel - Luxury Tag
            ['hotel_id' => 1, 'tag_id' => 2], // Luxury Hotel - Budget Tag
            ['hotel_id' => 2, 'tag_id' => 2], // Budget Inn - Budget Tag
            ['hotel_id' => 3, 'tag_id' => 3], // Family Resort - Family Tag
            ['hotel_id' => 3, 'tag_id' => 4], // Family Resort - Romantic Tag
        ];

        foreach ($hotelTags as $hotelTag) {
            DB::table('hotel_tag')->insert([
                'hotel_id' => $hotelTag['hotel_id'],
                'tag_id' => $hotelTag['tag_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
