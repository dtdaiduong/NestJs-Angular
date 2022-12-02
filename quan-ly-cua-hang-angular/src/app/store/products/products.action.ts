import { createAction, props } from "@ngrx/store";
import {
  IListProduct,
  IOneProduct,
  IProduct,
  ISort,
  ResponseAPI,
} from "../../pages/products/products.component.i";

// Get List Product
export const getListProducts = createAction(
  "[Products API] Fetch API",
  props<{
    page: number;
    limit: number;
    search: string;
    category: number[];
    sort?: ISort;
  }>(),
);
export const getListProductsSuccess = createAction(
  "[Products API] Fetch API Success",
  props<{ resListProd: IListProduct }>(),
);
export const getListProductsError = createAction(
  "[Products API] Fetch API Error",
  props<{ err: ResponseAPI }>(),
);
export const clearListProducts = createAction("[Products API] Clear");

// Get One Product
export const getOneProduct = createAction(
  "[One Product API] Fetch One API",
  props<{ id: number }>(),
);
export const getOneProductsSuccess = createAction(
  "[One Product API] Fetch One API Success",
  props<{ resOneProd: IOneProduct }>(),
);
export const getOneProductsError = createAction(
  "[One Product API] Fetch One API Error",
  props<{ err: ResponseAPI }>(),
);
export const clearOneProduct = createAction("[One Product API] Clear");

// Create One Product
export const createProduct = createAction(
  "[Create Products API] Fetch API",
  props<{ data: FormData }>(),
);
export const createProductSucess = createAction(
  "[Create Products API] Fetch API Success",
  props<{ res: ResponseAPI }>(),
);
export const createProductError = createAction(
  "[Create Products API] Fetch API Error",
  props<{ err: ResponseAPI }>(),
);

// Update One Product
export const updateProduct = createAction(
  "[Update Products API] Fetch API",
  props<{ id: number; data: FormData }>(),
);

// Delete One Product
export const deleteProduct = createAction(
  "[Delete Products API] Fetch API",
  props<{ id: number }>(),
);
export const deleteProductSucess = createAction(
  "[Update Products API] Fetch API Success",
  props<{ res: ResponseAPI }>(),
);
export const deleteProductError = createAction(
  "[Update Products API] Fetch API Error",
  props<{ err: ResponseAPI }>(),
);

export const setStateMessage = createAction(
  "[Product State] Set state",
  props<{ ms: ResponseAPI }>(),
);

export const clearStateMessage = createAction("[Products State] Clear State");
