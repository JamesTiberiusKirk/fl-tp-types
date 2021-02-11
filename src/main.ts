import * as dotenv from 'dotenv';

import { MicroserviceEnvConfig } from '@jamestiberiuskirk/fl-shared/dist/lib/Env';
import { initStopHandler } from '@jamestiberiuskirk/fl-shared/dist/lib/ProcSigHandlers';
import { Server } from './server/server';
import { DbClient } from './clients/db';

initStopHandler();
dotenv.config();


const config: MicroserviceEnvConfig = new MicroserviceEnvConfig();

const db: DbClient = new DbClient(config.dbConfig);

db.init().then(() => {
    const httpServer: Server = new Server(config.serverConfig, db);
    httpServer.initServer();
});