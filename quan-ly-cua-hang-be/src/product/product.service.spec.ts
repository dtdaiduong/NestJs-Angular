import { Test, TestingModule } from "@nestjs/testing";
import { lastValueFrom, of, throwError } from "rxjs";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { ProductService } from "./product.service";
import * as fs from "fs";
import { DeleteImageFile } from "../utils/deleteImageFile";
export class BaseError extends Error {
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
describe("ProductService", () => {
  let provider: ProductService;
  let sql: SqlConnectService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: SqlConnectService, useClass: SQLServiceMock },
      ],
    }).compile();

    provider = module.get<ProductService>(ProductService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
  describe("create", () => {
    it("create product success", () => {
      // arrange
      const expected = {
        status: "string",
        message: "string",
        data: {
          id: 5,
          name: "string",
          description: "string",
          price: 5,
          image: "string",
          category: [],
        },
      };
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 5, rows: [{ id: 5 }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 5, data: { id: 1 } }),
        );
      jest.spyOn(provider, "findOne").mockReturnValueOnce(of(expected));
      // act
      // assert
      return lastValueFrom(
        provider.create(
          { name: "", description: "", price: 45, category: "" },
          "",
        ),
      ).then((data) => {
        expect(data).toEqual({
          ...expected,
          message: "Created product successfully",
          status: "success",
        });
      });
    });
    it("create product fail when product is exist ", () => {
      // arrange
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(throwError(() => new BaseError("sadsadsa", "23505")));
      // act
      // assert

      return lastValueFrom(
        provider.create(
          { name: "", description: "", price: 45, category: "" },
          "",
        ),
      ).catch((err) => {
        expect(sql.query1).toHaveBeenCalled();

        expect(err.response.message).toBe("Name Product already exists");
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

      return lastValueFrom(
        provider.create(
          { name: "", description: "", price: 45, category: "" },
          "",
        ),
      ).catch((err) => {
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
    it("should find all product ", () => {
      // arrange
      jest.spyOn(sql, "readFileSQL").mockReturnValue("product/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 5, rows: [{ id: 5 }] }),
        );
      // act
      // assert
      provider.findAll(0, 5, "", "[1]").subscribe((data) => {
        expect(data).toEqual([{ id: 5 }]);
      });
      expect(sql.query1).toHaveBeenCalled();
    });
    describe("Get list product", () => {
      it("Get list product with pagination ", () => {
        // arrange
        jest
          .spyOn(sql, "readFileSQL")
          .mockReturnValue("product/searchRole.sql");
        jest
          .spyOn(sql, "query1")
          .mockReturnValueOnce(of({ command: "string", rowCount: 5 }));
        jest
          .spyOn(sql, "query1")
          .mockReturnValueOnce(
            of({ command: "string", rowCount: 4, rows: [{ id: 5 }] }),
          );

        // act
        // assert
        return lastValueFrom(
          provider.findAll(1, 5, "", "[1]", "name", "asc"),
        ).then((data) => {
          expect(data).toEqual({
            currentPage: 1,
            data: [
              {
                id: 5,
              },
            ],
            limit: 5,
            message: "Get list product successfully",
            status: "success",
            totalCount: 5,
            totalPage: 1,
          });
        });
        // provider.findAll(1, 5, "", "[1]").subscribe((data) => {
        //   expect(data).toEqual([{ id: 5 }]);
        // });
        // expect(sql.query1).toHaveBeenCalled();
      });
      it("Get list product with default value ", () => {
        // arrange
        jest
          .spyOn(sql, "readFileSQL")
          .mockReturnValue("product/searchRole.sql");
        jest
          .spyOn(sql, "query1")
          .mockReturnValueOnce(of({ command: "string", rowCount: 5 }));
        jest
          .spyOn(sql, "query1")
          .mockReturnValueOnce(
            of({ command: "string", rowCount: 4, rows: [{ id: 5 }] }),
          );

        // act
        // assert
        return lastValueFrom(provider.findAll()).then((data) => {
          expect(data).toEqual({
            currentPage: 1,
            data: [
              {
                id: 5,
              },
            ],
            limit: 5,
            message: "Get list product successfully",
            status: "success",
            totalCount: 5,
            totalPage: 1,
          });
        });
        // provider.findAll(1, 5, "", "[1]").subscribe((data) => {
        //   expect(data).toEqual([{ id: 5 }]);
        // });
        // expect(sql.query1).toHaveBeenCalled();
      });
    });
  });
  describe("findone", () => {
    it("findone product success when findAll func is run", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("product/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(
          of({ command: "string", rowCount: 5, rows: [{ id: 5, name: "a" }] }),
        );

      // act
      // assert
      return lastValueFrom(provider.findOne(1)).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Get product successfully",
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
      return lastValueFrom(provider.findOne(1)).catch((err) => {
        expect(err.message).toBe("Not found Product by id : 1");
      });
      // provider.findOne(1).subscribe((data) => {

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
      return lastValueFrom(provider.findOne(1)).catch((err) => {
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
      jest.spyOn(provider, "findOne").mockReturnValue(
        of({
          status: "string",
          message: "string",
          data: {
            id: 5,
            name: "El",
            description: "Hue",
            price: 5,
            image: "/uploads/1660724086857-uchihahahaha.jpg",
            category: [],
          },
        }),
      );
      jest.mock("fs");
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "unlinkSync").mockReturnThis();

      // act
      // assert
      return lastValueFrom(
        provider.update(
          1,
          {
            name: "",
            description: "",
            price: 454,
            category: "1,2",
          },
          "agd",
        ),
      ).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Updated product successfully",
        });
      });
    });

    it("update fail ", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      // jest
      //   .spyOn(sql, "query1")
      //   .mockReturnValue(of({ command: "string", rowCount: 0, rows: [] }));
      jest
        .spyOn(provider, "findOne")
        .mockReturnValue(throwError(() => new Error()));
      // act
      // assert
      return lastValueFrom(
        provider.update(1, {
          name: "",
          description: "",
          price: 454,
          category: "1,2",
        }),
      ).catch((err) => {
        expect(err.message).toBe("Error");
      });
      // provider.findOne({ id: "1" }).subscribe((data) => {

      //   expect(data.message).toBe("");
      // });
      // expect(sql.query1).toHaveBeenCalled();
    });
    it("update fail when Not found product ", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(
          of({ command: "string", rowCount: 0, rows: [{ id: 5, name: "a" }] }),
        );
      jest.spyOn(provider, "findOne").mockReturnValue(
        of({
          status: "string",
          message: "string",
          data: {
            id: 5,
            name: "El",
            description: "Hue",
            price: 5,
            image: "/uploads/1660724086857-uchihahahaha.jpg",
            category: [],
          },
        }),
      );

      // act
      // assert
      return lastValueFrom(
        provider.update(1, {
          name: "",
          description: "",
          price: 454,
          category: "1,2",
        }),
      ).catch((err) => {
        expect(err.message).toBe("Not Found product by id: 1");
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
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 1, rows: [{ id: 5, name: "a" }] }),
        );
      jest.spyOn(provider, "findOne").mockReturnValue(
        of({
          status: "string",
          message: "string",
          data: {
            id: 5,
            name: "El",
            description: "Hue",
            price: 5,
            image: "/uploads/1660724086857-uchihahahaha.jpg",
            category: [],
          },
        }),
      );
      jest.mock("fs");
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(throwError(() => new BaseError("", "23505")));

      // act
      // assert
      return lastValueFrom(
        provider.update(1, {
          name: "",
          description: "",
          price: 454,
          category: "1,2",
        }),
      ).catch((err) => {
        expect(sql.query1).toHaveBeenCalled();

        expect(err.message).toBe("Name product already exists");
      });
    });
  });
  describe("delete", () => {
    it("delete role success", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 0, rows: [{ id: 5 }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 1, rows: [{ id: 5 }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 1, rows: [{ id: 5 }] }),
        );
      jest.spyOn(provider, "findOne").mockReturnValue(
        of({
          status: "string",
          message: "string",
          data: {
            id: 5,
            name: "El",
            description: "Hue",
            price: 5,
            image: "/uploads/1660724086857-uchihahahaha.jpg",
            category: [],
          },
        }),
      );
      jest.mock("fs");
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "unlinkSync").mockReturnThis();
      // act
      // assert
      return lastValueFrom(provider.delete(1)).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Deleted product successfully",
        });
      });
    });
    it("delete role fail when role is not exist ", () => {
      // arrange
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(
          of({ command: "string", rowCount: 1, rows: [{ id: 5, name: "a" }] }),
        );
      // act
      // assert

      return lastValueFrom(provider.delete(1)).catch((err) => {
        expect(sql.query1).toHaveBeenCalled();

        expect(err.message).toBe(
          "Product is already in Order Details use, cannot delete it",
        );
      });
      // provider.create({ name: "sd" }).subscribe((data) => {
      //   expect(data).toEqual({
      //     message: "create role successfully",
      //     status: "success",
      //     data: { id: 5, name: "sd" },
      //   });
      // });
    });
    it("Product is not found", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 0, rows: [{ id: 5 }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 5, rows: [{ id: 5 }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 2, rows: [{ id: 5 }] }),
        );
      jest.spyOn(provider, "findOne").mockReturnValue(
        of({
          status: "string",
          message: "string",
          data: {
            id: 5,
            name: "El",
            description: "Hue",
            price: 5,
            image: "/uploads/1660724086857-uchihahahaha.jpg",
            category: [],
          },
        }),
      );
      jest.mock("fs");
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "unlinkSync").mockReturnThis();
      // act
      // assert
      return lastValueFrom(provider.delete(1)).catch((err) => {
        expect(err.message).toBe("Not found Product by id : 1");
      });
    });
    it("delete role fail   ", () => {
      // arrange
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "readFileSQL")
        .mockReturnValueOnce("roles/searchRole.sql");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 0, rows: [{ id: 5 }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          of({ command: "string", rowCount: 1, rows: [{ id: 5 }] }),
        );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(throwError(() => new Error())),
        jest.spyOn(provider, "findOne").mockReturnValue(
          of({
            status: "string",
            message: "string",
            data: {
              id: 5,
              name: "El",
              description: "Hue",
              price: 5,
              image: "/uploads/1660724086857-uchihahahaha.jpg",
              category: [],
            },
          }),
        );
      // jest.mock("fs");
      // jest.spyOn(fs, "existsSync").mockReturnValue(true);
      // jest.spyOn(fs, "unlinkSync").mockReturnThis();
      // act
      // assert
      return lastValueFrom(provider.delete(1)).catch((err) => {
        console.log(err);
        expect(err.message).toBe("Error");
      });
    });
  });
});
