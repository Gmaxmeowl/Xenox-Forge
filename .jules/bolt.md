## 2026-09-22 - Graph Canvas Scene Lookups in SVG Edge Rendering
**Learning:** Performing `Array.prototype.find()` lookups inside SVG path rendering loops for canvas edge links scales as $O(N^2 M)$ and causes noticeable lag during mouse moves and dragging in React. Memoizing a `sceneMap` Map indexes scene IDs in $O(N)$ time and reduces edge lookups to $O(1)$, yielding a ~11x speedup.
**Action:** When rendering canvas connections or graph edges, always create a memoized Map lookup table for node IDs rather than searching arrays in nested render loops.
