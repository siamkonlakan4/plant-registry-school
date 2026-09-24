# Troubleshooting

- Admin เข้าระบบไม่ได้: ตรวจว่าเปิด Admin deployment URL ด้วยบัญชี Workspace ใน `STAFF_DOMAIN`, บัญชีอยู่ใน Users และสถานะ active. ถ้า Apps Script อ่าน ActiveUser email เป็นค่าว่าง ให้ตรวจนโยบายโดเมน; ระบบจะปฏิเสธแทนการเดาอีเมล.
- Public ไม่แสดงข้อมูล: ตรวจ URL Public deployment, published status, `VITE_ENABLE_DEMO_MODE=false` และ Script Properties `FRONTEND_URL`.
- รูปไม่แสดง: ตรวจนโยบาย Drive ที่อนุญาต Anyone with link แบบดูอย่างเดียว.
- ป้ายไม่ตรงขนาด: พิมพ์ A4 แบบ Actual size, ปิด header/footer และทดสอบสแกน QR.
- GitHub Pages asset 404: `VITE_FRONTEND_URL` ต้องลงท้าย `/plant-registry-school/` ก่อน build.
- clasp ขอ Apps Script API: ใช้การคัดลอกไฟล์และ deploy ใน editor ตาม README; ไม่จำเป็นต้องเปิด Cloud Console.
