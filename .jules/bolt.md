## 2026-02-20 - O(N^2) Lookups in Graph Rendering
**Learning:** Rendering complex graph edges with nested `.find()` calls leads to O(E*N) complexity, causing significant lag as the number of scenes (N) and edges (E) increases.
**Action:** Use `useMemo` to create a Map for O(1) lookups of scenes by ID during render.
