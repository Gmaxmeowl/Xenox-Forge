## 2026-06-01 - [O(N^2) Graph Edge Resolution]
**Learning:** In applications with graph-based UIs, rendering edges often involves resolving target node positions by ID. Using `.find()` within mapping loops leads to O(N^2) complexity, causing significant lag as the node count grows.
**Action:** Always use a memoized lookup Map (O(1)) for node resolution during graph rendering and bulk state updates to ensure O(N) complexity.
