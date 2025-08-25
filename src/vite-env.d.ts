/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_I8N_LOCALE: string;
  readonly VITE_ENV: string;
  readonly VITE_USE_MOCK_API: string;
  // more env variables...
}
