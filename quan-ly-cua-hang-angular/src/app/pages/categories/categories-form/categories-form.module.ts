import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NewCategoryEffect,
  updateCategoryEffect,
} from "src/app/store/categories/categories.effect";
import { EffectsModule } from "@ngrx/effects";
import { MaterialModule } from "src/app/material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputModule } from "src/app/components/common/input/input.module";
import { CategoriesFormComponent } from "./categories-form.component";
@NgModule({
  declarations: [CategoriesFormComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([NewCategoryEffect, updateCategoryEffect]),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    InputModule,
  ],
})
export class CategoriesFormModule {}
