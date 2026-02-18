## 2025-05-15 - [O(N^2) Algorithmic Bottlenecks in Graph Operations]
**Learning:** In narrative engines with node-based editors, frequent store updates (like dragging) and complex graph rendering (edges) can easily hit O(N^2) or O(E*N) complexity if using simple array lookups. This is especially impactful when state changes trigger expensive middleware like IndexedDB persistence.
**Action:** Always utilize Map-based lookups for O(1) complexity in store update logic and render-loop computations involving node/edge relationships.
