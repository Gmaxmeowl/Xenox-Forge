# Bolt's Journal

## 2025-02-15 - Algorithmic Precision in Hash Map Lookups
**Learning:** When converting bulk list updates from an $O(N \times U)$ nested `.find()` array search to an $O(N + U)$ Map-based lookup, standard map population (`map.set(key, val)`) preserves the *last* occurrence of duplicate keys in the array. This breaks semantic equivalence with `Array.prototype.find()`, which returns the *first* matching element.
**Action:** Always populate the Map by checking `if (!map.has(key)) map.set(key, val)`. This preserves exact semantic equivalence with `find()` and ensures correct state management during batch updates.
