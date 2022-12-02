import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { SqlConnectModule } from "../services/sql-connect/sql-connect.module";
import { RolesModule } from "./roles.module";
import { Test } from "@nestjs/testing";
describe("RolesModule", () => {
  it("should compile the module", async () => {
    const module = await Test.createTestingModule({
      imports: [RolesModule, SqlConnectModule],
    }).compile();
    expect(module).toBeDefined();
    expect(module.get(RolesController)).toBeInstanceOf(RolesController);
    expect(module.get(RolesService)).toBeInstanceOf(RolesService);
  });
});
