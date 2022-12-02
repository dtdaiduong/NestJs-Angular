import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { InputModule } from "../input/input.module";
import { TableComponent } from "./table.component";
// import { ButtonModule } from "../button/button.module"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
@NgModule({
  declarations: [TableComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    InputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
  ],
  exports: [
    MatTableModule,
    MatIconModule,
    TableComponent,
    MatPaginatorModule,
    MatSelectModule,
  ],
})
export class TableModule {}
