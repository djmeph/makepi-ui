import { TestBed } from '@angular/core/testing';

import { GlboalService } from './glboal.service';

describe('GlboalService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: GlboalService = TestBed.get(GlboalService);
        expect(service).toBeTruthy();
    });
});
