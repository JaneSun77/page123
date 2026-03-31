# CLAUDE.md

This file provides guidance to AI assistants (e.g. Claude) when working with this repository.

## Repository Overview

A pure static webpage project — no build tools or package manager required. Open `index.html` directly in a browser to run it. The project includes a responsive layout, a contact form with client-side validation, and an optional API endpoint for form submission.

---

## Development Workflow

### Branch Strategy

- Development happens on feature branches, never directly on `main`.
- Branch names follow the pattern: `<actor>/<short-description>-<id>` (e.g. `claude/add-claude-documentation-5cYu1`).
- All changes must be committed and pushed to the designated branch before creating a pull request.

### Git Commit Conventions

- Write clear, imperative commit messages: `Add login form`, `Fix null pointer in auth handler`.
- One logical change per commit. Avoid large monolithic commits.
- Never amend published commits — create a new commit instead.
- Never skip hooks (`--no-verify`) unless explicitly instructed.

### Pull Requests

- Do not create a pull request unless explicitly asked by the user.
- PR titles must be concise (under 70 characters).
- PR bodies should include a summary and a test plan checklist.

---

## AI Assistant Guidelines

### General Principles

- Read files before modifying them. Never assume file contents.
- Do not introduce changes beyond what is asked. No speculative refactors, extra features, or unsolicited improvements.
- Prefer editing existing files over creating new ones.
- Do not add comments, docstrings, or type annotations to code you did not change.
- Do not add error handling for scenarios that cannot happen.
- Do not create helpers or abstractions for one-time operations.
- Remove dead code outright — do not leave `// removed` comments or unused variables.

### Security

- Never introduce command injection, XSS, SQL injection, or other OWASP Top 10 vulnerabilities.
- Validate input only at system boundaries (user input, external APIs). Trust internal code.
- Do not commit `.env` files, credentials, or secrets.

### Risky Actions — Always Confirm First

Before taking any of these actions, explicitly tell the user what you're about to do and wait for confirmation:

- Deleting files or branches
- Force-pushing or resetting git history
- Dropping database tables or destructive migrations
- Modifying CI/CD pipelines
- Pushing to `main` / `master`
- Posting comments or messages to external services

---

## Project Structure

```
/
├── index.html        # Single-page entry point; all sections live here
├── style.css         # All styles; uses CSS custom properties (variables)
├── script.js         # Vanilla JS: form handling, nav highlight, env config
├── .env.example      # Template for environment variables — copy to .env
├── .gitignore        # Excludes .env, node_modules, OS/editor artifacts
└── CLAUDE.md         # This file
```

### Key conventions

- **Single HTML file** — all pages/sections are `<section id="...">` elements within `index.html`.
- **BEM-flavored CSS naming** — e.g. `.nav__logo`, `.btn--primary`, `.card__title`.
- **CSS custom properties** — all colors, spacing, shadows, and transitions are defined as `--variables` in `:root` inside `style.css`. Change a value there to update it site-wide.
- **No framework, no bundler** — plain HTML/CSS/JS. Do not introduce a build step without discussion.
- **Vanilla JS modules** — each concern is its own `init*()` function called from the `DOMContentLoaded` listener in `script.js`.

---

## Common Commands

No build step is required. Use any of the following to preview the site locally:

```bash
# Python (most systems have this pre-installed)
python3 -m http.server 8080

# Node.js (if available)
npx serve .

# VS Code: install the "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8080` in your browser.

---

## Code Style Conventions

- **Indentation**: 2 spaces (HTML, CSS, JS).
- **JS**: `const` by default; `let` when reassignment is needed; no `var`.
- **CSS**: Add new design tokens as `--custom-properties` in `:root`, not as hard-coded values inline.
- **Naming**: BEM for CSS classes (`.block__element--modifier`); camelCase for JS identifiers.
- **Functions**: Small, single-responsibility `init*()` or action functions. Avoid nesting beyond 2 levels; prefer early returns.
- **No framework**: Do not introduce React, Vue, or any npm dependency without explicit approval.

---

## Testing

No automated test framework is configured. Manual testing checklist:

- [ ] Open `index.html` in Chrome, Firefox, and Safari (or mobile).
- [ ] Verify nav links scroll to the correct section.
- [ ] Submit the contact form with empty fields — validation errors should appear.
- [ ] Submit with an invalid email — email error should appear.
- [ ] Submit with all valid fields — success message should appear and form resets.
- [ ] Resize to mobile width (< 640 px) — layout should stack correctly.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values. **Never commit `.env`.**

Since this is a pure static site (no server), environment variables must be injected at deploy time or consumed via the `CONFIG` object at the top of `script.js`.

| Variable | Required | Description |
|---|---|---|
| `ENV_CONTACT_ENDPOINT` | No | POST endpoint for the contact form. If empty, the form simulates success locally. |
| `ENV_SITE_NAME` | No | Site title override (defaults to `page123`). |
