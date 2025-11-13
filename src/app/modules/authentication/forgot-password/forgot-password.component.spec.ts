import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UsersService', ['findAccount']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      providers: [
        { provide: UsersService, useValue: userSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call findAccount and navigate to reset-password on success', fakeAsync(() => {
    userServiceSpy.findAccount.and.returnValue(of({}));
    component.email = 'test@example.com';

    component.searchAccount();
    tick(1000); // simulate 1-second delay

    expect(userServiceSpy.findAccount).toHaveBeenCalledWith('test@example.com');
    expect(component.accountFound).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/reset-password'], {
      queryParams: { email: 'test@example.com' }
    });
  }));

  it('should show error modal and not navigate on failure', fakeAsync(() => {
    userServiceSpy.findAccount.and.returnValue(throwError(() => new Error('Account not found')));
    component.email = 'fail@example.com';

    component.searchAccount();
    tick(1000);

    expect(userServiceSpy.findAccount).toHaveBeenCalledWith('fail@example.com');
    expect(component.accountFound).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
