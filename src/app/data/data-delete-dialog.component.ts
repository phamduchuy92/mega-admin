import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import { EntityService } from "app//misc/model/entity.service";

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
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number, apiEndpoint: string): void {
    this.entityService.delete(id, apiEndpoint).subscribe(() => {
      this.activeModal.close();
    });
  }
}
