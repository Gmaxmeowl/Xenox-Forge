## 2025-05-15 - [O(N * U) Bulk State Updates]
**Learning:** In editors where multiple nodes can be dragged simultaneously, using `.find()` inside a `.map()` to apply updates creates $O(N \times U)$ complexity. This becomes a major lag source as the number of nodes or simultaneous updates grows.
**Action:** Always pre-construct a `Map` from the updates array to achieve $O(N + U)$ complexity. Use strict checks (`!== undefined`) if the value could be falsy, though for position objects truthiness is often sufficient.
