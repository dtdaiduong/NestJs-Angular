import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "../../app-routing.module";
import {
  DeleteCategoryEffect,
  GetCategoryEffect,
  OneCategoryEffect,
} from "../../store/categories/categories.effect";
import { CategoriesFormModule } from "./categories-form/categories-form.module";
import { MaterialModule } from "src/app/material/material.module";
import { CategoriesStoreModule } from "./categories.service";
import { CategoriesComponent } from "./categories.component";
import { TableModule } from "src/app/components/common/table/table.module";
import { InputModule } from "src/app/components/common/input/input.module";
import { CategoriesDialogModule } from "./categories-dialog/categories-dialog.module";
@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    EffectsModule.forFeature([
      GetCategoryEffect,
      OneCategoryEffect,
      DeleteCategoryEffect,
    ]),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CategoriesFormModule,
    CategoriesStoreModule,
    CategoriesDialogModule,
    TableModule,
    InputModule,
  ],
})
export class CategoriesModule {}
