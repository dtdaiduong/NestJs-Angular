import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AppRoutingModule } from "../../app-routing.module";
import { TableModule } from "../../components/common/table/table.module";
import { OrderEffect } from "../../store/orders/orders.effect";
import { OrderReducer } from "../../store/orders/orders.reducer";
import { usersReducer } from "../../store/users/users.reducer";
import { OrdersCreateFormModule } from "./orders-create-form/orders-create-form.module";
import { OrdersEditFormModule } from "./orders-edit-form/orders-edit-form.module";
import { OrdersComponent } from "./orders.component";
@NgModule({
  declarations: [OrdersComponent],
  imports: [
    MatSelectModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OrdersCreateFormModule,
    StoreModule.forFeature("listOrders", OrderReducer),
    StoreModule.forFeature("allUsers", usersReducer),
    OrdersEditFormModule,
    EffectsModule.forFeature([OrderEffect]),
    TableModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
  ],
})
export class OrdersModule {}
