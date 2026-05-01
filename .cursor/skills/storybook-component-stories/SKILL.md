---
name: storybook-component-stories
description: Adds co-located Storybook CSF stories for React components under src (shared/ui and elsewhere). Use when creating or editing *.stories files, documenting UI, or when the user asks for Storybook stories for a component.
disable-model-invocation: true
---

# Storybook component stories (geo-quiz)

## Placement

- Put `Component.stories.tsx` (or `.ts` if no JSX in file) **next to** `Component.tsx` in the same folder.
- Storybook already loads `../src/**/*.stories.*` from `.storybook/main.ts` — no config change unless stories live outside `src/`.

## Imports and types

- `import type { Meta, StoryObj } from '@storybook/react-vite'`
- For spied handlers: `import { fn } from 'storybook/test'`
- End meta with `} satisfies Meta<typeof Component>` and `type Story = StoryObj<typeof meta>`.

## Meta (`title` and layout)

- **title**: mirror the path under `src/` with `/` segments, **without** the `src/` prefix or `.stories` filename.
  - Example: `src/shared/ui/Button/Button.tsx` → `shared/ui/Button`.
- **parameters.layout**: use `'centered'` for small leaf controls; use `'padded'` or full width when the component needs page-like space.
- **tags**: include `['autodocs']` unless the user opts out.
- **component**: set to the React component for docs and controls.

## Args and handlers

- Put sensible **defaults** in `meta.args` (e.g. `children`, `type: 'button' as const` for native buttons).
- Use **`fn()`** from `storybook/test` for `onClick` / other callbacks so actions show in the Actions panel.
- Use `as const` for string literals that must match a narrow prop type (e.g. `type`, `variant` unions).

## Stories to include

1. **Default** — minimal `export const Default: Story = {}` inheriting `meta.args`.
2. **Disabled** (or “empty” / “loading”) when the component supports those states.
3. **Stress** variants when useful: long label text, many children, narrow viewport — only if they exercise real layout or truncation.
4. Add stories for **each meaningful variant** the component exposes (e.g. visual variants from vanilla-extract classes), not duplicate aliases of the same state.

## Stack notes

- React + TypeScript + Vite; styles are **vanilla-extract** (`*.css.ts`). No global CSS import is required in the story if the component already imports its styles.
- Follow **AGENTS.md**: no semicolons, single quotes; run `npm run lint` (and `npm run prettier:fix` when available) after adding files.

## Reference in repo

- Example: [`Button.stories.tsx`](../../../src/shared/ui/Button/Button.stories.tsx) next to `Button.tsx`.
