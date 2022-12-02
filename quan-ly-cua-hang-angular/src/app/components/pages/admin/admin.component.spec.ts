import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { AppRoutingModule, routes } from "../../../app-routing.module";

import { LoginService } from "../../../pages/login/login.service";
import { AdminComponent } from "./admin.component";

describe("AdminComponent", () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatSidenavModule,
        MatTreeModule,
        MatIconModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        MatSnackBarModule,
        StoreModule,
      ],
      providers: [LoginService, provideMockStore({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should navigate when navigate func is run", () => {
    const flowCall = jest.spyOn(router, "navigate");
    component.navigate("/admin/roles");
    expect(flowCall).toHaveBeenCalledWith(["/admin/roles"]);
  });
});
