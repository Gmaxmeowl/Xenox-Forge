# Bolt's Performance Journal

## 2025-01-24 - High-frequency store updates with IndexedDB persistence
**Learning:** Updating the Zustand store on every `mousemove` (e.g., during dragging) when using `persist` middleware with IndexedDB causes significant lag due to frequent serialization and I/O.
**Action:** Use local state or debounced store updates for high-frequency events, or debounce the persistence layer itself.

## 2025-01-24 - Optimizing GraphView with Memoization and Map lookups
**Learning:** Large React components like `GraphView` can suffer from O(N^2) lookups in render loops and unnecessary re-renders of all child nodes.
**Action:** Extract child items into separate components wrapped in `React.memo`. Ensure callbacks passed to these components are stable (using `useCallback` and `useStore.getState()`) to prevent re-renders. Use `Map` for O(1) lookups instead of `.find()` in render loops.
