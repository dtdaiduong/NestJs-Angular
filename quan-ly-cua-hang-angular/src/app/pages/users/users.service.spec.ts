import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import {
  IAddUser,
  IDelUser,
  IEditUser,
  IGetOneUser,
  IResUser,
  IUser,
} from "./users.component.i";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;
  let httpController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(UsersService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("Data Users", () => {
    it("should return value from API when getListUser called", () => {
      // Arrange
      const page = 1;
      const limit = 5;
      const search = "";
      const roles: number[] = [];
      const url = `http://localhost:8000/api/user?page=${page}&limit=${limit}&role=[${roles}]&search=${search}`;
      let users: IResUser | undefined;
      const expected: IResUser = {
        status: "success",
        message: "Get list successfully",
        data: [
          {
            id: 64,
            email: "nhatba1@gmail.com",
            firstname: "quang",
            lastname: "nhat",
            phone: "0987654321",
            address: "77 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-09-19T02:26:33.135Z",
            updated_at: "2022-09-19T02:26:33.135Z",
          },
        ],
        currentPage: 1,
        limit: 5,
        totalCount: 3,
      };

      //Act
      service.getListUser(page, limit, search, roles).subscribe((res) => {
        expect(res.status).toBe(expected.status);
        users = res;
      });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(users).toEqual(expected);
    });

    it("should return value from API when getListUser called with sort", () => {
      // Arrange
      const page = 1;
      const limit = 5;
      const search = "";
      const roles: number[] = [];
      const column = "firstname";
      const options = "asc";
      const url = `http://localhost:8000/api/user?page=${page}&limit=${limit}&role=[${roles}]&search=${search}&column=${column}&options=${options}`;
      let users: IResUser | undefined;
      const expected: IResUser = {
        status: "success",
        message: "Get list successfully",
        data: [
          {
            id: 64,
            email: "nhatba1@gmail.com",
            firstname: "quang",
            lastname: "nhat",
            phone: "0987654321",
            address: "77 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-09-19T02:26:33.135Z",
            updated_at: "2022-09-19T02:26:33.135Z",
          },
        ],
        currentPage: 1,
        limit: 5,
        totalCount: 3,
      };

      //Act
      service
        .getListUser(page, limit, search, roles, column, options)
        .subscribe((res) => {
          expect(res.status).toBe(expected.status);
          users = res;
        });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(users).toEqual(expected);
    });

    it("should return one user when get one user called", () => {
      //Arrange
      const id = 1;
      const url = `http://localhost:8000/api/user/${id}`;
      let user: IUser | undefined;
      const expected: IGetOneUser = {
        status: "success",
        message: "Get user successfully",
        data: {
          id: 156,
          email: "test@gmail.com",
          firstname: "nhat",
          lastname: "truong",
          phone: "09333333339",
          address: "30 lalala",
          roles: [
            {
              id: 59,
              name: "Teacher",
            },
          ],
          created_at: "2022-10-11T03:46:20.936Z",
          updated_at: "2022-10-11T03:46:20.936Z",
        },
      };

      //Act
      service.getOneUser(id).subscribe((res) => {
        expect(res).toEqual(expected.data);
        user = res;
      });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(user).toEqual(expected.data);
    });

    it("shoud return value when addUser called", () => {
      //Arrange
      const firstname = "nhat";
      const lastname = "truong";
      const email = "nhat@gmail.com";
      const phone = "0202020303";
      const address = "77 Nguyen Hue";
      const roles = [{ id: 1, name: "Admin" }];
      const url = "http://localhost:8000/api/user";
      let resAddUser: IAddUser | undefined;
      const expected: IAddUser = {
        status: "success",
        message: "Created user successfully",
        statusCode: 409,
        data: {
          firstname: "nhat",
          lastname: "truong",
          email: "nhat@gmail.com",
          phone: "0202020303",
          address: "77 Nguyen Hue",
          roles: [{ id: 1, name: "Admin" }],
        },
      };

      //Act
      service
        .addUser(firstname, lastname, email, phone, address, roles)
        .subscribe((res) => {
          expect(res).toEqual(expected);
          resAddUser = res;
        });

      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(resAddUser).toEqual(expected);
    });

    it("should return value when editUser called", () => {
      //Arrange
      const id = 1;
      const firstname = "nhat";
      const lastname = "truong";
      const email = "nhat@gmail.com";
      const phone = "0202020303";
      const address = "77 Nguyen Hue";
      const roles = [1];
      const url = `http://localhost:8000/api/user/${id}`;
      let IEditUser: IEditUser | undefined;
      const expected = {
        status: "success",
        statusCode: 200,
        message: "Updated User successfully",
      };

      //Act
      service
        .editUser(id, firstname, lastname, email, phone, address, roles)
        .subscribe((res) => {
          expect(res).toEqual(expected);
          IEditUser = res;
        });

      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(IEditUser).toEqual(expected);
    });

    it("should return value when delUser called", () => {
      //Arrange
      const id = 1;
      const url = `http://localhost:8000/api/user/${id}`;
      let IDelUser: IDelUser | undefined;
      const expected = {
        status: "success",
        statusCode: 200,
        message: "Updated User successfully",
      };

      //Act
      service.delUser(id).subscribe((res) => {
        expect(res).toEqual(expected);
        IDelUser = res;
      });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(IDelUser).toEqual(expected);
    });
  });
});
