## 2026-01-14 - Optimizing Node Lookups in React Graph View Rendering
**Learning:** Performing nested array searches (e.g. `.find()`) inside hot rendering paths (such as mapping over scenes, choices, and actions to render SVG connections/edges) introduces $O(N^2)$ scaling bottlenecks as the number of nodes increases.
**Action:** Always project collection states into highly optimized $O(1)$ lookups via a memoized `Map` (`useMemo`) at the component top level to keep rendering times constant and layout operations fast.
