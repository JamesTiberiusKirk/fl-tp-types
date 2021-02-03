import * as dotenv from 'dotenv';

import { MicroserviceConfig, ServerConfig, DbConfig } from '@jamestiberiuskirk/fl-shared';
import { Server } from './server/server';
import { DbClient } from './clients/db';
import { Logger, LoggerConfig } from '@jamestiberiuskirk/fl-shared/dist/lib/logger';

dotenv.config();


const config: MicroserviceConfig = {
    name: process.env.MS_NAME ?? '',
    serverConfig: {
        port: process.env.SERVER_PORT ?? ''
    },
    dbConfig: {
        host: process.env.DB_HOST ?? '',
        port: process.env.DB_PORT ?? '',
        database: process.env.DB_NAME ?? '',
        username: process.env.DB_USER ?? '',
        password: process.env.DB_PASSWORD ?? '',
    },
    jwt_secret: process.env.JWT_SECRET ?? ''
}


const loggerConfig: LoggerConfig = {
    serviceName: config.name,
}


const logger: Logger = new Logger(loggerConfig);
const db: DbClient = new DbClient(config.dbConfig, logger);

db.init().then(() => {
    const httpServer: Server = new Server(config.serverConfig, db, logger);
    httpServer.initServer();
});
