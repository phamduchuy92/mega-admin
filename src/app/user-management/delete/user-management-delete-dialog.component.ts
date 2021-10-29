import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../user-management.model';
import { UserManagementService } from '../service/user-management.service';

@Component({
  selector: 'jhi-user-mgmt-delete-dialog',
  templateUrl: './user-management-delete-dialog.component.html',
})
export class UserManagementDeleteDialogComponent {
  user?: User;

  constructor(private userService: UserManagementService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
