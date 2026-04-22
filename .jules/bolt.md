## 2026-04-22 - [O(N*M) to O(N+M) Store & Graph Optimization]
**Learning:** Nested loops ((N \times M)$) in React render cycles and Zustand state updates cause noticeable lag as the story graph grows. Using `useMemo` for lookup Maps and `Object.fromEntries` for bulk state updates ensures linear performance.
**Action:** Always prefer Map/Object lookups over `.find()` inside loops for graph-based architectures.

## 2026-04-22 - [Stable Callbacks vs Effect Thrashing]
**Learning:** Including frequently changing state arrays (like `scenes`) in `useCallback` dependencies causes `useEffect` (event listeners) to re-attach on every frame during interactions like dragging.
**Action:** Use `useStore.getState()` inside event handler callbacks to access the latest state without triggering dependency invalidation for the hooks that manage the listeners.
