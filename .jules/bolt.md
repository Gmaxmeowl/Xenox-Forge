## 2025-03-01 - Optimize Store Bulk Updates
**Learning:** For bulk updates of array items by ID (such as node dragging coordinates in `updateScenesPositions` and `updateQuestStagesPositions`), doing nested `.find()` searches within `.map()` degrades performance to O(N * U). Converting the list of updates to a `Map` resolves lookups in O(1), improving the overall complexity to O(N + U).
**Action:** Always pre-index update arrays using a Javascript `Map` to perform fast updates, and perform exact `!== undefined` checks to avoid bugs with falsy coordinates (e.g. 0).
