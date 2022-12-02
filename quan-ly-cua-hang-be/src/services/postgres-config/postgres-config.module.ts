import { Module } from "@nestjs/common";
import { PostgresConfig } from "./postgres-config.service";

@Module({
  providers: [PostgresConfig],
  exports: [PostgresConfig],
})
export class PostgresConfigModule {}
