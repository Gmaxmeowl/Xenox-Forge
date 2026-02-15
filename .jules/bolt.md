## 2026-02-15 - [Zustand Store Subscriptions]
**Learning:** Destructuring from the full store hook (e.g., `const { x, y } = useStore()`) or subscribing to the whole store (`const store = useStore()`) causes the component to re-render on *every* state change, even if the used properties didn't change. This is particularly expensive in root components like `App.tsx` or `EditorLayout.tsx`.
**Action:** Always use targeted selectors (e.g., `useStore(s => s.property)`) to isolate the component's re-render scope.
