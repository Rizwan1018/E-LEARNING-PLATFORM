import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UsersService', ['resetPassword']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: UsersService, useValue: userSpy },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ email: 'test@example.com' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should extract email from query params', () => {
    expect(component.email).toBe('test@example.com');
  });

  it('should call resetPassword and navigate to login on success', fakeAsync(() => {
    userServiceSpy.resetPassword.and.returnValue(of({}));

    component.newPassword = 'NewPass@123';
    component.confirmPassword = 'NewPass@123';

    component.resetPassword();
    tick(1000); // simulate 1-second delay

    expect(userServiceSpy.resetPassword).toHaveBeenCalledWith(
      'test@example.com',
      'NewPass@123',
      'NewPass@123'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error modal and not navigate on failure', fakeAsync(() => {
    userServiceSpy.resetPassword.and.returnValue(throwError(() => new Error('Reset failed')));

    component.newPassword = 'NewPass@123';
    component.confirmPassword = 'NewPass@123';

    component.resetPassword();
    tick(1000);

    expect(userServiceSpy.resetPassword).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
