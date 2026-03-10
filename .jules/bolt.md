## 2025-05-22 - GraphView and Store Update Optimization
**Learning:** Bulk updates in Zustand stores using nested find operations (O(N*U)) cause significant lag during high-frequency events like dragging. Moving lookup logic to O(1) objects/Maps ensures smooth UI interactions regardless of project size.
**Action:** Always prefer O(1) lookups in store updates and render loops (useMemo) when dealing with collections.
