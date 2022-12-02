import { HttpErrorResponse } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { IGetOneUser } from "../users/users.component.i";
import { LoginComponent } from "./login.component";
import { ResLogin } from "./login.component.i";

import { LoginService } from "./login.service";

describe("LoginService", () => {
  let service: LoginService;
  let httpController: HttpTestingController;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "login", component: LoginComponent },
        ]),
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(LoginService);
    httpController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should have method login", () => {
    // Arrange
    const email = "example@email.com";
    const password = "examplepassword";
    const url = "http://localhost:8000/api/auth/login";
    const expected = {
      status: "success",
      message: "Login successful",
      access_token: "example token",
    };
    let data: ResLogin | undefined;

    //Act
    service.login(email, password).subscribe((response) => {
      const res = response as ResLogin;
      expect(res.status).toBe("success");
      data = res;
    });
    const request = httpController.expectOne(url);
    request.flush(expected);

    //Assert
    httpController.verify();
    expect(data).toEqual(expected);
  });

  it("should have method auth", () => {
    // Arrange
    const url = "http://localhost:8000/api/user/token";
    const expected = {
      status: "success",
      message: "Get user successfully",
      data: {
        id: 1,
        email: "example@email.com",
        firstname: "e",
        lastname: "xample",
        phone: "01010101",
        address: "City",
        roles: [
          { id: 1, name: "Admin" },
          { id: 2, name: "Manager" },
        ],
        created_at: "2022-10-11T03:24:29.161Z",
        updated_at: "2022-10-11T03:24:29.161Z",
      },
    };
    let data: IGetOneUser | undefined;

    //Act
    service.auth().subscribe((response) => {
      expect(response.status).toBe("success");
      data = response;
    });
    const request = httpController.expectOne(url);
    request.flush(expected);

    //Assert
    httpController.verify();
    expect(data).toEqual(expected);
  });

  describe("method logout", () => {
    it("should remove token in localStorage", () => {
      // Act
      service.logout();
      // Assert
      expect(localStorage.getItem("token")).toBeFalsy();
    });
    it("should dispatch clearListCategories", () => {
      // A
      const spy = jest.spyOn(store, "dispatch");
      // A
      service.logout();
      // A
      expect(spy).toHaveBeenCalled();
    });

    it("should dispatch clearListCategories", () => {
      // A
      const spy = jest.spyOn(store, "dispatch");
      // A
      service.logout();
      // A
      expect(spy).toHaveBeenCalled();
    });

    it("should navigate to login page", () => {
      // A
      const routerParam = ["login"];
      const spy = jest.spyOn(service.router, "navigate");
      // A
      service.logout();
      // A
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(routerParam);
    });
  });

  describe("handleError", () => {
    it("should open snack bar", () => {
      // Arrange (example errorResponse)
      const errorResponse = new HttpErrorResponse({
        error: { code: "some code", message: "some message." },
        status: 400,
        statusText: "Bad Request",
      });

      const snackBar = jest.spyOn(service.snackBar, "open");
      // Act
      service.handleError(errorResponse);

      // Assert
      expect(snackBar).toHaveBeenCalled();
    });
  });
});
