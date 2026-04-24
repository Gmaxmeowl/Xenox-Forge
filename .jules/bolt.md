## 2024-05-22 - [O(1) Scene Lookups in GraphView]
**Learning:** The `GraphView` component was performing nested lookups with `.find()` inside a `flatMap` to render edges, resulting in quadratic-like performance ($O(E \times N)$).
**Action:** Use a memoized `Map` (`sceneMap`) created with `useMemo` to achieve constant-time $O(1)$ lookups for scene IDs, optimizing edge rendering to $O(E + N)$.
