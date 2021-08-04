import { NgModule } from '@angular/core';
// shared module
import { SharedModule } from '../shared/shared.module';
// material stepper
import { MatStepperModule } from '@angular/material/stepper';
// material tabs
import { MatTabsModule } from "@angular/material/tabs";
// ngx-quill
// ngx-formly
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
// ngx-formly fields
import { ButtonTypeComponent } from './formly/button.type';
import { TimeTypeComponent } from './formly/timepicker.type';
import { DateTypeComponent } from './formly/datepicker.type';
import { RepeatTypeComponent } from './formly/repeat-section.type';
import { TabsTypeComponent } from './formly/tabs.type';
import { CardTypeComponent } from './formly/card.type';
import { AccordionTypeComponent } from './formly/accordion.type';
import { FileUploadTypeComponent } from './formly/file-upload.type';
import { FileValueAccessorDirective } from './formly/file-value-accessor';
import { TemplateTypeComponent } from './formly/template.type';
import { FormlyValidators } from './formly/validators';
// wrappers
import { FormlyWrapperComponent } from './formly/formly.wrapper';
// utils
import { SafePipe } from './util/safe.pipe';
import { StepperTypeComponent } from './formly/stepper.type';

@NgModule({
  imports: [
    // shared module,
    SharedModule,
    // material stepper
    MatStepperModule,
    // material tabs
    MatTabsModule,
    // ngx-formly
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      validators: [{ name: 'ip', validation: FormlyValidators.IpValidator }],
      validationMessages: [
        { name: 'required', message: 'This field is required.' },
        { name: 'minlength', message: FormlyValidators.minlengthValidationMessage },
        { name: 'maxlength', message: FormlyValidators.maxlengthValidationMessage },
        { name: 'min', message: FormlyValidators.minValidationMessage },
        { name: 'max', message: FormlyValidators.maxValidationMessage },
        { name: 'ip', message: FormlyValidators.IpValidatorMessage },
      ],
      wrappers: [{ name: 'wrapper', component: FormlyWrapperComponent }],
      types: [
        { name: 'template', component: TemplateTypeComponent },
        { name: 'button', component: ButtonTypeComponent },
        { name: 'time', component: TimeTypeComponent },
        { name: 'date', component: DateTypeComponent },
        { name: 'card', component: CardTypeComponent },
        { name: 'accordion', component: AccordionTypeComponent },
        { name: 'tabs', component: TabsTypeComponent },
        { name: 'file-upload', component: FileUploadTypeComponent },
        { name: 'repeat', component: RepeatTypeComponent },
        { name: 'stepper', component: StepperTypeComponent},
      ],
    }),
  ],
  exports: [SharedModule, FileValueAccessorDirective, ReactiveFormsModule, FormlyModule, FormlyMaterialModule],
  declarations: [
    SafePipe,
    // ngx-formly
    TemplateTypeComponent,
    ButtonTypeComponent,
    TimeTypeComponent,
    DateTypeComponent,
    CardTypeComponent,
    RepeatTypeComponent,
    FileValueAccessorDirective,
    AccordionTypeComponent,
    FileUploadTypeComponent,
    TabsTypeComponent,
    StepperTypeComponent,
    FormlyWrapperComponent,
  ],
  providers: [SafePipe],
})
export class CommonModule {}
