import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import * as _ from "lodash";
import { FormGroup } from "@angular/forms";
import { filter, map } from "rxjs/operators";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import * as jsyaml from "js-yaml";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
})
export class ProductDetailComponent implements OnInit, AfterContentChecked {
  _ = _;
  // + state
  isLoading = false;
  // + formly
  form: FormGroup = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  // + config
  config: any = {};
  // + title
  title = "";

  constructor(
    private activatedRoute: ActivatedRoute,
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
          this.title = _.template(_.get(this.config, "title.view", title))(
            this.model
          );
          // formly
          this.fields = _.get(this.config, "fields", []);
        })
      )
      .subscribe(() => (this.isLoading = false));
  }

  ngAfterContentChecked(): void {
    this.form.disable({ emitEvent: false });
  }

  previousState(): void {
    window.history.back();
  }
}
