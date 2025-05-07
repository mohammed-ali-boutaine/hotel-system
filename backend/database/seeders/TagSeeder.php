<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
     /**
      * Run the database seeds.
      */
     public function run(): void
     {
          // Common hotel amenities and features as tags
          $tags = [
               'Free WiFi',
               'Swimming Pool',
               'Spa',
               'Fitness Center',
               'Restaurant',
               'Bar',
               'Room Service',
               'Parking',
               'Pet Friendly',
               'Business Center',
               'Conference Room',
               'Beach Access',
               'Mountain View',
               'Family Friendly',
               'Luxury',
               'Budget',
               'Boutique',
               'Historic',
               'Central Location',
               'Airport Shuttle'
          ];

          foreach ($tags as $tagName) {
               // Create a meaningful icon name based on the tag name
               $iconName = Str::slug($tagName) . '.ico';

               Tag::create([
                    'name' => $tagName,
                    'icon_path' => $iconName
               ]);

               $this->command->info("Created tag: {$tagName}");
          }
     }
}
