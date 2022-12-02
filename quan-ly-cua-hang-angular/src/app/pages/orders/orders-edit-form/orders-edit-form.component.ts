import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { StateObservable, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { DialogComponent } from "../../../components/common/dialog/dialog.component";
import {
  GetOrderDetail,
  updateOrder,
} from "../../../store/orders/orders.action";
import { selectOrderData } from "../../../store/orders/orders.selector";
import { getListProducts } from "../../../store/products/products.action";
import {
  selectArrayProducts,
  selectOrderLine,
  selectPaginatorProducts,
} from "../../../store/products/products.selector";
import { IProduct } from "../../products/products.component.i";
import {
  IOneOrder,
  IOrderDetailItem,
  OrderDetail,
} from "../orders.component.i";

@Component({
  selector: "tsid-orders-edit-form",
  templateUrl: "./orders-edit-form.component.html",
  styleUrls: ["./orders-edit-form.component.scss"],
})
export class OrdersEditFormComponent implements OnInit {
  @Input()
  formControl: FormControl = new FormControl();
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
  ProductsOfOneOrder!: OrderDetail;
  FormTitle = "Edit Order";
  ButtonTitle = "Update Order";
  ListProducts: IOrderDetailItem[] = [];
  products$ = this.store.select(selectOrderLine);
  orders$ = this.store.select(selectOrderData);
  routeParams = this.route.snapshot.paramMap;
  orderID = Number(this.routeParams.get("orderID"));
  dataOrder!: IOneOrder;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

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
    this.orders$.subscribe((data) => {
      if (data.status == "payment") {
        const open = this.dialog.open(DialogComponent, {
          width: "320px",
          data: { lable: ["The order has been paid !"], data: {} },
        });
        open.afterClosed().subscribe(() => {
          this.router.navigate(["admin/orders"]);
        });
      } else {
        this.ProductsOfOneOrder = data;
        this.ListProducts = this.ProductsOfOneOrder.product.map(
          (a): IOrderDetailItem => {
            return {
              name: a.name,
              productId: a.id,
              quantity: a.quantity,
              price: a.subprice,
            };
          },
        );
      }
    });
    this.store.dispatch(GetOrderDetail({ id: this.orderID }));
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
    const exist = this.ListProducts.find((a) => a.productId === curr.id);
    if (exist) {
      const ixd = this.ListProducts.indexOf(exist);
      this.ListProducts[ixd] = {
        ...this.ListProducts[ixd],
        quantity: this.ListProducts[ixd].quantity + 1,
        price: +curr.price + +this.ListProducts[ixd].price,
      };
    } else {
      this.ListProducts.push({
        productId: curr.id,
        name: curr.name,
        quantity: 1,
        price: curr.price,
      });
    }
  }

  editOrderSubmit() {
    if (this.ListProducts.length > 0) {
      const data = this.ListProducts.map((a) => {
        return { productId: a.productId, quantity: a.quantity };
      });
      this.store.dispatch(updateOrder({ data: data, order_id: this.orderID }));
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
      this.ListProducts[index].price * +input.value;
      this.ListProducts[index].price =
        (this.ListProducts[index].price / this.ListProducts[index].quantity) *
        +input.value;
      this.ListProducts[index].quantity = +input.value;
    } else this.removeProduct(this.ListProducts[index]);
  }

  handle({ type, value }: { type: string; value: any }) {
    switch (type) {
      case "add":
        this.addProduct(value);
        break;
      default:
        break;
    }
  }

  removeProduct(i: IOrderDetailItem): void {
    this.ListProducts = this.ListProducts.reduce((a: any[], item) => {
      if (item.productId === i.productId) return a;
      return [...a, item];
    }, []);
  }
}
