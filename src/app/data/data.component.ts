import { Component, OnInit } from "@angular/core";
import { HttpResponse, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ITEMS_PER_PAGE } from "app/config/pagination.constants";

import { DataService } from "app/misc/model/data.service";
import { DataDeleteDialogComponent } from "./data-delete-dialog.component";

import * as _ from "lodash";
import * as jsyaml from "js-yaml";
import { Title } from "@angular/platform-browser";
import { DeviceDetectorService } from "ngx-device-detector";
import { FormGroup } from "@angular/forms";
import { map } from "rxjs/operators";
import { FormlyFormOptions } from "@ngx-formly/core";
import * as moment from "moment";

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
  img = "";
  title: any = {};
  // table
  columns: any[] = [];
  rows: any[] | null = [];
  properties: any[] = [];
  // pagination
  isLoading = false;
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
    protected dataService: DataService,
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
          console.log("activatedRoute data", data);
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
          this.img = _.get(data.config, "config.img", undefined);
          this.title = _.get(
            data.config,
            "config.title",
            "app.title." + this.property
          );
          this.titleService.setTitle(this.title.index);
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
    this.isLoading = true;
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
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        () => (this.isLoading = false)
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
    const uri = window.location.pathname;
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

  renderCell(row: any, property: any): any {
    const content = _.get(this.columnsMap, [property, "template"])
      ? _.template(_.get(this.columnsMap, [property, "template"]))(row)
      : _.get(row, property, "");
    if (_.isArray(content)) {
      return _.map(content, (e) => _.get(this.reference, [property, e], e));
    } else if (_.isPlainObject(content)) {
      return jsyaml.dump(
        _.forEach(content, (v, k) =>
          _.get(this.reference, [property, v])
            ? _.set(content, k, _.get(this.reference, [property, v]))
            : _.set(content, k, v)
        )
      );
    } else if (_.isDate(content)) {
      return moment(content).format("YYYY/MM/DD HH:mm:ss [Z]");
    }
    return _.get(this.reference, [property, content], content);
  }

  private handleNavigation(): void {
    combineLatest([
      this.activatedRoute.data,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params]) => {
      const page = params.get("page");
      this.page = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      this.predicate = sort[0];
      this.ascending = sort[1] === 'asc';
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
        .subscribe((referenceData) =>
          _.forEach(referenceData.body, (e) =>
            _.set(
              this.reference,
              [key, _.get(e, options.key)],
              _.get(e, options.val)
            )
          )
        );
    });
  }
}
