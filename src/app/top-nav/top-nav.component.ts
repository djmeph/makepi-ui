import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../jwt.service';
import { Pages } from '../../enums/pages';
import * as config from 'config.json';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {

    hamburger: boolean;
    pages = Pages;
    config = config;

    constructor(
        private router: Router,
        public route: ActivatedRoute,
        public jwtService: JwtService,
    ) {
        this.hamburger = false;
    }

    expandMenu() {
        this.hamburger = !this.hamburger;
    }

    nav(page: string) {
        this.hamburger = false;
        this.router.navigate([`/${page}`]);
    }

    getPage(page: Pages) {
        return this.router.url === `/${page}`;
    }

    logout() {
        delete this.jwtService.token;
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

}
