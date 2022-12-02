import { Module } from "@nestjs/common";
import { PostgresConfigModule } from "../postgres-config/postgres-config.module";
import { SqlConnectService } from "./sql-connect.service";

@Module({
  imports: [PostgresConfigModule],
  providers: [SqlConnectService],
  exports: [SqlConnectService],
})
export class SqlConnectModule {}
