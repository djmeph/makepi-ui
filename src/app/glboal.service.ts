import { Injectable } from '@angular/core';
import * as config from 'config.json';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    uri = config.API_URI;
    jsonHeaders: any;

    constructor() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.jsonHeaders = { headers };
    }
}
