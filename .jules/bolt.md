## 2025-05-15 - [Graph Rendering Bottleneck: O(N^2) Edge Resolution]
**Learning:** In node-based editors, resolving edges by searching through a flat array of nodes for every connection leads to O(N*E) or O(N^2) complexity. This becomes a significant bottleneck as the graph grows (e.g., ~100ms for 1000 nodes).
**Action:** Always implement a memoized lookup Map (O(1)) for node resolution in the render path. Combine this with granular state selectors to isolate the component from unrelated state changes, preventing unnecessary re-renders of the entire graph.
