/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INNER_COMPASS_PREVIEW?: string;
  readonly VITE_INNER_COMPASS_DEBUG?: string;
  readonly VITE_LEGAL_OPERATOR_NAME?: string;
  readonly VITE_LEGAL_CONTACT_EMAIL?: string;
  readonly VITE_LEGAL_COUNSEL_REVIEWED?: string;
  readonly VITE_PUBLIC_LAUNCH_APPROVED?: string;
  readonly VITE_OTHER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
