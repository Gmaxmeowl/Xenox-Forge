## 2024-05-15 - [O(N) vs O(N^2) lookups in React Graphs]
**Learning:** Even with relatively small datasets (~100 nodes), nested array `.find()` calls inside `map()` or `flatMap()` during the render loop (especially for edges) create significant jank during interactions like dragging. Granular store selectors and memoized `Map` lookups provide near-instant performance gains.
**Action:** Always use granular selectors for large arrays in Zustand and memoize lookup maps if the same array needs multiple lookups per render.

## 2024-05-15 - [Automatic JSX Transform and esbuild]
**Learning:** Modern React projects using the "automatic" JSX transform (often default in Vite/esbuild setups) will emit warnings or fail if legacy `@jsx` or `@jsxFrag` pragmas are present in the source files.
**Action:** Remove legacy React pragmas when working with modern esbuild-based build pipelines to maintain clean build logs.
