import { Component, ElementRef, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from 'app/app.constants';
import * as _ from 'lodash';
import { SafePipe } from 'app/misc/util/safe.pipe';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'jhi-formly-field-file-upload',
  template: `
    <input #inputFile type="file" (change)="addFile($event)" class="custom-input" />
    <div class="file-viewer" *ngIf="to.template" [innerHTML]="getTemplate()"></div>
    <div class="card-deck" *ngIf="!to.template && formControl.value">
      <div class="card">
        <button type="button" (click)="removeFile()" class="btn btn-danger btn-sm">
          <fa-icon icon="times"></fa-icon>
          Remove
        </button>
      </div>
    </div>
  `,
  providers: [SafePipe],
})
export class FileUploadTypeComponent extends FieldType {
  @ViewChild('inputFile') inputFile!: ElementRef;
  fileToUpload: any;

  constructor(private pipe: SafePipe, private httpClient: HttpClient) {
    super();
  }

  // API Endpoint for Retrieve File
  getFileSrc(): string {
    return this.to.fileSrc
      ? _.toString(this.to.fileSrc).replace('${fileId}', this.formControl.value)
      : SERVER_API_URL + _.toString(_.get(this.to, 'apiEndpoint', 'api/upload')) + `/${_.toString(this.formControl.value)}`;
  }

  removeFile(): void {
    this.httpClient
      .delete(SERVER_API_URL + _.toString(_.get(this.to, 'apiEndpoint', 'api/upload')) + `/${_.toString(this.formControl.value)}`)
      .subscribe(
        () => this.formControl.reset(),
        () => this.formControl.reset()
      );
    this.inputFile.nativeElement.value = null;
  }

  // Upload a file to server, return the URL
  addFile(event: any): void {
    if (event.target.value && this.to.allowedExt && !this.validateExtension(event.target.value, this.to.allowedExt)) {
      alert('Invalid file extension.');
      return;
    }
    this.fileToUpload = event.target.files.item(0);
    this.uploadFile();
  }

  validateExtension(path: string, ext: any): boolean {
    const extensions = _.isString(ext) ? ext.split(' ') : ext;
    return _.isArray(extensions) ? extensions.some(i => path.endsWith(i)) : false;
  }

  // API Endpoint for Upload File
  uploadFile(): void {
    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.httpClient
      .post(SERVER_API_URL + _.toString(_.get(this.to, 'apiEndpoint', 'api/upload')), formData, { observe: 'response' })
      .pipe(
        filter(res => res.ok),
        map(res => res.body),
        map(res => this.postProcess(res))
      )
      .subscribe(res => {
        this.formControl.setValue(res);
      });
  }

  getTemplate(): any {
    return this.to.template.replace("${fileId}", this.formControl.value);
  }

  // postProcess extract the file ID from the key
  postProcess(fileInfo: any): string {
    if (_.isString(fileInfo)) {
      return fileInfo;
    }
    if (this.to.key && _.isString(this.to.key) && _.isString(fileInfo[this.to.key])) {
      return fileInfo[this.to.key];
    }
    if (this.to.map) {
      if (_.isString(this.to.map)) {
        return _.template(this.to.map)(fileInfo);
      } else if (_.isFunction(this.to.map)) {
        return this.to.map(fileInfo);
      }
    }
    return '';
  }
}
