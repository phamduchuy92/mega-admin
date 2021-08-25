import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Routes } from "@angular/router";
import { Observable, of } from "rxjs";

import { ProductComponent } from "./list/product.component";
import { ProductDetailComponent } from "./detail/product-detail.component";
import { ProductUpdateComponent } from "./update/product-update.component";
import { EntityService } from "app/misc/model/entity.service";
import { ApplicationConfigService } from "app/core/config/application-config.service";

@Injectable({ providedIn: "root" })
export class ProductResolve implements Resolve<any> {
  public apiEndpoint = this.applicationConfigService.getEndpointFor(
    "api/products",
    "product-mgmt"
  );
  constructor(
    private entityService: EntityService,
    private applicationConfigService: ApplicationConfigService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.params["id"];
    if (id) {
      return this.entityService.find(id, this.apiEndpoint);
    }
    return of({});
  }
}

export const productRoutes: Routes = [
  {
    path: "",
    component: ProductComponent,
    data: {
      defaultSort: "id,asc",
      pageTitle: "",
      authorities: [],
    },
  },
  {
    path: ":id/view",
    component: ProductDetailComponent,
    resolve: {
      product: ProductResolve,
    },
    data: {
      pageTitle: "",
      authorities: [],
    },
  },
  {
    path: "new",
    component: ProductUpdateComponent,
    resolve: {
      product: ProductResolve,
    },
    data: {
      pageTitle: "",
      authorities: [],
    },
  },
  {
    path: ":id/edit",
    component: ProductUpdateComponent,
    resolve: {
      product: ProductResolve,
    },
    data: {
      pageTitle: "",
      authorities: [],
    },
  },
];
