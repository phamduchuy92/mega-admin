import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import { AlertService } from "app/core/util/alert.service";
import { EntityService } from "app/misc/model/entity.service";

@Component({
  templateUrl: "./data-delete-dialog.component.html",
})
export class DataDeleteDialogComponent {
  _ = _;
  model: any;
  apiEndpoint!: string;

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
        this.alertService.success("Success");
      },
      () => this.alertService.error("Failure")
    );
  }
}
