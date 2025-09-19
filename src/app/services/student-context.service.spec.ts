import { TestBed } from '@angular/core/testing';

import { StudentContextService } from './student-context.service';

describe('StudentContextService', () => {
  let service: StudentContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
