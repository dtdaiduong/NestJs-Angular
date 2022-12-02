import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
  // MatSnackBarRef,
} from "@angular/material/snack-bar";
import { StoreModule } from "@ngrx/store";
// import { TableModule } from "../../common/table/table.module";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  selectpaginator,
  selectResAPIRoles,
  selectRoleslise,
} from "../../../store/roles/roles.selector";
import {
  clearSort,
  getListRoles,
  sortListRoles,
} from "../../../store/roles/roles.action";
import { roles, RolesComponent } from "./roles.component";
import { of } from "rxjs";
// import { DialoglService } from "../../common/dialog/dialog.service";
// import {} from "../../../store/roles/roles.actions";
import { DialogComponent } from "../../common/dialog/dialog.component";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TableModule } from "../../common/table/table.module";
// import { clearStateMessageRoles } from "../../../store/roles/roles.actions";
// import { DialoglService } from "../../common/dialog/dialog.service";
class snackBarMock {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open() {}
}
class dialogMock {
  open() {
    return {
      afterClosed: () => of({ data: { name: "string" } }),
    };
  }
}

describe("RolesComponent", () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;
  let store: MockStore;
  let snackBar: snackBarMock;
  let dialog: dialogMock;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolesComponent, DialogComponent],
      imports: [
        StoreModule.forRoot({}, {}),
        HttpClientModule,
        MatDialogModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        CommonModule,
        MatProgressSpinnerModule,
        TableModule,
        MatButtonModule,
        MatProgressBarModule,
      ],
      providers: [
        // DialoglService,
        {
          provide: MatSnackBar,
          useClass: snackBarMock,
        },
        {
          provide: MatDialog,
          useClass: dialogMock,
        },
        provideMockStore({
          selectors: [
            {
              selector: selectpaginator,
              value: {
                currentPage: 5,
                limit: 100,
                totalPage: 5,
                totalCount: 5,
                search: "Tada",
              },
            },
            {
              selector: selectRoleslise,
              value: [
                {
                  Created: "	8/17/2022, 2:37:39 PM",
                  id: 1,
                  name: "Anh Tu",
                  Updated: "8/17/2022, 2:37:39 PM",
                },
                {
                  Created: "	8/17/2022, 2:37:39 PM",
                  id: 2,
                  name: "Len",
                  Updated: "8/17/2022, 2:37:39 PM",
                },
              ],
            },
            {
              selector: selectResAPIRoles,
              value: {
                status: "",
                statusCode: 5,
                message: "",
                error: "asdas",
                data: [],
              },
            },
          ],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
    snackBar = TestBed.get(MatSnackBar);
    dialog = TestBed.get(MatDialog);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should handle paginator when handlePaginator function is call", () => {
    // arrange
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.handlePaginator({ pageIndex: 5, pageSize: 5 });
    // assert
    expect(component.pageIndex).toBe(5);
    expect(component.pageSize).toBe(5);

    expect(dispatchSpy)
      // .toBe(2);
      .toHaveBeenCalledWith(
        getListRoles({
          currentPage: 5,
          limit: 5,
          search: component.searchInput,
          col: "",
          criteria: "",
        }),
      );
  });
  describe("ngOnInit", () => {
    it("select", () => {
      jest.spyOn(store, "dispatch");
      component.pageSize = 1;
      component.paginator = store.select(selectpaginator);
      jest.spyOn(component.paginator, "subscribe");
      component.ngOnInit();
      expect(component.pageSize).toBe(100);
      expect(component.searchInput).toBe("Tada");
      expect(component.paginator.subscribe).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(getListRoles());
    });
    it("should show notification when value message or error is exits", () => {
      component.resAPI$ = store.select(selectResAPIRoles);
      jest.spyOn(store, "dispatch");
      const a = jest.spyOn(store, "dispatch");

      jest.spyOn(snackBar, "open");
      jest.spyOn(component.resAPI$, "subscribe");
      component.ngOnInit();

      expect(snackBar.open).toHaveBeenCalled();
      expect(component.resAPI$.subscribe).toHaveBeenCalled();
    });
  });

  describe("handleSearch", () => {
    describe("should get list roles when case search is run  ", () => {
      // arrange
      // act

      it("should get list roles when search value change", () => {
        const dispatchSpy = jest.spyOn(store, "dispatch");
        component.searchInput = "tada";
        component.handleSearch({
          type: "Search",
          value: { searchString: "a", searchOption: [] },
        });
        expect(component.searchInput).toBe("a");
        expect(dispatchSpy).toHaveBeenCalledWith(
          getListRoles({
            currentPage: 1,
            limit: component.pageSize,
            search: component.searchInput,
            col: "",
            criteria: "",
          }),
        );
      });
      it("should handle search when search value not change", () => {
        const dispatchSpy = jest.spyOn(store, "dispatch");

        component.searchInput = "tada";
        component.handleSearch({
          type: "Search",
          value: { searchString: "", searchOption: [] },
        });
        expect(component.searchInput).toBe("tada");
        expect(dispatchSpy.mock.calls.length).toBe(0);
      });
      // fixture.detectChanges();s
      // assert
    });
    describe("should get list roles when case clear search is run ", () => {
      // arrange
      // act

      it("should get list roles when search value is not empty ", () => {
        const dispatchSpy = jest.spyOn(store, "dispatch");
        component.searchInput = "tada";
        component.pageSize = 5;
        component.handleSearch({
          type: "clearSearch",
          value: { searchString: "", searchOption: [] },
        });
        expect(component.searchInput).toBe("");
        expect(dispatchSpy).toHaveBeenCalledWith(
          getListRoles({
            currentPage: 1,
            limit: component.pageSize,
            search: "",
            col: "",
            criteria: "",
          }),
        );
      });
      it("should get list roles when search value is empty  ", () => {
        const dispatchSpy = jest.spyOn(store, "dispatch");

        component.searchInput = "";
        component.handleSearch({
          type: "clearSearch",
          value: { searchString: "sad", searchOption: [] },
        });
        expect(component.searchInput).toBe("");
        expect(dispatchSpy.mock.calls.length).toBe(0);
      });
      // fixture.detectChanges();s
      // assert
    });
  });
  it("openCreate", () => {
    jest.spyOn(dialog, "open");
    //   .mockReturnValue({ afterClosed: () => of({ data: { name: "string" } }) });
    // jest.spyOn(dialog.open().afterClosed,"");
    jest.spyOn(store, "dispatch");

    component.openCreate();
    expect(dialog.open).toHaveBeenCalled();
  });
  describe("handleActions", () => {
    it("should handle delete role when case delete is run", () => {
      jest.spyOn(dialog, "open");
      jest.spyOn(dialog.open(), "afterClosed").mockReturnValue(
        of({
          data: {
            name: "s",
          },
        }),
      );
      component.handleActions({ type: "delete", value: "" });
      expect(dialog.open).toHaveBeenCalled();
    });
    it("should handle edit role when case edit is run", () => {
      jest.spyOn(dialog, "open");
      component.handleActions({ type: "edit", value: "" });
      expect(dialog.open).toHaveBeenCalled();
    });
    it("Case default", () => {
      jest.spyOn(dialog, "open");
      component.handleActions({ type: "s", value: "" });
      expect(dialog.open).not.toHaveBeenCalled();
    });
  });
  describe("onSort", () => {
    it("should sort when case sort is run", () => {
      component.criteria = "sd";
      const dispatchSpy = jest.spyOn(store, "dispatch");
      component.onSort({ col: "name", criteria: "desc" });

      expect(component.criteria).toBe("desc");
      expect(dispatchSpy)
        // .toBe(2);
        .toHaveBeenCalledWith(
          getListRoles({
            currentPage: 1,
            limit: 100,
            search: component.searchInput,
            col: "name",
            criteria: "desc",
          }),
        );
    });
    it("should sort when case sort is run", () => {
      component.criteria = "sd";
      const dispatchSpy = jest.spyOn(store, "dispatch");
      component.onSort({ col: "name", criteria: "clear" });

      expect(component.criteria).toBe("");
      expect(component.col).toBe("");

      expect(dispatchSpy)
        // .toBe(2);
        .toHaveBeenCalledWith(
          getListRoles({
            currentPage: 1,
            limit: 100,
            search: component.searchInput,
            col: "",
            criteria: "",
          }),
        );
    });
  });
  describe("handleSortClient", () => {
    it("should handleSortClient when unselective for column", () => {
      component.sortedData = [
        {
          Created: "	8/20/2022, 2:37:39 PM",
          id: 1,
          name: "Anh Tu",
          Updated: "8/12/2022, 2:37:39 PM",
        },
        {
          Created: "	8/17/2022, 2:37:39 PM",
          id: 2,
          name: "Len",
          Updated: "8/15/2022, 2:37:39 PM",
        },
        {
          Created: "	9/17/2022, 2:37:39 PM",
          id: 3,
          name: "Anh Tu 3",
          Updated: "8/17/2022, 2:37:39 PM",
        },
        {
          Created: "	8/17/2022, 2:37:39 PM",
          id: 2,
          name: "ELen",
          Updated: "8/17/2022, 2:37:39 PM",
        },
      ];
      component.handleSortClient({ active: "s", direction: "" });

      const dispatchSpy = jest.spyOn(store, "dispatch");
      component.handleSortClient({ active: "", direction: "" });

      expect(dispatchSpy)
        // .toBe(2);
        .toHaveBeenCalledWith(clearSort());
    });
    describe("should handleSortClient when selective for column", () => {
      it("should sort when unselective for column", () => {
        const dispatchSpy = jest.spyOn(store, "dispatch");
        const expected = [
          {
            Created: "8/20/2022, 2:37:39 PM",
            Updated: "8/20/2022, 2:37:39 PM",
            id: 1,
            name: "Anh Tu",
          },
          {
            Created: "9/17/2022, 2:37:39 PM",
            Updated: "8/17/2022, 2:37:39 PM",
            id: 3,
            name: "Anh Tu 3",
          },
          {
            Created: "8/17/2022, 2:37:39 PM",
            Updated: "8/17/2022, 2:37:39 PM",
            id: 2,
            name: "ELen",
          },
          {
            Created: "9/17/2022, 2:37:39 PM",
            Updated: "8/15/2022, 2:37:39 PM",
            id: 2,
            name: "Len",
          },
        ];
        const expectedCreate = [
          {
            Created: "8/17/2022, 2:37:39 PM",
            Updated: "8/17/2022, 2:37:39 PM",
            id: 2,
            name: "ELen",
          },
          {
            Created: "8/20/2022, 2:37:39 PM",
            Updated: "8/20/2022, 2:37:39 PM",
            id: 1,
            name: "Anh Tu",
          },
          {
            Created: "9/17/2022, 2:37:39 PM",
            Updated: "8/17/2022, 2:37:39 PM",
            id: 3,
            name: "Anh Tu 3",
          },

          {
            Created: "9/17/2022, 2:37:39 PM",
            Updated: "8/15/2022, 2:37:39 PM",
            id: 2,
            name: "Len",
          },
        ];
        const expectedUpdate = [
          {
            Created: "9/17/2022, 2:37:39 PM",
            Updated: "8/15/2022, 2:37:39 PM",
            id: 2,
            name: "Len",
          },
          {
            Created: "8/17/2022, 2:37:39 PM",
            Updated: "8/17/2022, 2:37:39 PM",
            id: 2,
            name: "ELen",
          },

          {
            Created: "9/17/2022, 2:37:39 PM",
            Updated: "8/17/2022, 2:37:39 PM",
            id: 3,
            name: "Anh Tu 3",
          },

          {
            Created: "8/20/2022, 2:37:39 PM",
            Updated: "8/20/2022, 2:37:39 PM",
            id: 1,
            name: "Anh Tu",
          },
        ];
        component.sortedData = [
          {
            Created: "8/20/2022, 2:37:39 PM",
            id: 1,
            name: "Anh Tu",
            Updated: "8/20/2022, 2:37:39 PM",
          },
          {
            Created: "9/17/2022, 2:37:39 PM",
            id: 2,
            name: "Len",
            Updated: "8/15/2022, 2:37:39 PM",
          },
          {
            Created: "9/17/2022, 2:37:39 PM",
            id: 3,
            name: "Anh Tu 3",
            Updated: "8/17/2022, 2:37:39 PM",
          },
          {
            Created: "8/17/2022, 2:37:39 PM",
            id: 2,
            name: "ELen",
            Updated: "8/17/2022, 2:37:39 PM",
          },
        ];
        component.handleSortClient({ active: "name", direction: "asc" });

        expect(component.sortedData).toEqual(expected);
        expect(dispatchSpy).toHaveBeenCalledWith(
          sortListRoles({ roles: expected as roles[] }),
        );
        const dispatchSpyCreate = jest.spyOn(store, "dispatch");

        component.handleSortClient({ active: "Created", direction: "asc" });

        expect(component.sortedData).toEqual(expectedCreate);
        expect(dispatchSpyCreate).toHaveBeenCalledWith(
          sortListRoles({ roles: expectedCreate as roles[] }),
        );
        const dispatchSpyUpdate = jest.spyOn(store, "dispatch");

        component.handleSortClient({ active: "Updated", direction: "asc" });

        expect(component.sortedData).toEqual(expectedUpdate);
        expect(dispatchSpyUpdate).toHaveBeenCalledWith(
          sortListRoles({ roles: expectedUpdate as roles[] }),
        );
        component.handleSortClient({ active: "aa", direction: "desc" });
        expect(component.sortedData).toEqual([...expected].reverse());
      });
    });
  });
  describe("compare", () => {
    it("compare from z to a", () => {
      expect(component.compare(2, 3, false)).toBe(1);
      expect(component.compare(3, 2, false)).toBe(-1);
    });
    it("compare from a to z", () => {
      expect(component.compare(2, 3, true)).toBe(-1);
      expect(component.compare(3, 2, true)).toBe(1);
    });
  });
});
