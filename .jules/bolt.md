## 2024-05-20 - [O(N) Lookups in Render Loops]
**Learning:** In the `GraphView.tsx` component, edge rendering logic was performing an O(N) `.find()` lookup for every edge target within a nested `flatMap`. For a graph with E edges and N nodes, this resulted in O(E*N) complexity, causing visible lag during node dragging as the entire graph re-renders.
**Action:** Always utilize a memoized `Map` or `Record` for constant-time (O(1)) lookups of entities by ID within high-frequency render loops or event handlers (like `onMouseMove`).
