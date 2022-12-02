import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { SECRETKEY_ACCESS } from "../../constants";
import { AuthPayload } from "../interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRETKEY_ACCESS,
    });
  }

  async validate(payload: AuthPayload) {
    return { id: payload.id, email: payload.email };
  }
}
