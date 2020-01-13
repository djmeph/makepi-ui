import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {

    loading: boolean;

    recoverStatus = {} as any;

    recoverForm = new FormGroup({
        email: new FormControl(this.recoverStatus.email, [Validators.required, Validators.email])
    });

    constructor() { }

    recover() {

    }

}
