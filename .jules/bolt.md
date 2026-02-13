## 2024-05-22 - [Zustand Store Subscription Bottleneck]
**Learning:** In this codebase, components frequently subscribe to the entire store or the entire `project` object using `const store = useStore()` or `const project = useStore(s => s.project)`. This causes massive unnecessary re-renders across the entire application whenever any small part of the state (like a single scene's position or a character's relationship) changes.
**Action:** Use granular selectors (e.g., `useStore(s => s.project.scenes)`) and extract performance-critical UI elements into memoized components (`React.memo`) to isolate re-render scopes.

## 2024-05-22 - [Unstable Callbacks Breaking Memoization]
**Learning:** Passing inline anonymous functions as props to memoized components (e.g., `<SceneNode onMouseDown={(e) => handleMouseDown(e, id)} />`) causes `React.memo` to always fail because a new function reference is created on every parent render. This is particularly problematic in Zustand where parent components often re-render on state updates.
**Action:** Use `useCallback` for event handlers and ensure they have stable dependencies. To avoid handlers depending on the state they are trying to update, use `useStore.getState()` inside the handler to get the current state without triggering a re-render or requiring a dependency.
