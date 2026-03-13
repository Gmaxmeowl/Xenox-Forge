## 2026-03-13 - [GraphView Rendering Optimization]
**Learning:** Utilizing a memoized `Map` for scene lookups in `GraphView` reduces the complexity of edge rendering from O(E * N) to O(E + N). Additionally, granular Zustand selectors prevent the entire component from re-rendering on unrelated store updates.
**Action:** Always prefer Map-based lookups and granular selectors for complex UI components that depend on large arrays or central state.
