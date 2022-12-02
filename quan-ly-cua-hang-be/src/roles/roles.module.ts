import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { SqlConnectModule } from "../services/sql-connect/sql-connect.module";

@Module({
  imports: [SqlConnectModule],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
