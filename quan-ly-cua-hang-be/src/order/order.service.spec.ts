import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { Test, TestingModule } from "@nestjs/testing";
import { catchError, lastValueFrom, of, throwError } from "rxjs";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { OrderService } from "./order.service";
class BaseError extends Error {
  constraint;
  constructor(message: string, constraint: string) {
    super();
    this.message = message;
    this.constraint = constraint;
  }
}
describe("OrderService", () => {
  let service: OrderService;
  let sql: SqlConnectService;
  class qlConnectServiceMock {
    query = jest.fn();
    query1 = jest.fn();
    readFileSQL = jest.fn();
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: SqlConnectService, useClass: qlConnectServiceMock },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    sql = module.get<SqlConnectService>(SqlConnectService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("find all", () => {
    it("should RETURN find all orders", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValue("read");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 5,
          rows: [],
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 5,
          rows: [{ count: 5 }],
        }),
      );
      return lastValueFrom(service.findAll(1, 5, "", "", "")).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Get list successful",
          data: [],
          currentPage: 1,
          totalPage: 1,
          limit: 5,
          totalCount: 5,
        });
      });
    });
    it("should sort orders", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValue("read");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 5,
          rows: [],
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 5,
          rows: [{ count: 5 }],
        }),
      );
      return lastValueFrom(service.findAll(1, 5, "", "firstname", "asc")).then(
        (data) => {
          expect(data).toEqual({
            currentPage: 1,
            data: [],
            limit: 5,
            message: "Get list successful",
            status: "success",
            totalCount: 5,
            totalPage: 1,
          });
        },
      );
    });
    it("should RETURN error", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValue("read");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(throwError(() => new Error("Error")));
      return lastValueFrom(service.findAll(1, 5, "", "", "")).catch((data) => {
        expect(data.message).toEqual("Error: Error");
      });
    });
  });

  describe("find one", () => {
    it("should RETURN find one order success", () => {
      jest.spyOn(sql, "readFileSQL");
      jest.spyOn(sql, "query1").mockReturnValue(
        of({
          command: "string",
          rowCount: 5,
          rows: [
            {
              id: 1,
              user_id: 1,
              user_name: "string",
              totalPrice: 12000,
              status: "draft",
            },
          ],
        }),
      );
      return lastValueFrom(service.findOne(1)).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Get order successfully",
          data: {
            id: 1,
            user_id: 1,
            user_name: "string",
            totalPrice: 12000,
            status: "draft",
          },
        });
      });
    });
    it("should RETURN find one order not exist", () => {
      jest.spyOn(sql, "readFileSQL");
      jest.spyOn(sql, "query1").mockReturnValue(
        of({
          command: "string",
          rowCount: 0,
          rows: [],
        }),
      );
      service
        .findOne(1)
        .pipe(
          catchError((err) => {
            return throwError(() => new Error(err));
          }),
        )
        .subscribe();
    });
    it("should RETURN find one order error", () => {
      jest.spyOn(sql, "readFileSQL");
      jest
        .spyOn(sql, "query1")
        .mockReturnValue(throwError(() => new Error("Error")));
      return lastValueFrom(service.findOne(1)).catch((data) => {
        expect(data.message).toEqual("Error: Error");
      });
    });
  });

  describe("create order", () => {
    it("should RETURN create order success", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("sd");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("sd");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("sd");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ sum: 1 }],
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 2,
          rows: [{ id: 1 }],
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 2,
          rows: [],
        }),
      );
      return lastValueFrom(
        service.createOrder({
          user_id: 1,
          product: [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 3 },
          ],
        }),
      ).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Created order detail successfully",
        });
      });
    });
    it("should RETURN create order error product does not exist", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("sd");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("sd");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("sd");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ sum: 1 }],
        }),
      );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(throwError(() => new BaseError("", "orders_fk")));
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 2,
          rows: [],
        }),
      );
      return lastValueFrom(
        service.createOrder({
          user_id: 1,
          product: [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 3 },
          ],
        }),
      ).catch((data) => {
        expect(data.message).toEqual("This user or product does not exist");
      });
    });
    it("should RETURN create order error", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ sum: 1 }],
        }),
      );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(throwError(() => new BaseError("", "dsad")));
      return lastValueFrom(
        service.createOrder({
          user_id: 1,
          product: [{ id: 1, quantity: undefined }],
        }),
      ).catch((data) => {
        expect(data.message).toEqual("Error");
      });
    });
  });

  describe("update order", () => {
    it("should RETURN update order success", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read3");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read4");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ status: "draft" }],
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ status: "draft" }],
        }),
      );
      return lastValueFrom(
        service.updateOrder(1, {
          product: [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 3 },
          ],
        }),
      ).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "update order successful",
        });
      });
    });
    it("should RETURN product does not exist", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("getValuesDetail");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("getValuesDetail");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ status: "draft" }],
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
        }),
      );
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(
          throwError(() => new BaseError("message", "order_detail_product_fk")),
        );
      return lastValueFrom(
        service.updateOrder(1, {
          product: [{ id: 1, quantity: 1 }],
        }),
      ).catch((data) => {
        expect(data.response).toEqual("This product does not exist");
      });
    });

    it("should RETURN Paid orders cannot be update", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read3");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ status: "payment" }],
        }),
      );
      return lastValueFrom(
        service.updateOrder(1, {
          product: [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 3 },
          ],
        }),
      ).catch((data) => {
        expect(data.message).toEqual("Paid orders cannot be update");
      });
    });
    it("should RETURN update order error not exist", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read3");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 0,
        }),
      );
      return lastValueFrom(
        service.updateOrder(1, {
          product: [
            { id: 1, quantity: 2 },
            { id: 2, quantity: 3 },
          ],
        }),
      ).catch((data) => {
        expect(data.message).toEqual("The order does not exist");
      });
    });
    it("should RETURN error", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read3");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(throwError(() => new Error("Error")));
      return lastValueFrom(
        service.updateOrder(1, {
          product: [{ id: 1, quantity: undefined }],
        }),
      ).catch((data) => {
        expect(data.message).toEqual("Error: Error");
      });
    });
  });

  describe("update paying order", () => {
    it("should RETURN update paying success", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
        }),
      );
      return lastValueFrom(service.updateOrderPaying(1)).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "The Order payment successful",
        });
      });
    });
    it("should RETURN order error not exist", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 0,
        }),
      );
      return lastValueFrom(service.updateOrderPaying(1)).catch((data) => {
        expect(data.message).toEqual("The order does not exist");
      });
    });
    it("should RETURN error", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(throwError(() => new Error("Error")));
      return lastValueFrom(service.updateOrderPaying(1)).catch((data) => {
        expect(data.message).toEqual("Error: Error");
      });
    });
  });

  describe("delete order", () => {
    it("Should RETURN delete order success", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read3");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ status: "draft" }],
        }),
      );
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 0,
        }),
      );
      return lastValueFrom(service.deleteOrder(1)).then((data) => {
        expect(data).toEqual({
          status: "success",
          message: "Deleted successful",
        });
      });
    });
    it("should RETURN Paid orders cannot be deleted", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read3");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 1,
          rows: [{ status: "payment" }],
        }),
      );
      return lastValueFrom(service.deleteOrder(1)).catch((data) => {
        expect(data.message).toEqual("Paid orders cannot be deleted");
      });
    });
    it("should RETURN delete order error not exist", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read3");
      jest.spyOn(sql, "query1").mockReturnValueOnce(
        of({
          command: "string",
          rowCount: 0,
        }),
      );
      return lastValueFrom(service.deleteOrder(1)).catch((data) => {
        expect(data.message).toEqual("The order does not exist");
      });
    });
    it("should RETURN error", () => {
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read1");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read2");
      jest.spyOn(sql, "readFileSQL").mockReturnValueOnce("read3");
      jest
        .spyOn(sql, "query1")
        .mockReturnValueOnce(throwError(() => new Error("Error")));
      return lastValueFrom(service.deleteOrder(1)).catch((data) => {
        expect(data.message).toEqual("Error: Error");
      });
    });
  });
});
