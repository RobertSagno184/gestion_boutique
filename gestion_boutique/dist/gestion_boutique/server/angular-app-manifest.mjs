
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-DUWIY74A.js",
      "chunk-ZLISLBDT.js",
      "chunk-343QSFIE.js"
    ],
    "redirectTo": "/auth/login",
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-DUWIY74A.js",
      "chunk-ZLISLBDT.js",
      "chunk-343QSFIE.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-DUWIY74A.js",
      "chunk-ZLISLBDT.js",
      "chunk-343QSFIE.js"
    ],
    "route": "/auth/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MODNRGH3.js",
      "chunk-C5P3YSZX.js",
      "chunk-T2QSNGG6.js",
      "chunk-OWUEYHN3.js",
      "chunk-YGQUHDE5.js",
      "chunk-T4NQXPKB.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-USDF7SMH.js",
      "chunk-OWUEYHN3.js",
      "chunk-YGQUHDE5.js",
      "chunk-ZLISLBDT.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/sales"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-USDF7SMH.js",
      "chunk-OWUEYHN3.js",
      "chunk-YGQUHDE5.js",
      "chunk-ZLISLBDT.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/sales/new"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-DTYKWZKC.js",
      "chunk-YRVSV536.js",
      "chunk-ZLISLBDT.js",
      "chunk-T4NQXPKB.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/expenses"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-DTYKWZKC.js",
      "chunk-YRVSV536.js",
      "chunk-ZLISLBDT.js",
      "chunk-T4NQXPKB.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/expenses/new"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-2JORDZMC.js",
      "chunk-YGQUHDE5.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "redirectTo": "/inventory/products",
    "route": "/inventory"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-2JORDZMC.js",
      "chunk-YGQUHDE5.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/inventory/products"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-2JORDZMC.js",
      "chunk-YGQUHDE5.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/inventory/products/new"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-2JORDZMC.js",
      "chunk-YGQUHDE5.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/inventory/products/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-2JORDZMC.js",
      "chunk-YGQUHDE5.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/inventory/stock"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NKRBZ3FG.js",
      "chunk-T2QSNGG6.js",
      "chunk-OWUEYHN3.js",
      "chunk-YGQUHDE5.js",
      "chunk-T4NQXPKB.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "redirectTo": "/reports/daily",
    "route": "/reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NKRBZ3FG.js",
      "chunk-T2QSNGG6.js",
      "chunk-OWUEYHN3.js",
      "chunk-YGQUHDE5.js",
      "chunk-T4NQXPKB.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/reports/daily"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-P35T4IBO.js",
      "chunk-YRVSV536.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-T4NQXPKB.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/workers"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-P35T4IBO.js",
      "chunk-YRVSV536.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-T4NQXPKB.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/workers/new"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-P35T4IBO.js",
      "chunk-YRVSV536.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-T4NQXPKB.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/workers/*/edit"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-P35T4IBO.js",
      "chunk-YRVSV536.js",
      "chunk-O4PLOT3C.js",
      "chunk-ZLISLBDT.js",
      "chunk-T4NQXPKB.js",
      "chunk-343QSFIE.js",
      "chunk-ILI3FZKD.js"
    ],
    "route": "/workers/*/payments"
  },
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 11656, hash: '74170a3f10f99b0fa822e2dc122384760d41a2f01bffd2e46d9f3e8e05a755ea', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1965, hash: '5497f244ccfbd62656bf71f57153ec91bc408568143e8af9bc537bb78599d83a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 26190, hash: '2dc3a8d1ca7ff3e42b6f636483ec0c58569e5bd995d1347de77d0febb7c5fedb', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'index.html': {size: 26033, hash: '45e8e6f68e15aebcbfbd982c4268f6b5b2f6f7e35aca638226a7ddf057a637fd', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'sales/index.html': {size: 26294, hash: '88426c61203bee136287fcb7b80fcd5c113c6e15f2e01fff70125ab33deba3d2', text: () => import('./assets-chunks/sales_index_html.mjs').then(m => m.default)},
    'expenses/index.html': {size: 26346, hash: 'e98e0d0a2d9aee4f5d93ee52ba309425a5021b1cdeed3419076b67ecb879821f', text: () => import('./assets-chunks/expenses_index_html.mjs').then(m => m.default)},
    'sales/new/index.html': {size: 26294, hash: '88426c61203bee136287fcb7b80fcd5c113c6e15f2e01fff70125ab33deba3d2', text: () => import('./assets-chunks/sales_new_index_html.mjs').then(m => m.default)},
    'expenses/new/index.html': {size: 26346, hash: 'e98e0d0a2d9aee4f5d93ee52ba309425a5021b1cdeed3419076b67ecb879821f', text: () => import('./assets-chunks/expenses_new_index_html.mjs').then(m => m.default)},
    'inventory/products/index.html': {size: 26346, hash: '8005e8d45046ee9f57395f6d9065d89522b45c51fe584c73183044580bd9cc93', text: () => import('./assets-chunks/inventory_products_index_html.mjs').then(m => m.default)},
    'auth/register/index.html': {size: 27472, hash: '5763cd770521871dfe0425a0f6901661d9f0c52be10aa9b67acbd7b6cf3d9c30', text: () => import('./assets-chunks/auth_register_index_html.mjs').then(m => m.default)},
    'reports/daily/index.html': {size: 26398, hash: '82d9c2864de61c8ed159ff7ece179ada62375cb72ff0ce2d270cc02850d61c43', text: () => import('./assets-chunks/reports_daily_index_html.mjs').then(m => m.default)},
    'inventory/stock/index.html': {size: 26346, hash: '8005e8d45046ee9f57395f6d9065d89522b45c51fe584c73183044580bd9cc93', text: () => import('./assets-chunks/inventory_stock_index_html.mjs').then(m => m.default)},
    'workers/new/index.html': {size: 26398, hash: 'f84c1138b6630bc200383475b735aaf5c8552c78d8348a247f47b0503b95ad73', text: () => import('./assets-chunks/workers_new_index_html.mjs').then(m => m.default)},
    'workers/index.html': {size: 26398, hash: '971da6b49d02ada69972f49e26a5408b0ea3ee4422631c019fda7bc7a8b68152', text: () => import('./assets-chunks/workers_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 26398, hash: '5bec76bda37af2d2215b798c0ec7eb5936c9fb03948a9ad686b3a8470187a622', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'styles-F3Z5UAJH.css': {size: 52511, hash: 'oF3Ppxpk9BM', text: () => import('./assets-chunks/styles-F3Z5UAJH_css.mjs').then(m => m.default)}
  },
};
