import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RolesComponent } from "./roles.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
// import { TableModule } from "../../common/table/table.module";
// import { TableComponent } from "../../common/table/table.component";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
// import { GetCategoryEffect } from "../../../store/categories/categories.effect";

import {
  RolesErrorReducer,
  RolesReducer,
} from "../../../store/roles/roles.reducer";
import { RolesEffect } from "src/app/store/roles/roles.effect";
import { TableModule } from "../../common/table/table.module";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../../../../environments/environment.prod";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
// import { DialoglService } from "../../common/dialog/dialog.service";

@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature("listRoles", RolesReducer),
    StoreModule.forFeature("errorRoles", RolesErrorReducer),

    StoreDevtoolsModule.instrument({
      name: "NgRx Demo App",
      logOnly: environment.production,
    }),
    TableModule,
    EffectsModule.forFeature([RolesEffect]),
    MatButtonModule,
    MatProgressBarModule,
  ],
  providers: [],
  exports: [RolesComponent, TableModule, MatProgressBarModule],
})
export class RolesModule {}
