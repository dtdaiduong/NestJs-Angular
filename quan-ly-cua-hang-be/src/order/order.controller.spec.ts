import { Test, TestingModule } from "@nestjs/testing";
import { lastValueFrom, of } from "rxjs";
import { OrderController } from "../order/order.controller";
import { findAll, ResponseData } from "../shared/types/response";
import { UpdateOrder } from "./dto";
import { Order, OrderDetail } from "./interface";
import { OrderService } from "./order.service";

describe("OrderController", () => {
  let orderController: OrderController;
  let orderService: OrderService;

  class OrderServiceMock {
    findAll = jest.fn();
    findOne = jest.fn();
    createOrder = jest.fn();
    updateOrder = jest.fn();
    findAllDetailOfOrder = jest.fn();
    updateOrderPaying = jest.fn();
    deleteOrder = jest.fn();
    throwErrorStatus = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useClass: OrderServiceMock }],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });
  it("should be defined", () => {
    expect(orderController).toBeDefined();
  });

  describe("", () => {
    it("should get all orders", () => {
      const mockData: findAll<Order> = {
        currentPage: 1,
        data: [],
        limit: 5,
        message: "",
        status: "as",
        totalCount: 10,
      };
      jest.spyOn(orderService, "findAll").mockReturnValue(of(mockData));
      const queryParam1 = { page: 1, limit: 10 };
      const queryParam2 = { key: "", sort: "" };
      return lastValueFrom(
        orderController.getAllOrders(queryParam1, "", queryParam2),
      ).then((data) => {
        expect(data).toEqual(mockData);
        expect(orderService.findAll).toHaveBeenCalledWith(
          queryParam1.page,
          queryParam1.limit,
          "",
          queryParam2.key,
          queryParam2.sort,
        );
      });
    });
    it("should get one order", () => {
      const mockData: ResponseData<Order> = {
        status: "",
        message: "",
        data: {
          id: 1,
          user_id: 1,
          user_name: "",
          totalPrice: 12000,
          status: "",
        },
      };
      jest.spyOn(orderService, "findOne").mockReturnValue(of(mockData));
      orderController.getOneOrder(1).subscribe((data) => {
        expect(data).toEqual(mockData);
      });
    });
    it("should create new order", () => {
      const mockData: ResponseData<OrderDetail[]> = {
        status: "",
        message: "",
        data: [
          {
            product_id: 1,
            quantity: 2,
            price: 25000,
          },
        ],
      };
      jest.spyOn(orderService, "createOrder").mockReturnValue(of(mockData));
      const dto = { user_id: 1, product: [{ id: 1, quantity: 2 }] };
      orderController.createOrder(dto).subscribe((data) => {
        expect(data).toEqual(mockData);
      });
    });
    it("should update order", () => {
      const mockData: ResponseData<UpdateOrder> = {
        status: "",
        message: "",
        data: {
          product: [
            {
              id: 1,
              quantity: 2,
            },
          ],
        },
      };
      jest.spyOn(orderService, "updateOrder").mockReturnValue(of(mockData));
      const dto: UpdateOrder = { product: [{ id: 1, quantity: 2 }] };
      orderController.updateOrder(1, dto).subscribe((data) => {
        expect(data).toEqual(mockData);
      });
    });
    it("should paying order", () => {
      const mockData = {
        status: "",
        message: "",
      };
      jest
        .spyOn(orderService, "updateOrderPaying")
        .mockReturnValue(of(mockData));
      orderController.updateOrderPaying(1).subscribe((data) => {
        expect(data).toEqual(mockData);
      });
    });
    it("should delete order", () => {
      const mockData = {
        status: "",
        message: "",
      };
      jest.spyOn(orderService, "deleteOrder").mockReturnValue(of(mockData));
      orderController.deleteOrder(1).subscribe((data) => {
        expect(data).toEqual(mockData);
      });
    });
  });
});
