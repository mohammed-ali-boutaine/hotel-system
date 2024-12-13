
# Hotel Management Web App

## Guest User Stories

### 1. Search for Hotels
- As a guest, I want to search for hotels by location, date, and price range, so that I can find available options that fit my needs.

### 2. View Hotel Details
- As a guest, I want to view detailed information about a hotel (e.g., amenities, room types, location), so that I can decide if it's the right choice for me.

### 3. View Room Availability
- As a guest, I want to see the availability of rooms for my selected dates, so that I can plan my stay accordingly.

### 4. View Room Details
- As a guest, I want to view details of available rooms, including pictures, descriptions, and prices, so that I can choose the room that best suits my needs.

### 5. Book a Room
- As a guest, I want to reserve a room by selecting my check-in and check-out dates, so that I can secure my stay at the hotel.

### 6. Make a Payment (not sure about it)
- As a guest, I want to pay for my reservation online securely, so that I can complete the booking process.

### 7. View Hotel on Map
- As a guest, I want to see the hotel's location on a map, so that I can plan my travel and navigation to the hotel.

### 8. View Reservation History
- As a guest, I want to view my past reservations, so that I can keep track of my bookings.

### 9. Update or Cancel a Reservation
- As a guest, I want to be able to update or cancel my reservation if my plans change.

## Admin User Stories

### 1. Add/Remove/Edit Hotels
- As an admin, I want to add, remove, or update hotel details (e.g., name, description, amenities, contact info), so that I can manage the hotels listed on the platform.

### 2. Add/Remove/Edit Rooms
- As an admin, I want to add, remove, or update room details (e.g., room type, availability, price), so that I can manage the rooms available for booking.

### 3. Manage Reservations
- As an admin, I want to view and manage all reservations made by guests, so that I can ensure everything is organized and properly accounted for.

### 4. View Room Availability
- As an admin, I want to see room availability for a specific date, so that I can avoid overbooking.

### 5. Upload and Manage Room Images
- As an admin, I want to upload and manage images for rooms and hotels, so that guests can view accurate and high-quality visuals.

### 6. Generate Reports (not sure about it)
- As an admin, I want to generate reports on hotel occupancy, reservations, and revenue, so that I can track the hotel's performance and make data-driven decisions.

### 7. Manage User Accounts
- As an admin, I want to manage user accounts, including guests, so that I can handle registration, login issues, and user data securely.

### 8. Send Notifications to Guests (not sure about it)
- As an admin, I want to send notifications or reminders to guests about their reservations, so that they are aware of their booking details.



### Backend (Laravel + MySQL):
- Set up the database: Use MySQL to store hotel data, such as hotel details, rooms, pictures, reservations, etc.
- Database Tables: Create tables for:
	- Hotels (name, description, location, contact info, etc.)
	- Rooms (room number, type, price, availability, hotel_id)
	- Reservations (user_id, room_id, check-in date, check-out date, etc.)
	- Room images (for storing the URLs of room pictures)
- API Endpoints: Use Laravel to build RESTful API endpoints for:
	- Listing hotels and rooms
	- Viewing room details (including pictures)
	- Making reservations
- Map Integration: Use the Google Maps API to display hotel locations on the map. You can store the latitude and longitude in your database for each hotel.



### 2. Frontend (React+ TypeScript) redux for stat mangement , gsap for animation

- React Components:
	- Hotel List Page
	- Hotel Detail Page
	- Reservation Form
	- Landing Page
	- login / register
- Google Maps: Integrate the Google Maps API in your React app to show the hotel location on the map and provide directions.

### Authentication:
- User Authentication: Implement login, registration, and user management using Laravel's built-in authentication or packages like Laravel Passport for API authentication.
- Reservation History: Allow users to view their past reservations and manage bookings.
### Admin Panel:
Hotel Management: Allow admins to add, edit, and delete hotel listings and rooms, upload images, and manage reservations.

