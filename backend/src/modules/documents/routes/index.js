import { Router } from "express";
import { createHealthRoutes } from "./health.routes.js";
import { createUploadRoutes } from "./upload.routes.js";

/**
 * @param {object} options
 * @param {import("../config/index.js").moduleConfig} options.config
 * @param {object} options.context
 * @param {ReturnType<import("../services/document-ingest.service.js").createDocumentIngestService>} options.ingest
 */
export function createModuleRouter({ config, context, ingest }) {
  const router = Router();
  router.use(createHealthRoutes({ config, context }));
  router.use(
    createUploadRoutes({
      ingest,
      maxUploadMb: Number(process.env.DOCUMENT_MAX_UPLOAD_MB) || 25
    })
  );
  return router;
}
