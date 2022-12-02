import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { deleteProduct } from "../../../store/products/products.action";
import { IProduct } from "../products.component.i";

@Component({
  selector: "tsid-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.sass"],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProduct,
    private store: Store,
  ) {}

  public getStore() {
    return this.store;
  }

  ngOnInit(): void {
    //
  }

  cancel(): void {
    this.dialogRef.close();
  }

  delete(): void {
    this.store.dispatch(deleteProduct({ id: this.data.id }));
    this.dialogRef.close();
  }
}
