import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { GlobalService } from './global.service';
import { User } from '../models/user';
import { Access } from '../enums/access';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    jwtService: JwtService;
    user: User;
    access: number[];

    constructor(
        private http: HttpClient,
        private jwt: JwtService,
        public globalService: GlobalService,
    ) {
        this.jwtService = jwt;
        this.access = [];
    }

    async login(username: string, password: string, remember: boolean): Promise<any>  {
        const result: any = await this.http
            .post(`${this.globalService.API_URI}/login`, { username, password, remember })
            .toPromise();
        this.jwt.token = result.token;
        localStorage.setItem('token', this.jwt.token);
        await this.get();
    }

    async register(username: string, password: string): Promise<any>  {
        const result: any = await this.http
            .post(`${this.globalService.API_URI}/register`, { username, password })
            .toPromise();
        this.jwt.token = result.token;
        localStorage.setItem('token', this.jwt.token);
        await this.get();
    }

    async get() {
        this.user = await this.http
            .get(`${this.globalService.API_URI}/user`)
            .toPromise() as User;
        this.access = this.user.access;
    }

    getAccess(access: Access[]): boolean {
        return _.some(access, n => this.access.indexOf(n) >= 0);
    }

    recoverCode(username: string) {
        return this.http
            .post(`${this.globalService.API_URI}/recover-code`, { username })
            .toPromise() as Promise<any>;
    }

    recoverReset(username: string, recoverCode: string, password: string) {
        return this.http
            .post(`${this.globalService.API_URI}/recover-reset`, { username, recoverCode, password })
            .toPromise() as Promise<any>;
    }
}
