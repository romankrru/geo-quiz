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
- Styles: `vanilla-extract`, `*.css.ts` files next to component.
- Components: `PascalCase/` folder with `Component.tsx` and `Component.css.ts`.
- Folder public API via `index.ts` (re-export).
- Prettier: no `;`, single quotes. Run `prettier:fix` and `lint` before commit.
- TS strict (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`).
