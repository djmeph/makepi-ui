import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUserService } from '../admin-user.service';
import { ScheduleStatuses } from '../../enums/schedule-statuses';
import { AlertService, Alerts } from '../alert.service';
import { Pages } from '../../enums/pages';

@Component({
    selector: 'app-upcoming-payments',
    templateUrl: './upcoming-payments.component.html',
    styleUrls: ['./upcoming-payments.component.scss']
})
export class UpcomingPaymentsComponent implements OnInit {

    schedules: any;
    loading: boolean;

    constructor(
        private adminUserService: AdminUserService,
        private router: Router,
        private alertService: AlertService,
    ) {
        this.loading = true;
        this.schedules = [];
    }

    async ngOnInit() {
        this.loading = true;
        try {
            this.schedules = await this.adminUserService.getAllSchedulesByStatus(ScheduleStatuses.UNPAID);
            this.loading = false;
        } catch (err) {
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
            this.loading = false;
        }

    }

    editUser(userId: string) {
        this.router.navigate([`/${Pages.EDIT_MEMBER}/${userId}`]);
    }

}
