import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['signup']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with all controls', () => {
    const form = component.signupForm;
    expect(form.contains('fullName')).toBeTrue();
    expect(form.contains('email')).toBeTrue();
    expect(form.contains('mobile')).toBeTrue();
    expect(form.contains('password')).toBeTrue();
    expect(form.contains('role')).toBeTrue();
  });

  it('should call signup and navigate to login on success', fakeAsync(() => {
    authServiceSpy.signup.and.returnValue(of({}));

    component.signupForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      mobile: '1234567890',
      password: 'Password@1',
      role: 'student'
    });

    component.signUp();
    tick(1000); // simulate 1-second delay

    expect(authServiceSpy.signup).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error modal and not navigate on failure', fakeAsync(() => {
    authServiceSpy.signup.and.returnValue(throwError(() => new Error('Signup failed')));

    component.signupForm.setValue({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      mobile: '0987654321',
      password: 'Password@2',
      role: 'instructor'
    });

    component.signUp();
    tick(1000); // simulate 1-second delay

    expect(authServiceSpy.signup).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
