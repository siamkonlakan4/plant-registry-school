# Architecture

```text
ผู้ชม → GitHub Pages → public JSONP GET → Apps Script Public deployment
                                    → published Plants/Settings → Google Sheets
เจ้าหน้าที่ → Apps Script Admin deployment (Workspace domain only)
           → HTML Service + google.script.run
           → Session.getActiveUser().getEmail() + domain + Users Sheet
           → validation + LockService + CacheService → Sheets/Drive + Activity_Log
```

Deploy ทั้งสองรายการจากโค้ดเดียวกันและ Execute as Me เพื่อคง Sheets/Drive ภายใต้เจ้าของ. บน Public deployment endpoint เขียนยังตรวจอีเมลโดเมนและ Users; บุคคลทั่วไปไม่ผ่าน. หน้า Admin ไม่ส่ง role/email/secret เพื่อใช้ยืนยันสิทธิ์. หาก ActiveUser email ว่าง ระบบปฏิเสธ. สถานะ public เฉพาะ published. QR ใช้ plant_id ใน hash route.
