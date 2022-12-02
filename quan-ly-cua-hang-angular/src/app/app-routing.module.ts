import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// import { FormComponent } from "./components/common/form/form.component";
import { AdminComponent } from "./components/pages/admin/admin.component";
import {
  AdminGuard,
  ChildGuard,
  LoginGuard,
} from "./components/pages/admin/admin.guard";
import { RolesComponent } from "./components/pages/roles/roles.component";
import { CategoriesFormComponent } from "./pages/categories/categories-form/categories-form.component";
import { CategoriesComponent } from "./pages/categories/categories.component";
import { LoginComponent } from "./pages/login/login.component";
import { OrdersCreateFormComponent } from "./pages/orders/orders-create-form/orders-create-form.component";
import { OrdersEditFormComponent } from "./pages/orders/orders-edit-form/orders-edit-form.component";
import { OrdersComponent } from "./pages/orders/orders.component";
import { ProductsFormComponent } from "./pages/products/products-form/products-form.component";
import { ProductsComponent } from "./pages/products/products.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { UserFormComponent } from "./pages/users/user-form/user-form.component";
import { UsersComponent } from "./pages/users/users.component";

export const routes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AdminGuard],
    canActivateChild: [ChildGuard],
    children: [
      { path: "categories", component: CategoriesComponent },
      { path: "categories/create", component: CategoriesFormComponent },
      { path: "categories/:categoryID", component: CategoriesFormComponent },
      { path: "products", component: ProductsComponent },
      { path: "products/create", component: ProductsFormComponent },
      { path: "products/:productID", component: ProductsFormComponent },
      { path: "orders", component: OrdersComponent },
      { path: "orders/create", component: OrdersCreateFormComponent },
      { path: "orders/edit/:orderID", component: OrdersEditFormComponent },
      { path: "roles", component: RolesComponent },
      { path: "profile", component: ProfileComponent },
      { path: "users", component: UsersComponent },
      { path: "users/create", component: UserFormComponent },
      { path: "users/:id", component: UserFormComponent },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", redirectTo: "/login", pathMatch: "full" },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
