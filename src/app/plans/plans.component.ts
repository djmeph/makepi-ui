import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminPlanService } from '../admin-plan.service';
import { Increments } from '../../enums/increments';

@Component({
    selector: 'app-plans',
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

    plans: any;
    loading: boolean;

    constructor(
        private adminPlanService: AdminPlanService,
        private router: Router,
    ) {
        this.loading = true;
        this.plans = [];
    }

    async ngOnInit() {
        this.loading = true;
        this.plans = await this.adminPlanService.getLatest();
        console.log(this.plans);
        this.loading = false;
    }

    incrementText(increment: Increments) {
        switch (increment) {
            case Increments.DAYS:
                return 'days';
            case Increments.MONTHS:
                return 'months';
            case Increments.QUARTERS:
                return 'quarters';
            case Increments.WEEKS:
                return 'weeks';
            case Increments.YEARS:
                return 'years';
            default:
                return 'unkown increments';
        }
    }

    editPlan(planId: string) {
        this.router.navigate([`/edit-plan/${planId}`]);
    }

    new() {
        this.router.navigate(['/new-plan']);
    }

}
