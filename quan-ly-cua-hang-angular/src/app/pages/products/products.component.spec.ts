import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { TableModule } from "../../components/common/table/table.module";
import { clearStateMessage } from "../../store/products/products.action";
import {
  selectMessageProduct,
  selectPaginatorProducts,
} from "../../store/products/products.selector";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { ProductsFormComponent } from "./products-form/products-form.component";
import { selectListCategories } from "../../store/categories/categories.selector";
import { ProductsComponent } from "./products.component";
import { ISort } from "./products.component.i";

describe("ProductsComponent", () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let store: Store;
  beforeEach(async () => {
    console.warn = jest.fn();
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: "admin/products/:productID",
            component: ProductsFormComponent,
          },
        ]),
        StoreModule.forRoot({}),
        RouterTestingModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        TableModule,
        HttpClientModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectPaginatorProducts,
              value: {
                currentPage: 1,
                totalPage: 5,
                limit: 5,
                totalCount: 10,
                search: "",
              },
            },
            {
              selector: selectMessageProduct,
              value: {
                status: "success",
                statusCode: 200,
                message: "",
                error: "",
                data: [],
              },
            },
            {
              selector: selectListCategories,
              value: {
                status: "string",
                message: "string",
                data: [
                  {
                    id: 1,
                    name: "cate1",
                    created_at: "",
                    updated_at: "",
                  },
                  {
                    id: 2,
                    name: "cate2",
                    created_at: "",
                    updated_at: "",
                  },
                ],
                currentPage: 1,
                totalPage: 3,
                limit: 5,
                totalCount: 15,
                search: "string",
              },
            },
          ],
        }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  describe("[1] Initial Component", () => {
    it("[1.1] should create", () => {
      expect(component).toBeTruthy();
    });

    it("[1.2] should have columns", () => {
      // Arrange
      component.displayedColumns = [];
      const expected = [
        { type: "text", name: "id" },
        { type: "text", name: "name" },
        { type: "text", name: "description" },
        { type: "text", name: "price" },
        { type: "img", name: "image" },
        { type: "array", name: "category" },
        { type: "action", name: "edit" },
        { type: "action", name: "delete" },
      ];
      // Act
      component.displayedColumns = expected;
      // Assert
      expect(component.displayedColumns).toEqual(expected);
    });

    it("[1.3] should have actions", () => {
      // Arrange
      component.actions = [];
      const expected = [
        { type: "text", name: "edit" },
        { type: "text", name: "delete" },
      ];
      // Act
      component.actions = expected;
      // Assert
      expect(component.actions).toEqual(expected);
    });
  });

  describe("[2] Initial Data", () => {
    it("[2.1] should call fn renderData", () => {
      //Arrange
      const renderData = jest.spyOn(component, "renderData");
      // Act
      component.ngOnInit();
      fixture.detectChanges();
      // Assert
      expect(renderData).toHaveBeenCalled();
    });
    it("[2.2] should have fn renderData with parameter", () => {
      // Arrange
      const renderData = jest.spyOn(component, "renderData");
      const expected = {
        pageIndex: component.pageIndex ? component.pageIndex : 1,
        pageSize: component.pageSize ? component.pageSize : 5,
        search: "",
        category: [],
      };
      // Act
      component.ngOnInit();
      fixture.detectChanges();
      // Assert
      expect(renderData).toHaveBeenCalledTimes(1);
      expect(renderData).toHaveBeenCalledWith(
        expected.pageIndex,
        expected.pageSize,
        expected.search,
        expected.category,
      );
    });
    it("[2.3] should handle lstCate$ in ngOnInit()", () => {
      //Arrange
      component.lstCate = store.select(selectListCategories);
      const temp = jest.spyOn(component.lstCate, "subscribe");
      const expected = ["cate1", "cate2"];
      const expected2 = [
        {
          id: 1,
          name: "cate1",
          created_at: "",
          updated_at: "",
        },
        {
          id: 2,
          name: "cate2",
          created_at: "",
          updated_at: "",
        },
      ];
      //Act
      component.ngOnInit();
      //Assert
      expect(temp).toHaveBeenCalled();
      expect(component.allFruits).toEqual(expected);
      expect(component.categoriesList).toEqual(expected2);
    });
  });

  describe("[3] handlePaginator", () => {
    it("[3.1] should call paginator selector", () => {
      // Arrange
      const subscribe = jest.spyOn(component.paginator, "subscribe");
      // Act
      component.ngOnInit();
      fixture.detectChanges();
      // Assert
      expect(subscribe).toHaveBeenCalled();
    });
    it("[3.2] should have fn handlePaginator with parameter", () => {
      // Arrange
      const valueTest = {
        pageIndex: 1,
        pageSize: 5,
      };
      const handlePaginator = jest.spyOn(component, "handlePaginator");
      // Act
      component.handlePaginator(valueTest);
      fixture.detectChanges();
      // Assert
      expect(handlePaginator).toHaveBeenCalledWith(valueTest);
    });
    it("[3.3] should have fn handlePaginator change parameter", () => {
      // Arrange
      const valueTest = {
        pageIndex: 1,
        pageSize: 5,
      };
      // Act
      component.handlePaginator(valueTest);
      fixture.detectChanges();
      // Assert
      expect(component.pageIndex).toBe(valueTest.pageIndex);
      expect(component.pageSize).toBe(valueTest.pageSize);
    });
  });

  describe("[4] search", () => {
    it("[4.1] should have fn search with parameter", () => {
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

    it("[4.2] should check value of parameter key 'searchString' is truthy and not null and not equal searchInput of component", () => {
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
    it("[4.3] should change value variable searchInput of component if [4.2] return true", () => {
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
    it("[4.4] should call fn renderData if [4.2] return true", () => {
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
    it("[4.5] should handle search() with cateID and name", () => {
      //Arrange
      const data = {
        type: "Search",
        value: {
          searchString: "string",
          searchOption: ["cate1", "cate2"],
        },
      };
      component.categoriesList = [
        {
          id: 1,
          name: "cate1",
          created_at: "",
          updated_at: "",
        },
        {
          id: 2,
          name: "cate2",
          created_at: "",
          updated_at: "",
        },
        {
          id: 3,
          name: "cate3",
          created_at: "",
          updated_at: "",
        },
      ];
      const expected: number[] = [1, 2];
      //Act
      component.search(data);
      //Assert
      expect(component.cateSearch).toEqual(expected);
    });

    it("[4.5] should handle cateID in search()", () => {
      //Arrange
      const data = {
        type: "Search",
        value: {
          searchString: undefined,
          searchOption: ["cate1", "cate2"],
        },
      };
      component.categoriesList = [
        {
          id: 1,
          name: "cate1",
          created_at: "",
          updated_at: "",
        },
        {
          id: 2,
          name: "cate2",
          created_at: "",
          updated_at: "",
        },
        {
          id: 3,
          name: "cate3",
          created_at: "",
          updated_at: "",
        },
      ];
      const expected: number[] = [1, 2];
      //Act
      component.search(data);
      //Assert
      expect(component.cateSearch).toEqual(expected);
    });
  });

  describe("[5] clearSearch", () => {
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
      component.searchInput = "string";
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

  describe("[6] handle", () => {
    it("[6.1] should call fn handle", () => {
      //Arrange
      const data = {
        type: "",
        value: {},
      };
      const handle = jest.spyOn(component, "handle");
      //Act
      component.handle(data);
      fixture.detectChanges();
      // Assert
      expect(handle).toHaveBeenCalledWith(data);
    });
    it("[6.2] should have fn handle with case edit", () => {
      //Arrange
      const data = {
        type: "edit",
        value: {
          id: 1,
          name: "Áo blue trắng",
          description: "Áo blue trắng vải mềm",
          price: 60000,
          image:
            "http://localhost:8000/api/uploads\\1664855768645-quanjean.jpg",
          category: [1, 2],
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };
      const routerSpy = jest.spyOn(component.getRouter(), "navigate");
      const finalPath = ["admin/products", data.value.id];
      //Act
      component.handle(data);
      fixture.detectChanges();
      // Assert
      expect(routerSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledWith(finalPath);
    });
    it("[6.3] should have fn handle with case delete", () => {
      //Arrange
      const data = {
        type: "delete",
        value: {
          id: 1,
          name: "Áo blue trắng",
          description: "Áo blue trắng vải mềm",
          price: 60000,
          image:
            "http://localhost:8000/api/uploads\\1664855768645-quanjean.jpg",
          category: [1, 2],
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };
      const searchSpy = jest.spyOn(component, "handle");
      const expected = "delete";
      //Act
      component.handle(data);
      fixture.detectChanges();
      // Assert
      expect(data.type).toEqual(expected);
      expect(searchSpy).toHaveBeenCalledWith(data);
    });
    it("[6.3.1] delete when dialog is displayed", () => {
      //Arrange
      const data = {
        type: "delete",
        value: {
          id: 1,
          name: "Quần jean",
          description: "Quần jean vải kaki",
          price: 68000,
          image:
            "http://localhost:8000/api/uploads\\1664855768645-quanjean.jpg",
          category: [1, 2],
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };
      const dialogSpy = jest.spyOn(component.getDialog(), "open");
      //Act
      component.handle(data);
      fixture.detectChanges();
      // Assert
      expect(dialogSpy).toHaveBeenCalledTimes(1);
      expect(dialogSpy).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: data.value,
      });
    });
    it("[6.3.2] edit when navigate is displayed", () => {
      //Arrange
      const data = {
        type: "edit",
        value: {
          id: 1,
          name: "Quần jean",
          description: "Quần jean vải kaki",
          price: 68000,
          image:
            "http://localhost:8000/api/uploads\\1664855768645-quanjean.jpg",
          category: [1, 2],
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };
      const router = jest.spyOn(component.getRouter(), "navigate");
      const finalPath = ["admin/products", data.value.id];
      //Act
      component.handle(data);
      fixture.detectChanges();
      // Assert
      expect(router).toHaveBeenCalledTimes(1);
      expect(router).toHaveBeenCalledWith(finalPath);
    });
  });

  describe("[7] Component destroy", () => {
    it("[7.1] should unsubscribe paginator", () => {
      // Arrange
      const pagiSubscription = jest.spyOn(component.pagi, "unsubscribe");
      // Act
      component.ngOnDestroy();
      // Assert
      expect(pagiSubscription).toHaveBeenCalledTimes(1);
      expect(component.pagi.closed).toBe(true);
    });
    it("[7.2] should dispatch clearStateMessage action", () => {
      // Arrange
      const actionSpy = jest.spyOn(component.getStore(), "dispatch");
      const action = clearStateMessage();
      // Act
      component.ngOnDestroy();
      fixture.detectChanges();
      // Assert
      expect(actionSpy).toHaveBeenCalledWith(action);
      expect(actionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("[8] Sort", () => {
    it("[8.1] should handle when clear sort", () => {
      //Arrange
      const e: ISort = {
        col: "name",
        criteria: "clear",
      };
      const expected: ISort = {
        col: "",
        criteria: "",
      };
      //Act
      component.handleSort(e);
      //Assert
      expect(component.sort).toEqual(expected);
    });
    it("[8.2] should handle when sort list", () => {
      //Arrange
      const e: ISort = {
        col: "name",
        criteria: "asc",
      };
      //Act
      component.handleSort(e);
      //Assert
      expect(component.sort).toEqual(e);
    });

    it("[8.3] should handle clientSort when direction empty", () => {
      //Arrange
      const e: { active: string; direction: string } = {
        active: "name",
        direction: "",
      };
      const expected: ISort = {
        col: "",
        criteria: "",
      };
      //Act
      component.sortClient(e);
      //Assert
      expect(component.sort).toEqual(expected);
    });
    it("[8.4] should handle clientSort", () => {
      //Arrange
      const e: { active: string; direction: string } = {
        active: "name",
        direction: "asc",
      };
      //Act
      component.sortClient(e);
      //Assert
      expect(component.sort).toEqual({ col: e.active, criteria: e.direction });
    });
  });
});
