import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AdminUserService } from '../admin-user.service';
import { AlertService, Alerts } from '../alert.service';
import { Access } from '../../enums/access';
import { Pages } from '../../enums/pages';
import * as _ from 'lodash';

@Component({
    selector: 'app-search-users',
    templateUrl: './search-users.component.html',
    styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent {

    updating: boolean;

    constructor(
        public userService: UserService,
        public adminUserService: AdminUserService,
        private router: Router,
        private alertService: AlertService,
    ) {
        this.updating = false;
    }

    async changeRole(username: string, role: Access) {
        while (this.updating) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        this.updating = true;
        const [user] = _.filter(this.adminUserService.searchResults, { username });
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

    clear() {
        this.adminUserService.searchResults = [];
        this.adminUserService.searchForm.patchValue({ key: '' });
        this.router.navigate(['/active-users']);
    }

    editUser(userId: string) {
        this.router.navigate([`/${Pages.EDIT_MEMBER}/${userId}`]);
    }

}
