# CLAUDE.md

This file provides guidance to AI assistants (e.g. Claude) when working with this repository.

## Repository Status

This repository is currently in its initial state. No source code, configuration, or build tooling has been committed yet. This file serves as a foundation for conventions and workflows to follow as the project develops.

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

## Project Structure (To Be Defined)

Once the project is initialized, document the structure here. Example:

```
/
├── src/                  # Application source code
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level page components
│   └── lib/              # Shared utilities and helpers
├── public/               # Static assets
├── tests/                # Test files mirroring src/ structure
├── .github/              # GitHub Actions workflows
├── package.json          # Dependencies and scripts
└── CLAUDE.md             # This file
```

---

## Common Commands (To Be Defined)

Once build tooling is configured, record the commands here. Typical examples:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint and format
npm run lint
npm run format

# Build for production
npm run build
```

---

## Code Style Conventions (To Be Defined)

Document linting rules, formatting preferences (Prettier, ESLint, etc.), and naming conventions here once tooling is established. Until then, follow these defaults:

- Use 2-space indentation.
- Prefer `const` over `let`; avoid `var`.
- Use descriptive names — avoid single-letter variables outside of loop counters.
- Keep functions small and focused on a single responsibility.
- Avoid deeply nested logic; prefer early returns.

---

## Testing Conventions (To Be Defined)

Once a test framework is chosen, document it here. Until then:

- Write tests for all new public-facing functions and components.
- Test file names should mirror the source file: `src/lib/utils.ts` → `tests/lib/utils.test.ts`.
- Prefer unit tests for logic; integration tests for API endpoints; e2e tests for critical user flows.

---

## Environment Variables (To Be Defined)

List all required environment variables here once the project has configuration needs. Example format:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Connection string for the primary database |
| `API_KEY` | Yes | Secret key for the external API |
| `NODE_ENV` | No | `development` \| `production` \| `test` (defaults to `development`) |

Copy `.env.example` to `.env` and fill in the values — never commit `.env`.
