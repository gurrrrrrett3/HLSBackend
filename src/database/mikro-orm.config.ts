import 'dotenv/config';
import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
    entities: [
        'dist/database/entities/*entity.js',
    ],
    entitiesTs: [
        'src/database/entities/*.entity.ts',
    ],
    driver: PostgreSqlDriver,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    metadataProvider: TsMorphMetadataProvider,
    debug: true
})
