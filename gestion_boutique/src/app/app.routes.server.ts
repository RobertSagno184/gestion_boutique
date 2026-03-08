import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'inventory/products/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'workers/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'workers/:id/payments',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
