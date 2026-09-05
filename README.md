# Osppy — Landing

**Blank canvas since 2026-09-05.** The site was cleared to nothing by operator
decision: design, copy, structure, the claims the copy made, the brand
guardrails and the harness notes all went together, so that the next version
starts from a decision instead of from a patch.

What survives is mechanical only: the Next.js 16 / React 19 / Tailwind v4
toolchain, four content gates that currently have nothing to inspect, the
photo pipeline and its optimized assets, and three redirects that are contracts
with live systems (see `AGENTS.md`).

The previous site is at the tag `v5-cierre-2026-09-05` and in `git log`. It is
there for reference, not for restoring.

```bash
npm run dev      # localhost:3000
npm run build
npm run check    # the four gates; they short-circuit until there is content
```
