import {defineConfig,loadEnv} from 'vite';
export default defineConfig(({mode})=>{const e=loadEnv(mode,process.cwd(),'VITE_');const u=new URL(e.VITE_FRONTEND_URL||'https://example.github.io/plant-registry-school/');return {base:u.pathname,server:{host:true}}});
