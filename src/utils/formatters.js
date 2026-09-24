export const date=v=>v?new Date(v).toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}):'—';
