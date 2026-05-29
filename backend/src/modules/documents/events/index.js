import { DOCUMENT_EVENTS } from "../../../shared/contracts/documentPersistence.contract.js";

export function registerModuleEvents(context) {
  context.eventBus.on(DOCUMENT_EVENTS.UPLOADED, (payload) => {
    console.log(`[documents] ${DOCUMENT_EVENTS.UPLOADED}`, payload.documentId);
  });
  context.eventBus.on(DOCUMENT_EVENTS.PARSED, (payload) => {
    console.log(`[documents] ${DOCUMENT_EVENTS.PARSED}`, payload.documentId);
  });
  context.eventBus.emit("module:registered", { module: "documents" });
}
