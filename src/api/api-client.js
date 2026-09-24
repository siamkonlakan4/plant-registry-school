import {config} from '../config.js';
export function publicGet(path,params={}){
 if(!config.api)throw Error('ยังไม่ตั้งค่า Apps Script Public URL');
 return new Promise((resolve,reject)=>{
  const cb='plantcb_'+crypto.randomUUID().replaceAll('-',''),script=document.createElement('script');
  const t=setTimeout(()=>finish(Error('การเชื่อมต่อหมดเวลา')),15000);
  function finish(e,data){clearTimeout(t);delete window[cb];script.remove();e?reject(e):data?.success?resolve(data.data):reject(Error(data?.error?.message||'เกิดข้อผิดพลาด'))}
  window[cb]=data=>finish(null,data);script.onerror=()=>finish(Error('โหลดข้อมูลไม่สำเร็จ'));
  const u=new URL(config.api);u.searchParams.set('path',path);u.searchParams.set('callback',cb);
  for(const [k,v] of Object.entries(params))if(v!==undefined&&v!=='')u.searchParams.set(k,String(v));script.src=u.href;document.head.append(script)
 })
}
// The public GitHub Pages build cannot make protected calls. Staff use the
// separate Apps Script HTML Service web app, where google.script.run calls
// verifySessionUser() on the server for every request.
export function protectedCall(){throw Error('กรุณาเปิดหน้าจัดการ Apps Script ด้วยบัญชีโรงเรียน')}
