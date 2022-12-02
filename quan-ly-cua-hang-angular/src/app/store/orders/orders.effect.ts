import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import {
  IOrdersPaginator,
  ResponseOrdersAPI,
} from "../../pages/orders/orders.component.i";
import { OrdersService } from "../../pages/orders/orders.service";
import {
  AddOrderSuccess,
  createOrder,
  deleteOrder,
  getListOrders,
  getListOrdersSuccess,
  getOneOrdersError,
  getOneOrdersSuccess,
  GetOrderDetail,
  payingOrder,
  payingOrderError,
  setStateMessageOrders,
  updateOrder,
  updateOrderError,
  updateOrderSucess,
} from "./orders.action";
import { selectPaginatorOrders } from "./orders.selector";

@Injectable()
export class OrderEffect {
  constructor(
    private actions$: Actions,
    private ordersService: OrdersService,
    private store: Store,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getListOrders),
      switchMap((res) => {
        return this.ordersService
          .getListOrders(
            res.currentPage,
            res.limit,
            res.search,
            res.col,
            res.criteria,
          )
          .pipe(
            map((data) => {
              data.search = res.search;
              return getListOrdersSuccess({
                resListOrders: data,
              });
            }),
            catchError(() => of({ type: "" })),
          );
      }),
    ),
  );

  oneOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetOrderDetail),
      mergeMap((a) =>
        this.ordersService.getOneOrder(a.id).pipe(
          map((order) => {
            return getOneOrdersSuccess({ resOneOrder: order });
          }),
          catchError((e) => of(getOneOrdersError({ err: e.error }))),
        ),
      ),
    ),
  );

  createOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrder),
      switchMap((a) => {
        return this.ordersService.createOrder(a.data, a.user).pipe(
          map(() => {
            this._snackBar.open("CREATE order success", "close", {
              duration: 4000,
            });
            this.router.navigate(["admin/orders"]);
            return AddOrderSuccess({ id: a.user });
          }),
        );
      }),
    ),
  );

  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateOrder),
      switchMap((action) => {
        return this.ordersService
          .updateOrder(action.order_id, action.data)
          .pipe(
            switchMap(() => {
              this._snackBar.open("UPDATE order success", "close", {
                duration: 4000,
              });
              this.router.navigate(["admin/orders"]);
              return of(updateOrderSucess({ allOrders: [] }));
            }),
            catchError((e) => {
              return of(updateOrderError({ err: e.error }));
            }),
          );
      }),
    ),
  );

  payingOrder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(payingOrder),
      switchMap((action) => {
        return this.ordersService.Paying(action.id).pipe(
          map((data: ResponseOrdersAPI) => {
            this._snackBar.open("Paying order success", "close", {
              duration: 4000,
            });
            load(this.store);
            return setStateMessageOrders({ ms: data });
          }),
          catchError((e) => {
            return of(payingOrderError({ err: e.error }));
          }),
        );
      }),
    );
  });

  deleteOrders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteOrder),
      switchMap((data) => {
        return this.ordersService.Delete(data.id).pipe(
          map((data: ResponseOrdersAPI) => {
            load(this.store);
            return setStateMessageOrders({ ms: data });
          }),
          catchError((e) => {
            return of(payingOrderError({ err: e.error }));
          }),
        );
      }),
    );
  });
}
export function load(store: Store) {
  const pagi$ = store.select(selectPaginatorOrders);
  let list: IOrdersPaginator = {
    currentPage: 0,
    limit: 0,
    totalPage: 0,
    totalCount: 0,
    search: "",
    col: "",
    criteria: "",
  };
  pagi$.subscribe((res) => {
    list = res as IOrdersPaginator;
  });
  if (list.totalCount - (list.currentPage - 1) * list.limit == 1)
    list.currentPage--;
  store.dispatch(
    getListOrders({
      currentPage: list.currentPage,
      limit: list.limit,
      search: list.search,
      col: list.col,
      criteria: list.criteria,
    }),
  );
}
