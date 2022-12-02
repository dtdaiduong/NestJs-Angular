import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MaterialModule } from "src/app/material/material.module";
import { StoreModule } from "@ngrx/store";
import { RolesReducer } from "src/app/store/roles/roles.reducer";
import { RolesEffect } from "src/app/store/roles/roles.effect";
import { EffectsModule } from "@ngrx/effects";
@NgModule({
  declarations: [],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    StoreModule.forFeature("listRoles", RolesReducer),
    EffectsModule.forFeature([RolesEffect]),
  ]
})
export class UserFormModule { }
