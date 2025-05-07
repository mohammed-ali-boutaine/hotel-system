<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Http\Resources\BookingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function createBooking(Request $request)
    {
        $user = Auth::user();

        // Ensure the user is a client
        if ($user->role !== 'client') {
            return response()->json(['message' => 'Only clients can create bookings'], 403);
        }

        // Validation rules
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'number_of_guests' => 'required|integer|min:1',
            'special_requests' => 'nullable|string|max:500',
        ]);

        $room = Room::with('hotel')->findOrFail($validated['room_id']);

        // Check if capacity is null
        if (is_null($room->capacity)) {
            return response()->json([
                'message' => 'Room capacity information is missing',
                'room' => [
                    'id' => $room->id,
                    'name' => $room->name,
                    'capacity' => null
                ]
            ], 400);
        }

        // Check room availability
        if (!$this->isRoomAvailable($room->id, $validated['check_in'], $validated['check_out'])) {
            return response()->json([
                'message' => 'Room is not available for the selected dates',
                'room' => [
                    'id' => $room->id,
                    'name' => $room->name
                ],
                'dates' => [
                    'check_in' => $validated['check_in'],
                    'check_out' => $validated['check_out']
                ]
            ], 400);
        }

        // Validate number of guests
        if ($validated['number_of_guests'] > $room->capacity) {
            return response()->json([
                'message' => 'Number of guests exceeds room capacity',
                'room' => [
                    'id' => $room->id,
                    'name' => $room->name,
                    'capacity' => $room->capacity
                ],
                'requested_guests' => $validated['number_of_guests']
            ], 400);
        }

        // Calculate total price
        $days = (new \DateTime($validated['check_out']))->diff(new \DateTime($validated['check_in']))->days;
        $totalPrice = $days * $room->price_per_night;

        $booking = Booking::create([
            'room_id' => $validated['room_id'],
            'client_id' => $user->id,
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'number_of_guests' => $validated['number_of_guests'],
            'total_price' => $totalPrice,
            'status' => 'pending',
            'special_requests' => $request->special_requests,
            'last_modified_by' => $user->id
        ]);

        return new BookingResource($booking->load(['room.hotel', 'room.images']));
    }

    public function getBookings(Request $request)
    {
        $user = Auth::user();

        // Ensure the user is a client
        if ($user->role !== 'client') {
            return response()->json(['message' => 'Only clients can view their bookings'], 403);
        }

        $query = Booking::where('client_id', $user->id)
            ->with(['room.hotel', 'room.images']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->where('check_in', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('check_out', '<=', $request->to_date);
        }

        // Get booking history with different statuses
        $upcomingBookings = (clone $query)->upcoming()->get();
        $activeBookings = (clone $query)->active()->get();
        $pastBookings = (clone $query)->past()->get();
        $cancelledBookings = (clone $query)->cancelled()->get();

        return response()->json([
            'upcoming' => BookingResource::collection($upcomingBookings),
            'active' => BookingResource::collection($activeBookings),
            'past' => BookingResource::collection($pastBookings),
            'cancelled' => BookingResource::collection($cancelledBookings)
        ]);
    }

    public function getBookingDetails($bookingId)
    {
        $booking = Booking::with(['room.hotel', 'room.images', 'client'])
            ->findOrFail($bookingId);

        // Check authorization
        if (
            $booking->client_id !== Auth::id() &&
            $booking->room->hotel->owner_id !== Auth::id()
        ) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new BookingResource($booking);
    }

    public function updateBookingStatus(Request $request, $bookingId)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'cancellation_reason' => 'required_if:status,cancelled|string|max:500'
        ]);

        $booking = Booking::findOrFail($bookingId);
        $user = Auth::user();

        // Check authorization
        if (
            $booking->client_id !== $user->id &&
            $booking->room->hotel->owner_id !== $user->id
        ) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Additional validation for cancellation
        if ($validated['status'] === 'cancelled' && !$booking->canBeCancelled()) {
            return response()->json(['message' => 'Booking cannot be cancelled within 24 hours of check-in'], 400);
        }

        $booking->update([
            'status' => $validated['status'],
            'cancellation_reason' => $validated['status'] === 'cancelled' ? $validated['cancellation_reason'] : null,
            'last_modified_by' => $user->id
        ]);

        return new BookingResource($booking);
    }

    public function cancelBooking(Request $request, $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);
        $user = Auth::user();

        if ($booking->client_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$booking->canBeCancelled()) {
            return response()->json(['message' => 'Booking cannot be cancelled within 24 hours of check-in'], 400);
        }

        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:500'
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['cancellation_reason'],
            'last_modified_by' => $user->id
        ]);

        return new BookingResource($booking);
    }

    private function isRoomAvailable($roomId, $checkIn, $checkOut)
    {
        return !Booking::where('room_id', $roomId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut])
                    ->orWhereBetween('check_out', [$checkIn, $checkOut]);
            })
            ->exists();
    }

    /**
     * Get all bookings (admin only)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllBookings()
    {
        $bookings = Booking::with(['client', 'room.hotel'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'bookings' => $bookings
        ]);
    }
}
