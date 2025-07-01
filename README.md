# 📅 DanEvents - Event Booking Platform

A full-stack event booking platform built with React and Node.js. Features include user authentication, event management, booking system, user profiles, advanced filtering, and responsive UI.

## 🎯 Project Overview

- **Frontend Repository**: Current repository
- **Backend Repository**: [DanEvent Backend](https://github.com/Daniel-Sameh/DanEvent)
- **Live Demo**: [https://dan-events.vercel.app/](https://dan-events.vercel.app/)

## 🔑 Key Features

### User Management
- **User Authentication**: Secure login and registration with JWT
- **User Profiles**: Comprehensive profile management with image upload
- **Profile Customization**: Edit personal information, change password
- **Account Management**: Delete account functionality with confirmation
- **Booking History**: View all booked events in user profile
- **Admin Features**: Special admin dashboard and elevated permissions

### Event System
- **Event Discovery**: Browse, search, and filter events
- **Advanced Filtering**: Filter by category, date range, booking status
- **Sorting Options**: Sort events by date (ascending/descending)
- **Event Details**: View comprehensive event information
- **Event Bookings**: Book events with seat availability checking
- **Creative Filter UI**: Slide-in filter panel with interactive animations

### UI/UX
- **Responsive Design**: Mobile-first approach for all devices
- **Dark/Light Theme**: Theme switching with system preference detection
- **Interactive Components**: Modals, tooltips, and context menus
- **Form Validation**: Client-side validation with helpful error messages
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Clear loading indicators throughout the application
<!-- - **Slide-in Filters**: Animated filter panel with hover interaction effects -->
- **Tabbed Interfaces**: View bookings in grid or list format

## 🏗️ Architecture

### Frontend (Current Repository)

- Built with Vite + React
- TypeScript for type safety
- Tailwind CSS with shadcn/ui components
- Context API for state management with caching
- React Router for navigation
- Axios for API communication

### Backend

- Node.js + Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Redis for caching frequently read data
- Cloudinary for image storage

### Deployment

- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas Cloud
- Image Storage: Cloudinary

<!-- ## 🤖 AI Integration

The project incorporates AI tools as part of the development process:

1. **Lovable.dev**
   - AI-powered development assistant
   - Contributed code through automated commits
   - Helped with component development and code optimization

2. **GitHub Copilot (Claude 3.5 Sonnet)**
   - Assisted with code completion and Debugging
   - Generated documentation
   - Helped with type definitions and interfaces -->

## 📁 Frontend Project Structure

```
src/
├── components/
│   ├── admin/         # Admin dashboard components
│   │   ├── EventForm.tsx     # Admin event creation/editing form
│   │   ├── EventsTable.tsx   # Admin event management table
│   │   └── UsersTable.tsx    # Admin user management table
│   ├── auth/          # Authentication components
│   │   ├── LoginForm.tsx     # User login form
│   │   ├── ProtectedRoute.tsx # Route protection for authenticated users
│   │   └── RegisterForm.tsx  # User registration form
│   ├── events/        # Event-related components
│   │   ├── EventCard.tsx     # Event card component with booking status
│   │   ├── EventGrid.tsx     # Grid layout for event cards
│   │   └── FilterBox.tsx     # Advanced event filtering component
│   ├── layout/        # Layout components
│   │   ├── Footer.tsx        # Site footer
│   │   ├── Header.tsx        # Site header with navigation
│   │   └── Layout.tsx        # Main layout wrapper
│   ├── theme/         # Theme components
│   │   ├── ThemeProvider.tsx # Theme context provider
│   │   └── ThemeToggle.tsx   # Theme switch component
│   └── ui/            # Reusable UI components (shadcn/ui)
├── contexts/          # React Context providers
│   ├── AuthContext.tsx       # Authentication state and user management
│   └── EventContext.tsx      # Event state with caching and filtering
├── hooks/             # Custom React hooks
│   ├── use-mobile.tsx        # Mobile detection hook
│   └── use-toast.ts          # Toast notification hook
├── lib/               # Utility functions and configurations
│   ├── axios.ts              # Axios instance with interceptors
│   └── utils.ts              # General utility functions
├── pages/             # Page components
│   ├── AdminPage.tsx         # Admin dashboard page
│   ├── EventDetailsPage.tsx  # Event details page with booking
│   ├── HomePage.tsx          # Home page with event listings
│   ├── Index.tsx             # Root page component
│   ├── LoginPage.tsx         # Login page
│   ├── NotFound.tsx          # 404 page
│   ├── RegisterPage.tsx      # Registration page
│   └── UserPage.tsx          # User profile management page
├── services/          # API service layer
│   └── api.ts                # API endpoint definitions
└── types/             # TypeScript type definitions
    └── index.ts              # Shared type definitions
```

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- shadcn/ui for UI components
- React Router v6 for routing
- Axios for HTTP requests
- React Context for state management
- React Hook Form for form handling
- Zod for schema validation
- Cloudinary for image management
- date-fns for date manipulation
- Lucide React for icons
- Framer Motion for animations
- Sonner for toast notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary SDK for image storage
- Express Validator
- CORS middleware

## 🎯 Key Technical Decisions

1. **TypeScript Implementation**
   - Enhanced type safety
   - Better developer experience
   - Improved code maintainability

2. **Monolithic Architecture**
   - Simplified development and deployment
   - Easier to maintain for smaller teams
   - Cost-effective hosting

3. **Context API with Caching**
   - Efficient state management with event caching
   - TTL-based cache invalidation for data freshness
   - Optimized API calls and better performance

4. **Component-Based Design**
   - Modular, reusable components
   - Consistent UI/UX across the application
   - Easier maintenance and feature additions

5. **Advanced Filtering System**
   - Client-side and server-side filtering options
   - Multiple filter criteria (category, date, booking status)
   - Interactive slide-in filter panel with hover effects
   - Responsive filter UI that adapts to device size

6. **User Profile Management**
   - Comprehensive profile editing capabilities
   - Cloudinary integration for image uploads
   - Secure password changing mechanism
   - Responsive display of booked events with grid/list views
   - Account deletion with confirmation dialog

7. **Booking Logic**
   - Optimized booking verification
   - Clear booking status indicators
   - Simplified user experience for event booking

## 🚀 Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd danevent-gatherings

# Install dependencies
npm install

# Start development server
npm run dev
```

## ✏️ How to Edit the Code

### Using your preferred IDE

1. Clone the repository
2. Install dependencies with `npm install`
3. Start development server with `npm run dev`
4. Make changes and see live updates

### Using GitHub Directly

1. Navigate to desired files
2. Click the "Edit" button (pencil icon)
3. Make changes and commit

### Using GitHub Codespaces

1. Click "Code" button on repository
2. Select "Codespaces" tab
3. Click "New codespace"
4. Edit in browser-based VS Code

## 🏗️ Building and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
