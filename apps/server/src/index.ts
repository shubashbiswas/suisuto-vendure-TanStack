import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

const isSynchronize = Boolean(config.dbConnectionOptions.synchronize);

const preBootstrap = isSynchronize
    ? Promise.resolve()
    : runMigrations(config);

preBootstrap
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
