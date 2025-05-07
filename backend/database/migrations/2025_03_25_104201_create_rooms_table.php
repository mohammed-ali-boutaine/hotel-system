<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('hotel_id')->constrained('hotels')->onDelete('cascade');
            $table->string('name');


            $table->string('room_number');
            $table->string('type');
            $table->integer('floor')->nullable();
            $table->boolean('is_available')->default(true);


            $table->text('description')->nullable();
            $table->integer('bed_numbers');
            $table->integer('capacity');
            $table->decimal('price_per_night', 10, 2)->unsigned();
            $table->json('amenities')->nullable();
            $table->index(['hotel_id', 'is_available']);
            $table->index('price_per_night');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
