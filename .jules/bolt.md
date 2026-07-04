## 2025-05-14 - Map-based store updates
**Learning:** In Zustand stores, performing bulk updates on arrays using `.map()` combined with `.find()` creates $O(N \times U)$ complexity. For large projects (1000+ nodes), this leads to dropped frames during drag operations.
**Action:** Always use a `Map` to index updates before iterating over the main collection to achieve $O(N + U)$ complexity.
