import { AbstractControl } from '@angular/forms';

export class CustomValidator {
    // Number only validation
    static numeric(control: AbstractControl) {
        const val = control.value;

        if (Number.isNaN(val)) {
            return { invalidNumber: true };
        }

        return null;
    }

    static planId(control: AbstractControl) {
        const val = control.value || '';
        const stripUnknown = val.replace(/[^a-z-]+/, '');

        if (stripUnknown === val) {
            return null;
        }

        return { invalidplanId: true };
    }
}
