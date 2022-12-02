import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  ResponseAPI,
  IListCategory,
  IOneCategory,
} from "src/app/pages/categories/categories.component.i";

export const selectListCategories =
  createFeatureSelector<IListCategory>("listCategories");

export const selectOneCategory =
  createFeatureSelector<IOneCategory>("oneCategory");

export const selectArrayCategories = createSelector(
  selectListCategories,
  (state: IListCategory) => {
    return state.data.map((c) => ({
      id: c.id,
      name: c.name,
      "Created At": new Date(Date.parse(c.created_at)).toLocaleString(),
      "Updated At": new Date(Date.parse(c.updated_at)).toLocaleString(),
    }));
  },
);

export const selectMessageCategory = createFeatureSelector<ResponseAPI>(
  "messageAPICategories",
);

export const selectPaginatorCategories = createSelector(
  selectListCategories,
  (state: IListCategory) => {
    return {
      currentPage: state.currentPage,
      limit: state.limit,
      totalPage: state.totalPage,
      totalCount: state.totalCount,
      search: state.search,
    };
  },
);
