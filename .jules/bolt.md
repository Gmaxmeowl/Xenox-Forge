## 2026-03-01 - Optimize GraphView edge rendering
**Learning:** Rendering graph edges by iterating through all scenes and performing an O(N) lookup for each edge's target scene leads to O(N*E) complexity, which causes visible lag during node dragging as the graph grows.
**Action:** Use `useMemo` to create a `Map` of scenes by ID for O(1) lookups during edge rendering, reducing complexity to O(N+E).
