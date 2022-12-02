import { APP_BASE_HREF, CommonModule, Location } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { forwardRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { AppRoutingModule } from "../../app-routing.module";
import { DialogComponent } from "../../components/common/dialog/dialog.component";
import { TableModule } from "../../components/common/table/table.module";
import {
  selectArrayOrders,
  selectListOrders,
  selectPaginatorOrders,
  selectResAPIOrderError,
} from "../../store/orders/orders.selector";
import { OrdersEditFormComponent } from "./orders-edit-form/orders-edit-form.component";
import { OrdersComponent } from "./orders.component";

class dialogMock {
  open() {
    return {
      afterClosed: () => of({ data: { name: "string" } }),
    };
  }
}

class snackBarMock {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open() {}
}

describe("OrdersComponent", () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: MockStore;
  let router: Router;
  let dialog: dialogMock;
  let snackBar: snackBarMock;
  const orderHasBeenPaid = {
    order_id: 1,
    user_id: 1,
    firstname: "string",
    total_price: 2050000,
    status: "payment",
    create_at: "string",
    update_at: "string",
  };
  const unpaidOrder = {
    order_id: 1,
    user_id: 1,
    firstname: "string",
    total_price: 2050000,
    status: "draft",
    create_at: "string",
    update_at: "string",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersComponent, DialogComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: "admin/orders/edit/:orderID",
            component: OrdersEditFormComponent,
          },
        ]),
        NoopAnimationsModule,
        MatSidenavModule,
        HttpClientTestingModule,
        FormsModule,
        MatTableModule,
        MatSelectModule,
        CommonModule,
        HttpClientModule,
        AppRoutingModule,
        TableModule,
        MatTooltipModule,
        MatButtonModule,
        MatToolbarModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectPaginatorOrders,
              value: {
                currentPage: 5,
                limit: 100,
                totalPage: 5,
                totalCount: 5,
              },
            },
            {
              selector: selectListOrders,
              value: {
                orders: [
                  {
                    order_id: 1,
                    user_id: 1,
                    firstname: "string",
                    total_price: 10000,
                    status: "draft",
                    create_at: "string",
                    update_at: "string",
                  },
                  {
                    order_id: 2,
                    user_id: 2,
                    firstname: "string",
                    total_price: 10000,
                    status: "draft",
                    create_at: "string",
                    update_at: "string",
                  },
                ],
                currentPage: 2,
                limit: 5,
                totalPage: 2,
                totalCount: 10,
              },
            },
            {
              selector: selectResAPIOrderError,
              value: {
                status: "",
                statusCode: 5,
                message: "",
                error: "string",
                data: [],
              },
            },
            {
              selector: selectArrayOrders,
              value: [
                {
                  order_id: 1,
                  user_id: 1,
                  firstname: "string",
                  total_price: 2050000,
                  status: "payment",
                  create_at: "string",
                  update_at: "string",
                },
                {
                  order_id: 2,
                  user_id: 2,
                  firstname: "string",
                  total_price: 2050000,
                  status: "draft",
                  create_at: "string",
                  update_at: "string",
                },
              ],
            },
          ],
        }),
        { provide: APP_BASE_HREF, useValue: "/orders" },
        {
          provide: MatDialog,
          useClass: dialogMock,
        },
        {
          provide: MatSnackBar,
          useClass: snackBarMock,
        },
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => OrdersComponent),
          multi: true,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.handlePaginator({ pageIndex: 1, pageSize: 1 });
    store = TestBed.inject(MockStore);
    dialog = TestBed.get(MatDialog);
    snackBar = TestBed.get(MatSnackBar);
  });

  describe("ngonInit", () => {
    it("select", () => {
      jest.spyOn(store, "dispatch");
      jest.spyOn(component, "renderData");
      component.pageSize = 1;
      component.paginator = store.select(selectPaginatorOrders);
      component.dataSoure = store.select(selectArrayOrders);
      jest.spyOn(component.paginator, "subscribe");
      component.ngOnInit();
      expect(component.pageSize).toBe(100);
      expect(component.pageIndex).toBe(5);
      expect(component.renderData).toHaveBeenCalledTimes(1);
    });
  });

  describe("onSearch", () => {
    it("should return when Search function is call", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");
      component.onSearch({
        type: "Search",
        value: {
          searchString: "nha",
          searchOption: ["Admin", "Student"],
        },
      });
      expect(dispatchSpy).toHaveBeenCalled();
    });

    it("should return when Clear function is call", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");
      component.onSearch({
        type: "clearSearch",
        value: {
          searchString: "nha",
          searchOption: ["Admin", "Student"],
        },
      });
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe("onSort", () => {
    it("should return when Sort function is call", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");
      component.onSort({
        col: "firstname",
        criteria: "desc",
      });
      expect(dispatchSpy).toHaveBeenCalled();
    });
    it("should return when Clear function is call", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");
      component.onSort({
        col: "firstname",
        criteria: "clear",
      });
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe("Should call method renderData", () => {
    it("Should call method renderData", () => {
      const pageIndex = component.pageIndex;
      const pageSize = component.pageSize;
      const renderData = jest.spyOn(component, "renderData");
      const expected = {
        pageIndex: pageIndex ? pageIndex : 1,
        pageSize: pageSize ? pageSize : 5,
        search: "",
      };
      component.ngOnInit();
      fixture.detectChanges();
      expect(renderData).toHaveBeenCalledTimes(1);
      expect(renderData).toHaveBeenCalledWith(
        expected.pageIndex,
        expected.pageSize,
        expected.search,
      );
    });
  });

  describe("Should click icon", () => {
    it("should click icon edit order and choose order has been paid ", () => {
      jest.spyOn(snackBar, "open");
      component.handleActions({
        type: "edit",
        value: orderHasBeenPaid,
      });
      expect(snackBar.open).toHaveBeenCalled();
    });
    it("should choose unpaid order", () => {
      // Arrange
      const router = jest.spyOn(component.router, "navigate");
      const parameter = {
        type: "edit",
        value: unpaidOrder,
      };
      const naviParam = ["admin/orders/edit/", parameter.value.order_id];
      // Act
      component.handleActions(parameter);
      // Assert
      expect(router).toHaveBeenCalledWith(naviParam);
    });
    it("should click icon delete order and choose unpaid order", () => {
      jest.spyOn(dialog, "open");
      component.handleActions({
        type: "delete",
        value: unpaidOrder,
      });
      expect(dialog.open).toHaveBeenCalled();
    });
    it("should click icon delete order and choose order has been paid ", () => {
      jest.spyOn(snackBar, "open");
      component.handleActions({
        type: "delete",
        value: orderHasBeenPaid,
      });
      expect(snackBar.open).toHaveBeenCalled();
    });
    it("should click icon paying order and choose unpaid order", () => {
      jest.spyOn(dialog, "open");
      component.handleActions({
        type: "Paying",
        value: unpaidOrder,
      });
      expect(dialog.open).toHaveBeenCalled();
    });
    it("should click icon paying order and choose order has been paid ", () => {
      jest.spyOn(snackBar, "open");
      component.handleActions({
        type: "Paying",
        value: orderHasBeenPaid,
      });
      expect(snackBar.open).toHaveBeenCalled();
    });
    it("Case default", () => {
      jest.spyOn(dialog, "open");
      component.handleActions({ type: "s", value: "" });
      expect(dialog.open).not.toHaveBeenCalled();
    });
  });

  describe("Should Return when click handle action sort", () => {
    const data = [
      {
        order_id: 25,
        user_id: 1,
        firstname: "duong",
        total_price: "320000",
        status: "payment",
        create_at: "11/9/2022, 10:28:09 AM",
        update_at: "11/9/2022, 10:28:09 AM",
        Paying: {
          disabled: true,
        },
        edit: {
          disabled: true,
        },
        delete: {
          disabled: true,
        },
      },
      {
        order_id: 22,
        user_id: 2,
        firstname: "user",
        total_price: "1170000",
        status: "draft",
        create_at: "11/9/2022, 10:27:44 AM",
        update_at: "11/9/2022, 10:27:44 AM",
        Paying: {
          disabled: false,
        },
        edit: {
          disabled: false,
        },
        delete: {
          disabled: false,
        },
      },
      {
        order_id: 24,
        user_id: 3,
        firstname: "cao huu",
        total_price: "600000",
        status: "draft",
        create_at: "11/9/2022, 10:27:59 AM",
        update_at: "11/9/2022, 10:27:59 AM",
        Paying: {
          disabled: false,
        },
        edit: {
          disabled: false,
        },
        delete: {
          disabled: false,
        },
      },
      {
        order_id: 23,
        user_id: 4,
        firstname: "le thuy",
        total_price: "1125000",
        status: "draft",
        create_at: "11/9/2022, 10:27:52 AM",
        update_at: "11/9/2022, 10:27:52 AM",
        Paying: {
          disabled: false,
        },
        edit: {
          disabled: false,
        },
        delete: {
          disabled: false,
        },
      },
      {
        order_id: 21,
        user_id: 4,
        firstname: "le thuy",
        total_price: "1120000",
        status: "draft",
        create_at: "11/9/2022, 10:27:35 AM",
        update_at: "11/9/2022, 10:27:35 AM",
        Paying: {
          disabled: false,
        },
        edit: {
          disabled: false,
        },
        delete: {
          disabled: false,
        },
      },
    ];
    it("Should Return when sort other properties or click outside", () => {
      component.handleSortClient({ active: "order_id", direction: "" });
    });
    it("Should Return when sort order_id", () => {
      component.handleSortClient({ active: "order_id", direction: "asc" });
      component.sortedData = data;
    });
    it("Should Return when sort user_id", () => {
      component.handleSortClient({ active: "user_id", direction: "asc" });
      component.sortedData = data;
    });
    it("Should Return when sort firstname", () => {
      component.handleSortClient({ active: "firstname", direction: "asc" });
      component.sortedData = data;
    });
    it("Should Return when sort total_price", () => {
      component.handleSortClient({ active: "total_price", direction: "asc" });
      component.sortedData = data;
    });
    it("Should Return when sort create_at", () => {
      component.handleSortClient({ active: "create_at", direction: "asc" });
      component.sortedData = data;
    });
    it("Should Return when sort update_at", () => {
      component.handleSortClient({ active: "update_at", direction: "asc" });
      component.sortedData = data;
    });
    it("Case default", () => {
      component.handleSortClient({ active: "nope", direction: "asc" });
    });
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
