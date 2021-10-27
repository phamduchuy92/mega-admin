import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
// + HttpClient
import { HttpClient } from "@angular/common/http";
import { filter, map } from "rxjs/operators";
import * as _ from "lodash";
import { SafePipe } from "../util/safe.pipe";
import { SERVER_API_URL } from "app//app.constants";

@Component({
  selector: "jhi-formly-file-upload",
  template: `
    <input
      type="file"
      (change)="addFile($event)"
      class="custom-input"
      [disabled]="to.disabled"
      [hidden]="to.hidden == true ? true : false"
    />
    <a
      [href]="getFileSrc()"
      [class]="to.className"
      target="_blank"
      *ngIf="to.hidden == true"
      [innerHTML]="formControl.value"
    ></a>
    <div
      class="file-viewer"
      *ngIf="to.template"
      [innerHtml]="getTemplate()"
    ></div>
    <div
      class="card-deck"
      *ngIf="!to.template && formControl.value && to.hidden != true"
      style="margin-bottom: 5px"
    >
      <div class="card">
        <button
          type="button"
          (click)="removeFile()"
          class="btn btn-danger btn-block"
          [disabled]="to.disabled"
          [hidden]="to.hidden == true ? true : false"
        >
          <fa-icon icon="times"></fa-icon>&nbsp; Remove
        </button>
        <a
          [href]="getFileSrc()"
          [class]="to.className"
          target="_blank"
          *ngIf="!isImage(formControl.value)"
          >{{ formControl.value }}</a
        >
        <a
          [href]="getFileSrc()"
          [class]="to.className"
          target="_blank"
          *ngIf="isImage(formControl.value)"
          ><img [src]="getFileSrc()" [class]="to.className"
        /></a>
      </div>
    </div>
  `,
  providers: [SafePipe],
})
export class FileUploadTypeComponent extends FieldType {
  fileToUpload: any;
  defaultOptions = {
    wrappers: ["form-group"],
  };
  constructor(private pipe: SafePipe, private httpClient: HttpClient) {
    super();
  }

  // API Endpoint for Retrieve File
  getFileSrc(): string {
    return _.isFunction(this.to.getFileSrc)
      ? this.to.getFileSrc()
      : this.to.fileSrc
      ? this.to.fileSrc.replace("${fileId}", this.formControl.value)
      : SERVER_API_URL +
        _.get(this.to, "apiEndpoint", "api/public/upload") +
        `/${this.formControl.value}`;
  }

  removeFile(): void {
    this.httpClient
      .delete(
        SERVER_API_URL +
          _.get(this.to, "apiEndpoint", "api/upload") +
          `/${this.formControl.value}`
      )
      .subscribe(
        () => this.formControl.setValue(null),
        () => this.formControl.setValue(null)
      );
  }

  // Upload a file to server, return the URL
  addFile(event: any): void {
    if (
      this.to.allowedExt &&
      !this.validateExtension(event.target.value, this.to.allowedExt)
    ) {
      alert("Invalid file extension.");
      return;
    }
    this.fileToUpload = event.target.files.item(0);
    this.uploadFile();
  }

  validateExtension(path: string, ext: any): boolean {
    const extensions = _.isString(ext) ? ext.split(" ") : ext;
    return _.isArray(extensions)
      ? extensions.some((i) => path.endsWith(i))
      : false;
  }

  // API Endpoint for Upload File
  protected uploadFile(): void {
    const formData = new FormData();
    formData.append("file", this.fileToUpload, this.fileToUpload.name);
    this.httpClient
      .post(
        SERVER_API_URL + _.get(this.to, "apiEndpoint", "api/upload"),
        formData,
        { observe: "response" }
      )
      .pipe(
        filter((res) => res.ok),
        map((res) => res.body),
        map((res) => this.postProcess(res))
      )
      .subscribe((res) => this.formControl.setValue(res));
  }
  getTemplate(): any {
    return this.pipe.transform(
      this.to.template.replace("${fileId}", this.formControl.value)
    );
  }

  // postProcess extract the file ID from the key
  postProcess(fileInfo: any): string {
    if (_.isString(fileInfo)) {
      return fileInfo;
    }
    if (
      this.to.key &&
      _.isString(this.to.key) &&
      _.isString(fileInfo[this.to.key])
    ) {
      return fileInfo[this.to.key];
    }
    if (this.to.map) {
      if (_.isString(this.to.map)) {
        return _.template(this.to.map)(fileInfo);
      } else if (_.isFunction(this.to.map)) {
        return this.to.map(fileInfo);
      }
    }
    return "";
  }

  isImage(val: string): boolean {
    return val.match(/(.jpg|.jpeg|.gif|.png)$/) ? true : false;
  }
}
