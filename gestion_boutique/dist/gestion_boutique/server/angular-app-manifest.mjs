
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
      "chunk-CMG2T3ZH.js",
      "chunk-X6GXOMHM.js",
      "chunk-CGMNICK6.js"
    ],
    "redirectTo": "/auth/login",
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CMG2T3ZH.js",
      "chunk-X6GXOMHM.js",
      "chunk-CGMNICK6.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CMG2T3ZH.js",
      "chunk-X6GXOMHM.js",
      "chunk-CGMNICK6.js"
    ],
    "route": "/auth/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7MIKDUBU.js",
      "chunk-C5P3YSZX.js",
      "chunk-SMJDT4SR.js",
      "chunk-JNK3MDTZ.js",
      "chunk-4WOGKLYL.js",
      "chunk-H7F3S6AS.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NAI5F6KT.js",
      "chunk-JNK3MDTZ.js",
      "chunk-4WOGKLYL.js",
      "chunk-X6GXOMHM.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/sales"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NAI5F6KT.js",
      "chunk-JNK3MDTZ.js",
      "chunk-4WOGKLYL.js",
      "chunk-X6GXOMHM.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/sales/new"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-LRTV63BX.js",
      "chunk-YRVSV536.js",
      "chunk-X6GXOMHM.js",
      "chunk-H7F3S6AS.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/expenses"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-LRTV63BX.js",
      "chunk-YRVSV536.js",
      "chunk-X6GXOMHM.js",
      "chunk-H7F3S6AS.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/expenses/new"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-Z3VVZL2E.js",
      "chunk-4WOGKLYL.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "redirectTo": "/inventory/products",
    "route": "/inventory"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-Z3VVZL2E.js",
      "chunk-4WOGKLYL.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/inventory/products"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-Z3VVZL2E.js",
      "chunk-4WOGKLYL.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/inventory/products/new"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-Z3VVZL2E.js",
      "chunk-4WOGKLYL.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/inventory/products/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-Z3VVZL2E.js",
      "chunk-4WOGKLYL.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/inventory/stock"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X4SAKJEB.js",
      "chunk-SMJDT4SR.js",
      "chunk-JNK3MDTZ.js",
      "chunk-4WOGKLYL.js",
      "chunk-H7F3S6AS.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "redirectTo": "/reports/daily",
    "route": "/reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-X4SAKJEB.js",
      "chunk-SMJDT4SR.js",
      "chunk-JNK3MDTZ.js",
      "chunk-4WOGKLYL.js",
      "chunk-H7F3S6AS.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/reports/daily"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VX7YVBSO.js",
      "chunk-YRVSV536.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-H7F3S6AS.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/workers"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VX7YVBSO.js",
      "chunk-YRVSV536.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-H7F3S6AS.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/workers/new"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-VX7YVBSO.js",
      "chunk-YRVSV536.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-H7F3S6AS.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
    ],
    "route": "/workers/*/edit"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-VX7YVBSO.js",
      "chunk-YRVSV536.js",
      "chunk-BPNM3BSN.js",
      "chunk-X6GXOMHM.js",
      "chunk-H7F3S6AS.js",
      "chunk-CGMNICK6.js",
      "chunk-EYGCFY5Q.js"
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
    'index.csr.html': {size: 11656, hash: '7255ad96a754ae3bc7620e2f803928bf8d441475b918394ef0fa5a14f0d61bfd', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1965, hash: '22ac9362aa4c859156d3f0eb0da19423e248313fec4106ea0211108d44954f57', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/register/index.html': {size: 27472, hash: '5a4251e07f0eda2abfb4b6a67dd47570409d1a67f52ff76bec2fc90f9d10fe24', text: () => import('./assets-chunks/auth_register_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 26148, hash: '683cb1ea6a56650ee18f62e886613cfed188b625e08b8279ecfd8b039f984652', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'index.html': {size: 25991, hash: 'a0a2b5866564512493e9e29f70593c3da2d367fe35a9356ed6de81d7e4db0b53', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'sales/new/index.html': {size: 26252, hash: 'cb2d18624581e2756fbc76233095064bb0cb2ffdda8b14ef24eb065653ee29f3', text: () => import('./assets-chunks/sales_new_index_html.mjs').then(m => m.default)},
    'sales/index.html': {size: 26252, hash: 'adc157396dddd483c78c24a551e4c88eae45728ee62d4cb40c35a6e1eece8d65', text: () => import('./assets-chunks/sales_index_html.mjs').then(m => m.default)},
    'expenses/new/index.html': {size: 26304, hash: 'eeb2884b1bfa438cd8d03d8dabc6d3f4101695c9bf7b7a0a49919d119ae37553', text: () => import('./assets-chunks/expenses_new_index_html.mjs').then(m => m.default)},
    'expenses/index.html': {size: 26304, hash: 'eeb2884b1bfa438cd8d03d8dabc6d3f4101695c9bf7b7a0a49919d119ae37553', text: () => import('./assets-chunks/expenses_index_html.mjs').then(m => m.default)},
    'inventory/stock/index.html': {size: 26304, hash: '92ba683f51df19a797c94473b1cdc341442aaa0a05fda83aa59bac398b2db25a', text: () => import('./assets-chunks/inventory_stock_index_html.mjs').then(m => m.default)},
    'inventory/products/index.html': {size: 26304, hash: 'df34343b3d32dc52fa9fd23658e9bb3304b29a6b5d72bc19bba851f969ee3f3c', text: () => import('./assets-chunks/inventory_products_index_html.mjs').then(m => m.default)},
    'reports/daily/index.html': {size: 26356, hash: '60bea0f22914b2b4fa33ca758bb8f55adb3f924313ccd46b1dd66f562dac9523', text: () => import('./assets-chunks/reports_daily_index_html.mjs').then(m => m.default)},
    'workers/index.html': {size: 26356, hash: 'c97015d39a8352922d2c0a1561998657989b65e0985eda35e288b9f7bf5e982f', text: () => import('./assets-chunks/workers_index_html.mjs').then(m => m.default)},
    'workers/new/index.html': {size: 26356, hash: '9aa619684f4988135ff7cdc7f863caeaeacc1fbdf667821909e341cab82e129a', text: () => import('./assets-chunks/workers_new_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 26356, hash: 'e73304ca6597299c253bcabd62f65c43609312a5aa00bc8c0ce39242dbcebc59', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'styles-F3Z5UAJH.css': {size: 52511, hash: 'oF3Ppxpk9BM', text: () => import('./assets-chunks/styles-F3Z5UAJH_css.mjs').then(m => m.default)}
  },
};
