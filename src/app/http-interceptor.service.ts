import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';

@Injectable({
    providedIn: 'root'
})

export class HttpInterceptorService implements HttpInterceptor {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
        const token = this.userService.jwtToken;
        const authReq = this.jwtService.isAuthenticated() ? req.clone({
            headers: req.headers
            .append('Authorization', `Bearer ${token}`)
        }) : req.clone({
            headers: req.headers
        });
        return next.handle(authReq);
    }
}
