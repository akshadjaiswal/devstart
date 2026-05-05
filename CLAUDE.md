# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the CLI locally
npm run dev
# or
node bin/index.js

# Link globally for local testing
npm link

# Test commands
devstart init                        # interactive scaffold
devstart init --latest               # use latest versions for all packages
devstart init --preset saas          # skip prompts with preset (saas, blog, dashboard)
devstart list                        # list all frameworks and integrations
devstart upgrade                     # add an integration to an existing project

# Publish to npm (must be logged in via npm login first)
npm publish
```

No test suite is configured (`npm test` is a placeholder).

## Architecture

DevStart is a Node.js CLI tool (ESM, `"type": "module"`) that scaffolds production-ready web projects interactively. It is published to npm as `devstart-cli`.

### Execution flow

```
bin/index.js          # Shebang entry point
  └── src/index.js    # Commander setup — registers init, list, upgrade commands
        └── src/presets.js         # Preset configs (saas, blog, dashboard)
        └── src/prompts.js         # Interactive inquirer prompts; exports promptProjectName() and promptUser()
        └── utils/validator.js     # Validates project name/path
        └── generator.js           # Core: creates all project files
              ├── copyBaseTemplate()           # Framework base (nextjs-app, nextjs-pages, vite-react, remix)
              ├── copyConditionalTemplate()    # Per-integration overlays (exported for upgrade command)
              ├── generatePackageJson()        # Builds dependency list; respects useLatest flag
              ├── generateEnvExample()         # .env.local.example (Next.js) or .env.example (Vite)
              ├── generateLintingConfig()      # eslint.config.js, prettier.config.js, .prettierignore
              ├── generateReadme()             # Project README
              ├── createFolderStructure()      # lib/, types/, etc.
              └── generateGitignore()
        └── installer.js           # git init + install via detected package manager
        └── src/commands/upgrade.js  # devstart upgrade — adds integration to existing project
```

### Key source files

| File | Responsibility |
|------|---------------|
| `src/constants.js` | All dependency maps (including `linting`), npm scripts per framework, env var templates |
| `src/generator.js` | File generation engine; provider auto-wrapping for App Router (`layout.tsx`), Pages Router (`_app.tsx`), and Vite (`main.tsx`) |
| `src/presets.js` | Pre-filled configs for `saas`, `blog`, `dashboard` presets |
| `src/commands/upgrade.js` | Detects framework from existing `package.json`, adds a missing integration |
| `src/templates/` | Template files per framework × integration — `nextjs-app/`, `nextjs-pages/`, and `vite-react/` are fully populated |
| `src/utils/package-manager.js` | Auto-detects npm / yarn / pnpm / bun |
| `src/utils/favicon.js` | Generates SVG favicon from project name initials |

### Key behaviours to know

- **`@supabase/ssr`** is added only for Next.js frameworks — Vite/Remix get `@supabase/supabase-js` only.
- **Vite env vars** use `VITE_` prefix; generated file is `.env.example` (not `.env.local.example`).
- **`--latest` flag** sets all package versions to `"latest"` via `convertToObject(deps, useLatest)` in `generator.js`.
- **Auth.js v5** env vars are `AUTH_SECRET` / `AUTH_URL` (not the old `NEXTAUTH_*` names).
- **ESLint flat config** (v9+) is used — `eslint.config.js`, not `.eslintrc`. Next.js extends `next/core-web-vitals`; Vite uses react-hooks + react-refresh plugins.

### Adding a new integration

1. Add dependency arrays to `src/constants.js` under the appropriate integration key.
2. Add env variable entries in `src/constants.js` if needed.
3. Create template files under `src/templates/<framework>/<integration>/`.
4. Wire the integration into `generator.js` `copyConditionalTemplate()`.
5. Add a prompt option in `src/prompts.js` if it requires user input.
6. If the integration needs a React provider wrapper, add it to `createMinimalFiles()` in `generator.js` (App Router wraps in `layout.tsx`, Pages Router wraps in `_app.tsx`, Vite wraps in `main.tsx`).
7. Add the integration to `INTEGRATION_PACKAGES` and `INTEGRATION_CATEGORIES` in `src/commands/upgrade.js`.

### Supported frameworks and integrations

- **Frameworks**: Next.js 16 App Router, Next.js Pages Router, Vite+React, Remix
- **Styling**: Tailwind CSS, CSS Modules, Styled Components
- **UI**: shadcn/ui, Radix UI, Headless UI
- **State**: Zustand, Redux Toolkit, Jotai, Context API
- **Data fetching**: TanStack Query, SWR, Apollo GraphQL
- **Database**: Supabase, Firebase, Prisma, MongoDB
- **Auth**: Supabase Auth, Auth.js v5 (NextAuth), Clerk, Firebase Auth
- **Linting**: ESLint + Prettier, ESLint only
