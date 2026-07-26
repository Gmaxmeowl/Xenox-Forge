# Bolt's Journal

## 2025-03-02 - O(N + U) Map Lookups for State Updates
**Learning:** In interactive story engines with dynamic visual graph canvas interfaces, scene node or quest stage drag-and-drop triggers frequent, bulk position updates. Using a nested array `.find()` inside a map loop leads to $O(N \times U)$ complexity. Refactoring to pre-index updates into a `Map` achieves $O(N + U)$ complexity, reducing updates latency significantly and preventing UI frame drops.
**Action:** Use Map-based lookups whenever matching collections of updates to lists of items in Zustand or Redux state stores.
