## 2024-06-06 - [Lookup Maps for Large Datasets]
**Learning:** In projects with complex visual graphs (scenes, quest stages), nested $O(N^2)$ or $O(N \times U)$ lookups cause significant lag during interaction (e.g., dragging). Transitioning to $O(N)$ or $O(1)$ lookups via `Map` and `useMemo` is essential for maintaining 60FPS.
**Action:** Always use pre-constructed Map lookups when processing bulk updates or rendering many-to-many relationships in a graph-based UI.
