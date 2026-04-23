## 2025-05-14 - Quadratic complexity in Graph Edge rendering and Store updates
**Learning:** Resolving edge targets using nested `.find()` calls inside a `.flatMap()` (or similar loops) results in $O(E \times N)$ complexity. Similarly, bulk state updates (like dragging multiple nodes) using `.find()` for every element in the main array results in $O(N \times U)$ complexity.
**Action:** Use memoized `Map` objects for constant-time lookups in render loops and `Object.fromEntries` to create lookup maps for bulk store updates to achieve linear $O(N + E)$ or $O(N + U)$ complexity.
