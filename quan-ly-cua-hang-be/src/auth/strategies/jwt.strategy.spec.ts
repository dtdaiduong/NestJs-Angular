import { Test, TestingModule } from "@nestjs/testing";
import { JwtStrategy } from "./jwt.strategy";

describe("JWT", () => {
  let jwt: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwt = module.get<JwtStrategy>(JwtStrategy);
  });

  it("should be defined", () => {
    expect(jwt).toBeDefined();
  });

  it("validate", async () => {
    const payload = { id: 1, email: "user@email.com" };
    await jwt.validate(payload).then((data) => {
      expect(data).toStrictEqual(payload);
    });
  });
});
