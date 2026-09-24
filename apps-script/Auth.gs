// No custom OAuth client or browser-supplied identity. The owner deploys this
// web app inside the school's Workspace domain and it runs as the owner.
// A blank active email fails closed; never fall back to the effective user,
// which is always the owner in execute-as-owner deployments.
function verifySessionUser(){
  const email=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
  const domain=String(cfg('STAFF_DOMAIN')||String(cfg('ADMIN_EMAIL')).split('@')[1]||'').toLowerCase();
  if(!email||!domain||!email.endsWith('@'+domain))throw apiError('UNAUTHORIZED','ไม่สามารถยืนยันบัญชีโรงเรียนได้ กรุณาเปิดจากบัญชี Google Workspace ของโรงเรียน');
  const user=rows('Users').find(x=>String(x.email).toLowerCase()===email&&String(x.active)==='true');
  if(!user)throw apiError('FORBIDDEN','บัญชีนี้ยังไม่ได้รับสิทธิ์ กรุณาติดต่อผู้ดูแล');
  return {email:user.email,full_name:user.full_name,role:user.role,user_id:user.user_id};
}
function allow(user,roles){if(!roles.includes(user.role))throw apiError('FORBIDDEN','ไม่มีสิทธิ์ดำเนินการ')}
function throttle(user){const cache=CacheService.getScriptCache(),key='w_'+Utilities.base64EncodeWebSafe(user.email).slice(0,100),count=Number(cache.get(key)||0);if(count>=30)throw apiError('RATE_LIMIT','คำขอมากเกินไป กรุณารอสักครู่');cache.put(key,String(count+1),60)}
