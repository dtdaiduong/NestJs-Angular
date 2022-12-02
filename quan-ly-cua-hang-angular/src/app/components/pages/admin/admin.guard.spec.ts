import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable, Observer, of, throwError } from "rxjs";
import { LoginService } from "../../../pages/login/login.service";
import { AdminGuard, ChildGuard, LoginGuard } from "./admin.guard";

@Component({
  template: "",
})
class MockComponent {
  mock!: string;
}

describe("AdminGuard", () => {
  let guard: AdminGuard;
  let loginService: LoginService;
  let router: Router;

  class LoginServiceMock {
    login = jest.fn();
    auth = jest.fn();
    logout = jest.fn();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: "login", component: MockComponent },
        ]),
      ],
      providers: [
        AdminGuard,
        { provide: LoginService, useClass: LoginServiceMock },
      ],
    });
    localStorage.clear();
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    guard = new AdminGuard(router, loginService);
  });

  it("should be created", () => {
    expect(loginService).toBeTruthy();
    expect(guard).toBeTruthy();
  });
  it("Token is not exist", () => {
    localStorage.removeItem("token");
    // jest.spyOn(loginService, "auth").mockReturnValue(of(true));
    expect(guard.canActivate()).toBe(false);
  });
  it("Token is exist", (done) => {
    localStorage.setItem("token", "sadas");
    jest
      .spyOn(loginService, "auth")
      .mockReturnValue(of({ status: "success", message: "" }));

    (guard.canActivate() as Observable<boolean>).subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });
  it("Token is exist but out of date", (done) => {
    localStorage.setItem("token", "sadas");
    jest
      .spyOn(loginService, "auth")
      .mockReturnValue(throwError(() => new Error("out of date")));
    (guard.canActivate() as Observable<boolean>).subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });
});
describe("LoginGuard", () => {
  let guard: LoginGuard;
  let loginService: LoginService;
  let router: Router;

  class LoginServiceMock {
    login = jest.fn();
    auth = jest.fn();
    logout = jest.fn();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: "login", component: MockComponent },
        ]),
      ],
      providers: [
        LoginGuard,
        { provide: LoginService, useClass: LoginServiceMock },
      ],
    });
    localStorage.clear();
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    guard = new LoginGuard(router, loginService);
  });

  it("should be created", () => {
    expect(loginService).toBeTruthy();
    expect(guard).toBeTruthy();
  });
  it("Token is not exist", () => {
    localStorage.removeItem("token");
    // jest.spyOn(loginService, "auth").mockReturnValue(of(true));
    expect(guard.canActivate()).toBe(true);
  });
  it("Token is exist", (done) => {
    localStorage.setItem("token", "sadas");
    jest
      .spyOn(loginService, "auth")
      .mockReturnValue(of({ status: "success", message: "" }));

    (guard.canActivate() as Observable<boolean>).subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });
  it("Token is exist but out of date", (done) => {
    localStorage.setItem("token", "sadas");
    jest
      .spyOn(loginService, "auth")
      .mockReturnValue(throwError(() => new Error("out of date")));
    (guard.canActivate() as Observable<boolean>).subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });
});
describe("ChildGuard", () => {
  let guard: ChildGuard;
  let loginService: LoginService;
  let router: Router;

  class LoginServiceMock {
    login = jest.fn();
    auth = jest.fn();
    logout = jest.fn();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: "login", component: MockComponent },
        ]),
      ],
      providers: [
        ChildGuard,
        { provide: LoginService, useClass: LoginServiceMock },
      ],
    });
    localStorage.clear();
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    guard = new ChildGuard(router, loginService);
  });

  it("should be created", () => {
    expect(loginService).toBeTruthy();
    expect(guard).toBeTruthy();
  });
  it("Token is not exist", () => {
    localStorage.removeItem("token");
    // jest.spyOn(loginService, "auth").mockReturnValue(of(true));
    expect(guard.canActivateChild()).toBe(false);
  });
  it("Token is exist", (done) => {
    localStorage.setItem("token", "sadas");
    jest
      .spyOn(loginService, "auth")
      .mockReturnValue(of({ status: "success", message: "" }));

    (guard.canActivateChild() as Observable<boolean>).subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });
  it("Token is exist but out of date", (done) => {
    localStorage.setItem("token", "sadas");
    jest
      .spyOn(loginService, "auth")
      .mockReturnValue(throwError(() => new Error("out of date")));
    (guard.canActivateChild() as Observable<boolean>).subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });
});
