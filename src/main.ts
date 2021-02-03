import * as dotenv from 'dotenv';

import { MicroserviceConfig, ServerConfig, DbConfig } from '@jamestiberiuskirk/fl-shared';
import { Server } from './server/server';
import { DbClient } from './db_client/db_client';

dotenv.config();


const config: MicroserviceConfig = {
    name: process.env.MS_NAME ?? '',
    serverConfig: {
        port: process.env.HTTP_PORT ?? ''
    },
    dbConfig: {
        host: process.env.DB_HOST ?? '',
        port: process.env.DB_PORT ?? '',
        database: process.env.DB_NAME ?? '',
        username: process.env.DB_USERNAME ?? '',
        password: process.env.DB_PASSWORD ?? ''
    }
}

// tslint:disable-next-line:no-console
console.log(config);

const db: DbClient = new DbClient(config.dbConfig);
const httpServer: Server = new Server(config.serverConfig, db);

httpServer.initServer().then(() => {

});