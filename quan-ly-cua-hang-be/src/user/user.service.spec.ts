import { Test, TestingModule } from "@nestjs/testing";
import { lastValueFrom, of, throwError } from "rxjs";
import { PostgresConfig } from "../services/postgres-config/postgres-config.service";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { CreateUser, UpdateUser } from "./dto";
import { UserService } from "./user.service";

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
  readFileSQL = jest.fn();
}

describe("UserService", () => {
  let service: UserService;
  let sql: SqlConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: SqlConnectService, useClass: SQLServiceMock },
        UserService,
        SqlConnectService,
        PostgresConfig,
      ],
      imports: [],
    }).compile();

    service = module.get<UserService>(UserService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should call getAll method", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValue("abc");
    jest
      .spyOn(sql, "query1")
      .mockReturnValue(of({ command: "string", rowCount: 5, rows: [] }));
    service.getAll().subscribe((data) => {
      expect(data).toEqual([]);
    });
  });

  it("should call findAll method with expected params", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("shdjk");
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(of({ command: "string", rowCount: 5, rows: [] }));
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(of({ command: "string", rowCount: 5, rows: [] }));
    const sort = { column: "string", options: "string" };
    service
      .findAll(1, 5, "", "[1]", sort.column, sort.options)
      .subscribe((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Get list successfully",
          data: [],
          currentPage: 1,
          limit: 5,
          totalCount: 5,
        });
      });
  });

  it("should call findAll method with not expected params", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("shdjk");
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(of({ command: "string", rowCount: 5, rows: [] }));
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(of({ command: "string", rowCount: 5, rows: [] }));

    service.findAll().subscribe((data) => {
      expect(data).toEqual({
        status: "success",
        message: "Get list successfully",
        data: [],
        currentPage: 1,
        limit: 5,
        totalCount: 5,
      });
    });
  });

  it("should handle findAll when Error Internal Server Error", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("abc");
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(throwError(() => new Error()));
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(throwError(() => new Error()));

    return lastValueFrom(service.findAll(1, 5, "", "[]")).catch((err) => {
      expect(err.message).toBe("Internal Server Error");
      expect(sql.query1).toHaveBeenCalled();
    });
  });

  it("should handle findAll when Error 23505", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("abc");
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(
        throwError(() => new BaseError("sadsadsa", "23505")),
      );
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(
        throwError(() => new BaseError("sadsadsa", "23505")),
      );

    return lastValueFrom(service.findAll(1, 5, "", "[]")).catch((err) => {
      expect(err.message).toBe("Bad Request");
      expect(sql.query1).toHaveBeenCalled();
    });
  });

  it("should call findOne method with expected params", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValue("abc");
    jest.spyOn(sql, "query1").mockReturnValue(
      of({
        command: "string",
        rowCount: 1,
        rows: [
          {
            id: 64,
            email: "nhatba1@gmail.com",
            firstname: "quang",
            lastname: "anh tu",
            phone: "0987654321",
            address: "78 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-09-19T02:26:33.135Z",
            updated_at: "2022-10-14T08:31:23.526Z",
          },
        ],
      }),
    );
    service.findOne(64).subscribe((data) => {
      expect(data).toEqual({
        status: "success",
        message: "Get user successfully",
        data: {
          id: 64,
          email: "nhatba1@gmail.com",
          firstname: "quang",
          lastname: "anh tu",
          phone: "0987654321",
          address: "78 Nguyen Hue",
          roles: [
            {
              id: 56,
              name: "Admin",
            },
          ],
          created_at: "2022-09-19T02:26:33.135Z",
          updated_at: "2022-10-14T08:31:23.526Z",
        },
      });
    });
  });

  it("should call findOne method when Error Internal Server Error", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValue("abc");
    jest.spyOn(sql, "query1").mockReturnValue(throwError(() => new Error()));
    return lastValueFrom(service.findOne(1)).catch((err) => {
      expect(err.message).toBe("Internal Server Error");
    });
  });

  it("should call findOne method when Error EMPTY", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("abc");
    jest.spyOn(sql, "query1").mockReturnValue(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    return lastValueFrom(service.findOne(1)).catch((err) => {
      expect(err.message).toBe("Not found user by id: 1");
    });
  });

  it("should call findOne method when Error 23505", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("abc");
    jest
      .spyOn(sql, "query1")
      .mockReturnValue(throwError(() => new BaseError("abc", "23505")));
    return lastValueFrom(service.findOne(1)).catch((err) => {
      expect(err.message).toBe("Bad Request");
    });
  });

  it("should call create method with expected params", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("insert-profile");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 2,
        rows: [
          {
            id: 64,
            email: "nhatba1@gmail.com",
            firstname: "quang",
            lastname: "anh tu",
            phone: "0987654321",
            address: "78 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-09-19T02:26:33.135Z",
            updated_at: "2022-10-14T08:31:23.526Z",
          },
        ],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("insertUser");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 2,
        rows: [
          {
            id: 64,
            email: "nhatba1@gmail.com",
            firstname: "quang",
            lastname: "anh tu",
            phone: "0987654321",
            address: "78 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-09-19T02:26:33.135Z",
            updated_at: "2022-10-14T08:31:23.526Z",
          },
        ],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("insertUser_Role");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 2,
        rows: [],
      }),
    );
    const dto: CreateUser = new CreateUser();
    dto.roles = [1];

    jest.spyOn(service, "findOne").mockReturnValue(
      of({
        status: "success",
        message: "Get user successfully",
        data: {
          id: 64,
          email: "nhatba1@gmail.com",
          firstname: "quang",
          lastname: "anh tu",
          phone: "0987654321",
          address: "78 Nguyen Hue",
          roles: [
            {
              id: 56,
              name: "Admin",
            },
          ],
          created_at: "2022-09-19T02:26:33.135Z",
          updated_at: "2022-10-14T08:31:23.526Z",
        },
      }),
    );
    service.create(dto).subscribe((data) => {
      expect(data).toEqual({
        status: "success",
        message: "Created user successfully",
        data: {
          id: 64,
          email: "nhatba1@gmail.com",
          firstname: "quang",
          lastname: "anh tu",
          phone: "0987654321",
          address: "78 Nguyen Hue",
          roles: [
            {
              id: 56,
              name: "Admin",
            },
          ],
          created_at: "2022-09-19T02:26:33.135Z",
          updated_at: "2022-10-14T08:31:23.526Z",
        },
      });
    });
  });

  it("should call create method when Error Internal Server Error", () => {
    jest.spyOn(sql, "query1").mockReturnValue(throwError(() => new Error()));
    const dto = new CreateUser();
    return lastValueFrom(service.create(dto)).catch((err) => {
      expect(err.message).toBe("Internal Server Error");
    });
  });

  it("should call create method when Error 23505", () => {
    jest
      .spyOn(sql, "query1")
      .mockReturnValue(throwError(() => new BaseError("a", "23505")));
    const dto = new CreateUser();
    return lastValueFrom(service.create(dto)).catch((err) => {
      expect(err.message).toBe("Email already exits");
    });
  });

  it("should call update method with expected params", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("updateUser");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 1,
        rows: [
          {
            id: 64,
            email: "nhatba1@gmail.com",
            firstname: "quang",
            lastname: "anh tu",
            phone: "0987654321",
            address: "78 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-09-19T02:26:33.135Z",
            updated_at: "2022-10-14T08:31:23.526Z",
          },
        ],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("update-profile");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 1,
        rows: [],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteUser_RoleById");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 1,
        rows: [],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("insertUser_Role");
    const dto: UpdateUser = new UpdateUser();
    dto.roles = [1];
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 1,
        rows: [],
      }),
    );
    service.update(1, dto).subscribe((data) => {
      expect(data).toEqual({
        status: "success",
        message: "Updated User successfully",
      });
    });
  });

  it("should call update method when Error Internal Server Error", () => {
    jest.spyOn(sql, "query1").mockReturnValue(throwError(() => new Error()));
    const dto = new UpdateUser();
    return lastValueFrom(service.update(1, dto)).catch((err) => {
      expect(err.message).toBe("Internal Server Error");
    });
  });

  it("should call update method when Error EMPTY", () => {
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("updateUser");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    const dto = new UpdateUser();
    return lastValueFrom(service.update(1, dto)).catch((data) => {
      expect(data.message).toBe("Not found user by id: 1");
    });
  });

  it("should call update method when Error 23505", () => {
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(throwError(() => new BaseError("a", "23505")));
    const dto: UpdateUser = new UpdateUser();
    return lastValueFrom(service.update(1, dto)).catch((err) => {
      expect(err.message).toBe("Email already exits");
    });
  });

  it("should call delete method with Error 'User is already in Order'", () => {
    jest
      .spyOn(sql, "readFileSQL")
      .mockReturnValueOnce("check-user-is-using-in-order");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 1,
        rows: [],
      }),
    );
    service.delete(1).subscribe((data) => {
      expect(data).toEqual({
        statusCode: 409,
        message: "User is already in Order, cannot delete it",
        error: "Conflict",
      });
    });
  });

  it("should call delete method with expected params", () => {
    jest
      .spyOn(sql, "readFileSQL")
      .mockReturnValueOnce("check-user-is-using-in-order");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteUser_RoleById");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteUserById");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 1,
        rows: [
          {
            id: 64,
            email: "nhatba1@gmail.com",
            firstname: "quang",
            lastname: "anh tu",
            phone: "0987654321",
            address: "78 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-09-19T02:26:33.135Z",
            updated_at: "2022-10-14T08:31:23.526Z",
          },
        ],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("delete-profile");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 1,
        rows: [],
      }),
    );
    service.delete(1).subscribe((data) => {
      expect(data).toEqual({
        status: "success",
        message: "Deleted successful",
      });
    });
  });

  it("should call delete method when Error EMPTY", () => {
    jest
      .spyOn(sql, "readFileSQL")
      .mockReturnValueOnce("check-user-is-using-in-order");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteUser_RoleById");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteUserById");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    return lastValueFrom(service.delete(1)).catch((err) => {
      expect(err.message).toBe("Not found user by id: 1");
    });
  });

  it("should call delete method when Error Internal Server Error", () => {
    jest
      .spyOn(sql, "readFileSQL")
      .mockReturnValueOnce("check-user-is-using-in-order");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteUser_RoleById");
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(throwError(() => new Error()));
    return lastValueFrom(service.delete(1)).catch((err) => {
      expect(err.message).toBe("Internal Server Error");
    });
  });

  it("should call delete method when Error 23505", () => {
    jest
      .spyOn(sql, "readFileSQL")
      .mockReturnValueOnce("check-user-is-using-in-order");
    jest.spyOn(sql, "query1").mockReturnValueOnce(
      of({
        command: "string",
        rowCount: 0,
        rows: [],
      }),
    );
    jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("deleteUser_RoleById");
    jest
      .spyOn(sql, "query1")
      .mockReturnValueOnce(throwError(() => new BaseError("a", "23505")));
    return lastValueFrom(service.delete(1)).catch((err) => {
      expect(err.message).toBe("Bad Request");
    });
  });
});
