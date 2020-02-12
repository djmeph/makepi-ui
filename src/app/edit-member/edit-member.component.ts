import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminUserService } from '../admin-user.service';
import { AdminPlanService } from '../admin-plan.service';
import { AlertService, Alerts } from '../alert.service';
import { ContactTypes } from '../../enums/contact-types';
import { ScheduleStatuses } from '../../enums/schedule-statuses';
import * as _ from 'lodash';

interface CheckoutStatus {
    paymentMethodKey: any;
    planId: any;
    versionNumber: any;
    paymentDay: any;
}

enum Editors {
    MEMBERSHIP,
}

@Component({
    selector: 'app-edit-member',
    templateUrl: './edit-member.component.html',
    styleUrls: ['./edit-member.component.scss']
})
export class EditMemberComponent implements OnInit {

    loading: boolean;
    userId: string;
    user: any;
    primaryContact: any;
    emergencyContact: any;
    subscription: any;
    schedules: any[];
    paymentMethods: any;
    latestPlans: any;

    scheduleStatuses: any;

    editorToggles: any[];
    editors: any;
    loaders: any;

    checkoutStatus = {} as CheckoutStatus;

    checkoutForm = new FormGroup({
        paymentMethodKey: new FormControl(this.checkoutStatus.paymentMethodKey, [
            Validators.required,
        ]),
        planId: new FormControl(this.checkoutStatus.planId, [
            Validators.required
        ]),
        versionNumber: new FormControl(this.checkoutStatus.versionNumber, [
            Validators.required
        ]),
        paymentDay: new FormControl(this.checkoutStatus.paymentDay, [
            Validators.required,
            Validators.min(1),
            Validators.max(28)
        ])
    });

    constructor(
        private adminUserService: AdminUserService,
        private adminPlanService: AdminPlanService,
        private route: ActivatedRoute,
        private alertService: AlertService,
    ) {
        this.loading = true;
        this.userId = this.route.snapshot.params.userId;
        this.scheduleStatuses = ScheduleStatuses;
        this.schedules = [[], [], [], []];
        this.editorToggles = [];
        this.editorToggles[Editors.MEMBERSHIP] = false;
        this.editors = {
            MEMBERSHIP: Editors.MEMBERSHIP
        };
        this.loaders = {
            MEMBERSHIP: false,
        };
    }


    async ngOnInit() {
        await Promise.all([
            new Promise(async (resolve) => {
                try {
                    this.user = await this.adminUserService.getUser(this.userId);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }),
            new Promise(async (resolve) => {
                try {
                    this.primaryContact = await this.adminUserService.getContact(this.userId, ContactTypes.PRIMARY);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }),
            new Promise(async (resolve) => {
                try {
                    this.emergencyContact = await this.adminUserService.getContact(this.userId, ContactTypes.EMERGENCY);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }),
            new Promise(async (resolve) => {
                try {
                    this.subscription = await this.adminUserService.getLatestSubscription(this.userId);
                    this.subscription.plan = await this.adminPlanService.get(this.subscription.plan);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }),
            new Promise(async (resolve) => {
                try {
                    this.schedules = await Promise.all([
                        this.adminUserService.getSchedules(this.userId, ScheduleStatuses.UNPAID),
                        this.adminUserService.getSchedules(this.userId, ScheduleStatuses.PAID),
                        this.adminUserService.getSchedules(this.userId, ScheduleStatuses.LATE),
                        this.adminUserService.getSchedules(this.userId, ScheduleStatuses.CANCELLED),
                    ])
                    resolve();
                } catch (err) {
                    resolve();
                }
            }),
            new Promise(async (resolve) => {
                try {
                    this.paymentMethods = await this.adminUserService.getPaymentMethods(this.userId);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }),
            new Promise(async (resolve) => {
                try {
                    this.latestPlans = await this.adminPlanService.getLatest();
                    resolve();
                } catch (err) {
                    resolve();
                }
            }),
        ]);
        if (this.subscription) {
            this.checkoutForm.patchValue({ planId: this.subscription.plan.planId });
            this.checkoutForm.patchValue({ versionNumber: this.subscription.plan.versionNumber });
            this.checkoutForm.patchValue({ paymentDay: this.subscription.paymentDay });
            if (this.subscription.paymentMethodKey === 'cash') {
                this.subscription.paymentMethod = { source: { bank_name: 'Cash/Check' } };
                this.checkoutForm.patchValue({ paymentMethodKey: 'cash' });
            } else {
                this.paymentMethods.forEach(method => {
                    if (method.itemKey === this.subscription.paymentMethodKey) {
                        this.subscription.paymentMethod = method;
                        this.checkoutForm.patchValue({ paymentMethodKey: method.itemKey });
                    }
                });
                this.subscription.paymentMethod = await this
                    .adminUserService.getPaymentMethod(this.userId, this.subscription.paymentMethodKey);
            }
        }
        this.loading = false;
    }

    toggleEditor(editor: Editors) {
        this.editorToggles[Editors.MEMBERSHIP] = editor === Editors.MEMBERSHIP;
    }

    cancel() {
        this.editorToggles[Editors.MEMBERSHIP] = false;
    }

    async checkout() {
        if (this.loaders.MEMBERSHIP) {
            return;
        }
        this.loaders.MEMBERSHIP = true;
        const { value: paymentMethodKey } = this.checkoutForm.get('paymentMethodKey');
        const { value: planId } = this.checkoutForm.get('planId');
        const { value: versionNumber } = this.checkoutForm.get('versionNumber');
        const { value: paymentDay } = this.checkoutForm.get('paymentDay');
        try {
            const params = {
                paymentMethodKey,
                plan: { planId, versionNumber },
                paymentDay
            };
            await this.adminUserService.upsertSubscription(this.userId, params);
            const [plan] = _.filter(this.latestPlans, { planId });
            this.subscription = { ...params, plan, paymentDay };
            const [paymentMethod] = _.filter(this.paymentMethods, { itemKey: paymentMethodKey });
            if (paymentMethodKey === 'cash') {
                this.subscription.paymentMethod = {
                    source: { bank_name: 'Cash/Check' }
                };
            }
            if (paymentMethod) {
                this.subscription.paymentMethod = paymentMethod;
            }
            this.loaders.MEMBERSHIP = false;
            this.cancel();
        } catch (err) {
            console.error(err);
            this.alertService.openAlert('', '', Alerts.DANGER);
            this.loaders.MEMBERSHIP = false;
        }
    }

    setPlan(planId: string, versionNumber: number) {
        if (this.checkoutForm.get('planId').value === planId) { return; }
        this.checkoutForm.patchValue({ planId });
        this.checkoutForm.patchValue({ versionNumber });
    }

    setPaymentMethod(paymentMethodKey: string) {
        if (this.checkoutForm.get('paymentMethodKey').value === paymentMethodKey) { return; }
        this.checkoutForm.patchValue({ paymentMethodKey });
    }

}
