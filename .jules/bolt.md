## 2024-02-26 - [GraphView Performance Optimization]
**Learning:** Found O(N*E) complexity in GraphView edge rendering due to repeated 'find' calls in nested loops. Re-renders were also inefficient because the whole graph was connected to the entire project state.
**Action:** Use 'scenesById' Map for O(1) lookups. Extract memoized sub-components (SceneNode, SceneEdge). Use granular Zustand selectors and stable callbacks with 'useStore.getState()' to isolate re-renders.
