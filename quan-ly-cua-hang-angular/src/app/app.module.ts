import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { CategoriesModule } from "./pages/categories/categories.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// import { TableComponent } from "./components/common/table/table.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { GetCategoryEffect } from "./store/categories/categories.effect";
import { OrdersModule } from "./pages/orders/orders.module";
import { OrderEffect } from "./store/orders/orders.effect";
import { TableModule } from "./components/common/table/table.module";
import { DialogModule } from "./components/common/dialog/dialog.module";
import { RolesModule } from "./components/pages/roles/roles.module";
import { RolesService } from "./components/pages/roles/roles.service";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment.prod";
import { AdminModule } from "./components/pages/admin/admin.module";
import { ProductsModule } from "./pages/products/products.module";

import { UsersComponent } from "./pages/users/users.component";
import { UsersModule } from "./pages/users/users.module";
import { UserFormModule } from "./pages/users/user-form/user-form.module";
import { LoadingInterceptor } from "./interceptor/loading/loading.interceptor";
import { LoginModule } from "./pages/login/login.module";
import { ProfileModule } from "./pages/profile/profile.module";
// import { UsersComponent } from "./pages/users/users.component";
// import { UsersModule } from "./pages/users/users.module";
// import { FormModule } from "./components/common/form/form.module";
@NgModule({
  declarations: [AppComponent, UsersComponent],
  imports: [
    UserFormModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      name: "NgRx Demo App",
      logOnly: environment.production,
    }),
    HttpClientModule,
    EffectsModule.forRoot([GetCategoryEffect, OrderEffect]),
    BrowserAnimationsModule,
    MaterialModule,
    TableModule,
    DialogModule,
    RolesModule,
    AdminModule,
    LoginModule,
    ProfileModule,
    // FormModule
  ],
  providers: [
    RolesService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
