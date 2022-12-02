import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { provideMockStore } from "@ngrx/store/testing";
import { IListOrder, ResponseOrdersAPI } from "./orders.component.i";
import { OrdersService } from "./orders.service";

describe("OrdersService", () => {
  let service: OrdersService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(OrdersService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  describe("Data Orders", () => {
    it("should call get list orders but not sorted", () => {
      const currentPage = 1;
      const limit = 5;
      const search = "";
      const col = "";
      const criteria = "";
      const url = `http://localhost:8000/api/orders?page=${currentPage}&limit=${limit}&search=${search}`;
      let order: IListOrder | undefined;

      const expected: IListOrder = {
        status: "success",
        message: "Get list orders successfully",
        data: [
          {
            order_id: 1,
            user_id: 1,
            firstname: "user 1",
            total_price: 200000,
            status: "draft",
            create_at: "2022-09-29T02:53:44.114Z",
            update_at: "2022-09-29T02:53:44.114Z",
          },
          {
            order_id: 2,
            user_id: 2,
            firstname: "user 2",
            total_price: 200000,
            status: "draft",
            create_at: "2022-09-29T02:53:44.114Z",
            update_at: "2022-09-29T02:53:44.114Z",
          },
        ],
        currentPage: 1,
        totalPage: 3,
        limit: 5,
        totalCount: 11,
      };

      service
        .getListOrders(currentPage, limit, search, col, criteria)
        .subscribe((response) => {
          expect(response.status).toBe("success");
          order = response;
        });
      const request = httpController.expectOne(url);
      request.flush(expected);
      httpController.verify();
      expect(order).toEqual(expected);
    });
    it("should call get list orders ordered", () => {
      const currentPage = 1;
      const limit = 5;
      const search = "";
      const col = "firstname";
      const criteria = "asc";
      const url = `http://localhost:8000/api/orders?page=${currentPage}&limit=${limit}&search=${search}&key=${col}&sort=${criteria}`;
      let order: IListOrder | undefined;

      const expected: IListOrder = {
        status: "success",
        message: "Get list orders successfully",
        data: [
          {
            order_id: 1,
            user_id: 1,
            firstname: "user 1",
            total_price: 200000,
            status: "draft",
            create_at: "2022-09-29T02:53:44.114Z",
            update_at: "2022-09-29T02:53:44.114Z",
          },
          {
            order_id: 2,
            user_id: 2,
            firstname: "user 2",
            total_price: 200000,
            status: "draft",
            create_at: "2022-09-29T02:53:44.114Z",
            update_at: "2022-09-29T02:53:44.114Z",
          },
        ],
        currentPage: 1,
        totalPage: 3,
        limit: 5,
        totalCount: 11,
      };

      service
        .getListOrders(currentPage, limit, search, col, criteria)
        .subscribe((response) => {
          expect(response.status).toBe("success");
          order = response;
        });
      const request = httpController.expectOne(url);
      request.flush(expected);
      httpController.verify();
      expect(order).toEqual(expected);
    });
  });
  it("should call one order", () => {
    const id = 1;
    const url = `http://localhost:8000/api/orders/${id}`;
    let order: ResponseOrdersAPI | undefined;

    const expected: ResponseOrdersAPI = {
      status: "success",
      statusCode: 200,
      message: "Get onse order successfully",
      data: {
        id: 56,
        user_id: 3,
        firstname: "hey",
        product: [
          {
            id: 1,
            name: "product 1",
            quantity: 2,
            price: 200000,
            subprice: 400000,
          },
          {
            id: 2,
            name: "product 1",
            quantity: 2,
            price: 200000,
            subprice: 400000,
          },
        ],
        total_price: 800000,
        create_at: "2022-09-29T02:53:44.114Z",
        update_at: "2022-09-29T02:53:44.114Z",
        status: "draft",
      },
    };

    service.getOneOrder(id).subscribe((response) => {
      expect(response.status).toBe("success");
      order = response;
    });
    const request = httpController.expectOne(url);
    request.flush(expected);
  });

  it("should call create order", () => {
    const products = [
      {
        productId: 1,
        quantity: 2,
      },
      {
        productId: 2,
        quantity: 2,
      },
    ];
    const user_id = 1;
    const url = "http://localhost:8000/api/orders";
    let order: ResponseOrdersAPI | undefined;
    const expected: ResponseOrdersAPI = {
      status: "success",
      message: "update order successfully",
      data: {
        id: 56,
        user_id: 3,
        firstname: "hey",
        product: [
          {
            id: 1,
            name: "product 1",
            quantity: 2,
            price: 200000,
            subprice: 400000,
          },
          {
            id: 2,
            name: "product 1",
            quantity: 2,
            price: 200000,
            subprice: 400000,
          },
        ],
        total_price: 800000,
        create_at: "2022-09-29T02:53:44.114Z",
        update_at: "2022-09-29T02:53:44.114Z",
        status: "draft",
      },
    };

    service.createOrder(products, user_id).subscribe((response) => {
      expect(response.status).toBe("success");
      order = response;
    });

    const request = httpController.expectOne({
      method: "POST",
      url: url,
    });
    request.flush(expected);
    httpController.verify();
    expect(order).toEqual(expected);
  });

  it("should call update order", () => {
    const id = 1;
    const products = [
      {
        productId: 1,
        quantity: 2,
      },
      {
        productId: 2,
        quantity: 2,
      },
    ];
    const url = `http://localhost:8000/api/orders/${id}`;
    let order: ResponseOrdersAPI | undefined;
    const expected: ResponseOrdersAPI = {
      status: "success",
      message: "update order successfully",
      data: {
        id: 56,
        user_id: 3,
        firstname: "hey",
        product: [
          {
            id: 1,
            name: "product 1",
            quantity: 2,
            price: 200000,
            subprice: 400000,
          },
          {
            id: 2,
            name: "product 1",
            quantity: 2,
            price: 200000,
            subprice: 400000,
          },
        ],
        total_price: 800000,
        create_at: "2022-09-29T02:53:44.114Z",
        update_at: "2022-09-29T02:53:44.114Z",
        status: "draft",
      },
    };

    service.updateOrder(id, products).subscribe((response) => {
      expect(response.status).toBe("success");
      order = response;
    });
    const request = httpController.expectOne({
      method: "PUT",
      url: url,
    });
    request.flush(expected);
    httpController.verify();
    expect(order).toEqual(expected);
  });

  it("should call delete order", () => {
    const id = 1;
    const url = `http://localhost:8000/api/orders/${id}`;
    const expected: ResponseOrdersAPI = {
      message: "Deleted order successfully",
      status: "success",
    };

    let res: unknown;
    service.Delete(id).subscribe((response) => {
      expect(response.status).toBe("success");
      res = response;
    });
    const request = httpController.expectOne({
      method: "DELETE",
      url: url,
    });
    request.flush(expected);
    httpController.verify();
    expect(res).toEqual(expected);
  });

  it("should call paying order", () => {
    const id = 1;
    const url = `http://localhost:8000/api/orders/paying/${id}`;
    const expected: ResponseOrdersAPI = {
      message: "Paying order successfully",
      status: "success",
    };
    let res: ResponseOrdersAPI | unknown;
    service.Paying(id).subscribe((response) => {
      expect(response.status).toBe("success");
      res = response;
    });
    const request = httpController.expectOne({
      method: "PUT",
      url: url,
    });
    request.flush(expected);
    httpController.verify();
    expect(res).toEqual(expected);
  });
});
