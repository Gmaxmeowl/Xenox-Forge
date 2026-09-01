## 2025-05-18 - Map-based lookup for store position updates
**Learning:** Performing `Array.prototype.find()` inside a `.map()` during bulk position updates scales at $O(N \times U)$, causing noticeable lag during drag operations in large projects.
**Action:** Always map update arrays to a `Map` before performing bulk array updates in Zustand store handlers to maintain $O(N + U)$ complexity.
