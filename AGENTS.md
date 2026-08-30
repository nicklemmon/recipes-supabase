# Agent instructions

Read this file together with `CLAUDE.md`.

## Testing

### Prefer real boundaries

- Do **not** mock app modules (`src/api/*`, hooks, routers) to fake network success or failure.
- For HTTP/network behavior, use **[MSW](https://mswjs.io/)** (Mock Service Worker). Intercept the real request at the network boundary. Let the app code run as it does in production.
- Narrow spies (for example `vi.spyOn` on `localStorage` or `matchMedia`) are fine when the thing under test is browser API wiring, not a stand-in for your own fetch layer.

### Never write tautological tests

A tautological test only restates the code. It cannot fail when the product is wrong. These tests are **actively harmful**: they add noise, give false confidence, and slow refactors.

**Avoid:**

- Asserting that a mock returned the value you configured on that same mock
- Asserting implementation details (internal function called with exact args) when a user-visible result would prove the same thing
- Snapshotting or copying production logic into the test and “verifying” the copy
- Tests whose arrange and assert are the same fact in different words

**Prefer:**

- Arrange a realistic input or MSW response
- Act through the public UI or public function
- Assert an observable outcome (what the user sees, what the function returns, what request was sent)

If a test would still pass after deleting the feature, delete the test instead.
