import { DB_TABLES } from "../../../shared/contracts/documentPersistence.contract.js";

/**
 * @param {object} options
 * @param {import("better-sqlite3").Database} options.db
 */
export function createDocumentRepository({ db }) {
  const insertDocumentStmt = db.prepare(`
    INSERT INTO ${DB_TABLES.documents} (
      document_id, case_id, source_file_name, mime_type, size_bytes,
      storage_path, status
    ) VALUES (
      @documentId, @caseId, @sourceFileName, @mimeType, @sizeBytes,
      @storagePath, @status
    )
  `);

  const updateStatusStmt = db.prepare(`
    UPDATE ${DB_TABLES.documents}
    SET status = @status,
        parse_error = @parseError,
        updated_at = datetime('now')
    WHERE document_id = @documentId
  `);

  const insertVersionStmt = db.prepare(`
    INSERT INTO ${DB_TABLES.documentTextVersions} (
      id, document_id, case_id, version_type, text_content,
      structured_json, extraction_method
    ) VALUES (
      @id, @documentId, @caseId, @versionType, @textContent,
      @structuredJson, @extractionMethod
    )
  `);

  const findByIdStmt = db.prepare(`
    SELECT * FROM ${DB_TABLES.documents} WHERE document_id = ?
  `);

  const listVersionsStmt = db.prepare(`
    SELECT * FROM ${DB_TABLES.documentTextVersions}
    WHERE document_id = ?
    ORDER BY created_at ASC
  `);

  /**
   * @param {object} row
   */
  async function insertDocument(row) {
    insertDocumentStmt.run({
      documentId: row.documentId,
      caseId: row.caseId,
      sourceFileName: row.sourceFileName,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      storagePath: row.storagePath,
      status: row.status
    });
  }

  /**
   * @param {string} documentId
   * @param {string} status
   * @param {string} [parseError]
   */
  async function updateDocumentStatus(documentId, status, parseError = null) {
    updateStatusStmt.run({ documentId, status, parseError });
  }

  /**
   * @param {object} version
   */
  async function insertTextVersion(version) {
    insertVersionStmt.run({
      id: version.id,
      documentId: version.documentId,
      caseId: version.caseId,
      versionType: version.versionType,
      textContent: version.textContent,
      structuredJson: version.structuredJson
        ? JSON.stringify(version.structuredJson)
        : null,
      extractionMethod: version.extractionMethod
    });
  }

  /**
   * @param {string} documentId
   */
  async function findDocumentById(documentId) {
    const row = findByIdStmt.get(documentId);
    if (!row) return null;
    const versions = listVersionsStmt.all(documentId);
    return { ...row, versions };
  }

  return {
    tables: DB_TABLES,
    insertDocument,
    updateDocumentStatus,
    insertTextVersion,
    findDocumentById
  };
}
