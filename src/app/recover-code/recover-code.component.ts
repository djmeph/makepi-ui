import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { AlertService, Alerts  } from '../alert.service';

@Component({
    selector: 'app-recover-code',
    templateUrl: './recover-code.component.html',
    styleUrls: ['./recover-code.component.scss']
})
export class RecoverCodeComponent {

    recoverStatus = {} as any;
    loading: boolean;

    recoverForm = new FormGroup({
        code: new FormControl(this.recoverStatus.code, [Validators.required]),
        password: new FormControl(this.recoverStatus.code, [Validators.required]),
    });

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private userService: UserService,
    ) {
        this.loading = false;
    }

    async recover() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const newPassword = this.recoverForm.get('password').value;
            const code = this.recoverForm.get('code').value;
            await this.userService.recoverReset(this.route.snapshot.params.email, code, newPassword);
            this.recoverForm.patchValue({ email: '' });
            this.loading = false;
            this.alertService.openAlert('Password Reset', 'Login with your new password', Alerts.SUCCESS);
            this.router.navigate(['/login']);
        } catch (err) {
            this.loading = false;
            this.alertService.openAlert('', err.error.message, Alerts.DANGER);
        }

    }

}
