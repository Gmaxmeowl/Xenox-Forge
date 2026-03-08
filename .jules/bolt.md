## 2025-05-14 - Optimized Graph Edge Rendering with Map Lookups

**Learning:** In React applications that render complex graphs, performing (N)$ lookups (like `array.find`) inside nested loops (like `flatMap` or `map`) during the render cycle creates an (N^2)$ or even (N^3)$ bottleneck. This is particularly noticeable during high-frequency events like dragging nodes, where the entire graph might re-render.

**Action:** Use `useMemo` to build a `Map` or `Record` of data indexed by ID. This allows for (1)$ lookups within the render loop, reducing the overall complexity of edge rendering to (N)$. This pattern should be applied to any visual component that needs to resolve relationships between items in a list.
