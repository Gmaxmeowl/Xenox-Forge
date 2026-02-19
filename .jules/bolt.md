## 2024-05-22 - O(N^2) Edge Rendering in GraphView
**Learning:** Rendering connections between nodes in a graph view using nested `flatMap` with `array.find` lookups results in O(N^2) complexity. This becomes a significant bottleneck during high-frequency events like dragging, especially as the graph grows.
**Action:** Utilize a `Map` for constant-time lookups of nodes by ID within the render loop or memoized selectors.

## 2024-05-22 - Unnecessary Re-renders during Drag
**Learning:** Updating a central store on every mouse move causes the entire GraphView to re-render. If nodes are not memoized, they all re-render even if they didn't move.
**Action:** Extract list items into separate components wrapped in `React.memo` and ensure that only the changed items receive new prop references.
