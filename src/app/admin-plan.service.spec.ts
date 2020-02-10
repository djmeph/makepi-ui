import { TestBed } from '@angular/core/testing';

import { AdminPlanService } from './admin-plan.service';

describe('AdminPlanService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: AdminPlanService = TestBed.get(AdminPlanService);
        expect(service).toBeTruthy();
    });
});
