import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { throwError } from "rxjs";
import { PostgresConfig } from "../../services/postgres-config/postgres-config.service";
import { SqlConnectService } from "../../services/sql-connect/sql-connect.service";
import { AuthService } from "../auth.service";
import { LocalStrategy } from "./local.strategy";

describe("Local Stragety", () => {
  let local: LocalStrategy;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        AuthService,
        SqlConnectService,
        JwtService,
        PostgresConfig,
      ],
    }).compile();

    local = module.get<LocalStrategy>(LocalStrategy);
    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(local).toBeDefined();
  });

  it("validate fail if authentication service return null", async () => {
    const params = { email: "user@email.com", password: "fail" };
    jest.spyOn(service, "authentication").mockResolvedValue(null);

    await local.validate(params.email, params.password).catch((err) => {
      return throwError(() => new Error(err));
    });
  });

  it("validate success if authentication service return user", async () => {
    const params = { email: "user@email.com", password: "password" };
    const expected = {
      id: 1,
      email: "user@email.com",
      password: "examplePasswordReturn",
      created_at: new Date("2022-10-21T10:09:39.817Z"),
      updated_at: new Date("2022-10-21T10:09:39.817Z"),
      profile_id: 1,
    };
    jest.spyOn(service, "authentication").mockResolvedValue(expected);
    await local.validate(params.email, params.password).then((data) => {
      expect(data).toStrictEqual(expected);
    });
  });
});
