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
        Schema::table('bookings', function (Blueprint $table) {
            $table->text('special_requests')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->foreignId('last_modified_by')->nullable()->constrained('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('special_requests');
            $table->dropColumn('cancellation_reason');
            $table->dropForeign(['last_modified_by']);
            $table->dropColumn('last_modified_by');
        });
    }
};
