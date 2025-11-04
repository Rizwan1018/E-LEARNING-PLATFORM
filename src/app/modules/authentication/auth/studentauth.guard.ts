import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const studentGuard: CanActivateFn = () => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const router = inject(Router);

  if(!token || !user){
    router.navigate(['/login'])
    return false;
  }

  // allow if logged in student
  if (user.role !== 'STUDENT') {
  alert('Access denied. Only students can view this page.');
  router.navigateByUrl('/login');
  return false;
  }
  return true;
};
