import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const instructorGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user && user.role === 'INSTRUCTOR') {
    return true;
  }

  if (!user) {
    // console.warn(' No user in localStorage. Allowing access for development (instructorGuard).');
    // return true;
    return true;
  }

  alert('Access denied. Only instructors can view this page.');
  router.navigateByUrl('/login');
  return false;
};
