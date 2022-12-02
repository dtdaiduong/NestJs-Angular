import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material/material.module";
import { usersReducer } from "src/app/store/users/users.reducer";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { UserEffect } from "src/app/store/users/users.effect";
import { RolesReducer } from "src/app/store/roles/roles.reducer";
import { RolesEffect } from "src/app/store/roles/roles.effect";
import { UserFormComponent } from "./user-form/user-form.component";
import { UserFormModule } from "./user-form/user-form.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    UserFormComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserFormModule,
    CommonModule,
    MaterialModule,
    StoreModule.forFeature("users", usersReducer),
    StoreModule.forFeature("listRoles", RolesReducer),
    EffectsModule.forFeature([UserEffect, RolesEffect]),
  ]
})
export class UsersModule { }
