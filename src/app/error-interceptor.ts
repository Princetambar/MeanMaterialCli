import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';

import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private matDialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        console.log(errorResponse.error);
        let errorMessage = 'An error occured!';
        if (errorResponse.error.message) {
          errorMessage = errorResponse.error.message;
        }
        this.matDialog.open(ErrorComponent, {
          data: { message: errorMessage }
        });
        return throwError(errorResponse);
      })
    );
  }
}
