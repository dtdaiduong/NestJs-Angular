import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { getOneUser } from "../../../store/users/users.selector";
import { MaterialModule } from "../../../material/material.module";
import { UserFormComponent } from "./user-form.component";
import { Store } from "@ngrx/store";
import { selectRoles } from "../../../store/roles/roles.selector";
import { AddUser, UpdateUser } from "../../../store/users/users.action";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { of } from "rxjs";

describe("UserFormComponent", () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: "1",
              }),
            },
          },
        },
        FormBuilder,
        provideMockStore({
          selectors: [
            {
              selector: getOneUser,
              value: {
                id: 1,
                email: "truongnhat@gmail.com",
                firstname: "nhat",
                lastname: "truong",
                phone: "0202030403",
                address: "77 nguyen hue",
                roles: [
                  {
                    id: 56,
                    name: "Admin",
                  },
                ],
                created_at: "2022-10-11T03:46:20.936Z",
                updated_at: "2022-10-11T03:46:20.936Z",
              },
            },
            {
              selector: selectRoles,
              value: {
                roles: [
                  {
                    key: 1,
                    Action: "string",
                    Created: "string",
                    id: 5,
                    name: "Admin",
                    Updated: "string",
                  },
                  {
                    key: 2,
                    Action: "string",
                    Created: "string",
                    id: 2,
                    name: "Customer",
                    Updated: "string",
                  },
                ],
                currentPage: 1,
                limit: 1,
                totalPage: 1,
                totalCount: 1,
                search: "string",
              },
            },
          ],
        }),
        FormControl,
      ],
      imports: [
        RouterTestingModule,
        MaterialModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should assign data to user form", () => {
    component.user$ = store.select(getOneUser);
    component.roles$ = store.select(selectRoles);
    const a = jest.spyOn(component.user$, "subscribe");
    component.ngOnInit();
    expect(component.userForm.value).toEqual({
      firstname: "nhat",
      lastname: "truong",
      phone: "0202030403",
      address: "77 nguyen hue",
      email: "truongnhat@gmail.com",
    });
    expect(a).toHaveBeenCalled();
    expect(component.allFruits).toEqual(["Admin", "Customer"]);
    expect(component.rolesList).toEqual([
      {
        key: 1,
        Action: "string",
        Created: "string",
        id: 5,
        name: "Admin",
        Updated: "string",
      },
      {
        key: 2,
        Action: "string",
        Created: "string",
        id: 2,
        name: "Customer",
        Updated: "string",
      },
    ]);
  });

  it("should handle addUser when acctionBtn to equal 'Save'", () => {
    component.actionBtn = "Save";
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.rolesList = [
      {
        key: 1,
        Action: "string",
        Created: "string",
        id: 1,
        name: "Admin",
        Updated: "string",
      },
      {
        key: 2,
        Action: "string",
        Created: "string",
        id: 2,
        name: "Customer",
        Updated: "string",
      },
    ];
    component.fruits = ["Admin"];
    const expected = [
      {
        key: 1,
        Action: "string",
        Created: "string",
        id: 1,
        name: "Admin",
        Updated: "string",
      },
    ];
    component.addUser();
    expect(component.rolesChoosed).toEqual(expected);
    expect(dispatchSpy).toHaveBeenCalledWith(
      UpdateUser({
        id: 1,
        firstname: "nhat",
        lastname: "truong",
        email: "truongnhat@gmail.com",
        phone: "0202030403",
        address: "77 nguyen hue",
        roles: component.rolesChoosed,
      }),
    );
  });

  it("should handle addUser when acctionBtn to equal 'Add'", () => {
    component.actionBtn = "Add";
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.rolesList = [
      {
        key: 1,
        Action: "string",
        Created: "string",
        id: 1,
        name: "Admin",
        Updated: "string",
      },
      {
        key: 2,
        Action: "string",
        Created: "string",
        id: 2,
        name: "Customer",
        Updated: "string",
      },
    ];
    component.fruits = ["Admin"];
    const expected = [
      {
        key: 1,
        Action: "string",
        Created: "string",
        id: 1,
        name: "Admin",
        Updated: "string",
      },
    ];
    component.addUser();
    expect(component.rolesChoosed).toEqual(expected);
    expect(dispatchSpy).toHaveBeenCalledWith(
      AddUser({
        firstname: "nhat",
        lastname: "truong",
        email: "truongnhat@gmail.com",
        phone: "0202030403",
        address: "77 nguyen hue",
        roles: component.rolesChoosed,
      }),
    );
  });

  it("should handle remove list roles", () => {
    component.fruits = ["Admin", "Customer"];
    component.remove("Admin");
    expect(component.fruits).toEqual(["Customer"]);
  });

  it("should handle when selected called", () => {
    component.fruits = ["Admin", "Customer"];
    const event: MatAutocompleteSelectedEvent = {
      option: {
        viewValue: "Student",
      },
    } as MatAutocompleteSelectedEvent;
    component.selected(event);
    expect(component.fruits).toEqual(["Admin", "Customer", "Student"]);
  });

  it("should handle when _filter called", () => {
    component.allFruits = ["Admin", "Customer", "Teacher"];
    component._filter("a");
    expect(component._filter("a")).toEqual(["Admin", "Teacher"]);
  });

  it("should handle filteredFruits in ngOninit called", (done) => {
    component.fruitCtrl.setValue("a");
    component.filteredFruits.subscribe((data) => {
      expect(data).toEqual(["Admin", "Customer"]);
      done();
    });
  });
});
