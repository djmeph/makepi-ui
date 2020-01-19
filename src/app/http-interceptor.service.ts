import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})

export class HttpInterceptorService implements HttpInterceptor {
    constructor(
        private userService: UserService
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
        return next.handle(this.userService.jwtService.isAuthenticated() ? req.clone({
            headers: req.headers
            .append('Authorization', `Bearer ${this.userService.jwtService.token}`)
        }) : req.clone({
            headers: req.headers
        }));
    }
}
