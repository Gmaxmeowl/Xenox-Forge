## 2025-05-15 - Optimizing Graph Edge Resolution

**Learning:** Replacing $O(N)$ `.find()` calls inside a `.flatMap()` loop with $O(1)$ lookups via a memoized `Map` significantly improves graph rendering performance, especially as the number of nodes (scenes or quest stages) grows. For 1000 scenes, this reduced computation from ~36ms to ~3ms (a 12x speedup).

**Action:** Always use memoized lookup Maps for resolving relationships in graph-based or list-heavy UIs where cross-referencing is required.
