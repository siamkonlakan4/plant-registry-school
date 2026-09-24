import {existsSync,copyFileSync} from 'node:fs';if(!existsSync('.env'))copyFileSync('.env.example','.env');console.log('Edit .env privately. VITE_ variables are public in the browser.');
