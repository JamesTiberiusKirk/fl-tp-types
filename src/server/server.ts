import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import express, { NextFunction, Response, Request, Express } from 'express';
import { ServerConfig } from '@jamestiberiuskirk/fl-shared';

import { DbClient } from '../clients/db';
import { Logger } from '@jamestiberiuskirk/fl-shared/dist/lib/logger';

/**
 * Class for instantiating HTTP server.
 */
export class Server {

    /* Server conf. */
    conf: ServerConfig;

    /* The Express app. */
    app: Express;

    /* The db client */
    db: DbClient;

    /* A logger instance. */
    logger: Logger;

    /**
     * Constructor.
     * @param conf Server config
     */
    constructor(conf: ServerConfig, db: DbClient, logger: Logger) {
        this.logger = logger;
        this.conf = conf;
        this.app = express();
        this.db = db;
        this.initMiddleware();
        this.initRoutes();
    }

    /**
     * Init express server.
     */
    initServer(): Promise<void> {
        return new Promise((resolve) => {
            this.app.listen(this.conf.port, () => {
                this.logger.log('Http server started on port ' + this.conf.port);
                resolve();
            });
        });
    }

    /**
     * Initializing all the routers and routes.
     */
    initRoutes() {

        // TEMP
        this.app.get('/', (req, res) => {
            res.send('Hello World');
        });
    }

    /**
     * Initializing middleware.
     */
    initMiddleware() {
        this.disableServerCors();
        this.app.use(morgan('tiny'));
        this.app.use(bodyParser.json());


        // Injecting the database and the logger into each request
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.locals.db = this.db;
            res.locals.logger = this.logger;
            next();
        })
    }


    /**
     * This is for disabling CORS request.
     */
    disableServerCors() {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }
}