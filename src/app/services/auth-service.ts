import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private route = inject(Router);

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }

  signUp(body: any) {
    return this.http.post<any>('https://localhost:7115/api/Auth/register', body);
  }
  signIn(fin: string, password: string) {
    const body = {
      fin: fin,
      password: password,
    };
    return this.http.post<any>('https://localhost:7115/api/Auth/login', body);
  }

  logout() {
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    this.route.navigate(['']).then(() => {
      window.location.reload();
    });
  }
  refreshToken(refreshToken: string) {
    var body = {
      refreshToken: refreshToken,
    };
    return this.http.post<any>('https://localhost:7115/api/Auth/refresh', body);
  }
}
