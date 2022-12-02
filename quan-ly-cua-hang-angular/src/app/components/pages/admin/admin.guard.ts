import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { catchError, map, of } from "rxjs";
import { LoginService } from "src/app/pages/login/login.service";
@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}
  canActivate() {
    // check token in localStorage
    if (localStorage.getItem("token")) {
      return this.loginService.auth().pipe(
        map((response) => {
          let flag = false;
          const res = response as { status: string };
          //check api token if response is success return can activate
          if (res.status === "success") {
            flag = true;
          }
          return flag;
        }),
        catchError(() => {
          //check api token if response is not success return can not activate
          this.router.navigate(["/login"]);
          return of(false);
        }),
      );
    } else {
      // not token in localStorage
      this.router.navigate(["/login"]);
      return false;
    }
  }
}

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}
  canActivate() {
    if (localStorage.getItem("token")) {
      return this.loginService.auth().pipe(
        map((response) => {
          {
            let flag = false;
            const res = response as { status: string };
            if (res.status === "success") {
              this.router.navigate(["/admin/profile"]);
              flag = false;
            }
            return flag;
          }
        }),
        catchError(() => of(true)),
      );
    } else return true;
  }
}

@Injectable({
  providedIn: "root",
})
export class ChildGuard implements CanActivateChild {
  constructor(private router: Router, private loginService: LoginService) {}
  canActivateChild() {
    if (localStorage.getItem("token")) {
      return this.loginService.auth().pipe(
        map((response) => {
          let flag = false;
          const res = response as { status: string };
          //check api token if response is success return can activate
          if (res.status === "success") {
            flag = true;
          }
          return flag;
        }),
        catchError(() => {
          //check api token if response is not success return can not activate
          this.router.navigate(["/login"]);
          return of(false);
        }),
      );
    } else {
      // not token in localStorage
      this.router.navigate(["/login"]);
      return false;
    }
  }
  // canActivate() {
  //   // check token in localStorage
  // }
}
