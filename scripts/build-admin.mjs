import {build} from 'esbuild';import {writeFileSync} from 'node:fs';
const result=await build({stdin:{contents:"import QRCode from 'qrcode';window.PlantQR=QRCode;",resolveDir:process.cwd(),sourcefile:'admin-qr.js'},bundle:true,write:false,format:'iife',platform:'browser',target:'es2018',minify:true});
writeFileSync('apps-script/AdminQr.html','<script>'+result.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script>\n');console.log('Built offline QR dependency for Apps Script admin');
