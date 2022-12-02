import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoriesDialogComponent } from "./categories-dialog.component";
import { MaterialModule } from "src/app/material/material.module";

@NgModule({
  declarations: [CategoriesDialogComponent],
  imports: [CommonModule, MaterialModule],
})
export class CategoriesDialogModule {}
