## 2026-06-09 - Optimize bulk position updates in store
**Learning:** Found that `updateScenesPositions` and `updateQuestStagesPositions` used `updates.find()` inside a `.map()` over all scenes/stages. This resulted in O(N * U) complexity where N is total items and U is number of updates. For 10,000 items and 100 updates, this takes ~83ms vs ~1.5ms with a Map.
**Action:** Always use a `Map` for lookups when performing bulk updates on collections to ensure O(N + U) complexity.
