## 2025-05-15 - Optimizing Graph Rendering and Store Updates
**Learning:** Granular selectors in Zustand are critical for preventing unnecessary re-renders in complex UI components like GraphView. Additionally, O(N*U) state updates during high-frequency events (like dragging) can be easily refactored to O(N+U) using Map lookups, providing a massive performance boost (up to 19x in benchmarks).
**Action:** Always prefer granular selectors for large state objects and use Map-based lookups for bulk updates in the store.
