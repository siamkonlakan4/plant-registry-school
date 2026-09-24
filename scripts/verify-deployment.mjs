import { readFileSync, existsSync } from 'node:fs';

const env = existsSync('.env')
  ? Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter(line => line.includes('=')).map(line => line.split(/=(.*)/s).slice(0, 2)))
  : {};

function isAppsScriptWebApp(value) {
  try {
    const url = new URL(value);
    // Workspace URLs can include /a/macros/<domain>/ before the deployment ID.
    return url.protocol === 'https:' && url.hostname === 'script.google.com'
      && /^\/(?:a\/macros\/[^/]+\/|macros\/)s\/[^/]+\/exec\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}

let failed = false;
const checks = [
  ['Frontend URL', /^https:\/\/.+\/$/.test(env.VITE_FRONTEND_URL || '') && !String(env.VITE_FRONTEND_URL).includes('YOUR_')],
  ['Apps Script URL', isAppsScriptWebApp(env.VITE_APPS_SCRIPT_URL)],
  ['Admin Web App URL', isAppsScriptWebApp(env.VITE_ADMIN_URL) && env.VITE_ADMIN_URL !== env.VITE_APPS_SCRIPT_URL],
  ['Admin email', !!env.ADMIN_EMAIL],
  ['Staff domain', !!env.STAFF_DOMAIN],
];
for (const [name, passed] of checks) {
  console.log((passed ? 'PASS' : 'FAIL') + ' ' + name);
  if (!passed) failed = true;
}

if (env.VITE_APPS_SCRIPT_URL) {
  try {
    const callback = 'plantcb_' + 'a'.repeat(32);
    for (const path of ['/public/settings', '/public/plants', '/public/stats']) {
      const url = new URL(env.VITE_APPS_SCRIPT_URL);
      url.searchParams.set('path', path);
      url.searchParams.set('callback', callback);
      const res = await fetch(url);
      const body = await res.text();
      const ok = res.ok && body.startsWith(callback + '(') && body.includes('"success":true');
      console.log((ok ? 'PASS' : 'FAIL') + ' ' + path);
      if (!ok) failed = true;
    }
  } catch (error) {
    console.log('FAIL public API ' + error.message);
    failed = true;
  }
}
console.log('Google resources and admin: run testBootstrap() in Apps Script editor (requires owner authorization).');
if (failed) process.exitCode = 1;
