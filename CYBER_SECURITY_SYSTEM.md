# เอกสารระบบงาน: ระบบบริหารจัดการความมั่นคงปลอดภัยไซเบอร์และหน่วยงานโครงสร้างพื้นฐานสำคัญทางสารสนเทศ (Cybersecurity & CII Management System)
> **สำนักงานสาธารณสุขจังหวัดสระแก้ว (สสจ.สระแก้ว)**  
> **ที่ตั้งโปรเจกต์:** `/Users/piyanatvichian/Documents/app_antigravity2.0/find-computer`  
> **ไฟล์หลักของระบบ:** `src/modules/cyber/index.js`  
> **สคริปต์ฐานข้อมูล Supabase:** `supabase_cyber_schema.sql`  
> **เวอร์ชันปัจจุบัน:** 3.5 (Enterprise Web-based Suite / Fully Interactive / Offline-First Cache + Supabase Cloud Sync)

---

## สารบัญ (Table of Contents)
1. [บทนำและบริบทของระบบ (Introduction & Regulatory Context)](#1-บทนำและบริบทของระบบ)
2. [สถาปัตยกรรมทางเทคนิคและการออกแบบระบบ (Architecture & Engineering)](#2-สถาปัตยกรรมทางเทคนิคและการออกแบบระบบ)
3. [โครงสร้างไฟล์และแผนผังโมดูล (File Structure & Module Map)](#3-โครงสร้างไฟล์และแผนผังโมดูล)
4. [รายละเอียดฟังก์ชัน 3 แท็บหลัก (Core Features & Subsystems)](#4-รายละเอียดฟังก์ชัน-3-แท็บหลัก)
   - [4.1 แท็บที่ 1: แบบประเมิน CII Self Assessment](#41-แท็บที่-1-แบบประเมิน-cii-self-assessment)
   - [4.2 แท็บที่ 2: ประมวลแนวทางปฏิบัติและกรอบมาตรฐาน (คลัง 80 หัวข้อ)](#42-แท็บที่-2-ประมวลแนวทางปฏิบัติและกรอบมาตรฐาน-คลัง-80-หัวข้อ)
     - [1.2 ทะเบียนทรัพย์สินสารสนเทศ (Asset Inventory List)](#12-ทะเบียนทรัพย์สินสารสนเทศ-asset-inventory-list)
     - [1.3 ทะเบียนทรัพย์สินระบบบริการสำคัญ (Asset Register)](#13-ทะเบียนทรัพย์สินระบบบริการสำคัญ-asset-register)
     - [1.4 การประเมินความเสี่ยงระดับทรัพย์สิน (Risk Assessment of Asset)](#14-การประเมินความเสี่ยงระดับทรัพย์สิน-risk-assessment-of-asset)
     - [1.6 การวิเคราะห์ผลกระทบทางธุรกิจ (BIA Evident)](#16-การวิเคราะห์ผลกระทบทางธุรกิจ-bia-evident)
     - [1.7 รายงานการวิเคราะห์ผลกระทบทางธุรกิจ (BIA Report)](#17-รายงานการวิเคราะห์ผลกระทบทางธุรกิจ-bia-report)
     - [2.2 ทะเบียนความเสี่ยง (Risk Register)](#22-ทะเบียนความเสี่ยง-risk-register)
     - [2.3 การประเมินและการจัดการความเสี่ยง (Risk Assessment & Treatment Matrix)](#23-การประเมินและการจัดการความเสี่ยง-risk-assessment--treatment-matrix)
     - [2.4 รายงานการประเมินความเสี่ยง (Risk Report)](#24-รายงานการประเมินความเสี่ยง-risk-report)
     - [2.5 เอกสารดัชนีชี้วัดความเสี่ยงสำคัญ (KRI Document)](#25-เอกสารดัชนีชี้วัดความเสี่ยงสำคัญ-kri-document)
     - [4.5 การประเมินความเสี่ยงคู่ค้าและห่วงโซ่อุปทาน (Third Party Risk & Zero Trust)](#45-การประเมินความเสี่ยงคู่ค้าและห่วงโซ่อุปทาน-third-party-risk--zero-trust)
     - [1.3 & 1.4 แผนและรายงานการตรวจสอบภายใน (Audit Programme & Audit Report)](#13--14-แผนและรายงานการตรวจสอบภายใน-audit-programme--audit-report)
   - [4.3 แท็บที่ 3: ระบบรายงานเหตุภัยคุกคามไซเบอร์ (Incident Management)](#43-แท็บที่-3-ระบบรายงานเหตุภัยคุกคามไซเบอร์-incident-management)
5. [ฐานข้อมูลและการซิงค์ข้อมูล (Database Schemas & Data Storage)](#5-ฐานข้อมูลและการซิงค์ข้อมูล)
6. [การจัดการสถานะและตำแหน่งหน้าจอ (State & Navigation Persistence)](#6-การจัดการสถานะและตำแหน่งหน้าจอ)
7. [คู่มือสำหรับ AI และนักพัฒนาในการต่อยอดระบบ (Developer & AI Onboarding Guide)](#7-คู่มือสำหรับ-ai-และนักพัฒนาในการต่อยอดระบบ)

---

## 1. บทนำและบริบทของระบบ

ระบบ **Cybersecurity & CII Management System** ถูกออกแบบขึ้นเพื่อเป็นศูนย์กลางการดำเนินงานด้านการรักษาความมั่นคงปลอดภัยไซเบอร์ของ **สำนักงานสาธารณสุขจังหวัดสระแก้ว และโรงพยาบาลในสังกัด 10 แห่ง** เพื่อรองรับการปฏิบัติตามกฎหมายและมาตรฐานระดับชาติ ได้แก่:
1. **พระราชบัญญัติการรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562** (Cybersecurity Act B.E. 2562) มาตรา 43, 44, 45
2. **ประกาศคณะกรรมการการรักษาความมั่นคงปลอดภัยไซเบอร์แห่งชาติ (สกมช. / NCSA)** ว่าด้วยมาตรฐานและกรอบการรักษาความมั่นคงปลอดภัยไซเบอร์สำหรับหน่วยงานควบคุมหรือกำกับดูแล (Regulator) และหน่วยงานโครงสร้างพื้นฐานสำคัญทางสารสนเทศ (CII) ด้านสาธารณสุข
3. **แนวปฏิบัติกระทรวงสาธารณสุข (MOPH Cyber Security Framework & Sectoral CSIRT)**

### จุดเด่นของระบบ
- **แปลงไฟล์เอกสารราชการ Excel/Word ดั้งเดิม (อาจารย์ไก่)** มาเป็นระบบเว็บแอปพลิเคชัน Interactive ที่คำนวณคะแนน ความเสี่ยง และสร้างรายงานอัตโนมัติ 100%
- **ทำงานได้ทั้งแบบ Online และ Offline-First**: บันทึกข้อมูลลงเครื่องทันที (LocalStorage) และซิงค์เบื้องหลังขึ้นฐานข้อมูลคลาวด์ Supabase อัตโนมัติ
- **พิมพ์เอกสารและส่งออก Word (.doc) มาตรฐานราชการ**: จัดหน้ากระดาษ A4 สวยงาม รองรับหัวกระดาษราชการ ตรากระทรวงสาธารณสุข และลายมือชื่อทางการ

---

## 2. สถาปัตยกรรมทางเทคนิคและการออกแบบระบบ

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                       S.K.O. Digital Governance Portal                        │
│                         (admin.html / Single Page App)                        │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                      [สลับแถบโมดูล: #cyber / localStorage]
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│              Cybersecurity & CII Module (src/modules/cyber/index.js)          │
├──────────────────────────────┬────────────────────────────────┬───────────────┤
│ 1. CII Self Assessment       │ 2. Policy & Standards (80 ข้อ)  │ 3. Incidents  │
│ (Update Log/Criteria/Assess) │ (Treeview + 11 Sub-Apps + Docs)│ (CSIRT Form)  │
└──────────────────────────────┴────────────────┬───────────────┴───────────────┘
                                                │
       ┌────────────────────────────────────────┴───────────────────────────────┐
       ▼                                                                        ▼
┌────────────────────────────────────────┐           ┌────────────────────────────────────────┐
│      Fast In-Memory / LocalStorage     │           │         Supabase Cloud Database        │
│ • State Hydration ทันทีเมื่อเปิดเว็บ     │  ◄──────► │ • ตาราง cyber_module_states (JSONB)    │
│ • ไม่สะดุดแม้สัญญาณเน็ตหลุด              │  (Async)  │ • ตาราง Relational Schema ครบทุกระบบ    │
│ • จดจำแท็บ/Scroll Position 100%         │           │ • ซิงค์แบบ Optimistic UI + Debounce   │
└────────────────────────────────────────┘           └────────────────────────────────────────┘
```

| องค์ประกอบ | เทคโนโลยีที่ใช้ | รายละเอียดการทำงาน |
|---|---|---|
| **Core Framework** | Vanilla JS (ES Modules) + Vite 8 | เบา โหลดเร็ว ไม่ต้องใช้ React/Vue ให้ซับซ้อน รันบน Browser โดยตรง |
| **Styling** | Custom CSS + Native Print Media Queries | ออกแบบด้วย Design System สะอาดตา พร้อมระบบ CSS `@media print` จัด A4 พอดีหน้า |
| **Data Storage** | LocalStorage + Supabase PostgreSQL | ดึงแคชในเครื่องขึ้นมาแสดงผลทันที (Zero Delay) แล้วซิงค์ลงฐานข้อมูล Supabase ในพื้นหลัง |
| **Doc Export** | Dynamic HTML Blob (.doc / .csv) | ส่งออกเป็นไฟล์ Microsoft Word (.doc) โดยคงตาราง ฟอนต์ และสี หรือส่งออกเป็น CSV สำหรับ Excel |

---

## 3. โครงสร้างไฟล์และแผนผังโมดูล

ไฟล์ทั้งหมดของโมดูล พรบ.ไซเบอร์ รวมศูนย์อยู่ใน `src/modules/cyber/`:

```text
src/modules/cyber/
├── index.js                     # [Controller หลัก] รวม Navigation, Tree 80 หัวข้อ, State & Sync
├── logoMophBase64.js            # โลโก้ตรากระทรวงสาธารณสุขแบบ Base64 สำหรับพิมพ์รายงาน
├── data/
│   ├── ciiData.json             # ข้อกำหนดและเกณฑ์ประเมิน CII ทั้งหมด (177 KB)
│   ├── policyFrameworkData.json # สารบัญ 80 หัวข้อนโยบายและกรอบมาตรฐาน
│   └── sidebarData.json         # โครงสร้างเมนูต้นไม้
│
│── [ระบบย่อยเฉพาะทาง: Controller & Data Files]
├── assetInventory.js            # [1.2] ระบบทะเบียนทรัพย์สินสารสนเทศ (ฮาร์ดแวร์ + ซอฟต์แวร์)
├── assetInventoryData.js        # [1.2] ข้อมูลตั้งต้น 118 ฮาร์ดแวร์ + 4 ซอฟต์แวร์
├── assetRegister.js             # [1.3] ระบบทะเบียนทรัพย์สินระบบบริการสำคัญ (21 รายการ)
├── assetRiskAssessment.js       # [1.4] ระบบประเมินความเสี่ยงระดับทรัพย์สิน
├── assetRiskData.js             # [1.4] ข้อมูลตั้งต้น 21 รายการประเมินความเสี่ยงทรัพย์สิน
├── biaEvident.js                # [1.6] ระบบวิเคราะห์ผลกระทบทางธุรกิจ (BIA Evident)
├── biaData.js                   # [1.6] ข้อมูลตั้งต้น BIA 9 บริการสำคัญของโรงพยาบาล
├── biaReport.js                 # [1.7] ระบบรายงานผลการวิเคราะห์ BIA (ดึงข้อมูลจาก 1.6)
├── biaReportData.js             # [1.7] โครงร่างและฟังก์ชันเชื่อมโยงข้อมูล BIA Report
├── riskRegister.js              # [2.2] ระบบทะเบียนความเสี่ยงด้านไซเบอร์ (Risk Register)
├── riskRegisterData.js          # [2.2] ข้อมูลตั้งต้นทะเบียนความเสี่ยง 8 รายการ + ค่าเฉลี่ย Cluster
├── riskAssessment.js            # [2.3] ระบบประเมินความเสี่ยงและมาตรการตอบสนอง (Risk Matrix)
├── riskAssessmentData.js        # [2.3] ข้อมูลตั้งต้นความเสี่ยง 80+ หัวข้อตามมาตรฐาน สกมช.
├── riskReport.js                # [2.4] ระบบรายงานผลการประเมินความเสี่ยงไซเบอร์ประจำปี
├── kriDocument.js               # [2.5] ระบบเอกสารดัชนีชี้วัดความเสี่ยงสำคัญ (KRI 12 เดือน)
├── thirdPartyRisk.js            # [4.5] ระบบประเมินความเสี่ยงคู่ค้า/ห่วงโซ่อุปทาน & Zero Trust
├── thirdPartyRiskData.js        # [4.5] ข้อมูลตั้งต้นการประเมินคู่ค้า (เช่น บริษัท มีเพิล คอร์ปอเรชั่นฯ)
└── auditReport.js               # [1.4] ระบบรายงานผลการตรวจสอบภายในด้านความมั่นคงปลอดภัย
```

---

## 4. รายละเอียดฟังก์ชัน 3 แท็บหลัก

เมื่อเข้าสู่ระบบ Cyber ใน Portal จะพบกับ **3 แท็บหลักด้านบน**:

---

### 4.1 แท็บที่ 1: แบบประเมิน CII Self Assessment
อ้างอิงตามเกณฑ์ประกาศ สกมช. ด้านสาธารณสุข ประกอบด้วย 3 แท็บย่อย:
1. **Update Log (ประวัติการปรับปรุง)**: บันทึกรอบการประเมิน วันที่ ผู้ประเมิน และรายละเอียดการปรับปรุง
2. **คำอธิบายและเกณฑ์ (Instructions & Criteria)**:
   - เกณฑ์การให้คะแนน:
     - `3 คะแนน`: มีเอกสารหรือหลักฐานครบถ้วน
     - `2 คะแนน`: มีเอกสารหรือหลักฐานเป็นบางส่วน
     - `1 คะแนน`: ไม่มีเอกสารหรือหลักฐานดังกล่าว
   - เกณฑ์การแปลผลเฉลี่ย:
     - `2.6 - 3.0` (สีเขียว): มีความสอดคล้องกับ พรบ. ไซเบอร์ โดยส่วนมาก
     - `2.1 - 2.5` (สีเหลือง): อยู่ระหว่างการทำให้มีความสอดคล้อง
     - `0.0 - 2.0` (สีแดง): ยังไม่มีความสอดคล้องกับ พรบ. ไซเบอร์ โดยส่วนมาก
3. **แบบประเมิน (Self Assessment Table)**:
   - รองรับ **Dynamic Rounds** (ประเมินหลายรอบ เช่น รอบที่ 1 วันที่ 23 ก.พ. 69, รอบที่ 2 วันที่ 26 ก.พ. 69)
   - มีปุ่ม **"กรอก 3 ทุกข้อในโดเมนนี้" (Quick Fill 3)** อำนวยความสะดวก
   - คำนวณค่าเฉลี่ยระดับ Control และระดับ Domain แบบเรียลไทม์ (ไม่มี Scroll Jump)
   - ปุ่ม **ส่งออก Excel (.xlsx)** บันทึกผลการประเมินทุกรอบออกมาเป็นสเปรดชีต

---

### 4.2 แท็บที่ 2: ประมวลแนวทางปฏิบัติและกรอบมาตรฐาน (คลัง 80 หัวข้อ)
ระบบแสดงผลแบบ **Master-Detail Layout**:
- **ฝั่งซ้าย**: เมนูต้นไม้ (Hierarchy Tree 80 หัวข้อ) แบ่งตาม Category -> Domain -> Major -> Minor พร้อมช่องค้นหาเอกสารแบบเรียลไทม์
- **ฝั่งขวา**: หากเป็นเอกสารทั่วไปจะเปิดดู Google Docs / Google Drive / แนบไฟล์ PDF ได้ แต่หากเป็นหัวข้อสำคัญ จะเปิดเป็น **Interactive Web Application** ทันที ดังนี้:

#### 1.2 ทะเบียนทรัพย์สินสารสนเทศ (Asset Inventory List)
- **แหล่งไฟล์**: `assetInventory.js`, `assetInventoryData.js`
- **ฟังก์ชันหลัก**:
  - 2 แท็บย่อย: **ฮาร์ดแวร์ (118 รายการ)** (คอมพิวเตอร์, ปรินเตอร์, สวิตช์, เซิร์ฟเวอร์) และ **ซอฟต์แวร์ (4 รายการ)**
  - ค้นหา, กรองตามสถานะ, กรองตามกลุ่มความสำคัญ (Criticality: สูง/กลาง/ต่ำ)
  - เพิ่ม แก้ไข ลบ รายการอุปกรณ์ บันทึก IP, MAC, ยี่ห้อ, หมายเลขครุภัณฑ์, ผู้รับผิดชอบ
  - ส่งออกไฟล์ Word (.doc) และ CSV

#### 1.3 ทะเบียนทรัพย์สินระบบบริการสำคัญ (Asset Register)
- **แหล่งไฟล์**: `assetRegister.js`
- **ฟังก์ชันหลัก**:
  - ทะเบียน 21 รายการของระบบบริการสุขภาพสำคัญ (เช่น Core Switch, HIS Server, LIS, PACS, Database)
  - กำหนดระดับความสำคัญ (Criticality), ระบบงานที่เกี่ยวข้อง (Concerned App), บริการสำคัญ (Critical Service)
  - ส่งออก Word และ CSV

#### 1.4 การประเมินความเสี่ยงระดับทรัพย์สิน (Risk Assessment of Asset)
- **แหล่งไฟล์**: `assetRiskAssessment.js`, `assetRiskData.js`
- **ฟังก์ชันหลัก**:
  - ประเมินความเสี่ยงทรัพย์สิน 21 รายการตามภัยคุกคาม (Threat) และช่องโหว่ (Vulnerability)
  - วิเคราะห์ผลกระทบด้านความมั่นคงปลอดภัยสารสนเทศ: **CIA (Confidentiality, Integrity, Availability)**
  - ประเมินผลกระทบด้านความรุนแรง 6 ด้าน: **F (การเงิน), S (ความปลอดภัย), R (ชื่อเสียง), I (การดำเนินงาน), L (กฎหมาย), O (องค์กร)**
  - คำนวณ **Risk Level = โอกาสเกิด (Likelihood 1-5) x ความรุนแรง (Impact 1-5)**
  - กำหนดแผนตอบสนองความเสี่ยง (Risk Treatment) และคำนวณ **ความเสี่ยงคงเหลือ (Residual Risk Level)**
  - โหมดแสดงผลทั้งแบบการ์ด (Card View) และตาราง (Table View) พร้อมหน้าเกณฑ์การประเมิน (Criteria)

#### 1.6 การวิเคราะห์ผลกระทบทางธุรกิจ (BIA Evident)
- **แหล่งไฟล์**: `biaEvident.js`, `biaData.js`
- **ฟังก์ชันหลัก**:
  - ประเมิน **9 ระบบบริการสำคัญของโรงพยาบาล**: งานบริการผู้ป่วยนอก (OPD), ผู้ป่วยใน (IPD), อุบัติเหตุฉุกเฉิน (ER), ห้องคลอด (LR), ชันสูตร (LAB), ผ่าตัด (OR), เอกซเรย์ (X-ray), เภสัชกรรม (Pharmacy), ระบบสารสนเทศ (IT)
  - ประเมินผลกระทบ 4 ด้าน: การเงิน, ชื่อเสียง, การปฏิบัติงาน, กฎหมาย
  - กำหนดตัวชี้วัดการฟื้นฟูระบบสำคัญ:
    - **MTPD (Maximum Tolerable Period of Disruption)**: ระยะเวลาหยุดชะงักสูงสุดที่ยอมรับได้
    - **RTO (Recovery Time Objective)**: เป้าหมายระยะเวลาการกู้คืนระบบ
    - **RPO (Recovery Point Objective)**: เป้าหมายจุดเวลาข้อมูลสูญหายที่ยอมรับได้
  - ระบุทรัพยากรทดแทน (Alternate Workarounds) ระหว่างระบบล่ม

#### 1.7 รายงานการวิเคราะห์ผลกระทบทางธุรกิจ (BIA Report)
- **แหล่งไฟล์**: `biaReport.js`, `biaReportData.js`
- **ฟังก์ชันหลัก**:
  - **เชื่อมโยงข้อมูลอัตโนมัติจาก 1.6 BIA Evident**: ดึงค่า MTPD, RTO, RPO ของทั้ง 9 บริการสำคัญมาลงในตารางรายงานสรุปให้อัตโนมัติ โดยไม่ต้องพิมพ์ซ้ำ
  - ฟอร์มรายงานราชการฉบับสมบูรณ์: วัตถุประสงค์ ขอบเขต สรุปผลกระทบ ตารางบริการ และกลยุทธ์กู้คืนระบบ
  - **ระบบแนบไฟล์ PDF**: รองรับการแนบไฟล์หลักฐานและเอกสารนำส่งรายงาน
  - **พิมพ์เอกสาร A4 พอดีหน้ากระดาษ**: มีสไตล์พิมพ์พิเศษบีบขนาดตารางและขอบหน้ากระดาษอัตโนมัติ
  - ส่งออกเป็นไฟล์ Microsoft Word (.doc)

#### 2.2 ทะเบียนความเสี่ยง (Risk Register)
- **แหล่งไฟล์**: `riskRegister.js`, `riskRegisterData.js`
- **ฟังก์ชันหลัก**:
  - โครงสร้าง 3 ส่วนสมบูรณ์ตามต้นฉบับอาจารย์ไก่:
    - **PART 1: Risk Assessment, Record and 1st Evaluation**: วันที่ระบุ, กลุ่มความเสี่ยง, ชนิดทรัพย์สิน, Threat, Vulnerability, มาตรการปัจจุบัน, ผลกระทบ CIA, ผลต่อความรุนแรง F/S/R/I/L/O, Risk Analysis (L x I = Risk Level), Risk Owner, และ **ค่าเฉลี่ยระดับความเสี่ยงของแต่ละ Cluster**
    - **PART 2: Risk Treatment Plan and Expected Assessment with Risk Residual**: ทางเลือกตอบสนอง, แผนจัดการความเสี่ยง, สถานะ, กำหนดเสร็จ, ผลกระทบ CIA, ผลต่อความรุนแรง F/S/R/I/L/O, Residual Risk (L x I = Residual Level)
    - **PART 3: Follow Up**: สถานะและบันทึกติดตามผล
  - 4 แท็บย่อย: ทะเบียนความเสี่ยง, เกณฑ์ประเมิน (Criteria), เมทริกซ์เปรียบเทียบความเสี่ยงก่อน-หลัง (Compare Inherent vs Residual), และ Update Log

#### 2.3 การประเมินและการจัดการความเสี่ยง (Risk Assessment & Treatment Matrix)
- **แหล่งไฟล์**: `riskAssessment.js`, `riskAssessmentData.js`
- **ฟังก์ชันหลัก**:
  - ประเมินความเสี่ยงภาพรวม 80+ หัวข้อตามมาตรฐาน สกมช.
  - แดชบอร์ด Heatmap 5x5 Matrix (คลิกที่ช่อง Matrix เพื่อกรองดูรายการความเสี่ยงในระดับนั้นได้ทันที)
  - แผนจัดการความเสี่ยง (Risk Treatment Plan) และการเปรียบเทียบก่อน-หลังจัดการ

#### 2.4 รายงานการประเมินความเสี่ยง (Risk Report)
- **แหล่งไฟล์**: `riskReport.js`
- **ฟังก์ชันหลัก**:
  - แบบฟอร์มรายงานสรุปผลการประเมินความเสี่ยงด้านไซเบอร์ประจำปี
  - **ปุ่มดึงข้อมูลความเสี่ยงสูงอัตโนมัติจาก 2.3**: ดึงรายการที่มีคะแนนระดับสูง/สูงมากมาบรรจุลงในตารางรายงาน
  - พิมพ์ A4 และส่งออก Word (.doc)

#### 2.5 เอกสารดัชนีชี้วัดความเสี่ยงสำคัญ (KRI Document)
- **แหล่งไฟล์**: `kriDocument.js`
- **ฟังก์ชันหลัก**:
  - ตารางมอนิเตอร์ตัวชี้วัดความเสี่ยงสำคัญ (KRI) ประจำปีงบประมาณ ครอบคลุม 12 เดือน (ต.ค. - ก.ย.) หรือปีปฏิทิน
  - ระบบสัญญาณไฟแจ้งเตือนตามเกณฑ์ (เขียว = ปลอดภัย, เหลือง = เฝ้าระวัง, แดง = เกินเกณฑ์ยอมรับ)
  - ส่งออก Word และ CSV

#### 4.5 การประเมินความเสี่ยงคู่ค้าและห่วงโซ่อุปทาน (Third Party Risk & Zero Trust)
- **แหล่งไฟล์**: `thirdPartyRisk.js`, `thirdPartyRiskData.js`
- **ฟังก์ชันหลัก**:
  - รองรับการประเมินแยกตาม **บริษัทคู่ค้า/ผู้ให้บริการภายนอก** (Multi-vendor profiles เช่น บ. มีเพิล คอร์ปอเรชั่นฯ) พร้อมปุ่มเพิ่ม/ลบคู่ค้า
  - 4 แท็บย่อย: การประเมินความเสี่ยง 3rd Party, เมทริกซ์ความเสี่ยง 5x5, เกณฑ์ประเมิน (Criteria), ประวัติการปรับปรุง (Update Log)
  - ตารางประเมิน 19 คอลัมน์สมบูรณ์ตาม Excel ต้นฉบับ:
    - หมวดหมู่ความเสี่ยง (Risk Cluster), Threat, Vulnerability
    - กระทบต่อ CIA, ความรุนแรงแต่ละด้าน (B/F, S, R, I, L, O)
    - Inherent Risk: Likelihood x Impact = Risk Level และระดับเฉลี่ย
    - Risk Treatment, การจัดการความเสี่ยง, ผู้รับผิดชอบ, สถานะ, กำหนดเสร็จ
    - Residual Risk: กระทบต่อ CIA, B/F, S, R, I, L, O, Residual Likelihood x Impact = Residual Level
    - **การดำเนินการเพิ่มเติมเพื่อลดความเสี่ยงให้น้อยลงอีก (Further actions to be taken)**

#### 1.3 & 1.4 แผนและรายงานการตรวจสอบภายใน (Audit Programme & Audit Report)
- **แหล่งไฟล์**: `auditReport.js` และโค้ดใน `index.js`
- **ฟังก์ชันหลัก**:
  - **1.3 Audit Programme**: แผนตรวจประจำปีงบประมาณของ 10 โรงพยาบาล/หน่วยงานในสังกัด สสจ.สระแก้ว ครอบคลุม 7 ขอบเขต (Guideline, Govern, Identify, Protect, Detect, Respond, Recover) และ 4 ไตรมาส (Q1-Q4) พร้อมระบบพิมพ์ A4 แนวนอน
  - **1.4 Audit Report**: รายงานผลการตรวจสอบภายในรายโรงพยาบาล สรุปผลการประเมิน Major NC, Minor NC, Observation พร้อมส่งออก Word (.doc)

---

### 4.3 แท็บที่ 3: ระบบรายงานเหตุภัยคุกคามไซเบอร์ (Incident Management)
- **ฟังก์ชันหลัก**:
  - ทะเบียนรับแจ้งเหตุการณ์ภัยคุกคามตามมาตรฐาน Sectoral CSIRT สาธารณสุข
  - แบบฟอร์ม 3.2.1 รายงานแจ้งเหตุภัยคุกคามทางไซเบอร์
  - ระดับความรุนแรง: วิกฤติ (Critical), สูง (High), ปานกลาง (Medium), ต่ำ (Low)
  - บันทึกรายละเอียดเหตุการณ์ วันเวลา ผลกระทบ มาตรการรับมือ และสถานะการแก้ไข
  - ข้อมูลจริงเชื่อมโยงกับฐานข้อมูล Supabase `cyber_module_states` (key: `incidents`)

---

## 5. ฐานข้อมูลและการซิงค์ข้อมูล

ระบบใช้กลยุทธ์ **Dual-Storage Synchronization (LocalStorage + Supabase)**:
1. **เมื่อผู้ใช้เปิดหน้าเว็บ**: โหลดข้อมูลจาก LocalStorage ขึ้นมาแสดงผลทันที (ไม่กระตุก ไม่ต้องรอ Network Request)
2. **เบื้องหลัง (Background)**: ระบบเรียก API ไปยัง Supabase เพื่อดึงข้อมูลล่าสุด หากพบข้อมูลที่ใหม่กว่าจะอัปเดตลง LocalStorage
3. **เมื่อผู้ใช้แก้ไขข้อมูล**: บันทึกลง LocalStorage ทันที และยิง `upsert` ไปยัง Supabase ในพื้นหลัง

### 5.1 ตารางหลักบน Supabase: `cyber_module_states`
สคริปต์สร้างตาราง (จาก `supabase_cyber_schema.sql`):
```sql
CREATE TABLE IF NOT EXISTS public.cyber_module_states (
    module_key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

รายการ `module_key` ที่ระบบบันทึกและซิงค์:
| `module_key` | คำอธิบายโมดูล | ฟังก์ชันซิงค์ในโค้ด |
|---|---|---|
| `asset_inventory` | ทะเบียนทรัพย์สินฮาร์ดแวร์/ซอฟต์แวร์ (1.2) | `saveAssetInventory()` |
| `asset_register` | ทะเบียนทรัพย์สินบริการสำคัญ (1.3) | `saveAssetRegister()` |
| `asset_risk_assessment` | การประเมินความเสี่ยงระดับทรัพย์สิน (1.4) | `saveAssetRiskAssessment()` |
| `bia_evident` | การวิเคราะห์ผลกระทบทางธุรกิจ (1.6) | `saveBiaEvident()` |
| `bia_reports` | รายงานการวิเคราะห์ BIA (1.7) | `saveBiaReports()` |
| `risk_register` | ทะเบียนความเสี่ยง (2.2) | `saveRiskRegister()` |
| `risk_assessment` | การประเมินความเสี่ยงและมาตรการ (2.3) | `saveRiskAssessment()` |
| `risk_reports` | รายงานสรุปความเสี่ยงไซเบอร์ประจำปี (2.4) | `saveRiskReports()` |
| `kri_data` | ตัวชี้วัดความเสี่ยงสำคัญ KRI 12 เดือน (2.5) | `saveKriData()` |
| `third_party_risk` | การประเมินความเสี่ยงคู่ค้า/ห่วงโซ่อุปทาน (4.5) | `saveThirdPartyRisk()` |
| `incidents` | ทะเบียนรับแจ้งเหตุภัยคุกคามไซเบอร์ (3.2.1) | `saveIncidents()` |

*(นอกจากนี้ ใน `supabase_cyber_schema.sql` ยังมีโครงสร้างตารางแบบ Relational Tables แบบละเอียดไว้รองรับกรณีต้องการ Query หรือทำ BI Dashboard ในอนาคต)*

### 5.2 รายการ LocalStorage Keys ที่ระบบใช้งาน
```javascript
const LOCAL_STORAGE_ROUNDS_KEY = 'sko_cii_assessment_rounds'
const LOCAL_STORAGE_INCIDENTS_KEY = 'sko_cyber_incidents'
const LOCAL_STORAGE_DOCS_KEY = 'sko_cyber_docs_links'
const LOCAL_STORAGE_LOGS_KEY = 'sko_cii_update_logs'
const LOCAL_STORAGE_AUDIT_PROGRAMME_KEY = 'sko_cyber_audit_programmes'
const LOCAL_STORAGE_AUDIT_REPORTS_KEY = 'sko_cyber_audit_reports'
const LOCAL_STORAGE_RISK_ASSESSMENT_KEY = 'sko_cyber_risk_assessment_v3'
const LOCAL_STORAGE_RISK_REPORTS_KEY = 'sko_cyber_risk_reports'
const LOCAL_STORAGE_KRI_DATA_KEY = 'sko_cyber_kri_data'
const LOCAL_STORAGE_ASSET_INVENTORY_KEY = 'sko_cyber_asset_inventory'
const LOCAL_STORAGE_ASSET_REGISTER_KEY = 'sko_cyber_asset_register'
const LOCAL_STORAGE_ASSET_RISK_KEY = 'sko_cyber_asset_risk_assessment'
const LOCAL_STORAGE_BIA_EVIDENT_KEY = 'sko_cyber_bia_evident'
const LOCAL_STORAGE_BIA_REPORTS_KEY = 'sko_cyber_bia_reports'
const LOCAL_STORAGE_RISK_REGISTER_KEY = 'sko_cyber_risk_register'
const LOCAL_STORAGE_THIRD_PARTY_RISK_KEY = 'sko_cyber_third_party_risk'

// State & Navigation Keys
const LOCAL_STORAGE_CYBER_MAIN_TAB_KEY = 'sko_cyber_active_main_tab'
const LOCAL_STORAGE_CYBER_SELECTED_DOC_KEY = 'sko_cyber_selected_doc_key'
const LOCAL_STORAGE_CYBER_CII_SUBTAB_KEY = 'sko_cyber_cii_subtab'
const LOCAL_STORAGE_EXPANDED_NODES_KEY = 'sko_cyber_expanded_nodes'
const LOCAL_STORAGE_TPR_VENDOR_KEY = 'sko_cyber_tpr_vendor_id'
const LOCAL_STORAGE_TPR_SUBTAB_KEY = 'sko_cyber_tpr_subtab'
const LOCAL_STORAGE_RISK_REGISTER_SUBTAB_KEY = 'sko_cyber_risk_register_subtab'
const LOCAL_STORAGE_BIA_SUBTAB_KEY = 'sko_cyber_bia_subtab'
const LOCAL_STORAGE_BIA_REPORT_SUBTAB_KEY = 'sko_cyber_bia_report_subtab'
const LOCAL_STORAGE_ASSET_RISK_SUBTAB_KEY = 'sko_cyber_asset_risk_subtab'
const LOCAL_STORAGE_RISK_ASSESS_SUBTAB_KEY = 'sko_cyber_risk_assess_subtab'
const LOCAL_STORAGE_ASSET_INV_SUBTAB_KEY = 'sko_cyber_asset_inv_subtab'
```

---

## 6. การจัดการสถานะและตำแหน่งหน้าจอ

เพื่อป้องกันปัญหาที่พบบ่อยในการพัฒนาเว็บแอปพลิเคชัน (เช่น รีเฟรชแล้วหลุดกลับไปหน้าแรก หรือคลิกแล้วหน้าจอกระตุกเด้งขึ้นบนสุด) ระบบได้วางโครงสร้างไว้ดังนี้:

### 1. Persistence เมื่อกด Refresh (F5)
- **URL Hash**: ใช้ URL Hash `#cyber` ควบคู่กับ LocalStorage `sko_admin_current_module`
- **โมดูลย่อย**: จดจำแท็บหลัก (`sko_cyber_active_main_tab`)
- **เอกสารที่เปิดค้างไว้**: จดจำผ่าน `sko_cyber_selected_doc_key` และกางโฟลเดอร์ต้นไม้ (Expanded Nodes) ของเอกสารนั้นให้อัตโนมัติใน `initData()`
- **แท็บย่อยภายในเอกสาร**: จดจำทุกแท็บย่อย (เช่น กำลังเปิดดูแท็บ Compare ใน 2.2 หรือแท็บ Zero Trust ใน 4.5)

### 2. Scroll Position Recovery (Zero Scroll Jump)
ในฟังก์ชัน `renderPolicyAndFrameworkTab(el)` มีการบันทึกตำแหน่ง Scroll ก่อนเรนเดอร์ และคืนค่าทันทีหลังเรนเดอร์:
```javascript
// 1. จำตำแหน่งก่อนเปลี่ยน DOM
const prevTreeScroll = el.querySelector('#doc-tree-scroll-container')?.scrollTop || 0
const prevRightScroll = el.querySelector('#doc-right-content-container')?.scrollTop || 0

// 2. เรนเดอร์ HTML
el.innerHTML = ...

// 3. คืนค่า Scroll ทันที
const newTreeScroll = el.querySelector('#doc-tree-scroll-container')
if (newTreeScroll && prevTreeScroll) newTreeScroll.scrollTop = prevTreeScroll
const newRightScroll = el.querySelector('#doc-right-content-container')
if (newRightScroll && prevRightScroll) newRightScroll.scrollTop = prevRightScroll
```

---

## 7. คู่มือสำหรับ AI และนักพัฒนาในการต่อยอดระบบ

เมื่อเปิดแชทใหม่หรือต้องการให้ AI พัฒนาระบบต่อ ให้ยึดแนวปฏิบัติดังนี้:

### 1. การเพิ่มหัวข้อเอกสาร Interactive ใหม่
1. ตรวจสอบชื่อหัวข้อใน `src/modules/cyber/data/policyFrameworkData.json`
2. สร้างไฟล์ Controller และ Data แยกใน `src/modules/cyber/` (เช่น `myFeature.js`, `myFeatureData.js`)
3. ใน `src/modules/cyber/index.js`:
   - Import ฟังก์ชันเรนเดอร์และข้อมูลเริ่มต้น
   - เพิ่มตัวแปรสถานะใน `cyberState` และกำหนดค่าเริ่มต้นใน `initData()`
   - กำหนดเงื่อนไข `isMyFeature = (currentKey.includes('...') || ...)` ใน `renderPolicyAndFrameworkTab(el)`
   - เชื่อมต่อฟังก์ชัน `bindMyFeatureEvents(el, ...)`
   - เพิ่มฟังก์ชัน `saveMyFeature()` ที่เรียก `syncModuleToSupabase('my_feature', data)`

### 2. การสร้างฟังก์ชันส่งออก Microsoft Word (.doc)
ใช้รูปแบบ HTML Blob ตามมาตรฐานที่ทำไว้ใน `exportBiaReportToWord` หรือ `exportRiskReportToWord`:
```javascript
export function exportToWord(htmlContent, fileName) {
  const header = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      @page { size: A4 portrait; margin: 2.5cm 2cm 2cm 2.5cm; }
      body { font-family: 'TH Sarabun New', 'Sarabun', sans-serif; font-size: 16pt; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #000; padding: 6px; }
    </style></head><body>`
  const footer = `</body></html>`
  const source = header + htmlContent + footer
  const blob = new Blob(['\ufeff' + source], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.doc`
  a.click()
  URL.revokeObjectURL(url)
}
```

### 3. การเพิ่ม CSS พิมพ์ A4 (Print Styles)
ให้ใช้ `@media print` ในแท็ก `<style>` หรือไฟล์ `style.css` โดยตั้งค่า:
```css
@media print {
  @page {
    size: A4 portrait; /* หรือ landscape */
    margin: 10mm 15mm;
  }
  body * {
    visibility: hidden;
  }
  #my-print-area, #my-print-area * {
    visibility: visible;
  }
  #my-print-area {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
  }
}
```

### 4. การทดสอบก่อนส่งมอบงาน
ทุกครั้งที่มีการแก้ไขโค้ด ให้รันคำสั่งต่อไปนี้เสมอ:
```bash
npm run build
```
ต้องมั่นใจว่าการ Build สำเร็จ `0 errors` จึงจะถือว่าโค้ดมีความสมบูรณ์พร้อมใช้งานครับ
