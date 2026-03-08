import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/firebase/auth.service';
import { from, switchMap } from 'rxjs';
import { getFirebaseAuth } from '../services/firebase/firebase.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    return from(currentUser.getIdToken()).pipe(
      switchMap(token => {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(clonedReq);
      })
    );
  }

  return next(req);
};
