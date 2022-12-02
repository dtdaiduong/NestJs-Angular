import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import * as path from "path";
import { IPostgresConfig } from "./postgres-config.i";

@Injectable()
export class PostgresConfig {
  public postgres: IPostgresConfig;
  private readonly configFile = path.join(
    __dirname,
    "../../assets/app-config.json",
  );

  constructor() {
    this.postgres = this.readFileJSON();
  }

  private settingKey = "postgres";
  public readFileJSON() {
    const data = JSON.parse(readFileSync(this.configFile).toString());
    return data[this.settingKey];
  }
}
