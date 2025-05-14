# 📅 DanEvents - Event Booking Platform

A full-stack event booking platform built with React and Node.js, leveraging AI-assisted development tools.

## 🎯 Project Overview

- **Frontend Repository**: Current repository
- **Backend Repository**: [DanEvent Backend](https://github.com/Daniel-Sameh/DanEvent)
- **Live Demo**: [https://lovable.dev/projects/e3837c82-d010-453a-9a51-f1968cf75309](https://lovable.dev/projects/e3837c82-d010-453a-9a51-f1968cf75309)

## 🏗️ Architecture

### Frontend (Current Repository)

- Built with Vite + React
- TypeScript for type safety
- Tailwind CSS with shadcn/ui components
- Context API for state management
- React Router for navigation
- Axios for API communication

### Backend

- Node.js + Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Cloudinary for image storage
- RESTful API architecture

### Deployment

- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas Cloud
- Image Storage: Cloudinary

## 🤖 AI Integration

The project incorporates AI tools as part of the development process:

1. **Lovable.dev**
   - AI-powered development assistant
   - Contributed code through automated commits
   - Helped with component development and code optimization

2. **GitHub Copilot (Claude 3.5 Sonnet)**
   - Assisted with code completion and Debugging
   - Generated documentation
   - Helped with type definitions and interfaces

## 📁 Frontend Project Structure

```
src/
├── components/
│   ├── admin/         # Admin dashboard components
│   ├── auth/          # Authentication components
│   ├── events/        # Event-related components
│   ├── layout/        # Layout components
│   ├── theme/         # Theme components
│   └── ui/            # Reusable UI components
├── contexts/          # React Context providers
├── lib/              # Utility functions and configurations
├── pages/            # Page components
├── services/         # API service layer
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
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

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary SDK
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

3. **Context API over Redux**
   - Lighter weight solution
   - Sufficient for current state management needs
   - Easier to understand and maintain

4. **shadcn/ui Components**
   - High-quality, customizable components
   - Consistent design language
   - Accessible by default

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

