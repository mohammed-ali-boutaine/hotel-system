# AirBooking Backend

A robust hotel booking system backend built with Laravel, providing a comprehensive API for managing hotels, rooms, bookings, and user interactions.

## Technologies & Packages

### Core Technologies

- PHP 8.2+
- Laravel 12.0
- PostgreSQL (Database)
- JWT Authentication

### Key Packages

- `tymon/jwt-auth`: JWT authentication implementation
- `laravel/socialite`: Social media authentication
- `laravel/tinker`: REPL for Laravel
- `pestphp/pest`: Testing framework
- `laravel/pint`: PHP code style fixer
- `laravel/sail`: Docker development environment

## Project Structure

```text
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Resources/
│   └── Models/
├── config/
├── database/
├── routes/
├── tests/
└── resources/
```

## User Roles & Permissions

### 1. Guest (Unauthenticated)

- View hotels and rooms
- Search hotels and rooms
- View hotel details
- View room availability

### 2. Customer (Authenticated)

- All guest permissions
- Create and manage bookings
- Manage wishlist
- View booking history
- Cancel bookings
- Update profile

### 3. Hotel Owner

- All customer permissions
- Manage owned hotels
- Manage hotel rooms
- Upload room images
- View booking statistics
- View hotel bookings

### 4. Admin

- All permissions
- Manage all hotels
- Manage all rooms
- Manage all users
- Manage tags
- View all bookings
- Delete hotels, rooms, and users

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user
- `PATCH /api/me` - Update user profile

### Hotels

- `GET /api/hotels` - List all hotels
- `GET /api/hotels/{id}` - Get hotel details
- `GET /api/hotels/search/{term}` - Search hotels
- `POST /api/hotels` - Create hotel (Owner)
- `PUT /api/hotels/{hotel}` - Update hotel (Owner)
- `DELETE /api/hotels/{hotel}` - Delete hotel (Owner)

### Rooms

- `GET /api/hotels/{hotelId}/rooms` - List hotel rooms
- `GET /api/rooms/{id}` - Get room details
- `GET /api/rooms/{id}/availability` - Check room availability
- `GET /api/rooms/search` - Search rooms
- `POST /api/hotels/{hotelId}/rooms` - Create room (Owner)
- `PUT /api/rooms/{id}` - Update room (Owner)
- `DELETE /api/rooms/{id}` - Delete room (Owner)

- `GET /api/bookings` - List user bookings
- `GET /api/bookings/{bookingId}` - Get booking details
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/{bookingId}/status` - Update booking status
- `POST /api/bookings/{bookingId}/cancel` - Cancel booking

### Wishlist

- `POST /api/hotels/{hotelId}/wishlist` - Toggle wishlist
- `GET /api/wishlist` - Get user wishlist

### Admin Endpoints

- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/hotels` - List all hotels
- `GET /api/admin/rooms` - List all rooms
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/hotels/{id}` - Delete hotel
- `DELETE /api/admin/rooms/{id}` - Delete room
- `DELETE /api/admin/users/{id}` - Delete user
