## 2024-11-20 - [Optimize node lookups in GraphView]
**Learning:** Nested array scanning (`.find()`) inside rendering loops / frequent handlers scales poorly ($O(N^2)$ complexity) when rendering multiple nodes and connections. Introducing a component-level `useMemo` map indexes items in $O(N)$ once and allows $O(1)$ lookups.
**Action:** Always prefer Map-based indexing over `.find()` inside high-frequency rendering and event paths, and ensure the Map is properly added to dependencies of memoized callbacks (`useCallback`) using it.
