# AGENTS.md

## Stack

React 19, TypeScript, Vite, TanStack Router, vanilla-extract.

## Commands

- `npm run dev` — dev server
- `npm run build` — build (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run prettier` / `npm run prettier:fix` — check/format

## Structure

```
src/
  entities/    domain entities
  pages/       route pages
  shared/
    ui/        reusable components
    theme/     vanilla-extract variables
  router.tsx   router config
  main.tsx
```

Aliases: `@shared/*` → `src/shared/*`, `@entities/*` → `src/entities/*`.

## Conventions

- Aim for DDD-style boundaries: domain types and data in `entities/`, route-level flow in `pages/`, reusable UI and theme in `shared/`.
- Entity pure logic that transforms another entity’s data should take that data as arguments (from the page or a thin factory) instead of importing large static catalogs from sibling modules—clearer dependency direction and trivial test doubles.
- In `entities/`, use `*.service.ts` for a small set of related **stateless** domain helpers in one file: implement as plain functions, then `export const fooService = { ... }` as the public namespace. Not for IO, React, or DI-style classes (naming echoes Angular, meaning here is “domain API surface”, not injectable services).
- Styles: `vanilla-extract`, `*.css.ts` files next to component.
- Components: `PascalCase/` folder with `Component.tsx` and `Component.css.ts`; importers use the concrete file (e.g. `./Foo/Foo`), not an `index.ts` barrel.
- Component props: type the props object as `Props`; implement components as `export const Foo = (props: Props) => { ... }` and read fields as `props.*`—no parameter destructuring in the signature.
- Elsewhere (e.g. `entities/`), keep a small public surface via `index.ts` re-exports, like `src/entities/country/index.ts` → `./model` and nested `model/index.ts` for types/data.
- Prettier: no `;`, single quotes. Run `prettier:fix` and `lint` as needed for TS/style changes.
- TS strict (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`).

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `romankrru/geo-quiz`, accessed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix` (all created on the GitHub repo). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
