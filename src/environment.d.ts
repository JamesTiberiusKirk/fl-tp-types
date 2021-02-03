declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MS_NAME: string | undefined;
            HTTP_PORT: string | undefined;
            DB_HOST: string | undefined;
            DB_PORT: string | undefined;
            DB_USERNAME: string | undefined;
            DB_PASSWORD: string | undefined;
        }
    }
}

export { }