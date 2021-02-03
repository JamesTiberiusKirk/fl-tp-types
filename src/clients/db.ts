import { ConnectionOptions, connect, Connection, disconnect } from "mongoose";

import { DbConfig } from '@jamestiberiuskirk/fl-shared/dist/lib/models/conf.model';
import { Logger } from '@jamestiberiuskirk/fl-shared/dist/lib/logger';

/**
 * Class for instantiating a HTTP client.
 */
export class DbClient {

    /* Database config. */
    dbConfig: DbConfig;

    /* Database connection. */
    conn!: Connection;

    /* Logger instance. */
    logger: Logger;

    constructor(dbConfig: DbConfig, logger: Logger) {
        this.dbConfig = dbConfig;
        this.logger = logger;
    }

    /* Initializes the db connection */
    async init() {
        const mongoURI = `mongodb://${this.dbConfig.username}:${this.dbConfig.password}@${this.dbConfig.host}:${this.dbConfig.port}/${this.dbConfig.database}`;
        try {
            const options: ConnectionOptions = {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            };
            await connect(mongoURI, options);
            this.logger.dbLog('Database connected');
        } catch (err) {
            this.logger.dbLog(err.message);
            process.exit(1);
        }
    };

    /* Disconnect function. */
    disconnect() {
        if (!this.conn) {
            return;
        }

        disconnect().then(() => {
            this.logger.dbLog('Database disconnected');
        });

    }
}