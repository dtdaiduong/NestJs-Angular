import { createReducer, on } from "@ngrx/store";
import {
  ResponseAPI,
  IListCategory,
  IOneCategory,
} from "src/app/pages/categories/categories.component.i";
import {
  clearListCategories,
  clearOneCategory,
  clearStateMessage,
  getListCategoriesSuccess,
  getOneCategoriesSuccess,
  setStateMessage,
} from "./categories.action";

export const initialState: IListCategory = {
  status: "",
  message: "",
  data: [],
  currentPage: 0,
  totalPage: 0,
  limit: 0,
  totalCount: 0,
  search: "",
};
export const CategoryReducer = createReducer(
  initialState,
  on(getListCategoriesSuccess, (state, { resListCates }) => {
    return resListCates;
  }),
  on(clearListCategories, () => {
    return initialState;
  }),
);

export const oneInitState: IOneCategory = {
  status: "",
  message: "",
  data: {
    id: 0,
    name: "",
    created_at: "",
    updated_at: "",
  },
};
export const OneCategoryReducer = createReducer(
  oneInitState,
  on(getOneCategoriesSuccess, (state, { resOneCate }) => {
    return resOneCate;
  }),
  on(clearOneCategory, () => {
    return oneInitState;
  }),
);

export const initMessage: ResponseAPI = {
  status: "",
  statusCode: 0,
  message: "",
  error: "",
  data: {
    id: 0,
    name: "",
    created_at: "",
    updated_at: "",
  },
};
export const MessageReducer = createReducer(
  initMessage,
  on(setStateMessage, (state, { ms }) => {
    return ms;
  }),
  on(clearStateMessage, () => {
    return initMessage;
  }),
);
