import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormComponent } from "./form.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class FormModule { }
