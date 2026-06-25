import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: Number(process.env.PORT) || 4000,
    nodeEnv: process.env.NODE_ENV || "development",
    dataStore:
        process.env.DATA_STORE === "memory"
            ? "memory"
            : "postgres",

    aiProvider: process.env.AI_PROVIDER || "gemini",
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    geminiModel:
        process.env.GEMINI_MODEL || "gemini-3.5-flash",

    uploadMaxSizeMb:
        Number(process.env.UPLOAD_MAX_SIZE_MB) || 5,

    suiNetwork: process.env.SUI_NETWORK || "testnet",
    suiRpcUrl: process.env.SUI_RPC_URL || "",

    walrusEndpoint: process.env.WALRUS_ENDPOINT || "",
};
