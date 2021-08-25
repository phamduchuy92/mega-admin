import { Component, OnInit } from "@angular/core";
import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { AccountService } from "app/core/auth/account.service";
import { Account } from "app/core/auth/account.model";
import { ProductDeleteDialogComponent } from "../delete/product-delete-dialog.component";
import { EntityService } from "app/misc/model/entity.service";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import * as jsyaml from "js-yaml";
import { filter, map } from "rxjs/operators";
import * as _ from "lodash";
import { FormGroup } from "@angular/forms";
import { FormlyFormOptions } from "@ngx-formly/core";
@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
})
export class ProductComponent implements OnInit {
  _ = _;
  currentAccount: Account | null = null;
  items: any[] | null = null;
  // + state
  isLoading = false;
  isMobile = false;
  // + pagination
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  // + search
  searchModel: any = {};
  searchParams: any = {};
  queryParams: any = {};
  // + reference
  columnsMap: any = {};
  reference: any = {};
  referenceEndpoint: any = {};
  // + search engine
  searchEngine: any = {};
  searchEngineModel: any = {};
  // + formly
  form: FormGroup = new FormGroup({});
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  // + title
  title: any = {};
  // + table
  columns: any[] = [];
  rows: any[] | null = [];
  properties: any[] = [];
  // + config
  config: any = {};
  apiEndpoint: any = {};

  constructor(
    private entityService: EntityService,
    private applicationConfigService: ApplicationConfigService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.applicationConfigService
      .getConfigFor("product-mgmt")
      .pipe(
        filter((res) => res.ok),
        map((content) => jsyaml.load(content.body ?? ""))
      )
      .subscribe((config) => {
        this.config = config;
        this.populateConfig(this.config);
      });
  }

  ngOnInit(): void {
    this.accountService
      .identity()
      .subscribe((account) => (this.currentAccount = account));
    this.handleNavigation();
  }

  trackIdentity(index: number, item: any): string {
    return item.id!;
  }

  delete(item: any): void {
    const modalRef = this.modalService.open(ProductDeleteDialogComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.model = item;
    modalRef.componentInstance.apiEndpoint = this.apiEndpoint;
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.successMsg = "";
    modalRef.componentInstance.errorMsg = "";
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }

  loadAll(): void {
    this.isLoading = true;
    this.entityService
      .query(
        _.assign(
          {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
          },
          this.queryParams,
          !_.isEmpty(this.searchEngine) && !_.isEmpty(this.searchEngineModel)
            ? JSON.parse(
                _.template(this.searchEngine.pattern)(this.searchEngineModel)
              )
            : {},
          _.pickBy(this.searchModel, _.identity),
          _.pickBy(
            _.mapValues(this.searchParams, (pattern, field) =>
              this.searchModel[field]
                ? _.template(pattern)(
                    _.assign(
                      { term: this.searchModel[field] },
                      this.searchModel
                    )
                  )
                : null
            ),
            _.identity
          )
        ),
        this.apiEndpoint
      )
      .subscribe(
        (res: HttpResponse<any[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        () => (this.isLoading = false)
      );
  }

  transition(): void {
    this.router.navigate(["./"], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.predicate + "," + (this.ascending ? "asc" : "desc"),
      },
    });
  }

  populateConfig(config: any): void {
    // + title
    this.title = _.get(config, "title", {});
    // + apiEndpoint and queryParams
    this.apiEndpoint = _.get(config, "apiEndpoint", "");
    this.queryParams = _.get(config, "queryParams", {});
    this.searchEngine = _.get(config, "searchEngine", {});
    // + table
    this.columns = _.get(config, "columns", []);
    // calculate search params
    this.searchParams = _.mapValues(
      _.keyBy(
        _.filter(this.columns, (o) => !o.options),
        "searchBy"
      ),
      (e) => e.pattern || "ci(contains(${ term }))"
    );
    this.properties = _.map(this.columns, "property");
    this.columnsMap = _.keyBy(this.columns, "property");
    // calculate reference based on options
    _.forEach(
      _.filter(this.columns, (e) => e.options),
      (e) =>
        _.forEach(e.options, (o) =>
          _.set(this.reference, [e.key, o.value], o.label)
        )
    );
    // calculate reference based on apiEndpoint
    _.forEach(
      _.filter(this.columns, (e) => e.apiEndpoint),
      (e) =>
        (this.referenceEndpoint[e.property] = _.pick(e, [
          "apiEndpoint",
          "params",
          "key",
          "val",
        ]))
    );
  }
  private handleNavigation(): void {
    combineLatest([
      this.activatedRoute.data,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params]) => {
      const page = params.get("page");
      this.page = page !== null ? +page : 1;
      const sort = (params.get("sort") ?? data["defaultSort"]).split(",");
      this.predicate = sort[0];
      this.ascending = sort[1] === "asc";
      this.loadAll();
    });
  }

  private sort(): string[] {
    const result = [this.predicate + "," + (this.ascending ? "asc" : "desc")];
    if (this.predicate !== "id") {
      result.push("id");
    }
    return result;
  }

  private onSuccess(items: any[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get("X-Total-Count"));
    this.items = items;
  }
}
