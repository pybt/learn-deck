# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A learning tool for AI in software development. Generates self-contained HTML learning card decks that work on desktop and mobile, shareable via Google Drive.

## Commands

- **Build**: `bun run build` — generates HTML deck files into `decks/`
- **Lint**: `bun run lint`
- **Lint fix**: `bun run lint:fix`

## Architecture

- **Runtime/package manager**: Bun
- **Linting**: Biome with spaces, double quotes, recommended rules, and auto-organized imports
- **Card data**: `src/data/<topic>/<deck-name>.ts` — decks organized by topic (ai/, docker/, helm/)
- **Template**: `src/template.ts` — generates self-contained HTML with inline CSS and vanilla JS
- **Build script**: `src/build.ts` — reads deck data and writes HTML files to `decks/`
- **Output**: `decks/<deck-name>.html` — single-file, no dependencies, uses `<details>/<summary>` for expand/collapse

## Adding a New Deck

1. Create `src/data/<topic>/<deck-name>.ts` exporting a `CardData[]` array (use existing topic dir or create new one)
2. Add the deck to the `decks` array in `src/build.ts`
3. Run `bun run build`
