import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { instructorauthGuard } from './instructorauth.guard';

describe('instructorauthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => instructorauthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
