import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogComponent } from "./dialog.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  declarations: [DialogComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  exports: [
    DialogComponent,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
})
export class DialogModule {}
