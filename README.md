# ระบบจัดหาคอมพิวเตอร์ภาครัฐ (Vite + Supabase)
> **สำนักงานสาธารณสุขจังหวัดสระแก้ว**

ระบบบริหารและจัดหาระบบคอมพิวเตอร์ภาครัฐ เวอร์ชัน 2.0 พัฒนาด้วย **Vite + Vanilla JS + Supabase (PostgreSQL) + Google Gemini 3.8 Flash AI**

---

### 📖 เอกสารระบบ
รายละเอียดสถาปัตยกรรม ฟังก์ชันการทำงาน โครงสร้างฐานข้อมูล Supabase และคู่มือระบบ:
- 📑 **[SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)**: ภาพรวมของระบบรวมทั้ง 3 ภารกิจ (จัดหาคอมพิวเตอร์, พรบ.ไซเบอร์, และ PDPA/ROPA)
- 🛡️ **[CYBER_SECURITY_SYSTEM.md](./CYBER_SECURITY_SYSTEM.md)**: เอกสารระบบงาน พรบ.ไซเบอร์ & CII ฉบับสมบูรณ์ (CII Self Assessment, 80 หัวข้อ, BIA, Risk Register, Third Party, KRI, Incidents)

---

### 🚀 การติดตั้งและรันระบบ
```bash
# ติดตั้ง dependencies
npm install

# รันโหมด Development
npm run dev

# บิลด์สำหรับ Production
npm run build
```

---

### 📂 โครงสร้างโปรเจกต์
- `index.html`: แดชบอร์ดสาธารณะสำหรับผู้เข้าร่วมประชุมทั่วไป
- `admin.html`: ระบบงานเลขาและการประชุมคณะกรรมการ (มีระบบยืนยันตัวตน)
- `src/dashboard.js`: ควบคุมหน้าแดชบอร์ด
- `src/admin.js`: ควบคุมหน้า Admin, แบบฟอร์ม, บันทึกมติ
- `src/lib/minutes.js`: โมดูลสร้างรายงานการประชุมระเบียบงานสารบรรณ
- `src/lib/summary.js`: โมดูลสร้างแบบสรุปการจัดหาฯ (A4 แนวนอน)
- `src/lib/supabase.js`: การเชื่อมต่อฐานข้อมูล Supabase และ Gemini API
- `scripts/migrate.js`: สคริปต์ไมเกรตข้อมูลเดิมจาก Google Sheets สู่ Supabase
