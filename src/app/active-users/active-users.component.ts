import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUserService } from '../admin-user.service';
import { AlertService, Alerts } from '../alert.service';
import { User } from '../../models/user';
import { Access } from '../../enums/access';
import { Pages } from '../../enums/pages';
import * as _ from 'lodash';

@Component({
    selector: 'app-active-users',
    templateUrl: './active-users.component.html',
    styleUrls: ['./active-users.component.scss']
})
export class ActiveUsersComponent implements OnInit {
    users: any;
    access: any;
    updating: boolean;
    loading: boolean;
    lastEvaluatedKey: any;

    constructor(
        private alertService: AlertService,
        private adminUserService: AdminUserService,
        private router: Router,
    ) {
        this.users = [];
        this.access = Access;
        this.updating = false;
    }

    async ngOnInit() {
        try {
            this.loading = true;
            const result = await this.adminUserService.getAll() as any;
            this.lastEvaluatedKey = result.lastEvaluatedKey;
            this.users = result.items.map(user => ({
                ...user,
                access: {
                    ADMIN: user.access && user.access.indexOf(Access.ADMIN) >= 0,
                    KEYMASTER: user.access && user.access.indexOf(Access.KEYMASTER) >= 0,
                    MEMBER: user.access && user.access.indexOf(Access.MEMBER) >= 0,
                    ONBOARDING: user.access && user.access.indexOf(Access.ONBOARDING) >= 0,
                }
            })) as User[];
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
        }

    }

    async changeRole(username: string, role: Access) {
        while (this.updating) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        this.updating = true;
        const [user] = _.filter(this.users, { username });
        const access = [];
        Object.keys(user.access).forEach(key => {
            if (user.access[key]) {
                access.push(Access[key]);
            }
        });
        const payload = { ...user, access };
        try {
            await this.adminUserService.put(payload);
            this.updating = false;
        } catch (err) {
            this.updating = false;
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
        }
    }

    async onScroll() {
        if (!this.lastEvaluatedKey) {
            return;
        }
        this.loading = true;
        try {
            const result = await this.adminUserService.getPage(this.lastEvaluatedKey) as any;
            const newBatch = result.items.map(user => ({
                ...user,
                access: {
                    ADMIN: user.access && user.access.indexOf(Access.ADMIN) >= 0,
                    KEYMASTER: user.access && user.access.indexOf(Access.KEYMASTER) >= 0,
                    MEMBER: user.access && user.access.indexOf(Access.MEMBER) >= 0,
                    ONBOARDING: user.access && user.access.indexOf(Access.ONBOARDING) >= 0,
                }
            })) as User[];
            this.users = _.concat(this.users, newBatch);
            this.lastEvaluatedKey = result.lastEvaluatedKey;
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
        }
    }

    editUser(userId: string) {
        this.router.navigate([`/${Pages.EDIT_MEMBER}/${userId}`]);
    }

}
