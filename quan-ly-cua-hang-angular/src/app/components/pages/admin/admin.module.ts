import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminComponent } from "./admin.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTreeModule } from "@angular/material/tree";
import { AppRoutingModule } from "src/app/app-routing.module";



@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [  CommonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSidenavModule,
    MatTreeModule,
    MatIconModule,
    AppRoutingModule
  ],
  exports:[AdminComponent,MatSidenavModule,MatTreeModule,MatIconModule]
})
export class AdminModule { }
