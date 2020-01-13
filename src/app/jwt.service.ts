import { Injectable } from '@angular/core';
import { TokenDecoded } from '../models/token-decoded';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as _ from 'lodash';
import * as moment from 'moment';

const helper = new JwtHelperService();

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    token: string;

    constructor() { }

    public isAuthenticated() {
        const token = this.token;
        if (!token) { return false; }
        const decodedToken = helper.decodeToken(`${token}`) as TokenDecoded;
        const exp = moment.unix(decodedToken.exp);
        const tokenIsExpired = moment().isAfter(exp);
        if (tokenIsExpired) {
            this.token = null;
            localStorage.removeItem('token');
        }
        return !tokenIsExpired;
    }
}
