import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductsComponent } from "./products.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { StoreModule } from "@ngrx/store";
import {
  MessageReducer,
  ProductsErrorReducer,
  ProductReducer,
  OneProductReducer,
} from "../../store/products/products.reducer";
import { EffectsModule } from "@ngrx/effects";
import {
  CreateProductEffect,
  DeleteProductEffect,
  GetOneProductEffect,
  ProductsEffect,
  UpdateProductEffect,
} from "../../store/products/products.effect";
import { MaterialModule } from "../../material/material.module";
import { ProductsFormComponent } from "./products-form/products-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "../../components/common/table/table.module";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsFormComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    StoreModule.forFeature("listProduct", ProductReducer),
    StoreModule.forFeature("errorProducts", ProductsErrorReducer),
    StoreModule.forFeature("oneProduct", OneProductReducer),
    StoreModule.forFeature("messageAPIProducts", MessageReducer),
    EffectsModule.forFeature([
      ProductsEffect,
      CreateProductEffect,
      GetOneProductEffect,
      UpdateProductEffect,
      DeleteProductEffect,
    ]),
    MaterialModule,
    ReactiveFormsModule,
    TableModule,
  ],
})
export class ProductsModule {}
