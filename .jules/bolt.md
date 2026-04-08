## 2026-04-08 - [Optimized GraphView Edge Rendering]
**Learning:** Resolving edge targets using nested `find` calls inside a `flatMap` resulted in quadratic-like performance ($O(E \times N)$). Using a memoized `Map` for constant-time lookups optimizes this to $O(E + N)$.
**Action:** Always prefer `Map` or `Record` for lookups in render loops or performance-critical calculations involving large datasets.
