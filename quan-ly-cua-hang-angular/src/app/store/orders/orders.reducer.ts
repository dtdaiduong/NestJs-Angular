import { createReducer, on } from "@ngrx/store";
import {
  IListOrder,
  IOneOrder,
  IOrder,
} from "../../pages/orders/orders.component.i";
import {
  clearOrdersSort,
  getListOrdersSuccess,
  getOneOrdersSuccess,
  sortListOrders,
} from "./orders.action";

export const initialState: IListOrder = {
  status: "",
  message: "",
  data: [],
  currentPage: 0,
  totalPage: 0,
  limit: 0,
  totalCount: 0,
  search: "",
  ordersSort: [],
  rootOrders: [],
};
export const OrderReducer = createReducer(
  initialState,
  on(getListOrdersSuccess, (state, { resListOrders }) => {
    return { ...resListOrders, rootOrders: resListOrders.data };
  }),
  on(sortListOrders, (state, { prop }) => {
    return { ...state, data: prop.resListOrders as IOrder[] };
  }),
  on(clearOrdersSort, (state) => {
    return { ...state, data: state.rootOrders ? state.rootOrders : [] };
  }),
);

export const initState: IListOrder = {
  status: "",
  message: "",
  data: [],
  currentPage: 0,
  totalPage: 0,
  limit: 0,
  totalCount: 0,
};

export const oneInitState: IOneOrder = {
  status: "",
  message: "",
  data: {
    id: 0,
    user_id: 0,
    firstname: "",
    product: [],
    total_price: 0,
    create_at: "",
    update_at: "",
    status: "",
  },
};
export const OrderDetailReducer = createReducer(
  oneInitState,
  on(getOneOrdersSuccess, (state, { resOneOrder }) => {
    return resOneOrder;
  }),
);
