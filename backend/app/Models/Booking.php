<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'client_id',
        'check_in',
        'check_out',
        'number_of_guests',
        'total_price',
        'status',
        'special_requests',
        'cancellation_reason',
        'last_modified_by'
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'total_price' => 'decimal:2',
        'number_of_guests' => 'integer',
    ];

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('check_in', '>=', now());
    }

    public function scopePast($query)
    {
        return $query->where('check_out', '<', now());
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'confirmed')
            ->where('check_in', '<=', now())
            ->where('check_out', '>=', now());
    }

    // Relationships
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function lastModifiedBy()
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }

    // Helper methods
    public function isActive()
    {
        return $this->status === 'confirmed' &&
            $this->check_in <= now() &&
            $this->check_out >= now();
    }

    public function canBeCancelled()
    {
        return $this->status !== 'cancelled' &&
            $this->status !== 'completed' &&
            now()->diffInHours($this->check_in) >= 24;
    }

    public function getDurationInDays()
    {
        return $this->check_in->diffInDays($this->check_out);
    }
}
