import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminPlanService } from '../admin-plan.service';
import { AlertService, Alerts } from '../alert.service';
import { Increments } from '../../enums/increments';
import { Access } from '../../enums/access';
import { CustomValidator } from '../validators';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-new-plan',
    templateUrl: './new-plan.component.html',
    styleUrls: ['./new-plan.component.scss']
})
export class NewPlanComponent {
    saving: boolean;

    plan: any;
    loading: boolean;
    increments: any;

    planStatus = {} as any;
    planForm = new FormGroup({
        planId: new FormControl(this.planStatus.planId, [Validators.required, CustomValidator.planId]),
        name: new FormControl(this.planStatus.name, [Validators.required]),
        amount: new FormControl(this.planStatus.amount, [Validators.required, CustomValidator.numeric]),
        increments: new FormControl(this.planStatus.increments, [Validators.required, CustomValidator.numeric]),
        sort: new FormControl(this.planStatus.sort, [Validators.required, CustomValidator.numeric]),
        price: new FormControl(this.planStatus.price, [Validators.required, CustomValidator.numeric]),
        accessKeymaster: new FormControl(this.planStatus.accessKeymaster),
        accessMember: new FormControl(this.planStatus.accessMember),
        accessOnboarding: new FormControl(this.planStatus.accessOnboarding),
    });

    constructor(
        private adminPlanService: AdminPlanService,
        private router: Router,
        private alertService: AlertService,
    ) {
        this.plan = {};
        this.loading = true;
        this.saving = false;
        this.increments = Increments;
    }

    async submit() {
        if (this.saving) {
            return;
        }
        this.saving = true;
        const { value: planId } = this.planForm.get('planId');
        const { value: name } = this.planForm.get('name');
        const { value: amount } = this.planForm.get('amount');
        const { value: increments } = this.planForm.get('increments');
        const { value: sort } = this.planForm.get('sort');
        const { value: price } = this.planForm.get('price');
        const access = [];
        if (this.planForm.get('accessKeymaster').value) {
            access.push(Access.KEYMASTER);
        }
        if (this.planForm.get('accessMember').value) {
            access.push(Access.MEMBER);
        }
        if (this.planForm.get('accessOnboarding').value) {
            access.push(Access.ONBOARDING);
        }
        try {
            await this.adminPlanService.upsert({
                planId,
                name,
                amount,
                increments,
                sort,
                price,
                access,
            });
            this.alertService.openAlert(moment().format('YYYY-MM-DD HH:mm:ss'), 'Plan saved', Alerts.SUCCESS);
            this.saving = false;
            this.router.navigate(['/plans']);
        } catch (err) {
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
            this.saving = false;
        }
    }
}
