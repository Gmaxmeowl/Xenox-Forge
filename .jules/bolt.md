## 2024-05-23 - [Zustand Granular Selectors]
**Learning:** Using `useStore()` without a selector in a React component subscribes it to the *entire* state, causing re-renders on any state change even if granular selectors are also used in the same component.
**Action:** Always use granular selectors for all state access in high-frequency components to ensure re-render isolation.

## 2024-05-23 - [Algorithmic Complexity in Graph Dragging]
**Learning:** Updating multiple node positions using `.find()` inside a `.map()` results in O(N*U) complexity, which becomes a bottleneck during smooth dragging.
**Action:** Convert update arrays to lookup objects/maps using `Object.fromEntries` to achieve O(N+U) complexity in the store action.
