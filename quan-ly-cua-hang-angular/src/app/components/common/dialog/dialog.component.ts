import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "tsid-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.sass"],
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lable: string[]; data: any },
  ) {}

  Object = Object;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
