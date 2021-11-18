import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "jhi-formly-field-price",
  template: `
    <input
      class="form-control"
      type="text"
      [formControl]="formControl"
      [formlyAttributes]="field"
      mask="separator"
      thousandSeparator="."
    />
  `,
})
export class PriceTypeComponent extends FieldType {
  defaultOptions = {
    wrappers: ["form-group"],
  };
  constructor() {
    super();
  }
}
