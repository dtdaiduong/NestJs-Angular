import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { PostgresConfig } from "../services/postgres-config/postgres-config.service";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { findAll } from "../shared/types/response";
import { CreateUser, UpdateUser } from "./dto";
import { IUser, User } from "./interface";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;
  let jwt: JwtService;
  class UserServiceMock {
    getAll = jest.fn();
    findAll = jest.fn();
    findOne = jest.fn();
    create = jest.fn();
    update = jest.fn();
    delete = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [],
      providers: [
        { provide: UserService, useClass: UserServiceMock },
        JwtService,
        SqlConnectService,
        PostgresConfig,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    jwt = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call getUsers method when expected params", () => {
    const mockData1: findAll<IUser> = {
      currentPage: 1,
      data: [],
      limit: 10,
      message: "",
      status: "as",
      totalCount: 0,
    };

    jest.spyOn(service, "findAll").mockReturnValue(of(mockData1));
    const params = { page: 1, limit: 5 };
    const search = "";
    const role_id = "[]";
    const sort = { column: "firstname", options: "asc" };
    controller.getUsers(search, role_id, params, sort).subscribe((data) => {
      expect(data).toEqual(mockData1);
    });
    expect(service.findAll).toHaveBeenCalled();
  });

  it("should call getUserByToken method when expected params", () => {
    const req = {
      headers: {
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoidXNlckBlbWFpbC5jb20iLCJpYXQiOjE2NjYyMzIxMjksImV4cCI6MTY2NjMxODUyOX0.adqvpX5MsVHgGhGbolvy8EMw9XYxenfNc85f9_r14Ew",
      },
    };
    const expected: {
      status: string;
      message: string;
      data: IUser;
    } = {
      status: "success",
      message: "Get user successfully",
      data: {
        id: 75,
        email: "user@email.com",
        firstname: "super",
        lastname: "admin",
        phone: "12",
        address: "12",
        roles: [
          {
            id: 56,
            name: "Admin",
          },
          {
            id: 58,
            name: "Manager",
          },
        ],
        created_at: "2022-09-23T04:51:45.187Z",
        updated_at: "2022-10-03T02:23:49.384Z",
      },
    };
    jest.spyOn(jwt, "verify").mockReturnValue({ id: 1 });
    jest.spyOn(service, "findOne").mockReturnValue(of(expected));
    controller.getUserByToken(req).subscribe((data) => {
      expect(service.findOne).toHaveBeenCalled();
      expect(data).toEqual(expected);
    });
  });

  it("should call getUser method when expected params", () => {
    const id = 165;
    const expected: {
      status: string;
      message: string;
      data: IUser;
    } = {
      status: "success",
      message: "Get user successfully",
      data: {
        id: 165,
        email: "khanh@gmail.com",
        firstname: "duy",
        lastname: "khanh",
        phone: "0922654321",
        address: "77 Nguyen Hue",
        roles: [
          {
            id: 57,
            name: "Customer",
          },
        ],
        created_at: "2022-10-20T02:31:50.142Z",
        updated_at: "2022-10-20T02:31:50.142Z",
      },
    };

    jest.spyOn(service, "findOne").mockReturnValue(of(expected));
    controller.getUser(id).subscribe((data) => {
      expect(service.findOne).toHaveBeenCalled();
      expect(data).toEqual(expected);
    });
  });

  it("should call postUser method when expected params", () => {
    const expected: {
      status: string;
      message: string;
      data: IUser;
    } = {
      status: "success",
      message: "Created user successfully",
      data: {
        id: 166,
        email: "trungho@gmail.com",
        firstname: "trung",
        lastname: "ho",
        phone: "09226543231",
        address: "77 Nguyen Hue",
        roles: [
          {
            id: 56,
            name: "Admin",
          },
        ],
        created_at: "2022-10-20T03:06:08.022Z",
        updated_at: "2022-10-20T03:06:08.022Z",
      },
    };
    const dto: CreateUser = new CreateUser();
    jest.spyOn(service, "create").mockReturnValue(of(expected));
    controller.postUser(dto).subscribe((data) => {
      expect(service.create).toHaveBeenCalled();
      expect(data).toEqual(expected);
    });
  });

  it("should call putUser method when expected params", () => {
    const expected = {
      status: "success",
      message: "Updated User successfully",
    };
    const dto: UpdateUser = new UpdateUser();
    jest.spyOn(service, "update").mockReturnValue(of(expected));
    controller.putUser(1, dto).subscribe((data) => {
      expect(service.update).toHaveBeenCalled();
      expect(data).toEqual(expected);
    });
  });

  it("should call deleteUser method when expected params", () => {
    const expected = {
      status: "success",
      message: "Deleted successful",
    };

    jest.spyOn(service, "delete").mockReturnValue(of(expected));
    controller.deleteUser(1).subscribe((data) => {
      expect(service.delete).toHaveBeenCalled();
      expect(data).toEqual(expected);
    });
  });
});
