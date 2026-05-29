import { Router } from "express";
import multer from "multer";
import { AppError } from "../../../shared/http/errors.js";

/**
 * @param {object} options
 * @param {ReturnType<import("../services/document-ingest.service.js").createDocumentIngestService>} options.ingest
 * @param {number} [options.maxUploadMb]
 */
export function createUploadRoutes({ ingest, maxUploadMb = 25 }) {
  const router = Router();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxUploadMb * 1024 * 1024 }
  });

  router.post("/upload", upload.single("file"), async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError("file is required", 400);
      }
      const result = await ingest.uploadAndParse({
        originalFilename: req.file.originalname,
        mimeType: req.file.mimetype,
        buffer: req.file.buffer,
        caseId: req.body?.caseId
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/documents/:documentId", async (req, res, next) => {
    try {
      const doc = await ingest.getDocument(req.params.documentId);
      if (!doc) {
        throw new AppError("document not found", 404);
      }
      res.json(doc);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
