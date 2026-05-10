# Bolt's Performance Journal

## 2025-05-15 - [O(N*U) to O(N+U) State Updates]
**Learning:** Batch updates in Zustand/React state that involve mapping over a large list and finding updates for each item via `.find()` create a hidden $O(N \times U)$ bottleneck (N=items, U=updates). This is especially noticeable during drag-and-drop operations where updates are frequent.
**Action:** Always convert the `updates` array into a `Map` or lookup object before the `.map()` loop to achieve $O(N + U)$ complexity. Use strict undefined checks (`newVal !== undefined`) to safely handle valid falsy values.
