## 2024-05-22 - [Zustand Selector Optimization]
**Learning:** Found a widespread performance anti-pattern where components (including the root `App` and `EditorLayout`) subscribed to the entire Zustand store without selectors. This caused the entire application to re-render on any state change, regardless of relevance.
**Action:** Use specific, targeted selectors for `useStore` to ensure components only re-render when the relevant data changes.
