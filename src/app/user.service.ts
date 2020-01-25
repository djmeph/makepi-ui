import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    searchResults: any;
    searchLoading: boolean;

    searchStatus = {} as any;

    searchForm = new FormGroup({
        key: new FormControl(this.searchStatus.key, [Validators.required, Validators.minLength(3)])
    });

    constructor(
        private http: HttpClient,
        private jwt: JwtService,
        public globalService: GlobalService,
    ) {
        this.jwtService = jwt;
        this.access = [];
        this.searchResults = [];
        this.searchLoading = false;
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

    put(user: User) {
        return this.http
            .put(`${this.globalService.API_URI}/admin/user/${user.username}`, user)
            .toPromise() as Promise<User>;
    }

    getAll() {
        return this.http
            .get(`${this.globalService.API_URI}/users`)
            .toPromise() as Promise<User[]>;
    }

    getPage(lastEvaluatedKey) {
        const params = new HttpParams()
            .set('userId', lastEvaluatedKey.userId)
            .set('itemKey', lastEvaluatedKey.itemKey)
            .set('active', lastEvaluatedKey.active);
        return this.http
            .get(`${this.globalService.API_URI}/users`, { params })
            .toPromise();
    }

    async search(key: string) {
        const params = new HttpParams()
            .set('key', key);
        const result = await this.http
            .get(`${this.globalService.API_URI}/users-search`, { params })
            .toPromise() as User[];
        this.searchResults = result.map(user => ({
            ...user,
            access: {
                ADMIN: user.access && user.access.indexOf(Access.ADMIN) >= 0,
                KEYMASTER: user.access && user.access.indexOf(Access.KEYMASTER) >= 0,
                MEMBER: user.access && user.access.indexOf(Access.MEMBER) >= 0
            }
        }));
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

    getMembers() {
        return this.http
            .get(`${this.globalService.API_URI}/admin/subscriptions/latest`)
            .toPromise() as Promise<any>;
    }
}
