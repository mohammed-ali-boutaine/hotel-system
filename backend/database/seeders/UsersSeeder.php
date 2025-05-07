<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Owner;
use App\Models\Client;
use Illuminate\Database\Seeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a specific client, owner , admin
        $client = new Client([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password')
        ]);
        $client->save();
        $owner = new Owner([
            'name' => 'Hotel Owner',
            'email' => 'owner@example.com',
            'password' => bcrypt('password')
        ]);
        $owner->save();
        $admin = new Admin([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password')
        ]);
        $admin->save();


        // Generate additional clients
        Client::factory()->count(10)->create();

        // Generate additional hotel owners
        Owner::factory()->count(5)->create();
    }
}
