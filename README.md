# ระบบทะเบียนพรรณไม้โรงเรียน — ฉบับไม่ใช้ Google Cloud Console

เว็บไซต์สาธารณะรันบน GitHub Pages, อ่านรายการ published จาก Apps Script, เก็บข้อมูลใน Google Sheets และรูปใน Google Drive. เจ้าหน้าที่ใช้หน้า HTML Service ของ Apps Script ด้วยบัญชี Google Workspace ของโรงเรียน; backend อ่าน `Session.getActiveUser().getEmail()` และตรวจสิทธิ์ใน Users ทุกคำขอ. **ไม่ต้องสร้าง Google Cloud project ด้วยตนเอง, ไม่ต้องทำ OAuth Client ID และไม่ต้องผูกบัตรเครดิต**. สิทธิ์ Drive/Sheets อยู่กับเจ้าของสคริปต์ ไม่ต้องแชร์แก้ไขชีตกับเจ้าหน้าที่.

> เงื่อนไขสำคัญ: เจ้าของสคริปต์และเจ้าหน้าที่ต้องอยู่ใน Google Workspace domain เดียวกัน (`STAFF_DOMAIN`). Google ระบุว่า `getActiveUser().getEmail()` อาจคืนค่าว่างในบางบริบท; ระบบจะปฏิเสธการจัดการเมื่ออ่านอีเมลไม่ได้ ต้องทดสอบกับบัญชีเจ้าหน้าที่จริงก่อนเผยแพร่. บัญชี Gmail ส่วนตัวหรือบัญชีต่างโดเมนใช้หน้าจัดการแบบนี้ไม่ได้.

## เริ่มต้นบนเครื่อง

```bash
npm install
npm run setup:local
npm run dev
npm run test
npm run build
```

ค่าเริ่มต้น Demo Mode แสดงตัวอย่าง 5 รายการและป้าย 3 แบบ เขียนข้อมูลไม่ได้. ตัวอย่างใช้ภาพ SVG สร้างขึ้นเอง พร้อมข้อความ “Plant Sample Image”.

## ติดตั้ง Google โดยไม่เปิด Google Cloud Console

1. เจ้าของบัญชีโรงเรียนเปิด [script.google.com](https://script.google.com) → **New project**. คัดลอกไฟล์ทั้งหมดจาก `apps-script/` ลงโปรเจกต์ (นามสกุล `.gs` และ `.html` ตามชื่อเดิม), ตั้งค่า manifest `appsscript.json`. ไฟล์ `AdminQr.html` เป็นไลบรารี QR ที่ bundle ไว้ในชุด ZIP. หรือใช้ `npm run gas:login`, `npm run gas:create`, `npm run gas:push` หากเจ้าของบัญชีเปิด Apps Script API สำหรับ clasp อยู่แล้ว; วิธี manual ไม่ต้องใช้ clasp.
2. Project Settings → Script Properties ใส่ `ADMIN_EMAIL` (บัญชีแอดมินในโดเมน), `ADMIN_NAME`, `STAFF_DOMAIN` เช่น `siamkonlakan4.ac.th`, `FRONTEND_URL` เช่น `https://USERNAME.github.io/plant-registry-school/`. ถ้ามีชีต/โฟลเดอร์เดิม ใส่ `SPREADSHEET_ID` และ `DRIVE_ROOT_FOLDER_ID`.
3. เลือก `bootstrapSystem()` → Run → เจ้าของบัญชีอนุญาตสิทธิ์ Sheets/Drive. ระบบสร้างชีต, โฟลเดอร์, ผู้ดูแล, lookups และ Template. จากนั้นเลือก `seedDemoData()` → Run. คำสั่ง `npm run setup:google` และ `npm run setup:seed` แสดงขั้นตอนใน editor โดยไม่เรียก Apps Script API.
4. Deploy Web app **สองรายการจากโปรเจกต์เดียวกัน** โดยตั้ง **Execute as: Me** ทั้งคู่:
   - **Public:** Who has access: **Anyone** → เก็บ URL ลง `.env` `VITE_APPS_SCRIPT_URL`. เปิดเผยเฉพาะ public JSONP ที่เผยแพร่แล้ว.
   - **Admin:** Who has access: **Anyone within [school Workspace domain]** → เก็บ URL ลง `.env` `VITE_ADMIN_URL`. หน้า Apps Script HTML Service `?admin=1` เป็นหน้าจัดการ. ตัวเลือกนี้ขึ้นกับนโยบาย Google Workspace ของโรงเรียน; ถ้าไม่มีให้ตรวจการตั้งค่ากับผู้ดูแลโดเมนก่อน.
5. คัดลอก `.env.example` เป็น `.env`, กรอก URL จริง, เปลี่ยน `VITE_ENABLE_DEMO_MODE=false`. รัน `npm run verify`, `npm run build`. สร้าง repository `plant-registry-school` ใน GitHub แล้ว push branch `main`. GitHub → Settings → Pages → Source: GitHub Actions; ตั้ง repository variables `VITE_FRONTEND_URL`, `VITE_APPS_SCRIPT_URL`, `VITE_ADMIN_URL`, `VITE_ENABLE_DEMO_MODE=false`.

เจ้าของบัญชีต้องยืนยัน Apps Script authorization, สร้าง GitHub repository และเปิด GitHub Pages เอง. ห้าม commit `.env`, `.clasp.json` หรือสิทธิ์บัญชี. ค่า `VITE_` เป็นข้อมูลสาธารณะใน browser; ใช้เก็บ URL เท่านั้น.

## การใช้งาน

หน้าเว็บ GitHub Pages สำหรับดู/ค้นหา/สแกน QR. ปุ่มเข้าสู่ระบบเปิดหน้าจัดการ Apps Script ในแท็บใหม่. หน้า Apps Script จัดการรายชื่อพรรณไม้, อัปโหลดรูป, เปลี่ยนสถานะ (admin), เพิ่มเจ้าหน้าที่, ตั้งค่าระบบ/โลโก้, สำรอง CSV, ดูคลังภาพ, เลือก Template และพิมพ์ป้าย. Studio ใน Apps Script รองรับเพิ่มและลากองค์ประกอบ ปรับพิกัด/ขนาด บันทึก Template ใหม่. รูป public เปิด view only; บันทึก file ID ภายใน Sheets.

หากต้องแก้ backend: อัปเดตไฟล์ใน Apps Script editor แล้ว Deploy → Manage deployments → Edit ทั้ง Public และ Admin ให้ใช้ version ใหม่. URL เดิมจะคงอยู่. ปุ่ม `npm run gas:deploy` แสดงวิธี deploy สองรายการแบบ manual. ตรวจหน้า public และ admin ด้วยโทรศัพท์/บัญชี staff จริงก่อนติด QR.

## โครงสร้างและขอบเขต

`src/` เว็บไซต์ Vite; `apps-script/` backend และ admin HTML Service; `scripts/` ตัวช่วยติดตั้ง; `tests/` unit tests; `docs/` คู่มือ API ความปลอดภัยและการพิมพ์. Frontend ใช้ Vite, Vanilla JS, Konva, qrcode และ jsPDF. Admin HTML Service bundle qrcode มาในชุดไฟล์ ไม่มี CDN QR ภายนอก. Public JSONP ส่งเฉพาะ published; protected `google.script.run` อ่าน session บน Apps Script ทุกคำขอ.

ยังต้องทดสอบการอ่านอีเมล Workspace และการ deploy จริงกับบัญชีโรงเรียน. Studio ขั้นสูง เช่น group/ungroup, crop ภาพ, ruler และ bleed แบบโรงพิมพ์ยังไม่มี. PDF ผ่าน browser Print → Save as PDF ในหน้า admin; ตรวจภาพและ QR ที่พิมพ์ขนาดจริงก่อนใช้.

## รูปและสิทธิ์

ตัวอย่างใช้ placeholder SVG ที่สร้างขึ้นเอง ไม่มีรูปภาพจากบุคคลที่สาม. หากเพิ่มภาพจาก Wikimedia Commons ให้บันทึก source/author/license/attribution ใน Media; รูปที่เผยแพร่ต้องไม่มีข้อมูลส่วนบุคคลที่ไม่จำเป็น. ไลบรารีภายนอกใช้ license ตาม package ของแต่ละโครงการ.


https://script.google.com/macros/s/AKfycbwPy0yfqdcvp7_GqRxhoOofRZ1HwGhq4uTozhNu7Gn1iiKcGVTxOU66OHdMqsMAKEwaJQ/exec      //Pub

https://script.google.com/a/macros/siamkonlakan4.ac.th/s/AKfycbwIYyasiptpYMgdXgk5hE2Dsl382G3BXn33MBjRlzzluXlnWRoL25zG9Ljrn2u1FraG6g/exec      /admin