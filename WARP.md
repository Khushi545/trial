# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is "RasoiMate Smart Kitchen" - a React-based web application for smart kitchen inventory management and AI-powered recipe suggestions. The project uses TypeScript, Vite, Tailwind CSS, Firebase Authentication, and local storage for data persistence. It includes features for Firebase-based user authentication, inventory tracking with expiry alerts, AI recipe generation, and donation functionality.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Development Workflow
- `npm install` - Install dependencies after cloning (includes Firebase SDK)
- `npm run dev` - Primary command for development
- `npm run lint` - Check for code issues before committing
- `npm run build` - Verify production build works

### Environment Setup
- Configure Firebase project credentials in `src/config/firebase.ts`
- Set up OpenAI API key as `VITE_OPENAI_API_KEY` environment variable for recipe generation
- Create `.env.local` file with: `VITE_OPENAI_API_KEY=your-openai-api-key`

## Architecture and Code Structure

### Core Architecture
This is a single-page React application with a component-based architecture:

- **State Management**: React hooks with localStorage persistence for inventory data
- **Authentication**: Firebase Authentication for user management
- **Data Persistence**: Inventory data in localStorage, user data managed by Firebase
- **AI Integration**: OpenAI API for intelligent recipe generation
- **Styling**: Tailwind CSS with custom theme extensions
- **Build System**: Vite with TypeScript compilation

### Key Architectural Patterns

#### Authentication Flow
- App.tsx enforces authentication - shows AuthModal if no user
- useAuth hook manages Firebase authentication state with real-time updates
- Firebase Auth handles user creation, login, logout, and session persistence
- Loading states managed during Firebase auth initialization

#### Data Management
- useAuth hook manages Firebase authentication state
- useInventory hook handles inventory CRUD with localStorage persistence
- AI recipe generation via OpenAI API with fallback recipes
- Sample inventory data initialized if no existing data found

#### Component Structure
```
src/
├── App.tsx              # Main app component with Firebase auth gating
├── main.tsx            # React root entry point
├── types/index.ts      # TypeScript interfaces
├── config/             # Configuration files
│   └── firebase.ts     # Firebase configuration and initialization
├── services/           # API services
│   └── recipeApi.ts    # OpenAI API integration for recipe generation
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Firebase authentication logic
│   └── useInventory.ts # Inventory CRUD operations
└── components/         # UI components
    ├── AuthModal.tsx   # Firebase login/register modal
    ├── Inventory.tsx   # Main inventory management
    ├── AddItemModal.tsx # Add inventory item modal
    ├── Recipes.tsx     # AI-powered recipe generation
    ├── Donation.tsx    # Donation tracking
    └── [other UI components]
```

### TypeScript Configuration
- Uses project references (tsconfig.app.json, tsconfig.node.json)
- Strict TypeScript configuration
- Custom types defined in `src/types/index.ts`

### State Management Pattern
- Each major feature has a custom hook (useAuth, useInventory)
- Hooks combine React state with localStorage persistence
- Props drilling used for component communication
- No global state management library

### Styling System
- Tailwind CSS with custom theme in `tailwind.config.js`
- Custom font family: Times New Roman for headings
- Custom color palette with primary (green) and accent (orange/blue) colors
- Responsive design with mobile-first approach

### AI Recipe Generation
- OpenAI API integration for intelligent recipe creation
- Fallback recipe generation when API fails
- Customizable parameters: servings, dietary restrictions, cuisine preferences
- Real-time generation with loading states and error handling

### Demo/Test Data
- Firebase Auth requires real user registration/login
- Sample inventory items with different expiry statuses (fresh, expiring, expired)
- Inventory demo data auto-initializes on first load

## Important Implementation Details

### Authentication System
- Firebase Authentication with email/password
- Real-time authentication state management
- Automatic session persistence across browser sessions
- Loading states during Firebase auth initialization
- Error handling for auth failures

### Inventory Management
- Items have status based on expiry dates: fresh, expiring, expired
- Each item has: id, name, quantity, expiry date, status, image
- CRUD operations update localStorage immediately
- Default sample items created on first load

### Component Props Pattern
- Heavy use of callback props for parent-child communication
- TypeScript interfaces ensure type safety
- Modal components use onClose/onSuccess callback patterns

### Development Notes
- Vite excludes 'lucide-react' from optimization
- ESLint configured for React hooks and TypeScript
- PostCSS configured for Tailwind processing
- All components use functional style with hooks
- Firebase SDK integrated for authentication
- Environment variables needed for OpenAI API key
- Recipe generation includes error handling and fallbacks
