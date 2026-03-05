## 2026-03-05 - [GraphView Edge Rendering Optimization]
**Learning:** Found an (E \times N^2)$ complexity bottleneck in GraphView's edge rendering where a nested `flatMap` loop used `Array.find()` to look up target scenes by ID. This caused noticeable lag during node dragging as the number of scenes and choices grew.
**Action:** Use `useMemo` to create a `Map` of scenes by ID for (1)$ lookups. This reduces the complexity to (E \times N)$ for rendering all edges, making the UI much more responsive during frequent updates like dragging.
