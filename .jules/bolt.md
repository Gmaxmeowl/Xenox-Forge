## 2026-06-30 - Optimize bulk position updates in store
**Learning:** Nested loops in state updates (e.g., using `.find()` inside `.map()`) cause (N \times U)$ performance bottlenecks, which are especially noticeable during interactive operations like dragging multiple nodes in a graph.
**Action:** Use a pre-constructed `Map` to achieve (N + U)$ complexity for bulk updates.
