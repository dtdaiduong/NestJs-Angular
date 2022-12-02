import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { InputModule } from "../../components/common/input/input.module";
import { ProfileComponent } from "../profile/profile.component";

import { LoginComponent } from "./login.component";
import { LoginService } from "./login.service";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: LoginService;
  const mockLoginReturn = {
    status: "success",
    message: "Login successful",
    access_token: "example token",
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        RouterTestingModule.withRoutes([
          { path: "admin/profile", component: ProfileComponent },
        ]),
        HttpClientTestingModule,
        InputModule,
        NoopAnimationsModule,
      ],
      declarations: [LoginComponent],
      providers: [
        provideMockStore({}),
        {
          provide: LoginService,
          useValue: {
            login: () => of(mockLoginReturn),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    service = TestBed.inject(LoginService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("check Disable submit button", () => {
    it("Test 1. should return false if all form control is valid", () => {
      // Arrange (fake form control valid)
      component.emailFormControl.setValue("example@email.com");
      component.passwordFormControl.setValue("password");
      // Act
      const checkflag = component.checkDisable();
      // Assert
      expect(checkflag).toBe(false);
    });
    it("Test 2. should return true if all form control is invalid", () => {
      // Arrange (fake form control valid)
      component.emailFormControl.setValue("@email.com");
      component.passwordFormControl.setValue("x");
      // Act
      const checkflag = component.checkDisable();
      // Assert
      expect(checkflag).toBe(true);
    });
  });

  describe("login", () => {
    const testParam = {
      email: "example@email.com",
      password: "password",
    };

    it("Test 3. should check Disable submit button first", () => {
      // Arrange (fake form control valid)
      component.emailFormControl.setValue(testParam.email);
      component.passwordFormControl.setValue(testParam.password);
      // Act
      component.login(testParam.email, testParam.password);
      const flag = component.checkDisable();
      // Assert
      expect(flag).toBe(false);
    });

    it("---> if return false: should subscribe method login of loginService", () => {
      // Arrange (fake form control valid)
      component.emailFormControl.setValue(testParam.email);
      component.passwordFormControl.setValue(testParam.password);
      const spy = jest.spyOn(component.loginService, "login");

      // Act
      component.login(testParam.email, testParam.password);

      // Assert
      expect(spy).toHaveBeenCalled();
    });

    it("---> Test 4 ------->: should set new value token in localStorage", () => {
      // Arrange (fake form control valid)
      component.emailFormControl.setValue(testParam.email);
      component.passwordFormControl.setValue(testParam.password);
      // Act
      component.login(testParam.email, testParam.password);
      const token = localStorage.getItem("token");
      // Assert
      expect(token).toEqual("example token");
    });

    it("---> Test 5 ------->: should navigate to profile page", () => {
      // Arrange (fake form control valid)
      component.emailFormControl.setValue(testParam.email);
      component.passwordFormControl.setValue(testParam.password);
      const routerParam = ["admin/profile"];
      const spy = jest.spyOn(component.router, "navigate");

      // Act
      service.login(testParam.email, testParam.password).pipe = jest
        .fn()
        .mockImplementationOnce(() => of(mockLoginReturn));

      component.login(testParam.email, testParam.password);

      // Assert
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(routerParam);
    });
  });
});
