import { MikroORM, PostgreSqlDriver, EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import Logger from "../utils/logger.js";

let instance: Database;


export default class Database {
  private _orm!: MikroORM<EntityManager<PostgreSqlDriver>>;
  private _onLoadCallbacks: (() => any)[] = [];

  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;
  }

  public async init() {
    const orm = await MikroORM.init<PostgreSqlDriver>({
      entities: ["./dist/database/entities/*.entity.js"],
      driver: PostgreSqlDriver,
      tsNode: true,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      dbName: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      metadataProvider: TsMorphMetadataProvider,
      debug: process.env.DEBUG === "true",
    }).catch((err) => {
      Logger.error("Database", "Failed to initialize database");
      Logger.error("Database", err);
      console.error(err);
      process.exit(1);
    });

    Logger.info("Database", "Database initialized");

    this._orm = orm;

    for (const callback of this._onLoadCallbacks) {
      callback();
    }

    this._onLoadCallbacks = [];
  }

  public async close(): Promise<void> {
    await this._orm.close(true);
  }

  public get isReady(): boolean {
    return !!this._orm;
  }

  public get em(): EntityManager<PostgreSqlDriver> {
    return this._orm.em.fork();
  }

  public get orm(): MikroORM<EntityManager<PostgreSqlDriver>> {
    return this._orm;
  }

  public onLoad(callback: () => any) {
    if (this.isReady) {
      callback();
    } else {
      this._onLoadCallbacks.push(callback);
    }
  }
}