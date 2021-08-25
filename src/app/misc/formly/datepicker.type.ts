import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'jhi-formly-datepicker',
  template: `
    <div class="input-group">
      <input
        class="form-control"
        placeholder="yyyy-mm-dd"
        name="dp"
        [(ngModel)]="model"
        ngbDatepicker
        #d="ngbDatepicker"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <div class="input-group-append">
        <button class="btn btn-outline-secondary calendar" (click)="d.toggle()" type="button"></button>
      </div>
    </div>
  `,
})
export class DateTypeComponent extends FieldType {
  formControl!: FormControl;
}
