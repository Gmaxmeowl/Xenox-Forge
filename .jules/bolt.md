## 2026-03-26 - [GraphView Component Memoization & Callback Stability]
**Learning:** In highly interactive components like a Graph Editor, simply wrapping child components in `React.memo` is insufficient if the parent passes callbacks that depend on frequently changing state (like the `scenes` array during a drag). This causes the callbacks to be recreated on every frame, triggering full re-renders of all children.

**Action:** Use `useStore.getState()` within `useCallback` hooks to access the latest state without adding it to the dependency array. This ensures callback identity remains stable, allowing `React.memo` to effectively skip re-renders for non-interacting components.
