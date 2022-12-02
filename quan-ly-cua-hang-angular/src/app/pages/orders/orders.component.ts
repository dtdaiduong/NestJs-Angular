/* eslint-disable no-case-declarations */
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { StateObservable, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { DialogComponent } from "../../components/common/dialog/dialog.component";
import {
  clearOrdersSort,
  deleteOrder,
  getListOrders,
  payingOrder,
  sortListOrders
} from "../../store/orders/orders.action";
import {
  selectArrayOrders,
  selectPaginatorOrders
} from "../../store/orders/orders.selector";
import { ordersSort } from "./orders.component.i";
@Component({
  selector: "tsid-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  pagi!: Subscription;
  tada!: Subscription;
  message!: Subscription;
  paginator = this.store.select(selectPaginatorOrders) as StateObservable;
  dataSoure = this.store.select(selectArrayOrders) as StateObservable;
  ListKeySort: { col: string; display: string }[] = [
    { col: "firstname", display: "Name" },
    { col: "create_at", display: "Created Date" },
    { col: "update_at", display: "Updated Date" },
  ];
  col = "";
  criteria = "";
  sortedData: unknown[] = [];
  displayedColumns: { type: string; name: string }[] = [
    { type: "text", name: "order_id" },
    { type: "text", name: "user_id" },
    { type: "text", name: "firstname" },
    { type: "text", name: "total_price" },
    { type: "text", name: "create_at" },
    { type: "text", name: "update_at" },
    { type: "text", name: "status" },
    { type: "action", name: "edit" },
    { type: "action", name: "delete" },
    { type: "action", name: "Paying" },
  ];
  actions: { type: string; name: string }[] = [
    { type: "text", name: "edit" },
    { type: "text", name: "delete" },
    { type: "text", name: "Paying" },
  ];
  constructor(
    private store: Store,
    public router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.renderData(
      this.pageIndex ? this.pageIndex : 1,
      this.pageSize ? this.pageSize : 5,
      "",
    );
    this.tada = this.paginator.subscribe((data) => {
      this.pageSize = data.limit;
    });
    this.pagi = this.paginator.subscribe((data) => {
      this.pageSize = data.limit;
      this.pageIndex = data.currentPage;
    });
    this.dataSoure.subscribe((data) => {
      this.sortedData = data;
      console.log(data);
    });
  }

  renderData(currentPage: number, limit: number, search: string) {
    this.store.dispatch(
      getListOrders({
        currentPage: currentPage,
        limit: limit,
        search: search,
        col: this.col,
        criteria: this.criteria,
      }),
    );
    // console.log(this.store.dispatch(
    //   getListOrders({
    //     currentPage: currentPage,
    //     limit: limit,
    //     search: search,
    //     col: this.col,
    //     criteria: this.criteria,
    //   }),
    // ));
  }
  searchInput = "";
  pageIndex!: number;
  pageSize!: number;
  handlePaginator(value: { pageIndex: number; pageSize: number }) {
    this.store.dispatch(
      getListOrders({
        currentPage: value.pageIndex,
        limit: value.pageSize,
        search: this.searchInput,
        col: this.col,
        criteria: this.criteria,
      }),
    );
  }

  onSearch(data: {
    type: string;
    value: {
      searchString: string;
      searchOption: string[];
    };
  }) {
    switch (data.type) {
      case "Search":
        if (
          data.value.searchString !== "" &&
          data.value.searchString !== undefined &&
          data.value.searchString !== this.searchInput
        ) {
          this.searchInput = data.value.searchString;
          this.renderData(1, this.pageSize, this.searchInput);
        }
        break;
      case "clearSearch":
        if (data.value.searchString !== "") {
          this.searchInput = "";
          this.renderData(1, this.pageSize, "");
          // console.log(this.renderData(1, this.pageSize, ""));
        }
        break;
    }
  }

  onSort(sort: { col: string; criteria: string }) {
    switch (sort.criteria) {
      case "desc":
      case "asc":
        this.col = sort.col;
        this.criteria = sort.criteria;
        this.store.dispatch(
          getListOrders({
            currentPage: 1,
            limit: this.pageSize,
            search: this.searchInput,
            col: sort.col,
            criteria: sort.criteria,
          }),
        );

        break;
      case "clear":
        this.col = "";
        this.criteria = "=";
        this.store.dispatch(
          getListOrders({
            currentPage: 1,
            limit: this.pageSize,
            search: this.searchInput,
            col: sort.col,
            criteria: sort.criteria,
          }),
        );
        break;
    }
  }

  handleActions({ type, value }: { type: string; value: any }) {
    switch (type) {
      case "edit":
        if (value.status == "draft")
          this.router.navigate(["admin/orders/edit/", value.order_id]);
        else
          this._snackBar.open("The bill has been paid ! NOT EDIT", "close", {
            duration: 4000,
          });
        break;
      case "delete":
        if (value.status == "draft") {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: "250px",
            data: { lable: ["Delete the order"], data: {} },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
              this.store.dispatch(deleteOrder({ id: value.order_id }));
              this._snackBar.open("DELETE success", "close", {
                duration: 4000,
              });
            }
          });
        } else
          this._snackBar.open("The bill has been paid ! NOT DELETE", "close", {
            duration: 4000,
          });
        break;
      case "Paying":
        if (value.status == "draft") {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: "250px",
            data: { lable: ["Paying the bill ?"], data: {} },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
              this.store.dispatch(payingOrder({ id: value.order_id }));
            }
          });
        } else
          this._snackBar.open("The bill has been paid !", "close", {
            duration: 4000,
          });
        break;
      default:
        break;
    }
  }

  handleSortClient(sort: { active: string; direction: string }) {
    const data = this.sortedData.slice() as ordersSort[];
      if (!sort.active || sort.direction === "") {
      this.store.dispatch(clearOrdersSort());
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "order_id":
          console.log(sort.active);
          return this.compare(a.order_id, b.order_id, isAsc);
        case "user_id":
          return this.compare(a.user_id, b.user_id, isAsc);
        case "firstname":
          return this.compare(a.firstname, b.firstname, isAsc);
        case "total_price":
          return this.compare(a.total_price, b.total_price, isAsc);
        case "create_at":
          return this.compare(a.create_at, b.create_at, isAsc);
        case "update_at":
          return this.compare(a.update_at, b.update_at, isAsc);
        default:
          return 0;
      }
    });
    this.store.dispatch(
      sortListOrders({ resListOrders: this.sortedData as ordersSort[] }),
    );
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
