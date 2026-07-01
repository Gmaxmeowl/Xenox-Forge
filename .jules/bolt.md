## 2025-01-24 - Bulk State Update Optimization
**Learning:** Updating large collections (10,000+ items) in the store using `.find()` inside a `.map()` results in $O(N \times U)$ complexity, which becomes a noticeable bottleneck during frequent updates like node dragging.
**Action:** Use a `Map` for lookups to achieve $O(N + U)$ complexity for bulk updates.
