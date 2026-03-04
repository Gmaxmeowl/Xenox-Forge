## 2026-03-04 - [Optimize GraphView edges rendering]
**Learning:** The graph edges rendering logic was using an $O(N)$ `find` operation inside a nested loop over scenes and choices, leading to $O(N \times E)$ complexity per render. During high-frequency updates like node dragging, this causes measurable lag as the number of scenes increases.
**Action:** Use `useMemo` to create a `Map` of scenes for $O(1)$ lookups. This reduces complexity to $O(N + E)$ and ensures smooth performance even with large story graphs. Always check for nested lookups in render loops of complex UI components.
