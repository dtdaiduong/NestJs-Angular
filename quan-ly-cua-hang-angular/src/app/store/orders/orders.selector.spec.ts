import {
  IListOrder,
  IOneOrder,
  IOrdersPaginator
} from "../../pages/orders/orders.component.i";
import {
  selectArrayOrders, selectListOrders, selectOrderData,
  selectPaginatorOrders
} from "./orders.selector";
describe("Orders", () => {
  const initialState: IListOrder = {
    status: "success",
    message: "get list orders success",
    data: [
      {
        order_id: 1,
        user_id: 1,
        firstname: "duong",
        total_price: 250000,
        status: "draft",
        create_at: "2022-10-11T03:24:29.161Z",
        update_at: "2022-10-11T03:24:29.161Z",
      },
      {
        order_id: 2,
        user_id: 2,
        firstname: "duong",
        total_price: 250000,
        status: "draft",
        create_at: "2022-10-11T03:24:29.161Z",
        update_at: "2022-10-11T03:24:29.161Z",
      },
    ],
    currentPage: 1,
    totalPage: 2,
    limit: 5,
    totalCount: 10,
  };

  const initialDataState: IOneOrder = {
    status: "success",
    message: "get list orders success",
    data: {
      id: 1,
      user_id: 1,
      firstname: "duong",
      product: [
        { id: 1, name: "ao so mi", quantity: 1, price: 25000, subprice: 25000 },
      ],
      total_price: 1,
      create_at: "2022-10-11T03:24:29.161Z",
      update_at: "2022-10-11T03:24:29.161Z",
      status: "draft",
    },
  };

  const initialPaginatorState: IOrdersPaginator = {
    currentPage: 1,
    limit: 5,
    totalPage: 2,
    totalCount: 10,
    search: "",
    col: "",
    criteria: ""
  };

  it("should select the orders state", () => {
    const result = selectListOrders.projector(initialState);
    expect(result).toBeTruthy();
  });

  it("should select one order state", () => {
    const result = selectOrderData.projector(initialDataState);
    expect(result.id).toBe(1);
    expect(result.firstname).toEqual("duong");
  });

  it("should select the Paginator state", () => {
    const result = selectPaginatorOrders.projector(initialPaginatorState);
    expect(result.currentPage).toBe(1);
    expect(result.limit).toBe(5);
    expect(result.totalCount).toBe(10);
  });

  it("should select the orders data of orders state", () => {
    const result = selectArrayOrders.projector(initialState);
    expect(result.length).toEqual(2);
    expect(result[0].order_id).toBe(1);
    expect(result[0].firstname).toEqual("duong");
  });
});
