import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputComponent } from "./input.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [InputComponent],
  imports: [CommonModule, MatInputModule,MatFormFieldModule,FormsModule,ReactiveFormsModule],
  exports: [InputComponent, MatInputModule],
})
export class InputModule {}
