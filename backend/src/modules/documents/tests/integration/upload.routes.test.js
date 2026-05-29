import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { createTestApp } from "../../../../shared/testing/create-test-app.js";
import { getEventBus } from "../../../../shared/events/index.js";

test("POST /api/documents/upload stores txt and GET returns parsed version", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "documents-api-"));
  process.env.DATABASE_URL = `file:${join(tempRoot, "test.db")}`;
  process.env.UPLOADS_ROOT = join(tempRoot, "uploads");

  const { register } = await import("../../index.js");
  const app = createTestApp(register);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const form = new FormData();
    const blob = new Blob(["Hello from upload test"], { type: "text/plain" });
    form.append("file", blob, "note.txt");

    const uploadRes = await fetch(`http://127.0.0.1:${port}/api/documents/upload`, {
      method: "POST",
      body: form
    });

    assert.equal(uploadRes.status, 201);
    const created = await uploadRes.json();
    assert.equal(created.status, "parsed");
    assert.ok(created.documentId);

    const getRes = await fetch(
      `http://127.0.0.1:${port}/api/documents/documents/${created.documentId}`
    );
    assert.equal(getRes.status, 200);
    const doc = await getRes.json();
    assert.equal(doc.status, "parsed");
    assert.equal(doc.versions.length, 1);
    assert.match(doc.versions[0].text_content, /Hello from upload test/);
  } finally {
    server.close();
    delete process.env.DATABASE_URL;
    delete process.env.UPLOADS_ROOT;
    await rm(tempRoot, { recursive: true, force: true });
  }
});
