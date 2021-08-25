import { Routes } from "@angular/router";
import { OrderComponent } from "./order/order.component";
import { ProductComponent } from "./product/list/product.component";

export const ecommerceRoutes: Routes = [
  {
    path: "products",
    children: [
      {
        path: "",
        loadChildren: "./product/product.module#ProductModule",
      },
    ],
  },
  { path: "orders", component: OrderComponent },
];
