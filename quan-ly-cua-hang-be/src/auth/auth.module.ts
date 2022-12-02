import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SqlConnectModule } from "../services/sql-connect/sql-connect.module";
import { EXPRIRESIN_ACCESS, SECRETKEY_ACCESS } from "../constants";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy, LocalStrategy } from "./strategies";

@Module({
  imports: [
    SqlConnectModule,
    PassportModule,
    JwtModule.register({
      secret: SECRETKEY_ACCESS,
      signOptions: { expiresIn: EXPRIRESIN_ACCESS },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
