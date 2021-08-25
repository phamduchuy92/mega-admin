import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { plainToFlattenObject } from 'app/misc/util/request-util';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-formly-template',
  template: ` <div [innerHTML]="to.innerHTML"></div> `,
})
export class TemplateTypeComponent extends FieldType implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    if (this.to.apiEndpoint) {
      this.createRequest()
        .pipe(filter(res => res.ok))
        .subscribe(
          res => this.onSuccess(res),
          err => this.onError(err)
        );
    }
  }

  createRequest(): Observable<HttpResponse<any>> {
    const params = createRequestOption(_.omitBy(plainToFlattenObject(this.to.params), _.isNull));
    const body = _.omitBy(this.to.body, _.isNull);
    if (_.isEmpty(body)) {
      return this.httpClient.get(SERVER_API_URL + _.toString(this.to.apiEndpoint), {
        params,
        responseType: this.to.responseType ? this.to.responseType : 'json',
        observe: 'response',
      });
    } else {
      return this.httpClient.post(SERVER_API_URL + _.toString(this.to.apiEndpoint), body, {
        params,
        responseType: this.to.responseType ? this.to.responseType : 'json',
        observe: 'response',
      });
    }
  }

  private onSuccess(res: any): void {
    this.form.get(_.toString(this.key))?.setValue(res);
  }

  private onError(err: HttpErrorResponse): void {
    this.form.get(_.toString(this.key))?.setValue(err);
  }
}
