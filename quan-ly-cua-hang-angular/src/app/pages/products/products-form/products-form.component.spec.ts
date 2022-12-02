import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  oneProducts,
  selectMessageProduct,
} from "../../../store/products/products.selector";
import { TableModule } from "../../../components/common/table/table.module";
import { MaterialModule } from "../../../material/material.module";
import { ProductsService } from "../products.service";

import { ProductsFormComponent } from "./products-form.component";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import {
  createProduct,
  updateProduct,
} from "../../../store/products/products.action";
import { selectListCategories } from "../../../store/categories/categories.selector";
import { RouterTestingModule } from "@angular/router/testing";
import { ResponseAPI } from "../products.component.i";
import { ProductsComponent } from "../products.component";

describe("ProductsFormComponent", () => {
  // let file: FileReader;
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: ProductsService;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMessageSelector: any;
  let store: MockStore<ResponseAPI>;
  const mockFile = new File([""], "filename", { type: "image/html" });
  class FileReaderMock {
    DONE = FileReader.DONE;
    EMPTY = FileReader.EMPTY;
    LOADING = FileReader.LOADING;
    readyState = 0;
    error: FileReader["error"] = null;
    result: FileReader["result"] = "example";
    abort = jest.fn();
    addEventListener = jest.fn();
    dispatchEvent = jest.fn();
    onabort = jest.fn();
    onerror = jest.fn();
    onload = jest.fn();
    onloadend = jest.fn();
    onloadprogress = jest.fn();
    onloadstart = jest.fn();
    onprogress = jest.fn();
    readAsArrayBuffer = jest.fn();
    readAsBinaryString = jest.fn();
    readAsDataURL = jest.fn();
    readAsText = jest.fn();
    removeEventListener = jest.fn();
  }

  beforeEach(async () => {
    console.warn = jest.fn();
    await TestBed.configureTestingModule({
      declarations: [ProductsFormComponent],
      imports: [
        StoreModule.forRoot({}),
        MaterialModule,
        ReactiveFormsModule,
        TableModule,
        NoopAnimationsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: "admin/products", component: ProductsComponent },
        ]),
      ],
      providers: [
        // {
        //   provide: FileReader,
        //   useValue: mFileReader,
        // },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                productID: "1",
              }),
            },
          },
        },
        provideMockStore({
          selectors: [
            {
              selector: oneProducts,
              value: {
                status: "success",
                message: "Get category successfully",
                data: {
                  id: 1,
                  name: "product",
                  description: "Product description",
                  price: 15000,
                  image: "",
                  category: [
                    {
                      id: 1,
                      name: "Áo",
                      created_at: "18/10/2022 14:36:00",
                      updated_at: "18/10/2022 14:36:00",
                    },
                    {
                      id: 2,
                      name: "Áo 2",
                      created_at: "18/10/2022 14:36:00",
                      updated_at: "18/10/2022 14:36:00",
                    },
                  ],
                  created_at: "",
                  updated_at: "",
                },
              },
            },
            {
              selector: selectListCategories,
              value: {
                status: "success",
                message: "Get list categories successfully",
                data: [
                  {
                    id: 1,
                    name: "Áo",
                    created_at: "18/10/2022 14:36:00",
                    updated_at: "18/10/2022 14:36:00",
                  },
                  {
                    id: 2,
                    name: "Áo 2",
                    created_at: "18/10/2022 14:36:00",
                    updated_at: "18/10/2022 14:36:00",
                  },
                  {
                    id: 3,
                    name: "Áo 3",
                    created_at: "18/10/2022 14:36:00",
                    updated_at: "18/10/2022 14:36:00",
                  },
                ],
              },
            },
          ],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
    // file = TestBed.inject(FileReader);
    mockMessageSelector = store.overrideSelector(selectMessageProduct, {
      status: "",
      statusCode: 0,
      message: "",
      error: "",
      data: {
        id: 0,
        name: "",
        description: "",
        price: 0,
        image: "",
        category: [
          {
            id: 0,
            name: "",
            created_at: "",
            updated_at: "",
          },
        ],
        created_at: "",
        updated_at: "",
      },
    });
  });

  afterEach(() => {
    store?.resetSelectors();
    fixture.destroy();
  });

  describe("[1] Initial component", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    describe("1.1 should subscribe messageAPI data", () => {
      it("---> if response has 'status' is success: should open snack bar and navigate back", () => {
        // Arrange
        const targetResponse = {
          status: "success",
          message: "Get product successfully",
          data: {
            id: 3,
            name: "Product 3",
            description: "Product 3 description",
            price: "10000",
            image: "/uploads/3.jpg",
            category: [
              { id: 3, name: "cate 3" },
              { id: 2, name: "cate 2" },
            ],
            created_at: "2022-11-07T08:54:04.549Z",
            updated_at: "2022-11-07T08:54:04.549Z",
          },
        };
        mockMessageSelector.setResult(targetResponse);
        store.refreshState();
        const snakcbar = jest.spyOn(component.snackBar, "open");
        const navigate = jest.spyOn(component.router, "navigate");
        //Act
        component.ngOnInit();
        fixture.detectChanges();
        //Assert
        expect(snakcbar).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalled();
      });
      it("---> if response has 'error' and 'statusCode': should open snack bar", () => {
        // Arrange
        const targetResponse = {
          statusCode: 409,
          message: "Name product already exists",
          error: "Conflict",
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
    });
  });

  describe("[2] Create product", () => {
    it("[2.1] should remove product", () => {
      //Arrange
      component.allCates = [
        {
          id: 5,
          name: "string",
          created_at: "string",
          updated_at: "string",
        },
        {
          id: 7,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
      ];
      component.cates = [
        {
          id: 1,
          name: "string",
          created_at: "string",
          updated_at: "string",
        },
        {
          id: 2,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
      ];
      //Act
      component.remove({
        id: 1,
        name: "string",
        created_at: "string",
        updated_at: "string",
      });
      fixture.detectChanges();
      component.categoryControl.patchValue("s");
      fixture.detectChanges();

      expect(component.cates).toEqual([
        {
          id: 2,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
      ]);
      expect(component.allCates).toEqual([
        {
          id: 5,
          name: "string",
          created_at: "string",
          updated_at: "string",
        },
        {
          id: 7,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
        {
          id: 1,
          name: "string",
          created_at: "string",
          updated_at: "string",
        },
      ]);
    });
    it("exclude", () => {
      component.allCates = [
        {
          id: 5,
          name: "string",
          created_at: "string",
          updated_at: "string",
        },
        {
          id: 7,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
      ];
      component.exclude({
        id: 5,
        name: "string",
        created_at: "string",
        updated_at: "string",
      });
      expect(component.allCates).toEqual([
        {
          id: 7,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
      ]);
    });
    it("should filter when _filter function is call", () => {
      // arrange
      component.allCates = [
        {
          id: 5,
          name: "anhtu",
          created_at: "string",
          updated_at: "string",
        },
        {
          id: 7,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
      ];
      const expected = [
        {
          id: 5,
          name: "anhtu",
          created_at: "string",
          updated_at: "string",
        },
      ];

      // component._filter("baV");
      expect(component._filter("anhtu")).toEqual(expected);
    });
    it("selected", () => {
      component.cates = [
        {
          id: 1,
          name: "string",
          created_at: "string",
          updated_at: "string",
        },
        {
          id: 2,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
      ];
      const event: MatAutocompleteSelectedEvent = {
        option: {
          value: {
            id: 3,
            name: "string",
            created_at: "string",
            updated_at: "string",
          },
        },
      } as MatAutocompleteSelectedEvent;
      component.selected(event);
      expect(component.cates).toEqual([
        {
          id: 1,
          name: "string",
          created_at: "string",
          updated_at: "string",
        },
        {
          id: 2,
          name: "string2",
          created_at: "string2",
          updated_at: "string2",
        },
        {
          id: 3,
          name: "string",
          created_at: "string",
          updated_at: "string",
        },
      ]);
      expect(component.categoryControl.value).toBeNull();

      expect(component.cateInput.nativeElement.value).toBe("");
    });

    it("Create product", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");

      component.myForm.patchValue({
        name: "a",
        fileSource: "sad",
        description: "sad",
        price: 54,
        category: [1, 2],
      });
      const formData = new FormData();
      formData.append("name", component.myForm.get("name")?.value);
      formData.append("photo", component.myForm.get("fileSource")?.value);
      formData.append(
        "description",
        component.myForm.get("description")?.value,
      );
      formData.append("price", component.myForm.get("price")?.value);
      formData.append("category", component.cates.map((c) => c.id).toString());
      console.log(component.myForm.value);
      component.buttonTitle = "Create";
      component.submit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        createProduct({ data: formData }),
      );
    });

    it("Update product", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");
      //Arrange
      component.myForm.patchValue({
        name: "a",
        fileSource: "sad",
        description: "sad",
        price: 54,
        category: [1, 2],
      });
      const formData = new FormData();
      formData.append("name", component.myForm.get("name")?.value);
      formData.append("photo", component.myForm.get("fileSource")?.value);
      formData.append(
        "description",
        component.myForm.get("description")?.value,
      );
      formData.append("price", component.myForm.get("price")?.value);
      formData.append("category", component.cates.map((c) => c.id).toString());
      console.log(component.myForm.value);
      component.buttonTitle = "Update";
      component.submit();
      //Act
      expect(dispatchSpy).toHaveBeenCalledWith(
        updateProduct({ id: 1, data: formData }),
      );
      //Assert
    });

    it("List category", () => {
      //Arrange
      const dataTest = [
        {
          id: 3,
          name: "Áo 3",
          created_at: "18/10/2022 14:36:00",
          updated_at: "18/10/2022 14:36:00",
        },
      ];
      const categoryControl = jest.spyOn(
        component.categoryControl.valueChanges,
        "pipe",
      );
      //Action
      component.ngOnInit();
      fixture.detectChanges();
      component.categoryControl.patchValue("a");
      fixture.detectChanges();
      //Assert
      expect(component.allCates).toEqual(dataTest);
      expect(categoryControl).toHaveBeenCalled();
      // console.log(component.allCates);
    });

    it("onFileSelected", () => {
      // Arrange
      const fileReader = new FileReaderMock();
      jest.spyOn(global, "FileReader").mockImplementation(() => fileReader);
      const read = jest.spyOn(component, "readSuccess");

      const mockEvt = { target: { files: [mockFile] } };

      // Act
      component.onFileSelected(mockEvt as never);
      fixture.detectChanges();
      component.readSuccess();
      component.imageProduct = "";

      // Assert
      const file = component.myForm.get("fileSource")?.value;
      expect(file).toEqual(mockEvt.target.files[0]);
      expect(read).toHaveBeenCalled();
      // console.log(component.reader.result);
    });
  });
});
