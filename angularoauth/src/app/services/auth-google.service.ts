import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  loginStatus$ = new Subject<boolean>();

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '19129518386-birhpjl0bdflj38taksl8635ml425cfs.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/dashboard',
      scope: 'openid profile email',
    };

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then((loggedIn) => {
      this.loginStatus$.next(loggedIn);
    });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
  }

  getProfile() {
    const claims = this.oAuthService.getIdentityClaims();
    if (claims) {
      return {
        name: claims['name'] || 'No Name',
        email: claims['email'] || 'No Email',
      };
    }
    return null;
  }
  saveUserData() {
    const profile = this.getProfile();
    if (profile) {
      this.http.post('http://localhost:8080/api/save-user', profile)
        .subscribe(response => {
          console.log('User data saved successfully:', response);
        }, error => {
          console.error('Error saving user data:', error);
        });
    }
  }
}

