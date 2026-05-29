# Contract: architecture push dev log

**Version:** `v001`  
**Code:** `backend/src/shared/contracts/architecturePushDevLog.contract.js`  
**Agent schema:** `work-log/architecture-push-logs/schemas/arch-push-agent.v1.schema.json` (`1.0.0`)

> **Not used in this product repo.** Archived contract doc kept for reference only. Use [prePushDevLog.contract.md](./prePushDevLog.contract.md) before pushes here.

## Purpose (archived)

Historical spec for a separate architecture/npm export audit trail. **litigation-prompt-engineering-v2** does not sync to an external scaffold package.

| Audience | Path | Format |
|----------|------|--------|
| Human | `work-log/architecture-push-logs/human/` | Markdown — export/npm summary + fill sections |
| Agent | `work-log/architecture-push-logs/agent/` | JSON — machine-readable export handoff |

Human logs include a **long-form UTC timestamp** in the header (e.g. `Sunday, 24 May 2026, 14:53 UTC`) plus sortable filename stamps (`YYYY-MM-DD`, `HH-MM`).

## Commands

Not wired in this repo. Use `npm run dev-log:pre-push` instead.

## Product vs architecture logs

| Log | When | Focus |
|-----|------|--------|
| `dev-log:pre-push` | Every product repo push | APIs, tests, full tree, domain changes |
| `arch-log:push` | Architecture/npm export only | Starter templates, export script, contracts manifest, npm version |

## Agent log (required fields)

- `meta`, `summary`, `architecturePush`, `git`, `exportLint`, `starterChanges`, `changes`, `decisions[]`, `followUps`

## Related

- [prePushDevLog.contract.md](./prePushDevLog.contract.md) — product pushes
- [work-log/architecture-push-logs/README.md](../../../work-log/architecture-push-logs/README.md)
- `.cursor/commands/architecture-push-log.md`
