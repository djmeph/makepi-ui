import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(): boolean {
        try {
            const authenticated = this.userService.jwtService.isAuthenticated();
            if (authenticated) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        } catch (err) {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
