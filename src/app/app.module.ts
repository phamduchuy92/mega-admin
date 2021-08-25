import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";

import { AppComponent } from "./app.component";

import { AgmCoreModule } from "@agm/core";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// + ngx-translate
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
  MissingTranslationHandler,
} from "@ngx-translate/core";
import {
  translatePartialLoader,
  missingTranslationHandler,
} from "./config/translation.config";
import { registerLocaleData } from "@angular/common";
import locale from "@angular/common/locales/en";
// + ngx-formly
import { FormlyModule } from "@ngx-formly/core";
import { FormlyMaterialModule } from "@ngx-formly/material";
// + ngx-webstorage
import { NgxWebstorageModule } from "ngx-webstorage";
// + misc
import { MiscModule } from "./misc/misc.module";
// + dependencies from jhipter
import { ApplicationConfigService } from "./core/config/application-config.service";
import { SERVER_API_URL } from "./app.constants";
// + interceptor
import { httpInterceptorProviders } from "app/core/interceptor/index";
// + get all free icons in pack fortawesome
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fontAwesomeIcons } from "./config/font-awesome-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    }),
    // + ng-boostrap
    NgbModule,
    // + ngx-translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
      },
    }),
    // + ngx-webstorage
    NgxWebstorageModule.forRoot({
      prefix: "jhi",
      separator: "-",
      caseSensitive: true,
    }),
    // + misc
    MiscModule,
  ],
  declarations: [AppComponent, AdminLayoutComponent],
  providers: [{ provide: LOCALE_ID, useValue: "en" }, httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    applicationConfigService: ApplicationConfigService,
    iconLibrary: FaIconLibrary,
    translateService: TranslateService
  ) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    // get all icons in pack
    iconLibrary.addIconPacks(fas);
    iconLibrary.addIconPacks(fab);
    iconLibrary.addIconPacks(far);
    translateService.setDefaultLang("vi");
    translateService.use("vi");
  }
}
