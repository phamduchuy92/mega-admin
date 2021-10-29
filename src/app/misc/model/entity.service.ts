import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app//core/request/request-util';

import * as moment from 'moment';
import { DATE_FORMAT } from 'app//config/input.constants';
import { map } from 'rxjs/operators';



type EntityResponseType = HttpResponse<any>;
type EntityArrayResponseType = HttpResponse<any[]>;
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class EntityService {
  public endpoint = '';
  // list of moment attributes
  public momentAttrs: string[] = [];
  public i18n: any = {};

  constructor(protected http: HttpClient) {}

  create(entity: any, endpoint?: string): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entity);
    return this.http
      .post<any>(SERVER_API_URL + `${endpoint ? endpoint : this.endpoint}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(entity: any, endpoint?: string): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entity);
    return this.http
      .put<any>(SERVER_API_URL + `${endpoint ? endpoint : this.endpoint}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: any, endpoint?: string): Observable<EntityResponseType> {
    return this.http
      .get<any>(SERVER_API_URL + `${endpoint ? endpoint : this.endpoint}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any, endpoint?: string): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(SERVER_API_URL + `${endpoint ? endpoint : this.endpoint}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: any, endpoint?: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(SERVER_API_URL + `${endpoint ? endpoint : this.endpoint}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(entity: any): any {
    const copy: any = Object.assign(
      {},
      entity,
      _.reduce(this.momentAttrs, (a, b) => _.set(a, b, entity[b] && entity[b].isValid() ? entity[b].format(DATE_FORMAT) : null), {})
    );
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      _.each(this.momentAttrs, i => (res.body[i] = res.body[i] != null ? moment(res.body[i]) : null));
      // res.body.ngayCap = res.body.ngayCap != null ? moment(res.body.ngayCap) : null;
      // res.body.hetHan = res.body.hetHan != null ? moment(res.body.hetHan) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((entity: any) => {
        _.each(this.momentAttrs, i => (entity[i] = entity[i] != null ? moment(entity[i]) : null));
      });
    }
    return res;
  }
}
