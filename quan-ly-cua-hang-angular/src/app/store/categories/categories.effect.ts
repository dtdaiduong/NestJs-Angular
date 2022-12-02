import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import {
  getListCategories,
  getListCategoriesSuccess,
  createCategory,
  updateCategory,
  deleteCategory,
  setStateMessage,
  getOneCategory,
  getOneCategoriesSuccess,
} from "./categories.action";
import {
  ResponseAPI,
  ICategoryPaginator,
  IOneCategory,
} from "src/app/pages/categories/categories.component.i";
import { CategoriesService } from "src/app/pages/categories/categories.service";
import { selectPaginatorCategories } from "./categories.selector";

@Injectable()
export class GetCategoryEffect {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesService,
  ) {}

  listCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getListCategories),
      switchMap((res) =>
        this.categoriesService
          .getListCategories(res.page, res.limit, res.search, res.sort)
          .pipe(
            map((cates) => {
              cates.search = res.search;
              return getListCategoriesSuccess({ resListCates: cates });
            }),
            catchError((e) => of(setStateMessage({ ms: e.error }))),
          ),
      ),
    ),
  );
}

@Injectable()
export class OneCategoryEffect {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesService,
  ) {}
  oneCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOneCategory),
      switchMap((a) =>
        this.categoriesService.getOneCategory(a.id).pipe(
          map((cate: IOneCategory) =>
            getOneCategoriesSuccess({ resOneCate: cate }),
          ),
          catchError((e) => of(setStateMessage({ ms: e.error }))),
        ),
      ),
    ),
  );
}

@Injectable()
export class updateCategoryEffect {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesService,
  ) {}
  updateCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateCategory),
      switchMap((action) => {
        return this.categoriesService
          .updateCategory(action.id, action.name)
          .pipe(
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
export class NewCategoryEffect {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesService,
  ) {}
  createCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createCategory),
      switchMap((action) => {
        return this.categoriesService.createCategory(action.name).pipe(
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
export class DeleteCategoryEffect {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesService,
    private store: Store,
  ) {}
  deleteCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteCategory),
      switchMap((action) => {
        return this.categoriesService.deleteCategory(action.id).pipe(
          map((data: ResponseAPI) => {
            load(this.store);
            return setStateMessage({ ms: data });
          }),
          catchError((e) => {
            if (e.error.statusCode === 404) load(this.store);
            return of(setStateMessage({ ms: e.error }));
          }),
        );
      }),
    );
  });
}

export function load(store: Store) {
  const pagi$ = store.select(selectPaginatorCategories);
  let list: ICategoryPaginator = {
    currentPage: 0,
    limit: 0,
    totalPage: 0,
    totalCount: 0,
    search: "",
  };
  pagi$.subscribe((res) => {
    list = res as ICategoryPaginator;
  });
  if (
    list.totalCount - (list.currentPage - 1) * list.limit == 1 &&
    list.currentPage > 1
  )
    list.currentPage--;
  store.dispatch(
    getListCategories({
      page: list.currentPage,
      limit: list.limit,
      search: list.search,
    }),
  );
}
