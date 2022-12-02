import { Test, TestingModule } from "@nestjs/testing";
import { catchError, of, throwError } from "rxjs";
import { PostgresConfig } from "../services/postgres-config/postgres-config.service";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import {
  findAll,
  ResponseData,
  ResponseStatusMess,
} from "../shared/types/response";
import { CategoryService } from "./category.service";
import { Category } from "./interface";

describe("CategoryService", () => {
  let service: CategoryService;
  let sql: SqlConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, SqlConnectService, PostgresConfig],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOne", () => {
    // Group Arrange
    const param = {
      id: 1,
    };
    const expected: ResponseData<Category> = {
      status: "success",
      message: "Get category successfully",
      data: {
        id: 1,
        name: "cate 1",
        created_at: new Date("2022-10-11T03:24:29.161Z"),
        updated_at: new Date("2022-10-11T03:24:29.161Z"),
      },
    };

    it("should be call with id parameter", () => {
      // Arrange
      jest.spyOn(service, "findOne").mockReturnValue(of(expected));
      // Act
      service.findOne(param.id);
      // Assert
      expect(service.findOne).toHaveBeenCalledWith(param.id);
    });
    it("should read File SQL", () => {
      const path = "category/select-category.sql";
      const value = sql.readFileSQL(path);
      const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
      service.findOne(param.id);

      expect(rfSQL).toHaveBeenCalled();
      expect(rfSQL).toHaveBeenCalledWith(path);
    });
    describe("pipe sql query", () => {
      it("should throw NotFoundException error if sql query return hasn't rows[0]", () => {
        // Arrange
        const SQLResult = {
          command: "",
          rowCount: 0,
          rows: [],
        };
        const expectedErr = {
          response: {
            statusCode: 404,
            message: "Not Found category by id: 1",
            error: "Not Found",
          },
          status: 404,
        };
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResult));

        // Act
        service.findOne(param.id);

        // Assert
        service
          .findOne(param.id)
          .pipe(
            catchError((err) => {
              expect(err.response).toStrictEqual(expectedErr.response);
              expect(err.status).toStrictEqual(expectedErr.status);
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });

      it("should return category data if sql query return has rows[0]", () => {
        const SQLResult = {
          command: "",
          rowCount: 2,
          oid: null,
          rows: [expected.data],
          fields: [],
          _parsers: 0,
          _types: 0,
          RowCtor: null,
          rowAsArray: true,
        };
        const value = sql.readFileSQL("category/select-category.sql");
        const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResult));

        // Act
        service.findOne(param.id);

        expect(rfSQL).toHaveBeenCalled();
        service.findOne(param.id).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });

      it("should throw new error if catch has error", () => {
        // Arrange
        jest
          .spyOn(sql, "query1")
          .mockReturnValue(throwError(() => new Error()));

        // Act
        service.findOne(param.id);

        // Assert
        service
          .findOne(param.id)
          .pipe(
            catchError((err) => {
              expect(service.throwErrorBind(err, param.id)).toHaveBeenCalled();
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });
    });
  });

  describe("findAll", () => {
    const param = {
      page: 1,
      limit: 5,
      search: "",
      key: "name",
      sort: "asc",
    };
    const expected: findAll<Category> = {
      status: "success",
      message: "Get list category successfully",
      data: [
        {
          id: 1,
          name: "cate 1",
          created_at: new Date("2022-10-19T07:02:27.756Z"),
          updated_at: new Date("2022-10-19T07:02:27.756Z"),
        },
        {
          id: 2,
          name: "cate 2",
          created_at: new Date("2022-10-19T07:02:27.756Z"),
          updated_at: new Date("2022-10-19T07:02:27.756Z"),
        },
        {
          id: 3,
          name: "cate 3",
          created_at: new Date("2022-10-19T07:02:27.756Z"),
          updated_at: new Date("2022-10-19T07:02:27.756Z"),
        },
      ],
      currentPage: 1,
      totalPage: 1,
      limit: 5,
      totalCount: 3,
    };
    it("should be call with 3 or 5 parameters", () => {
      // Arrange
      jest.spyOn(service, "findAll").mockReturnValue(of(expected));
      // Act
      service.findAll(param.page, param.limit, param.search);
      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        param.page,
        param.limit,
        param.search,
      );

      service.findAll(
        param.page,
        param.limit,
        param.search,
        param.key,
        param.sort,
      );
      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        param.page,
        param.limit,
        param.search,
        param.key,
        param.sort,
      );
    });

    it("should read File SQL", () => {
      const path = "category/select-category.sql";
      const value = sql.readFileSQL(path);
      const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
      service.findAll(
        param.page,
        param.limit,
        param.search,
        param.key,
        param.sort,
      );

      expect(rfSQL).toHaveBeenCalled();
      expect(rfSQL).toHaveBeenCalledWith(path);
    });

    describe("pipe forkJoin of object 'work'", () => {
      it("should return list categories data if catch not error", () => {
        const SQLResultData = {
          command: "",
          rowCount: 3,
          oid: null,
          rows: [expected.data],
          fields: [],
          _parsers: 0,
          _types: 0,
          RowCtor: null,
          rowAsArray: true,
        };
        const SQLResultCount = {
          command: "",
          rowCount: 20,
          oid: null,
          rows: [expected.data],
          fields: [],
          _parsers: 0,
          _types: 0,
          RowCtor: null,
          rowAsArray: true,
        };
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResultData));

        jest.spyOn(sql, "query1").mockReturnValueOnce(of(SQLResultCount));
        // Act
        service.findAll();
        service.findAll().subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });
      it("should throw new error if catch has error", () => {
        // Arrange
        jest
          .spyOn(sql, "query1")
          .mockReturnValue(throwError(() => new Error()));

        // Act
        service.findAll();

        // Assert
        service
          .findAll()
          .pipe(
            catchError((err) => {
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });
    });
  });

  describe("create", () => {
    // Group Arrange
    const param = {
      name: "cate x",
    };
    const expected: ResponseData<Category> = {
      status: "success",
      message: "Get category successfully",
      data: {
        id: 1,
        name: "cate 1",
        created_at: new Date("2022-10-11T03:24:29.161Z"),
        updated_at: new Date("2022-10-11T03:24:29.161Z"),
      },
    };

    it("should be call with name parameter", () => {
      // Arrange
      jest.spyOn(service, "create").mockReturnValue(of(expected));
      // Act
      service.create(param.name);
      // Assert
      expect(service.create).toHaveBeenCalledWith(param.name);
    });
    it("should read File SQL", () => {
      const path = "category/insert-category.sql";
      const value = sql.readFileSQL(path);
      const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
      service.create(param.name);

      expect(rfSQL).toHaveBeenCalled();
      expect(rfSQL).toHaveBeenCalledWith(path);
    });
    describe("pipe sql query", () => {
      class BaseError extends Error {
        code: string;
        constructor(message: string, code: string) {
          super();
          this.message = message;
          this.code = code;
          this.name = "Error";
        }
      }
      it("should throw ConflictException error if sql query return key - value already exists", () => {
        // Arrange
        const expectedErr = {
          response: {
            statusCode: 409,
            message: "Name Category already exits",
            error: "Conflict",
          },
          status: 409,
        };

        jest
          .spyOn(sql, "query1")
          .mockReturnValue(
            throwError(
              () => new BaseError("Name Category already exists", "23505"),
            ),
          );

        // Act
        service.create("cate x");

        // Assert
        service
          .create("cate x")
          .pipe(
            catchError((err) => {
              expect(err.response).toStrictEqual(expectedErr.response);
              expect(err.status).toStrictEqual(expectedErr.status);
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });

      it("should return category data if sql query return result", () => {
        const SQLResult = {
          command: "",
          rowCount: 2,
          oid: null,
          rows: [expected.data],
          fields: [],
          _parsers: 0,
          _types: 0,
          RowCtor: null,
          rowAsArray: true,
        };
        const value = sql.readFileSQL("category/insert-category.sql");
        const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResult));

        // Act
        service.create(param.name);

        expect(rfSQL).toHaveBeenCalled();
        service.create(param.name).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });

      it("should throw new error if catch has error", () => {
        // Arrange
        jest
          .spyOn(sql, "query1")
          .mockReturnValue(throwError(() => new Error()));

        // Act
        service.create(param.name);

        // Assert
        service
          .create(param.name)
          .pipe(
            catchError((err) => {
              expect(service.throwErrorBind(err, null)).toHaveBeenCalled();
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });
    });
  });

  describe("update", () => {
    const param = {
      id: 1,
      name: "cate y",
    };
    const expected: ResponseData<Category> = {
      status: "success",
      message: "update category successfully",
      data: {
        id: 1,
        name: "cate 1",
        created_at: new Date("2022-10-11T03:24:29.161Z"),
        updated_at: new Date("2022-10-11T03:24:29.161Z"),
      },
    };
    it("should be call with name and id parameters", () => {
      // Arrange
      jest.spyOn(service, "update").mockReturnValue(of(expected));
      // Act
      service.update(param.name, param.id);
      // Assert
      expect(service.update).toHaveBeenCalledWith(param.name, param.id);
    });

    it("should read File SQL", () => {
      const path = "category/update-category.sql";
      const value = sql.readFileSQL(path);
      const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
      service.update(param.name, param.id);

      expect(rfSQL).toHaveBeenCalled();
      expect(rfSQL).toHaveBeenCalledWith(path);
    });

    describe("pipe sql query", () => {
      it("should throw NotFoundException error if sql query return hasn't rows[0]", () => {
        // Arrange
        const SQLResult = {
          command: "",
          rowCount: 0,
          rows: [],
        };
        const expectedErr = {
          response: {
            statusCode: 404,
            message: "Not Found category by id: 1",
            error: "Not Found",
          },
          status: 404,
        };
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResult));

        // Act
        service.update(param.name, param.id);

        // Assert
        service
          .update(param.name, param.id)
          .pipe(
            catchError((err) => {
              expect(err.response).toStrictEqual(expectedErr.response);
              expect(err.status).toStrictEqual(expectedErr.status);
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });

      it("should return category data if sql query return has data", () => {
        const SQLResult = {
          command: "",
          rowCount: 1,
          oid: null,
          rows: [expected.data],
          fields: [],
          _parsers: 0,
          _types: 0,
          RowCtor: null,
          rowAsArray: true,
        };
        const value = sql.readFileSQL("category/update-category.sql");
        const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResult));

        // Act
        service.update(param.name, param.id);

        expect(rfSQL).toHaveBeenCalled();
        service.update(param.name, param.id).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });

      it("should throw new error if catch has error", () => {
        // Arrange
        jest
          .spyOn(sql, "query1")
          .mockReturnValue(throwError(() => new Error()));

        // Act
        service.update(param.name, param.id);

        // Assert
        service
          .update(param.name, param.id)
          .pipe(
            catchError((err) => {
              expect(service.throwErrorBind(err, param.id)).toHaveBeenCalled();
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });
    });
  });

  describe("delete", () => {
    const param = {
      id: 1,
    };
    const expected: ResponseStatusMess = {
      status: "success",
      message: "Deleted category successfully",
    };
    it("should be call with id parameter", () => {
      // Arrange
      jest.spyOn(service, "delete").mockReturnValue(of(expected));
      // Act
      service.delete(param.id);
      // Assert
      expect(service.delete).toHaveBeenCalledWith(param.id);
    });

    it("should read File SQL", () => {
      const path =
        "product_category/select-product-category-by-category-id.sql";
      const value = sql.readFileSQL(path);
      const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
      service.delete(param.id);

      expect(rfSQL).toHaveBeenCalled();
      expect(rfSQL).toHaveBeenCalledWith(path);
    });

    describe("pipe sql query check", () => {
      it("should throw ConflictException error if sql Query Check return rowCount is not 0", () => {
        // Arrange
        const SQLResult = {
          command: "",
          rowCount: 2,
          rows: [{ example: "" }],
        };
        const expectedErr = {
          response: {
            statusCode: 409,
            message: "Product category is already in use",
            error: "Conflict",
          },
          status: 409,
        };
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResult));

        // Act
        service.delete(param.id);

        // Assert
        service
          .delete(param.id)
          .pipe(
            catchError((err) => {
              expect(err.response).toStrictEqual(expectedErr.response);
              expect(err.status).toStrictEqual(expectedErr.status);
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });

      it("should pipe sql Query Delete if sql Query Check return rowCount is 0", () => {
        const SQLResult = {
          command: "",
          rowCount: 0,
          oid: null,
          rows: [],
          fields: [],
          _parsers: 0,
          _types: 0,
          RowCtor: null,
          rowAsArray: true,
        };
        const value = sql.readFileSQL(
          "product_category/select-product-category-by-category-id.sql",
        );
        const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResult));

        // Act
        service.delete(param.id);

        expect(rfSQL).toHaveBeenCalled();
        service.delete(param.id).subscribe((data) => {
          expect(data).toStrictEqual(expected);
        });
      });

      describe("pipe sql query delete", () => {
        it("should return response if sql Query Delete return rowCount is 1", () => {
          const SQLResultCheck = {
            command: "",
            rowCount: 0,
            oid: null,
            rows: [],
            fields: [],
            _parsers: 0,
            _types: 0,
            RowCtor: null,
            rowAsArray: true,
          };

          const SQLResultDelete = {
            command: "",
            rowCount: 1,
            oid: null,
            rows: [{ a: "" }],
            fields: [],
            _parsers: 0,
            _types: 0,
            RowCtor: null,
            rowAsArray: true,
          };
          jest.spyOn(sql, "query1").mockReturnValue(of(SQLResultCheck));
          jest
            .spyOn(service.queryClone, "query1")
            .mockReturnValue(of(SQLResultDelete));

          // Act
          service.delete(param.id);

          // Assert
          service.delete(param.id).subscribe((data) => {
            expect(data).toStrictEqual(expected);
          });
        });

        it("should throw NotFoundException error if sql Query Delete return rowCount is not 1", () => {
          const SQLResultCheck = {
            command: "",
            rowCount: 0,
            oid: null,
            rows: [],
            fields: [],
            _parsers: 0,
            _types: 0,
            RowCtor: null,
            rowAsArray: true,
          };

          const SQLResultDelete = {
            command: "",
            rowCount: 0,
            oid: null,
            rows: [],
            fields: [],
            _parsers: 0,
            _types: 0,
            RowCtor: null,
            rowAsArray: true,
          };
          const expectedErr = {
            response: {
              statusCode: 404,
              message: "Not Found category by id: 1",
              error: "Not Found",
            },
            status: 404,
          };
          jest.spyOn(sql, "query1").mockReturnValue(of(SQLResultCheck));
          jest
            .spyOn(service.queryClone, "query1")
            .mockReturnValue(of(SQLResultDelete));

          // Act
          service.delete(param.id);

          // Assert
          service
            .delete(param.id)
            .pipe(
              catchError((err) => {
                expect(err.response).toStrictEqual(expectedErr.response);
                expect(err.status).toStrictEqual(expectedErr.status);
                return throwError(() => new Error(err));
              }),
            )
            .subscribe();
        });

        it("should throw new error if catch has error", () => {
          // Arrange
          const SQLResultCheck = {
            command: "",
            rowCount: 0,
            oid: null,
            rows: [],
            fields: [],
            _parsers: 0,
            _types: 0,
            RowCtor: null,
            rowAsArray: true,
          };

          jest.spyOn(sql, "query1").mockReturnValue(of(SQLResultCheck));
          jest
            .spyOn(service.queryClone, "query1")
            .mockReturnValue(throwError(() => new Error()));

          // Act
          service.delete(param.id);

          // Assert
          service
            .delete(param.id)
            .pipe(
              catchError((err) => {
                expect(
                  service.throwErrorBind(err, param.id),
                ).toHaveBeenCalled();
                return throwError(() => new Error(err));
              }),
            )
            .subscribe();
        });
      });
    });
  });
});
