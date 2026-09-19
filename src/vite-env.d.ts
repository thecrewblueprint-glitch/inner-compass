/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INNER_COMPASS_PREVIEW?: string;
  readonly VITE_OTHER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
