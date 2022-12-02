import { createAction, props } from "@ngrx/store";
import {
  ResponseAPI,
  IListCategory,
  IOneCategory,
  ISort,
} from "src/app/pages/categories/categories.component.i";

// Get List Category //
export const getListCategories = createAction(
  "[ListCategories API] Get List API",
  props<{
    page: number;
    limit: number;
    search: string;
    sort?: ISort;
  }>(),
);
export const getListCategoriesSuccess = createAction(
  "[ListCategories API] Get List Success",
  props<{ resListCates: IListCategory }>(),
);
export const getListCategoriesError = createAction(
  "[ListCategories API] Get List Error",
  props<{ err: ResponseAPI }>(),
);

export const clearListCategories = createAction("[Categories API] Clear List");

// Get One Category
export const getOneCategory = createAction(
  "[One Category API] Fetch One API",
  props<{ id: number }>(),
);
export const getOneCategoriesSuccess = createAction(
  "[One Category API] Fetch API Success",
  props<{ resOneCate: IOneCategory }>(),
);
export const getOneCategoriesError = createAction(
  "[One Category API] Fetch API Status",
  props<{ err: ResponseAPI }>(),
);
export const clearOneCategory = createAction("[One Category API] Clear");

// Create Category //
export const createCategory = createAction(
  "[Create Categories API] Create API",
  props<{ name: string }>(),
);
export const createCategorySucess = createAction(
  "[Create Categories API] Create Success",
  props<{ res: ResponseAPI }>(),
);
export const createCategoryError = createAction(
  "[Create Categories API] Create Error",
  props<{ err: ResponseAPI }>(),
);

// Update Category //
export const updateCategory = createAction(
  "[Update Categories API] Update API",
  props<{ id: number; name: string }>(),
);
export const updateCategorySucess = createAction(
  "[Update Categories API] Update Success",
  props<{ res: ResponseAPI }>(),
);
export const updateCategoryError = createAction(
  "[Update Categories API] Update Error",
  props<{ err: ResponseAPI }>(),
);

// Delete Category //
export const deleteCategory = createAction(
  "[Delete Categories API] Delete API",
  props<{ id: number }>(),
);
export const deleteCategorySucess = createAction(
  "[Delete Categories API] Delete Success",
  props<{ res: ResponseAPI }>(),
);
export const deleteCategoryError = createAction(
  "[Delete Categories API] Delete Error",
  props<{ err: ResponseAPI }>(),
);

// Message Respone API //
export const setStateMessage = createAction(
  "[Categories State] Set State",
  props<{ ms: ResponseAPI }>(),
);
export const clearStateMessage = createAction("[Categories State] Clear State");
