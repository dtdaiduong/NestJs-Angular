import { CommonModule } from "@angular/common";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { NO_ERRORS_SCHEMA } from "@angular/compiler";
import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatChip, MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { By } from "@angular/platform-browser";
// import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InputComponent } from "../input/input.component";
import { InputModule } from "../input/input.module";

import { TableComponent } from "./table.component";

describe("TableComponent", () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  const type = "search";
  const input: InputComponent = new InputComponent();
  input.value = "arigato";
  const pageEvent: PageEvent = new PageEvent();
  const event: MatAutocompleteSelectedEvent = {
    option: {
      viewValue: "",
    },
  } as MatAutocompleteSelectedEvent;
  pageEvent.pageIndex = 1;
  pageEvent.pageSize = 5;
  pageEvent.length;

  // const htmlI = new HTMLInputElement();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent, InputComponent, MatInput, MatChip],
      // imports: [MaterialModule],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatChipsModule,
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        InputModule,
        MatButtonModule,
        MatPaginatorModule,
        MatInputModule,
      ],
      providers: [HttpClient, HttpHandler, MatChip],
    }).compileComponents();
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;

    jest.spyOn(component.search, "emit");
    jest.spyOn(component.action, "emit");
    jest.spyOn(component.paginator, "emit");
    jest.spyOn(component.sort, "emit");
    // component.optionInput = new ElementRef(new HTMLInputElement());
    component.option = ["Tada", "soda", "sida"];
    component.optionCtrl = new FormControl("");
    component.allOption = ["Bav", "bavbb", "Aa"];

    // component.displayedColumns = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("Search", () => {
    it("should emit search event when Search function is call", () => {
      // arrange
      const expected = {
        type: type,
        value: {
          searchString: input.value,
          searchOption: component.option,
        },
      };
      component.Search(type, input);
      expect(component.search.emit).toHaveBeenCalledWith(expected);
    });
  });
  describe("handle", () => {
    it("should emit action event when handle function is call", () => {
      component.handleActions({ type: "search", value: "" });
      expect(component.action.emit).toHaveBeenCalledWith({
        type: "search",
        value: "",
      });
    });
  });
  describe("_filter", () => {
    it("should filter when _filter function is call", () => {
      // arrange
      const expected = ["Bav", "bavbb"];

      component._filter("baV");
      expect(component._filter("baV")).toEqual(expected);
    });
  });

  describe("handlepaginator", () => {
    it("should emit panigator event when handlepaginator function is call", () => {
      component.handlepaginator(pageEvent);
      expect(component.paginator.emit).toHaveBeenCalledWith({
        pageIndex: pageEvent.pageIndex + 1,
        pageSize: pageEvent.pageSize,
      });
      expect(component.handlepaginator(pageEvent)).toEqual(pageEvent);
    });
  });
  describe("ClearSearch", () => {
    it("should emit search event when ClearSearch function is call", () => {
      // arrange
      const expected = {
        type: type,
        value: {
          searchString: input.value,
          searchOption: component.option,
        },
      };
      // act
      component.clearSearch(type, input);
      // assert
      expect(input.value).toBe("");
      expect(component.search.emit).toHaveBeenCalledWith(expected);

      // fixture.detectChanges(); // 2
      // const compiled = fixture.debugElement.nativeElement; // 2
    });
  });

  describe("remove", () => {
    it("should item is not exits", () => {
      // arrange
      const item = "sosdda";
      // act
      component.remove(item);

      // assert
      expect(component.option).toEqual(component.option);
    });
    it("should item is exits", () => {
      // arrange
      const expected = ["Tada", "sida"];
      const item = "soda";
      // act
      component.remove(item);
      // assert
      expect(component.option).toEqual(expected);
    });
  });
  describe("ngOnChanges", () => {
    it("should displayedColumns is not null", () => {
      // arrange
      const DisSimpleChange = new SimpleChange(
        undefined,
        [{ type: "text", name: "name" }],
        true,
      );
      // act
      component.ngOnChanges({
        displayedColumns: DisSimpleChange,
      });
      expect(component.dis).toEqual(["name"]);
    });
    it("should filtered Option when vaule option is chanege ", (done) => {
      component.subsearch = true;

      const DisSimpleChange = new SimpleChange(undefined, ["asdsa"], true);
      // act
      component.ngOnChanges({
        allOption: DisSimpleChange,
      });
      // component.ngOnChanges();
      // console.log(component.optionCtrl.value);
      fixture.detectChanges();
      component.optionCtrl.patchValue("aa");

      component.filteredOption.subscribe((data) => {
        console.log(data);
        expect(data).toEqual(component.allOption);
        done();
      });
    });
  });
  describe("selected", () => {
    it("should select option when select func is run", () => {
      component.subsearch = true;
      component.optionInput = fixture.debugElement.query(By.css("input"));
      component.selected(event);

      expect(component.option).toEqual([
        "Tada",
        "soda",
        "sida",
        event.option.viewValue,
      ]);
      expect(component.optionCtrl.value).toBeNull();
    });
  });
  describe("setpagi", () => {
    it("should set paginator when setpagi setter is run ", () => {
      component.setpagi = {
        currentPage: 5,
        limit: 4,
        totalPage: 1,
        totalCount: 2,
      };

      expect(component.pageEvent.length).toBe(2);
      expect(component.pageEvent.pageIndex).toBe(4);
      expect(component.pageEvent.pageSize).toBe(4);

      // expect(component.optionCtrl.value).toBeNull();
    });
  });

  describe("sort", () => {
    it("should emit sort event when Sort fn is call", () => {
      // arrange
      const expected = {
        col: "name",
        criteria: "asc",
      };
      component.col = expected.col;
      component.criteria = expected.criteria;
      // act
      component.Sort();
      // assert
      expect(input.value).toBe("");
      expect(component.sort.emit).toHaveBeenCalledWith(expected);
    });
  });
});
