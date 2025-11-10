import { TestBed } from '@angular/core/testing';

import { AssessmentAttemptService } from './assessment-attempt.service';

describe('AssessmentAttemptService', () => {
  let service: AssessmentAttemptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentAttemptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
