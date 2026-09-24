function doGet(e){
  if(String(e.parameter.admin||'')==='1')return HtmlService.createTemplateFromFile('Admin').evaluate().setTitle('จัดการทะเบียนพรรณไม้');
  return jsonp(safe(()=>publicRoute(String(e.parameter.path||''),e.parameter)),e.parameter.callback);
}
function authorizedCall(path,x){
  const u=verifySessionUser();
  if(!['/auth/verify','/me','/me/settings','/me/plants','/me/plant','/admin/media','/admin/activity-log','/admin/plants/export'].includes(path)){
    if(!['/admin/settings','/admin/users','/admin/templates'].includes(path)||Object.keys(x||{}).length)throttle(u);
  }
  return privateRoute(path,x||{},u);
}
// Native HTML Service UI communicates through google.script.run. Each call
// checks active email and the Users sheet again; no role or email is accepted.
function adminCall(path,payload){return safe(()=>authorizedCall(String(path||''),payload||{}))}
// Kept for automation and same-domain clients. No protected GET/JSONP writes.
function doPost(e){const p=e.parameter||{},result=safe(()=>{
  let x={};try{x=JSON.parse(p.payload||'{}')}catch(_){throw apiError('INVALID_INPUT','รูปแบบข้อมูลไม่ถูกต้อง')}
  return authorizedCall(String(p.path||''),x)
});return postReply(result,String(p.id||'').slice(0,60))}

function include(filename){return HtmlService.createHtmlOutputFromFile(filename).getContent()}
