# Bolt's Performance Journal

## 2024-05-22 - [Optimizing Scene Graph Performance]
**Learning:** In a graph-based UI using React and Zustand, re-rendering the entire graph on every mouse move during a drag is a significant bottleneck. This is exacerbated by O(N^2) or O(E*N) lookups in the render loop (e.g., finding target scenes for edges) and the store update logic.
**Action:**
1. Use `useMemo` to create a `Map` for O(1) lookups during rendering.
2. Extract nodes into `React.memo` components.
3. Use `useStore.getState()` inside callbacks to make them stable and avoid re-rendering memoized components.
4. Use a `Map` to optimize bulk updates in the store.

## 2024-05-22 - [Junk Files in PRs]
**Learning:** Running `pnpm install` or verification scripts can generate many auxiliary files (lockfiles, screenshots, logs) that should not be committed.
**Action:** Always clean up temporary files and verify git status before submitting.
