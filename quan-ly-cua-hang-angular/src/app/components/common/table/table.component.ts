import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { InputComponent } from "../input/input.component";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { map, Observable, startWith } from "rxjs";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Sort } from "@angular/material/sort";
export interface roles {
  Created: string;
  id: number;
  name: string;
  Updated: string;
}
@Component({
  selector: "tsid-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.sass"],
})
export class TableComponent implements OnChanges {
  @Input() ListKeySort: { col: string; display: string }[] = [];
  col = "";
  criteria = "";
  @Output() sort = new EventEmitter<{
    col: string;
    criteria: string;
  }>();

  @Output() action = new EventEmitter<{ type: string; value: unknown }>();
  @Output() search = new EventEmitter<{
    type: string;
    value: {
      searchString: string;
      searchOption: string[];
    };
  }>();
  @Output() paginator = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();
  @Output() sortClient = new EventEmitter<{
    active: string;
    direction: string;
  }>();
  @Input() hide = false;
  @Input() displayedColumns: { type: string; name: string }[] = [];

  @Input("paginatorinput") set setpagi(paginatorinput: {
    currentPage: number;
    limit: number;
    totalPage: number;
    totalCount: number;
  }) {
    this.pageEvent.length = paginatorinput.totalCount;
    this.pageEvent.pageIndex = paginatorinput.currentPage - 1;
    this.pageEvent.pageSize = paginatorinput.limit;
  }
  @Input() subsearch = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  optionCtrl = new FormControl("");
  filteredOption!: Observable<string[]>;
  option: string[] = [];
  @Input() allOption: string[] = [];
  @ViewChild("optionIput") optionInput!: ElementRef<HTMLInputElement>;
  @Input() dataSource: unknown[] = [];
  @Input() actions!: { type: string; name: string }[];
  dis!: string[];
  handleActions(value: { type: string; value: unknown }) {
    this.action.emit(value);
  }
  handlepaginator(value: PageEvent) {
    this.paginator.emit({
      pageIndex: value.pageIndex + 1,
      pageSize: value.pageSize,
    });
    return value;
  }
  pageEvent: PageEvent = new PageEvent();

  Search(type: string, input: InputComponent) {
    this.search.emit({
      type: type,
      value: {
        searchString: input.value,
        searchOption: this.option,
      },
    });
  }

  Sort() {
    if (this.col && this.criteria) {
      const sort = { col: this.col, criteria: this.criteria };
      this.sort.emit(sort);
    }
  }
  onclearSort() {
    this.col = "";
    this.criteria = "";
    this.sort.emit({ col: "", criteria: "clear" });
  }
  clearSearch(type: string, input: InputComponent) {
    this.search.emit({
      type: type,
      value: { searchString: input.value, searchOption: this.option },
    });

    input.value = "";
    this.option = [];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ("displayedColumns" in changes) {
      this.dis = [
        ...changes["displayedColumns"].currentValue.map(
          (data: { type: string; name: string }) => data.name,
        ),
      ];
    }
    if ("allOption" in changes) {
      this.filteredOption = this.optionCtrl.valueChanges.pipe(
        startWith(null),
        map((option: string | null) => {
          console.log(option ? this._filter(option) : this.allOption.slice());
          return option ? this._filter(option) : this.allOption.slice();
        }),
      );
    }
  }
  ////////////////////////////// Chips

  remove(name: string): void {
    const index = this.option.indexOf(name);

    if (index >= 0) {
      this.option.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.option.push(event.option.viewValue);
    if (this.optionInput) this.optionInput.nativeElement.value = "";
    this.optionCtrl.setValue(null);
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allOption.filter((option) =>
      option.toLowerCase().includes(filterValue),
    );
  }
  sortData(sort: Sort) {
    this.sortClient.emit({
      active: sort.active,
      direction: sort.direction,
    });
  }
}
