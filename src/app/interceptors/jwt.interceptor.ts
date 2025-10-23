import { HttpInterceptor,HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class JwtInterceptor implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        if(token && !req.url.includes('/api/auth')){
            req = req.clone({
                setHeaders:{
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(req);
        }

        return next.handle(req);
    }

}