# Bolt's Performance Journal ⚡

## 2026-06-20 - O(N * U) State Updates & O(E * S) Rendering
**Learning:** The current implementation of `updateScenesPositions` in `useStore.ts` uses `.find()` inside a `.map()`, resulting in (N * U)$ complexity where $ is total scenes and $ is number of updates. Similarly, `GraphView.tsx` renders edges by searching for target scenes using `.find()` inside nested maps, leading to (E * S)$ complexity.
**Action:** Use Map-based lookups to reduce complexity to (N + U)$ for state updates and (E + S)$ for rendering. Use granular selectors in React components to avoid unnecessary re-renders when unrelated store state changes.
