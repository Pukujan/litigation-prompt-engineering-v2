# Litigation Prompt Engineering v2

Product monolith built on [@pukujan/create-modular-monolith](https://github.com/Pukujan/create-modular-monolith) (MIT).

Express + React modular monolith for case filing, document ingest, prompts, and agent workflows — with architecture contracts, file-exchange, and CI gates from the platform starter.

## Stack

| Layer | Tech |
| --- | --- |
| Backend | Express, SQLite (`DATABASE_URL`), modular loaders |
| Frontend | React + Vite |
| Documents | `POST /api/documents/upload` — disk + SQL ([contract](docs/architecture/contracts/documentPersistence.contract.md)) |
| Platform | 9 architecture contracts — see [CONTRACTS_OVERVIEW](docs/architecture/CONTRACTS_OVERVIEW.md) |

## Quick start

```bash
npm install --prefix backend && npm install --prefix frontend

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

npm run test:ci
```

Run API + UI:

```bash
cd backend && npm run dev    # http://localhost:3001
cd frontend && npm run dev   # http://localhost:5173
```

Upload a document:

```bash
curl -X POST http://localhost:3001/api/documents/upload \
  -F "file=@./path/to/note.txt"
```

## Docs

| Doc | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Required for Cursor / automation |
| [docs/architecture/CONTRACTS_OVERVIEW.md](docs/architecture/CONTRACTS_OVERVIEW.md) | Contract manifest |
| [docs/documents/API.md](docs/documents/API.md) | Upload + read APIs |
| [docs/API.md](docs/API.md) | Full HTTP registry |

## Platform source

Scaffold and contracts are maintained in [create-modular-monolith](https://github.com/Pukujan/create-modular-monolith). Sync platform-only changes via `npm run export:architecture-starter` from the product repo when needed.

## License

MIT — see [LICENSE](LICENSE).
