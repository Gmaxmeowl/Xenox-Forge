## 2024-11-20 - [Optimize bulk position updates in store]
**Learning:** Nested loops with `.find()` inside `.map()` lead to $O(N \times U)$ complexity, which degrades performance significantly as the number of scenes (N) and updates (U) grows.
**Action:** Always use a `Map` to index updates by ID before iterating over the main collection to achieve $O(N + U)$ complexity.
