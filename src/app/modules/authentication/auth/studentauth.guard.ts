import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const studentGuard: CanActivateFn = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const router = inject(Router);

  // allow if logged in student
  if (user && user.role === 'STUDENT') {
    return true;
  }

  // allow dev mode fallback (remove in production!)
  if (!user) {
    console.warn('No user in localStorage. Allowing access for development.');
    return true;
  }

  alert('Access denied. Only students can view this page.');
  router.navigateByUrl('/login');
  return false;
};
