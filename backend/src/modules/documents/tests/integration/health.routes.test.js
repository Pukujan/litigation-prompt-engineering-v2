import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { createTestApp } from "../../../../shared/testing/create-test-app.js";

test("GET /api/documents/health", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "documents-health-"));
  process.env.DATABASE_URL = `file:${join(tempRoot, "test.db")}`;

  const { register } = await import("../../index.js");
  const app = createTestApp(register);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/documents/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.module, "documents");
    assert.equal(body.status, "ok");
  } finally {
    server.close();
    delete process.env.DATABASE_URL;
    await rm(tempRoot, { recursive: true, force: true });
  }
});
