# Air Booking Frontend

A modern web application for flight booking and management built with React and TypeScript.

## 🚀 Technologies & Packages

### Core Technologies

- **React 19** - UI Framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI (MUI)** - Component library
- **Zustand** - State management
- **React Router DOM** - Client-side routing

### Key Dependencies

- **Axios** - HTTP client for API requests
- **React Leaflet** - Interactive maps integration
- **Recharts** - Data visualization
- **React Slick** - Carousel/slider components
- **React Toastify** - Toast notifications
- **Date-fns** - Date manipulation
- **Lucide React** - Icon library

## 📁 Project Structure

```bash
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components
├── constants/      # Application constants
├── layouts/        # Layout components
├── pages/         # Page components
├── routes/        # Route configurations
├── store/         # State management (Zustand)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🔐 Authentication Flow

1. **Login/Register**

   - JWT token received from backend
   - Token stored in localStorage
   - Axios interceptors configured for Authorization header

2. **Session Management**

   - Token validation on app load
   - User data fetched via `/api/me` endpoint
   - Automatic session handling

3. **Logout**
   - Token removal
   - User state clearing
   - Redirect to login

## 🛠️ Development

### Prerequisites

- Node.js (Latest LTS version)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Material-UI components for consistent design
- Custom theme configuration
- Responsive design support

## 📊 State Management

- Zustand for global state management
- React Query for server state
- Local state with React hooks

## 🗺️ Features

- User authentication
- Flight search and booking
- Interactive maps
- Data visualization
- Responsive design
- Toast notifications
- Carousel/slider components

## 🔒 Security

- JWT-based authentication
- Secure token storage
- Protected routes
- API request interceptors
