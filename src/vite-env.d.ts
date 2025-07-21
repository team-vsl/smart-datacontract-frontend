/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_I8N_LOCALE: string;
  readonly VITE_ENV: string;
  // more env variables...
}
