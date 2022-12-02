import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { AppRoutingModule } from "../../app-routing.module";
import { InputModule } from "../../components/common/input/input.module";
import { MaterialModule } from "../../material/material.module";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    InputModule,
    MaterialModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
