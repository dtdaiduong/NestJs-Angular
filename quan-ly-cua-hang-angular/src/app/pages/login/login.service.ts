import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { catchError } from "rxjs";
import { clearListCategories } from "../../store/categories/categories.action";
import { IGetOneUser } from "../users/users.component.i";
import { ResLogin } from "./login.component.i";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(
    public router: Router,
    private http: HttpClient,
    private store: Store,
    public snackBar: MatSnackBar,
  ) {
    //
  }

  login(email: string, password: string) {
    const Url = "http://localhost:8000/api/auth/login";
    return this.http
      .post<ResLogin>(Url, { email, password })
      .pipe(catchError(this.handleError.bind(this)));
  }

  auth() {
    const token = localStorage.getItem("token");
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${token}`);
    return this.http
      .get<IGetOneUser>("http://localhost:8000/api/user/token", {
        headers: headers,
      })
      .pipe();
  }

  logout() {
    localStorage.removeItem("token");
    this.store.dispatch(clearListCategories());
    this.router.navigate(["login"]);
  }

  handleError(error: HttpErrorResponse) {
    this.snackBar.open(error.statusText, error.error.message, {
      duration: 2000,
    });
    return error.error.message;
  }
}
