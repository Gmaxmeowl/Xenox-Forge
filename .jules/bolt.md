## 2025-05-22 - [Algorithmic Graph Optimization]
**Learning:** Nested array searches (`Array.find`) inside render loops or state update maps create $O(N^2)$ bottlenecks as the dataset grows. In graph views, edge resolution is the most common victim.
**Action:** Always use memoized lookup Maps ($O(1)$) for cross-referencing nodes by ID in graph rendering and bulk updates.

## 2025-05-22 - [Granular Zustand Subscriptions]
**Learning:** Subscribing to a large `project` object in Zustand causes components to re-render on *any* project change (e.g., adding an item re-renders the graph).
**Action:** Use granular selectors (e.g., `useStore(s => s.project.scenes)`) to isolate components from unrelated state changes.
