## 2026-03-12 - [O(E*N) to O(E+N) Graph Edge Optimization]
**Learning:** In the GraphView component, resolving edge targets using nested `find` calls inside a `flatMap` resulted in quadratic-like performance scaling ($O(E \times N)$). This caused visible lag during frequent re-renders like node dragging, especially as the story graph grew.
**Action:** Always use a memoized `Map` for constant-time lookups when rendering relationships between entities in a list. Additionally, use granular store selectors to prevent unrelated state changes from triggering expensive graph re-renders.
