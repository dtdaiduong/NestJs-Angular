import { InternalServerErrorException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EmptyError, lastValueFrom, of, throwError } from "rxjs";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { RolesService } from "./roles.service";
class BaseError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super();
    this.message = message;
    this.code = code;
    this.name = "Error";
  }
}
class SQLServiceMock {
  query1 = jest.fn();
  query = jest.fn();
  readFileSQL = jest.fn();
}
describe("RolesService", () => {
  let provider: RolesService;
  let sql: SqlConnectService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: SqlConnectService, useClass: SQLServiceMock },
      ],
    }).compile();

    provider = module.get<RolesService>(RolesService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
  describe("create", () => {
    it("create role success", () => {
      // arrange
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(
          of({ command: "string", rowCount: 5, rows: [{ id: 5 }] }),
        );
      // act
      // assert
      provider.create({ name: "sd" }).subscribe((data) => {
        expect(data).toEqual({
          message: "create role successfully",
          status: "success",
          data: { id: 5, name: "sd" },
        });
      });
      expect(sql.query1).toHaveBeenCalled();
    });
    it("create role fail when role is exist ", () => {
      // arrange
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(throwError(() => new BaseError("sadsadsa", "23505")));
      // act
      // assert

      return lastValueFrom(provider.create({ name: "sd" })).catch((err) => {
        expect(sql.query1).toHaveBeenCalled();

        expect(err.response.message).toBe("Name Role already exists");
      });
      // provider.create({ name: "sd" }).subscribe((data) => {
      //   expect(data).toEqual({
      //     message: "create role successfully",
      //     status: "success",
      //     data: { id: 5, name: "sd" },
      //   });
      // });
    });
    it("create fail  ", () => {
      // arrange
      jest.spyOn(sql, "query1").mockReturnValue(throwError(() => new Error()));
      // act
      // assert

      return lastValueFrom(provider.create({ name: "sd" })).catch((err) => {
        expect(sql.query1).toHaveBeenCalled();

        expect(err.response.statusCode).toBe(500);
      });
      // provider.create({ name: "sd" }).subscribe((data) => {
      //   expect(data).toEqual({
      //     message: "create role successfully",
      //     status: "success",
      //     data: { id: 5, name: "sd" },
      //   });
      // });
    });
  });
  describe("findAll", () => {
    it("should find all roles success when findAll func is run", () => {
      // arrange
      jest.spyOn(sql, "readFileSQL").mockReturnValue("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 5, rows: [{ id: 5 }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(of({ command: "string", rowCount: 5 }));
      // act
      // assert
      provider.findAll().subscribe((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Get list successfully",
          data: [{ id: 5 }],
          currentPage: 1,
          limit: 5,
          totalCount: 5,
        });
      });
      expect(sql.query1).toHaveBeenCalled();
    });
  });
  describe("findone", () => {
    it("findone roles success when findAll func is run", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(
          of({ command: "string", rowCount: 5, rows: [{ id: 5, name: "a" }] }),
        );

      // act
      // assert
      provider.findOne({ id: "1" }).subscribe((data) => {
        expect(data).toEqual({
          status: "success",
          message: "get role by id successfully",
          data: { id: 5, name: "a" },
        });
      });
      expect(sql.query1).toHaveBeenCalled();
    });

    it("findone empty", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(of({ command: "string", rowCount: 5, rows: [] }));

      // act
      // assert
      return lastValueFrom(provider.findOne({ id: "1" })).catch((err) => {
        expect(err.message).toBe("Not Found Role by id: 1");
      });
      // provider.findOne({ id: "1" }).subscribe((data) => {

      //   expect(data.message).toBe("");
      // });
      // expect(sql.query1).toHaveBeenCalled();
    });
    it("findone not exist", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest.spyOn(sql, "query1").mockReturnValue(throwError(() => new Error()));

      // act
      // assert
      return lastValueFrom(provider.findOne({ id: "1" })).catch((err) => {
        expect(sql.query1).toHaveBeenCalled();

        expect(err.message).toBe("Error");
      });
    });
  });
  describe("update", () => {
    it("update roles success when update func is run", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(
          of({ command: "string", rowCount: 1, rows: [{ id: 5, name: "a" }] }),
        );

      // act
      // assert
      provider.update(1, { name: "anhtu" }).subscribe((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Update role successfully",
        });
      });
      expect(sql.query1).toHaveBeenCalled();
    });

    it("update fail when role is not exist", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(of({ command: "string", rowCount: 0, rows: [] }));

      // act
      // assert
      return lastValueFrom(provider.update(5, { name: "1" })).catch((err) => {
        expect(err.message).toBe("Not Found Role by id: 5");
      });
      // provider.findOne({ id: "1" }).subscribe((data) => {

      //   expect(data.message).toBe("");
      // });
      // expect(sql.query1).toHaveBeenCalled();
    });
    it("update not exist ", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest.spyOn(sql, "query1").mockReturnValue(throwError(() => new Error()));

      // act
      // assert
      return lastValueFrom(provider.update(5, { name: "1" })).catch((err) => {
        expect(err.message).toBe("Error");
      });
      // provider.findOne({ id: "1" }).subscribe((data) => {

      //   expect(data.message).toBe("");
      // });
      // expect(sql.query1).toHaveBeenCalled();
    });
    it("update fail when name role is  exist", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(throwError(() => new BaseError("", "23505")));

      // act
      // assert
      return lastValueFrom(provider.update(1, { name: "1" })).catch((err) => {
        expect(sql.query1).toHaveBeenCalled();

        expect(err.message).toBe("Name Role already exists");
      });
    });
  });
  describe("delete", () => {
    it("delete Roles Success", () => {
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("check-User-Use-Roles.sql");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 0, rows: [{ id: 5, name: "a" }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 1, rows: [{ id: 5, name: "a" }] }),
        );
      const expected = {
        status: "success",
        message: "Deleted Roles successfully",
      };
      provider.delete(1).subscribe((data) => {
        expect(data).toEqual(expected);
      });
    });

    it("delete Roles Fail Conflict", () => {
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("check-User-Use-Roles.sql");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 1, rows: [{ id: 5, name: "a" }] }),
        );
      const expected = {
        statusCode: 409,
        message: "Roles is already in use",
        error: "Conflict",
      };
      provider.delete(1).subscribe((data) => {
        expect(data).toEqual(expected);
      });
    });

    it("delete Roles Fail EMPTY", () => {
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("check-User-Use-Roles.sql");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 0, rows: [{ id: 5, name: "a" }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 0, rows: [{ id: 5, name: "a" }] }),
        );
      const expected = {
        statusCode: 404,
        message: "Not found Roles by id: 70",
        error: "Not Found",
      };
      provider.delete(70).subscribe((data) => {
        expect(data).toEqual(expected);
      });
    });
    it("delete Roles Fail Internal Server", () => {
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("check-User-Use-Roles.sql");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 0, rows: [{ id: 5, name: "a" }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          throwError(() => new InternalServerErrorException()),
        );
      const expected = {
        statusCode: 500,
        message: "Internal server error",
      };
      provider.delete(9999999999).subscribe((data) => {
        expect(data).toEqual(expected);
      });
    });
  });
});
