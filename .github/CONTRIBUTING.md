# Contributing

## HTML

- Semantic elements over generic `div`/`span`
- Minimal wrappers; avoid nesting without purpose
- Minimal classes; prefer element and attribute selectors
- ARIA attributes where native semantics fall short
- No inline styles; keep presentation in CSS
- Use `<code-block lang="...">` for fenced code examples

## CSS

- Native CSS nesting; no preprocessors
- `light-dark()` for theming via `color-scheme`
- CSS custom properties for shared values
- Specific `transition` properties, not `all`
- Gate motion behind `prefers-reduced-motion`
- Mobile breakpoint at `768px`

## JavaScript

- Functional style; `const`, arrow functions, expressions
- Minimal intermediates; prefer composition
- No frameworks or external dependencies
- Handle async errors (e.g. `.catch` on clipboard)
- No DOM writes from user input without escaping

## General

- Avoid dependencies if possible; prefer `npx` for external tools
- Single file; CSS and JS are embedded in `index.html`
- Keep the page under 1000 lines total
- Test in both light and dark mode
- Verify mobile layout before committing
- Fix lint warnings in prose, not in the linter config

## Server

### Add a new page

1. Place an `.html` file in the project root
2. Register it in `app.js`: `.get('/path', 'file.html')`

### Serve custom content

1. Add a text route in `app.js`: `.get('/path', 'body')`

Omit the body to respond with `ok`: `.get('/health')`

### Serve static files

1. Place files in a directory (e.g. `assets/`)
2. Register in `app.js`: `.static('/assets')`

### Notes

- Only `GET` requests; everything else returns `405`
- File extensions must have a known MIME type (see `Server.DEFAULTS.mime`)
- Pages are loaded into memory at startup; restart to pick up changes
- Static directories must be within the project root
- `index.html` at root is auto-detected and served at `/`
