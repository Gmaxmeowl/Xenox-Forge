## 2025-05-22 - [Algorithmic Optimization for Graph Data]
**Learning:** Nested lookups in render loops (edges) and state updates (bulk positions) create O(N^2) or O(N*U) bottlenecks that become noticeable as the graph grows.
**Action:** Always use a Map or Record for O(1) lookups of related data during complex rendering or bulk store updates.
