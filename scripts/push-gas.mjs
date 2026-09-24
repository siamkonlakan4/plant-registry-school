import {execFileSync} from 'node:child_process';execFileSync('node',['scripts/build-admin.mjs'],{stdio:'inherit'});execFileSync('npx',['clasp','push','-f'],{stdio:'inherit'});
