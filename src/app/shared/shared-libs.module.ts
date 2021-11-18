import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
// new
import { ClipboardModule } from "ngx-clipboard";
import { FileSaverModule } from "ngx-filesaver";
import { ToastrModule } from "ngx-toastr";

@NgModule({
  exports: [
    FormsModule,
    CommonModule,
    NgbModule,
    InfiniteScrollModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule,
    // ngx-clipboard
    ClipboardModule,
    // ngx-toastr
    ToastrModule,
    // ngx-filesaver
    FileSaverModule,
  ],
})
export class SharedLibsModule {}
