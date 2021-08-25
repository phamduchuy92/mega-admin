import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'jhi-fromly-wrapper',
  template: `
    <div class="form-group" [class.has-error]="showError">
      <label [attr.for]="id">
        <span [innerHTML]="to.label"></span>
        <span *ngIf="to.required">*</span>
      </label>
      <ng-template #fieldComponent></ng-template>
      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <small *ngIf="to.description" class="form-text text-muted">{{ to.description }}</small>
    </div>
  `,
})
export class FormlyWrapperComponent extends FieldWrapper {}
