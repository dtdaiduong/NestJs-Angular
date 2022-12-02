/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { LoadingService } from "../../interceptor/loading/loading.service";
import { ResLogin } from "./login.component.i";
import { LoginService } from "./login.service";

@Component({
  selector: "tsid-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.sass"],
})
export class LoginComponent implements OnInit {
  disabledSubmit = true;

  constructor(
    public loginService: LoginService,
    public loadingService: LoadingService,
    public snackBar: MatSnackBar,
    public router: Router,
  ) {}

  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  emailErrorList = [
    { name: "email", message: "Please enter a valid email." },
    { name: "required", message: "Email is required." },
  ];

  passwordFormControl = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
  ]);
  passwordErrorList = [
    { name: "minlength", message: "Password should contain 6 characters." },
    { name: "required", message: "Password is required." },
  ];

  ngOnInit(): void {}

  checkDisable(): boolean {
    return !(this.emailFormControl.valid && this.passwordFormControl.valid);
  }

  login(email: string, password: string) {
    if (this.checkDisable() === false) {
      this.loginService
        .login(email, password)
        .pipe(
          map((res) => {
            const data = res as ResLogin;
            localStorage.setItem("token", data.access_token);
            this.router.navigate(["admin/profile"]);
          }),
        )
        .subscribe();
    }
  }
}
