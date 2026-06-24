## 2025-05-15 - [Graph Rendering Complexity Optimization]
**Learning:** Nested array lookups in rendering loops (like SVG edges in GraphView) create $O(N \times E)$ complexity. Pre-indexing the nodes into a `Map` using `useMemo` reduces this to $O(N + E)$.
**Action:** Always use `useMemo` to create lookup maps for entities when rendering relationships in graph views or complex lists.
