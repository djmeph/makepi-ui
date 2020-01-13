import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as config from 'config.json';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    jwtToken: string;

    constructor(
        private http: HttpClient,
    ) { }

    async login(username: string, password: string, remember: boolean): Promise<any>  {
        const result: any = await this.http
            .post(`${config.API_URI}/login`, { username, password, remember })
            .toPromise();
        this.jwtToken = result.token;
        localStorage.setItem('token', this.jwtToken);
    }
}
