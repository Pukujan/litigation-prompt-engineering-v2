import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { openSqliteDatabase, runSqlMigration } from "../../shared/db/sqlite.js";
import { resolveDocumentStoragePaths } from "../../shared/contracts/documentPersistence.contract.js";
import { createModuleRouter } from "./routes/index.js";
import { registerModuleEvents } from "./events/index.js";
import { moduleConfig } from "./config/index.js";
import { createFileStorageAdapter } from "./adapters/file-storage.adapter.js";
import { createParserAdapter } from "./adapters/parser.adapter.js";
import { createDocumentRepository } from "./repositories/document.repository.js";
import { createDocumentIngestService } from "./services/document-ingest.service.js";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(moduleDir, "../../../..");

let wired = false;

/**
 * @param {import("express").Express} app
 * @param {{ eventBus: { emit: (event: string, payload: unknown) => void } }} context
 */
export function register(app, context) {
  if (!process.env.DATABASE_URL?.trim()) {
    console.warn(
      "! Module skipped (set DATABASE_URL): documents — e.g. file:./data/app.db"
    );
    return;
  }

  const db = openSqliteDatabase(process.env.DATABASE_URL, repoRoot);
  if (!wired) {
    runSqlMigration(
      db,
      join(moduleDir, "repositories/migrations/001_document_persistence.sql")
    );
    wired = true;
  }

  const storagePaths = resolveDocumentStoragePaths(repoRoot);
  const fileStorage = createFileStorageAdapter({ storagePaths });
  const parser = createParserAdapter();
  const documents = createDocumentRepository({ db });
  const ingest = createDocumentIngestService({
    fileStorage,
    parser,
    documents,
    eventBus: context.eventBus
  });

  const router = createModuleRouter({
    config: moduleConfig,
    context,
    ingest
  });
  app.use("/api/documents", router);
  registerModuleEvents(context);
}
