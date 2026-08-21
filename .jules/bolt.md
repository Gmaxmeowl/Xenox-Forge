## 2025-08-21 - QuestEditor stage edge rendering Map lookup

**Learning:** In `QuestEditor.tsx`, SVG edge rendering iterated over `q.stages.flatMap(...)` and performed nested `q.stages.find(s => s.id === targetId)` array scans on every render frame (including during stage drag operations). For 500 stages and 5 edges per stage, this caused 1.25M comparisons per frame (~7.4s for 1000 iterations). Memoizing `stageMap` via `useMemo` reduced calculation time from 7.41s to 274ms (~27.05x speedup).
**Action:** When rendering connection edges between graph nodes in React components, always memoize an $O(1)$ `Map` index of nodes by ID instead of performing nested `.find()` searches during component render loops.
