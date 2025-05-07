# Air Booking System

A comprehensive hotel and flight booking system with a modern frontend and robust backend.

## 📂 Project Overview

This project consists of two main components:

1. **Frontend**: A React-based web application for user interaction and booking management.
2. **Backend**: A Laravel-based API for managing hotels, rooms, bookings, and user authentication.

---

## 🖥️ Frontend

### Technologies

- **React 19** - UI Framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI (MUI)** - Component library
- **Zustand** - State management
- **React Router DOM** - Client-side routing

### Features

- User authentication
- Flight search and booking
- Interactive maps
- Data visualization
- Responsive design
- Toast notifications
- Carousel/slider components

### Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

For more details, refer to the [Frontend Documentation](./frontend/README.md).

---

## 🛠️ Backend

### Technologies

- **PHP 8.2+**
- **Laravel 12.0**
- **PostgreSQL** - Database
- **JWT Authentication**

### Features

- Role-based access control (Guest, Customer, Hotel Owner, Admin)
- Hotel and room management
- Booking system
- Wishlist functionality
- Secure API endpoints

### Development

1. Install dependencies:
   ```bash
   composer install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Run migrations:
   ```bash
   php artisan migrate
   ```
4. Start the development server:
   ```bash
   php artisan serve
   ```

For more details, refer to the [Backend Documentation](./backend/README.md).

---

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Input validation
- SQL injection prevention
- XSS and CSRF protection

---


## 📜 License

This project is licensed under the MIT License.
