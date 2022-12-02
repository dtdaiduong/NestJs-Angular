import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  AddUser,
  AddUserError,
  AddUserSuccess,
  DeleteUser,
  DeleteUserSuccess,
  GetAllUsers,
  GetAllUsersError,
  GetAllUsersSuccess,
  GetUser,
  GetUserSuccess,
  UpdateUser,
  UpdateUserError,
  UpdateUserSuccess,
} from "./users.action";
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UsersService } from "src/app/pages/users/users.service";
import { getResUsers } from "./users.selector";
import { Router } from "@angular/router";

@Injectable()
export class UserEffect {
  constructor(
    private actions$: Actions,
    private userService: UsersService,
    private store: Store,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetAllUsers),
      mergeMap((data) => {
        return this.userService
          .getListUser(
            data.page,
            data.limit,
            data.search,
            data.roles,
            data.column,
            data.options,
          )
          .pipe(
            map((users) => {
              return GetAllUsersSuccess({ IResUser: users });
            }),
            catchError((err) => {
              if (err.error.message == "Forbidden") {
                this._snackBar.open("Bạn Không Đủ Quyền", "close", {
                  duration: 3000,
                });
              }
              return of(GetAllUsersError(err));
            }),
          );
      }),
    ),
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddUser),
      mergeMap((data) => {
        console.log(22);

        const u = data;
        return this.userService
          .addUser(
            u.firstname,
            u.lastname,
            u.email,
            u.phone,
            u.address,
            u.roles,
          )
          .pipe(
            map((res) => {
              console.log(res);
              const err = new Error("Add Users Fail");
              if (!res.data) {
                console.log(1);
                return AddUserError({ Error: err });
              } else {
                console.log(3);

                this._snackBar.open(res.message, "close", {
                  duration: 3000,
                });
                this.router.navigate(["admin/users"]);
                return AddUserSuccess({ id: 1 });
              }
            }),
            catchError((err) => {
              this._snackBar.open(err.error.message + ", Try Again", "close", {
                duration: 3000,
              });
              return of(AddUserError({ Error: err }));
            }),
          );
      }),
    ),
  );

  editUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdateUser),
      mergeMap((data) => {
        const roles = data.roles.map((r) => r.id);
        return this.userService
          .editUser(
            data.id,
            data.firstname,
            data.lastname,
            data.email,
            data.phone,
            data.address,
            roles,
          )
          .pipe(
            map((data) => {
              this._snackBar.open(data.message, "close", {
                duration: 3000,
              });
              this.router.navigate(["admin/users"]);
              return UpdateUserSuccess();
            }),
            catchError((err) => {
              this._snackBar.open(err.error.message + ", Try Again", "close", {
                duration: 3000,
              });
              return of(UpdateUserError({ Error: err }));
            }),
          );
      }),
    ),
  );

  getOneUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetUser),
      mergeMap((data) => {
        return this.userService.getOneUser(data.id).pipe(
          map((res) =>
            GetUserSuccess({
              IUser:
                res === undefined
                  ? { email: "", firstname: "", lastname: "", roles: [] }
                  : res,
            }),
          ),
          catchError(() => {
            this._snackBar.open("Get One User Fail, Try Again", "close", {
              duration: 3000,
            });
            return of({ type: "[User API] Get One User Error" });
          }),
        );
      }),
    ),
  );

  delUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteUser),
      withLatestFrom(this.store.pipe(select(getResUsers))),
      mergeMap((data) => {
        return this.userService.delUser(data[0].id).pipe(
          map(() => {
            this._snackBar.open("Delete  Success", "close", {
              duration: 3000,
            });
            return DeleteUserSuccess();
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
            return this.userService
              .getListUser(currentPage, data[1].limit, "", [])
              .pipe(
                map((dataRes) => {
                  console.log(dataRes);
                  // let cur=dataRes.currentPage;
                  // if(data[1].totalCount % data[1].limit===1){
                  //   cur=cur-1;
                  // }
                  // console.log(cur);
                  return GetAllUsersSuccess({ IResUser: dataRes });
                }),
                catchError((error) => of(GetAllUsersError(error))),
              );
          }),
          catchError((error) => {
            this._snackBar.open(error.error.message, "close", {
              duration: 3000,
            });
            return of(GetAllUsersError(error));
          }),
        );
      }),
    ),
  );
}
