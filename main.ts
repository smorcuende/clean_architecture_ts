import process from "node:process";
import {buildServer} from "./src/infrastructure/http/server";

const port = Number(process.env.PORT) || 3000;

buildServer().then(app => {
    app.listen({port}, (err, address) => {
        if (err) {
            console.error("Error starting server:", err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
});
