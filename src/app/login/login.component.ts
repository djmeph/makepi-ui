import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

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
        password: new FormControl(this.loginStatus.password, [Validators.required]),
        remember: new FormControl(this.loginStatus.remember, []),
    });

    constructor(
        private router: Router,
        private userService: UserService,
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
        const remember = !!this.loginForm.get('remember').value;
        try {
            await this.userService.login(username, password, remember);
            this.router.navigate(['/dashboard']);
            this.loading = false;
        } catch (err) {
            console.error(err);
            this.loading = false;
        }
    }

    recover() {
        this.router.navigate(['/recover-password']);
    }

}
