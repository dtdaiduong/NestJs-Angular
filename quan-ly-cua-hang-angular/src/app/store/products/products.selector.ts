import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  IListProduct,
  IOneProduct,
  ResponseAPI,
} from "../../pages/products/products.component.i";

export const selectListProducts =
  createFeatureSelector<IListProduct>("listProduct");

export const selectPaginatorProducts = createSelector(
  selectListProducts,
  (state: IListProduct) => {
    return {
      currentPage: state.currentPage,
      totalPage: state.totalPage,
      limit: state.limit,
      totalCount: state.totalCount,
      search: state.search,
    };
  },
);

export const selectArrayProducts = createSelector(
  selectListProducts,
  (state: IListProduct) => {
    console.log(state.data);
    const data = state.data.map((p) => {
      const cate = p.category.map((cate) => {
        return cate["name"];
      });
      return { ...p, category: cate };
    });
    return data;
  },
);

export const selectMessageProduct =
  createFeatureSelector<ResponseAPI>("messageAPIProducts");

export const selectResAPIProducts =
  createFeatureSelector<ResponseAPI>("errorProducts");

export const oneProducts = createFeatureSelector<IOneProduct>("oneProduct");

export const selectProductsOrder =
  createFeatureSelector<IListProduct>("listProduct");
export const selectOrderLine = createSelector(
  selectProductsOrder,
  (state: IListProduct) => state.data,
);
