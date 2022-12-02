import { HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { catchError, of, throwError } from "rxjs";
import { PostgresConfig } from "../services/postgres-config/postgres-config.service";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { AuthService } from "./auth.service";
import { User } from "./interface";

describe("AuthService", () => {
  let service: AuthService;
  let sql: SqlConnectService;
  let jwt: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, SqlConnectService, PostgresConfig, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    sql = module.get<SqlConnectService>(SqlConnectService);
    jwt = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findUserByEmail", () => {
    it("shoul be call with email parameter", async () => {
      // Arrange
      const email = "user@email.com";
      const find = jest.spyOn(service, "findUserByEmail");

      // Act
      await service.findUserByEmail(email);

      // Assert
      expect(find).toBeCalledTimes(1);
      expect(find).toHaveBeenCalledWith(email);
    });
    it("shoul call query and return value if result rowCount is 1", async () => {
      // Arrange
      const result = {
        command: "SELECT",
        rowCount: 1,
        oid: null,
        rows: [
          {
            id: 1,
            email: "user@email.com",
            password:
              "$2a$12$N2bmaifFFsT0khP6CqrAweiW7oiWYuMfxjqsFoLsksG1A4xdN.42O",
            created_at: new Date("2022-10-21T01:05:34.211Z"),
            updated_at: new Date("2022-10-21T01:05:34.211Z"),
            profile_id: 1,
          },
        ],
      };
      let expected;
      const user = result.rows[0];
      jest.spyOn(sql, "query").mockResolvedValue(result);

      // Act
      await service.findUserByEmail("user@email.com").then((data) => {
        expected = data;
      });

      // Assert
      expect(user).toStrictEqual(expected);
    });
    it("shoul call query and return null if result rowCount is not 1", async () => {
      // Arrange
      const result = {
        command: "SELECT",
        rowCount: 0,
        oid: null,
        rows: [],
      };
      let expected;
      jest.spyOn(sql, "query").mockResolvedValue(result);

      // Act
      await service.findUserByEmail("user@email.com").then((data) => {
        expected = data;
      });
      // Assert
      expect(expected).toBeNull();
    });
  });

  describe("authentication", () => {
    const params = {
      email: "user@email.com",
      password: "password",
    };

    it("should call findUserByEmail", async () => {
      // Arrange
      const auth = jest.spyOn(service, "authentication");
      const find = jest.spyOn(service, "findUserByEmail");

      // Act
      await service.authentication(params.email, params.password);

      // Assert
      expect(auth).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledTimes(1);
      expect(auth).toHaveBeenCalledWith(params.email, params.password);
      expect(find).toHaveBeenCalledWith(params.email);
    });

    describe("if findUserByEmail result is truthy", () => {
      it("should return user value if password is match", async () => {
        // Arrange
        const result = {
          command: "SELECT",
          rowCount: 1,
          oid: null,
          rows: [
            {
              id: 1,
              email: "user@email.com",
              password:
                "$2a$12$N2bmaifFFsT0khP6CqrAweiW7oiWYuMfxjqsFoLsksG1A4xdN.42O",
              created_at: new Date("2022-10-21T01:05:34.211Z"),
              updated_at: new Date("2022-10-21T01:05:34.211Z"),
              profile_id: 1,
            },
          ],
        };
        let user;
        jest.spyOn(sql, "query").mockResolvedValue(result);
        // jest.spyOn(service, "authentication").mockRejectedValue(result.rows[0]);
        // Act
        await service
          .authentication(params.email, params.password)
          .then((data) => {
            user = data;
          });
        // Assert
        expect(user).toStrictEqual(result.rows[0]);
      });
    });

    describe("if findUserByEmail result is falsy", () => {
      it("should return null", async () => {
        const result = {
          command: "SELECT",
          rowCount: 0,
          oid: null,
          rows: [],
        };
        jest.spyOn(sql, "query").mockResolvedValue(result);
        await service
          .authentication(params.email, params.password)
          .then((data) => {
            expect(data).toBeNull();
          });
      });
    });
  });

  describe("login", () => {
    it("shoul be call and return data", async () => {
      // Arrange
      const mockToken = "example.token";
      const expected = {
        status: "success",
        message: "Login successful",
        access_token: mockToken,
      };
      let response;
      const user: User = {
        id: 1,
        email: "user@email.com",
        password:
          "$2a$12$N2bmaifFFsT0khP6CqrAweiW7oiWYuMfxjqsFoLsksG1A4xdN.42O",
        profile_id: 1,
      };
      // await service.authentication(user.email, user.password);
      const login = jest.spyOn(service, "login");
      jest.spyOn(jwt, "signAsync").mockResolvedValue(mockToken);
      // Act
      await service.login(user).then((data) => {
        response = data;
      });

      // Assert
      expect(login).toBeCalledTimes(1);
      expect(login).toHaveBeenCalledWith(user);
      expect(response).toStrictEqual(expected);
    });
  });

  describe("register", () => {
    const dto = {
      firstname: "3Si",
      lastname: "User",
      email: "3siuser@email.com",
      password: "1234567",
      phone: "03655555",
      address: "Huế",
    };
    it("should be call with RegisterDTO parameter", () => {
      // Arrange

      const res = {
        status: "success",
        message: "register successfully",
      };

      jest.spyOn(service, "register").mockReturnValue(of(res));
      // Act
      service.register(dto);
      // Assert
      expect(service.register).toHaveBeenCalledWith(dto);
    });
    it("should read File SQL", () => {
      const path = "profile/insert-profile.sql";
      const value = sql.readFileSQL(path);
      const rfSQL = jest.spyOn(sql, "readFileSQL").mockReturnValue(value);
      service.register(dto);

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
      const user: User = {
        id: 1,
        email: "user@email.com",
        password:
          "$2a$12$N2bmaifFFsT0khP6CqrAweiW7oiWYuMfxjqsFoLsksG1A4xdN.42O",
        profile_id: 1,
      };
      it("should throw new error if catch has error", () => {
        // Arrange
        jest
          .spyOn(sql, "query1")
          .mockReturnValue(throwError(() => new Error()));

        // Act
        service.register(dto);

        // Assert
        service
          .register(dto)
          .pipe(
            catchError((err) => {
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });

      it("should throw ConflictException error if sql query return key - value already exists", () => {
        // Arrange
        const expectedErr = {
          response: {
            statusCode: 409,
            message: "Email already exits",
            error: "Conflict",
          },
          status: 409,
        };

        jest
          .spyOn(sql, "query1")
          .mockReturnValue(
            throwError(() => new BaseError("Email already exits", "23505")),
          );

        // Act
        service.register(dto);

        // Assert
        service
          .register(dto)
          .pipe(
            catchError((err) => {
              expect(err.response).toStrictEqual(expectedErr.response);
              expect(err.status).toStrictEqual(expectedErr.status);
              return throwError(() => new Error(err));
            }),
          )
          .subscribe();
      });

      it("should return response if sql query return result", () => {
        // Arrange
        const res = {
          status: "success",
          message: "register successfully",
        };

        const SQLResult = {
          command: "",
          rowCount: 1,
          oid: null,
          rows: [user],
          fields: [],
          _parsers: 0,
          _types: 0,
          RowCtor: null,
          rowAsArray: true,
        };
        jest.spyOn(sql, "query1").mockReturnValue(of(SQLResult));
        // Act
        service.register(dto);
        // Assert
        service.register(dto).subscribe((data) => {
          expect(data).toStrictEqual(res);
        });
      });
    });
  });
});
