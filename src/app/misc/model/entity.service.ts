import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class EntityService {
  constructor(private http: HttpClient) {}

  create(item: any, apiEndpoint?: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(apiEndpoint, item);
  }

  update(item: any, apiEndpoint?: string): Observable<HttpResponse<any>> {
    return this.http.put<any>(apiEndpoint, item);
  }

  find(id: number, apiEndpoint?: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${apiEndpoint}/${id}`);
  }

  query(req?: any, apiEndpoint?: string): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(apiEndpoint, { params: options, observe: 'response' });
  }

  delete(id: number, apiEndpoint?: string): Observable<{}> {
    return this.http.delete(`${apiEndpoint}/${id}`);
  }
}
