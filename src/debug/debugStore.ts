export type DebugEventType =
  | 'app_start'
  | 'navigation'
  | 'reflection_submit'
  | 'safety_route'
  | 'clarification'
  | 'guidance'
  | 'local_data'
  | 'runtime_error';

export interface DebugEvent {
  id: string;
  at: number;
  sessionId: string;
  type: DebugEventType;
  payload: Record<string, string | number | boolean | null>;
}

const DEBUG_STORAGE_KEY = 'inner_compass_debug_events_v1';
const MAX_EVENTS = 300;

const sessionId = (() => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    // Use non-sensitive fallback.
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
})();

const safePayload = (
  payload: Record<string, unknown>
): Record<string, string | number | boolean | null> => {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(payload)) {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes('text') ||
      normalizedKey.includes('problem') ||
      normalizedKey.includes('reflection') ||
      normalizedKey.includes('message') ||
      normalizedKey.includes('content')
    ) {
      continue;
    }
    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      out[key] = typeof value === 'string' ? value.slice(0, 160) : value;
    }
  }
  return out;
};

export const readDebugEvents = (): DebugEvent[] => {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(DEBUG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(-MAX_EVENTS) : [];
  } catch {
    return [];
  }
};

export const recordDebugEvent = (
  type: DebugEventType,
  payload: Record<string, unknown> = {}
): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    const events = readDebugEvents();
    const event: DebugEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: Date.now(),
      sessionId,
      type,
      payload: safePayload(payload),
    };
    localStorage.setItem(
      DEBUG_STORAGE_KEY,
      JSON.stringify([...events, event].slice(-MAX_EVENTS))
    );
  } catch {
    // Diagnostics must never become a runtime dependency.
  }
};

export const clearDebugEvents = (): void => {
  try {
    localStorage.removeItem(DEBUG_STORAGE_KEY);
  } catch {
    // No remote fallback.
  }
};

export const exportDebugBundle = () => ({
  generatedAt: new Date().toISOString(),
  product: 'Inner Compass',
  privacy: 'No raw reflection text is stored in this diagnostics bundle.',
  events: readDebugEvents(),
});

export const installGlobalDebugHooks = (): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;

  const onError = (event: ErrorEvent) => {
    recordDebugEvent('runtime_error', {
      errorName: event.error?.name || 'Error',
      sourceFile: event.filename ? event.filename.split('/').pop() || 'unknown' : 'unknown',
      line: event.lineno || 0,
      column: event.colno || 0,
    });
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    recordDebugEvent('runtime_error', {
      errorName: reason?.name || 'UnhandledPromiseRejection',
    });
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
};
