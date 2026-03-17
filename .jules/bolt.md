## 2026-03-17 - [Optimized GraphView Edge Rendering]
**Learning:** In the `GraphView.tsx` component, edge rendering used nested `find` calls inside a `flatMap`, resulting in $O(E \times N)$ complexity. This caused significant lag as the number of scenes (N) and edges (E) grew.
**Action:** Utilize a memoized `Map` (via `useMemo`) to store scenes by ID, enabling $O(1)$ lookups and reducing the overall complexity of edge rendering to $O(E + N)$. This pattern should be applied to any visual graph or list where items need to resolve relationships.
