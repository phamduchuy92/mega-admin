import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import * as _ from "lodash";
import { Title } from "@angular/platform-browser";
import { FormGroup } from "@angular/forms";
import { map, tap } from "rxjs/operators";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";

@Component({
  selector: "jhi-data-detail",
  templateUrl: "./data-detail.component.html",
})
export class DataDetailComponent implements OnInit {
  _ = _;
  // state
  isReady = false;
  // config
  service = "";
  property = "";
  title: any = {};
  // formly
  form: FormGroup = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title
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
          // title
          this.title = _.template(
            _.get(config, "config.title.view", "View Data")
          )(this.model);
          this.titleService.setTitle(this.title);
          // formly
          this.fields = _.get(config, "config.fields", []);
        }),
        tap(() => {
          this.fields.push({
            hooks: {
              afterContentInit: () => this.form.disable({ emitEvent: false }),
            },
          });
        })
      )
      .subscribe(
        () => (this.isReady = true),
        () => (this.isReady = false)
      );
  }

  previousState(): void {
    window.history.back();
  }
}
