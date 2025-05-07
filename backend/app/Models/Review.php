<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',  // This is the foreign key to hotels table
        'user_id',
        'rating',
        'comment',
        // other fields...
    ];

    /**
     * Get the hotel that this review belongs to.
     */
    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id');
    }

    /**
     * Get the user that wrote this review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
