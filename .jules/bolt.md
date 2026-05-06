## 2025-05-15 - [O(N^2) to O(N) optimizations in Graph Rendering]
**Learning:** React components subscribing to a large `project` state object instead of granular fields causes massive re-renders across the entire editor. Additionally, using `.find()` inside mapping loops for edge rendering creates quadratic complexity $O(N \times M)$ which can be optimized to $O(N+M)$ with a Map.
**Action:** Always use granular selectors for Zustand stores and memoize lookup maps for list-based cross-references in render logic.
