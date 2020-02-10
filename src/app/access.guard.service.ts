import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Access } from '../enums/access';

@Injectable({
    providedIn: 'root'
})
export class AccessGuardService implements CanActivate {

    constructor(
        private userService: UserService,
        private router: Router,
    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot
    ): Promise<boolean> {
        if (!this.userService.user) {
            await this.userService.get();
        }
        if (this.userService.getAccess(route.data.roles)) {
            return true;
        } else {
            this.router.navigate(['/page-not-found']);
            return false;
        }
    }
}
