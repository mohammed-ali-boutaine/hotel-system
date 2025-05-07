<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('room_images', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('room_id')->constrained()->onDelete('cascade'); // Links to Room
            $table->string('image_path'); 
            $table->foreignId('room_id')
            ->constrained('rooms')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->boolean('is_primary')->default(false);


            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('room_images');
    }
};
