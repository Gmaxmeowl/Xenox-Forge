## 2026-06-03 - O(N²) Edge Resolution and Granular Selectors
**Learning:** In complex graph editors, resolving edges by searching the entire node array for every choice/action leads to O(N²) complexity in the render loop, which noticeably lags at ~100+ nodes. Additionally, subscribing to the entire `project` object in Zustand causes unnecessary re-renders when any unrelated property (like a variable or item) changes.
**Action:** Always use memoized lookup Maps for node resolution in graph components. Implement granular selectors in `useStore` to isolate components from unrelated state changes.

## 2026-06-03 - Missing React Hook Imports
**Learning:** Refactoring components to use `useMemo` or other hooks can cause silent failures (ReferenceError) if the build process doesn't catch missing imports and the runtime doesn't have them in scope.
**Action:** Double-check that all used hooks are explicitly added to the React import statement when refactoring.
