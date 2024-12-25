/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_CHAT_UTL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}