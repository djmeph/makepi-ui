import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUserService } from '../admin-user.service';
import { AlertService, Alerts } from '../alert.service';
import { User } from '../../models/user';
import { Access } from '../../enums/access';
import { Pages } from '../../enums/pages';
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
        private router: Router,
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
                    MEMBER: member.user.access && member.user.access.indexOf(Access.MEMBER) >= 0,
                    ONBOARDING: member.user.access && member.user.access.indexOf(Access.ONBOARDING) >= 0,
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
        const [member] = _.filter(this.members, n => n.user.username === username);
        const access = [];
        Object.keys(member.access).forEach(key => {
            if (member.access[key]) {
                access.push(Access[key]);
            }
        });
        const payload = { ...member.user, access };
        try {
            await this.adminUserService.put(payload);
            this.updating = false;
        } catch (err) {
            this.updating = false;
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
        }
    }

    editUser(userId: string) {
        this.router.navigate([`/${Pages.EDIT_MEMBER}/${userId}`]);
    }
}
