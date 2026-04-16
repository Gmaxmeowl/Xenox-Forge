## 2024-11-20 - [Reactivity Regression with getState()]
**Learning:** Using `useStore.getState()` inside React component render logic or JSX prevents the UI from being reactive to state changes. While it avoids re-renders of the parent component, it makes the specific parts of the UI stale.
**Action:** Always use granular Zustand selectors (e.g., `useStore(s => s.project.items)`) instead of `getState()` for values that need to update the UI dynamically.
