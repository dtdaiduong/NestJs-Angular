import { Test, TestingModule } from "@nestjs/testing";
import { PostgresConfig } from "./postgres-config.service";

describe("PostgresConfig", () => {
  let service: PostgresConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresConfig],
    }).compile();

    service = module.get<PostgresConfig>(PostgresConfig);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
