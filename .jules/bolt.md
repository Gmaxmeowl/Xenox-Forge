## 2025-05-15 - [GraphView Performance Optimization]
**Learning:** In a node-based graph editor, rendering edges and nodes together in a single component leads to quadratic-like re-rendering performance during drag operations. Granular state selectors and memoizing the scene lookup map (O(1) vs O(N)) significantly reduces the overhead of coordinate updates.
**Action:** Extract node items into separate `React.memo` components and use stable callbacks (via `useStore.getState()`) to isolate re-render scope. Always memoize edge calculations to prevent redundant SVG path generation.
