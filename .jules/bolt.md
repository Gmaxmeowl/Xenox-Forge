## 2025-05-14 - [Memoized Lookup Map in GraphView]
**Learning:** Replacing repeated array searches (`scenes.find`) with a memoized Map in high-frequency render paths (like SVG edge rendering) provides a massive performance boost (from ~31ms to <1ms for 500 scenes). Granular store selectors also prevent unnecessary re-renders when unrelated project data changes.
**Action:** Always consider creating a lookup map for collections when performing multiple lookups during a single render cycle or inside loops.
