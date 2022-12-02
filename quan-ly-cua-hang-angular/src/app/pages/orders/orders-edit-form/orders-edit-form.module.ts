import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { TableModule } from "../../../components/common/table/table.module";
import { OrderEffect } from "../../../store/orders/orders.effect";
import { OrderDetailReducer } from "../../../store/orders/orders.reducer";
import { ProductsEffect } from "../../../store/products/products.effect";
import { UserEffect } from "../../../store/users/users.effect";
import { OrdersEditFormComponent } from "./orders-edit-form.component";

@NgModule({
  declarations: [OrdersEditFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatInputModule,
    TableModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    StoreModule.forFeature("orderdetail", OrderDetailReducer),
    StoreModule.forFeature("oneOrder", OrderDetailReducer),
    EffectsModule.forFeature([OrderEffect, UserEffect, ProductsEffect]),
  ],
  exports: [OrdersEditFormComponent],
})
export class OrdersEditFormModule {}
