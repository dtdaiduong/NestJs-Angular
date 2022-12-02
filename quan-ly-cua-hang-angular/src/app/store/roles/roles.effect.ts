import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
// import { CategoriesService } from "../pages/categories/categories.service"
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";

import {
  createRoles,
  setStateMessageRoles,
  updateRoles,
  deltetRoles,
  deltetRolesSuccess,
  getListRoles,
  getListRolesSuccess,
} from "../roles/roles.action";
import { selectRoles } from "../roles/roles.selector";
import { RolesService } from "../../components/pages/roles/roles.service";

@Injectable()
export class RolesEffect {
  constructor(
    private actions$: Actions,
    private rolesService: RolesService,
    private store: Store,
  ) {}

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getListRoles),
      // withLatestFrom(this.store.pipe(select(selectRoles))),
      switchMap((res) => {
        return this.rolesService
          .getListRoles(
            res.prop.currentPage,
            res.prop.limit,
            res.prop.search,
            res.prop.col,
            res.prop.criteria,
          )
          .pipe(
            map((datares) => {
              const data = this.rolesService.Exchange(datares);
              return getListRolesSuccess({
                ...data.data,
                search: res.prop.search,
              });
            }),
            catchError(() => of({ type: "" })),
          );
      }),
    ),
  );

  deleteRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deltetRoles),
      withLatestFrom(this.store.pipe(select(selectRoles))),
      switchMap((data) => {
        return this.rolesService.deleteRoles(data[0].id).pipe(
          map((data) => {
            const result = data as { message: string; statusCode: number };
            this.store.dispatch(
              setStateMessageRoles({
                ms: {
                  status: "",
                  statusCode: 5,
                  message: result.message,
                  error: "string",
                },
              }),
            );
          }),
          switchMap(() => {
            let currentPage = data[1].currentPage;

            if (
              data[1].totalCount % data[1].limit === 1 &&
              data[1].currentPage > 1 &&
              data[1].totalCount < data[1].currentPage * data[1].limit
            ) {
              currentPage = currentPage - 1;
            }

            return this.rolesService
              .getListRoles(currentPage, data[1].limit, data[1].search)
              .pipe(
                map((res) => {
                  const dataRes = this.rolesService.Exchange(res);
                  // let cur=dataRes.currentPage;
                  // if(data[1].totalCount % data[1].limit===1){
                  //   cur=cur-1;
                  // }
                  this.store.dispatch(
                    getListRolesSuccess({
                      ...dataRes.data,
                      search: data[1].search,
                    }),
                  );
                  return getListRolesSuccess({
                    ...dataRes.data,
                    search: data[1].search,
                  });
                }),
                // switchMap((e) => of(setStateMessageRoles({ ms: e }))),
                catchError(() => of(deltetRolesSuccess())),
              );
          }),
          catchError((e) => {
            const result = e.error as { message: string; statusCode: number };
            return of(
              setStateMessageRoles({
                ms: {
                  status: "",
                  statusCode: 5,
                  message: result.message,
                  error: "string",
                },
              }),
            );
          }),
        );
      }),
    ),
  );
  createRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRoles),
      withLatestFrom(this.store.pipe(select(selectRoles))),
      switchMap((data) => {
        return this.rolesService.createRoles(data[0].name).pipe(
          map((data) => {
            const result = data as { message: string; statusCode: number };
            this.store.dispatch(
              setStateMessageRoles({
                ms: {
                  status: "",
                  statusCode: 5,
                  message: result.message,
                  error: "string",
                },
              }),
            );
          }),
          switchMap(() => {
            // let currentPage=data[1].currentPage;

            // if(data[1].totalCount % data[1].limit===1&&data[1].currentPage>1&&data[1].totalCount<data[1].currentPage*data[1].limit){
            //   currentPage=currentPage-1;
            // }

            return this.rolesService
              .getListRoles(data[1].currentPage, data[1].limit, data[1].search)
              .pipe(
                map((res) => {
                  const dataRes = this.rolesService.Exchange(res);
                  // let cur=dataRes.currentPage;
                  // if(data[1].totalCount % data[1].limit===1){
                  //   cur=cur-1;
                  // }
                  // console.log(cur);
                  // this.store.dispatch(
                  //   getListRolesSuccess({
                  //     ...dataRes.data,
                  //     search: data[1].search,
                  //   }),
                  // );
                  return getListRolesSuccess({
                    ...dataRes.data,
                    search: data[1].search,
                  });
                }),
                // switchMap((e) => of(setStateMessageRoles({ ms: e }))),
                // catchError(() => of(deltetRolesSuccess())),
              );
          }),
          catchError((e) => {
            const result = e.error as { message: string; statusCode: number };
            return of(
              setStateMessageRoles({
                ms: {
                  status: "",
                  statusCode: 5,
                  message: result.message,
                  error: "string",
                },
              }),
            );
          }),
        );
      }),
    ),
  );
  updateRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRoles),
      withLatestFrom(this.store.pipe(select(selectRoles))),
      switchMap((res) => {
        return this.rolesService
          .updateRoles(res[0].data.id, res[0].data.name)
          .pipe(
            map((data) => {
              const result = data as { message: string; statusCode: number };
              this.store.dispatch(
                setStateMessageRoles({
                  ms: {
                    status: "",
                    statusCode: 5,
                    message: result.message,
                    error: "string",
                  },
                }),
              );
            }),
            switchMap(() => {
              return this.rolesService
                .getListRoles(res[1].currentPage, res[1].limit, res[1].search)
                .pipe(
                  map((result) => {
                    const dataRes = this.rolesService.Exchange(result);
                    // let cur=dataRes.currentPage;
                    // if(data[1].totalCount % data[1].limit===1){
                    //   cur=cur-1;
                    // }
                    // this.store.dispatch(
                    //   getListRolesSuccess({
                    //     ...dataRes.data,
                    //     search: res[1].search,
                    //   }),
                    // );
                    return getListRolesSuccess({
                      ...dataRes.data,
                      search: res[1].search,
                    });
                  }),
                  // switchMap((e) => of(setStateMessageRoles({ ms: e }))),
                );
            }),
            catchError((e) => {
              const result = e.error as { message: string; statusCode: number };
              // console.log({ ...result, status: "", error: "" });
              // console.log(e);
              return of(
                setStateMessageRoles({
                  ms: {
                    status: "",
                    statusCode: 5,
                    message: result.message,
                    error: "string",
                  },
                }),
              );
            }),
          );
      }),
    ),
  );
}
///
