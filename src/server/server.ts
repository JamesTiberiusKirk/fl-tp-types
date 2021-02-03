import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import express, { NextFunction, Response, Request, Express } from 'express';
import { ServerConfig } from '@jamestiberiuskirk/fl-shared';

import { DbClient } from '../db_client/db_client';

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

    /**
     * Constructor.
     * @param conf Server config
     */
    constructor(conf: ServerConfig, db: DbClient) {
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
                // tslint:disable-next-line:no-console
                console.log(`server started at http://localhost:${this.conf.port}`);
                resolve();
            });
        });
    }

    /**
     * Manually close the HTTP connection.
     */
    // closeServer() :Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         this.app.close((err) => {
    //             if (err) return reject(err);
    //             //tslint:disable-next-line:no-console
    //             console.log(`closed server at http://localhost:${this.conf.port}`);
    //             resolve();
    //         });
    //     });
    // }

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


        // Injecting the database into each request
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.locals.db = this.db;
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