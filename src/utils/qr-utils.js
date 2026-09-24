export function plantUrl(base,id){if(!/^PLT-\d{4,}$/.test(id))throw Error('plant_id ไม่ถูกต้อง');return new URL(base).href.split('#')[0].replace(/\/?$/,'/')+'#/plant/'+encodeURIComponent(id)}
