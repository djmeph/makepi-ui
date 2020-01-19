import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AlertService, Alerts } from '../alert.service';
import { User } from '../../models/user';
import { Access } from '../../enums/access';
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

    constructor(
        private userService: UserService,
        private alertService: AlertService,
    ) {
        this.users = [];
        this.access = Access;
        this.updating = false;
    }

    async ngOnInit() {
        try {
            this.loading = true;
            const { items } = await this.userService.getAll() as any;
            this.users = items.map(user => ({
                ...user,
                access: {
                    ADMIN: user.access && user.access.indexOf(Access.ADMIN) >= 0,
                    KEYMASTER: user.access && user.access.indexOf(Access.KEYMASTER) >= 0,
                    MEMBER: user.access && user.access.indexOf(Access.MEMBER) >= 0
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
            await this.userService.put(payload);
            this.updating = false;
        } catch (err) {
            this.updating = false;
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
        }
    }

}
