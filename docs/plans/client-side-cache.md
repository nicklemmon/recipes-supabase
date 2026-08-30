# Plan: Client-side caching with TanStack Query + Router

## Context

[Issue #10](https://github.com/nicklemmon/recipes-supabase/issues/10) — **Implement caching for network requests** (title only). Branch: `feat/client-side-cache`.

Today every navigation re-hits Supabase through route loaders. Shared lookups (`getCategories`, `getSubcategories`, `getDietaryPreferences`) repeat on nearly every recipes page. Writes mostly call `router.invalidate()`, which re-runs loaders but does not provide a shared, keyed cache.

**Confirmed decisions:**

1. In-memory TanStack Query cache (no persistence across reloads).
2. Official Router + Query pattern: **`ensureQueryData` in loaders + `useSuspenseQuery` in components**, with skeletons via route **`pendingComponent`** (not fire-and-forget prefetch / in-page `Await`).
3. Document titles stay on TanStack Router **`head({ loaderData })`** — no custom title hook.
4. Characterization / regression tests **before** (and through) the refactor.
5. Deliver as a **stacked PR series**.

---

## Framework alignment (docs check)

Primary guidance for this SPA:

- [External Data Loading](https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading) — Router as **coordinator**; Query owns the cache. Canonical pattern:

  ```ts
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQueryOptions),
  // component:
  const { data } = useSuspenseQuery(postsQueryOptions)
  ```

- [Router + Query composition skill](https://github.com/TanStack/router/blob/main/packages/react-router/skills/compositions/router-query/SKILL.md) — same pattern; **`defaultPreloadStaleTime: 0`** so Router preload cache does not bypass Query freshness.

What the `/integrations/query` page is (and is not):

- That page documents **`@tanstack/react-router-ssr-query`** (SSR dehydrate/hydrate/streaming).
- This app is a **Vite SPA**. Do **not** add the SSR query package.
- The same *client* pattern still applies: `ensureQueryData` in the loader, `useSuspenseQuery` in the component, `QueryClient` on router context + `QueryClientProvider` via Router `Wrap`.

Why the earlier “prefetch everywhere + Await” plan was off-opinion:

- Docs call out loaders for **critical** render data so there is no component-level waterfall and data is ready at render.
- Streaming/`prefetchQuery` without await is for **non-critical** data (or SSR streaming), not the default for primary page content.
- Existing `defer` / `Await` usage should be **replaced** by Query + `pendingComponent`, not preserved as a parallel loading system.

---

## Goals

- Cache API reads so revisits and shared catalog data skip the network when still fresh.
- Show skeletons on first load via `pendingComponent`; cache hits feel instant (`ensureQueryData` resolves from cache).
- Keep document titles on Router `head({ loaderData })`.
- Invalidate the right query keys after add / edit / delete.
- Lock current behavior with tests before changing loaders.

## Non-goals

- Persist Query cache to `localStorage`.
- `@tanstack/react-router-ssr-query` / SSR.
- Rewriting `src/api/*` (Query wraps those helpers).
- Realtime Supabase subscriptions.
- Moving auth session into Query (keep root session loader for now).

---

## Target architecture

```
Link preload / navigate
        │
        ▼
 loader: await Promise.all([
   context.queryClient.ensureQueryData(optionsA),
   context.queryClient.ensureQueryData(optionsB),
 ])
 return { ...pieces needed by head }   // or return ensured entities directly
        │
        ├── pendingComponent → skeletons (first fetch / slow path)
        │
        ▼
 component: useSuspenseQuery(same options)  // subscribe to cache + updates
 head: ({ loaderData }) => title([...])     // unchanged Router head API
```

**Wiring (required):**

- `createRootRouteWithContext<{ queryClient: QueryClient }>()`
- Same `QueryClient` in `createRouter({ context: { queryClient }, Wrap: QueryClientProvider, defaultPreloadStaleTime: 0 })`
- Prefer route-level `staleTime: 0` (or rely on preload stale time 0) so the loader always runs; Query decides whether to hit the network.

**Document titles (Router-native):**

`ensureQueryData` returns the cached/fetched value. Return that (or a structured object) from the loader so existing `head({ loaderData })` keeps working:

```ts
loader: async ({ context, params }) => {
  const category = await context.queryClient.ensureQueryData(
    categoryBySlugQueryOptions(params.category),
  )
  // ...
  return { category, subcategory, recipe, dietaryPreferences }
},
head: ({ loaderData }) => ({
  meta: [{ title: title([loaderData?.recipe?.title, loaderData?.subcategory?.title, loaderData?.category?.title]) }],
}),
```

Components should still read via `useSuspenseQuery` (subscribe to cache), not only `useLoaderData`, so background updates and mutation invalidation refresh the UI. `useLoaderData` remains appropriate for values only needed by `head` if you prefer, but the recommended read path for rendered data is Query.

**Loading UX:**

- Replace `Await` / `defer` / ad-hoc `Suspense` with route `pendingComponent` (and shared skeleton components).
- Use `pendingMs` / `pendingMinMs` if brief cache-hit flashes of the pending UI become annoying (Router knobs — tune during verification).

---

## PR 0 — Characterization tests (before behavior changes)

Goal: lock **observable** user-facing behavior so the Query migration is a refactor under a safety net.

Follow **[AGENTS.md](../../AGENTS.md)** testing rules:

- Use **MSW** to intercept Supabase/network HTTP. Do **not** mock `src/api/*` or other app modules to fake responses.
- Avoid tautological tests. Assert what the user sees or what the public API returns after a realistic MSW response.

Add focused route/integration tests (Vitest + Testing Library + MSW), colocated under existing `__tests__` patterns. Prefer vertical slices: one behavior → green → next.

**Behaviors to lock first (high value):**

| Behavior | Suggested coverage |
| --- | --- |
| Home lists categories + Favorites entry | `/` with MSW category payloads |
| Category page lists subcategories | `/$category` |
| Subcategory page lists recipes (titles visible) | `/$category/$subcategory` |
| Recipe view shows title (and basic body) | `.../view` |
| List search uses `s` and shows matching titles | `/recipes/list` |
| Favorites shows only favorite recipes | `/recipes/favorites` |
| Add recipe redirects to the new recipe view | keep existing coverage green; migrate off module mocks toward MSW when touched |
| Delete recipe navigates to subcategory | `view` delete with MSW delete + follow-up navigation |
| Document title / head for a detail route | assert Router `head` / `document.title` after real loader data from MSW |

**Test harness work in this PR:**

- Add MSW setup (handlers + server lifecycle in Vitest setup).
- Extend `src/test-helpers/render-with-router.tsx` (or add `renderRoute`) so route tests can mount a real route module with memory history against MSW.
- Do **not** introduce Query yet in PR 0 unless a helper needs a no-op provider later — keep PR 0 about current behavior.

**Done when:** new characterization tests pass on `main`/`feat/client-side-cache` **before** Query lands; they describe behavior, not loader implementation details.

---

## PR 1 — Query infra (no user-facing change required)

- Install `@tanstack/react-query` (pin like other deps). Optional: `@tanstack/react-query-devtools` (dev only).
- Create `QueryClient` with defaults; wire into router context + `Wrap` + `defaultPreloadStaleTime: 0`.
- Switch `__root.tsx` to `createRootRouteWithContext`.
- Add `src/queries/` (or `src/api/*QueryOptions` colocated — prefer `src/queries/` for clear separation) with `queryOptions` factories wrapping existing API functions.

Suggested keys:

| Resource | Key |
| --- | --- |
| Categories | `['categories']` |
| Category by slug | `['categories', 'slug', slug]` |
| Subcategories | `['subcategories']` / `['subcategories', { categoryId }]` |
| Subcategory by slug | `['subcategories', 'slug', slug]` |
| Dietary preferences | `['dietary-preferences']` |
| Recipes list | `['recipes', filtersObject]` |
| Recipe by slug | `['recipes', 'slug', { categoryId, subcategoryId, slug }]` |

Stale-time defaults (per options, not only global):

- Catalog (categories / subcategories / dietary prefs): minutes (e.g. 5–30).
- Recipes list/detail: tens of seconds (e.g. 30–60).

Optionally convert **one** low-risk route (e.g. `/` or add page catalogs) as a tracer bullet in this PR to prove wiring; keep characterization tests green.

Update test helpers to provide `QueryClient` + context when routes start using Query.

---

## PR 2 — Catalog + browse routes

Convert with `ensureQueryData` + `useSuspenseQuery` + `pendingComponent`:

- `/` (categories)
- `/recipes/$category/`
- Shared catalog consumers on add/edit as needed

Add/reuse skeletons as `pendingComponent` (category grid skeleton already exists).

Keep `head` wired through returned loader data.

---

## PR 3 — Recipe reads (lists + detail)

Convert:

- `/recipes/list` (preserve `loaderDeps` / `validateSearch` for `s`)
- `/recipes/favorites`
- `/recipes/$category/$subcategory/`
- `.../$recipe/view`
- `.../$recipe/edit` (read path)
- `/recipes/add` (catalog reads)

Remove `defer` / `Await` once each route is converted.

Use `RecipeTableSkeleton` (and a simple detail pending shell) as `pendingComponent`s.

Parallelize independent `ensureQueryData` calls with `Promise.all` to avoid loader waterfalls. For recipe-by-slug that needs category/subcategory ids, resolve those first (unavoidable dependency), then `Promise.all` recipe + dietary prefs.

---

## PR 4 — Mutation invalidation

On success:

| Action | Cache action |
| --- | --- |
| Add | `invalidateQueries({ queryKey: ['recipes'] })` |
| Edit | invalidate detail key + `['recipes']` lists |
| Delete | `removeQueries` detail + invalidate `['recipes']`, then navigate |

Keep `router.invalidate()` for **auth/session** flows (login). For recipe CRUD, Query invalidation is the source of truth; drop redundant router invalidation where it only existed to refresh recipe loaders.

Optional: `useMutation` wrappers — nice-to-have, not required if invalidate calls in existing handlers stay clear.

---

## Verification (each PR + final)

- `npm run prettier` on touched files; `npm run qa`.
- Browser (required for UI/data PRs 2–4):
  1. Cold home → pending skeleton → categories.
  2. Drill category → subcategory → recipe → back; Network quiet for fresh catalog/recipe cache hits.
  3. List search; favorites.
  4. Add → view; edit → view; delete → list without stale rows.
  5. Confirm **document titles** still update via Router head on category/subcategory/recipe routes.
  6. Desktop and mobile pending skeletons.

---

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Characterization tests couple to Query later | Assert UI outcomes via MSW; do not mock `src/api` or Query keys |
| `pendingComponent` flash on cache hits | Tune `pendingMs` / `pendingMinMs` |
| Loader waterfalls | `Promise.all` for independent ensures |
| Dual sources of truth (`useLoaderData` vs Query) | Render from `useSuspenseQuery`; return loader data primarily for `head` |
| Over-invalidation | Prefix `['recipes']` for lists; target detail keys when known |

---

## Done when

- Shared/catalog and recipe reads are served from the Query cache when fresh.
- First loads show `pendingComponent` skeletons; revisits within `staleTime` do not refetch.
- `head({ loaderData })` still drives document titles (no custom title hook).
- Add / edit / delete leave lists and detail consistent.
- Characterization tests from PR 0 stay green through the stack; `npm run qa` passes; browser checks complete.
