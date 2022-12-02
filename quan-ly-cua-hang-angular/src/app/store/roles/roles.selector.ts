import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ResponseAPI } from "src/app/pages/categories/categories.component.i";
import { roles } from "../../components/pages/roles/roles.component";
// import { Category } from "../pages/categories/categories.component.i";

export const selectRoles = createFeatureSelector<{
  roles: roles[];
  currentPage: number;
  limit: number;
  totalPage: number;
  totalCount: number;
  search: string;
}>("listRoles");
export const selectRoleslise = createSelector(
  selectRoles,
  (state: {
    roles: roles[];
    currentPage: number;
    limit: number;
    totalPage: number;
    totalCount: number;
  }) => {
    if (state.roles) return state.roles as roles[];
    return [];
  },
);
export const selectpaginator = createSelector(
  selectRoles,
  (state: {
    roles: roles[];
    currentPage: number;
    limit: number;
    totalPage: number;
    totalCount: number;
    search: string;
  }) => {
    if (state.roles)
      return {
        currentPage: state.currentPage,
        limit: state.limit,
        totalPage: state.totalPage,
        totalCount: state.totalCount,
        search: state.search,
      };
    return {};
  },
);
export const selectc = createSelector(
  selectRoles,
  (state: {
    roles: roles[];
    currentPage: number;
    limit: number;
    totalPage: number;
    totalCount: number;
  }) => {
    return state.totalCount;
  },
);
export const selectResAPIRoles =
  createFeatureSelector<ResponseAPI>("errorRoles");
