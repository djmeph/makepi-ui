import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtService } from './jwt.service';
import * as config from 'config.json';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private http: HttpClient,
        private jwtService: JwtService,
    ) { }

    async login(username: string, password: string, remember: boolean): Promise<any>  {
        const result: any = await this.http
            .post(`${config.API_URI}/login`, { username, password, remember })
            .toPromise();
        this.jwtService.token = result.token;
        localStorage.setItem('token', this.jwtService.token);
    }

    async register(username: string, password: string): Promise<any>  {
        const result: any = await this.http
            .post(`${config.API_URI}/register`, { username, password })
            .toPromise();
        this.jwtService.token = result.token;
        localStorage.setItem('token', this.jwtService.token);
    }
}
