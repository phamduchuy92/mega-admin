import { Component, OnInit } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

import { EntityService } from "app//misc/model/entity.service";
import * as _ from "lodash";
import { Title } from "@angular/platform-browser";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { AlertService } from "app//core/util/alert.service";

@Component({
  selector: "jhi-data-update",
  templateUrl: "./data-update.component.html",
})
export class DataUpdateComponent implements OnInit {
  _ = _;
  // state
  isReady = false;
  isSaving = false;
  // config
  service = "";
  property = "";
  apiEndpoint = "";
  title: any = {};
  // formly
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };

  constructor(
    private dataService: EntityService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        map(({ config, model }) => {
          // get model
          this.model = model;
          // verify service
          this.service = _.get(config, "config.service", config.service);
          this.property = _.get(config, "config.property", config.property);
          // apiEndpoint
          this.apiEndpoint = _.get(
            config,
            "config.apiEndpoint",
            config.apiEndpoint
          );
          // title
          this.title = _.template(
            _.get(
              config,
              this.model.id || this.model._id
                ? "config.title.update"
                : "config.title.create",
              "Create or Update Data"
            )
          )(this.model);
          this.titleService.setTitle(this.title);
          // formly
          this.fields = _.get(config, "config.fields", []);
        })
      )
      .subscribe(() => (this.isReady = true), () => (this.isReady = false));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    if (this.model.id !== undefined || this.model._id !== undefined) {
      this.dataService.update(this.model, this.apiEndpoint).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    } else {
      this.dataService.create(this.model, this.apiEndpoint).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    }
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving = false;
  }
}
