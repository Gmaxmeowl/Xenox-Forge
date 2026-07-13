## 2025-07-13 - [State Management] Quadratic Complexity in Bulk Position Updates
**Learning:** The store actions `updateScenesPositions` and `updateQuestStagesPositions` were using `.find()` inside a `.map()`, resulting in $O(N \times U)$ complexity. This caused measurable lag during multi-node dragging as the number of nodes ($N$) and updates ($U$) increased.
**Action:** Always use a `Map` to index updates before mapping over the main collection to achieve $O(N + U)$ complexity for bulk state updates.
