import { Module } from "@nestjs/common";
import { SqlConnectModule } from "../services/sql-connect/sql-connect.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [SqlConnectModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
