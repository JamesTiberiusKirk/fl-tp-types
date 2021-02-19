import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import express, { NextFunction, Response, Request, Express } from 'express';

import { Conf, Env, Logger, JwtWrapper } from '@jamestiberiuskirk/fl-shared';

import { DbClient } from '../clients/db';
import {
    AddTrackingPointTypes,
    DeleteTrackingPointTypes,
    GetAllTrackingPoints,
    UpdateTrackingPointTypes
} from './controllers/TrackingPointsTypes';

/**
 * Class for instantiating HTTP server.
 */
export class Server {

    /* Server conf. */
    conf: Conf.ServerConfig;

    /* The Express app. */
    app: Express;

    /* The db client */
    db: DbClient;

    /**
     * Constructor.
     * @param conf Server config.
     */
    constructor(conf: Conf.ServerConfig, db: DbClient) {
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
                Logger.log('Http server started on port ' + this.conf.port);
                resolve();
            });
        });
    }

    /**
     * Initializing all the routers and routes.
     */
    initRoutes() {
        this.app.post('/', AddTrackingPointTypes);
        this.app.get('/', GetAllTrackingPoints);
        this.app.put('/', UpdateTrackingPointTypes);
        this.app.delete('/', DeleteTrackingPointTypes);
    }

    /**
     * Initializing middleware.
     */
    initMiddleware() {
        this.disableServerCors();

        this.app.use(morgan(`[${Env.getMsName().toUpperCase()}]: [HTTP]: :method :url :status :res[content-length] kb - :response-time ms`));
        this.app.use(bodyParser.json());

        // Injecting the database and the logger into each request
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.locals.db = this.db;
            next();
        });

        this.app.use(JwtWrapper.authMiddleware);
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
