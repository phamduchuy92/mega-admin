import { Component, SystemJsNgModuleLoaderConfig } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import { AlertService } from "app/core/util/alert.service";
import { EntityService } from "app/misc/model/entity.service";

@Component({
  templateUrl: "./product-delete-dialog.component.html",
})
export class ProductDeleteDialogComponent {
  _ = _;
  model!: any;
  apiEndpoint!: string;
  title!: string;
  successMsg!: string;
  errorMsg!: string;

  constructor(
    private entityService: EntityService,
    private activeModal: NgbActiveModal,
    private alertService: AlertService
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number, apiEndpoint: string): void {
    this.entityService.delete(id, apiEndpoint).subscribe(
      () => {
        this.activeModal.close();
        this.alertService.success(this.successMsg);
      },
      () => this.alertService.error(this.errorMsg)
    );
  }
}
