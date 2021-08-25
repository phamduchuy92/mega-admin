import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApplicationConfigService {
  private endpointPrefix = "";

  constructor(private httpClient: HttpClient) {}

  setEndpointPrefix(endpointPrefix: string): void {
    this.endpointPrefix = endpointPrefix;
  }

  getEndpointFor(api: string, microservice?: string): string {
    if (microservice) {
      return `${this.endpointPrefix}services/${microservice}/${api}`;
    }
    return `${this.endpointPrefix}${api}`;
  }

  getConfigFor(microservice: string): Observable<any> {
    return this.httpClient.get(`/assets/services/${microservice}.yaml`, {
      responseType: "text",
      observe: "response",
    });
  }
}
