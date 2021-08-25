import { NgModule } from "@angular/core";
import { MiscModule } from "app/misc/misc.module";
import { OrderComponent } from "./order/order.component";
import { ecommerceRoutes } from "./ecommerce.routing";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [MiscModule, RouterModule.forChild(ecommerceRoutes)],
  declarations: [OrderComponent],
})
export class EcommerceModule {}
