## 2025-01-24 - [Optimizing Graph Lookups]
**Learning:** React components that render graph edges often perform quadratic lookups ($O(N \cdot M)$) when searching for target nodes in large arrays. Moving these lookups into `useMemo`ed Maps/Objects reduces complexity to $O(N + M)$ and significantly improves FPS during node movement.
**Action:** Always use lookup maps for node/edge relationships in graph-based UIs.

## 2025-01-24 - [State Update Complexity]
**Learning:** Bulk state updates (e.g., updating multiple node positions) using `.find()` inside a `.map()` in the reducer results in $O(N \cdot U)$ complexity. Pre-indexing updates into a lookup object makes the operation $O(N + U)$.
**Action:** Index updates in reducers before applying them to large state arrays.
