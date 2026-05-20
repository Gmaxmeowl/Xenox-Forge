## 2025-05-14 - [Zustand Selector Optimization & Graph Rendering]
**Learning:** Calling `useStore()` without a selector (e.g., `const { ... } = useStore()`) in Zustand subscribes the component to the entire state object. This causes unnecessary re-renders when any unrelated state property changes. For high-frequency components like graph editors, always use granular selectors for both state and actions.
**Action:** Use `const scenes = useStore(s => s.project.scenes)` and `const updateScene = useStore(s => s.updateScene)` instead of destructuring the whole store.

**Learning:** SVG graph rendering involving edge resolution between nodes often results in (Nodes \times Edges)$ complexity if using `.find()` inside mapping loops. This can be optimized to (Nodes + Edges)$ by creating a memoized `Map` lookup for nodes.
**Action:** Use `useMemo` to create a `Map<string, Node>` from the nodes array, then use `map.get(id)` for (1)$ lookups during edge rendering.
