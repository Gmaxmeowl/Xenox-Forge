## 2026-06-29 - O(N \times U) State Update Bottleneck
**Learning:** Bulk updates in the Zustand store (e.g., updating positions for all nodes) using `.find()` inside `.map()` leads to (N \times U)$ complexity, which causes noticeable lag in the Graph Editor as the number of nodes increases.
**Action:** Always use a `Map` to index updates before iterating over the main collection to achieve (N + U)$ complexity for state transitions.
