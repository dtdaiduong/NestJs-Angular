import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { RouterTestingModule } from "@angular/router/testing";
import { Store, StoreModule } from "@ngrx/store";
import { UsersComponent } from "./users.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import * as UsersReducer from "../../store/users/users.reducer";
import { getPaginator } from "../../store/users/users.selector";
import { DeleteUser, GetAllUsers } from "../../store/users/users.action";
import { Router } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { selectRoles } from "../../store/roles/roles.selector";
import { UserFormComponent } from "./user-form/user-form.component";
import { ISort } from "../categories/categories.component.i";

class dialogMock {
  open() {
    return {
      afterClosed: () => of({ data: { name: "string" } }),
    };
  }
}

describe("UsersComponent", () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let store: Store;
  let router: Router;
  let dialog: dialogMock;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockStore: MockStore<{ users: UsersReducer.State }>;
  const initialState = {
    users: {
      data: {
        status: "success",
        message: "Get list successfully",
        data: [
          {
            id: 1,
            email: "thang@gmail.com",
            firstname: "hung 3",
            lastname: "pham thi",
            phone: "098765432133",
            address: "33 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-08-17T02:22:08.307Z",
            updated_at: "2022-10-03T02:40:19.073Z",
          },
          {
            id: 2,
            email: "thang@email.com",
            firstname: "Thảng",
            lastname: "dream",
            phone: "0356677889",
            address: "Hương Long",
            roles: [
              {
                id: 60,
                name: "Student",
              },
            ],
            created_at: "2022-08-17T02:22:08.307Z",
            updated_at: "2022-10-04T04:17:00.647Z",
          },
          {
            id: 47,
            email: "nhatba@gmail.com",
            firstname: "nhat",
            lastname: "ba",
            phone: "0393939394",
            address: "31 Lý Nam Đế",
            roles: [
              {
                id: 57,
                name: "Customer",
              },
            ],
            created_at: "2022-09-19T01:24:25.423Z",
            updated_at: "2022-09-19T03:04:13.292Z",
          },
          {
            id: 64,
            email: "nhatba1@gmail.com",
            firstname: "quang",
            lastname: "nhat",
            phone: "0987654321",
            address: "77 Nguyen Hue",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
            ],
            created_at: "2022-09-19T02:26:33.135Z",
            updated_at: "2022-09-19T02:26:33.135Z",
          },
          {
            id: 75,
            email: "user@email.com",
            firstname: "super",
            lastname: "admin",
            phone: "12",
            address: "12",
            roles: [
              {
                id: 56,
                name: "Admin",
              },
              {
                id: 58,
                name: "Manager",
              },
            ],
            created_at: "2022-09-23T04:51:45.187Z",
            updated_at: "2022-10-03T02:23:49.384Z",
          },
        ],
        currentPage: 1,
        limit: 5,
        totalCount: 16,
      },
      selected: null,
      action: "[ALL] Users",
      done: true,
      error: null,
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      providers: [
        // { provide: MatDialogRef, useValue: dialogMock },
        {
          provide: MatDialog,
          useClass: dialogMock,
        },
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: getPaginator,
              value: {
                currentPage: 1,
                limit: 5,
                totalCount: 16,
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
                    name: "string",
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
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatDialogModule,
        RouterTestingModule.withRoutes([
          { path: "admin/users/:id", component: UserFormComponent },
          { path: "admin/users/create", component: UserFormComponent },
        ]),
        BrowserAnimationsModule,
        StoreModule.forRoot({}, {}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    dialog = TestBed.get(MatDialog);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should make empty stringSearch after click Clear Search", () => {
    // arrange
    const expeted = "";
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.stringSearch = "string";
    // act
    component.handleSearch({
      type: "clearSearch",
      value: { searchString: "", searchOption: [] },
    });
    // assert
    expect(component.stringSearch).toBe(expeted);
    expect(dispatchSpy).toHaveBeenCalledWith(
      GetAllUsers({
        page: 1,
        limit: 5,
        search: "",
        roles: [],
      }),
    );
  });

  it("should handle paginator when handlePaginator function is call", () => {
    // arrange
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.handlepaginator({ pageIndex: 5, pageSize: 5 });
    // assert
    component.paginator.subscribe((data) => {
      expect(data.currentPage).toBe(5);
      expect(data.limit).toBe(5);
    });

    expect(dispatchSpy)
      // .toBe(2);
      .toHaveBeenCalledWith(
        GetAllUsers({
          page: 5,
          limit: 5,
          search: "",
          roles: [],
        }),
      );
  });

  it("should handle search with name and roles", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.rolesList = [
      {
        id: 56,
        name: "Admin",
      },
      {
        id: 60,
        name: "Student",
      },
    ];
    component.handleSearch({
      type: "Search",
      value: {
        searchString: "nha",
        searchOption: ["Admin", "Student"],
      },
    });

    component.paginator.subscribe((data) => {
      expect(data.totalCount).toBe(16);
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it("should handle search with name", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.handleSearch({
      type: "Search",
      value: {
        searchString: "nha",
        searchOption: [],
      },
    });

    expect(component.rolesSearch).toEqual([]);
    expect(component.stringSearch).toEqual("nha");
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it("should handle search with roles", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.rolesList = [
      {
        id: 56,
        name: "Admin",
      },
      {
        id: 60,
        name: "Student",
      },
    ];
    component.handleSearch({
      type: "Search",
      value: {
        searchString: "",
        searchOption: ["Admin", "Student"],
      },
    });

    expect(component.rolesSearch).toEqual([56, 60]);
    expect(component.stringSearch).toEqual("");
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it("should handle delete user when case delete is run", () => {
    const dialog = jest.spyOn(component.dialog, "open");
    const store = jest.spyOn(component.store, "dispatch");
    const action = DeleteUser({ id: 156 });
    component.handle({
      type: "delete",
      value: {
        id: 156,
        firstname: "nhat",
        lastname: "truong",
      },
    });
    expect(dialog).toHaveBeenCalled();
    expect(store).toHaveBeenCalledWith(action);
  });

  it("should handle edit role when case delete is run", () => {
    const navigate = jest.spyOn(router, "navigate");
    component.handle({
      type: "edit",
      value: {
        id: 156,
        firstname: "nhat",
        lastname: "truong",
      },
    });
    expect(navigate).toHaveBeenCalled();
  });

  it("should handle when case dafault is run", () => {
    const dialogOpen = jest.spyOn(component.dialog, "open");
    component.handle({
      type: "default",
      value: {},
    });
    expect(dialogOpen).not.toHaveBeenCalled();
  });

  it("should call navigate when openCreate is call", () => {
    const navigate = jest.spyOn(router, "navigate");
    component.openCreate();
    expect(navigate).toHaveBeenCalled();
  });

  it("should handle compare array in OnInit() function", () => {
    component.lstRoles = store.select(selectRoles);
    const a = jest.spyOn(component.lstRoles, "subscribe");
    component.ngOnInit();
    expect(a).toHaveBeenCalled();
    expect(component.allFruits).toEqual(["string"]);
  });

  it("should handle sort with criteria = clear", () => {
    //Arrange
    const e: ISort = {
      col: "firstname",
      criteria: "clear",
    };
    const expeted = {
      col: "",
      criteria: "",
    };
    //Act
    component.handleSort(e);
    //Assert
    expect(component.sort).toEqual(expeted);
  });

  it("should handle sort", () => {
    //Arrange
    const e: ISort = {
      col: "firstname",
      criteria: "asc",
    };
    //Act
    component.handleSort(e);
    //Assert
    expect(component.sort).toEqual(e);
  });

  it("should handle ClientSort with direction empty", () => {
    //Arrange
    const e: { active: string; direction: string } = {
      active: "firstname",
      direction: "",
    };
    const expeted = {
      col: "",
      criteria: "",
    };
    //Act
    component.sortClient(e);
    //Assert
    expect(component.sort).toEqual(expeted);
  });

  it("should handle clientSort", () => {
    //Arrange
    const e: { active: string; direction: string } = {
      active: "firstname",
      direction: "asc",
    };
    //Act
    component.sortClient(e);
    //Assert
    expect(component.sort).toEqual({ col: e.active, criteria: e.direction });
  });
});
