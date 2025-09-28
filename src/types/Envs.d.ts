export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_DATE_FORMAT: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly glob: (
      pattern: string,
      options?: { eager?: boolean; import?: string }
    ) => Record<string, unknown>;
  }
}
