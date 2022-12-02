import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { MaterialModule } from "../../material/material.module";
import { LoginService } from "../login/login.service";

import { ProfileComponent } from "./profile.component";

describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockReturn = {
    statusCode: 200,
    status: "success",
    message: "get one success",
    data: {
      id: 1,
      email: "example@email.com",
      firstname: "e",
      lastname: "xample",
      phone: "01010101",
      address: "city",
      roles: [
        {
          id: 1,
          name: "admin",
        },
      ],
      created_at: "",
      updated_at: "",
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule],
      declarations: [ProfileComponent],
      providers: [
        provideMockStore({}),
        {
          provide: LoginService,
          useValue: {
            auth: () => of(mockReturn),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("on Init", () => {
    it("should subscribe method auth of loginService", () => {
      // A
      const spy = jest.spyOn(component.loginService, "auth");
      // A
      component.ngOnInit();
      // A
      expect(spy).toHaveBeenCalled();
    });

    it("---> if res return with data: should set value for profile property", () => {
      // Act
      component.ngOnInit();
      // Assert
      expect(component.profile).toBeTruthy();
      expect(component.profile).toBe(mockReturn.data);
    });
  });
});
