# Bolt's Journal

## 2025-02-15 - Store Update Optimization via Map-based Lookups
**Learning:** During continuous drag actions, update actions like `updateScenesPositions` are invoked at a high frequency on every mouse move. Using a nested array lookup (`.find()`) leads to $O(N \times U)$ operations, causing severe visual lag and frames dropping, especially with larger node graphs.
**Action:** Replace nested `.find()` with an $O(1)$ lookup Map constructed once before the loop, yielding $O(N + U)$ complexity and significantly improving state-update performance.
