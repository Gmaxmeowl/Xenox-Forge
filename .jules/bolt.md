## 2024-05-22 - GraphView Performance Optimization

**Learning:** The GraphView component suffered from significant performance degradation during node dragging due to three main factors:
1. Unnecessary re-renders of all scene nodes whenever any node's position changed.
2. O(N^2) complexity in connection path calculations because target scenes were looked up via `array.find` inside a nested loop.
3. Frequent store updates triggering asynchronous IndexedDB writes on every mouse move.

**Action:**
1. Extracted scene nodes into a separate `SceneNode` component wrapped in `React.memo`. By ensuring stable callbacks (using `useStore.getState()` in event handlers), we prevent non-dragged nodes from re-rendering when one node is moved.
2. Implemented `useMemo` for connection paths and used a `Map` for O(1) scene lookup, reducing the overall complexity from O(N^2) to O(N).
3. Optimized `updateScenesPositions` in the store by using a `Map` for updates, ensuring O(N) complexity instead of O(N*M).
