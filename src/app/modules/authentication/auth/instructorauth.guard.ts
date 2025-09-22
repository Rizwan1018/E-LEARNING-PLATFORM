import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router)
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user && user.role === 'instructor') {
    return true;
  }

  alert('Access denied. Only instructors can view this page.');
  router.navigateByUrl('/login')
  return false;
};
