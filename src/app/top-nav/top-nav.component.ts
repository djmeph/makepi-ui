import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Pages } from '../../enums/pages';
import * as config from 'config.json';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

    hamburger: boolean;
    pages = Pages;
    config = config;

    constructor(
        private router: Router,
        public route: ActivatedRoute,
        public userService: UserService,
    ) {
        this.hamburger = false;
    }

    ngOnInit() {
        console.log(this.config);
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
        delete this.userService.jwtToken;
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

}
