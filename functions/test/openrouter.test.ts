import assert from "node:assert/strict";
import test from "node:test";
import { callOpenRouterStructured } from "../src/lib/openrouter.js";

test("forbids OpenRouter auto model", async () => {
  await assert.rejects(
    callOpenRouterStructured({
      apiKey: "test",
      modelId: "openrouter/auto",
      schemaName: "test",
      schema: { type: "object" },
      system: "test",
      user: "test"
    }),
    /OPENROUTER_AUTO_MODEL_FORBIDDEN/
  );
});

test("sends strict privacy/provider controls", async () => {
  const originalFetch = globalThis.fetch;
  let capturedBody: any;

  globalThis.fetch = (async (_url, init) => {
    capturedBody = JSON.parse(String(init?.body));
    return new Response(
      JSON.stringify({
        choices: [{ message: { content: JSON.stringify({ ok: true }) } }]
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  try {
    const result = await callOpenRouterStructured<{ ok: boolean }>({
      apiKey: "test",
      modelId: "example/model",
      schemaName: "test",
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["ok"],
        properties: { ok: { type: "boolean" } }
      },
      system: "test",
      user: "test"
    });

    assert.deepEqual(result, { ok: true });
    assert.equal(capturedBody.provider.zdr, true);
    assert.equal(capturedBody.provider.data_collection, "deny");
    assert.equal(capturedBody.provider.require_parameters, true);
    assert.equal(capturedBody.provider.allow_fallbacks, false);
    assert.equal(capturedBody.response_format.type, "json_schema");
    assert.equal(capturedBody.response_format.json_schema.strict, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
