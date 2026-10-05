## 2026-10-05 - GraphView Edge Rendering Scene Lookups
**Learning:** Graph edge rendering in React components that iterate over choices/actions can execute nested `Array.prototype.find()` lookups on every render and mouse interaction, turning SVG rendering into an $O(N \times E)$ bottleneck (1.919s for 1,000 scenes across 100 renders).
**Action:** Index scenes into a memoized `Map` (`sceneMap`) using `useMemo` in $O(N)$ time so edge target lookups during render and drag interactions are $O(1)$ (52ms, ~36.8x speedup).
