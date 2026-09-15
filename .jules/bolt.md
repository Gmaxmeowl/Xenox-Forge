## 2026-09-15 - GraphView Scene Lookup Optimization
**Learning:** Edge rendering in GraphView executes on every frame during dragging/connecting mouse moves (60fps). Doing nested `scenes.find(...)` across choices/actions results in O(N^2) work per frame (~1.45s for 100 renders of 1,000 scenes).
**Action:** Always memoize scene/node lookups with a `Map` when graph rendering involves inner lookups over nodes or edges during interactive drag re-renders.
