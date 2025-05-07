<?php

namespace App\Models;

use App\Models\Tag;
use Faker\Core\Coordinates;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Hotel extends Model
{
    use HasFactory;

    protected $table = 'hotels';

    protected $fillable = [
        'name',
        'address',
        'city',
        'country',


        'description',
        'phone',
        'email',
        'website',


        'profile_path',
        'cover_path',

        'coordinate',

        'owner_id',

    ];

    // add cats

    protected $casts = [
        'coordinate' => 'array',
    ];

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Get the reviews for the hotel.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function wishedBy()
    {
        return $this->belongsToMany(User::class, 'wishlists', 'hotel_id', 'user_id')
            ->withTimestamps();
    }
}
