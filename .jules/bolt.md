## 2026-06-26 - Optimized Graph Rendering Complexity
**Learning:** In graph-based editors, rendering edges using nested loops with `.find()` lookups leads to O(N * E) complexity. This becomes a bottleneck during high-frequency updates like mouse movement.
**Action:** Use a memoized Map (`sceneMap`) for O(1) node lookups and wrap edge rendering logic in `useMemo` to reduce complexity to O(N + E). Ensure granular store selectors are used to prevent unnecessary re-renders of the entire graph when unrelated project metadata changes.
