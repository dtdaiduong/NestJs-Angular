import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { map, Observable, startWith, Subscription } from "rxjs";
import { getListCategories } from "../../../store/categories/categories.action";
import { selectListCategories } from "../../../store/categories/categories.selector";
import {
  clearOneProduct,
  clearStateMessage,
  createProduct,
  getOneProduct,
  updateProduct,
} from "../../../store/products/products.action";
import {
  oneProducts,
  selectMessageProduct,
} from "../../../store/products/products.selector";
import { ICategory } from "../../categories/categories.component.i";
@Component({
  selector: "tsid-products-form",
  templateUrl: "./products-form.component.html",
  styleUrls: ["./products-form.component.sass"],
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  // --- Material --- //

  @ViewChild("cateInput") cateInput!: ElementRef<HTMLInputElement>;

  // --- Form Control --- //

  myForm = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl(),
    price: new FormControl(),
    fileSource: new FormControl(),
    fileControl: new FormControl(),
  });
  categoryControl = new FormControl("");

  // --- Biến --- //

  formTitle = "Create Product";
  buttonTitle = "Create";
  nameTitle = "Name Product";

  id = 0;

  filteredCates!: Observable<ICategory[]>;
  imageProduct = "";
  cates: ICategory[] = [];
  allCates: ICategory[] = [];
  reader!: FileReader;
  cate!: Subscription;
  ms!: Subscription;
  // --- Selector --- //

  listCates$ = this.store.pipe(select(selectListCategories));
  oneProductAPI$ = this.store.pipe(select(oneProducts));
  msgProductAPI$ = this.store.pipe(select(selectMessageProduct));

  // --- Life Cycle --- //

  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public store: Store,
    public route: ActivatedRoute,
  ) {}
  ngOnDestroy(): void {
    this.cate.unsubscribe();
    this.ms.unsubscribe();
    this.store.dispatch(clearStateMessage());
    this.store.dispatch(clearOneProduct());
  }

  ngOnInit(): void {
    // Lấy productID ở router
    // https://stackoverflow.com/questions/45997369/how-to-get-param-from-url-in-angular-4
    const id = this.route.snapshot.paramMap.get("productID");

    // Nếu có id ở router => đó là update
    if (id) {
      // Chuyển id từ string -> integer
      this.id = +id;

      // Đổi tên các thuộc tính ở product-form.component.html :
      this.formTitle = "Update Product";
      this.buttonTitle = "Update";

      // Lấy Product theo id
      this.oneProductAPI$.pipe().subscribe((res) => {
        this.imageProduct = res.data.image;
        this.cates = res.data.category;

        // Lấy tất cả các giá trị được nhập ở form update
        this.myForm.patchValue({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          image: res.data.image,
          category: res.data.category,
        });
      });
      this.store.dispatch(getOneProduct({ id: +id }));
    }

    // Hiển thị tất cả list category ra form MatChipList
    this.cate = this.listCates$.pipe().subscribe((res) => {
      this.allCates = [...res.data].reduce((a: ICategory[], b: ICategory) => {
        const as = this.cates.some((res) => {
          return res.id === b.id;
        });
        if (as) return a;
        return [...a, b];
      }, []);

      this.filteredCates = this.categoryControl.valueChanges.pipe(
        startWith(null),
        map((cate: string | null) =>
          cate ? this._filter(cate) : this.allCates.slice(),
        ),
      );
    });

    this.ms = this.msgProductAPI$.pipe().subscribe((res) => {
      if (res.status == "success") {
        this.snackBar.open(res.message, "Close", { duration: 2000 });
        this.router.navigate(["admin/products"]);
      }
      if (res.error && res.statusCode) {
        this.snackBar.open(res.message, "Close", { duration: 2000 });
      }
    });

    this.store.dispatch(
      getListCategories({
        page: 1,
        limit: 200,
        search: "",
      }),
    );
  }

  // Xử lí ảnh
  onFileSelected(event: Event) {
    this.reader = new FileReader();

    const element = event.target as HTMLInputElement;
    if (element.files) {
      const file = element.files[0];
      this.myForm.patchValue({
        fileSource: file,
      });
    }
    const source = this.myForm.get("fileSource");
    if (source) {
      this.reader.readAsDataURL(source.value);
    }
    this.reader.onload = this.readSuccess;
  }

  readSuccess = () => {
    if (this.reader.result) {
      this.imageProduct = this.reader.result.toString();
    }
  };
  // Xóa category
  remove(cate: ICategory): void {
    const index = this.cates.reduce(
      (init: { ix: number }, e: ICategory, ind: number) => {
        if (e.id === cate.id) return { ...init, ix: ind };
        return init;
      },
      {} as { ix: number },
    );

    const a = [...this.cates];

    a.splice(index.ix, 1);
    if (index.ix >= 0) {
      this.cates = a;
    }

    this.allCates = [...this.allCates, cate];
    this.filteredCates = this.categoryControl.valueChanges.pipe(
      startWith(null),
      map((cate: string | null) =>
        cate ? this._filter(cate) : this.allCates.slice(),
      ),
    );
  }

  //
  exclude(cate: ICategory): void {
    const b = this.allCates.filter((c) => {
      return c.id !== cate.id;
    });
    this.allCates = b;
  }

  //
  _filter(value: string): ICategory[] {
    const filterValue = value.toString().toLowerCase();
    return this.allCates.filter((cate) =>
      cate.name.toLowerCase().includes(filterValue),
    );
  }

  //
  selected(event: MatAutocompleteSelectedEvent): void {
    this.exclude(event.option.value);
    this.cates = [...this.cates, event.option.value];
    this.cateInput.nativeElement.value = "";
    this.categoryControl.setValue(null);
  }

  // Button
  submit() {
    const formData = new FormData();
    const name = this.myForm.get("name");
    const fileSource = this.myForm.get("fileSource");
    const description = this.myForm.get("description");
    const price = this.myForm.get("price");

    if (name) formData.append("name", name.value);
    if (fileSource) formData.append("photo", fileSource.value);
    if (description) formData.append("description", description.value);
    if (price) formData.append("price", price.value);
    formData.append("category", this.cates.map((c) => c.id).toString());

    if (this.buttonTitle == "Create") {
      this.store.dispatch(createProduct({ data: formData }));
    } else if (this.buttonTitle == "Update") {
      this.store.dispatch(updateProduct({ id: this.id, data: formData }));
    }
  }
}
