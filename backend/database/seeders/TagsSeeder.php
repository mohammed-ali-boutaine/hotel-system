<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'Luxury', 'icon_path' => 'icons/luxury.png'],
            ['name' => 'Budget', 'icon_path' => 'icons/budget.png'],
            ['name' => 'Family', 'icon_path' => 'icons/family.png'],
            ['name' => 'Romantic', 'icon_path' => 'icons/romantic.png'],
            ['name' => 'Business', 'icon_path' => 'icons/business.png'],
        ];

        foreach ($tags as $tag) {
            DB::table('tags')->insert([
                'name' => $tag['name'],
                'icon_path' => $tag['icon_path'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
