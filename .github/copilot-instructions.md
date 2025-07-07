# Club Connect - BRAC University Club Management System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
Club Connect is a centralized club management system for BRAC University built with Next.js, TypeScript, TailwindCSS, PostgreSQL, Prisma, NextAuth.js, and Resend email service.

## Architecture & Modules
The application consists of three main modules:
1. **Student Portal** (Module 1) - Student registration, club discovery, event RSVP
2. **Club Management** (Module 2) - Club profile management, membership handling, event creation
3. **Admin Panel** (Module 3) - User oversight, club registration, event approval, budget management

## Tech Stack Guidelines
- **Framework**: Next.js with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS with consistent BRAC University branding
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with role-based access control (Student, Club Leader, Admin)
- **Email**: Resend API for notifications and announcements
- **UI Components**: Radix UI primitives with custom styling

## Code Standards
- Use TypeScript interfaces and types for all data structures
- Implement proper error handling and validation with Zod
- Follow Next.js 14+ conventions with App Router
- Use server actions for data mutations
- Implement proper loading states and error boundaries
- Ensure responsive design for mobile compatibility
- Follow security best practices for authentication and authorization

## Role-Based Permissions
- **Student**: Access to Module 1 only
- **Club Leader**: Access to Module 2 + notification features
- **Admin/OCA**: Full access to Module 3

## File Structure Conventions
- `/src/app` - App Router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions, database client, auth config
- `/src/types` - TypeScript type definitions
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Development Guidelines
- Always implement proper form validation
- Use server components where possible for better performance
- Implement proper loading states and error handling
- Follow accessibility guidelines (WCAG)
- Write meaningful commit messages
- Test authentication flows thoroughly
- Ensure email templates are professional and branded
