# STEM Quest - Offline Learning Platform

## Overview

STEM Quest is a gamified digital learning platform designed to enhance STEM education for students in rural schools (grades 6-12). This is a mobile-first, offline-capable web application that uses interactive quizzes and games to teach STEM subjects. The platform features a hierarchical content structure (Subject -> Topic -> Quiz), multilingual support, and comprehensive progress tracking.

The application is built as a full-stack TypeScript project with React frontend and Express backend, designed to work seamlessly offline after initial load using Service Workers and IndexedDB for local data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and caching
- **Forms**: React Hook Form with Zod validation through Hookform Resolvers

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **Build**: ESBuild for production bundling
- **Development**: TSX for TypeScript execution and hot reloading

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Local Storage**: IndexedDB for offline-first capabilities
- **Session Management**: PostgreSQL sessions using connect-pg-simple

### Authentication and Authorization
- **Session Storage**: Server-side sessions stored in PostgreSQL
- **User Schema**: Basic username/password authentication with Drizzle schema validation
- **Security**: Zod schemas for input validation and type safety

### Offline-First Design
- **Service Workers**: For caching static assets and enabling offline functionality
- **Data Synchronization**: IndexedDB stores learning content and progress locally
- **Progressive Enhancement**: App functions fully offline after initial load

### Development and Build System
- **Monorepo Structure**: Shared TypeScript code between client and server
- **Hot Reloading**: Vite development server with React Fast Refresh
- **Type Safety**: Strict TypeScript configuration across the entire stack
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **express**: Web framework for Node.js backend
- **react**: Frontend UI library
- **wouter**: Lightweight routing for React

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating component variants
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and introspection tool
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Form Handling and Validation
- **react-hook-form**: Performant forms library
- **@hookform/resolvers**: Integration with validation libraries
- **zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod

### Data Fetching and Caching
- **@tanstack/react-query**: Server state management and caching
- **date-fns**: Date utility library

### Database and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express
- **pg**: PostgreSQL client library