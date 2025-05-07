<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{

    use HasFactory;
    /*
    
    Basic: WiFi, TV, Air Conditioning, Heating

    Comfort: Mini Bar, Coffee Maker, Balcony, Ocean View

    Luxury: Jacuzzi, Private Pool, Butler Service
    
    */
    protected $fillable = [
        'hotel_id',
        'room_number',
        'type',
        'name',
        'floor',
        'description',
        'bed_numbers',
        'price_per_night',
        'is_available',
        'amenities',
        'capacity',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'amenities' => 'array',
        'price_per_night' => 'decimal:2',
        'capacity' => 'integer',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function images()
    {
        return $this->hasMany(RoomImage::class);
    }

    public function booking()
    {
        return $this->hasMany(Booking::class);
    }
    public function primaryImage()
    {
        return $this->hasOne(RoomImage::class)->where('is_primary', true);
    }
    public function isAvailable()
    {
        // Check if room is marked as available and has no active bookings
        if (!$this->is_available) {
            return false;
        }

        // Check for any overlapping bookings
        $currentBooking = $this->booking()
            ->where(function ($query) {
                $query->where('check_in', '<=', now())
                    ->where('check_out', '>=', now());
            })
            ->exists();

        return !$currentBooking;
    }

    /**
     * Check if room is available for specific dates
     */
    public function isAvailableForDates($checkIn, $checkOut)
    {
        if (!$this->is_available) {
            return false;
        }

        return !$this->booking()
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut])
                    ->orWhereBetween('check_out', [$checkIn, $checkOut])
                    ->orWhere(function ($q) use ($checkIn, $checkOut) {
                        $q->where('check_in', '<=', $checkIn)
                            ->where('check_out', '>=', $checkOut);
                    });
            })
            ->exists();
    }

    /**
     * Get room's current price with any active discounts
     */
    public function getCurrentPrice()
    {
        // You can implement seasonal pricing or discount logic here
        return $this->price_per_night;
    }

    /**
     * Get room's amenities as a formatted string
     */
    public function getAmenitiesList()
    {
        return implode(', ', $this->amenities ?? []);
    }

    /**
     * Check if room has specific amenities
     */
    public function hasAmenity($amenity)
    {
        return in_array($amenity, $this->amenities ?? []);
    }

    /**
     * Get room's occupancy status
     */
    public function getOccupancyStatus()
    {
        if (!$this->is_available) {
            return 'Unavailable';
        }

        $currentBooking = $this->booking()
            ->where('check_in', '<=', now())
            ->where('check_out', '>=', now())
            ->first();

        return $currentBooking ? 'Occupied' : 'Available';
    }

    /**
     * Scope a query to only include available rooms
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope a query to filter rooms by price range
     */
    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price_per_night', [$min, $max]);
    }

    /**
     * Scope a query to filter rooms by amenities
     */
    public function scopeWithAmenities($query, array $amenities)
    {
        return $query->whereJsonContains('amenities', $amenities);
    }

    /**
     * Scope a query to filter rooms by guest capacity.
     */
    public function scopeWithCapacity($query, $capacity)
    {
        return $query->where('capacity', '>=', $capacity);
    }

    /**
     * Get the maximum number of guests allowed in the room
     */
    public function getMaxGuestsAttribute()
    {
        return $this->capacity;
    }
}
