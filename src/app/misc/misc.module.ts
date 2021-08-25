import { NgModule } from "@angular/core";
// shared module
import { SharedModule } from "../shared/shared.module";
// material
import { A11yModule } from "@angular/cdk/a11y";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { OverlayModule } from "@angular/cdk/overlay";
// ngx-quill
// ngx-formly
import { ReactiveFormsModule } from "@angular/forms";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyMaterialModule } from "@ngx-formly/material";
// ngx-formly fields
import { ButtonTypeComponent } from "./formly/button.type";
import { TimeTypeComponent } from "./formly/timepicker.type";
import { DateTypeComponent } from "./formly/datepicker.type";
import { RepeatTypeComponent } from "./formly/repeat-section.type";
import { TabsTypeComponent } from "./formly/tabs.type";
import { CardTypeComponent } from "./formly/card.type";
import { AccordionTypeComponent } from "./formly/accordion.type";
import { FileUploadTypeComponent } from "./formly/file-upload.type";
import { FileValueAccessorDirective } from "./formly/file-value-accessor";
import { TemplateTypeComponent } from "./formly/template.type";
import { FormlyValidators } from "./formly/validators";
// wrappers
import { FormlyWrapperComponent } from "./formly/formly.wrapper";
// utils
import { SafePipe } from "./util/safe.pipe";
import { StepperTypeComponent } from "./formly/stepper.type";

@NgModule({
  imports: [
    // + shared module,
    SharedModule,
    // + material
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    // + ngx-formly
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      extras: { lazyRender: true },
      validators: [{ name: "ip", validation: FormlyValidators.IpValidator }],
      validationMessages: [
        { name: "required", message: "This field is required." },
        {
          name: "minlength",
          message: FormlyValidators.minlengthValidationMessage,
        },
        {
          name: "maxlength",
          message: FormlyValidators.maxlengthValidationMessage,
        },
        { name: "min", message: FormlyValidators.minValidationMessage },
        { name: "max", message: FormlyValidators.maxValidationMessage },
        { name: "ip", message: FormlyValidators.IpValidatorMessage },
      ],
      wrappers: [{ name: "wrapper", component: FormlyWrapperComponent }],
      types: [
        { name: "template", component: TemplateTypeComponent },
        { name: "button", component: ButtonTypeComponent },
        { name: "time", component: TimeTypeComponent },
        { name: "date", component: DateTypeComponent },
        { name: "card", component: CardTypeComponent },
        { name: "accordion", component: AccordionTypeComponent },
        { name: "tabs", component: TabsTypeComponent },
        { name: "file-upload", component: FileUploadTypeComponent },
        { name: "repeat", component: RepeatTypeComponent },
        { name: "stepper", component: StepperTypeComponent },
      ],
    }),
  ],
  exports: [
    // + shared module
    SharedModule,
    // + material
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    // + formly
    FormlyModule,
    FormlyMaterialModule,
  ],
  declarations: [
    SafePipe,
    // + ngx-formly type
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
export class MiscModule {}
