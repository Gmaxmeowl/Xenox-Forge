## 2025-02-15 - Optimize Store Bulk Position Updates with Map-based Lookup
**Learning:** Bulk state updates mapping over lists with nested `.find()` searches lead to O(N * U) performance degradation. Converting them to a pre-built Map lookup improves runtime complexity to O(N + U). Adding `if (!updatesMap.has(u.id))` guarantees standard `Array.prototype.find()` first-match semantics.
**Action:** When refactoring bulk list updates or relationship maps, always use Map-based pre-indexing rather than nesting find searches, and preserve order semantics with a membership guard.
