## 2026-03-18 - [Optimization of Scene Lookups in GraphView]
**Learning:** Resolving edge targets using nested `find` calls inside a `flatMap` resulted in quadratic-like performance ($O(E \times N)$).
**Action:** Use a memoized `Map` for constant-time lookups to optimize this to $O(E + N)$. This is especially important in render loops or frequent interaction handlers like `mousemove`.
