import express from 'express';
import cluster from 'cluster';
import os from 'os';

const totalCPUs = os.cpus().length;

const PORT = process.env.PORT || 3000;

if (cluster.isPrimary){
    console.log(`Total CPUs: ${totalCPUs}`);
    console.log(`Primary ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < totalCPUs; i++){
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} has exitted`);
        console.log('Starting a new worker');
        cluster.fork();
    });
}else{
    const app = express();

    app.get('/', (req, res) => {
        console.log(`Worker ${process.pid} is handling the request`);
        res.send('Hello World');
    });

    app.listen(PORT, () => {
        console.log(`Express server started on port ${PORT}`);
    });
}