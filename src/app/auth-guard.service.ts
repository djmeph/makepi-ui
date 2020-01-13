import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private router: Router
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        try {
            const authenticated = this.jwtService.isAuthenticated();
            if (authenticated) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        } catch (err) {
            console.error(err);
            this.router.navigate(['/login']);
            return false;
        }
    }
}
