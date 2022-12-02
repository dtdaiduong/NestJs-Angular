/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StateObservable, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { createOrder } from "../../../store/orders/orders.action";
import { getListProducts } from "../../../store/products/products.action";
import {
  selectArrayProducts,
  selectOrderLine,
  selectPaginatorProducts,
} from "../../../store/products/products.selector";
import { GetAllUsers } from "../../../store/users/users.action";
import { getAllUsers } from "../../../store/users/users.selector";
import { IProduct } from "../../products/products.component.i";
import { IUser } from "../../users/users.component.i";
import { IOrderDetailItem } from "../orders.component.i";

@Component({
  selector: "tsid-orders-from",
  templateUrl: "./orders-create-form.component.html",
  styleUrls: ["./orders-create-form.component.scss"],
})
export class OrdersCreateFormComponent implements OnInit {
  @Input()
  formControl: FormControl = new FormControl();
  userid = new FormControl();
  displayedColumns: { type: string; name: string }[] = [
    { type: "text", name: "id" },
    { type: "text", name: "name" },
    { type: "text", name: "price" },
    // { type: "text", name: "image" },
    { type: "action", name: "add" },
  ];
  actions: { type: string; name: string }[] = [{ type: "text", name: "add" }];
  pagi!: Subscription;
  pageIndex!: number;
  pageSize!: number;
  searchInput!: string;
  paginator = this.store.select(selectPaginatorProducts) as StateObservable;
  dataSoureListProduct = this.store.select(
    selectArrayProducts,
  ) as StateObservable;
  handlePaginator(value: { pageIndex: number; pageSize: number }) {
    this.renderData(
      value.pageIndex,
      value.pageSize,
      this.searchInput ? this.searchInput : "",
      [],
    );
  }

  renderData(page: number, limit: number, search: string, category: number[]) {
    this.store.dispatch(
      getListProducts({
        page: page,
        limit: limit,
        search: search,
        category: category,
      }),
    );
  }

  selectedValue!: IProduct[];
  Users: IUser[] = [];
  Products: IProduct[] = [];
  FormTitle = "Create Order";
  ButtonTitle = "Add Order";
  listItem: IOrderDetailItem[] = [];
  users$ = this.store.select(getAllUsers);
  products$ = this.store.select(selectOrderLine);

  constructor(private store: Store, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.pagi = this.paginator.subscribe((data) => {
      this.pageSize = data.limit;
      this.pageIndex = data.currentPage;
    });
    this.renderData(
      this.pageIndex ? this.pageIndex : 1,
      this.pageSize ? this.pageSize : 5,
      "",
      [],
    );
    this.store.dispatch(
      GetAllUsers({ page: 1, limit: 10, search: "", roles: [] }),
    );
    this.users$.subscribe((data) => {
      this.Users = data;
    });
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
          this.renderData(1, this.pageSize, this.searchInput, []);
        }
        break;
      case "clearSearch":
        if (data.value.searchString !== "" && data.value !== undefined) {
          this.searchInput = "";
          this.renderData(1, this.pageSize, "", []);
        }
        break;
      default:
        break;
    }
  }
  addProduct(curr: IProduct) {
    const exist = this.listItem.find((a) => a.productId === curr.id);
    if (exist) {
      const ixd = this.listItem.indexOf(exist);
      this.listItem[ixd] = {
        ...this.listItem[ixd],
        quantity: this.listItem[ixd].quantity + 1,
        price: +curr.price + +this.listItem[ixd].price,
      };
    } else {
      this.listItem.push({
        productId: curr.id,
        name: curr.name,
        quantity: 1,
        price: curr.price,
      });
    }
  }
  createOrderSubmit() {
    if (this.listItem.length > 0) {
      if (this.userid.value != undefined) {
        const data = this.listItem.map((a) => {
          return { productId: a.productId, quantity: a.quantity };
        });
        this.store.dispatch(
          createOrder({ data: data, user: this.userid.value }),
        );
      } else
        this._snackBar.open(
          "The order must have a buyer, please choose a buyer",
          "close",
          {
            duration: 4000,
          },
        );
    } else
      this._snackBar.open(
        "Orders must contain products, Please choose product",
        "close",
        {
          duration: 4000,
        },
      );
  }

  onQuantityChange(input: HTMLInputElement, index: number) {
    if (+input.value !== 0) {
      this.listItem[index].price * +input.value;
      this.listItem[index].price =
        (this.listItem[index].price / this.listItem[index].quantity) *
        +input.value;
      this.listItem[index].quantity = +input.value;
    } else this.removeProduct(this.listItem[index]);
  }

  handle({ type, value }: { type: string; value: any }) {
    switch (type) {
      case "add":
        console.log(value);
        this.addProduct(value);
        break;
      default:
        break;
    }
  }

  removeProduct(i: IOrderDetailItem): void {
    this.listItem = this.listItem.reduce((a: any[], item) => {
      if (item.productId === i.productId) return a;
      return [...a, item];
    }, []);
  }
}
