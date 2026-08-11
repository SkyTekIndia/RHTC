import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from './../_services';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const authenticationService = this.injector.get(AuthenticationService);
        const alertService$ = this.injector.get(ToastrService);
        return next.handle(request).pipe(catchError(err => {
            if (err instanceof HttpErrorResponse && err.error instanceof Blob && err.error.type === "application/json") {
                return new Promise<any>((resolve, reject) => {
                    let reader = new FileReader();
                    reader.onload = (e: Event) => {
                        try {
                            const errmsg = JSON.parse((<any>e.target).result);
                            const error = errmsg.message || err.statusText;

                            if (error && error !== "") {
                                alertService$.error(error);
                            }

                            reject(error);
                            return throwError(error);
                        } catch (e) {
                            alertService$.error("Oops, Something went wrong");
                            reject(e);
                            return throwError(e);
                        }
                    };
                    reader.onerror = (e) => {
                        alertService$.error("Oops, Something went wrong");
                        reject(e);
                        return throwError(e);
                    };
                    reader.readAsText(err.error);
                });
            } else {
                if ([401, 403].indexOf(err?.status) !== -1) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    // authenticationService.logout();
                }
                let error = err?.error?.message || err?.statusText;
                if(error === 'OK') {
                    error = "Oops, Something went wrong";
                }

                if (error && error !== "") {
                    alertService$.error(error);
                }
                
                return throwError(error);
            }
        }))
    }
}