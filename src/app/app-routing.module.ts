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
import { PlansComponent } from './plans/plans.component';
import { EditPlanComponent } from './edit-plan/edit-plan.component';
import { ActiveMembersComponent } from './active-members/active-members.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { NewPlanComponent } from './new-plan/new-plan.component';
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
        path: 'add-member',
        component: AddMemberComponent,
        canActivate: [AuthGuard, AccessGuardService],
        data: { roles: [Access.ADMIN, Access.KEYMASTER] }
    },
    {
        path: 'edit-member/:userId',
        component: EditMemberComponent,
        canActivate: [AuthGuard, AccessGuardService],
        data: { roles: [Access.ADMIN, Access.KEYMASTER] }
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
        path: 'plans',
        component: PlansComponent,
        canActivate: [AuthGuard, AccessGuardService],
        data: { roles: [Access.ADMIN, Access.KEYMASTER] }
    },
    {
        path: 'edit-plan/:planId',
        component: EditPlanComponent,
        canActivate: [AuthGuard, AccessGuardService],
        data: { roles: [Access.ADMIN, Access.KEYMASTER] }
    },
    {
        path: 'new-plan',
        component: NewPlanComponent,
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
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
