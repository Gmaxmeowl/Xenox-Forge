# Bolt's Journal

## 2025-03-04 - Initial Setup
**Learning:** Found that bulk state updates like `updateScenesPositions` and `updateQuestStagesPositions` in `useStore.ts` run in $O(N \times U)$ complexity. When dragging multiple nodes or triggering frequent updates, this quadratic look up with nested array `.find()` in `.map()` blocks the main thread.
**Action:** Use a `Map` to index the updates array beforehand to get an $O(1)$ lookup complexity, turning the overall update process to $O(N + U)$ time complexity. Always check presence using `map.has(key)` to prevent issues with falsy values like coordinate 0.
