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
        // pivot table
        Schema::create('hotel_tag', function (Blueprint $table) {
            $table->foreignId('hotel_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('tag_id')
                ->constrained()
                ->onDelete('cascade');
            $table->primary(['hotel_id', 'tag_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_tag');
    }
};
