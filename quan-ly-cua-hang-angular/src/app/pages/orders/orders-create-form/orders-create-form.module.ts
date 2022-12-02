import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { TableModule } from "../../../components/common/table/table.module";
import { OrderEffect } from "../../../store/orders/orders.effect";
import { ProductsEffect } from "../../../store/products/products.effect";
import { ProductReducer } from "../../../store/products/products.reducer";
import { UserEffect } from "../../../store/users/users.effect";
import { usersReducer } from "../../../store/users/users.reducer";
import { OrdersCreateFormComponent } from "./orders-create-form.component";
@NgModule({
  declarations: [OrdersCreateFormComponent],
  imports: [
    FormsModule,
    MatSelectModule,
    StoreModule.forFeature("allUsers", usersReducer),
    StoreModule.forFeature("listProduct", ProductReducer),
    EffectsModule.forFeature([OrderEffect, UserEffect, ProductsEffect]),
    CommonModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatInputModule,
    MatDialogModule,
    TableModule,
    MatButtonModule,
  ],
  exports: [OrdersCreateFormComponent],
})
export class OrdersCreateFormModule {}
