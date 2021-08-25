import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';

type EntityResponseType = HttpResponse<any>;
type EntityArrayResponseType = HttpResponse<any[]>;

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  create(data: any, apiEndpoint?: string): Observable<EntityResponseType> {
    return this.http.post<any>(SERVER_API_URL + `${apiEndpoint ? apiEndpoint : ''}`, data, { observe: 'response' });
  }

  update(data: any, apiEndpoint?: string): Observable<EntityResponseType> {
    return this.http.put<any>(SERVER_API_URL + `${apiEndpoint ? apiEndpoint : ''}`, data, { observe: 'response' });
  }

  find(id: string, apiEndpoint?: string): Observable<EntityResponseType> {
    return this.http.get<any>(SERVER_API_URL + `${apiEndpoint ? apiEndpoint : ''}/${id}`, { observe: 'response' });
  }

  query(req?: any, apiEndpoint?: string): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(SERVER_API_URL + `${apiEndpoint ? apiEndpoint : ''}`, { params: options, observe: 'response' });
  }

  delete(id: string, apiEndpoint?: string): Observable<HttpResponse<any>> {
    return this.http.delete(SERVER_API_URL + `${apiEndpoint ? apiEndpoint : ''}/${id}`, { observe: 'response' });
  }
}
