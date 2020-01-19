import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { SignupComponent } from './signup/signup.component';

import { HttpInterceptorService } from './http-interceptor.service';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { SearchUsersComponent } from './search-users/search-users.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        PageNotFoundComponent,
        DashboardComponent,
        TopNavComponent,
        SignupComponent,
        RecoverPasswordComponent,
        ActiveUsersComponent,
        SearchUsersComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule { }

