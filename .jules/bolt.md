## 2026-05-07 - [O(1) Map Lookups for Graph Rendering]
**Learning:** Replacing $O(N)$ `.find()` calls with $O(1)$ `Map.get()` lookups for resolving edge targets in large graphs significantly reduces render time. In synthetic benchmarks with 1000 scenes, this yielded a ~7.6x speed improvement.
**Action:** Always use memoized lookup maps when rendering connections between entities in visual editors.
