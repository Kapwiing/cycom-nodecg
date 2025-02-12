declare const config: {
    baseURL: string;
    host: string;
    port: number;
    exitOnUncaught: boolean;
    logging: {
        console: {
            enabled: boolean;
            level: "verbose" | "debug" | "info" | "warn" | "error" | "silent";
            timestamps: boolean;
            replicants: boolean;
        };
        file: {
            path: string;
            enabled: boolean;
            level: "verbose" | "debug" | "info" | "warn" | "error" | "silent";
            timestamps: boolean;
            replicants: boolean;
        };
    };
    bundles: {
        enabled: string[] | null;
        disabled: string[] | null;
        paths: string[];
    };
    login: {
        enabled: boolean;
        forceHttpsReturn: boolean;
        twitch?: {
            enabled: boolean;
            allowedIds: string[];
            scope: string;
            allowedUsernames: string[];
            clientID?: string | undefined;
            clientSecret?: string | undefined;
        } | undefined;
        steam?: {
            enabled: boolean;
            allowedIds: string[];
            apiKey?: string | undefined;
        } | undefined;
        local?: {
            enabled: boolean;
            allowedUsers: {
                username: string;
                password: string;
            }[];
        } | undefined;
        discord?: {
            enabled: boolean;
            scope: string;
            allowedUserIDs: string[];
            allowedGuilds: {
                guildID: string;
                allowedRoleIDs: string[];
                guildBotToken: string;
            }[];
            clientID?: string | undefined;
            clientSecret?: string | undefined;
        } | undefined;
        sessionSecret?: string | undefined;
    };
    ssl: {
        enabled: boolean;
        allowHTTP: boolean;
        keyPath?: string | undefined;
        certificatePath?: string | undefined;
        passphrase?: string | undefined;
    };
    sentry: {
        enabled: boolean;
        dsn?: string | undefined;
    };
}, filteredConfig: import("../../types/nodecg").NodeCG.FilteredConfig;
export { config, filteredConfig };
export declare const exitOnUncaught: boolean;
export declare const sentryEnabled: boolean;
