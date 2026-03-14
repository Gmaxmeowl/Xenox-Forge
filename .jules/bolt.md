## 2025-05-14 - [GraphView Rendering Optimization]
**Learning:** React graph visualizations with many edges suffer from O(E*N) complexity if edge targets are resolved using `.find()` inside the render loop. Dragging performance scales poorly as nodes are added because every mouse move triggers a full re-render of all nodes if they aren't memoized.
**Action:** Use a memoized `Map` for constant-time node lookups and extract nodes into `React.memo` components with stable callbacks to ensure only the moving parts re-render.
