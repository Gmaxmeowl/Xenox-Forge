# Bolt's Performance Journal

## 2025-05-23 - [Bulk Store Update Optimization]
**Learning:** In Zustand stores, updating multiple items in a large array using an "updates" array can lead to $O(N \times U)$ complexity if implemented with nested loops or `.find()`. This becomes a significant bottleneck as the project grows (e.g., 1000+ scenes).
**Action:** Always convert the updates array into a lookup Map first. This reduces the complexity to $O(N + U)$, which is significantly faster for bulk operations like dragging multiple nodes in a graph.

## 2025-05-23 - [Granular Selectors vs. Broad State Subscriptions]
**Learning:** Subscribing a complex component like `QuestEditor` to a broad state object (e.g., the entire `project`) causes the component to re-render on *any* change to the project, even unrelated ones like character or variable edits.
**Action:** Use granular selectors for each piece of state required by the component. This isolates the component from unrelated state changes and improves perceived UI responsiveness.

## 2025-05-23 - [Efficient Edge Rendering in Graphs]
**Learning:** In graph visualizations, resolving edge targets/sources by searching the nodes array in every render frame ($O(N)$ per edge) is expensive.
**Action:** Create a memoized lookup Map of nodes once per render. This allows $O(1)$ node resolution during the edge drawing phase, which is critical for maintaining 60fps during graph interactions.
