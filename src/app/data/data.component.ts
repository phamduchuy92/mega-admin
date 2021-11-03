import { Component, OnInit } from "@angular/core";
import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ITEMS_PER_PAGE } from "app//config/pagination.constants";

import { EntityService } from "app//misc/model/entity.service";
import { DataDeleteDialogComponent } from "./data-delete-dialog.component";

import * as _ from "lodash";
import * as jsyaml from "js-yaml";
import { Title } from "@angular/platform-browser";
import { DeviceDetectorService } from "ngx-device-detector";
import { FormGroup } from "@angular/forms";
import { map } from "rxjs/operators";
import { FormlyFormOptions } from "@ngx-formly/core";
import { plainToFlattenObject } from "app//misc/util/request-util";

@Component({
  selector: "jhi-data-list",
  templateUrl: "./data.component.html",
})
export class DataComponent implements OnInit {
  _ = _;
  // detect mobile
  isMobile = false;
  // config
  service = "";
  property = "";
  apiEndpoint = "";
  queryParams: any = {};
  title: any = {};
  // table
  columns: any[] = [];
  rows: any[] | null = [];
  properties: any[] = [];
  // pagination
  isReady = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 1;
  predicate = "";
  ascending = true;
  // search
  searchModel: any = {};
  searchParams: any = {};
  // reference
  columnsMap: any = {};
  reference: any = {};
  referenceEndpoint: any = {};
  itemsEndpoint: any = {};
  // search engine
  searchEngine: any = {};
  searchEngineModel: any = {};
  // formly
  form: FormGroup = new FormGroup({});
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };

  constructor(
    protected titleService: Title,
    protected detectorService: DeviceDetectorService,
    protected dataService: EntityService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {
    this.isMobile = this.detectorService.isMobile();
  }

  ngOnInit(): void {
    combineLatest(
      this.activatedRoute.data.pipe(
        map((data) => {
          // sort
          this.ascending = _.get(
            data.config,
            "config.ascending",
            _.get(data, "pagingParams.ascending")
          );
          this.predicate = _.get(
            data.config,
            "config.predicate",
            _.get(data, "pagingParams.predicate")
          );
          // verify service
          this.service = _.get(
            data.config,
            "config.service",
            _.get(data, "config.service")
          );
          this.property = _.get(
            data.config,
            "config.property",
            _.get(data, "config.property")
          );
          // title
          this.title = _.get(
            data.config,
            "config.title.index",
            "app.title." + this.property
          );
          this.titleService.setTitle(this.title);
          // apiEndpoint and queryParams
          this.apiEndpoint = _.get(
            data.config,
            "config.apiEndpoint",
            _.get(data, "config.apiEndpoint")
          );
          this.queryParams = _.get(data.config, "config.queryParams", {});
          this.searchEngine = _.get(data.config, "config.searchEngine", {});
          // table
          this.columns = _.map(_.get(data.config, "config.columns"), (v) =>
            _.isString(v)
              ? {
                  property: v,
                  label: v,
                  sortBy: v,
                  searchBy: v,
                  pattern: "contains(${ term })",
                  jhiTranslate: v,
                }
              : v
          );
          // calculate search params
          this.searchParams = _.mapValues(
            _.keyBy(
              _.filter(this.columns, (o) => !o.options),
              "searchBy"
            ),
            (e) => e.pattern || "contains(${ term })"
          );
          this.properties = _.map(this.columns, "property");
          this.columnsMap = _.keyBy(this.columns, "property");
          // calculate reference based on options
          _.forEach(
            _.filter(this.columns, (e) => e.options),
            (e) =>
              _.forEach(e.options, (o) =>
                _.set(this.reference, [e.property, o.value], o.label)
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
        })
      ),
      // keep search model when navigation
      this.activatedRoute.queryParams.pipe(
        map(
          (params) =>
            (this.searchModel = _.omit(params, ["page", "size", "sort"]))
        )
      )
    ).subscribe(() => this.handleNavigation());
  }

  trackId(index: number, item: any): string {
    return item.id;
  }

  delete(data: any, apiEndpoint: string, title: string): void {
    const modalRef = this.modalService.open(DataDeleteDialogComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.model = data;
    modalRef.componentInstance.apiEndpoint = apiEndpoint;
    modalRef.componentInstance.title = title;
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }

  // load data with search model and query params in config
  loadAll(): void {
    this.dataService
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
          _.pickBy(
            _.mapValues(this.searchParams, (pattern, field) =>
              this.searchModel[field]
                ? _.template(pattern)({ term: this.searchModel[field] })
                : null
            ),
            _.identity
          )
        ),
        this.apiEndpoint
      )
      .subscribe(
        (res: HttpResponse<any[]>) => {
          this.isReady = true;
          this.onSuccess(res.body, res.headers);
        },
        () => (this.isReady = false)
      );
  }

  // add search model and query params when navigating other page
  transition(): void {
    this.router.navigate([], {
      queryParams: _.assign(
        {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + "," + (this.ascending ? "asc" : "desc"),
        },
        this.searchModel
      ),
    });
  }

  clear(): void {
    this.page = 1;
    this.searchModel = {};
    const uri = `/data/${this.service}/${this.property}`;
    this.router.navigateByUrl("/").then(() =>
      this.router.navigate([uri], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + "," + (this.ascending ? "asc" : "desc"),
        },
      })
    );
  }

  renderCell(row: any, col: string): any {
    // {{ _.get(reference, [c, _.get(val, c)], _.get(val, c)) }}
    let val;
    if (this.columnsMap[col].template) {
      try {
        val = _.template(this.columnsMap[col].template)(row);
      } catch (e) {
        val = _.get(row, col);
      }
    } else {
      val = _.get(row, col);
    }
    if (_.isArray(val)) {
      return _.map(val, (v) => _.get(this.reference, [col, v], v));
    } else if (_.isPlainObject(val)) {
      // support for tree type
      if (
        _.map(plainToFlattenObject(val)).every((e) => typeof e == "boolean")
      ) {
        const parsedVal = _.filter(_.entries(plainToFlattenObject(val)), (e) =>
          e.some((o) => o == true)
        );
        let res = {};
        _.forEach(parsedVal, (v, k) => _.assign(res, _.set(res, v[0], "tree")));
        return `<pre>${jsyaml.dump(res).replaceAll(": tree", "")}</pre>`;
      }
      return `<pre>${jsyaml.dump(val)}</pre>`;
    }
    return _.get(this.reference, [col, val], val);
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

  private onSuccess(data: any[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get("X-Total-Count"));
    this.rows = data;
    this.loadReferenceEndpoint();
  }

  // load reference based on apiEndpoint
  private loadReferenceEndpoint(): void {
    _.forEach(this.referenceEndpoint, (options, key) => {
      const value = _.uniq(
        _.flatMap(
          _.map(this.rows, (e) => _.get(e, key)).filter((o) => !_.isEmpty(o)),
          (values) => (_.isArray(values) ? _.values(values) : values)
        )
      );
      const req = _.get(options, "params", {});
      _.set(req, options.key, value);
      this.dataService
        .query(req, options.apiEndpoint)
        .subscribe((referenceData) => {
          this.itemsEndpoint[key] = [];
          _.forEach(referenceData.body, (e) => {
            _.set(
              this.reference,
              [key, _.get(e, options.key)],
              _.get(e, options.val)
            );
            this.itemsEndpoint[key].push(_.pick(e, [options.key, options.val]));
          });
        });
    });
  }
}
