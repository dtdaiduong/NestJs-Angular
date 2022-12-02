import { createReducer, on } from "@ngrx/store";
import {
  clearSort,
  // deltetRoles,
  deltetRolesSuccess,
  getListRolesSuccess,
  sortListRoles,
} from "../../store/roles/roles.action";
import { roles } from "../../components/pages/roles/roles.component";
import { initMessage } from "../categories/categories.reducer";
import { clearStateMessageRoles, setStateMessageRoles } from "./roles.action";

export const initialState: {
  roles: roles[];
  currentPage: number;
  limit: number;
  totalPage: number;
  totalCount: number;
  search: string;
  rootRoles?: roles[];
} = {
  roles: [],
  currentPage: 1,
  limit: 5,
  totalPage: 0,
  totalCount: 0,
  search: "",
  rootRoles: [],
};

export const RolesReducer = createReducer(
  initialState,
  on(getListRolesSuccess, (state, { prop }) => {
    // console.log(prop);
    return { ...prop, rootRoles: prop.roles };
  }),
  on(deltetRolesSuccess, (state) => {
    // console.log({ ...state, totalCount: state.totalCount - 1 });
    return { ...state, totalCount: state.totalCount - 1 };
  }),
  on(sortListRoles, (state, { prop }) => {
    // console.log(prop);
    return { ...state, roles: prop.roles };
  }),
  on(clearSort, (state) => {
    return { ...state, roles: state.rootRoles ? state.rootRoles : [] };
  }),
);
//sortListRoles
export const RolesErrorReducer = createReducer(
  initMessage,
  on(setStateMessageRoles, (state, { ms }) => {
    // console.log(ms);
    return ms;
  }),
  on(clearStateMessageRoles, () => {
    return initMessage;
  }),
);
