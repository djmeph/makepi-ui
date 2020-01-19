import { Injectable } from '@angular/core';
import * as config from 'config.json';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    STRIPE_PUB_KEY: string;
    API_URI: string;
    APP_NAME: string;

    uri = config.API_URI;
    jsonHeaders: any;
    production: boolean;

    constructor() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.jsonHeaders = { headers };
        this.APP_NAME = config.APP_NAME;
        this.API_URI = config.API_URI;
        this.STRIPE_PUB_KEY = config.STRIPE_PUB_KEY;
        this.production = !!config.production;
    }
}
