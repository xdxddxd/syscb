# Copilot Instructions for Casa Branca Consultoria Imobiliária Management System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a comprehensive, offline-first, mobile-first management system for "Casa Branca Consultoria Imobiliária" built with:

### Core Technologies
- **Frontend**: Next.js 15+ with TypeScript, App Router, Tailwind CSS
- **Package Manager**: Bun for fast package management
- **Database**: TanStack DB with ElectricSQL for offline-first synchronization
- **File Storage**: AWS S3 SDK integrated with MinIO
- **State Management**: TanStack Query for server state
- **UI Components**: Headless UI components with Tailwind CSS
- **Authentication**: Multi-user system with role-based permissions

### Key Features
1. **Offline-First Architecture**: All data must be accessible offline with sync when online
2. **Mobile-First Design**: 100% responsive, optimized for mobile devices
3. **Internationalization**: Full i18n support for pt-BR (primary), Spanish, and English via t() function
4. **Dynamic Permissions**: Checkbox-based CRUD permissions for each user account
5. **Multi-Branch Inventory**: 100% traceable item transfers between branches
6. **Employee Points System**: Mandatory location + selfie verification
7. **Integrated CRM**: Lead management and customer tracking
8. **Financial Dashboard**: Automated commission calculations and tracking
9. **Real-time Notifications**: System-wide notification management
10. **Contract Management**: Advanced contracts with e-signature integration
11. **Client Portal**: Secure portal for client communication and process tracking
12. **Market Analysis**: Data-driven property pricing tools

### Development Guidelines

#### Code Standards
- Use TypeScript for all code with strict type checking
- Follow Next.js App Router conventions
- Implement proper error boundaries and loading states
- Use server components when possible, client components when necessary
- Maintain offline-first approach in all data operations

#### Internationalization Rules
- **NEVER** use hard-coded text in any component
- **ALWAYS** use the t() function for all text content
- Support three languages: pt-BR (primary), es, en
- Structure translation keys hierarchically (e.g., `dashboard.inventory.title`)
- Include context in translation keys when needed

#### Database Patterns
- Use TanStack DB for local storage
- Implement ElectricSQL for real-time synchronization
- Design tables with offline-first principles
- Include conflict resolution strategies
- Maintain data integrity across sync operations

#### File Management
- Use MinIO with AWS S3 SDK for all file operations
- Implement progressive upload for large files
- Support offline file caching
- Include file type validation and security checks

#### UI/UX Standards
- Mobile-first responsive design
- Use Tailwind CSS utility classes
- Implement proper loading states and skeletons
- Include accessibility features (ARIA labels, keyboard navigation)
- Follow Material Design or similar consistent design system

#### Permission System
- Implement granular CRUD permissions per user
- Use checkbox-based permission management UI
- Store permissions in normalized database structure
- Cache permissions for offline access

#### Location & Security
- Implement geolocation tracking for employee check-ins
- Require selfie verification for points system
- Store location data securely with privacy considerations
- Include offline location caching

### File Structure Conventions
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configurations
├── hooks/              # Custom React hooks
├── stores/             # State management (Zustand/TanStack)
├── types/              # TypeScript type definitions
├── i18n/               # Internationalization files
├── db/                 # Database schemas and migrations
└── utils/              # Helper functions
```

### Testing Requirements
- Write unit tests for all utility functions
- Include integration tests for critical user flows
- Test offline functionality thoroughly
- Validate i18n coverage across all components

### Performance Considerations
- Optimize for mobile performance
- Implement proper code splitting
- Use image optimization for property photos
- Cache strategies for offline operation
- Progressive Web App features

When generating code, always consider these guidelines and the specific requirements of a real estate management system with offline capabilities.
