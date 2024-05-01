import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppService } from './app.service';

export const JwtInterceptor: HttpInterceptorFn = (request, next) => {
    const appService = inject(AppService);
    const token = appService.getUserToken()
    if (token) {
        request = request.clone({
            setHeaders: { Authorisation: `${token}` }
        });
    }
  return next(request);
};