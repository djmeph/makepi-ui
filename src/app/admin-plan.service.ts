import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AdminPlanService {

    constructor(
        private globalService: GlobalService,
        private http: HttpClient,
    ) { }

    get({ planId, versionNumber }): Promise<any> {
        return this.http
            .get(`${this.globalService.API_URI}/plans/${planId}/${versionNumber}`)
            .toPromise();
    }

    getLatest(): Promise<any> {
        return this.http
            .get(`${this.globalService.API_URI}/plans/latest`)
            .toPromise();
    }

    upsert(body: any): Promise<any> {
        return this.http
            .post(`${this.globalService.API_URI}/plans`, body)
            .toPromise();
    }
}
