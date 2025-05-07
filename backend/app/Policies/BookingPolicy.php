<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
     public function view(User $user, Booking $booking)
     {
          return $user->id === $booking->user_id ||
               $user->role === 'admin' ||
               $user->id === $booking->room->hotel->owner_id;
     }

     public function create(User $user)
     {
          return $user->role === 'client';
     }

     public function update(User $user, Booking $booking)
     {
          return $user->id === $booking->user_id ||
               $user->role === 'admin';
     }

     public function delete(User $user, Booking $booking)
     {
          return $user->id === $booking->user_id ||
               $user->role === 'admin';
     }
}
