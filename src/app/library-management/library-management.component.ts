import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import * as _ from "lodash";
import { forkJoin } from "rxjs";
import { FileSaverService } from "ngx-filesaver";
import { ResponseContentType } from "@angular/http";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: "app-library-management",
  templateUrl: "./library-management.component.html",
  styleUrls: ["./library-management.component.scss"],
})
export class LibraryManagementComponent implements OnInit {
  @ViewChild("confirmModal", { static: true }) confirmModal: NgbModalRef;
  @ViewChild("uploadModal", { static: true }) uploadModal: NgbModalRef;
  assets: any[] = [];
  statics: any[] = [];
  bucketName = "";
  isLoading = false;
  totalItems = 0;
  itemsPerPage = 8;
  page = 1;
  _ = _;
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      key: "upload",
      type: "file-upload",
      templateOptions: {
        apiEndpoint: "services/storage-mgmt/api/file-upload",
        key: "Key",
        fileSrc: "services/storage-mgmt/api/statics/${fileName}",
        multiple: true,
      },
    },
  ];

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private fileSaverService: FileSaverService,
    private modalService: NgbModal
  ) {
    const id =
      this.localStorageService.retrieve("id") ??
      this.sessionStorageService.retrieve("id") ??
      "";
    const login =
      this.localStorageService.retrieve("login") ??
      this.sessionStorageService.retrieve("login") ??
      "";
    this.bucketName = `${login}-${id}`;
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.httpClient
      .get<any>(`services/storage-mgmt/api/file-list/${this.bucketName}`, {
        observe: "response",
      })
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
          this.transition();
        },
        () => (this.isLoading = false)
      );
  }

  transition(): void {
    this.statics = this.assets.slice(
      (this.page - 1) * this.itemsPerPage,
      this.page * this.itemsPerPage
    );
  }

  getFileSrc(val: string): string {
    return `${window.location.origin}/services/storage-mgmt/api/statics/${this.bucketName}/${val}`;
  }

  isImage(val: string): boolean {
    return val.match(/(.jpg|.jpeg|.gif|.png)$/) ? true : false;
  }

  download(val: string): void {
    this.httpClient
      .get(
        SERVER_API_URL +
          `services/storage-mgmt/api/statics/${this.bucketName}/${val}`,
        { responseType: "blob" }
      )
      .subscribe((res) => {
        this.fileSaverService.save(res, val);
      });
  }

  remove(): void {
    this.modalService.open(this.confirmModal).result.then(
      () => {
        let actions$ = [];
        _.forEach(this.assets, (e) => {
          if (e.checked) {
            actions$.push(
              this.httpClient.delete(
                `services/storage-mgmt/api/file-upload/${this.bucketName}/${e.name}`
              )
            );
          }
        });
        forkJoin(actions$).subscribe(() => {
          this.page = 1;
          this.loadAll();
        });
      },
      () => {
        this.modalService.dismissAll();
      }
    );
  }

  upload(): void {
    this.modalService.open(this.uploadModal, { size: "xl" }).result.then(
      () => this.loadAll(),
      () => this.modalService.dismissAll()
    );
  }

  private onSuccess(assets: any[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get("X-Total-Count"));
    this.assets = _.map(assets, (e) => _.assign(e, { checked: false }));
  }
}
