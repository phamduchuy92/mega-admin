import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DataComponent } from "./data.component";
import { DataDetailComponent } from "./data-detail.component";
import { DataUpdateComponent } from "./data-update.component";
import { DataDeleteDialogComponent } from "./data-delete-dialog.component";
import { DATA_ROUTES } from "./data.route";
import { MiscModule } from "app//misc/misc.module";

@NgModule({
  imports: [MiscModule, RouterModule.forChild(DATA_ROUTES)],
  declarations: [
    DataComponent,
    DataDetailComponent,
    DataUpdateComponent,
    DataDeleteDialogComponent,
  ],
  entryComponents: [DataComponent],
})
export class DataModule {}
