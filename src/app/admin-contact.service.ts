import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../models/contact';

@Injectable({
    providedIn: 'root'
})
export class AdminContactService {

    constructor(
        private globalService: GlobalService,
        private http: HttpClient,
    ) { }

    post(contact: Contact, userId: string, type: number): Promise<Contact> {
        return this.http
            .post(`${this.globalService.API_URI}/admin/contacts/${userId}/${type}`, contact)
            .toPromise();
    }

    get(userId: string, type: number): Promise<Contact> {
        return this.http
            .get(`${this.globalService.API_URI}/admin/contacts/${userId}/${type}`)
            .toPromise();
    }

    delete(userId: string, type: number): Promise<any> {
        return this.http
            .delete(`${this.globalService.API_URI}/admin/contacts/${userId}/${type}`)
            .toPromise();
    }
}
