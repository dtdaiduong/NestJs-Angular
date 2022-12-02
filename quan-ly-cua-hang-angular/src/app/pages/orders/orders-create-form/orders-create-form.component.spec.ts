import { HttpClientTestingModule } from "@angular/common/http/testing";
import { forwardRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { DialogComponent } from "../../../components/common/dialog/dialog.component";
import { selectPaginatorOrders } from "../../../store/orders/orders.selector";
import {
  selectListProducts,
  selectResAPIProducts,
} from "../../../store/products/products.selector";
import { selectpaginator } from "../../../store/roles/roles.selector";
import { getAllUsers } from "../../../store/users/users.selector";
import { OrdersCreateFormComponent } from "./orders-create-form.component";
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
describe("OrdersFromComponent", () => {
  let component: OrdersCreateFormComponent;
  let fixture: ComponentFixture<OrdersCreateFormComponent>;
  let store: MockStore;
  let snackBar: snackBarMock;
  let dialog: dialogMock;
  const category = [
    { id: 1, name: "admin", created_at: "11:20:2", updated_at: "11:22:2" },
    { id: 2, name: "user", created_at: "11:20:2", updated_at: "11:22:2" },
  ];
  const product = {
    id: 1,
    name: "ao so mi 1",
    description: "dep",
    price: 25000,
    image: "anh day",
    category: category,
    created_at: "11:20:2",
    updated_at: "11:20:2",
  };

  beforeEach(
    async () =>
      await TestBed.configureTestingModule({
        declarations: [OrdersCreateFormComponent, DialogComponent],
        imports: [
          RouterTestingModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
          MatSidenavModule,
          HttpClientTestingModule,
          FormsModule,
          MatTableModule,
          MatSelectModule,
          MatDialogModule,
        ],
        providers: [
          {
            provide: Router,
            useValue: {
               url: "admin/orders"
            }
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
                  search: "Pagi",
                },
              },
              {
                selector: selectListProducts,
                value: [
                  {
                    id: 1,
                    name: "product 1",
                    price: 25000,
                  },
                  {
                    id: 2,
                    name: "product 2",
                    price: 20000,
                  },
                ],
              },
              {
                selector: selectResAPIProducts,
                value: {
                  status: "",
                  statusCode: 5,
                  message: "",
                  error: "asdas",
                  data: [],
                },
              },
              {
                selector: selectPaginatorOrders,
                value: {
                  currentPage: 1,
                  totalPage: 1,
                  limit: 1,
                  totalCount: 2,
                  search: "",
                },
              },
              {
                selector: getAllUsers,
                value: [
                  {
                    id: 1,
                    email: "",
                    firstname: "string",
                    lastname: "string",
                    phone: "string",
                    address: "string",
                    roles: [
                      {
                        id: 1,
                        name: "string",
                      },
                    ],
                    created_at: "string",
                    updated_at: "string",
                  },
                ],
              },
            ],
          }),
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
            useExisting: forwardRef(() => OrdersCreateFormComponent),
            multi: true,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents(),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.handlePaginator({ pageIndex: 1, pageSize: 1 });
    store = TestBed.inject(MockStore);
    dialog = TestBed.get(MatDialog);
    snackBar = TestBed.get(MatSnackBar);
  });

  describe("ngOnInit", () => {
    it("select", () => {
      jest.spyOn(store, "dispatch");
      jest.spyOn(component, "renderData");
      component.pageSize = 1;
      component.paginator = store.select(selectPaginatorOrders);
      component.users$ = store.select(getAllUsers);
      jest.spyOn(component.paginator, "subscribe");
      component.ngOnInit();
      expect(component.pageSize).toBe(1);
      expect(component.Users).toEqual([
        {
          id: 1,
          email: "",
          firstname: "string",
          lastname: "string",
          phone: "string",
          address: "string",
          roles: [
            {
              id: 1,
              name: "string",
            },
          ],
          created_at: "string",
          updated_at: "string",
        },
      ]);
      expect(component.pageIndex).toBe(1);
      expect(component.renderData).toHaveBeenCalledTimes(1);
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
        category: [],
      };
      component.ngOnInit();
      fixture.detectChanges();
      expect(renderData).toHaveBeenCalledTimes(1);
      expect(renderData).toHaveBeenCalledWith(
        expected.pageIndex,
        expected.pageSize,
        expected.search,
        expected.category,
      );
    });
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("addProduct", () => {
    it("should choose the product", () => {
      component.listItem = [
        { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
      ];
      component.addProduct(product);
      expect(component.listItem).toEqual([
        { name: "ao so mi 1", productId: 1, quantity: 2, price: 50000 },
      ]);
    });
    it("should choose different product", () => {
      component.listItem = [
        { name: "ao so mi 2", productId: 2, quantity: 1, price: 25000 },
      ];
      component.addProduct(product);
      expect(component.listItem).toEqual([
        { name: "ao so mi 2", productId: 2, quantity: 1, price: 25000 },
        { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
      ]);
    });
  });

  describe("should create order", () => {
    it("should do not choose any products", () => {
      component.listItem = [];
      jest.spyOn(snackBar, "open");
      component.createOrderSubmit();
      expect(snackBar.open).toHaveBeenCalled();
    });
    it("should do not choose user", () => {
      component.listItem = [
        { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
      ];
      jest.spyOn(snackBar, "open");
      component.createOrderSubmit();
      expect(snackBar.open).toHaveBeenCalled();
    });
    it("should choose at least 1 product", () => {
      component.formControl = new FormControl();
      component.userid = new FormControl(1);
      component.listItem = [
        { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
      ];
      component.createOrderSubmit();
    });
  });

  describe("shoule change quantity product", () => {
    it("should change quantity > 0", () => {
      const input: HTMLInputElement = { value: "2" } as HTMLInputElement;
      component.listItem = [
        { name: "ao so mi 1", productId: 2, quantity: 1, price: 25000 },
      ];
      component.onQuantityChange(input, 0);
      expect(component.listItem).toEqual([
        {
          name: "ao so mi 1",
          productId: 2,
          quantity: 2,
          price: 50000,
        },
      ]);
    });
    it("should choose quantity = 0", () => {
      component.listItem = [
        { name: "ao so mi 1", productId: 2, quantity: 0, price: 25000 },
      ];
      const input: HTMLInputElement = { value: "0" } as HTMLInputElement;
      component.onQuantityChange(input, 0);
      expect(component.listItem).toEqual([]);
    });
  });

  describe("should click icon ", () => {
    it("should click icon add product", () => {
      jest.spyOn(dialog, "open");
      component.handle({ type: "add", value: "" });
      expect(dialog.open).not.toHaveBeenCalled();
    });
    it("Case default", () => {
      component.handle({ type: "", value: "" });
    });
  });
  describe("should remove order", () => {
    it("remove product exist", () => {
      component.listItem = [
        { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
        { name: "ao so mi 2", productId: 2, quantity: 1, price: 25000 },
      ];

      component.removeProduct({
        name: "ao so mi 1",
        productId: 1,
        quantity: 1,
        price: 25000,
      });
      expect(component.listItem).toEqual([
        { name: "ao so mi 2", productId: 2, quantity: 1, price: 25000 },
      ]);
    });
    it("remove product not exist", () => {
      component.listItem = [
        { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
      ];
      component.removeProduct({
        name: "ao so mi 2",
        productId: 2,
        quantity: 1,
        price: 25000,
      });
      expect(component.listItem).toEqual([
        { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
      ]);
    });
  });

  describe("search product", () => {
    it("should have fn search with parameter", () => {
      // Arranger
      const valueTest = {
        type: "Search",
        value: { searchString: "searchText", searchOption: [] },
      };
      const searchSpy = jest.spyOn(component, "search");
      //Act
      component.search(valueTest);
      fixture.detectChanges();
      // Assert
      expect(searchSpy).toHaveBeenCalledWith(valueTest);
    });
    it("should check value of parameter key 'searchString' is truthy and not null and not equal searchInput of component", () => {
      // Arrange
      const valueTest = {
        type: "Search",
        value: { searchString: "searchText", searchOption: [] },
      };
      const TestData = valueTest;
      const searchInput = component.searchInput;
      expect(valueTest.value.searchString).not.toEqual(searchInput);
      //Act
      component.search(TestData);
      fixture.detectChanges();
      // Assert
      expect(TestData.value.searchString).toBeTruthy;
      expect(TestData.value.searchString).not.toEqual("");
    });
    it("should change value variable searchInput of component if return true", () => {
      // Arrange
      const valueTest = {
        type: "Search",
        value: { searchString: "searchText", searchOption: [] },
      };
      const TestData = valueTest;
      const searchInput = component.searchInput; //now is undefined
      expect(TestData.value.searchString).not.toEqual(searchInput);
      expect(TestData.value.searchString).toBeTruthy;
      expect(TestData.value.searchString).not.toEqual("");
      //Act
      component.search(TestData);
      fixture.detectChanges();
      // Assert
      expect(component.searchInput).toEqual(TestData.value.searchString);
    });
    it("should call fn renderData if return true", () => {
      // Arrange
      const valueTest = {
        type: "Search",
        value: { searchString: "searchText", searchOption: [] },
      };
      const TestData = valueTest;
      const searchInput = component.searchInput; //now is undefined
      const category: never[] = [];
      expect(TestData.value.searchString).not.toEqual(searchInput);
      expect(TestData.value.searchString).toBeTruthy;
      expect(TestData.value.searchString).not.toEqual("");
      const renderDataSpy = jest.spyOn(component, "renderData");
      //Act
      component.search(TestData);
      fixture.detectChanges();
      // Assert
      expect(renderDataSpy).toHaveBeenCalledWith(
        1,
        component.pageSize,
        component.searchInput,
        category,
      );
    });
    it("Case default", () => {
      component.search({
        type: "",
        value: { searchString: "", searchOption: [] },
      });
    });
  });

  describe("clearSearch", () => {
    const valueTest = {
      type: "clearSearch",
      value: { searchString: "searchText", searchOption: [] },
    };
    it("should searchString is not null", () => {
      //Arrange
      const data = valueTest;
      //Act
      component.search(data);
      fixture.detectChanges();
      //Assert
      expect(data.value.searchString).not.toEqual("");
    });
    it("should value of searchString is not empty", () => {
      //Arrange
      const data = valueTest;
      expect(data.value.searchString).toBeTruthy;
      expect(data.value.searchString).not.toEqual("");
      //Act
      component.search(data);
      fixture.detectChanges();
      // Assert
      expect(component.searchInput).toEqual("");
    });
    it("should fn renderData if 'searchString' is not null", () => {
      //Arrange
      const data = valueTest;
      expect(data.value.searchString).toBeTruthy;
      expect(data.value.searchString).not.toEqual("");
      const renderData = jest.spyOn(component, "renderData");
      //Act
      component.search(data);
      fixture.detectChanges();
      //Assert
      expect(renderData).toHaveBeenCalledWith(1, component.pageSize, "", []);
    });
  });
});
