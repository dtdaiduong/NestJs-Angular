import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import * as path from "path";
import { Pool } from "pg";
import { from, map } from "rxjs";
import { SQLResult } from "src/shared/sqlResult";
import { PostgresConfig } from "../postgres-config/postgres-config.service";

@Injectable()
export class SqlConnectService {
  constructor(private readonly pgConfig: PostgresConfig) {}
  public async query(text: string, params?: Array<unknown>) {
    const pool = new Pool({
      host: this.pgConfig.postgres.host,
      database: this.pgConfig.postgres.database,
      user: this.pgConfig.postgres.user,
      password: this.pgConfig.postgres.password,
      port: this.pgConfig.postgres.port,
    });
    const res = await pool.query(text, params);
    pool.end();
    return res;
  }

  public query1(text: string, params?: Array<unknown>) {
    const pool = new Pool({
      host: this.pgConfig.postgres.host,
      database: this.pgConfig.postgres.database,
      user: this.pgConfig.postgres.user,
      password: this.pgConfig.postgres.password,
      port: this.pgConfig.postgres.port,
    });
    return from(pool.query(text, params)).pipe(
      map((res) => {
        pool.end();
        return res as SQLResult;
      }),
    );
  }

  public readFileSQL(fileSqlName: string) {
    const sqlFilePath = path.join(__dirname, `../../assets/sql/${fileSqlName}`);
    return readFileSync(sqlFilePath).toString();
  }
}
