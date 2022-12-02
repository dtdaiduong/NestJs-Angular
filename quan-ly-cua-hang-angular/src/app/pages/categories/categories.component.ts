import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { StateObservable, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { LoadingService } from "../../interceptor/loading/loading.service";
import {
  clearListCategories,
  clearStateMessage,
  getListCategories,
} from "../../store/categories/categories.action";
import {
  selectArrayCategories,
  selectPaginatorCategories,
  selectMessageCategory,
} from "../../store/categories/categories.selector";
import { CategoriesDialogComponent } from "./categories-dialog/categories-dialog.component";
import { ISort } from "./categories.component.i";

@Component({
  selector: "tsid-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.sass"],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  hide = false;
  searchInput!: string;
  pageIndex!: number;
  pageSize!: number;
  pagi!: Subscription;
  mess!: Subscription;
  currentsort?: ISort;
  actions: { type: string; name: string }[] = [
    { type: "text", name: "edit" },
    { type: "text", name: "delete" },
  ];
  displayedColumns: { type: string; name: string }[] = [
    { type: "text", name: "id" },
    { type: "text", name: "name" },
    { type: "text", name: "Created At" },
    { type: "text", name: "Updated At" },
    { type: "action", name: "edit" },
    { type: "action", name: "delete" },
  ];
  listSort: { col: string; display: string }[] = [
    { col: "name", display: "Name" },
    { col: "created_at", display: "Created Date" },
    { col: "updated_at", display: "Updated Date" },
  ];
  paginator = this.store.select(selectPaginatorCategories) as StateObservable;
  dataSource = this.store.select(selectArrayCategories) as StateObservable;
  messageAPI = this.store.select(selectMessageCategory);

  constructor(
    public store: Store,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    public router: Router,
    public snackBar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    this.pagi.unsubscribe();
    this.mess.unsubscribe();
    this.store.dispatch(clearStateMessage());
    this.store.dispatch(clearListCategories());
  }

  ngOnInit(): void {
    // get api categories
    this.renderData(
      this.pageIndex ? this.pageIndex : 1,
      this.pageSize ? this.pageSize : 5,
      "",
    );

    //get value of paginator
    this.pagi = this.paginator.subscribe((data) => {
      this.pageSize = data.limit;
      this.pageIndex = data.currentPage;
      this.searchInput = data.search;
    });

    //get message API response
    this.mess = this.messageAPI.subscribe((response) => {
      if (response.error || response.status == "success") {
        this.snackBar.open(response.message, "Close", { duration: 1000 });
      }
    });
  }

  renderData(page: number, size: number, search: string, sort?: ISort): void {
    this.store.dispatch(
      getListCategories({
        page: page,
        limit: size,
        search: search,
        sort: sort,
      }),
    );
  }

  handlePaginator(value: { pageIndex: number; pageSize: number }) {
    this.pageIndex = value.pageIndex;
    this.pageSize = value.pageSize;
    this.currentsort
      ? this.renderData(
          value.pageIndex,
          value.pageSize,
          this.searchInput,
          this.currentsort,
        )
      : this.renderData(value.pageIndex, value.pageSize, this.searchInput);
  }

  sort(sort: ISort) {
    if (sort.criteria === "clear") {
      this.renderData(1, this.pageSize, this.searchInput);
      this.currentsort = undefined;
    } else if (sort) {
      this.currentsort = sort;
      this.renderData(1, this.pageSize, this.searchInput, this.currentsort);
    }
  }

  search(data: {
    type: string;
    value: { searchString: string; searchOption: string[] };
  }) {
    switch (data.type) {
      case "Search":
        if (
          data.value.searchString !== "" &&
          data.value.searchString !== undefined &&
          data.value.searchString !== this.searchInput
        ) {
          this.searchInput = data.value.searchString;
          this.renderData(1, this.pageSize, this.searchInput, this.currentsort);
        }
        break;
      case "clearSearch":
        if (data.value.searchString !== "") {
          this.searchInput = "";
          this.renderData(1, this.pageSize, "", this.currentsort);
        }
        break;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle({ type, value }: { type: string; value: any }) {
    switch (type) {
      case "delete":
        this.dialog.open(CategoriesDialogComponent, {
          data: value,
        });
        break;
      case "edit":
        this.router.navigate(["admin/categories", value.id]);
        break;
      default:
        break;
    }
  }
}
