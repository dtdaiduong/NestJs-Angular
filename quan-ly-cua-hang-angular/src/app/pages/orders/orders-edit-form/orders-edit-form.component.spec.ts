import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/compiler";
import { forwardRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { DialogComponent } from "../../../components/common/dialog/dialog.component";
import { TableModule } from "../../../components/common/table/table.module";
import {
  selectOrderData,
  selectPaginatorOrders
} from "../../../store/orders/orders.selector";
import {
  selectListProducts,
  selectResAPIProducts
} from "../../../store/products/products.selector";
import { selectpaginator } from "../../../store/roles/roles.selector";
import { OrdersEditFormComponent } from "./orders-edit-form.component";

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
describe("OrdersEditFormComponent", () => {
  let component: OrdersEditFormComponent;
  let fixture: ComponentFixture<OrdersEditFormComponent>;
  let store: MockStore;
  let dialog: dialogMock;
  let snackBar: snackBarMock;

  const category = [
    { id: 1, name: "admin", created_at: "11:20:2", updated_at: "11:22:2" },
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
        declarations: [OrdersEditFormComponent, DialogComponent],
        imports: [
          CommonModule,
          MatInputModule,
          TableModule,
          MatCardModule,
          MatButtonModule,
          RouterTestingModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
          MatSidenavModule,
          HttpClientTestingModule,
          FormsModule,
          MatTableModule,
          MatSelectModule,
          MatFormFieldModule,
          HttpClientTestingModule,
          MatDialogModule,
        ],
        providers: [
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
                selector: selectOrderData,
                value: {
                  id: 1,
                  user_id: 1,
                  firstname: "string",
                  product: [
                    {
                      id: 1,
                      name: "string",
                      quantity: 1,
                      price: 25000,
                      subprice: 25000,
                    },
                  ],
                  total_price: 25000,
                  create_at: "string",
                  update_at: "string",
                  status: "draft",
                },
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
            useExisting: forwardRef(() => OrdersEditFormComponent),
            multi: true,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents(),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.handlePaginator({ pageIndex: 1, pageSize: 1 });
    store = TestBed.inject(MockStore);
    dialog = TestBed.get(MatDialog);
    snackBar = TestBed.get(MatSnackBar);

  });

  describe("ngOnInit", () => {
    it("select ", () => {
      jest.spyOn(store, "dispatch");
      jest.spyOn(component, "renderData");
      component.pageSize = 1;
      component.paginator = store.select(selectPaginatorOrders);
      component.orders$ = store.select(selectOrderData);
      component.orders$.subscribe((data) => {
        console.log(data);
      });
      jest.spyOn(component.paginator, "subscribe");
      component.ngOnInit();
      expect(component.pageSize).toBe(1);
      expect(component.ListProducts).toEqual([
        {
          name: "string",
          productId: 1,
          quantity: 1,
          price: 25000,
        },
      ]);
      expect(component.pageIndex).toBe(1);
      expect(component.renderData).toHaveBeenCalledTimes(1);
    });

    it("should edit order has been paid", (done) => {
      const ast = jest.spyOn(component.orders$, "subscribe");
      store.overrideSelector(selectOrderData, {
        id: 1,
        user_id: 1,
        firstname: "string",
        product: [
          {
            id: 1,
            name: "string",
            quantity: 1,
            price: 25000,
            subprice: 25000,
          },
        ],
        total_price: 25000,
        create_at: "string",
        update_at: "string",
        status: "payment",
      });
      fixture.detectChanges();
      component.orders$ = store.select(selectOrderData);
      component.ngOnInit();
      component.orders$.subscribe((data) => {
        console.log(data.status);
        expect(data.status).toBe("payment");
        done();
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

    describe("addProduct", () => {
      it("should choose the same product", () => {
        component.ListProducts = [
          { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
        ];
        component.addProduct(product);
        expect(component.ListProducts).toEqual([
          { name: "ao so mi 1", productId: 1, quantity: 2, price: 50000 },
        ]);
      });
      it("should choose different product", () => {
        component.ListProducts = [
          { name: "ao so mi 2", productId: 2, quantity: 1, price: 25000 },
        ];
        component.addProduct(product);
        expect(component.ListProducts).toEqual([
          { name: "ao so mi 2", productId: 2, quantity: 1, price: 25000 },
          { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
        ]);
      });
    });

    describe("should update order", () => {
      it("should choose at least 1 product ", () => {
        component.ListProducts = [
          { name: "áo alo", productId: 2, quantity: 5, price: 25000 },
        ];
        component.editOrderSubmit();
      });
      it("should do not choose any products", ()=>{
        component.ListProducts=[];
        jest.spyOn(snackBar, "open");
        component.editOrderSubmit();
        expect(snackBar.open).toHaveBeenCalled();
      });
    });

    describe("shoule change quantity product", () => {
      it("should change quantity > 0", () => {
        const input: HTMLInputElement = { value: "2" } as HTMLInputElement;
        component.ListProducts = [
          { name: "ao so mi 1", productId: 2, quantity: 1, price: 25000 },
        ];
        component.onQuantityChange(input, 0);
        expect(component.ListProducts).toEqual([
          {
            name: "ao so mi 1",
            productId: 2,
            quantity: 2,
            price: 50000,
          },
        ]);
      });
      it("should choose quantity = 0", () => {
        component.ListProducts = [
          { name: "ao so mi 1", productId: 2, quantity: 0, price: 25000 },
        ];
        const input: HTMLInputElement = { value: "0" } as HTMLInputElement;
        component.onQuantityChange(input, 0);
        expect(component.ListProducts).toEqual([]);
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

    describe("should remove product of order", () => {
      it("remove product exist", () => {
        component.ListProducts = [
          { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
          { name: "ao so mi 2", productId: 2, quantity: 1, price: 25000 },
        ];

        component.removeProduct({
          name: "ao so mi 1",
          productId: 1,
          quantity: 1,
          price: 25000,
        });
        expect(component.ListProducts).toEqual([
          { name: "ao so mi 2", productId: 2, quantity: 1, price: 25000 },
        ]);
      });
      it("remove product not exist", () => {
        component.ListProducts = [
          { name: "ao so mi 1", productId: 1, quantity: 1, price: 25000 },
        ];
        component.removeProduct({
          name: "ao so mi 2",
          productId: 2,
          quantity: 1,
          price: 25000,
        });
        expect(component.ListProducts).toEqual([
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
        jest.spyOn(dialog, "open");
        component.search({ type: "", value: {searchString:"", searchOption: []} });
        expect(dialog.open).not.toHaveBeenCalled();
      });
    });

    describe("clearSearch", () => {
      const valueTest = {
        type: "clearSearch",
        value: { searchString: "searchText", searchOption: [] },
      };
      it("[5.1] should searchString is not null", () => {
        //Arrange
        const data = valueTest;
        //Act
        component.search(data);
        fixture.detectChanges();
        //Assert
        expect(data.value.searchString).not.toEqual("");
      });
      it("[5.2] should value of searchString is not empty", () => {
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
      it("[5.3] should fn renderData if 'searchString' is not null", () => {
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

    it("should create", () => {
      expect(component).toBeTruthy();
    });
  });
});
