## 2024-05-22 - [O(N^2) Scene Updates in Store]
**Learning:** Updating multiple scenes by mapping through all scenes and using `.find()` on the updates array results in O(N * U) complexity, which can cause lag during drag operations in large projects.
**Action:** Always convert the updates array into a lookup Map or Record using `Object.fromEntries()` before mapping, ensuring O(N + U) complexity. Avoid using `reduce` with object spread as it results in O(U^2) complexity.

## 2024-05-22 - [O(E*N) Edge Rendering in GraphView]
**Learning:** Resolving edge targets by searching through the scenes array for every choice action creates an O(E * N) bottleneck in the render loop, leading to dropped frames during viewport interactions.
**Action:** Memoize a scene lookup Map (ID -> Scene) and use it for constant-time target resolution within the `flatMap` rendering logic, reducing complexity to O(E + N).
