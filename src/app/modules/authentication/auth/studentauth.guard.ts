import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const studentGuard: CanActivateFn = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const router=inject(Router)
  if (user && user.role === 'student') {
    return true;
  }

  alert('Access denied. Only students can view this page.');
  router.navigateByUrl('/login')
  return false;
};
