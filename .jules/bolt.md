## 2026-10-15 - Canvas Graph Flow Edge Lookup Optimization
**Learning:** In canvas views like `GraphView` and `QuestEditor`, rendering connecting edges via nested `.find()` on scenes or stages leads to $O(N \times E)$ linear scans on every render frame (e.g., during node drags or interactions).
**Action:** Memoize node Map lookups (`sceneMap` / `stageMap`) using `useMemo` to convert target node resolution from $O(N)$ linear scans to $O(1)$ constant time Map lookups.
