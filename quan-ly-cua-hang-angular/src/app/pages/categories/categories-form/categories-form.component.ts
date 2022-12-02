import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  clearOneCategory,
  clearStateMessage,
  createCategory,
  getOneCategory,
  updateCategory,
} from "../../../store/categories/categories.action";
import { ActivatedRoute } from "@angular/router";
import { IOneCategory, ResponseAPI } from "../categories.component.i";
import {
  selectOneCategory,
  selectMessageCategory,
} from "../../../store/categories/categories.selector";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { LoadingService } from "../../../interceptor/loading/loading.service";

@Component({
  selector: "tsid-categories-form",
  templateUrl: "./categories-form.component.html",
  styleUrls: ["./categories-form.component.sass"],
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  taskDone: boolean;
  id: undefined | number;
  ButtonTitle: string;
  FormTitle: string;
  DataTitle: string;
  cate$!: Observable<IOneCategory>;
  catesub!: Subscription;
  messageAPI$: Observable<ResponseAPI>;
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public store: Store,
    public route: ActivatedRoute,
    public loadingService: LoadingService,
  ) {
    this.ButtonTitle = "Create";
    this.taskDone = false;
    this.FormTitle = "Create Category";
    this.DataTitle = "Create Category Success";
    this.messageAPI$ = this.store.select(selectMessageCategory);
    this.cate$ = this.store.select(selectOneCategory);
  }
  ngOnDestroy(): void {
    this.store.dispatch(clearStateMessage());
    this.store.dispatch(clearOneCategory());
    if (this.catesub) {
      this.catesub.unsubscribe();
    }
  }

  nameFormControl = new FormControl("", [Validators.required]);
  idCreate = new FormControl("");
  nameCreate = new FormControl("");

  ngOnInit(): void {
    const routeParams = Number(this.route.snapshot.paramMap.get("categoryID"));
    if (routeParams) {
      this.id = routeParams;
      this.ButtonTitle = "Update";
      this.FormTitle = "Update Category";
      this.DataTitle = "Update Category Success";
      this.store.dispatch(getOneCategory({ id: this.id }));
    }

    this.catesub = this.cate$.subscribe((res) => {
      if (res) {
        const dataCate = res as IOneCategory;
        this.nameFormControl.setValue(dataCate.data.name);
      }
    });

    this.messageAPI$.subscribe((res) => {
      if (res.status == "success" && res.data) {
        this.viewBack(res.data);
      }
      if (res.statusCode === 404) this.router.navigate(["admin/categories"]);
      if (res.error && res.statusCode) {
        this.snackBar.open(res.message, "Close", { duration: 2000 });
      }
    });
  }

  viewBack(data: { id: number; name: string }): void {
    this.taskDone = true;
    this.idCreate.setValue(data.id);
    this.nameCreate.setValue(data.name);
  }

  submit(cname: string): void {
    if (this.ButtonTitle === "Create") {
      this.store.dispatch(createCategory({ name: cname }));
    } else if (this.id) {
      return this.store.dispatch(updateCategory({ id: this.id, name: cname }));
    }
  }

  clear(): void {
    this.taskDone = false;
  }

  back(): void {
    this.router.navigate(["admin/categories"]);
  }
}
