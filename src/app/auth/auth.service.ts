import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = '';
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getIsAuthenticated() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      this.isAuthenticated = false;
      this.token = '';
      this.authStatusListener.next(false);
    }
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(user => {
        this.router.navigate(['/login']);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>('http://localhost:3000/api/user/login', authData)
      .subscribe(res => {
        this.token = res.token;
        if (this.token) {
          const expiresInSeconds = res.expiresIn;
          this.setAuthTimer(expiresInSeconds);
          this.isAuthenticated = true;
          this.userId = res.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          console.log(now);
          const expirationDate = new Date(
            now.getTime() + expiresInSeconds * 1000
          );
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    clearTimeout(this.tokenTimer);
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(expiresInSeconds) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInSeconds * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresInSeconds = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresInSeconds > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresInSeconds / 1000);
      this.authStatusListener.next(true);
    }
  }
}
