declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_DATE_FORMAT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: (pattern: string, options: { eager: boolean; import: string }) => Record<string, unknown>;
}
