## 2025-05-14 - Optimized GraphView Rendering

**Learning:** In GraphView.tsx, scene graph edges were rendered via a nested loop performing an O(N) lookup (`project.scenes.find`) for every edge, resulting in O(E*N) complexity. Additionally, subscribing to the entire `project` object triggered unnecessary re-renders when non-graph data changed.

**Action:** Use `useMemo` to create a `Map` for O(1) scene lookups during edge rendering. Use targeted Zustand selectors to limit re-renders. Extract nodes into a `React.memo` wrapped `SceneNode` component with stable callbacks to isolate movement-driven updates.
