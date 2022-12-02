import { createReducer, on } from "@ngrx/store";
import {
  IListProduct,
  IOneProduct,
  ResponseAPI,
} from "../../pages/products/products.component.i";
import {
  clearListProducts,
  clearOneProduct,
  clearStateMessage,
  createProductError,
  createProductSucess,
  deleteProductError,
  deleteProductSucess,
  getListProductsError,
  getListProductsSuccess,
  getOneProductsError,
  getOneProductsSuccess,
  setStateMessage,
} from "./products.action";

export const initialState: IListProduct = {
  status: "",
  message: "",
  data: [],
  currentPage: 0,
  totalPage: 0,
  limit: 0,
  totalCount: 0,
  search: "",
};

export const ProductReducer = createReducer(
  initialState,
  on(getListProductsSuccess, (state, { resListProd }) => {
    return resListProd;
  }),
  on(clearListProducts, () => {
    return initialState;
  }),
);

//API Response
export const initAPIState: ResponseAPI = {
  status: "",
  statusCode: 0,
  message: "",
  error: "",
};
export const ProductsErrorReducer = createReducer(initAPIState);

export const oneInitState: IOneProduct = {
  status: "",
  message: "",
  data: {
    id: 0,
    name: "",
    description: "",
    price: 0,
    image: "",
    category: [],
    created_at: "",
    updated_at: "",
  },
};
export const OneProductReducer = createReducer(
  oneInitState,
  on(getOneProductsSuccess, (state, { resOneProd }) => {
    return resOneProd;
  }),
  on(clearOneProduct, () => {
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
    description: "",
    price: 0,
    image: "",
    category: [],
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
