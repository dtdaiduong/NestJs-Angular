import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CategoriesService } from "./categories.service";
import { IListCategory, ISort, ResponseAPI } from "./categories.component.i";
import { provideMockStore } from "@ngrx/store/testing";

describe("CategoriesService", () => {
  let service: CategoriesService;
  let httpController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(CategoriesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("Data Categories", () => {
    it("should call get List Categories and return value success from API", () => {
      //Arrange
      const page = 1;
      const limit = 5;
      const search = "";
      const url = `http://localhost:8000/api/categories?page=${page}&limit=${limit}&search=${search}`;
      let cate: IListCategory | undefined;

      const expected: IListCategory = {
        status: "success",
        message: "Get list category successfully",
        data: [
          {
            id: 1,
            name: "Áo Quần",
            created_at: "2022-09-29T02:53:44.114Z",
            updated_at: "2022-09-29T02:53:44.114Z",
          },
        ],
        currentPage: 1,
        totalPage: 3,
        limit: 5,
        totalCount: 11,
      };

      //Act
      service.getListCategories(page, limit, search).subscribe((response) => {
        expect(response.status).toBe("success");
        cate = response;
      });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(cate).toEqual(expected);
    });

    it("should call get List Categories with sort query", () => {
      //Arrange
      const page = 1;
      const limit = 5;
      const search = "";
      const sort: ISort = {
        col: "name",
        criteria: "asc",
      };
      const url = `http://localhost:8000/api/categories?page=${page}&limit=${limit}&search=${search}&key=${sort.col}&sort=${sort.criteria}`;
      let cate: IListCategory | undefined;

      const expected: IListCategory = {
        status: "success",
        message: "Get list category successfully",
        data: [
          {
            id: 1,
            name: "Áo Quần",
            created_at: "2022-09-29T02:53:44.114Z",
            updated_at: "2022-09-29T02:53:44.114Z",
          },
        ],
        currentPage: 1,
        totalPage: 3,
        limit: 1,
        totalCount: 11,
      };

      //Act
      service
        .getListCategories(page, limit, search, sort)
        .subscribe((response) => {
          expect(response.status).toBe("success");
          cate = response;
        });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(cate).toEqual(expected);
    });
    it("should call get one Category and return value success from API", () => {
      //Arrange
      const id = 1;
      const url = `http://localhost:8000/api/categories/${id}`;
      let cate: ResponseAPI | undefined;

      const expected: ResponseAPI = {
        status: "success",
        message: "Get one category successfully",
        data: {
          id: 1,
          name: "Áo Quần",
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };

      //Act
      service.getOneCategory(id).subscribe((response) => {
        expect(response.status).toBe("success");
        cate = response;
      });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(cate).toEqual(expected);
    });
    it("should call update Category and return updated Category value from API", () => {
      //Arrange
      const id = 1;
      const name = "cate";
      const url = `http://localhost:8000/api/categories/${id}`;
      let cate: ResponseAPI | undefined;
      const expected: ResponseAPI = {
        status: "success",
        message: "update category successfully",
        data: {
          id: 1,
          name: "Áo Quần",
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };

      //Act
      service.updateCategory(id, name).subscribe((response) => {
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
    it("should call create Category and return created Category value from API", () => {
      //Arrange
      const name = "cate";
      const url = "http://localhost:8000/api/categories";
      let cate: ResponseAPI | undefined;
      const expected: ResponseAPI = {
        status: "success",
        message: "create category successfully",
        data: {
          id: 1,
          name: "Áo Quần",
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };

      //Act
      service.createCategory(name).subscribe((response) => {
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
    it("should call delete Category and return message from API", () => {
      //Arrange
      const id = 1;
      const url = `http://localhost:8000/api/categories/${id}`;
      const expected: ResponseAPI = {
        message: "Deleted category successfully",
        status: "success",
      };
      let res: unknown;
      //Act
      service.deleteCategory(id).subscribe((response) => {
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
  });
});
