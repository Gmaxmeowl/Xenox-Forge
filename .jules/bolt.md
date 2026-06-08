## 2026-06-08 - O(1) Lookup Maps for Graph Rendering
**Learning:** Using `Array.prototype.find()` inside rendering loops or state updates for large collections (10,000+ items) creates a severe $O(N^2)$ bottleneck. In this codebase, graph rendering logic was particularly affected, taking >700ms for 10k nodes due to nested searches.
**Action:** Always implement memoized `Map` lookups via `useMemo` in components and pre-calculate lookup maps in Zustand actions to achieve $O(N)$ complexity.
