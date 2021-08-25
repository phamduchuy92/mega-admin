import { Component, OnInit } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ActivatedRoute } from "@angular/router";
import { filter, map } from "rxjs/operators";

import * as _ from "lodash";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { AlertService } from "app/core/util/alert.service";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { EntityService } from "app/misc/model/entity.service";
import * as jsyaml from "js-yaml";
@Component({
  selector: "app-product-update",
  templateUrl: "./product-update.component.html",
})
export class ProductUpdateComponent implements OnInit {
  _ = _;
  // + state
  isLoading = false;
  isSaving = false;
  // + formly
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  // + config
  config: any = {};
  apiEndpoint = "";
  // + title
  title = "";

  constructor(
    private entityService: EntityService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private applicationConfigService: ApplicationConfigService
  ) {
    this.applicationConfigService
      .getConfigFor("product-mgmt")
      .pipe(
        filter((res) => res.ok),
        map((content) => jsyaml.load(content.body ?? ""))
      )
      .subscribe((config) => (this.config = config));
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.data
      .pipe(
        map(({ product, title }) => {
          // get model
          this.model = product;
          // title
          this.title = _.template(
            _.get(
              this.config,
              this.model.id || this.model._id ? "title.update" : "title.create",
              title
            )
          )(this.model);
          // formly
          this.fields = _.get(this.config, "fields", []);
          this.apiEndpoint = _.get(this.config, "apiEndpoint", "");
        })
      )
      .subscribe(() => (this.isLoading = false));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    if (this.model.id !== undefined || this.model._id !== undefined) {
      this.entityService.update(this.model, this.apiEndpoint).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    } else {
      this.entityService.create(this.model, this.apiEndpoint).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    }
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
    this.alertService.success("Success");
  }

  private onSaveError(): void {
    this.isSaving = false;
    this.alertService.error("Failure");
  }
}
