declare global {
    namespace BunJS{
        interface ProcessEnv{
            botToken: string;
            //lehalanGuildId: string;
            //testGuildId: string;
            environment: "dev" | "prod" | "debug"
        }
    }
}

export {};