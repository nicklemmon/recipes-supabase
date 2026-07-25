# Recipes app

Family recipes app implemented with:

- React
- TanStack Router
- Tailwind CSS
- Supabase

## Local database

The local database runs via the [Supabase CLI](https://supabase.com/docs/guides/local-development).

**Start the local DB** (required before running the dev server or migrations):

```
npx supabase start
```

**Run migrations** against the local DB:

```
npx supabase db reset
```

**Stop the local DB** when you're done:

```
npx supabase stop
```

## Development

```
npm install
npm start
```

## Other commands

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `npm run build`     | Build production bundle          |
| `npm run serve`     | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking     |
| `npm run lint`      | Run ESLint                       |
| `npm run prettier`  | Format all source files          |
| `npm test`          | Run tests in watch mode          |
| `npm run test:run`  | Run tests once                   |
| `npm run test:ui`   | Run tests with the Vitest UI     |
