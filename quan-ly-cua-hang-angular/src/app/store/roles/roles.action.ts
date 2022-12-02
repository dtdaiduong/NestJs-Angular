import { createAction, props } from "@ngrx/store";
import { roles } from "../../components/pages/roles/roles.component";
import { ResponseAPI } from "../../pages/categories/categories.component.i";
export const createRoles = createAction(
  "[Roles API] Create Role",
  props<{ name: string }>(),
);
export const updateRoles = createAction(
  "[Roles API] Update Role",
  props<{ data: { id: number; name: string } }>(),
);
export const setStateMessageRoles = createAction(
  "[Roles State] Set State",
  props<{ ms: ResponseAPI }>(),
);
export const getListRoles = createAction(
  "[Get list]",
  (
    prop: {
      currentPage: number;
      limit: number;
      search: string;
      col: string;
      criteria: string;
    } = {
      currentPage: 1,
      limit: 5,
      search: "",
      col: "",
      criteria: "",
    },
  ) => ({ prop }),
);
export const clearStateMessageRoles = createAction("[Roles State] Clear State");
export const deltetRoles = createAction("[Delete list]", (id: number) => ({
  id,
}));
export const deltetRolesSuccess = createAction("[Delete list Success]");

export const getListRolesSuccess = createAction(
  "[Get list Success]",
  (
    prop: {
      roles: roles[];
      currentPage: number;
      limit: number;
      totalPage: number;
      totalCount: number;
      search: string;
    } = {
      roles: [],
      currentPage: 1,
      limit: 5,
      totalPage: 0,
      totalCount: 0,
      search: "",
    },
  ) => {
    return { prop };
  },
);
export const sortListRoles = createAction(
  "[Sort list]",
  (prop: { roles: roles[] }) => ({ prop }),
);
export const clearSort = createAction("[Clear Sort]");
