import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ✅ Allow if logged in as instructor
  if (user && user.role === 'instructor') {
    return true;
  }

  // ✅ Dev fallback: if no user in storage, allow (remove later in production!)
  if (!user) {
    console.warn('⚠️ No user in localStorage. Allowing access for development (instructorGuard).');
    return true;
  }

  // ❌ Deny if not an instructor
  alert('Access denied. Only instructors can view this page.');
  router.navigateByUrl('/login');
  return false;
};
