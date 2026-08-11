## 2025-02-17 - [GraphView Scene Lookup Map]
**Learning:** Performing multiple nested list scans with `project.scenes.find()` during edge rendering and mouse interactions scales quadratically as the story grows. Replacing this with a memoized `Map` created at the component level allows constant-time O(1) lookups.
**Action:** When mapping over items and executing lookups in React components, construct a memoized lookup map (`useMemo`) to replace nested `find` calls. Remember to add the lookup map to dependency arrays of callbacks using it to prevent stale closure bugs.
