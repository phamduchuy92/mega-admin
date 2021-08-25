import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { Authority } from "./config/authority.constants";
import { LoginComponent } from "./login/login.component";
import { UserRouteAccessService } from "./core/auth/user-route-access.service";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/admin-layout/admin-layout.module#AdminLayoutModule",
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
    children: [
      {
        path: "",
        loadChildren:
          "./login/login.module#LoginModule",
      },
    ],
  },
  {
    path: "user-management",
    component: AdminLayoutComponent,
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    children: [
      {
        path: "",
        loadChildren:
          "./user-management/user-management.module#UserManagementModule",
      },
    ],
  },
  {
    path: "ecommerce",
    component: AdminLayoutComponent,
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    children: [
      {
        path: "",
        loadChildren:
          "./ecommerce/ecommerce.module#EcommerceModule",
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
