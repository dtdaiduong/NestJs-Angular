import { createAction, props } from "@ngrx/store";
import {
  IListOrder,
  IOneOrder,
  IOrder,
  ordersSort,
  ResponseOrdersAPI,
} from "../../pages/orders/orders.component.i";

//Get list
export const getListOrders = createAction(
  "[Get list] Fetch API",
  props<{
    currentPage: number;
    limit: number;
    search: string;
    col: string;
    criteria: string;
  }>(),
);
export const getListOrdersSuccess = createAction(
  "[Get list Orders Success]",
  props<{ resListOrders: IListOrder }>(),
);

//Create
export const createOrder = createAction(
  "[Orders API] Create order ",
  props<{ data: { productId: number; quantity: number }[]; user: number }>(),
);
export const AddOrderSuccess = createAction(
  "[CREATE] Order Success",
  props<{ id: number }>(),
);
//update
export const updateOrder = createAction(
  "[Update Order API] Fetch API",
  props<{
    order_id: number;
    data: { productId: number; quantity: number }[];
  }>(),
);
export const updateOrderSucess = createAction(
  "[Update order API] Fetch API Success",
  props<{ allOrders: IOrder[] }>(),
);
export const updateOrderError = createAction(
  "[Update order API] Fetch API Status",
  props<{ err: ResponseOrdersAPI }>(),
);

//oneOrder
export const getOneOrder = createAction(
  "[One Orders API] Fetch One API",
  props<{ id: number }>(),
);

export const getOneOrdersSuccess = createAction(
  "[One Orders API] Fetch API Success",
  props<{ resOneOrder: IOneOrder }>(),
);

export const getOneOrdersError = createAction(
  "[One Orders API] Fetch API Error",
  props<{ err: ResponseOrdersAPI }>(),
);
export const GetOrderDetail = createAction(
  "[One Orders API] Get one",
  props<{ id: number }>(),
);

//Delete
export const deleteOrder = createAction(
  "[Delete Order]",
  props<{ id: number }>(),
);
export const deleteOrderSucess = createAction(
  "[Delete Order API] Fetch API Success",
  props<{ res: ResponseOrdersAPI }>(),
);
export const deleteOrderError = createAction(
  "[Delete Order API] Fetch API Error",
  props<{ err: ResponseOrdersAPI }>(),
);

export const setStateMessageOrders = createAction(
  "[Orders State] Set State",
  props<{ ms: ResponseOrdersAPI }>(),
);

export const payingOrder = createAction(
  "[Paying order]",
  props<{ id: number }>(),
);
export const payingOrderSucess = createAction(
  "[Paying Order API] Fetch API Success",
  props<{ allOrders: IOrder[] }>(),
);
export const payingOrderError = createAction(
  "[Payng Order API] Fetch API Error",
  props<{ err: ResponseOrdersAPI }>(),
);

export const payingOrderSuccess = createAction(
  "[Order] Paying Order Success",
  props<{ orderId: number }>(),
);

export const sortListOrders = createAction(
  "[Sort list orders]",
  (prop: { resListOrders: ordersSort[] }) => ({ prop }),
);

export const clearOrdersSort = createAction("[Clear Orders Sort]");
