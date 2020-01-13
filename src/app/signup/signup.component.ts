import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    loading: boolean;

    signupStatus = {} as any;

    signupForm = new FormGroup({
        email: new FormControl(this.signupStatus.email, [Validators.required, Validators.email]),
        password: new FormControl(this.signupStatus.password, [Validators.required])
    });

    constructor(
        private userService: UserService,
        private router: Router,
    ) {
        this.loading = false;
    }

    ngOnInit() {
        this.loading = false;
    }

    async signup() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const username = this.signupForm.get('email').value;
            const password = this.signupForm.get('password').value;
            await this.userService.register(username, password);
            this.loading = false;
            this.router.navigate(['/dashboard']);
        } catch (err) {
            this.loading = false;
            console.log(err);
            // this.alertService.openAlert('', err.message, Alerts.DANGER);
        }

    }

}
