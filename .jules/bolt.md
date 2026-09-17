## 2026-09-17 - GraphView Memoized Edge & Scene Map Lookup
**Learning:** Performing nested `.flatMap()` and $O(N)$ `.find()` lookups directly inside SVG render trees in GraphView causes $O(N^2)$ runtime overhead on every mouse move / re-render. Memoizing a `sceneMap` (`Map<string, Scene>`) and `edges` array reduces calculation time from ~1.26s to ~43ms across 100 renders (~29.3x speedup).
**Action:** Always memoize graph node lookup maps and edge lists when rendering SVG graph visualizations with dynamic connections.
