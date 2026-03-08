import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { signal } from '@angular/core';

// Service global pour gérer l'état de chargement
export const loadingState = signal(false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Ignorer les requêtes Firebase qui ne passent pas par HttpClient
  if (req.url.includes('firebase') || req.url.includes('firestore')) {
    return next(req);
  }

  loadingState.set(true);

  return next(req).pipe(
    finalize(() => {
      loadingState.set(false);
    })
  );
};
