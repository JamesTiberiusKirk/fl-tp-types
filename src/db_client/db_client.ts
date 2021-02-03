import { DbConfig } from '@jamestiberiuskirk/fl-shared';

/**
 * Class for instantiating a HTTP client.
 */
export class DbClient {
    dbConfig: DbConfig;

    constructor(dbConfig: DbConfig) {
        this.dbConfig = dbConfig;
    }
}