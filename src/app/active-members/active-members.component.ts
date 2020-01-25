import { Component, OnInit } from '@angular/core';
import { AdminUserService } from '../admin-user.service';
import { AlertService, Alerts } from '../alert.service';
import { User } from '../../models/user';
import { Access } from '../../enums/access';
import * as _ from 'lodash';

@Component({
    selector: 'app-active-members',
    templateUrl: './active-members.component.html',
    styleUrls: ['./active-members.component.scss']
})
export class ActiveMembersComponent implements OnInit {
    members: any;
    access: any;
    updating: boolean;
    loading: boolean;
    lastEvaluatedKey: any;

    constructor(
        private adminUserService: AdminUserService,
        private alertService: AlertService,
    ) {
        this.members = [];
        this.access = Access;
        this.updating = false;
    }

    async ngOnInit() {
        try {
            this.loading = true;
            const result = await this.adminUserService.getMembers() as any;
            this.lastEvaluatedKey = result.lastEvaluatedKey;
            this.members = result.map(member => ({
                ...member,
                access: {
                    ADMIN: member.user.access && member.user.access.indexOf(Access.ADMIN) >= 0,
                    KEYMASTER: member.user.access && member.user.access.indexOf(Access.KEYMASTER) >= 0,
                    MEMBER: member.user.access && member.user.access.indexOf(Access.MEMBER) >= 0
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
        const [user] = _.filter(this.members, { username });
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
}
