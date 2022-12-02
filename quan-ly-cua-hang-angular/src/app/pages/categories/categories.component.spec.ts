import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CategoriesComponent } from "./categories.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { StateObservable } from "@ngrx/store";
import { MaterialModule } from "../../material/material.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import {
  selectArrayCategories,
  selectMessageCategory,
  selectPaginatorCategories,
} from "../../store/categories/categories.selector";
import {
  clearListCategories,
  clearStateMessage,
  getListCategories,
} from "../../store/categories/categories.action";
import { CategoriesFormComponent } from "./categories-form/categories-form.component";
import { TableModule } from "../../components/common/table/table.module";
import { CategoriesDialogComponent } from "./categories-dialog/categories-dialog.component";
describe("CategoriesComponent", () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  beforeEach(async () => {
    console.warn = jest.fn();
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: "admin/categories/:categoryID",
            component: CategoriesFormComponent,
          },
        ]),
        HttpClientTestingModule,
        MaterialModule,
        NoopAnimationsModule,
        TableModule,
      ],
      declarations: [CategoriesComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectPaginatorCategories,
              value: {
                limit: 5,
                currentPage: 1,
                search: "",
              },
            },
            {
              selector: selectMessageCategory,
              value: {
                status: "success",
                statusCode: 200,
                message: "",
                error: "",
                data: [],
              },
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Should create", () => {
    expect(component).toBeTruthy();
  });

  //demo
  describe("Group 1. Data table structure", () => {
    it("Test 1.1 Should have list actions", () => {
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

    it("Test 1.2 Should have list columns will be display", () => {
      // Arrange
      component.displayedColumns = [];
      const expected = [
        { type: "text", name: "id" },
        { type: "text", name: "name" },
      ];
      // Act
      component.displayedColumns = expected;
      // Assert
      expect(component.displayedColumns).toEqual(expected);
    });

    it("Test 1.3 Should have selector paginator data from state", () => {
      // Arrange
      component.paginator;
      const selectSpy = jest.spyOn(component.store, "select");
      // Act
      component.paginator = component.store.select(
        selectPaginatorCategories,
      ) as StateObservable;
      // Assert
      expect(selectSpy).toHaveBeenCalledWith(selectPaginatorCategories);
    });

    it("Test 1.4 Should have selector dataSource from state", () => {
      // Arrange
      const selectSpy = jest.spyOn(component.store, "select");
      // Act
      component.dataSource = component.store.select(
        selectArrayCategories,
      ) as StateObservable;
      // Assert
      expect(selectSpy).toHaveBeenCalledWith(selectArrayCategories);
    });

    it("Test 1.5 Should have selector messageAPI data from state", () => {
      // Arrange
      const selectSpy = jest.spyOn(component.store, "select");
      // Act
      component.messageAPI = component.store.select(
        selectMessageCategory,
      ) as StateObservable;
      // Assert
      expect(selectSpy).toHaveBeenCalledWith(selectMessageCategory);
    });
  });

  describe("Group 2. on Component Init", () => {
    it("Test 2.1 Should call method renderData", () => {
      // Arrange
      const pageIndex = component.pageIndex;
      const pageSize = component.pageSize;
      const renderData = jest.spyOn(component, "renderData");

      const expected = {
        pageIndex: pageIndex ? pageIndex : 1,
        pageSize: pageSize ? pageSize : 5,
        search: "",
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
      );
    });
    it("Test 2.2 Should subscribe paginator data & set pageSize, pageIndex value from state", () => {
      // Arrange
      const subscribe = jest.spyOn(component.paginator, "subscribe");
      // Act
      component.ngOnInit();
      fixture.detectChanges();
      // Assert
      expect(subscribe).toHaveBeenCalled();
      expect(component.pageIndex).toEqual(1);
      expect(component.pageSize).toEqual(5);
      expect(component.searchInput).toEqual("");
    });
    it("Test 2.3 Should subscribe messageAPI data", () => {
      const snack = jest.spyOn(component.messageAPI, "subscribe");
      //Act
      component.ngOnInit();
      fixture.detectChanges();
      //Assert
      expect(snack).toHaveBeenCalled();
    });
    it("---> If response has 'error' or has 'status' success: Should call method open of snackBar ", () => {
      const snakcbar = jest.spyOn(component.snackBar, "open");
      let err;
      let status = "";
      //Act
      component.ngOnInit();
      component.messageAPI.subscribe((res) => {
        err = res.error ? res.error : undefined;
        status = res.status;
      });
      fixture.detectChanges();
      //Assert
      expect(err).toBeTruthy;
      expect(status).toEqual("success");
      expect(snakcbar).toHaveBeenCalled();
    });
    it("---> If response has statusCode 404: Should call method renderData ", () => {
      let statusCode = 0;
      const renderData = jest.spyOn(component, "renderData");
      const action = {
        page: component.pageIndex,
        limit: component.pageSize,
        search: "",
      };
      //Act
      component.ngOnInit();
      fixture.detectChanges();
      //Fake respone 404
      component.messageAPI.subscribe(() => {
        statusCode = 404;
      });
      //Assert
      expect(statusCode).toBe(404);
      expect(renderData).toHaveBeenCalledWith(
        action.page,
        action.limit,
        action.search,
      );
    });
  });

  describe("Group 3. render Data", () => {
    it("Test 3.1 Should be call with 3 parameters: page, limit, search", () => {
      // Arrange
      const page = 1;
      const limit = 5;
      const search = "";
      const fnCall = jest.spyOn(component, "renderData");
      // Act
      component.renderData(page, limit, search);
      fixture.detectChanges();
      // Assert
      expect(fnCall).toHaveBeenCalledWith(page, limit, search);
    });
    it("Test 3.2 Should dispatch getListCategories action", () => {
      // Arrange
      const page = 1;
      const limit = 5;
      const search = "";
      const storeSpy = jest.spyOn(component.store, "dispatch");
      const action = getListCategories({
        page: page,
        limit: limit,
        search: search,
      });
      // Act
      component.renderData(page, limit, search);
      fixture.detectChanges();
      // Assert
      expect(storeSpy).toHaveBeenCalledWith(action);
    });
  });

  describe("Group 4. handle Paginator", () => {
    it("Test 4.1 Should be call with parameter is object", () => {
      // Arrange
      const valueTest = {
        pageIndex: 1,
        pageSize: 5,
      };
      const handlePaginatorSpy = jest.spyOn(component, "handlePaginator");
      // Act
      component.handlePaginator(valueTest);
      fixture.detectChanges();
      // Assert
      expect(handlePaginatorSpy).toHaveBeenCalledWith(valueTest);
    });
    it("Test 4.2 Should change value variables pageIndex and pageSize of component", () => {
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
    it("Test 4.3 Should call fn renderData", () => {
      // Arrange
      const valueTest = {
        pageIndex: 1,
        pageSize: 5,
      };
      const searchInput = component.searchInput;
      const sort = component.currentsort;
      const renderDataSpy = jest.spyOn(component, "renderData");
      // Act
      component.handlePaginator(valueTest);
      fixture.detectChanges();
      // Assert
      expect(renderDataSpy).toHaveBeenCalledWith(
        valueTest.pageIndex,
        valueTest.pageSize,
        searchInput,
      );
    });
    it("Test 4.4 Should call fn renderData with 4 params when sorting", () => {
      // Arrange
      const valueTest = {
        pageIndex: 1,
        pageSize: 5,
      };
      const sort = {
        col: "name",
        criteria: "asc",
      };
      const searchInput = component.searchInput;
      component.currentsort = sort;
      const renderDataSpy = jest.spyOn(component, "renderData");
      // Act
      component.handlePaginator(valueTest);
      fixture.detectChanges();
      // Assert
      expect(renderDataSpy).toHaveBeenCalledWith(
        valueTest.pageIndex,
        valueTest.pageSize,
        searchInput,
        sort,
      );
    });
  });

  describe("Group 5. search", () => {
    it("Test 5.1 Should be call with parameter is object", () => {
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
    describe("Test 5.2 Should be call and check parameter key 'type' is 'Search'", () => {
      const valueTest = {
        type: "Search",
        value: { searchString: "searchText", searchOption: [] },
      };

      it("---> Should check value of parameter key 'searchString' is truthy and not null and not equal searchInput of component", () => {
        // Arranger
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
      it("-----> if return true: Should change value variable searchInput of component", () => {
        // Arranger
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
      it("-----> if return true: Should call method renderData", () => {
        // Arranger
        const TestData = valueTest;
        const searchInput = component.searchInput; //now is undefined
        const sort = component.currentsort;
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
          sort,
        );
      });
    });
    describe("Test 5.3 Should be call and check parameter key 'type' is 'clearSearch'", () => {
      const valueTest = {
        type: "clearSearch",
        value: { searchString: "searchText", searchOption: [] },
      };
      it("---> Should check value of parameter key 'searchString' is not null", () => {
        // Arranger
        const dataTest = valueTest;
        //Act
        component.search(dataTest);
        fixture.detectChanges();
        // Assert
        expect(dataTest.value.searchString).not.toEqual("");
      });
      it("------> If return true:  Should set empty value variable 'searchInput' of component", () => {
        // Arranger
        const dataTest = valueTest;
        expect(dataTest.value.searchString).toBeTruthy;
        expect(dataTest.value.searchString).not.toEqual("");
        //Act
        component.search(dataTest);
        fixture.detectChanges();
        // Assert
        expect(component.searchInput).toEqual("");
      });
      it("------> If return true: Should call fn renderData", () => {
        // Arranger
        const dataTest = valueTest;
        const sort = component.currentsort;
        expect(dataTest.value.searchString).toBeTruthy;
        expect(dataTest.value.searchString).not.toEqual("");
        const renderDataSpy = jest.spyOn(component, "renderData");
        //Act
        component.search(dataTest);
        fixture.detectChanges();
        // Assert
        expect(renderDataSpy).toHaveBeenCalledWith(
          1,
          component.pageSize,
          "",
          sort,
        );
      });
    });
  });

  describe("Group 6. handle action", () => {
    //parameter object
    const valueTest = {
      type: "",
      value: Object,
    };
    it("Test 6.1 Should be call with parameter is object", () => {
      // Arranger
      const dataTest = {
        type: valueTest.type,
        value: {
          id: 1,
          name: "Category",
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };
      const searchSpy = jest.spyOn(component, "handle");
      //Act
      component.handle(dataTest);
      fixture.detectChanges();
      // Assert
      expect(searchSpy).toHaveBeenCalledWith(dataTest);
    });
    it("Test 6.2 Should be call and check parameter key 'type' value", () => {
      // Arranger
      const dataTest = {
        type: "delete",
        value: {
          id: 1,
          name: "Category",
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };
      const searchSpy = jest.spyOn(component, "handle");
      const expected = "delete" || "edit";
      //Act
      component.handle(dataTest);
      fixture.detectChanges();
      // Assert
      expect(dataTest.type).toEqual(expected);
      expect(searchSpy).toHaveBeenCalledWith(dataTest);
    });
    it("---> if return 'delete': Should call open method of dialog", () => {
      // Arranger
      const dataTest = {
        type: "delete",
        value: {
          id: 1,
          name: "Category",
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };
      const dialogSpy = jest.spyOn(component.dialog, "open");
      //Act
      component.handle(dataTest);
      fixture.detectChanges();
      // Assert
      expect(dialogSpy).toHaveBeenCalledTimes(1);
      expect(dialogSpy).toHaveBeenCalledWith(CategoriesDialogComponent, {
        data: dataTest.value,
      });
    });
    it("---> if return 'edit': Should call navigate method of router with parameters, parameter is a routing path", () => {
      // Arranger
      const dataTest = {
        type: "edit",
        value: {
          id: 1,
          name: "Category",
          created_at: "2022-09-29T02:53:44.114Z",
          updated_at: "2022-09-29T02:53:44.114Z",
        },
      };
      const routerSpy = jest.spyOn(component.router, "navigate");
      const finalPath = ["admin/categories", dataTest.value.id];
      //Act
      component.handle(dataTest);
      fixture.detectChanges();
      // Assert
      expect(routerSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledWith(finalPath);
    });
  });

  describe("Group 7. on Component destroy", () => {
    it("Test 7.1 Should unsubscribe paginator", () => {
      // Arrange
      const pagiSubscription = jest.spyOn(component.pagi, "unsubscribe");
      // Act
      component.ngOnDestroy();
      // Assert
      expect(pagiSubscription).toHaveBeenCalledTimes(1);
      expect(component.pagi.closed).toBe(true);
    });
    it("Test 7.2 Should unsubscribe messageAPI", () => {
      // Arrange
      const messSubscription = jest.spyOn(component.mess, "unsubscribe");
      // Act
      component.ngOnDestroy();
      // Assert
      expect(messSubscription).toHaveBeenCalledTimes(1);
      expect(component.mess.closed).toBe(true);
    });
    it("Test 7.3 Should dispatch clearStateMessage action", () => {
      // Arrange
      const actionSpy = jest.spyOn(component.store, "dispatch");
      const action = clearStateMessage();
      // Act
      component.ngOnDestroy();
      fixture.detectChanges();
      // Assert
      expect(actionSpy).toHaveBeenCalledWith(action);
    });
    it("Test 7.4 Should dispatch clearListCategories action", () => {
      // Arrange
      const actionSpy = jest.spyOn(component.store, "dispatch");
      const actionParam = clearListCategories();
      // Act
      component.ngOnDestroy();
      fixture.detectChanges();
      // Assert
      expect(actionSpy).toHaveBeenCalledWith(actionParam);
    });
  });

  describe("Group 8. sort", () => {
    it("Test 8.1 Should be call with parameter is object", () => {
      // Arrange
      const valueTest = {
        col: "name",
        criteria: "asc",
      };
      const sort = jest.spyOn(component, "sort");
      //Act
      component.sort(valueTest);
      fixture.detectChanges();
      // Assert
      expect(sort).toHaveBeenCalledWith(valueTest);
    });
    it("Test 8.2 Should call renderData no sorting when param 'criteria' is 'clear'", () => {
      // Arrange
      const valueTest = {
        col: "name",
        criteria: "clear",
      };
      const pageSize = component.pageSize;
      const search = component.searchInput;

      const sort = jest.spyOn(component, "sort");
      const renderData = jest.spyOn(component, "renderData");
      //Act
      component.sort(valueTest);
      fixture.detectChanges();
      // Assert
      expect(sort).toHaveBeenCalledWith(valueTest);
      expect(renderData).toHaveBeenCalledWith(1, pageSize, search);
      expect(component.currentsort).toBeUndefined();
    });
    it("Test 8.3 Should call renderData and sorting when all param is truthy", () => {
      // Arrange
      const valueTest = {
        col: "name",
        criteria: "asc",
      };
      const pageSize = component.pageSize;
      const search = component.searchInput;

      const sort = jest.spyOn(component, "sort");
      const renderData = jest.spyOn(component, "renderData");
      //Act
      component.sort(valueTest);
      fixture.detectChanges();
      // Assert
      expect(sort).toHaveBeenCalledWith(valueTest);
      expect(renderData).toHaveBeenCalledWith(1, pageSize, search, valueTest);
      expect(component.currentsort).toBe(valueTest);
    });
  });
});
