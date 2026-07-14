## 2024-05-15 - [Rule of Hooks in JSX]
**Learning:** Placing `useMemo` or other hooks directly within the JSX return statement (e.g., `{useMemo(...) }`) is a violation of React's Rules of Hooks. While it might appear to work in some environments, it breaks React's expectation of hook call order and is generally rejected by linters and reviewers.
**Action:** Always declare hooks at the top level of the functional component and reference their returned values in the JSX.
