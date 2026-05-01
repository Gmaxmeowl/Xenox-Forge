## 2024-05-22 - [Algorithmic Optimization in Store Updates]
**Learning:** Quadratic complexity $O(N \cdot U)$ in store updates (e.g., using `find` inside `map` for position updates) causes visible lag during drag operations in the visual graph editor. Converting the update array into a lookup map reduces complexity to $O(N + U)$, significantly improving UI responsiveness.
**Action:** Use `Object.fromEntries` or `Map` to pre-index bulk updates before mapping over large state arrays.

## 2024-05-22 - [Zustand Selector Granularity]
**Learning:** Subscribing to a monolithic `project` object in complex components like `GraphView` causes redundant re-renders whenever any unrelated part of the project (e.g., characters, items) changes.
**Action:** Always use granular selectors (e.g., `s => s.project.scenes`) to isolate components from unrelated state updates.
