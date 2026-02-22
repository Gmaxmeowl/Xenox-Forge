## 2024-05-22 - O(N^2) Lookup Optimization in Graph Rendering and Store Updates

**Learning:** In interactive graph editors, rendering edges often involves lookups of target nodes. Using `Array.find()` inside nested loops for edge rendering leads to O(N^2) or even O(N^3) complexity, causing significant lag as the number of scenes grows. Similarly, batch updates in the store that use `updates.find()` inside a `scenes.map()` call result in O(S * U) complexity.

**Action:**
1. Use `useMemo` to pre-compute a `Map<string, Scene>` in the component to allow O(1) lookups during the render loop.
2. In the store, convert the `updates` array to a `Map` before mapping over the data to reduce batch update complexity from O(S * U) to O(S + U).
