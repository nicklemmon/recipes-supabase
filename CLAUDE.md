# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development Commands

- `npm start` - Start development server with Vite
- `npm run build` - Build production bundle
- `npm run serve` - Preview production build locally
- `npm run typecheck` - Run TypeScript type checking

## Architecture Overview

This is a React-based family recipes app using:

- **TanStack Router** for file-based routing with type-safe navigation
- **Supabase** for backend database and authentication
- **Tailwind CSS v4** for styling
- **Valibot** for runtime type validation
- **Base UI Components** for accessible UI primitives

### Key Architecture Patterns

**Authentication Flow**:

- Root route loader fetches session state from Supabase
- `_private` route group handles auth guards and redirects
- Public routes allow unauthenticated access

**Data Layer**:

- API functions in `src/api/` handle Supabase queries
- All database responses validated with Valibot schemas
- Type definitions in `src/types/` define data models

**Route Structure**:

- Nested routes follow URL pattern: `/recipes/$category/$subcategory/$recipe`
- Route files use TanStack Router conventions (`_private`, `$param`)
- `routeTree.gen.ts` auto-generated, don't edit manually

**Component Organization**:

- Reusable UI components in `src/components/`
- Page-specific components co-located with routes
- Consistent component props via `src/types/props.ts`

### Environment Setup

Requires `.env` file with Supabase credentials:

```
VITE_SUPABASE_PROJECT_URL="<project-url>"
VITE_SUPABASE_CLIENT_KEY="<client-key>"
```

### Database Schema

Main tables: `recipes`, `categories`, `subcategories`

- Recipes have hierarchical category/subcategory relationships
- Recipe slugs are unique within category/subcategory scope
- Rating field (1-5) used for favorites functionality
