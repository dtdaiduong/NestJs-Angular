import { createAction, props } from "@ngrx/store";
import { IRoles } from "src/app/pages/roles/roles.model";
import { IUser, IResUser } from "src/app/pages/users/users.component.i";

export const GetAllUsers = createAction(
  "[ALL] Users",
  props<{
    page: number;
    limit: number;
    search: string;
    roles: number[];
    column?: string;
    options?: string;
  }>(),
);

export const GetAllUsersSuccess = createAction(
  "[ALL] Users Success",
  props<{ IResUser: IResUser }>(),
);

export const GetAllUsersError = createAction(
  "[ALL] Users Error",
  props<{ Error: Error }>(),
);

export const GetUser = createAction("[GET] User", props<{ id: number }>());

export const GetUserSuccess = createAction(
  "[GET] User Success",
  props<{ IUser: IUser }>(),
);

export const GetUserError = createAction(
  "[GET] User Error",
  props<{ Error: Error }>(),
);

export const AddUser = createAction(
  "[CREATE] User",
  props<{
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    roles: IRoles[];
  }>(),
);

export const AddUserSuccess = createAction(
  "[CREATE] User Success",
  props<{ id: number }>(),
);

export const AddUserError = createAction(
  "[CREATE] User Error",
  props<{ Error: Error }>(),
);

export const UpdateUser = createAction(
  "[UPDATE] User",
  props<{
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    roles: IRoles[];
  }>(),
);

export const UpdateUserSuccess = createAction("[UPDATE] User Success");

export const UpdateUserError = createAction(
  "[UPDATE] User Error",
  props<{ Error: Error }>(),
);

export const DeleteUser = createAction(
  "[DELETE] User",
  props<{ id: number }>(),
);

export const DeleteUserSuccess = createAction("[DELETE] User Success");

export const DeleteUserError = createAction(
  "[DELETE] User Error",
  props<{ Error: Error }>(),
);

export const Clear = createAction("Clear State");
