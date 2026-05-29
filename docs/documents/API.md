# Documents module API

Base path: `/api/documents`

Requires `DATABASE_URL` in `backend/.env` (e.g. `file:./data/app.db`).

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Module health |
| POST | `/upload` | Multipart upload (`file` field); optional `caseId` |
| GET | `/documents/:documentId` | Document row + text versions |

## POST /upload

**Request:** `multipart/form-data`

| Field | Required | Notes |
|-------|----------|-------|
| `file` | yes | `.txt` or `.pdf` supported in v1 |
| `caseId` | no | Links document to a case when cases are used |

**Response (201):**

```json
{
  "documentId": "uuid",
  "status": "parsed",
  "versionId": "uuid"
}
```

Files are stored under `data/uploads/{documentId}/` per [documentPersistence](../architecture/contracts/documentPersistence.contract.md).
