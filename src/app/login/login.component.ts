import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loading: boolean;

    loginStatus = {} as any;

    loginForm = new FormGroup({
        email: new FormControl(this.loginStatus.email, [Validators.required, Validators.email]),
        password: new FormControl(this.loginStatus.password, [Validators.required])
    });

    constructor(
        private router: Router,
    ) {
        this.loading = false;
    }

    ngOnInit() {
        this.loading = false;
    }

    async login() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        const username = this.loginForm.get('email').value.toLowerCase();
        const password = this.loginForm.get('password').value;
        try {

        } catch (err) {

        }
    }

    recover() {
        this.router.navigate(['/recover-password']);
    }

}
