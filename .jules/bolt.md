## 2025-05-15 - [GraphView Performance Optimization]
**Learning:** In applications with complex SVG graphs, rendering edges can become an O(E*N) bottleneck due to repeated `.find()` calls in the render loop. Granular Zustand selectors and `useMemo`ed Map lookups significantly improve performance.
**Action:** Always check for nested `.find()` calls in render loops or frequent event handlers (like dragging) and replace them with Map-based O(1) lookups.
