import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminPlanService } from '../admin-plan.service';
import { AlertService, Alerts } from '../alert.service';
import { Increments } from '../../enums/increments';
import { Access } from '../../enums/access';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-edit-plan',
    templateUrl: './edit-plan.component.html',
    styleUrls: ['./edit-plan.component.scss']
})
export class EditPlanComponent implements OnInit {

    saving: boolean;

    plan: any;
    planId: string;
    loading: boolean;
    increments: any;

    planStatus = {} as any;
    planForm = new FormGroup({
        name: new FormControl(this.planStatus.name, [Validators.required]),
        amount: new FormControl(this.planStatus.amount, [Validators.required]),
        increments: new FormControl(this.planStatus.increments, [Validators.required]),
        sort: new FormControl(this.planStatus.sort, [Validators.required]),
        price: new FormControl(this.planStatus.price, [Validators.required]),
        accessKeymaster: new FormControl(this.planStatus.accessKeymaster),
        accessMember: new FormControl(this.planStatus.accessMember),
        accessOnboarding: new FormControl(this.planStatus.accessOnboarding),
    });

    constructor(
        private adminPlanService: AdminPlanService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
    ) {
        this.plan = {};
        this.planId = this.route.snapshot.params.planId;
        this.loading = true;
        this.saving = false;
        this.increments = Increments;
    }

    async ngOnInit() {
        try {
            this.loading = true;
            const plans = await this.adminPlanService.getLatest();
            const [plan] = _.filter(plans, { planId: this.planId });
            this.planForm.patchValue(plan);
            plan.access.forEach(access => {
                switch(access) {
                    case Access.KEYMASTER:
                        this.planForm.patchValue({ accessKeymaster: true });
                        break;
                    case Access.MEMBER:
                        this.planForm.patchValue({ accessMember: true });
                        break;
                    case Access.ONBOARDING:
                        this.planForm.patchValue({ accessOnboarding: true });
                        break;
                    default:
                }
            })
            this.loading = false;
        } catch (err) {
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
            this.loading = false;
        }
    }

    async submit() {
        if (this.saving) {
            return;
        }
        this.saving = true;
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
                planId: this.planId,
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
