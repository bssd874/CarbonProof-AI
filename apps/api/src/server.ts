import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
    console.log("");
    console.log("==========================================");
    console.log(" CarbonProof AI Backend");
    console.log("==========================================");
    console.log(` Environment : ${env.nodeEnv}`);
    console.log(` AI Provider : ${env.aiProvider}`);
    console.log(` Server      : http://localhost:${env.port}`);
    console.log(
        ` Health      : http://localhost:${env.port}/api/health`
    );
    console.log("==========================================");
    console.log("");
});