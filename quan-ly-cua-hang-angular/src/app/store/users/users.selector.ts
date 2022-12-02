import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IResUser } from "../../pages/users/users.component.i";
import { State } from "./users.reducer";
export const selectUsers =
  createFeatureSelector<ReadonlyArray<IResUser>>("allUsers");
export const getUsersState = createFeatureSelector<State>("users");
export const getResUsers = createSelector(getUsersState, (state: State) => state.data);
export const getAllUsers = createSelector(getUsersState, (state: State) => state.data.data);
export const getPaginator = createSelector(getUsersState, (state: State) => ({
  currentPage: state.data.currentPage,
  limit: state.data.limit,
  totalCount: state.data.totalCount,
}));
export const getOneUser = createSelector(getUsersState, (state: State) => {
  if (state.action === "[GET] User" && state.done) {
    return state.selected;
  } else {
    return null;
  }
});


export const isDeleted = createSelector(getUsersState, (state: State) =>
  state.action === "[DELETE] User" && state.done && !state.error);
export const isCreated = createSelector(getUsersState, (state: State) =>
 state.action === "[CREATE] User" && state.done && !state.error);

 export const getDeleteError = createSelector(getUsersState, (state: State) => {
  return state.action === "[DELETE] User"
    ? state.error
   : null;
});
export const getCreateError = createSelector(getUsersState, (state: State) => {
  return state.action === "[CREATE] User Error"
    ? state.error
   : null;
});
