import { Component } from '@angular/core';
import { UserService } from './user.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'makepi-ui';

    constructor(
        private userService: UserService,
    ) {
        this.userService.jwtToken = localStorage.getItem('token');
    }
}
