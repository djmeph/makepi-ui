import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RecoverCodeComponent } from './recover-code/recover-code.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { ActiveMembersComponent } from './active-members/active-members.component';
import { AuthGuardService as AuthGuard } from './auth.guard.service';
import { AccessGuardService } from './access.guard.service';
import { Access } from '../enums/access';


const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent
    },
    {
        path: 'recover-code/:email',
        component: RecoverCodeComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'active-members',
        component: ActiveMembersComponent,
        canActivate: [AuthGuard, AccessGuardService],
        data: { roles: [Access.ADMIN, Access.KEYMASTER] }
    },
    {
        path: 'active-users',
        component: ActiveUsersComponent,
        canActivate: [AuthGuard, AccessGuardService],
        data: { roles: [Access.ADMIN, Access.KEYMASTER] }
    },
    {
        path: 'search-users',
        component: SearchUsersComponent,
        canActivate: [AuthGuard, AccessGuardService],
        data: { roles: [Access.ADMIN, Access.KEYMASTER] }
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full' },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
