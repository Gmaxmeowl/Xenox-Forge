## 2024-05-15 - [O(N+U) Bulk Position Updates]
**Learning:** Using `.find()` inside a `.map()` loop for bulk state updates (like dragging multiple nodes) creates an $O(N \times U)$ complexity bottleneck. For 10,000 items and 100 updates, this resulted in ~60ms processing time.
**Action:** Always pre-construct a `Map` from the updates array to achieve $O(1)$ lookups within the map loop, reducing complexity to $O(N + U)$. This reduced processing time to ~2ms.
