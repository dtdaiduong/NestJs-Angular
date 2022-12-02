import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  IListOrder,
  IOneOrder,
  ResponseOrdersAPI,
} from "./orders.component.i";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getListOrders(
    currentPage: number,
    limit: number,
    search: string,
    col?: string,
    criteria?: string,
  ) {
    let url = `http://localhost:8000/api/orders?page=${currentPage}&limit=${limit}&search=${search}`;
    col && criteria ? (url += `&key=${col}&sort=${criteria}`) : url;
    return this.http.get<IListOrder>(url).pipe();
  }

  getOneOrder(id: number) {
    return this.http
      .get<IOneOrder>(`http://localhost:8000/api/orders/${id}`)
      .pipe();
  }

  createOrder(data: { productId: number; quantity: number }[], userid: number) {
    const a = data.map((a) => {
      return { id: a.productId, quantity: a.quantity };
    });
    return this.http.post<ResponseOrdersAPI>(
      "http://localhost:8000/api/orders",
      {
        user_id: userid,
        product: a,
      },
    );
  }

  updateOrder(
    order_id: number,
    data: { productId: number; quantity: number }[],
  ) {
    const newdata = data.map((a) => {
      return { id: a.productId, quantity: a.quantity };
    });
    return this.http
      .put<ResponseOrdersAPI>(`http://localhost:8000/api/orders/${order_id}`, {
        product: newdata,
      })
      .pipe();
  }

  Delete(id: number) {
    return this.http
      .delete<ResponseOrdersAPI>(`http://localhost:8000/api/orders/${id}`)
      .pipe();
  }

  Paying(id: number) {
    return this.http
      .put<ResponseOrdersAPI>(`http://localhost:8000/api/orders/paying/${id}`, {
        data: undefined,
      })
      .pipe();
  }

}

export class OrdersStoreModule {}
