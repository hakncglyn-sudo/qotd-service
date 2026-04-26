---
paths:
  - "public/**/*.html"
  - "public/**/*.js"
---

# UI Style Rules (scoped to public/**)

- Single `index.html`. Inline `<style>` is fine; external `styles.css` is fine. **No build step.**
- Plain `<script type="module">` using `fetch` — do **not** import any framework.
- Accessibility: every interactive element has a label or `aria-label`; buttons use `<button>`, not `<div onclick>`.
- The UI must degrade gracefully when the API is unreachable: show an inline error message, not an alert.
