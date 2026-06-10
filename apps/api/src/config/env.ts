import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: Number(process.env.PORT) || 4000,
    nodeEnv: process.env.NODE_ENV || "development",

    aiProvider: process.env.AI_PROVIDER || "mock",
    aiApiKey: process.env.AI_API_KEY || "",

    suiNetwork: process.env.SUI_NETWORK || "testnet",
    suiRpcUrl: process.env.SUI_RPC_URL || "",

    walrusEndpoint: process.env.WALRUS_ENDPOINT || "",
};