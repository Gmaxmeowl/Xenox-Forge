# Bolt's Journal - Critical Learnings

## 2024-05-22 - [Algorithmic Optimization in Graph Rendering]
**Learning:** Rendering complex SVG edges in a node-based graph using O(N) array lookups (e.g., `find`) inside a nested loop results in O(N*E) complexity. For large graphs, this causes significant lag during drag/pan operations as the entire component re-renders.
**Action:** Always use a memoized `Map` for constant-time lookups of related data during render loops.

## 2024-05-22 - [Zustand Re-render Scope]
**Learning:** Destructuring the entire store or selecting the whole `project` object in high-level components (like `App` or `EditorLayout`) causes the entire UI to re-render whenever any granular state changes (like a node position).
**Action:** Use targeted selectors (e.g., `useStore(s => s.property)`) to isolate re-renders and ensure that only components that actually depend on the changing state are updated.

## 2024-05-22 - [Safe State Selection]
**Learning:** Targeted selectors in Zustand need to be defensive (using optional chaining) if there's any chance the parent object might be null or undefined during initialization or state transitions.
**Action:** Use `s => s.project?.settings?.isPublished` instead of `s => s.project.settings.isPublished`.
