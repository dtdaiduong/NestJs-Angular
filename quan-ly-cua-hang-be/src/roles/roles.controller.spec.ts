import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { PostgresConfigModule } from "../services/postgres-config/postgres-config.module";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
class RolesServiceMock {
  create = jest.fn();
  query1 = jest.fn();
  findOne = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  findAll = jest.fn();
}
describe("RolesController", () => {
  let controller: RolesController;
  let rolesService: RolesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      imports: [PostgresConfigModule],
      providers: [
        { provide: RolesService, useClass: RolesServiceMock },
        SqlConnectService,
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  describe("findAll", () => {
    it("", () => {
      // arrange
      jest.spyOn(rolesService, "findAll").mockReturnValue(
        of({
          status: "string",
          message: "string",
          data: [],
          currentPage: 5,
          limit: 5,
          totalCount: 5,
        }),
      );
      // act
      // assert
      controller.findAll("sda", { page: 5, limit: 5 }).subscribe((data) => {
        expect(data).toEqual({
          status: "string",
          message: "string",
          data: [],
          currentPage: 5,
          limit: 5,
          totalCount: 5,
        });
      });
      expect(rolesService.findAll).toHaveBeenCalled();
    });
  });

  describe("GetRole", () => {
    it("GetRole", () => {
      // arrange
      jest.spyOn(rolesService, "findOne").mockReturnValue(
        of({
          status: "string",
          message: "string",
        }),
      );

      // act
      // assert
      controller.GetRole({ id: "5" }).subscribe((data) => {
        expect(data).toEqual({
          status: "string",
          message: "string",
        });
      });
      expect(rolesService.findOne).toHaveBeenCalled();
    });
  });
  describe("PutRole", () => {
    it("PutRole", () => {
      // arrange
      jest.spyOn(rolesService, "update").mockReturnValue(
        of({
          status: "string",
          message: "string",
        }),
      );
      // act
      // assert
      controller.PutRole(5, { name: "s" }).subscribe((data) => {
        expect(data).toEqual({
          status: "string",
          message: "string",
        });
      });
      expect(rolesService.update).toHaveBeenCalled();
    });
  });
  describe("DeleteRole", () => {
    it("DeleteRole", () => {
      // arrange
      jest.spyOn(rolesService, "delete").mockReturnValue(
        of({
          status: "string",
          message: "string",
        }),
      );
      // act
      // assert
      controller.DeleteRole(5).subscribe((data) => {
        expect(data).toEqual({
          status: "string",
          message: "string",
        });
      });
      expect(rolesService.delete).toHaveBeenCalled();
    });
  });
  describe("CreateRoles", () => {
    it("CreateRoles", () => {
      // arrange
      jest.spyOn(rolesService, "create").mockReturnValue(
        of({
          status: "string",
          message: "string",
        }),
      );
      // act
      // assert
      controller.CreateRoles({ name: "s" }).subscribe((data) => {
        expect(data).toEqual({
          status: "string",
          message: "string",
        });
      });
      expect(rolesService.create).toHaveBeenCalled();
    });
  });
});
