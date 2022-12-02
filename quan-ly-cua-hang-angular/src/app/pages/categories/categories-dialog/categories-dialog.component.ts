import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { deleteCategory } from "../../../store/categories/categories.action";
import { ICategory } from "../categories.component.i";

@Component({
  selector: "tsid-confirm-dialog",
  templateUrl: "./categories-dialog.component.html",
  styleUrls: ["./categories-dialog.component.sass"],
})
export class CategoriesDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CategoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICategory,
    public store: Store,
  ) {}

  ngOnInit(): void {
    //
  }
  cancel(): void {
    this.dialogRef.close();
  }
  delete(): void {
    this.store.dispatch(deleteCategory({ id: this.data.id }));
    this.dialogRef.close();
  }
}
