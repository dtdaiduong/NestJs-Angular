import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  selectMessageCategory,
  selectOneCategory,
} from "../../../store/categories/categories.selector";
import { MaterialModule } from "../../../material/material.module";

import { CategoriesFormComponent } from "./categories-form.component";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import {
  clearOneCategory,
  clearStateMessage,
  createCategory,
  getOneCategory,
  updateCategory,
} from "../../../store/categories/categories.action";
import { CategoriesComponent } from "../categories.component";
import { ResponseAPI } from "../categories.component.i";
// import { initMessage } from "../../../store/categories/categories.reducer";
import { InputModule } from "../../../components/common/input/input.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("CategoriesFormComponent", () => {
  let component: CategoriesFormComponent;
  let fixture: ComponentFixture<CategoriesFormComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMessageSelector: any;
  let store: MockStore<ResponseAPI>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CategoriesFormComponent],
      imports: [
        InputModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: "admin/categories", component: CategoriesComponent },
        ]),
        MaterialModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                categoryID: "1",
              }),
            },
          },
        },
        provideMockStore({
          selectors: [
            {
              selector: selectOneCategory,
              value: {
                status: "success",
                message: "get one success",
                data: {
                  id: 1,
                  name: "cate",
                  created_at: "",
                  updated_at: "",
                },
              },
            },
          ],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
    //defalut value for selector
    mockMessageSelector = store.overrideSelector(selectMessageCategory, {
      status: "",
      statusCode: 0,
      message: "",
      error: "",
      data: {
        id: 0,
        name: "",
        created_at: "",
        updated_at: "",
      },
    });
  });
  afterEach(() => {
    store?.resetSelectors();
    fixture.destroy();
  });

  describe("CategoriesFormComponent", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should have selector messageAPI data from state", () => {
      // Arrange
      const selectSpy = jest.spyOn(component.store, "select");
      // Act
      TestBed.createComponent(CategoriesFormComponent);
      fixture.detectChanges();
      // Assert
      expect(selectSpy).toHaveBeenCalled;
      expect(selectSpy).toHaveBeenCalledWith(selectMessageCategory);
    });
    it("should have selector oneCategory data from state", () => {
      // Arrange
      const selectSpy = jest.spyOn(component.store, "select");
      // Act
      TestBed.createComponent(CategoriesFormComponent);
      fixture.detectChanges();
      // Assert
      expect(selectSpy).toHaveBeenCalled;
      expect(selectSpy).toHaveBeenCalledWith(selectOneCategory);
    });

    describe("Group 1. onInit", () => {
      it("Test 1.1 should subscribe one category data", () => {
        const cate = jest.spyOn(component.cate$, "subscribe");
        //Act
        component.ngOnInit();
        fixture.detectChanges();
        //Assert
        expect(cate).toHaveBeenCalled();
      });
      it("---> if response one category is truthy: should set value nameFormControl", () => {
        const formControl = jest.spyOn(component.nameFormControl, "setValue");
        const expected = {
          status: "success",
          message: "get one success",
          data: {
            id: 1,
            name: "cate",
            created_at: "",
            updated_at: "",
          },
        };

        //Act
        component.ngOnInit();
        fixture.detectChanges();

        //Assert
        expect(formControl).toHaveBeenCalled();
        expect(component.nameFormControl.value).toEqual(expected.data.name);
      });
      it("Test 1.2 should subscribe messageAPI data", () => {
        const mess = jest.spyOn(component.messageAPI$, "subscribe");
        //Act
        component.ngOnInit();
        fixture.detectChanges();
        //Assert
        expect(mess).toHaveBeenCalled();
      });
      // If response has 'status' success and 'data' is truthy
      it("---> if response has 'error' and 'statusCode': should open snack bar", () => {
        // Arrange
        const targetResponse = {
          error: "Conflict",
          statusCode: 409,
          message: "Name category already exists",
        };
        mockMessageSelector.setResult(targetResponse);
        store.refreshState();
        const snakcbar = jest.spyOn(component.snackBar, "open");

        //Act
        component.ngOnInit();
        fixture.detectChanges();
        //Assert
        expect(snakcbar).toHaveBeenCalled();
      });

      it("---> if respone has data and status is 'success': should call method viewBack", () => {
        // Arrange
        const targetResponse = {
          status: "success",
          message: "Get category successfully",
          data: {
            id: 1,
            name: "cate",
            created_at: "2022-10-11T03:24:29.161Z",
            updated_at: "2022-10-11T03:24:29.161Z",
          },
        };
        mockMessageSelector.setResult(targetResponse);
        store.refreshState();

        const viewBack = jest.spyOn(component, "viewBack");
        //Act
        component.ngOnInit();
        fixture.detectChanges();
        //Assert
        expect(viewBack).toHaveBeenCalled();
      });
      it("---> if respone has statusCode is 404: should call method navigate back", () => {
        // Arrange
        const targetResponse = {
          status: "error",
          statusCode: 404,
          message: "not found",
          error: "Not Found",
        };
        mockMessageSelector.setResult(targetResponse);
        store.refreshState();

        const navigate = jest.spyOn(component.router, "navigate");
        //Act
        component.ngOnInit();
        fixture.detectChanges();
        //Assert
        expect(navigate).toHaveBeenCalled();
      });
      it("Test 1.3 should get value from route Params", () => {
        // A
        const expected = 1;
        const spy = jest.spyOn(component.route.snapshot.paramMap, "get");
        // Act
        component.ngOnInit();
        // A
        expect(spy).toHaveBeenCalledWith("categoryID");
        expect(component.id).toBe(expected);
      });
      //if value is truthy
      it("---> if value is truthy: should set value for component's property", () => {
        // Arrange
        const defaultTestValue = {
          id: 1,
          ButtonTitle: "Update",
          FormTitle: "Update Category",
          DataTitle: "Update Category Success",
        };
        // Act
        component.ngOnInit();
        // Assert
        expect(component.id).toBeTruthy();
        expect(component.id).toBe(defaultTestValue.id);
        expect(component.ButtonTitle).toEqual(defaultTestValue.ButtonTitle);
        expect(component.FormTitle).toEqual(defaultTestValue.FormTitle);
        expect(component.DataTitle).toEqual(defaultTestValue.DataTitle);
      });

      it("---> if value is truthy: should dispatch getOneCategory action with param", () => {
        // Arrange
        const action = getOneCategory({ id: 1 });
        const dispatch = jest.spyOn(component.store, "dispatch");
        // Act
        component.ngOnInit();
        // Assert
        expect(dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe("Group 2. submit", () => {
      it("Test 2.1 should be call with parameter", () => {
        // Arrange
        const submit = jest.spyOn(component, "submit");
        const parameter = "";

        // Act
        component.submit(parameter);

        // Assert
        expect(submit).toHaveBeenCalledTimes(1);
        expect(submit).toHaveBeenCalledWith(parameter);
      });
      it("---> if property ButtonTitle has value 'Create': should dispatch createCategory action", () => {
        // Arrange
        component.ButtonTitle = "Create";
        const submit = jest.spyOn(component, "submit");
        const dispatch = jest.spyOn(component.store, "dispatch");
        const parameter = "";
        const action = createCategory({ name: parameter });
        // Act
        component.submit(parameter);

        // Assert
        expect(submit).toHaveBeenCalledTimes(1);
        expect(submit).toHaveBeenCalledWith(parameter);
        expect(dispatch).toHaveBeenCalledWith(action);
      });
      it("---> if property ButtonTitle has value 'Update': should dispatch updateCategory action", () => {
        // Arrange
        component.ButtonTitle = "Update";
        const submit = jest.spyOn(component, "submit");
        const dispatch = jest.spyOn(component.store, "dispatch");
        const parameter = {
          id: 1,
          name: "newcate",
        };
        const action = updateCategory(parameter);

        // Act
        component.submit(parameter.name);

        // Assert
        expect(submit).toHaveBeenCalledTimes(1);
        expect(submit).toHaveBeenCalledWith(parameter.name);
        expect(dispatch).toHaveBeenCalledWith(action);
      });
    });

    describe("Group 3. clear", () => {
      it("Test 3.1 should change value variables", () => {
        // Arrange
        const expected = false;
        // Act
        component.clear();
        // Assert
        expect(component.taskDone).toBe(expected);
      });
    });

    describe("Group 4. back", () => {
      it("Test 4.1 should call method navigate back", () => {
        // Arrange
        const navigate = jest.spyOn(component.router, "navigate");
        const expected = ["admin/categories"];
        //Act
        component.back();
        //Assert
        expect(navigate).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(expected);
      });
    });

    describe("Group 5. OnDestroy", () => {
      it("Test 5.1 should dispatch clearStateMessage action", () => {
        // Arrange
        const dispatch = jest.spyOn(component.store, "dispatch");
        const action = clearStateMessage();
        // Act
        component.ngOnDestroy();
        // Assert
        expect(dispatch).toHaveBeenCalledWith(action);
      });

      it("Test 5.2 should dispatch clearOneCategory action", () => {
        // Arrange
        const dispatch = jest.spyOn(component.store, "dispatch");
        const action = clearOneCategory();
        // Act
        component.ngOnDestroy();
        // Assert
        expect(dispatch).toHaveBeenCalledWith(action);
      });

      it("Test 5.3 should unsubscribe category subscription", () => {
        // Arrange
        const dispatch = jest.spyOn(component.catesub, "unsubscribe");
        // Act
        component.ngOnDestroy();
        // Assert
        expect(dispatch).toHaveBeenCalledTimes(1);
      });
    });
  });
});
