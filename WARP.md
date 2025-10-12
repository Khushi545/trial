# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is "RasoiMate Smart Kitchen" - a React-based web application for smart kitchen inventory management and AI-powered recipe suggestions. The project uses TypeScript, Vite, Tailwind CSS, Firebase Authentication, and local storage for data persistence. It includes features for Firebase-based user authentication, inventory tracking with expiry alerts, AI recipe generation via serverless functions, monthly analytics reporting with PDF export, and donation functionality.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload on port 5173
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Development Workflow
- `npm install` - Install dependencies after cloning (includes Firebase SDK and Supabase)
- `npm run dev` - Primary command for development
- `npm run lint` - Check for code issues before committing
- `npm run build` - Verify production build works (outputs to `dist/` directory)

### Environment Setup
- Configure Firebase project credentials in `src/config/firebase.ts`
- For serverless functions: Set `OPENAI_API_KEY` environment variable on deployment platform
- Optional: Set `VITE_API_BASE_URL` to override default serverless function endpoint

### Deployment Commands
- **Netlify**: Automatically builds using `npm run build` and deploys from `dist/`
- **Vercel**: Automatically builds and deploys with serverless functions from `api/` directory
- Local testing: `npm run build && npm run preview` to test production build

## Architecture and Code Structure

### Core Architecture
This is a single-page React application with a component-based architecture and serverless backend:

- **State Management**: React hooks with localStorage persistence for inventory data
- **Authentication**: Firebase Authentication for user management
- **Data Persistence**: Inventory data in localStorage, user data managed by Firebase
- **AI Integration**: OpenAI API via serverless functions (Netlify/Vercel) with fallback recipes
- **Styling**: Tailwind CSS with custom theme extensions
- **Build System**: Vite with TypeScript compilation
- **Serverless Functions**: API endpoints for OpenAI integration (`api/generate-recipe.ts` for Vercel, `netlify/functions/generate-recipe.ts` for Netlify)
- **Deployment**: Multi-platform support (Netlify, Vercel) with appropriate configurations

### Key Architectural Patterns

#### Authentication Flow
- App.tsx enforces authentication - shows AuthModal if no user
- useAuth hook manages Firebase authentication state with real-time updates
- Firebase Auth handles user creation, login, logout, and session persistence
- Loading states managed during Firebase auth initialization

#### Serverless Architecture
- Recipe generation uses proxy pattern to avoid exposing API keys to client
- Client calls local serverless function endpoint (`/.netlify/functions/generate-recipe` or `/api/generate-recipe`)
- Serverless function handles OpenAI API communication and CORS
- Graceful fallback to algorithmic recipe generation when AI service fails

#### Data Management
- useAuth hook manages Firebase authentication state with real-time listeners
- useInventory hook handles inventory CRUD with localStorage persistence and automatic status updates
- AI recipe generation via serverless proxy with local fallback recipes
- Sample inventory data with dynamic expiry dates initialized if no existing data found
- Automatic midnight refresh system updates expiry statuses

#### Component Structure
```
src/
├── App.tsx              # Main app component with Firebase auth gating
├── main.tsx            # React root entry point
├── index.css           # Tailwind CSS imports and global styles
├── types/index.ts      # TypeScript interfaces (User, InventoryItem, Recipe)
├── config/             # Configuration files
│   └── firebase.ts     # Firebase configuration and initialization
├── services/           # API services
│   └── recipeApi.ts    # Serverless function proxy for OpenAI API
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Firebase authentication with real-time state
│   └── useInventory.ts # Inventory CRUD with automatic status updates
└── components/         # UI components
    ├── AuthModal.tsx   # Firebase login/register modal
    ├── Header.tsx      # Navigation with user info and logout
    ├── Hero.tsx        # Landing section
    ├── Features.tsx    # Feature showcase
    ├── Inventory.tsx   # Main inventory management with status indicators
    ├── AddItemModal.tsx # Add inventory item modal
    ├── EditExpiryModal.tsx # Edit item expiry dates
    ├── Recipes.tsx     # AI-powered recipe generation with fallbacks
    ├── Donation.tsx    # Donation tracking
    ├── MapComponent.tsx # Location/mapping functionality
    ├── SimpleReportModel.tsx # Reporting modal
    ├── MonthlyReportButton.tsx # Generate monthly report button
    ├── MonthlyReportModal.tsx # Monthly analytics report with charts and PDF export
    ├── ThemeToggle.tsx # Dark/light theme toggle
    └── Footer.tsx      # Site footer

api/                    # Vercel serverless functions
└── generate-recipe.ts  # OpenAI API proxy with CORS handling

netlify/functions/      # Netlify serverless functions
└── generate-recipe.ts  # OpenAI API proxy (Netlify format)
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
- OpenAI GPT-4o-mini integration via serverless functions for intelligent recipe creation
- Secure proxy pattern prevents API key exposure to client
- Algorithmic fallback recipe generation when OpenAI API fails or is unavailable
- Customizable parameters: servings, dietary restrictions, cuisine preferences
- Real-time generation with loading states and comprehensive error handling
- CORS handling for cross-origin requests

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

## Deployment Configuration

### Multi-Platform Support
The project supports deployment on both Netlify and Vercel:

- **Netlify**: Uses `netlify.toml` configuration, functions in `netlify/functions/`
- **Vercel**: Uses `vercel.json` configuration, functions in `api/`
- Both platforms automatically build using `npm run build` and deploy from `dist/`

### Environment Variables
- `OPENAI_API_KEY` - Required on deployment platform for serverless functions
- `VITE_API_BASE_URL` - Optional override for serverless function endpoint
- Firebase configuration embedded in `src/config/firebase.ts`

### Development Notes
- Vite excludes 'lucide-react' from optimization for performance
- ESLint configured for React hooks and TypeScript with modern config format
- PostCSS configured for Tailwind processing
- All components use functional style with hooks (no class components)
- Firebase SDK integrated for authentication with real-time listeners
- Supabase SDK included as additional dependency (potential future integration)
- Recipe generation uses serverless proxy pattern with algorithmic fallbacks
- Monthly analytics report with interactive charts using Recharts library
- PDF export functionality using jsPDF and html2canvas
- TypeScript strict mode enabled with project references for better performance
