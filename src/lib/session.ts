import type {
  GenerateGuidanceResponse,
  NeedsClarificationResponse,
  WisdomResponse
} from "@/src/types/guidance";

type SessionState = {
  pendingText: string | null;
  response: GenerateGuidanceResponse | null;
};

const state: SessionState = {
  pendingText: null,
  response: null
};

export function setPendingText(text: string | null): void {
  state.pendingText = text;
}

export function getPendingText(): string | null {
  return state.pendingText;
}

export function setResponse(response: GenerateGuidanceResponse | null): void {
  state.response = response;
}

export function getResponse(): GenerateGuidanceResponse | null {
  return state.response;
}

export function getClarification(): NeedsClarificationResponse | null {
  return state.response?.kind === "needs_clarification" ? state.response : null;
}

export function getWisdom(): WisdomResponse | null {
  return state.response?.kind === "wisdom" ? state.response : null;
}

export function clearSession(): void {
  state.pendingText = null;
  state.response = null;
}
