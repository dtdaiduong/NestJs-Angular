import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { map } from "rxjs";
import {
  IListProduct,
  IOneProduct,
  IProduct,
  ISort,
  ResponseAPI,
} from "../../pages/products/products.component.i";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  GetListProducts(
    page: number,
    size: number,
    search: string,
    categories: number[],
    sort?: ISort,
  ) {
    let url = `http://localhost:8000/api/products?page=${page}&limit=${size}&search=${search}&category=[${categories}]`;
    sort?.col && sort.criteria
      ? (url += `&column=${sort.col}&options=${sort.criteria}`)
      : url;
    return this.http.get<IListProduct>(url).pipe();
  }

  GetOneProduct(id: number) {
    const Url = `http://localhost:8000/api/products/${id}`;
    return this.http.get<IOneProduct>(Url).pipe();
  }

  Create(data: FormData) {
    const Url = "http://localhost:8000/api/products";
    return this.http.post<ResponseAPI>(Url, data).pipe();
  }

  Edit(id: number, data: FormData) {
    const Url = `http://localhost:8000/api/products/${id}`;
    return this.http.put<ResponseAPI>(Url, data).pipe();
  }

  Delete(id: number) {
    const Url = `http://localhost:8000/api/products/${id}`;
    return this.http.delete<ResponseAPI>(Url).pipe();
  }
}
