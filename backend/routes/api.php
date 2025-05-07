<?php

// use App\Mail\TestEmail;
// use Illuminate\Http\Request;

// use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
// use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\TagController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\JWTAuthController;
// use App\Http\Controllers\SocialAuthController;
use App\Http\Middleware\IsAuth;
use App\Models\User;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\BookingController;

// ------------------------------------------------
// Auth 
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);

// Auth
Route::middleware([IsAuth::class])->group(function () {
    Route::get('me', [JWTAuthController::class, 'getUser']);
    Route::post('logout', [JWTAuthController::class, 'logout']);
    Route::patch('me', [JWTAuthController::class, 'patchUser']); // Add patch route for partial updates

    // Admin routes
    Route::middleware(['admin'])->group(function () {
        Route::get('/admin/bookings', [BookingController::class, 'getAllBookings']);
        Route::get('/admin/hotels', [HotelController::class, 'adminHotels']);
        Route::get('/admin/rooms', [RoomController::class, 'adminRooms']);
        Route::get('/admin/users', [JWTAuthController::class, 'getAllUsers']);

        // New admin route for deleting hotels
        Route::delete('/admin/hotels/{id}', [HotelController::class, 'adminDeleteHotel']);

        // New admin route for deleting rooms
        Route::delete('/admin/rooms/{id}', [RoomController::class, 'adminDeleteRoom']);

        // New admin route for deleting users
        Route::delete('/admin/users/{id}', [JWTAuthController::class, 'adminDeleteUser']);
    });

    // Wishlist routes
    Route::post('/hotels/{hotelId}/wishlist', [WishlistController::class, 'toggleWishlist']);
    Route::get('/wishlist', [WishlistController::class, 'getWishlist']);

    // Room image upload & owner-specific endpoints
    Route::post('/rooms/{roomId}/images', [RoomController::class, 'uploadImage']);
    Route::get('/owner/rooms', [RoomController::class, 'ownerRooms']);
    // Route::get('/admin/rooms', [RoomController::class, 'adminRooms']);
    Route::get('/owner/statistics', [RoomController::class, 'ownerStatistics']);

    // Owner bookings
    Route::get('/owner/bookings', [RoomController::class, 'ownerBookings']);

    // Hotel bookings
    Route::get('/hotels/{hotelId}/bookings', [RoomController::class, 'hotelBookings']);

    // Booking routes
    Route::get('/bookings', [BookingController::class, 'getBookings']);
    Route::get('/bookings/{bookingId}', [BookingController::class, 'getBookingDetails']);
    Route::patch('/bookings/{bookingId}/status', [BookingController::class, 'updateBookingStatus']);
    Route::post('/bookings/{bookingId}/cancel', [BookingController::class, 'cancelBooking']);
    Route::post('/bookings', [BookingController::class, 'createBooking']);
});

// testing
Route::get('users', function () {

    $users = User::all();
    return response()->json([
        'users' => $users
    ]);
});

// --------------------------------------------------------------------------
// ------  Tags

// public routes (guest)
Route::get("/tags", [TagController::class, "index"]);
Route::get("/tags/search/{name}", [TagController::class, "search"]);

// for admin
Route::get("/tags/{id}", [TagController::class, "show"]);
Route::post("/tags", [TagController::class, "store"]);
Route::put("/tags/{id}", [TagController::class, "update"]);
Route::delete("/tags/{id}", [TagController::class, "destroy"]);
// --------------------------------------------------------------------------
//------------ hotel stuuff

// Public routes

Route::get("/homePageHotels", [HotelController::class, "homePageHotels"]);

Route::get('/owner/hotels/{id?}', [HotelController::class, 'ownerHotels']);


Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);
Route::get('/hotels/search/{term}', [HotelController::class, 'search']);


// Authenticated routes
Route::middleware([IsAuth::class])->group(function () {
    Route::post('/hotels', [HotelController::class, 'store']);
    Route::put('/hotels/{hotel}', [HotelController::class, 'update']);
    Route::delete('/hotels/{hotel}', [HotelController::class, 'destroy']);

    // Hotels owned by the authenticated owner
    Route::get('/owner/hotels', [HotelController::class, 'ownerHotels']);
});

// Room routes


Route::get('/hotels/{hotelId}/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);
Route::post('/hotels/{hotelId}/rooms', [RoomController::class, 'store']);
Route::put('/rooms/{id}', [RoomController::class, 'update']);
Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

// New room routes
Route::get('/rooms/{id}/availability', [RoomController::class, 'checkAvailability']);
Route::get('/rooms/search', [RoomController::class, 'search']);
