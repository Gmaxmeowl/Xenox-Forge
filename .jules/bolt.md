## 2026-10-20 - Map-based O(1) Lookups for Drag Operations & SVG Edge Connections

**Learning:** In Nexus Forge, node positioning (`updateScenesPositions`, `updateQuestStagesPositions`) and SVG edge path computations (`GraphView`, `QuestEditor`) execute repeatedly during mouse movements. Using nested `.find()` on arrays in render loops and store state updates causes severe frame drops ($O(N \cdot U)$ and $O(N \cdot E)$). Replacing array scans with memoized `Map` lookups reduces execution time from 11.07s down to 0.53s (~21x speedup).
**Action:** When handling graph views or bulk position updates during continuous UI events (e.g., drag and drag-connect), always memoize arrays into lookup Maps or build temporary lookup Maps prior to iteration.
