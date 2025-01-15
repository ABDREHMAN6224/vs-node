"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const totalCPUs = os_1.default.cpus().length;
const PORT = process.env.PORT || 3000;
if (cluster_1.default.isPrimary) {
    console.log(`Total CPUs: ${totalCPUs}`);
    console.log(`Primary ${process.pid} is running`);
    // Fork workers
    for (let i = 0; i < totalCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} has exitted`);
        console.log('Starting a new worker');
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    app.get('/', (req, res) => {
        console.log(`Worker ${process.pid} is handling the request`);
        res.send('Hello World');
    });
    app.listen(PORT, () => {
        console.log(`Express server started on port ${PORT}`);
    });
}
