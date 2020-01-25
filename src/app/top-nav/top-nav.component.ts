import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { AdminUserService } from '../admin-user.service';
import { GlobalService } from '../global.service';
import { Pages } from '../../enums/pages';
import { Access } from '../../enums/access';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

    hamburger: boolean;
    pages = Pages;
    access: any;
    timer: any;
    keymasterDrop: boolean;

    constructor(
        private router: Router,
        public route: ActivatedRoute,
        public userService: UserService,
        private adminUserService: AdminUserService,
        public globalService: GlobalService,
    ) {
        this.hamburger = false;
        this.keymasterDrop = false;
        this.access = Access;
    }

    ngOnInit() {
        this.adminUserService.searchForm.get('key').valueChanges.subscribe((val) => this.onSearchChange(val));
    }

    expandMenu() {
        this.hamburger = !this.hamburger;
    }

    nav(page: string) {
        this.hamburger = false;
        this.keymasterDrop = false;
        this.router.navigate([`/${page}`]);
    }

    getPage(page: Pages) {
        return this.router.url === `/${page}`;
    }

    logout() {
        delete this.userService.jwtService.token;
        delete this.userService.user;
        this.userService.access = [];
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    onSearchChange(key: string) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => this.search(key), 250);
    }

    async searchKey() {
        const key = this.adminUserService.searchForm.get('key').value;
        await this.search(key);
    }

    async search(key: string) {
        try {
            if (key.length >= 3) {
                this.router.navigate(['/search-users']);
                this.adminUserService.searchLoading = true;
                await this.adminUserService.search(key);
                this.adminUserService.searchLoading = false;
            }
        } catch (err) {
            this.adminUserService.searchLoading = false;
        }
    }

    toggleKeymasterDrop() {
        this.keymasterDrop = !this.keymasterDrop;
    }

}
