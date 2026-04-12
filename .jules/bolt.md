## 2026-04-12 - [Optimized Edge Rendering in GraphView]
**Learning:** Resolving edge targets using nested `find` calls inside a `flatMap` resulted in quadratic-like performance ($O(E \times N)$). Using a memoized `Map` for constant-time lookups optimizes this to $O(E + N)$. Additionally, using granular store selectors prevents unnecessary re-renders when unrelated project data changes.
**Action:** Always prefer O(1) Map/Record lookups over O(N) array searches in render loops and use granular selectors for state management.
