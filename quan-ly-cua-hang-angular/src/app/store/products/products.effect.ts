import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { ResponseAPI } from "../../pages/products/products.component.i";
import { ProductsService } from "../../pages/products/products.service";

import {
  createProduct,
  createProductError,
  createProductSucess,
  deleteProduct,
  deleteProductError,
  deleteProductSucess,
  getListProducts,
  getListProductsError,
  getListProductsSuccess,
  getOneProduct,
  getOneProductsSuccess,
  setStateMessage,
  updateProduct,
} from "./products.action";

@Injectable()
export class ProductsEffect {
  constructor(
    private action$: Actions,
    private productsService: ProductsService,
  ) {}

  loadProducts$ = createEffect(() =>
    this.action$.pipe(
      ofType(getListProducts),
      mergeMap((prop) =>
        this.productsService
          .GetListProducts(
            prop.page,
            prop.limit,
            prop.search,
            prop.category,
            prop.sort,
          )
          .pipe(
            map((products) => {
              return getListProductsSuccess({
                resListProd: { ...products, search: prop.search },
              });
            }),
            catchError(() => of(getListProductsError)),
          ),
      ),
    ),
  );
}

@Injectable()
export class GetOneProductEffect {
  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
    private store: Store,
  ) {}

  getOneProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOneProduct),
      mergeMap((prop) =>
        this.productsService.GetOneProduct(prop.id).pipe(
          map((products) => {
            console.log(products);
            return getOneProductsSuccess({ resOneProd: products });
          }),
          catchError(() => of(getListProductsError)),
        ),
      ),
    ),
  );
}

@Injectable()
export class CreateProductEffect {
  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
  ) {}
  createProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createProduct),
      mergeMap((data) => {
        return this.productsService.Create(data.data).pipe(
          map((data: ResponseAPI) => {
            return setStateMessage({ ms: data });
          }),
          catchError((e) => {
            return of(setStateMessage({ ms: e.error }));
          }),
        );
      }),
    );
  });
}

@Injectable()
export class UpdateProductEffect {
  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
  ) {}
  updateProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateProduct),
      switchMap((data) => {
        return this.productsService.Edit(data.id, data.data).pipe(
          map((data: ResponseAPI) => {
            return setStateMessage({ ms: data });
          }),
          catchError((e) => {
            return of(setStateMessage({ ms: e.error }));
          }),
        );
      }),
    );
  });
}

@Injectable()
export class DeleteProductEffect {
  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
    private store: Store,
  ) {}
  deleteCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteProduct),
      switchMap((prop) => {
        return this.productsService.Delete(prop.id).pipe(
          map((data: ResponseAPI) => {
            this.store.dispatch(
              getListProducts({ page: 1, limit: 5, search: "", category: [] }),
            );
            return setStateMessage({ ms: data });
          }),
          catchError((e) => {
            return of(setStateMessage({ ms: e.error }));
          }),
        );
      }),
    );
  });
}
