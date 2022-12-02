import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { PostgresConfig } from "../postgres-config/postgres-config.service";
import { SqlConnectService } from "./sql-connect.service";

describe("SqlConnectService", () => {
  let service: SqlConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqlConnectService, PostgresConfig],
    }).compile();

    service = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("readFileSQL", () => {
    it("should return value when it is call", () => {
      // Arrange
      const filePath = "category/delete-category.sql";
      // Act
      const fileValue = service.readFileSQL(filePath);
      // Assert
      expect(fileValue).toBeTruthy();
    });
  });
  describe("query1", () => {
    it("should be call and return SQLResult", (done) => {
      // Arrange
      const filePath = "roles/selectNameRolesById.sql";
      const query = service.readFileSQL(filePath);
      const param = [1];
      const spyQuery1 = jest.spyOn(service, "query1");
      // Act
      service.query1(query, param).subscribe(() => {
        done();
      });
      // Assert
      expect(spyQuery1).toHaveBeenCalledWith(query, param);
    });
  });

  describe("query", () => {
    it("should be call and return SQLResult", async () => {
      // Arrange
      const filePath = "roles/selectNameRolesById.sql";
      const query = service.readFileSQL(filePath);
      const param = [1];
      const spyQuery = jest.spyOn(service, "query");
      // Act
      await service.query(query, param);
      // Assert
      expect(spyQuery).toHaveBeenCalledWith(query, param);
    });
  });
});
