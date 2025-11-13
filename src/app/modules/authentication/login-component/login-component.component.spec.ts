import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponentComponent } from './login-component.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponentComponent', () => {
  let component: LoginComponentComponent;
  let fixture: ComponentFixture<LoginComponentComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponentComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponentComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should call login and navigate to student route on success', fakeAsync(() => {
    const mockResponse = { role: 'STUDENT', id: '123' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({
      email: 'student@example.com',
      password: 'Password123'
    });

    component.login();
    tick(1000); // simulate 1-second delay

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['student'], { queryParams: { id: '123' } });
  }));

  it('should call login and navigate to instructor route on success', fakeAsync(() => {
    const mockResponse = { role: 'INSTRUCTOR', id: '456' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({
      email: 'instructor@example.com',
      password: 'Password123'
    });

    component.login();
    tick(1000);

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['instructor'], { queryParams: { id: '456' } });
  }));

  it('should call login and navigate to home route on unknown role', fakeAsync(() => {
    const mockResponse = { role: 'ADMIN', id: '789' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'Password123'
    });

    component.login();
    tick(1000);

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  }));

  it('should show error modal and not navigate on login failure', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.loginForm.setValue({
      email: 'fail@example.com',
      password: 'wrongpassword'
    });

    component.login();
    tick(1000);

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});

