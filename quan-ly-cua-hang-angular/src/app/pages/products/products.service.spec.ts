import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ProductsService } from "./products.service";
import { provideMockStore } from "@ngrx/store/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { IListProduct, ISort, ResponseAPI } from "./products.component.i";

describe("ProductsService", () => {
  let service: ProductsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  describe("[1] Initial service", () => {
    it("[1.1] should be created", () => {
      expect(service).toBeTruthy();
    });
  });

  describe("[2] Functional testing", () => {
    it("[2.1] Get list products", () => {
      //Arrange
      const page = 1;
      const limit = 5;
      const search = "";
      const category: number[] = [];
      const url = `http://localhost:8000/api/products?page=${page}&limit=${limit}&search=${search}&category=[${category}]`;
      let product: IListProduct | undefined;
      const expected: IListProduct = {
        status: "success",
        message: "Get list product successfully",
        data: [
          {
            id: 1,
            name: "Áo blue trắng",
            description: "Áo thun",
            price: 60000,
            image:
              "http://localhost:8000/api/uploads/1665050108007-aokhoac.png",
            category: [
              {
                id: 1,
                name: "Áo",
                created_at: "2022-09-29T02:53:44.114Z",
                updated_at: "2022-09-29T02:53:44.114Z",
              },
            ],
            created_at: "2022-09-29T02:53:44.114Z",
            updated_at: "2022-09-29T02:53:44.114Z",
          },
        ],
        currentPage: 1,
        totalPage: 3,
        limit: 5,
        totalCount: 11,
        search: "",
      };

      //Act
      service
        .GetListProducts(page, limit, search, category)
        .subscribe((response) => {
          expect(response.status).toBe("success");
          product = response;
        });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(product).toEqual(expected);
    });
    it("[2.1.1] Get list products with sort", () => {
      //Arrange
      const page = 1;
      const limit = 5;
      const search = "";
      const category: number[] = [];
      const sort: ISort = {
        col: "name",
        criteria: "asc",
      };
      const url = `http://localhost:8000/api/products?page=${page}&limit=${limit}&search=${search}&category=[${category}]&column=${sort.col}&options=${sort.criteria}`;
      let product: IListProduct | undefined;
      const expected: IListProduct = {
        status: "success",
        message: "Get list product successfully",
        data: [
          {
            id: 1,
            name: "Áo blue trắng",
            description: "Áo thun",
            price: 60000,
            image:
              "http://localhost:8000/api/uploads/1665050108007-aokhoac.png",
            category: [
              {
                id: 1,
                name: "Áo",
                created_at: "2022-09-29T02:53:44.114Z",
                updated_at: "2022-09-29T02:53:44.114Z",
              },
            ],
            created_at: "2022-09-29T02:53:44.114Z",
            updated_at: "2022-09-29T02:53:44.114Z",
          },
        ],
        currentPage: 1,
        totalPage: 3,
        limit: 5,
        totalCount: 11,
        search: "",
      };

      //Act
      service
        .GetListProducts(page, limit, search, category, sort)
        .subscribe((response) => {
          expect(response.status).toBe("success");
          product = response;
        });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(product).toEqual(expected);
    });
    it("[2.2] Get one product", () => {
      //Arrange
      const id = 1;
      const url = `http://localhost:8000/api/products/${id}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let product;
      const expected = {
        status: "success",
        message: "Get product successfully",
        data: {
          id: 1,
          name: "Áo",
          description: "Áo blue trắng",
          price: 60000,
          image: "http://localhost:8000/api/uploads/1665050108007-aokhoac.png",
          category: [
            {
              id: 1,
              name: "Áo",
              created_at: "2022-09-29T02:53:44.114Z",
              updated_at: "2022-09-29T02:53:44.114Z",
            },
          ],
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };

      //Act
      service.GetOneProduct(id).subscribe((response) => {
        expect(response.status).toBe("success");
        product = response;
      });
      const request = httpController.expectOne(url);
      request.flush(expected);

      //Assert
      httpController.verify();
      // expect(product).toEqual(expected);
    });

    it("[2.3] Create product", () => {
      // Arrange
      const data = new FormData();
      const url = "http://localhost:8000/api/products";
      let product: ResponseAPI | undefined;
      const expected: ResponseAPI = {
        status: "success",
        message: "Create product successfully",
      };
      // Act

      service.Create(data).subscribe((response) => {
        expect(response.status).toBe("success");
        product = response;
      });
      const request = httpController.expectOne({
        method: "POST",
        url: url,
      });
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(product).toEqual(expected);
    });

    it("[2.4] Update product", () => {
      //Arrange
      const id = 1;
      const data = new FormData();
      const url = `http://localhost:8000/api/products/${id}`;
      let product: ResponseAPI | undefined;
      const expected: ResponseAPI = {
        status: "success",
        message: "Update product successfully",
      };

      //Act
      service.Edit(id, data).subscribe((response) => {
        expect(response.status).toBe("success");
        product = response;
      });

      const request = httpController.expectOne({
        method: "PUT",
        url: url,
      });
      request.flush(expected);

      //Assert
      httpController.verify();
      expect(product).toEqual(expected);
    });
    it("[2.5] Delete product", () => {
      //Arrange
      const id = 1;
      const url = `http://localhost:8000/api/products/${id}`;
      const expected: { status: string; message: string } = {
        status: "success",
        message: "Delete product successfully",
      };
      let res: unknown;

      //Act
      service.Delete(id).subscribe((response) => {
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
