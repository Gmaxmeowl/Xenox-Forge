## 2026-06-27 - [O(N + U) bulk position updates]
**Learning:** In interactive editors with many nodes (scenes/stages), bulk position updates using `.find()` inside `.map()` result in (N \times U)$ complexity, which causes visible lag during dragging as the number of nodes grows.
**Action:** Use a `Map` to index the updates first, reducing complexity to (N + U)$ and ensuring smooth performance even with thousands of nodes.
