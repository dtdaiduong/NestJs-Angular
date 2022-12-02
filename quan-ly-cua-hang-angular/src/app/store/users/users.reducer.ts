import { createReducer, on } from "@ngrx/store";
import { IResUser, IUser } from "src/app/pages/users/users.component.i";
import {
  AddUser,
  AddUserError,
  AddUserSuccess,
  Clear,
  DeleteUser,
  DeleteUserError,
  DeleteUserSuccess,
  GetAllUsers,
  GetAllUsersError,
  GetAllUsersSuccess,
  GetUser,
  GetUserError,
  GetUserSuccess,
  UpdateUser,
  UpdateUserError,
  UpdateUserSuccess,
} from "./users.action";

export interface State {
  data: IResUser;
  selected: IUser | null;
  action: string | null;
  done: boolean;
  error?: Error | null;
}

const initialState: State = {
  data: {
    status: "",
    message: "",
    data: [],
    currentPage: 0,
    limit: 0,
    totalCount: 0,
  },
  selected: null,
  action: null,
  done: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,
  on(Clear, () => {
    return initialState;
  }),
  on(GetAllUsers, (state) => {
    return {
      ...state,
      action: "[ALL] Users",
      done: false,
      selected: null,
      error: null,
    };
  }),
  on(GetAllUsersSuccess, (state, payload) => {
    return {
      ...state,
      data: payload.IResUser,
      done: true,
      selected: null,
      error: null,
    };
  }),
  on(GetAllUsersError, (state, payload) => {
    return {
      ...state,
      done: true,
      selected: null,
      error: payload.Error,
    };
  }),
  on(DeleteUser, (state, payload) => {
    const selected = state.data.data.find((h) => h.id === payload.id);
    if (selected === undefined) {
      return {
        ...state,
        selected: null,
        action: "[DELETE] User",
        done: false,
        error: null,
      };
    } else {
      return {
        ...state,
        selected,
        action: "[DELETE] User",
        done: false,
        error: null,
      };
    }
  }),
  on(DeleteUserSuccess, (state) => {
    const data = state.data.data.filter((h) => {
      const id = state.selected ? state.selected.id : 0;
      return h.id !== id;
    });
    state.data.data = data;
    return {
      ...state,
      data: state.data,
      selected: null,
      done: true,
      error: null,
    };
  }),
  on(DeleteUserError, (state, payload) => {
    return {
      ...state,
      selected: null,
      done: true,
      error: payload.Error,
    };
  }),
  on(AddUser, (state, payload) => {
    return {
      ...state,
      selected: payload,
      action: "[CREATE] User",
      done: false,
      error: null,
    };
  }),
  on(AddUserSuccess, (state) => {
    return state;
  }),
  on(AddUserError, (state, payload) => {
    return {
      ...state,
      selected: null,
      done: true,
      error: payload.Error,
    };
  }),
  on(GetUser, (state) => {
    return {
      ...state,
      action: "[GET] User",
      done: false,
      selected: null,
      error: null,
    };
  }),
  on(GetUserSuccess, (state, payload) => {
    return {
      ...state,
      done: true,
      selected: payload.IUser,
      error: null,
    };
  }),
  on(GetUserError, (state, payload) => {
    return {
      ...state,
      done: true,
      selected: null,
      error: payload.Error,
    };
  }),
  on(UpdateUser, (state, payload) => {
    return {
      ...state,
      selected: payload,
      action: "[UPDATE] User",
      done: false,
      error: null,
    };
  }),
  on(UpdateUserSuccess, (state) => {
    return state;
  }),
  on(UpdateUserError, (state, payload) => {
    return {
      ...state,
      selected: null,
      done: true,
      error: payload.Error,
    };
  }),
);
