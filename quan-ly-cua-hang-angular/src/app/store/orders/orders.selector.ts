import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  IListOrder,
  IOneOrder,
  ResponseOrdersAPI,
} from "../../pages/orders/orders.component.i";
export const selectListOrders = createFeatureSelector<IListOrder>("listOrders");

export const selectOneOrder = createFeatureSelector<IOneOrder>("oneOrder");
export const selectResAPIOrderError = createFeatureSelector<ResponseOrdersAPI>(
  "errorOrders",
);

export const selectMessageOrder = createFeatureSelector<ResponseOrdersAPI>(
  "messageAPIOrders",
);

export const selectOrderData = createSelector(
  selectOneOrder,
  (state: IOneOrder) => state.data,
);

export const selectPaginatorOrders = createSelector(
  selectListOrders,
  (state: IListOrder) => {
    return {
      currentPage: state.currentPage,
      limit: state.limit,
      totalPage: state.totalPage,
      totalCount: state.totalCount,
      search: state.search,
    };
  },
);
export const selectArrayOrders = createSelector(
  selectListOrders,
  (state: IListOrder) => {
    return state.data.map((o) => ({
      order_id: o.order_id,
      user_id: o.user_id,
      firstname: o.firstname,
      total_price: o.total_price,
      status: o.status,
      create_at: new Date(Date.parse(o.create_at)).toLocaleString(),
      update_at: new Date(Date.parse(o.update_at)).toLocaleString(),
      Paying: {
        disabled: o.status === "payment",
      },
      edit: {
        disabled: o.status === "payment",
      },
      delete: {
        disabled: o.status === "payment",
      },
    }));
  },
);
