import { AuthService } from './../services/auth-service';
import Swal from 'sweetalert2';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, Observable } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const route = inject(Router);

  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken')!;

  let clonedReq = req;

  if (accessToken) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(clonedReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        (error.status === 401 ||
          (error.status === 400 &&
            Array.isArray(error.error) &&
            error.error[0] === 'Unauthorized access!'))
      ) {
        if (!accessToken) {
          Swal.fire({
            icon: 'warning',
            title: 'Please log in',
            text: 'You must be signed in to access your cart.',
            confirmButtonColor: '#d97706',
            background: '#fff',
            color: '#333',
          }).then(() => {
            route.navigate(['']);
          });

          return throwError(() => new Error('Unauthorized'));
        }
        return handle401Error(clonedReq, next, refreshToken, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  refreshToken: string,
  authService: AuthService
): Observable<HttpEvent<any>> {
  console.log('refreshing...');
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken(refreshToken).pipe(
      switchMap((res: any) => {
        isRefreshing = false;

        sessionStorage.setItem('accessToken', res.AccessToken);
        sessionStorage.setItem('refreshToken', res.RefreshToken);

        refreshTokenSubject.next(res.AccessToken);

        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${res.AccessToken}` },
          })
        );
      }),

      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        console.log(err);
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) =>
        next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        )
      )
    );
  }
}
