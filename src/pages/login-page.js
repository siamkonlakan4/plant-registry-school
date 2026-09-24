import {config} from '../config.js';
export async function login(el){
 const url=config.admin?new URL(config.admin):null;if(url)url.searchParams.set('admin','1');
 el.innerHTML='<section class="panel narrow"><div class="eyebrow">STAFF ACCESS</div><h1>เข้าสู่ระบบเจ้าหน้าที่</h1><p>เปิดหน้าจัดการด้วยบัญชี Google Workspace ของโรงเรียน ระบบตรวจอีเมลและสิทธิ์จากทะเบียน Users โดยอัตโนมัติ</p><div id="login-action"></div><p class="hint">บัญชีนอกโดเมนโรงเรียนหรือบัญชีที่ยังไม่อยู่ในรายชื่อเจ้าหน้าที่จะจัดการข้อมูลไม่ได้</p></section>';
 const box=el.querySelector('#login-action');if(config.demo){box.textContent='โหมดตัวอย่าง: ดูข้อมูลได้เท่านั้น';return}
 if(!url){box.textContent='ยังไม่ได้ตั้งค่า VITE_ADMIN_URL';return}
 const a=document.createElement('a');a.className='button';a.href=url.href;a.textContent='เปิดหน้าจัดการด้วยบัญชีโรงเรียน';a.target='_blank';a.rel='noopener noreferrer';box.append(a)
}
