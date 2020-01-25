import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from './global.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../models/user';
import { Access } from '../enums/access';

@Injectable({
    providedIn: 'root'
})
export class AdminUserService {

    searchResults: any;
    searchLoading: boolean;
    searchStatus = {} as any;
    searchForm = new FormGroup({
        key: new FormControl(this.searchStatus.key, [Validators.required, Validators.minLength(3)])
    });

    constructor(
        private globalService: GlobalService,
        private http: HttpClient,
    ) {
        this.searchResults = [];
        this.searchLoading = false;
    }

    put(user: User) {
        return this.http
            .put(`${this.globalService.API_URI}/admin/users/${user.username}`, user)
            .toPromise() as Promise<User>;
    }

    getAll() {
        return this.http
            .get(`${this.globalService.API_URI}/admin/users`)
            .toPromise() as Promise<User[]>;
    }

    getPage(lastEvaluatedKey) {
        const params = new HttpParams()
            .set('userId', lastEvaluatedKey.userId)
            .set('itemKey', lastEvaluatedKey.itemKey)
            .set('active', lastEvaluatedKey.active);
        return this.http
            .get(`${this.globalService.API_URI}/admin/users`, { params })
            .toPromise();
    }

    async search(key: string) {
        const params = new HttpParams()
            .set('key', key);
        const result = await this.http
            .get(`${this.globalService.API_URI}/admin/users-search`, { params })
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

    getMembers() {
        return this.http
            .get(`${this.globalService.API_URI}/admin/subscriptions/latest`)
            .toPromise() as Promise<any>;
    }

    randomCodeGenerator(stringLength: number) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        let charCount = 0;
        let numCount = 0;
        let randomstring = '';

        for (let i = 0; i < stringLength; i++) {
            if ((Math.floor(Math.random() * 2) === 0) && numCount < 3 || charCount >= 5) {
                const rnum = Math.floor(Math.random() * 10);
                randomstring += rnum;
                numCount += 1;
            } else {
                const rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
                charCount += 1;
            }
        }
    }
}
