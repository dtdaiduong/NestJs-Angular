import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
// import { CategoriesService } from "./categories.service";
// import { IListCategory, ResponseAPI } from "./categories.component.i";
import { provideMockStore } from "@ngrx/store/testing";
import { RolesService } from "./roles.service";
import { ResponseGetListRoles } from "./roles.i";
import { ResponseAPI } from "../../../pages/categories/categories.component.i";
// import { ResponseAPI } from "src/app/pages/categories/categories.component.i";

describe("RolesService", () => {
  let service: RolesService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpController: HttpTestingController;
  beforeEach(() => {
    // TestBed.configureTestingModule({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(RolesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("Data Roles", () => {
    it("should call get List Roles and return value success from API", () => {
      //Arrange
      const currentPage = 1;
      const limit = 5;
      const search = "";
      const url = `http://localhost:8000/api/roles?page=${currentPage}&limit=${limit}&search=${search}`;
      let cate: ResponseGetListRoles | undefined;

      const expected: ResponseGetListRoles = {
        data: {
          roles: [
            {
              key: 1,
              Action: "string",
              id: 1,
              name: "Áo Quần",
              Created: "2022-09-29T02:53:44.114Z",
              Updated: "2022-09-29T02:53:44.114Z",
            },
          ],
          limit: 5,
          currentPage: 1,
          totalPage: 1,
          totalCount: 5,
        },
        message: {
          status: "success",
          statusCode: 1,
          message: "string",
          error: "string",
        },
      };

      //Act

      service.getListRoles(currentPage, limit, search).subscribe((response) => {
        expect(response.message).toBe("success");
        cate = service.Exchange(response);
      });
      const request = httpController.expectOne({
        method: "GET",
        url: url,
      });
      request.flush(expected);
      // console.log(request);

      //Assert
      httpController.verify();
      // expect(cate).toEqual(expected);
    });
    it("should call get List Roles when sort success", () => {
      //Arrange
      const currentPage = 1;
      const limit = 5;
      const search = "";
      const sort = "sd";
      const key = "sd";
      const url = `http://localhost:8000/api/roles?page=${currentPage}&limit=${limit}&search=${search}&key=${key}&sort=${sort}`;
      let cate: ResponseGetListRoles | undefined;

      const expected: ResponseGetListRoles = {
        data: {
          roles: [
            {
              key: 1,
              Action: "string",
              id: 1,
              name: "Áo Quần",
              Created: "2022-09-29T02:53:44.114Z",
              Updated: "2022-09-29T02:53:44.114Z",
            },
          ],
          limit: 5,
          currentPage: 1,
          totalPage: 1,
          totalCount: 5,
        },
        message: {
          status: "success",
          statusCode: 1,
          message: "string",
          error: "string",
        },
      };

      //Act

      service
        .getListRoles(currentPage, limit, search, key, sort)
        .subscribe((response) => {
          expect(response.message).toBe("success");
          cate = service.Exchange(response);
        });
      const request = httpController.expectOne({
        method: "GET",
        url: url,
      });
      request.flush(expected);
      // console.log(request);

      //Assert
      httpController.verify();
      // expect(cate).toEqual(expected);
    });
    it("should call update roles and return updated roles value from API", () => {
      //Arrange
      const id = 1;
      const name = "cate";
      const url = `http://localhost:8000/api/roles/${id}`;
      let cate: ResponseAPI | undefined;
      const expected: ResponseAPI = {
        status: "success",
        message: "update roles successfully",
      };

      //Act
      service.updateRoles(id, name).subscribe((response) => {
        expect(response.status).toBe("success");
        cate = response;
      });
      const request = httpController.expectOne({
        method: "PUT",
        url: url,
      });
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(cate).toEqual(expected);
    });
    it("should call create Roles and return created Roles value from API", () => {
      //Arrange
      const name = "sda";
      const url = "http://localhost:8000/api/roles";
      let cate: ResponseAPI | undefined;
      const expected: ResponseAPI = {
        status: "success",
        message: "create Roles successfully",
      };

      //Act
      service.createRoles(name).subscribe((response) => {
        expect(response.status).toBe("success");
        cate = response;
      });
      const request = httpController.expectOne({
        method: "POST",
        url: url,
      });
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(cate).toEqual(expected);
    });
    it("should call delete Roles and return message from API", () => {
      //Arrange
      const id = 1;
      const url = `http://localhost:8000/api/roles/${id}`;
      const expected: ResponseAPI = {
        message: "Deleted Roles successfully",
        status: "success",
      };
      let res: unknown;
      //Act
      service.deleteRoles(id).subscribe((response) => {
        expect(response.status).toBe("success");
        res = response;
      });

      const request = httpController.expectOne({
        method: "DELETE",
        url: url,
      });
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(res).toEqual(expected);
    });
    it("Should exchange data when Exchange func is run", () => {
      const ast = {
        status: "string",
        message: "string",
        data: [
          {
            created_at: "string",
            id: 1,
            name: "string",
            updated_at: "string",
          },
        ],
        currentPage: 5,
        totalPage: 5,
        limit: 5,
        totalCount: 5,
      };
      const expected = {
        data: {
          roles: [
            {
              key: 1,
              Created: "Invalid Date",
              id: 1,
              name: "string",
              Updated: "Invalid Date",
              Action: "Action",
            },
          ],
          limit: 5,
          currentPage: 5,
          totalPage: 5,
          totalCount: 5,
        },
        message: {
          status: "string",
          statusCode: 1,
          message: "string",
          error: "string",
        },
      };
      const response = service.Exchange(ast);
      expect(response).toEqual(expected);
    });
  });
});
