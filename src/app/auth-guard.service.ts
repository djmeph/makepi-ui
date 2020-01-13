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

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            const authenticated = await this.jwtService.isAuthenticated();
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
