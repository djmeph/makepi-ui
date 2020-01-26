import { TestBed } from '@angular/core/testing';

import { AdminContactService } from './admin-contact.service';

describe('AdminContactService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminContactService = TestBed.get(AdminContactService);
    expect(service).toBeTruthy();
  });
});
