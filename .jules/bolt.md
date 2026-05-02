## 2025-05-14 - [Quadratic Store Updates]
**Learning:** Store updates involving mass list filtering based on ID updates (like dragging multiple nodes) was O(N*U).
**Action:** Use lookup maps (Object.fromEntries) to reduce complexity to O(N+U) in store actions.

## 2025-05-14 - [Granular Zustand Selectors]
**Learning:** Components subscribing to the entire 'project' object re-rendered on any change (items, variables, settings).
**Action:** Use granular selectors for specific project properties to isolate re-renders.
