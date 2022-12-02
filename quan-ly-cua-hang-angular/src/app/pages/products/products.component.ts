import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { StateObservable, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { selectListCategories } from "../../store/categories/categories.selector";
import { getListCategories } from "../../store/categories/categories.action";
import {
  clearStateMessage,
  getListProducts,
} from "../../store/products/products.action";
import {
  selectArrayProducts,
  selectMessageProduct,
  selectPaginatorProducts,
} from "../../store/products/products.selector";
import { ICategory } from "../categories/categories.component.i";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { ISort } from "./products.component.i";

@Component({
  selector: "tsid-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.sass"],
})
export class ProductsComponent implements OnInit, OnDestroy {
  // --- Column --- //

  displayedColumns: { type: string; name: string }[] = [
    { type: "text", name: "id" },
    { type: "text", name: "name" },
    { type: "text", name: "description" },
    { type: "text", name: "price" },
    { type: "img", name: "image" },
    { type: "array", name: "category" },
    { type: "action", name: "edit" },
    { type: "action", name: "delete" },
  ];

  ListKeySort: { col: string; display: string }[] = [
    { col: "name", display: "Name" },
    { col: "price", display: "Price" },
    { col: "id", display: "ID Product" },
    { col: "description", display: "Description" },
  ];

  actions: { type: string; name: string }[] = [
    { type: "text", name: "edit" },
    { type: "text", name: "delete" },
  ];

  pagi!: Subscription;
  ms!: Subscription;
  pageIndex!: number;
  pageSize!: number;
  searchInput!: string;
  sort: ISort = {
    col: "",
    criteria: "",
  };
  categories = true;
  hide = false;
  allFruits: string[] = [];
  categoriesList: ICategory[] = [];
  lstCate = this.store.select(selectListCategories);
  lstCate$: any;
  cateSearch: number[] = [];

  paginator = this.store.select(selectPaginatorProducts) as StateObservable;
  dataSource = this.store.select(selectArrayProducts) as StateObservable;
  resAPI$ = this.store.select(selectMessageProduct);

  renderData(
    page: number,
    limit: number,
    search: string,
    category: number[],
    sort?: ISort,
  ) {
    this.store.dispatch(
      getListProducts({
        page: page,
        limit: limit,
        search: search,
        category: category,
        sort: sort,
      }),
    );
  }

  handlePaginator(value: { pageIndex: number; pageSize: number }) {
    this.pageIndex = value.pageIndex;
    this.pageSize = value.pageSize;
    this.renderData(
      value.pageIndex,
      value.pageSize,
      this.searchInput,
      [],
      this.sort,
    );
  }

  handleSort(e: ISort) {
    if (e.criteria == "clear") {
      this.sort = {
        col: "",
        criteria: "",
      };
      this.renderData(1, 5, this.searchInput, this.cateSearch);
    } else {
      this.sort = e;
      this.renderData(1, 5, this.searchInput, this.cateSearch, e);
    }
  }

  sortClient(e: { active: string; direction: string }) {
    if (e.direction == "") {
      this.sort = {
        col: "",
        criteria: "",
      };
      this.renderData(1, 5, this.searchInput, this.cateSearch);
    } else {
      this.sort = { col: e.active, criteria: e.direction };
      this.renderData(1, 5, this.searchInput, this.cateSearch, this.sort);
    }
  }

  handle({ type, value }: { type: string; value: any }) {
    switch (type) {
      case "edit":
        this.router.navigate(["admin/products", value.id]);
        break;
      case "delete":
        console.log("delete");
        this.dialog.open(ConfirmDialogComponent, {
          data: value,
        });
        break;
      default:
        break;
    }
  }

  search(data: {
    type: string;
    value: { searchString: string | undefined; searchOption: string[] };
  }) {
    switch (data.type) {
      case "Search":
        if (
          // search name
          data.value.searchString !== "" &&
          data.value.searchString !== undefined &&
          data.value.searchOption.length == 0
        ) {
          this.cateSearch = [];
          this.searchInput = data.value.searchString;
          this.renderData(
            1,
            this.pageSize,
            this.searchInput,
            this.cateSearch,
            this.sort,
          );
        } else if (
          // search categories
          (data.value.searchString == "" ||
            data.value.searchString == undefined) &&
          data.value.searchOption.length !== 0
        ) {
          const cateID: number[] = [];
          this.categoriesList.forEach((e) => {
            data.value.searchOption.forEach((r) => {
              if (e.name === r) {
                cateID.push(e.id);
              }
            });
          });

          this.cateSearch = cateID;
          this.searchInput = "";
          this.renderData(
            1,
            this.pageSize,
            this.searchInput,
            cateID,
            this.sort,
          );
        } else if (
          // search name and categories
          data.value.searchString !== "" &&
          data.value.searchString !== undefined &&
          data.value.searchOption.length !== 0
        ) {
          const cateID: number[] = [];
          this.categoriesList.forEach((e) => {
            data.value.searchOption.forEach((r) => {
              if (e.name === r) {
                cateID.push(e.id);
              }
            });
          });

          this.cateSearch = cateID;
          this.searchInput = data.value.searchString;
          this.renderData(
            1,
            this.pageSize,
            this.searchInput,
            cateID,
            this.sort,
          );
        }
        break;
      case "clearSearch":
        if (this.searchInput !== "") {
          this.sort = {
            col: "",
            criteria: "",
          };
          this.categoriesList = [];
          this.searchInput = "";
          this.renderData(1, this.pageSize, "", []);
        }
        break;
    }
  }

  getRouter() {
    return this.router;
  }

  getDialog() {
    return this.dialog;
  }

  getStore() {
    return this.store;
  }

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(getListCategories({ page: 1, limit: 50, search: "" }));
    this.renderData(
      this.pageIndex ? this.pageIndex : 1,
      this.pageSize ? this.pageSize : 5,
      "",
      [],
    );

    this.pagi = this.paginator.subscribe((data) => {
      this.pageSize = data.limit;
      this.pageIndex = data.currentPage;
      this.searchInput = data.search;
    });

    this.ms = this.resAPI$.subscribe((response) => {
      if (response.error || response.status == "success")
        this.snackBar.open(response.message, "Close", { duration: 3000 });
    });

    this.lstCate$ = this.lstCate.subscribe((r) => {
      this.allFruits = r.data.map((e) => e.name);
      this.categoriesList = r.data;
    });
  }

  ngOnDestroy(): void {
    if (this.pagi) this.pagi.unsubscribe();
    if (this.ms) this.ms.unsubscribe();
    this.store.dispatch(clearStateMessage());
  }
}
