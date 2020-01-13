import { Component } from '@angular/core';
import { JwtService } from './jwt.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'makepi-ui';

    constructor(
        private jwtService: JwtService,
    ) {
        this.jwtService.token = localStorage.getItem('token');
    }
}
