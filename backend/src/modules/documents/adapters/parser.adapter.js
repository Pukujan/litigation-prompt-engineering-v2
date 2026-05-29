import { readFile } from "fs/promises";
import { extname } from "path";

/**
 * @typedef {object} ParseResult
 * @property {string} versionType
 * @property {string} [textContent]
 * @property {unknown} [structuredJson]
 * @property {string} extractionMethod
 */

/**
 * @param {object} [_options]
 */
export function createParserAdapter(_options = {}) {
  /**
   * @param {object} input
   * @param {string} input.storagePath
   * @param {string} input.mimeType
   * @returns {Promise<ParseResult>}
   */
  async function parseDocument({ storagePath, mimeType }) {
    const ext = extname(storagePath).toLowerCase();

    if (mimeType === "text/plain" || ext === ".txt") {
      const textContent = await readFile(storagePath, "utf8");
      return {
        versionType: "embedded_text",
        textContent,
        extractionMethod: "pdf_text"
      };
    }

    if (mimeType === "application/pdf" || ext === ".pdf") {
      const { PDFParse } = await import("pdf-parse");
      const buffer = await readFile(storagePath);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return {
        versionType: "embedded_text",
        textContent: result.text?.trim() || "",
        structuredJson: { pageCount: result.total },
        extractionMethod: "pdf_text"
      };
    }

    throw new Error(`Unsupported mime type for parse: ${mimeType || ext || "unknown"}`);
  }

  return { parseDocument };
}
