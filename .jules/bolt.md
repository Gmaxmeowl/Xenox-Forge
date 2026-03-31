
## 2026-03-31 - [Stabilizing Event Listeners with Zustand]
**Learning:** In components using global event listeners (e.g., window mousemove/mouseup) inside a `useEffect`, including broad state arrays like `scenes` in the listener's `useCallback` dependency array causes the effect to tear down and re-setup on every state update (like dragging a node).
**Action:** Use `useStore.getState()` inside the callback to retrieve the latest state values without adding them to the dependency array. This keeps the callback identity stable and prevents event listener thrashing.
