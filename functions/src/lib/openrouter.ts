type JsonSchema = Record<string, unknown>;

type StructuredRequest<T> = {
  apiKey: string;
  modelId: string;
  schemaName: string;
  schema: JsonSchema;
  system: string;
  user: string;
  providerAllowlist?: string[];
  timeoutMs?: number;
};

export async function callOpenRouterStructured<T>(
  input: StructuredRequest<T>
): Promise<T> {
  if (!input.apiKey.trim()) throw new Error("OPENROUTER_API_KEY_MISSING");
  if (!input.modelId.trim()) throw new Error("OPENROUTER_MODEL_ID_MISSING");
  if (input.modelId === "openrouter/auto") {
    throw new Error("OPENROUTER_AUTO_MODEL_FORBIDDEN");
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    input.timeoutMs ?? 20_000
  );

  try {
    const provider: Record<string, unknown> = {
      zdr: true,
      data_collection: "deny",
      require_parameters: true,
      allow_fallbacks: false
    };

    if (input.providerAllowlist?.length) {
      provider.only = input.providerAllowlist;
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${input.apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "Inner Compass"
        },
        body: JSON.stringify({
          model: input.modelId,
          messages: [
            { role: "system", content: input.system },
            { role: "user", content: input.user }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: input.schemaName,
              strict: true,
              schema: input.schema
            }
          },
          provider,
          temperature: 0.1
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      throw new Error(`OPENROUTER_HTTP_${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("OPENROUTER_EMPTY_RESPONSE");

    return JSON.parse(content) as T;
  } finally {
    clearTimeout(timeout);
  }
}
