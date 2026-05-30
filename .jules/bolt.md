## 2025-05-14 - [O(N^2) lookups in Graph Views]
**Learning:** Graph-based editors often suffer from O(N^2) complexity during rendering because edges need to look up target nodes by ID within a loop. Similarly, bulk state updates (like dragging multiple nodes) can be O(N*U) if not using a lookup map.
**Action:** Always use `useMemo` to create a `Map` for O(1) lookups when rendering edges or handling frequent interactions in graph components. Optimize store actions by converting updates to a `Map` before processing.
