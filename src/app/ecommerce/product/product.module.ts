import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ProductComponent } from "./list/product.component";
import { ProductDetailComponent } from "./detail/product-detail.component";
import { ProductUpdateComponent } from "./update/product-update.component";
import { ProductDeleteDialogComponent } from "./delete/product-delete-dialog.component";
import { productRoutes } from "./product.route";
import { MiscModule } from "app/misc/misc.module";

@NgModule({
  imports: [MiscModule, RouterModule.forChild(productRoutes)],
  declarations: [
    ProductComponent,
    ProductDetailComponent,
    ProductUpdateComponent,
    ProductDeleteDialogComponent,
  ],
  entryComponents: [ProductDeleteDialogComponent],
})
export class ProductModule {}
