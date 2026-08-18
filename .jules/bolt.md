## 2025-05-20 - Bulk position updates in store

**Learning:** Bulk state updates for graph positions (`updateScenesPositions` and `updateQuestStagesPositions`) using `updates.find(u => u.id === item.id)` inside array mapping caused $O(N \times U)$ nested loops per mousemove frame. Pre-indexing `updates` into a `Map` reduces execution time from ~10.6s to ~0.44s (~24.3x speedup) for 10,000 items with 100 updates over 1000 iterations.
**Action:** Always pre-build a `Map` lookup table before array `.map()` iterations when applying batch updates, preserving initial update precedence using `if (!map.has(key)) map.set(...)`.
