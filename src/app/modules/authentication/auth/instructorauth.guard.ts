import { inject } from '@angular/core';
import { CanActivateFn,CanActivate, Router } from '@angular/router';

export const instructorGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if(!token || !user ){
    router.navigate(['/login']);
    return false;
  }
  
  if (user.role !== 'INSTRUCTOR') {
    alert('Access denied. Only instructors can view this page.');
  router.navigateByUrl('/login');
  return false;

  }
  return true;
  
};
