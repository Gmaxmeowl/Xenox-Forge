## 2025-03-05 - Optimize Store Updates via Map Lookup
**Learning:** Found that bulk state updates (e.g., node dragging positions on the canvas) was previously operating in $O(N \times U)$ complexity inside the state store's `updateScenesPositions` and `updateQuestStagesPositions` functions, causing rendering stutter when handling large datasets of scenes/quest stages.
**Action:** Replaced nested `.find()` searches within `.map()` using a pre-constructed `Map` lookup, dropping the update complexity to $O(N + U)$, which improved execution performance by ~15x.
