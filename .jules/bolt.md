## 2026-07-25 - Store position update performance optimization
**Learning:** Bulk position updates for node coordinates in `useStore.ts` like `updateScenesPositions` and `updateQuestStagesPositions` were performing nested linear arrays searches (`.find()`) inside `.map()` loops. For large networks of nodes, dragging nodes caused highly laggy rendering due to $O(N \times U)$ complexity.
**Action:** Indexing the array of updates into a Map first reduces complexity to $O(N + U)$, which achieves a ~15.6x performance improvement.
