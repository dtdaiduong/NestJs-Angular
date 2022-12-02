import { Injectable, NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import {
  CategoryReducer,
  MessageReducer,
  OneCategoryReducer,
} from "src/app/store/categories/categories.reducer";
import {
  IListCategory,
  IOneCategory,
  ISort,
  ResponseAPI,
} from "./categories.component.i";
import { timeout } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getListCategories(page: number, limit: number, search: string, sort?: ISort) {
    let url = `http://localhost:8000/api/categories?page=${page}&limit=${limit}&search=${search}`;
    if (sort) url += `&key=${sort.col}&sort=${sort.criteria}`;
    return this.http.get<IListCategory>(url).pipe();
  }
  getOneCategory(id: number) {
    return this.http
      .get<IOneCategory>(`http://localhost:8000/api/categories/${id}`)
      .pipe();
  }
  createCategory(name: string) {
    return this.http
      .post<ResponseAPI>("http://localhost:8000/api/categories", { name })
      .pipe(timeout(10000));
  }
  updateCategory(id: number, name: string) {
    return this.http
      .put<ResponseAPI>(`http://localhost:8000/api/categories/${id}`, { name })
      .pipe();
  }
  deleteCategory(id: number) {
    return this.http
      .delete<ResponseAPI>(`http://localhost:8000/api/categories/${id}`)
      .pipe();
  }
}

@NgModule({
  imports: [
    StoreModule.forFeature("listCategories", CategoryReducer),
    StoreModule.forFeature("oneCategory", OneCategoryReducer),
    StoreModule.forFeature("messageAPICategories", MessageReducer),
  ],
})
export class CategoriesStoreModule {}
