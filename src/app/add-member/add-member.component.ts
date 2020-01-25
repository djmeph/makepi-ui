import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminUserService } from '../admin-user.service';

@Component({
    selector: 'app-add-member',
    templateUrl: './add-member.component.html',
    styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

    loading: boolean;
    memberStatus = {} as any;
    memberForm = new FormGroup({
        primaryFirstName: new FormControl(this.memberStatus.primaryFirstName, [Validators.required]),
        primaryMiddleName: new FormControl(this.memberStatus.primaryMiddleName),
        primaryLastName: new FormControl(this.memberStatus.primaryLastName, [Validators.required]),
        primaryEmail: new FormControl(this.memberStatus.primaryEmail, [Validators.required, Validators.email]),
        primaryPhone: new FormControl(this.memberStatus.primaryPhone, [Validators.required]),
        emergencyFirstName: new FormControl(this.memberStatus.emergencyFirstName, [Validators.required]),
        emergencyMiddleName: new FormControl(this.memberStatus.emergencyMiddleName),
        emergencyLastName: new FormControl(this.memberStatus.emergencyLastName, [Validators.required]),
        emergencyPhone: new FormControl(this.memberStatus.emergencyPhone, [Validators.required]),
        emergencyRelation: new FormControl(this.memberStatus.emergencyRelation, [Validators.required]),
    });

    constructor(
        private adminUserService: AdminUserService,
    ) {
        this.loading = false;
    }

    ngOnInit() {
        this.loading = false;
    }

    async save() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        const userPayload = {
            username: this.memberForm.get('primaryEmail').value,
            access: [],
            active: 1,
            verificationCode: this.adminUserService.randomCodeGenerator(16)
        };
        const primaryContactPayload = {
            firstName: this.memberForm.get('primaryFirstName').value,
            middleName: this.memberForm.get('primaryMiddleName').value,
            lastName: this.memberForm.get('primaryLastName').value,
            email: this.memberForm.get('primaryEmail').value,
            phone: this.memberForm.get('primaryPhone').value,
        };
        const emergencyContactPayload = {
            firstName: this.memberForm.get('emergencyFirstName').value,
            middleName: this.memberForm.get('emergencyMiddleName').value,
            lastName: this.memberForm.get('emergencyLastName').value,
            phone: this.memberForm.get('emergencyPhone').value,
            relation: this.memberForm.get('emergencyRelation').value,
        };

    }

}
