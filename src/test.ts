import { getConnection } from "./connection/connection.selector";
import { performance } from 'perf_hooks';

(async () => {
    try {
        const connection = await getConnection("rozsdb:localhost:1212:example:root:");
        const collection = await connection.getCollection("users").connect();
        for (let i = 0; i < 10; i++) {
            const objects = await collection.findAll();
        }
        const start = performance.now();
        const objects = await collection.findAll();
        console.log("Objects:", objects.length);
        const end = performance.now();console.log("Time taken:", (end - start).toFixed(3), "ms");

    } catch (e) {
        console.error("Error:", e);
    }
})();
