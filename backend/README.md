# AirBooking Backend

A robust hotel booking system backend built with Laravel, providing a comprehensive API for managing hotels, rooms, bookings, and user interactions.

## Technologies & Packages

### Core Technologies

-   PHP 8.2+
-   Laravel 12.0
-   MySQL/PostgreSQL (Database)
-   JWT Authentication

### Key Packages

-   `tymon/jwt-auth`: JWT authentication implementation
-   `laravel/socialite`: Social media authentication
-   `laravel/tinker`: REPL for Laravel
-   `pestphp/pest`: Testing framework
-   `laravel/pint`: PHP code style fixer
-   `laravel/sail`: Docker development environment

## Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Resources/
│   ├── Models/
│   └── Services/
├── config/
├── database/
├── routes/
├── tests/
└── resources/
```

## User Roles & Permissions

### 1. Guest (Unauthenticated)

-   View hotels and rooms
-   Search hotels and rooms
-   View hotel details
-   View room availability

### 2. Customer (Authenticated)

-   All guest permissions
-   Create and manage bookings
-   Manage wishlist
-   View booking history
-   Cancel bookings
-   Update profile

### 3. Hotel Owner

-   All customer permissions
-   Manage owned hotels
-   Manage hotel rooms
-   Upload room images
-   View booking statistics
-   View hotel bookings

### 4. Admin

-   All permissions
-   Manage all hotels
-   Manage all rooms
-   Manage all users
-   Manage tags
-   View all bookings
-   Delete hotels, rooms, and users

## API Endpoints

### Authentication

-   `POST /api/register` - Register new user
-   `POST /api/login` - User login
-   `POST /api/logout` - User logout
-   `GET /api/me` - Get current user
-   `PATCH /api/me` - Update user profile

### Hotels

-   `GET /api/hotels` - List all hotels
-   `GET /api/hotels/{id}` - Get hotel details
-   `GET /api/hotels/search/{term}` - Search hotels
-   `POST /api/hotels` - Create hotel (Owner)
-   `PUT /api/hotels/{hotel}` - Update hotel (Owner)
-   `DELETE /api/hotels/{hotel}` - Delete hotel (Owner)

### Rooms

-   `GET /api/hotels/{hotelId}/rooms` - List hotel rooms
-   `GET /api/rooms/{id}` - Get room details
-   `GET /api/rooms/{id}/availability` - Check room availability
-   `GET /api/rooms/search` - Search rooms
-   `POST /api/hotels/{hotelId}/rooms` - Create room (Owner)
-   `PUT /api/rooms/{id}` - Update room (Owner)
-   `DELETE /api/rooms/{id}` - Delete room (Owner)

### Bookings

-   `GET /api/bookings` - List user bookings
-   `GET /api/bookings/{bookingId}` - Get booking details
-   `POST /api/bookings` - Create booking
-   `PATCH /api/bookings/{bookingId}/status` - Update booking status
-   `POST /api/bookings/{bookingId}/cancel` - Cancel booking

### Wishlist

-   `POST /api/hotels/{hotelId}/wishlist` - Toggle wishlist
-   `GET /api/wishlist` - Get user wishlist

### Admin Endpoints

-   `GET /api/admin/bookings` - List all bookings
-   `GET /api/admin/hotels` - List all hotels
-   `GET /api/admin/rooms` - List all rooms
-   `GET /api/admin/users` - List all users
-   `DELETE /api/admin/hotels/{id}` - Delete hotel
-   `DELETE /api/admin/rooms/{id}` - Delete room
-   `DELETE /api/admin/users/{id}` - Delete user

## Setup & Installation

1. Clone the repository
2. Install dependencies:
    ```bash
    composer install
    ```
3. Copy environment file:
    ```bash
    cp .env.example .env
    ```
4. Generate application key:
    ```bash
    php artisan key:generate
    ```
5. Configure database in `.env`
6. Run migrations:
    ```bash
    php artisan migrate
    ```
7. Start the development server:
    ```bash
    php artisan serve
    ```

## Testing

Run tests using Pest:

```bash
./vendor/bin/pest
```

## Development

The project includes a development script that runs multiple services concurrently:

```bash
composer run dev
```

This will start:

-   Laravel development server
-   Queue worker
-   Vite development server

## Security

-   JWT-based authentication
-   Role-based access control
-   Input validation
-   SQL injection prevention
-   XSS protection
-   CSRF protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
