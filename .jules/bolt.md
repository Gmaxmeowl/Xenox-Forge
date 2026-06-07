## 2024-05-23 - Algorithmic Bottleneck in State Updates
**Learning:** Using `.find()` inside a `.map()` for bulk updates in the Zustand store creates an $O(N \times U)$ complexity (where N is the number of items and U is the number of updates). For a graph with 1000 nodes, dragging 100 nodes simultaneously caused significant UI lag because the lookup map was being re-created or searched linearly for every single node in the collection.

**Action:** Always pre-calculate a `Map` from the updates array *outside* the `.map()` call to achieve $O(N + U)$ complexity. This ensures state updates remain fast even as the project grows.

## 2024-05-23 - Zustand Re-render Optimization
**Learning:** Destructuring the `useStore()` hook (e.g., `const { project, ... } = useStore()`) causes the component to re-render whenever *any* part of the store changes. In complex editors like `QuestEditor`, this leads to massive performance degradation.

**Action:** Use granular selectors (e.g., `const project = useStore(s => s.project)`) to ensure components only subscribe to the specific slices of state they need.
