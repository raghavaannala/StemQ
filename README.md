# STEM Quest 🚀

An interactive, gamified STEM learning platform built with modern web technologies. STEM Quest provides engaging quizzes across Mathematics, Physics, Chemistry, and Biology with offline support, multilingual content, and comprehensive progress tracking.

## 🌟 Features

### 🎯 Core Learning Features
- **Interactive Quizzes**: Multiple-choice questions across 4 STEM subjects
- **Progressive Learning**: Unlock topics by completing prerequisites
- **Gamification**: Points, levels, achievements, and streaks
- **Real-time Feedback**: Audio cues and visual feedback for answers
- **Detailed Analytics**: Track progress, performance, and learning patterns

### 🌐 Accessibility & Localization
- **Multilingual Support**: English, Hindi (हिंदी), Telugu (తెలుగు)
- **Offline Learning**: Full offline functionality with service worker
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Audio Feedback**: Sound effects for enhanced engagement

### 📊 Progress Tracking
- **User Progress**: Points, levels, completed topics, and streaks
- **Achievement System**: Unlock badges for various milestones
- **Analytics Dashboard**: Comprehensive performance insights
- **Local Storage**: All progress saved locally with automatic sync

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Server state management
- **Lucide React** - Beautiful icon library

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type-safe server development
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Production database (schema defined)
- **In-Memory Storage** - Development storage

### Development Tools
- **Vite** - Development server and build tool
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Drizzle Kit** - Database migrations
- **TSX** - TypeScript execution

## 📁 Project Structure

```
StemQ-1/
├── client/                     # Frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── ui/            # shadcn/ui components (47 components)
│   │   ├── pages/             # Application pages
│   │   │   ├── Home.tsx       # Main dashboard
│   │   │   ├── Quiz.tsx       # Quiz interface
│   │   │   ├── Analytics.tsx  # Progress analytics
│   │   │   └── not-found.tsx  # 404 page
│   │   ├── lib/               # Utility libraries
│   │   │   ├── audio.ts       # Audio feedback system
│   │   │   ├── offlineStorage.ts # IndexedDB operations
│   │   │   ├── translations.ts   # Multilingual content
│   │   │   ├── queryClient.ts    # TanStack Query config
│   │   │   └── utils.ts          # Common utilities
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── use-toast.ts   # Toast notifications
│   │   │   └── use-mobile.tsx # Mobile detection
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Global styles
│   └── index.html             # HTML template
├── server/                     # Backend application
│   ├── index.ts               # Express server setup
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Database interface
│   └── vite.ts                # Vite integration
├── shared/                     # Shared type definitions
│   └── schema.ts              # Database schema & types
├── public/                     # Static assets
│   └── sw.js                  # Service worker
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
└── drizzle.config.ts          # Database config
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StemQ-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file (optional)
   PORT=3200
   HOST=127.0.0.1
   DATABASE_URL=postgresql://username:password@localhost:5432/stemquest
   ```

### Development

1. **Start the backend server**
   ```bash
   npm run dev:server
   ```
   Server runs on `http://127.0.0.1:3200`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://127.0.0.1:5173`

3. **Access the application**
   Open `http://127.0.0.1:5173` in your browser

### Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server (frontend)
npm run dev:server   # Start Express server (backend)

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:push     # Push schema changes to database

# Type Checking
npm run check       # Run TypeScript type checking
```

## 🎮 Application Features

### 🏠 Home Dashboard
- **Subject Cards**: Mathematics, Physics, Chemistry, Biology
- **Progress Stats**: Points, completed topics, achievements, level
- **Recent Activity**: Latest quiz attempts and scores
- **Achievement Gallery**: Earned and locked achievements
- **Quick Actions**: Practice quiz, progress review, leaderboard

### 📝 Quiz System
- **Interactive Questions**: Multiple-choice with explanations
- **Timer System**: Track time spent on each question
- **Progress Tracking**: Visual progress bar and question counter
- **Immediate Feedback**: Correct/incorrect with explanations
- **Results Summary**: Score, points earned, time spent
- **Retry Options**: Retake quizzes to improve scores

### 📊 Analytics Dashboard
- **Performance Metrics**: Scores, completion rates, time analysis
- **Subject Breakdown**: Progress across different STEM subjects
- **Learning Patterns**: Study habits and improvement trends
- **Achievement Tracking**: Progress toward unlocking new badges

### 🎵 Audio System
- **Feedback Sounds**: Correct answer, incorrect answer, level up
- **Achievement Sounds**: Special audio for unlocking achievements
- **Streak Sounds**: Audio feedback for answer streaks
- **Web Audio API**: Generated tones and melodies

### 🌍 Multilingual Support
- **Language Selection**: Switch between English, Hindi, Telugu
- **Content Translation**: UI elements, questions, explanations
- **Persistent Settings**: Language preference saved locally
- **RTL Support**: Ready for right-to-left languages

### 📱 Offline Functionality
- **Service Worker**: Comprehensive offline support
- **Cache Strategies**: Static assets, dynamic content, API responses
- **Background Sync**: Sync progress when connection restored
- **Push Notifications**: Achievement alerts and learning reminders
- **IndexedDB Storage**: Local data persistence

## 🗄️ Data Management

### Local Storage
- **User Progress**: Points, level, completed topics, streaks
- **Quiz Results**: Scores, timestamps, detailed answers
- **Achievements**: Earned badges and unlock dates
- **Settings**: Language preference, audio settings

### Database Schema (PostgreSQL)
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

### Storage Interface
```typescript
interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}
```

## 🎨 UI Components

### Component Library (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Forms**: Button, Input, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast, Progress, Badge, Skeleton
- **Overlays**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Table, Accordion, Collapsible, Tabs
- **Media**: Avatar, Calendar, Carousel, Chart

### Styling System
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Theme customization support
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Theme switching capability
- **Custom Components**: Branded UI elements

## 🔧 Configuration

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: "127.0.0.1",
    proxy: {
      "/api": "http://127.0.0.1:3200"
    }
  }
});
```

### Tailwind Configuration
```typescript
// tailwind.config.ts
module.exports = {
  content: ["./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Custom theme extensions
    }
  },
  plugins: [require("tailwindcss-animate")]
};
```

## 🧪 Subject Content

### Mathematics
- **Algebra Basics**: Operations, equations, variables
- **Geometry Fundamentals**: Shapes, angles, calculations
- **Number Theory**: Prime numbers, factors, sequences

### Physics
- **Motion Basics**: Velocity, acceleration, displacement
- **Energy & Forces**: Kinetic, potential, work
- **Waves & Sound**: Frequency, amplitude, properties

### Chemistry
- **Periodic Table**: Elements, properties, groups
- **Chemical Reactions**: Equations, balancing, types
- **Atomic Structure**: Protons, neutrons, electrons

### Biology
- **Cell Biology**: Structure, organelles, functions
- **Genetics**: DNA, inheritance, mutations
- **Ecology**: Ecosystems, food chains, biodiversity

## 🏆 Achievement System

### Available Achievements
- **First Quiz**: Complete your first quiz
- **Math Master**: Complete all mathematics topics
- **Biology Expert**: Complete all biology topics
- **Perfect Score**: Get 100% on any quiz
- **Speed Learner**: Complete 5 quizzes in one day

### Achievement Mechanics
- **Progress Tracking**: Monitor completion toward goals
- **Visual Feedback**: Animated unlock notifications
- **Persistent Storage**: Achievements saved locally
- **Social Features**: Ready for sharing capabilities

## 🔒 Security & Privacy

### Data Protection
- **Local Storage**: All user data stored locally
- **No Personal Data**: No collection of personal information
- **Offline First**: Reduced server dependency
- **Type Safety**: TypeScript prevents runtime errors

### Development Security
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error boundaries
- **CORS Protection**: Proper cross-origin configuration
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables
```bash
NODE_ENV=production
PORT=3200
HOST=0.0.0.0
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Deployment Platforms
- **Vercel**: Frontend deployment with serverless functions
- **Railway**: Full-stack deployment with PostgreSQL
- **Docker**: Containerized deployment option
- **Traditional VPS**: Node.js server deployment

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Conventional Commits**: Structured commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Icon library
- **Vite** - Fast build tool
- **React** - UI library

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Check the documentation
- Review existing discussions

---

**Built with ❤️ for STEM education**
