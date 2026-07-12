## 2025-01-24 - [Store Performance Bottleneck]
**Learning:** High-frequency bulk updates to scene or quest stage positions in the Zustand store were implemented with O(N * U) complexity using `.find()` inside `.map()`. For projects with thousands of nodes, this caused significant dragging lag.
**Action:** Always use a Map for O(1) lookups during bulk updates to collections to achieve O(N + U) complexity.
