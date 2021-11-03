import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { ApplicationConfigService } from '../config/application-config.service';
import { Login } from 'app/login/login.model';

type JwtToken = {
  id_token: string;
  id: number;
  login: string;
  email: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private applicationConfigService: ApplicationConfigService
  ) {}

  getToken(): string {
    const tokenInLocalStorage: string | null = this.localStorageService.retrieve('authenticationToken');
    const tokenInSessionStorage: string | null = this.sessionStorageService.retrieve('authenticationToken');
    return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(this.applicationConfigService.getEndpointFor('api/authenticate', 'account-mgmt'), credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.localStorageService.clear('authenticationToken');
      this.sessionStorageService.clear('authenticationToken');
      this.localStorageService.clear('id');
      this.sessionStorageService.clear('id');
      this.localStorageService.clear('login');
      this.sessionStorageService.clear('login');
      this.localStorageService.clear('email');
      this.sessionStorageService.clear('email');
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    const id = response.id;
    const login = response.login;
    const email = response.email;
    if (rememberMe) {
      this.localStorageService.store('authenticationToken', jwt);
      this.sessionStorageService.clear('authenticationToken');
      this.localStorageService.store('id', id);
      this.sessionStorageService.clear('id');
      this.localStorageService.store('login', login);
      this.sessionStorageService.clear('login');
      this.localStorageService.store('email', email);
      this.sessionStorageService.clear('email');
    } else {
      this.sessionStorageService.store('authenticationToken', jwt);
      this.localStorageService.clear('authenticationToken');
      this.sessionStorageService.store('id', id);
      this.localStorageService.clear('id');
      this.sessionStorageService.store('login', login);
      this.localStorageService.clear('login');
      this.sessionStorageService.store('email', email);
      this.localStorageService.clear('email');
    }
  }
}
