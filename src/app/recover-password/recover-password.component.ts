import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AlertService, Alerts } from '../alert.service';

@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {

    loading: boolean;

    recoverStatus = {} as any;

    recoverForm = new FormGroup({
        email: new FormControl(this.recoverStatus.email, [Validators.required, Validators.email])
    });

    constructor(
        private userService: UserService,
        private alertService: AlertService,
        private router: Router,
    ) { }

    async recover() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        const email = this.recoverForm.get('email').value;
        try {
            await this.userService.recoverCode(email);
            this.loading = false;
            this.router.navigate([`/recover-code/${email}`]);
        } catch (err) {
            this.loading = false;
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
        }
    }

}
