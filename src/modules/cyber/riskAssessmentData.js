// Risk Assessment Data Module for Cyber 2.3
// Auto-extracted from original Excel & reference documents

export const DEFAULT_RISK_METADATA = {
  orgName: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  reviewer: 'สมาชิกคณะกรรมการพิจารณาความเสี่ยง',
  recorder: 'นายธนกฤต นิธิตันติปัญญา, สมาชิกคณะกรรมการพิจารณาความเสี่ยง',
  meetingDate: '23 ก.พ. 69',
  location: 'ห้องประชุม Cockpit สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  address: '609 ม.2 ต.ท่าเกษม อ.เมืองสระแก้ว จ.สระแก้ว 27000',
  mainSystem: 'All application as HIS'
};

export const DEFAULT_UPDATE_LOGS = [
  {
    "id": "log_1",
    "date": "2567-09-02",
    "detail": "เริ่มดำเนินการสร้าง Template จนแล้วเสร็จและทำการระบุวัตถุประสงค์ (Objective) และกำหนดเกณฑ์ที่ใช้ในการประเมิน ( Criteria)"
  },
  {
    "id": "log_2",
    "date": "2567-09-09",
    "detail": "ดำเนินการจัดการประเมินความเสี่ยงและทำการอัพเดทสถานะ"
  },
  {
    "id": "log_3",
    "date": "2567-09-23",
    "detail": "ทำการประเมินสถานภาพอีกครั้งอีกครั้ง เพื่อประเมินความพร้อมในการตรวจสอบ"
  }
];

export const RISK_CLUSTERS = [
  "การโจมตีด้วยมัลแวร์ (Malware Attacks)",
  "การโจมตีด้วยฟิชชิง (Phishing Attacks)",
  "ภัยคุกคามจากบุคคลภายใน (Insider Threats)",
  "การละเมิดข้อมูล (Data Breaches)",
  "การโจมตีแบบ Denial of Service (DoS) และ Distributed Denial of Service (DDoS)",
  "การโจมตีแบบ Man-in-the-Middle (MitM)",
  "การโจมตีด้วยแรนซัมแวร์ (Ransomware Attacks)",
  "การโจมตีด้วยวิศวกรรมสังคม (Social Engineering)",
  "ความเสี่ยงด้านความปลอดภัยของคลาวด์ (Cloud Security Risks)",
  "ความเสี่ยงจากผู้จำหน่ายภายนอก (Third-Party Vendor Risks)",
  "ความเสี่ยงของอุปกรณ์มือถือ (Mobile Device Risks) ขององค์กร",
  "ซอฟต์แวร์และระบบที่มีช่องโหว่ (Vulnerable Software and Systems)",
  "ความเสี่ยงด้านความปลอดภัยของเครือข่าย (Network Security Risks)",
  "ความเสี่ยงด้านความปลอดภัยทางกายภาพ (Physical Security Risks)",
  "ความเสี่ยงจากการไม่ปฏิบัติตามกฎระเบียบและข้อบังคับ (Regulatory and Compliance Risks) (Non-Compliance Activity)",
  "การสูญหายหรือการรั่วไหลของข้อมูล (Data Loss or Data Leakage)"
];

export const DEFAULT_RISK_ITEMS = [
  {
    "id": "risk_1",
    "cluster": "การโจมตีด้วยมัลแวร์ (Malware Attacks)",
    "no": "1.0",
    "threat": "1. มีการดาวน์โหลดไฟล์จากเว็บไซต์ที่ไม่น่าเชื่อถือ ซึ่งอาจแฝงด้วยมัลแวร์",
    "vulnerability": "1. ไม่มีระบบหรือมาตรการควบคุมการดาวน์โหลดและติดตั้งซอฟต์แวร์ในองค์กร",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "risk_owner": "Cyber security managemrnt representative",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "การควบคุมการดาวน์โหลดและติดตั้งซอฟต์แวร์ในองค์กร(Application Control)",
    "sub_actions": [
      "ปรับปรุงสิทธิ์ผู้ใช้งานคอมพิวเตอร์เป็น Standard User (จำกัดสิทธิ์ Admin) เพื่อไม่ให้สามารถดาวน์โหลดหรือติดตั้งซอฟต์แวร์เองได้โดยไม่ผ่านความเห็นชอบจากเจ้าหน้าที่ไอที",
      "จัดทำบัญชีซอฟต์แวร์มาตรฐาน (Standard Software List) ที่ได้รับอนุญาตให้ใช้งานใน สสจ. และตรวจสอบการติดตั้งโปรแกรมในเครื่องคอมพิวเตอร์เป็นรายไตรมาส"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 10,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_2",
    "cluster": "การโจมตีด้วยมัลแวร์ (Malware Attacks)",
    "no": "",
    "threat": "2. มีการติดมัลแวร์ที่มาจากการใช้อุปกรณ์ USB Storage หรือสื่อเก็บข้อมูลภายนอก",
    "vulnerability": "2. ไม่มีการติดตั้งหรืออัปเดตโปรแกรมป้องกันไวรัสเมื่อใช้อุปกรณ์ USB Storage",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 5,
    "impact": 5,
    "risk_level": 25,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ควบคุมอุปกรณ์สื่อบันทึกข้อมูลภายนอก (USB Storage Control)",
    "sub_actions": [
      "ติดตั้งระบบ Endpoint Security ที่มีฟังก์ชันบังคับสแกนไวรัสอัตโนมัติทันทีเมื่อมีการเชื่อมต่อ USB Storage กับเครื่องคอมพิวเตอร์ในสำนักงาน",
      "กำหนดนโยบายห้ามใช้ USB ส่วนตัวกับเครื่องคอมพิวเตอร์ที่เข้าถึงระบบฐานข้อมูลสำคัญ (เช่น ERP หรือระบบข้อมูลบุคลากร) โดยให้ใช้การส่งงานผ่าน Cloud Storage ขององค์กรที่ปลอดภัยแทน"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_3",
    "cluster": "การโจมตีด้วยมัลแวร์ (Malware Attacks)",
    "no": "",
    "threat": "3. ไฟล์แนบในอีเมล์่มีฟิชชิงและแฝงด้วยมัลแวร์",
    "vulnerability": "3. ขาดระบบหรือมาตรการหรือนโยบายการควบคุมการใช้งาน อีเมล์ที่มีไฟล์แนบ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "คัดกรองและเฝ้าระวังไฟล์แนบในอีเมล (Email Security)",
    "sub_actions": [
      "จัดอบรมเกี่ยวกับการหลีกเลี่ยงการดาวน์โหลดไฟล์หรือจากอีเมลที่ไม่น่าเชื่อถือ",
      "จัดทำแนวปฏิบัติและสื่อประชาสัมพันธ์ (Infographic) วิธีการตรวจสอบอีเมลฟิชชิงเบื้องต้น เพื่อให้เจ้าหน้าที่ระมัดระวังก่อนคลิกลิงก์หรือโหลดไฟล์"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_4",
    "cluster": "การโจมตีด้วยมัลแวร์ (Malware Attacks)",
    "no": "",
    "threat": "4. การติดตั้งซอฟต์แวร์ที่ละเมิดลิขสิทธิ์ที่ฝังด้วยมัลแวร์",
    "vulnerability": "4. พนักงานขาดความรู้ในการติดตั้งุไฟล์หรือเว็บไซต์ที่มีความเสี่ยงไซเบอร์",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ส่งเสริมการใช้ซอฟต์แวร์ที่ถูกต้องและสร้างความตระหนัก (Compliance & Awareness)",
    "sub_actions": [
      "สำรวจและเปลี่ยนมาใช้ซอฟต์แวร์ Open Source หรือซอฟต์แวร์ที่มีลิขสิทธิ์ถูกต้อง เพื่อทดแทนโปรแกรมละเมิดลิขสิทธิ์ที่มักมีมัลแวร์ฝังตัวมาด้วย",
      "จัดอบรมสั้น ๆ (Micro-learning) ในที่ประชุมประจำเดือน เพื่อสาธิตอันตรายจากการติดตั้งไฟล์จากแหล่งที่ไม่น่าเชื่อถือและวิธีการดาวน์โหลดที่ปลอดภัย"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 50,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_5",
    "cluster": "การโจมตีด้วยมัลแวร์ (Malware Attacks)",
    "no": "",
    "threat": "5. พนักงานเข้าถึงโฆษณาออนไลน์ (Malvertising) ตามเว็บต่างๆ ที่พาไปยังเว็บไซต์ที่มีมัลแวร์",
    "vulnerability": "5. ไม่มีระบบกรองเว็บไซด์ \nที่ป้องกันมัลแวร์ และอัพเดทเป็นประจำ",
    "current_control": "ติดตั้ง Firewall เพื่อบล็อกการเข้าถึงเว็บไซต์ที่มีความเสี่ยงสูงและโฆษณาแฝงมัลแวร์ (Malvertising) และอัปเดตฐานข้อมูลเว็บไซต์อันตราย (Blacklist)",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 4,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ระบบกรองเนื้อหาและการเข้าถึงเว็บไซต์ (Web Filtering)",
    "sub_actions": [
      "ติดตั้งและตั้งค่าระบบ Web Filtering หรือ Firewall เพื่อบล็อกการเข้าถึงเว็บไซต์ที่มีความเสี่ยงสูงและโฆษณาแฝงมัลแวร์ (Malvertising)",
      "อัปเดตฐานข้อมูลเว็บไซต์อันตราย (Blacklist) ในระบบเครือข่ายของสำนักงานเป็นประจำทุกวันเพื่อให้ทันต่อภัยคุกคามใหม่ ๆ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_6",
    "cluster": "การโจมตีด้วยฟิชชิง (Phishing Attacks)",
    "no": "2.0",
    "threat": "1. การรับอีเมล์ที่มีฟิชชิง่หลอกให้ผู้ใช้กรอกข้อมูลสำคัญ เช่น รหัสผ่าน หรือข้อมูลทางการเงิน",
    "vulnerability": "1. ขาดการฝึกอบรมพนักงาน เช่น พนักงานไม่สามารถแยกแยะอีเมล์หรือเว็บไซต์ปลอมได้",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เสริมสร้างความตระหนักรู้และทักษะการคัดกรอง",
    "sub_actions": [
      "จัดอบรม Cyber Awareness ประจำปี เน้นการสังเกตชื่อผู้ส่งและลิงก์ปลอม",
      "ทดสอบส่งอีเมลฟิชชิงจำลอง (Phishing Simulation) เพื่อประเมินผลและฝึกเจ้าหน้าที่"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_7",
    "cluster": "การโจมตีด้วยฟิชชิง (Phishing Attacks)",
    "no": "",
    "threat": "2. Spear Phishing ที่กำหนดเป้าหมายเจาะจงบุคคลหรือหน่วยงาน หลุดเข้ามาในระบบ",
    "vulnerability": "2. ไม่มีระบบตรวจจับอีเมล์ฟิชชิง เช่น ไม่มีการใช้ตัวกรองอีเมล์เพื่อบล็อกอีเมล์ที่เป็นอันตราย",
    "current_control": "ตรวจสอบ Log การเข้าใช้ระบบที่ผิดปกติ (Anomaly Detection) ของบัญชีระดับสูง",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้ระบบตรวจสอบเชิงเทคนิคเพื่อคัดกรองภัยคุกคามที่มุ่งเป้าไปยังผู้บริหารหรือผู้มีอำนาจตัดสินใจ",
    "sub_actions": [
      "อบรมตั้งค่าการปรับปรุงตัวกรองอีเมล (Email Filter) ของผู้ใช้งานให้เข้มขวดเป็นพิเศษ",
      "ตรวจสอบ Log การเข้าใช้ระบบที่ผิดปกติ (Anomaly Detection) ของบัญชีระดับสูง"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_8",
    "cluster": "การโจมตีด้วยฟิชชิง (Phishing Attacks)",
    "no": "",
    "threat": "3. มีการรับส่งลิงก์ที่มีฟิชชิงผ่าน SMS หรือโซเชียลมีเดีย",
    "vulnerability": "3. การใช้รหัสผ่านซ้ำหรือไม่ปลอดภัย เช่น ผู้ใช้ตั้งรหัสผ่านที่เดาง่ายหรือใช้ซ้ำในหลายระบบ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดการความปลอดภัยส่วนบุคคลและการแจ้งข่าวสารภัยคุกคามอย่างรวดเร็ว",
    "sub_actions": [
      "กำหนด Password Policy บังคับใช้รหัสผ่านซับซ้อนและห้ามใช้ซ้ำกับสื่อโซเชียล",
      "ประชาสัมพันธ์แจ้งเตือนภัยไซเบอร์รูปแบบใหม่ผ่านกลุ่ม LINE เครือข่ายสาธารณสุข"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_9",
    "cluster": "การโจมตีด้วยฟิชชิง (Phishing Attacks)",
    "no": "",
    "threat": "4. เข้าเว็บไซต์ปลอมที่เลียนแบบหน้าล็อกอินขององค์กรหรือบริการออนไลน์",
    "vulnerability": "4. ขาดการใช้การยืนยันตัวตนแบบหลายปัจจัย (MFA) เช่น ระบบไม่มีการยืนยันตัวตนเพิ่มเติมสำหรับการเข้าถึงข้อมูลสำคัญ",
    "current_control": "บังคับใช้การยืนยันตัวตนแบบหลายปัจจัย (MFA) ในระบบ Email และ ERP",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "บังคับใช้เทคโนโลยีการยืนยันตัวตนหลายชั้นเพื่อป้องกันการถูกขโมยบัญชีผู้ใช้งาน",
    "sub_actions": [
      "บังคับใช้การยืนยันตัวตนแบบหลายปัจจัย (MFA) ในระบบ Email และ ERP",
      "รวบรวมรายชื่อ URL ทางการของระบบงานทั้งหมดให้เจ้าหน้าที่ปักหมุดใช้งาน"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_10",
    "cluster": "การโจมตีด้วยฟิชชิง (Phishing Attacks)",
    "no": "",
    "threat": "5. ถูกระบบโทรศัพท์ปลอม (Call center) หลอกขอข้อมูลส่วนตัว",
    "vulnerability": "5. ไม่มีกระบวนการยืนยันการสื่อสารที่ปลอดภัย เช่น ขาดนโยบายการยืนยันตัวตนของผู้ส่งอีเมล์หรือข้อความ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 4,
    "impact": 3,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "สร้างขั้นตอนการปฏิบัติที่เป็นทางการเพื่อป้องกันการหลอกลวงผ่านโทรศัพท์และเพิ่มความเชื่อมั่นในการประสานงาน",
    "sub_actions": [
      "ออกนโยบาย (SOP) ห้ามขอรหัสผ่านหรือข้อมูลส่วนตัวทางโทรศัพท์เด็ดขาด",
      "สร้างช่องทางตรวจสอบเจ้าหน้าที่และรับแจ้งเหตุผ่าน LINE OA ทางการของ สสจ."
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_11",
    "cluster": "ภัยคุกคามจากบุคคลภายใน (Insider Threats)",
    "no": "3.0",
    "threat": "1. การใช้งานข้อมูลโดยใช้อำนาจมิชอบ เช่น พนักงานที่มีสิทธิ์เข้าถึงข้อมูลสำคัญอาจนำข้อมูลไปใช้โดยไม่ได้รับอนุญาต",
    "vulnerability": "1. การควบคุมสิทธิ์การเข้าถึงที่ไม่เหมาะสม เช่น พนักงานบางคนได้รับสิทธิ์เข้าถึงข้อมูลมากเกินความจำเป็น",
    "current_control": "จัดทำทะเบียนสิทธิ์การเข้าถึงระบบ (Access Matrix) ตามโครงสร้างกลุ่มงานใน สสจ.",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 4,
    "impact": 3,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ปรับปรุงโครงสร้างสิทธิ์การเข้าถึงข้อมูลให้ตรงตามบทบาทภาระงานจริงของเจ้าหน้าที่แต่ละกลุ่มงาน",
    "sub_actions": [
      "จัดทำทะเบียนสิทธิ์การเข้าถึงระบบ (Access Matrix) ตามโครงสร้างกลุ่มงานใน สสจ.",
      "กำหนดการทบทวนสิทธิ์การเข้าถึงข้อมูลสำคัญ (Privilege Review) ทุก 6 เดือน"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_12",
    "cluster": "ภัยคุกคามจากบุคคลภายใน (Insider Threats)",
    "no": "",
    "threat": "2. การรั่วไหลของข้อมูลโดยเจตนา เช่น พนักงานที่ไม่พอใจองค์กรส่งข้อมูลสำคัญให้คู่แข่งหรือบุคคลภายนอก",
    "vulnerability": "2. ขาดระบบตรวจสอบพฤติกรรม เช่น ไม่มีการติดตามกิจกรรมที่ผิดปกติในระบบของพนักงาน",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เพิ่มศักยภาพในการตรวจจับกิจกรรมที่ผิดปกติเพื่อยับยั้งการกระทำผิดได้อย่างทันท่วงที",
    "sub_actions": [
      "เปิดใช้งานระบบบันทึกเหตุการณ์ (Audit Logs) ในฐานข้อมูลสำคัญและตรวจสอบย้อนหลังอย่างสม่ำเสมอ",
      "ติดตั้งระบบแจ้งเตือนเมื่อมีการส่งออกไฟล์ข้อมูลจำนวนมาก (Massive Data Export) ผิดปกติ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_13",
    "cluster": "ภัยคุกคามจากบุคคลภายใน (Insider Threats)",
    "no": "",
    "threat": "3. กระทำผิดพลาดโดยไม่ได้ตั้งใจ เช่น การลบข้อมูลสำคัญหรือแชร์ข้อมูลให้บุคคลที่ไม่เกี่ยวข้อง",
    "vulnerability": "3. ขาดการฝึกอบรมเกี่ยวกับการปกป้องข้อมูล เช่น พนักงานไม่เข้าใจถึงความสำคัญของการปกป้องข้อมูล",
    "current_control": "จัดอบรมเชิงปฏิบัติการเรื่องการจัดการข้อมูลตามมาตรฐาน PDPA สำหรับเจ้าหน้าที่ทุกระดับ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 4,
    "impact": 3,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ลดโอกาสการเกิด Human Error ด้วยการให้ความรู้และใช้เครื่องมือช่วยป้องกัน",
    "sub_actions": [
      "จัดอบรมเชิงปฏิบัติการเรื่องการจัดการข้อมูลตามมาตรฐาน PDPA สำหรับเจ้าหน้าที่ทุกระดับ",
      "ติดตั้งระบบหรือซอฟต์แวร์แจ้งเตือน (Confirmation Pop-up) ก่อนการลบหรือแชร์ข้อมูลสำคัญออกนอกหน่วยงาน"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_14",
    "cluster": "ภัยคุกคามจากบุคคลภายใน (Insider Threats)",
    "no": "",
    "threat": "4. การใช้บัญชีที่ถูกยึดหรือถูกแฮ็ก (Inactive users) เช่น  บัญชีของพนักงานที่ถูกยึดหรือแฮ็กมีการนำไปใช้ในการกระทำที่ไม่เหมาะสม",
    "vulnerability": "4. ไม่มีการจัดการบัญชีผู้ใช้งานที่ออกจากองค์กร เช่น บัญชีของพนักงานที่ลาออกยังคงสามารถเข้าถึงระบบได้",
    "current_control": "เชื่อมโยงข้อมูลงานบุคคลกับฝ่ายไอทีเพื่อทำการปิดบัญชี (Disable Account) ทันทีเมื่อเจ้าหน้าที่ลาออกหรือย้ายหน่วยงาน และสุ่มตรวจสอบบัญชีที่ไม่มีการเคลื่อนไหว (Inactive Accounts) เกิน 90 วัน เพื่อทำการระงับการใช้งานชั่วคราว",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ปิดช่องโหว่จากบัญชีที่ตกค้างในระบบหลังเจ้าหน้าที่เปลี่ยนแปลงสถานะการทำงาน",
    "sub_actions": [
      "เชื่อมโยงข้อมูลงานบุคคลกับฝ่ายไอทีเพื่อทำการปิดบัญชี (Disable Account) ทันทีเมื่อเจ้าหน้าที่ลาออกหรือย้ายหน่วยงาน",
      "สุ่มตรวจสอบบัญชีที่ไม่มีการเคลื่อนไหว (Inactive Accounts) เกิน 90 วัน เพื่อทำการระงับการใช้งานชั่วคราว"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_15",
    "cluster": "ภัยคุกคามจากบุคคลภายใน (Insider Threats)",
    "no": "",
    "threat": "5. มีการปลอมตัวเป็นบุคคลภายใน เช่น บุคคลภายนอกแฝงตัวเข้ามาในองค์กรผ่านการร่วมมือของพนักงานภายใน",
    "vulnerability": "5. ไม่มีการเข้ารหัสข้อมูลสำคัญ เช่น  ข้อมูลที่สำคัญไม่ได้รับการป้องกัน ทำให้ง่ายต่อการคัดลอกหรือส่งออก",
    "current_control": "ปรับปรุงมาตรการควบคุมการเข้า-ออกห้อง Server และจุดเก็บข้อมูลสำคัญด้วยระบบ Biometrics หรือ Keycard",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 4,
    "impact": 3,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันการนำข้อมูลไปใช้ประโยชน์แม้จะมีการเข้าถึงทางกายภาพหรือได้รับไฟล์ไปโดยมิชอบ",
    "sub_actions": [
      "บังคับใช้การเข้ารหัสไฟล์ข้อมูล (Encryption) ที่มีความอ่อนไหวสูงก่อนการจัดเก็บหรือรับส่ง",
      "ปรับปรุงมาตรการควบคุมการเข้า-ออกห้อง Server และจุดเก็บข้อมูลสำคัญด้วยระบบ Biometrics หรือ Keycard"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_16",
    "cluster": "การละเมิดข้อมูล (Data Breaches)",
    "no": "4.0",
    "threat": "1. มีการแฮ็กระบบเพื่อเข้าถึงข้อมูลสำคัญ เช่น ข้อมูลลูกค้า หรือข้อมูลทางการเงิน",
    "vulnerability": "1. การขาดการเข้ารหัสข้อมูล (Encryption) เช่น ข้อมูลสำคัญไม่ได้รับการเข้ารหัสทั้งในขณะส่งและจัดเก็บข้อมูล",
    "current_control": "ติดตั้งใบรับรองความปลอดภัย (SSL/TLS) ให้กับทุกเว็บแอปพลิเคชันของ สสจ.สระแก้ว",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ทำให้ข้อมูลที่ถูกโจรกรรมไปไม่สามารถนำไปใช้งานต่อได้หากไม่มีกุญแจถอดรหัส",
    "sub_actions": [
      "ติดตั้งใบรับรองความปลอดภัย (SSL/TLS) ให้กับทุกเว็บแอปพลิเคชันของ สสจ.สระแก้ว",
      "เข้ารหัสไฟล์ข้อมูลที่มีความอ่อนไหวสูง (Sensitive Data) ก่อนทำการจัดเก็บหรือส่งต่อตามมาตรฐาน PDPA"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_17",
    "cluster": "การละเมิดข้อมูล (Data Breaches)",
    "no": "",
    "threat": "2. มีการละเมิดข้อมูลจากการตั้งรหัสผ่านที่อ่อนแอ",
    "vulnerability": "2. ระบบที่ไม่ได้อัปเดต (Outdated Systems) เช่น ระบบปฏิบัติการและซอฟต์แวร์ที่ไม่ได้อัปเดตเป็นผลเปิดช่องโหว่ให้ถูกโจมตี",
    "current_control": "ตรวจสอบช่องโหว่ (Vulnerability Assessment) ของระบบจังหวัดเป็นรายปี",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 5,
    "impact": 3,
    "risk_level": 15,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ปิดโอกาสการถูกแฮ็กผ่านช่องโหว่ของซอฟต์แวร์และระบบปฏิบัติการที่ใช้ในสำนักงาน",
    "sub_actions": [
      "ติดตั้งระบบจัดการแพตช์ (Patch Management) เพื่ออัปเดตซอฟต์แวร์และ OS อัตโนมัติ",
      "ตรวจสอบช่องโหว่ (Vulnerability Assessment) ของระบบจังหวัดเป็นรายปี"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 50,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_18",
    "cluster": "การละเมิดข้อมูล (Data Breaches)",
    "no": "",
    "threat": "3. มีการรั่วไหลของข้อมูลผ่านพนักงาน (โดยเจตนาหรือไม่เจตนา)",
    "vulnerability": "3. การตั้งรหัสผ่านที่ไม่ปลอดภัย เช่น ผู้ใช้ตั้งรหัสผ่านที่เดาง่ายหรือใช้รหัสผ่านซ้ำกันในหลายระบบ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันการเดารหัสผ่านและการใช้รหัสผ่านซ้ำในหลายระบบงาน",
    "sub_actions": [
      "ประกาศใช้ Password Policy ที่บังคับความซับซ้อนและห้ามใช้รหัสผ่านซ้ำกับระบบส่วนตัว",
      "สุ่มตรวจสอบความมั่นคงปลอดภัยของรหัสผ่านในระบบงานสำคัญเป็นระยะ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_19",
    "cluster": "การละเมิดข้อมูล (Data Breaches)",
    "no": "",
    "threat": "4. มีการส่งข้อมูลสำคัญผ่านช่องทางที่ไม่ปลอดภัย เช่น อีเมล์ที่ไม่มีการเข้ารหัส",
    "vulnerability": "4. ขาดระบบตรวจสอบการเข้าถึง (Access Control):  ไม่มีการควบคุมสิทธิ์การเข้าถึงข้อมูลที่เหมาะสม",
    "current_control": "บังคับใช้การยืนยันตัวตนผ่าน VPN หรือ SSL สำหรับการเข้าถึงระบบภายในจากนอกสำนักงาน",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 5,
    "impact": 3,
    "risk_level": 15,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนดสิทธิ์ให้เฉพาะผู้ที่เกี่ยวข้องและใช้ช่องทางที่ปลอดภัยในการสื่อสารข้อมูลสำคัญ",
    "sub_actions": [
      "บังคับใช้การยืนยันตัวตนผ่าน VPN หรือ SSL สำหรับการเข้าถึงระบบภายในจากนอกสำนักงาน",
      "กำหนดสิทธิ์การเข้าถึงข้อมูลตามบทบาทหน้าที่ (RBAC) ในระบบ ERP และฐานข้อมูลยุทธศาสตร์"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_20",
    "cluster": "การละเมิดข้อมูล (Data Breaches)",
    "no": "",
    "threat": "5. มีการโจมตีผ่าน API หรือระบบที่ไม่ได้รับการตรวจสอบความปลอดภัย",
    "vulnerability": "5. ขาดการตรวจสอบกิจกรรมในระบบ เช่น ไม่มีการตรวจสอบกิจกรรมที่น่าสงสัยในระบบหรือการแจ้งเตือน",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เพิ่มศักยภาพในการตรวจพบการพยายามบุกรุกผ่านช่องทางเชื่อมต่อระบบ (API)",
    "sub_actions": [
      "เปิดใช้งานและจัดเก็บ Log การใช้งาน API เชื่อมโยงข้อมูลระหว่างหน่วยงานอย่างเป็นระบบ",
      "ตั้งค่าระบบแจ้งเตือน (Alert) เมื่อพบพฤติกรรมการเรียกใช้ข้อมูลที่ผิดปกติหรือมีปริมาณมากเกินเกณฑ์"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_21",
    "cluster": "การโจมตีแบบ Denial of Service (DoS) และ Distributed Denial of Service (DDoS)",
    "no": "5.0",
    "threat": "1. พบว่ามีการส่งคำขอแปลกปลอมจำนวนมหาศาลเพื่อทำให้ระบบหยุดชะงัก",
    "vulnerability": "1. ไม่มีการกำหนดขีดจำกัดคำขอหรือกรองคำขอ เช่น  ระบบไม่สามารถจำกัดจำนวนคำขอที่ส่งเข้ามาภายในช่วงเวลาที่กำหนดได้",
    "current_control": "ติดตั้ง Web Application Firewall (WAF) เพื่อกรอง Request ที่ผิดปกติก่อนถึง Server Dashboard จังหวัด",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันการทำงานหนักเกินไปของ Server โดยการจำกัดจำนวนคำขอจากแหล่งเดียว",
    "sub_actions": [
      "ตั้งค่า Rate Limiting บน Firewall หรือ Gateway ของสำนักงานเพื่อจำกัดจำนวนคำขอ",
      "ติดตั้ง Web Application Firewall (WAF) เพื่อกรอง Request ที่ผิดปกติก่อนถึง Server Dashboard จังหวัด"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_22",
    "cluster": "การโจมตีแบบ Denial of Service (DoS) และ Distributed Denial of Service (DDoS)",
    "no": "",
    "threat": "2. ถูกการโจมตีแบบ DNS Amplification ที่เพิ่มปริมาณคำขอเพื่อให้ระบบของเรา (จุดเป้าหมาย) รับภาระเกินกำลัง",
    "vulnerability": "2. ระบบตรวจจับการโจมตีที่ไม่เพียงพอ เช่น ไม่มีเครื่องมือในการตรวจจับและตอบสนองต่อพฤติกรรมที่ผิดปกติ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันการถูกใช้เป็นเครื่องมือหรือถูกโจมตีผ่านระบบ DNS",
    "sub_actions": [
      "ตั้งค่า DNS Server ของสำนักงานให้ปฏิเสธคำขอแบบ Recursive จากภายนอกที่ไม่มีสิทธิ์",
      "ตรวจสอบ Log ของ DNS Query อย่างสม่ำเสมอเพื่อค้นหาพฤติกรรมการเรียกข้อมูลที่ผิดปกติ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_23",
    "cluster": "การโจมตีแบบ Denial of Service (DoS) และ Distributed Denial of Service (DDoS)",
    "no": "",
    "threat": "3. ถูกการใช้ Botnet เพื่อกระจายการโจมตีจากหลายแหล่งไปยังเป้าหมาย",
    "vulnerability": "3. ไม่มีการใช้ Load Balancer เช่น  ระบบไม่สามารถกระจายโหลดภาระของการประมวลผลคำขอไปยังเซิร์ฟเวอร์อื่นๆได้",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เพิ่มความสามารถในการรองรับปริมาณงานที่เข้ามาพร้อมกันจำนวนมาก",
    "sub_actions": [
      "ติดตั้ง Load Balancer เพื่อกระจายปริมาณงานไปยัง Server สำรองในระบบเครือข่าย",
      "พิจารณาใช้บริการ CDN หรือ Cloud-based DDoS Protection สำหรับระบบที่เปิดเผยสู่สาธารณะ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_24",
    "cluster": "การโจมตีแบบ Denial of Service (DoS) และ Distributed Denial of Service (DDoS)",
    "no": "",
    "threat": "4. ถูกการโจมตีในระดับแอปพลิเคชัน เช่น การทำให้เว็บเซิร์ฟเวอร์ไม่สามารถรองรับคำขอที่ถูกต้องได้",
    "vulnerability": "4. ความปลอดภัยของ DNS และโปรโตคอลอยู่ในระดับต่ำ เช่น DNS Server ไม่มีการกำหนดค่าเพื่อป้องกันการโจมตี อาทิ DNS Spoofing หรือ Amplification",
    "current_control": "อัปเดตซอฟต์แวร์เว็บเซิร์ฟเวอร์ (เช่น Apache/IIS) ให้เป็นเวอร์ชันล่าสุดเพื่ออุดช่องโหว่",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ตรวจสอบและอัปเดตช่องทางการรับส่งข้อมูลให้เป็นไปตามมาตรฐานความปลอดภัยสูง",
    "sub_actions": [
      "อัปเดตซอฟต์แวร์เว็บเซิร์ฟเวอร์ (เช่น Apache/IIS) ให้เป็นเวอร์ชันล่าสุดเพื่ออุดช่องโหว่",
      "ปิดใช้บริการ DNSSEC เพื่อป้องกันการปลอมแปลงข้อมูลชื่อโดเมนของหน่วยงาน"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_25",
    "cluster": "การโจมตีแบบ Denial of Service (DoS) และ Distributed Denial of Service (DDoS)",
    "no": "",
    "threat": "5. ถูกการโจมตีโปรโตคอล เช่น SYN Flood, Ping of Death",
    "vulnerability": "5. มีการจัดการทรัพยากรระบบไม่เหมาะสม เช่น ระบบเซิร์ฟเวอร์ไม่มีแบนด์วิดท์หรือทรัพยากรเพียงพอที่จะรองรับการโจมตี",
    "current_control": "ปรับแต่งคอนฟิก Firewall เพื่อป้องกัน SYN Flood และการโจมตีผ่านโปรโตคอลพื้นฐาน",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ตั้งค่าอุปกรณ์เครือข่ายให้ทนทานต่อการโจมตีทางเทคนิคระดับพื้นฐาน",
    "sub_actions": [
      "ปรับแต่งคอนฟิก Firewall เพื่อป้องกัน SYN Flood และการโจมตีผ่านโปรโตคอลพื้นฐาน",
      "ประสานงานกับผู้ให้บริการอินเทอร์เน็ต (ISP) เพื่อขยายแบนด์วิดท์ชั่วคราวเมื่อเกิดเหตุการณ์โจมตี"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_26",
    "cluster": "การโจมตีแบบ Man-in-the-Middle (MitM)",
    "no": "6.0",
    "threat": "1. มีการดักฟังการสื่อสาร (Eavesdropping) เช่น แฮ็กเกอร์ดักจับข้อมูลระหว่างผู้ใช้และเซิร์ฟเวอร์ อาทิ รหัสผ่านหรือข้อมูลสำคัญ",
    "vulnerability": "1. การสื่อสารที่ไม่มีการเข้ารหัส เช่น  การส่งข้อมูลผ่าน HTTP แทน HTTPS",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": true,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_27",
    "cluster": "การโจมตีแบบ Man-in-the-Middle (MitM)",
    "no": "",
    "threat": "2. ถูกการปลอมแปลงเว็บไซต์ (Spoofing) เช่น สร้างเว็บไซต์หรือเครือข่าย Wi-Fi ปลอมเพื่อหลอกให้ผู้ใช้ป้อนข้อมูล",
    "vulnerability": "2. เครือข่าย Wi-Fi สาธารณะ เช่น ไม่มีการตั้งค่าความปลอดภัย อาทิ WPA2/WPA3",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": true,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_28",
    "cluster": "การโจมตีแบบ Man-in-the-Middle (MitM)",
    "no": "",
    "threat": "3. ถูกการโจมตีผ่าน Wi-Fi ที่ไม่ปลอดภัย เช่น การโจมตีในเครือข่าย Wi-Fi สาธารณะที่ไม่มีการเข้ารหัส",
    "vulnerability": "3. การไม่ตรวจสอบใบรับรอง SSL/TLS เช่น ผู้ใช้ไม่สามารถแยกแยะใบรับรองปลอมจากใบรับรองจริงได้",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": true,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_29",
    "cluster": "การโจมตีแบบ Man-in-the-Middle (MitM)",
    "no": "",
    "threat": "4. มีการ Hijack เซสชัน (Session Hijacking) เช่น การเข้าควบคุมเซสชันของผู้ใช้งานที่เข้าสู่ระบบแล้ว",
    "vulnerability": "4. การขาดการยืนยันตัวตนแบบหลายปัจจัย (MFA) เช่น ไม่มีการป้องกันเมื่อเซสชันของผู้ใช้ถูกแฮ็ก",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": true,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_30",
    "cluster": "การโจมตีแบบ Man-in-the-Middle (MitM)",
    "no": "",
    "threat": "5. มีการปลอมใบรับรอง (Certificate Spoofing) เช่น การใช้ใบรับรอง SSL/TLS ปลอมเพื่อลวงผู้ใช้",
    "vulnerability": "5. การตั้งค่าอุปกรณ์ที่ไม่ปลอดภัย เช่น  อุปกรณ์ IoT หรือเครือข่ายในองค์กรไม่มีการตั้งค่าความปลอดภัยที่เหมาะสม",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": true,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_31",
    "cluster": "การโจมตีด้วยแรนซัมแวร์ (Ransomware Attacks)",
    "no": "7.0",
    "threat": "1. มีการดาวน์โหลดไฟล์หรือซอฟต์แวร์ที่แฝงแรนซัมแวร์ผ่านอีเมล์ฟิชชิง",
    "vulnerability": "1. การขาดการฝึกอบรมพนักงาน เช่น  พนักงานเปิดไฟล์แนบที่เป็นอันตรายจากอีเมล์ฟิชชิง",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "มุ่งเน้นการปรับเปลี่ยนพฤติกรรมเจ้าหน้าที่เพื่อลดโอกาสการนำเข้าแรนซัมแวร์ผ่านช่องทางสื่อสารหลัก",
    "sub_actions": [
      "จัดอบรมและทดสอบ Phishing Simulation โดยใช้ตัวอย่างไฟล์แนบที่มักแฝงแรนซัมแวร์",
      "ประชาสัมพันธ์แจ้งเตือนภัยแรนซัมแวร์รูปแบบใหม่ผ่านกลุ่ม LINE เครือข่ายสุขภาพจังหวัด"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_32",
    "cluster": "การโจมตีด้วยแรนซัมแวร์ (Ransomware Attacks)",
    "no": "",
    "threat": "2. ถูกการโจมตีโดยใช้ช่องโหว่ในระบบหรือซอฟต์แวร์ที่ไม่ได้อัปเดต",
    "vulnerability": "2. ซอฟต์แวร์และระบบปฏิบัติการที่ไม่ได้อัปเดต เช่น ระบบหรือซอฟต์แวร์ มีช่องโหว่ที่เปิดให้แรนซัมแวร์เข้าถึงได้",
    "current_control": "ตรวจสอบและประเมินช่องโหว่ (VA Scan) ของระบบก่อนใช้งานจริง และทุกปี",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 4,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ปิดประตูการบุกรุกเชิงเทคนิคด้วยการทำให้ระบบปฏิบัติการและแอปพลิเคชันเป็นปัจจุบันเสมอ",
    "sub_actions": [
      "จัดทำวงรอบการอัปเดตแพตช์ความปลอดภัย (Security Patch) สำหรับเครื่องแม่ข่ายและคอมพิวเตอร์สำนักงาน",
      "ตรวจสอบและประเมินช่องโหว่ (VA Scan) ของระบบ ก่อนใช้งานจริง"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 50,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_33",
    "cluster": "การโจมตีด้วยแรนซัมแวร์ (Ransomware Attacks)",
    "no": "",
    "threat": "3. มีการใช้ Remote Desktop Protocol (RDP) ที่ไม่ได้ตั้งค่าความปลอดภัย",
    "vulnerability": "3. การขาดการสำรองข้อมูล (Backup) เช่น ไม่มีระบบสำรองข้อมูลที่สามารถกู้คืนได้เมื่อถูกโจมตี",
    "current_control": "สำรองข้อมูลแบบ 3-2-1",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 4,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เน้นการเตรียมพร้อมเพื่อกู้คืนระบบให้กลับมาทำงานได้โดยเร็วที่สุดหากถูกโจมตีสำเร็จ",
    "sub_actions": [
      "บังคับใช้กลยุทธ์สำรองข้อมูลแบบ 3-2-1 (3 ชุด, 2 สื่อ, 1 ชุดอยู่ Offline) สำหรับข้อมูล",
      "จัดเตรียมเครื่องสำรองข้อมูล (NAS) ที่มีการแยกสิทธิ์การเข้าถึงอย่างเด็ดขาดจากระบบเครือข่ายหลัก"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_34",
    "cluster": "การโจมตีด้วยแรนซัมแวร์ (Ransomware Attacks)",
    "no": "",
    "threat": "4. มีการแอบแฝงแรนซัมแวร์ในอุปกรณ์ USB Storage หรืออุปกรณ์พกพาอื่นๆ",
    "vulnerability": "4. การตั้งค่าความปลอดภัยของ RDP ที่ไม่เหมาะสม เช่น เปิดใช้งาน RDP โดยไม่มีการควบคุมการเข้าถึงที่เข้มงวด",
    "current_control": "ใช้ VPN ร่วมกับ MFA สำหรับการสนับสนุนงานไอทีระยะไกล และใช้ระบบ Endpoint Security ที่มีฟีเจอร์ Ransomware Protection ในการสแกนอุปกรณ์พกพาอัตโนมัติ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 4,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จำกัดช่องทางการนำเข้าและขยายผลของแรนซัมแวร์ผ่านอุปกรณ์พกพาและการเชื่อมต่อภายนอก",
    "sub_actions": [
      "ปิดการใช้งาน RDP หรือเปลี่ยนไปใช้ VPN ร่วมกับ MFA สำหรับการสนับสนุนงานไอทีระยะไกล",
      "บังคับใช้ระบบ Endpoint Security ที่มีฟีเจอร์ Ransomware Protection ในการสแกนอุปกรณ์พกพาอัตโนมัติ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_35",
    "cluster": "การโจมตีด้วยแรนซัมแวร์ (Ransomware Attacks)",
    "no": "",
    "threat": "5. มีการกระจายแรนซัมแวร์ผ่านเครือข่ายที่เชื่อมโยงกับองค์กร",
    "vulnerability": "5. การขาดระบบป้องกันมัลแวร์ที่มีประสิทธิภาพ เช่น ไม่มีซอฟต์แวร์ป้องกันแรนซัมแวร์ที่สามารถตรวจจับและบล็อกการโจมตี",
    "current_control": "ติดตั้ง EDR ในเครื่องที่มีความสำคัญสูง และแยกส่วนเครือข่าย",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 4,
    "risk_level": 12,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้ระบบป้องกันระดับสูงเพื่อดักจับและหยุดการกระจายตัวของแรนซัมแวร์ในเครือข่ายสำนักงาน",
    "sub_actions": [
      "ติดตั้งระบบป้องกันมัลแวร์ระดับ Endpoint Detection and Response (EDR) ในเครื่องที่มีความสำคัญสูง",
      "ทำการแยกส่วนเครือข่าย (Network Segmentation) เพื่อป้องกันการแพร่กระจายข้ามกลุ่มงานหรืออำเภอ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_36",
    "cluster": "การโจมตีด้วยวิศวกรรมสังคม (Social Engineering)",
    "no": "8.0",
    "threat": "1. Phishing -  มีการส่งอีเมล์หรือข้อความที่ดูน่าเชื่อถือเพื่อหลอกให้ผู้ใช้งาน ให้ข้อมูลสำคัญ เช่น รหัสผ่าน หรือข้อมูลส่วนตัว",
    "vulnerability": "1. การขาดความตระหนักของพนักงาน เช่น พนักงานไม่เข้าใจความเสี่ยงจาก Social Engineering",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "มุ่งเน้นการให้ความรู้เพื่อให้เจ้าหน้าที่เท่าทันกลโกงและไม่ตกเป็นเหยื่อของการหลอกขอข้อมูลสำคัญ",
    "sub_actions": [
      "จัดอบรม Cyber Security Awareness ประจำปีให้แก่เจ้าหน้าที่ สสจ. และเครือข่าย",
      "ประชาสัมพันธ์สื่อการสอน (Infographic) เรื่องการสังเกตข้อความหลอกลวงผ่านกลุ่ม LIN"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_37",
    "cluster": "การโจมตีด้วยวิศวกรรมสังคม (Social Engineering)",
    "no": "",
    "threat": "2. Spear Phishing -  ถูกการโจมตีที่ใช้การกำหนดเป้าหมายเฉพาะบุคคลหรือหน่วยงานเฉพาะ โดยใช้ข้อมูลส่วนตัวของผู้ใช้งาน เพื่อเพิ่มความน่าเชื่อถือ",
    "vulnerability": "2. ไม่มีการตรวจสอบตัวตนของผู้ขอข้อมูล เช่น ขาดกระบวนการยืนยันตัวตนก่อนให้ข้อมูลสำคัญ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_38",
    "cluster": "การโจมตีด้วยวิศวกรรมสังคม (Social Engineering)",
    "no": "",
    "threat": "3. Pretexting - มีการสร้างสถานการณ์หลอกลวง เช่น แอบอ้างเป็นฝ่าย IT เพื่อขอข้อมูลสำคัญ",
    "vulnerability": "3. ไม่มีการควบคุมการเข้าถึงพื้นที่ทางกายภาพ เช่น การเข้า-ออกพื้นที่สำคัญไม่ได้รับการควบคุมอย่างเข้มงวด",
    "current_control": "ติดตั้งระบบควบคุมการเข้า-ออก (Access Control) ในห้อง Server และกลุ่มงานสุขภาพดิจิทัล",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 2,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันบุคคลภายนอกแอบอ้างเข้ามาในพื้นที่ทำงานเพื่อจุดประสงค์ที่ไม่หวังดี",
    "sub_actions": [
      "ติดตั้งระบบควบคุมการเข้า-ออก (Access Control) ในห้อง Server และกลุ่มงานสุขภาพดิจิทัล",
      "ออกระเบียบการแลกบัตรและติดป้ายแสดงตนสำหรับผู้มาติดต่อหรือช่างจากภายนอก"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_39",
    "cluster": "การโจมตีด้วยวิศวกรรมสังคม (Social Engineering)",
    "no": "",
    "threat": "4. Baiting - มีการหลอกล่อ วางเหยื่อ เพื่อให้ผู้ใช้งานนำไปใช้ เช่น อุปกรณ์ USB Storage ที่แฝงมัลแวร์เพื่อให้เป้าหมายหยิบไปใช้งาน",
    "vulnerability": "4. ขาดการป้องกันระบบสารสนเทศ เช่น ระบบไม่มีการกรองอีเมล์หรือเว็บไซต์ที่น่าสงสัย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันมัลแวร์ที่มากับสื่อบันทึกข้อมูลที่พบโดยบังเอิญหรือไม่ได้ตรวจสอบ",
    "sub_actions": [
      "ติดตั้งโปรแกรม Antivirus ที่มีระบบสแกนอัตโนมัติเมื่อเสียบ USB เข้ากับเครื่องคอมพิวเตอร์สำนักงาน",
      "รณรงค์ห้ามเจ้าหน้าที่ใช้แฟลชไดรฟ์ที่พบเจอหรือได้รับแจกฟรีกับระบบงาน"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_40",
    "cluster": "การโจมตีด้วยวิศวกรรมสังคม (Social Engineering)",
    "no": "",
    "threat": "5. Tailgating - มีการเข้าถึงพื้นที่ที่มีการจำกัดการเข้าถึงพื้นที่ที่สำคัญ โดยติดตามผู้มีสิทธิ์เข้าไปในพื้นที่",
    "vulnerability": "5. การใช้โซเชียลมีเดียที่ไม่มีการควบคุม เช่น ข้อมูลสำคัญขององค์กรหรือพนักงานถูกเผยแพร่ในโซเชียลมีเดีย",
    "current_control": "ติดตั้งกล้องวงจรปิด (CCTV) บริเวณทางเข้าพื้นที่จำกัดเพื่อตรวจสอบการลักลอบเข้าถึง",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ควบคุมพฤติกรรมการแชร์ข้อมูลและการเข้าถึงพื้นที่หวงห้ามเพื่อป้องกันการรั่วไหลของข้อมูล",
    "sub_actions": [
      "จัดทำนโยบายการใช้โซเชียลมีเดีย (Social Media Policy) สำหรับเจ้าหน้าที่เพื่อไม่ให้เผลอเผยแพร่ภาพข้อมูลสำคัญ",
      "ติดตั้งกล้องวงจรปิด (CCTV) บริเวณทางเข้าพื้นที่จำกัดเพื่อตรวจสอบการลักลอบเข้าถึง"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_41",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของคลาวด์ (Cloud Security Risks)",
    "no": "9.0",
    "threat": "1. การตั้งค่าคลาวด์ที่ไม่ปลอดภัย (Misconfiguration) เช่น การเปิดเผยข้อมูลที่สำคัญบางอย่างบนอินเทอร์เน็ตเนื่องจากการตั้งค่าที่ผิดพลาด จึงต้องยอมเปิดเผย",
    "vulnerability": "1. ขาดการตรวจสอบการตั้งค่าที่รัดกุม เช่น ไม่มีการตรวจสอบหรือปรับปรุงการตั้งค่าความปลอดภัยในระบบคลาวด์",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 1,
    "risk_level": 1,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_42",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของคลาวด์ (Cloud Security Risks)",
    "no": "",
    "threat": "2. ถูกการโจมตี API เช่น แฮ็กเกอร์โจมตี API ที่ไม่ได้รับการป้องกัน อาทิ API Key หรือ Token ที่ไม่ได้รับการเข้ารหัส",
    "vulnerability": "2. การควบคุมการเข้าถึงที่ไม่เหมาะสม เช่น สิทธิ์การเข้าถึงคลาวด์ถูกกำหนดอย่างไม่รัดกุม เช่น ทุกคนสามารถเข้าถึงได้",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 1,
    "risk_level": 1,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_43",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของคลาวด์ (Cloud Security Risks)",
    "no": "",
    "threat": "3. มีการขโมยข้อมูลในระหว่างการส่งข้อมูล เช่น การดักฟังข้อมูลที่ไม่ได้เข้ารหัสระหว่างการส่งข้อมูล",
    "vulnerability": "3. การขาดการเข้ารหัสข้อมูล เช่น ข้อมูลที่จัดเก็บหรือส่งผ่านคลาวด์ไม่ได้รับการเข้ารหัส",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 1,
    "risk_level": 1,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_44",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของคลาวด์ (Cloud Security Risks)",
    "no": "",
    "threat": "4. มีการแฮ็กบัญชีผู้ใช้คลาวด์ เช่น ผู้โจมตีเข้าควบคุมบัญชีผ่านช่องโหว่ของรหัสผ่านหรือการฟิชชิง",
    "vulnerability": "4. การไม่ปฏิบัติตามกฎระเบียบหรือมาตรฐานความปลอดภัยของระบบคลาวด์ เช่น ระบบคลาวด์ไม่ได้รับการปรับให้สอดคล้องกับมาตรฐาน เช่น ISO 27001, 27018, 27701",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 1,
    "impact": 1,
    "risk_level": 1,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_45",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของคลาวด์ (Cloud Security Risks)",
    "no": "",
    "threat": "5. ถูกมัลแวร์ในคลาวด์ เช่น การอัปโหลดไฟล์ที่แฝงมัลแวร์ขึ้นสู่ระบบคลาวด์และกระจายไปยังผู้ใช้รายอื่นๆ",
    "vulnerability": "5. การพึ่งพาผู้ให้บริการคลาวด์โดยไม่มีการตรวจสอบมาตรฐาน เช่น ขาดการตรวจสอบนโยบายความปลอดภัยของผู้ให้บริการคลาวด์",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 1,
    "risk_level": 1,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_46",
    "cluster": "ความเสี่ยงจากผู้จำหน่ายภายนอก (Third-Party Vendor Risks)",
    "no": "10.0",
    "threat": "1. มีการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาตจากผู้จำหน่าย (3rd Party/Suppliers) ที่ไม่ได้มีการควบคุมความปลอดภัยอาจทำให้ข้อมูลขององค์กรรั่วไหล",
    "vulnerability": "1. การขาดกระบวนการตรวจสอบผู้จำหน่าย (3rd Party/Suppliers) เช่น ไม่มีการตรวจสอบความปลอดภัยของผู้จำหน่าย (3rd Party/Suppliers) ก่อนเซ็นต์สัญญา",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_47",
    "cluster": "ความเสี่ยงจากผู้จำหน่ายภายนอก (Third-Party Vendor Risks)",
    "no": "",
    "threat": "2. มีการโจมตีผ่านซัพพลายเชน (Supply Chain Attacks) เช่น ผู้โจมตีใช้ช่องโหว่ของซัพพลายเออร์เพื่อเข้าถึงระบบองค์กร",
    "vulnerability": "2. ไม่มีข้อตกลงด้านความปลอดภัย (Security SLA) เช่น ขาดข้อตกลงที่กำหนดบทบาทและความรับผิดชอบด้านความปลอดภัย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_48",
    "cluster": "ความเสี่ยงจากผู้จำหน่ายภายนอก (Third-Party Vendor Risks)",
    "no": "",
    "threat": "3. พบว่าผู้จำหน่ายขาดการปฏิบัติตามกฎระเบียบ เช่น ผู้จำหน่ายไม่ปฏิบัติตามมาตรฐานหรือข้อกำหนดด้านความปลอดภัย เช่น ISO 27001, 27018, 27701",
    "vulnerability": "3. การเข้าถึงระบบที่ไม่เหมาะสม:  ผู้จำหน่ายได้รับสิทธิ์เข้าถึงระบบมากเกินความจำเป็น",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จำกัดสิทธิ์ผู้รับจ้างและบังคับใช้ข้อตกลงคุ้มครองข้อมูลส่วนบุคคลตามมาตรฐาน PDPA",
    "sub_actions": [
      "บังคับใช้การยืนยันตัวตนแบบหลายปัจจัย (MFA) สำหรับผู้จำหน่ายที่ต้องรีโมทเข้ามาดูแลระบบสารสนเทศ",
      "จัดทำข้อตกลงการประมวลผลข้อมูล (Data Processing Agreement - DPA) ร่วมกับผู้จำหน่ายตามกฎหมาย PDPA"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_49",
    "cluster": "ความเสี่ยงจากผู้จำหน่ายภายนอก (Third-Party Vendor Risks)",
    "no": "",
    "threat": "4. การพึ่งพาผู้จำหน่ายที่ไม่มีความมั่นคงในการบริการ เช่น ความล้มเหลวของผู้จำหน่าย อาทิ การหยุดให้บริการ อาจส่งผลกระทบต่อธุรกิจ",
    "vulnerability": "4. ขาดการเฝ้าระวังความปลอดภัยของผู้จำหน่าย เช่น ไม่มีการติดตามการปฏิบัติงานของผู้จำหน่ายในด้านความปลอดภัย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันการหยุดชะงักของระบบสำคัญจากการบริหารจัดการของผู้จำหน่าย",
    "sub_actions": [
      "จัดทำแผนความต่อเนื่องทางธุรกิจ (BCP) ในกรณีผู้ให้บริการหลักไม่สามารถให้บริการได้",
      "ตรวจประเมินประสิทธิภาพและมาตรฐานความปลอดภัยของผู้จำหน่าย (Vendor Audit) เป็นรายปี"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_50",
    "cluster": "ความเสี่ยงจากผู้จำหน่ายภายนอก (Third-Party Vendor Risks)",
    "no": "",
    "threat": "5. การแชร์ข้อมูลระหว่างกันกับผู้จำหน่ายที่ไม่ได้มีการป้องกัน เช่น การส่งข้อมูลสำคัญผ่านช่องทางที่ไม่มีการเข้ารหัส",
    "vulnerability": "5. การแชร์ข้อมูลกับผู้จำหน่ายหลายๆ ราย ทำให้ยิ่งแชร์ข้อมูลกับผู้จำหน่ายมากๆ ความเสี่ยงที่ข้อมูลจะรั่วไหลก็ยิ่งสูง",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ลดปริมาณการแชร์ข้อมูลที่ไม่จำเป็นและเพิ่มความปลอดภัยในการรับส่งข้อมูลระหว่างหน่วยงาน",
    "sub_actions": [
      "บังคับใช้การรับส่งข้อมูลผ่านช่องทางที่มีการเข้ารหัส (Encrypted Channel) เช่น SFTP หรือ VPN เท่านั้น",
      "จัดทำบัญชีรายการข้อมูล (Data Inventory) ที่แชร์ให้ผู้จำหน่ายแต่ละรายเพื่อควบคุมและตรวจสอบการใช้งาน"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_51",
    "cluster": "ความเสี่ยงของอุปกรณ์มือถือ (Mobile Device Risks) ขององค์กร",
    "no": "11.0",
    "threat": "1. มีการสูญหายหรือถูกขโมย เช่น อุปกรณ์ที่เก็บข้อมูลสำคัญถูกขโมยหรือสูญหายโดยไม่มีการป้องกัน",
    "vulnerability": "1. ไม่มีการเข้ารหัสข้อมูล เช่น ข้อมูลในอุปกรณ์ไม่ได้รับการเข้ารหัส ทำให้ง่ายต่อการเข้าถึงเมื่ออุปกรณ์สูญหาย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_52",
    "cluster": "ความเสี่ยงของอุปกรณ์มือถือ (Mobile Device Risks) ขององค์กร",
    "no": "",
    "threat": "2. มัลแวร์ในมือถือขององค์กร เช่น การติดตั้งแอปพลิเคชันที่มีมัลแวร์ซึ่งสามารถเข้าถึงข้อมูลในอุปกรณ์",
    "vulnerability": "2. การตั้งค่าความปลอดภัยที่ไม่เหมาะสม เช่น อุปกรณ์ไม่มีการตั้งรหัสผ่านหรือการล็อกหน้าจอ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_53",
    "cluster": "ความเสี่ยงของอุปกรณ์มือถือ (Mobile Device Risks) ขององค์กร",
    "no": "",
    "threat": "3. มีการโจมตีผ่าน Wi-Fi สาธารณะ เช่น การดักจับข้อมูลจากอุปกรณ์ที่เชื่อมต่อเครือข่าย Wi-Fi ที่ไม่มีการป้องกัน",
    "vulnerability": "3. การดาวน์โหลดแอปพลิเคชันจากแหล่งที่ไม่น่าเชื่อถือ เช่น การติดตั้งแอปพลิเคชั่น จากร้านค้าที่ไม่ได้รับการรับรอง",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 2,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันการดักฟังข้อมูลและการฝังตัวของแรนซัมแวร์ผ่านแอปพลิเคชันแปลกปลอม",
    "sub_actions": [
      "จัดอบรมให้ความรู้เรื่องความเสี่ยงจากการใช้ Wi-Fi สาธารณะและการสังเกตแอปพลิเคชันปลอม",
      "แนะนำให้เจ้าหน้าที่ใช้งาน VPN ของหน่วยงานเมื่อต้องเข้าถึงระบบฐานข้อมูลสำคัญผ่านเครือข่ายภายนอ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_54",
    "cluster": "ความเสี่ยงของอุปกรณ์มือถือ (Mobile Device Risks) ขององค์กร",
    "no": "",
    "threat": "4. Phishing ผ่านอุปกรณ์มือถือ เช่น การส่งข้อความหรืออีเมล์    ฟิชชิงเพื่อหลอกให้ผู้ใช้เปิดเผยข้อมูล",
    "vulnerability": "4. การขาดการควบคุมการใช้งาน BYODในองค์กร เช่น ไม่มีนโยบาย BYOD (Bring Your Own Device) ที่ชัดเจน",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_55",
    "cluster": "ความเสี่ยงของอุปกรณ์มือถือ (Mobile Device Risks) ขององค์กร",
    "no": "",
    "threat": "5. มีการเข้าถึงโดยไม่ได้รับอนุญาต เช่น การใช้ข้อมูลหรือแอปพลิเคชันในอุปกรณ์โดยผู้ไม่ได้รับอนุญาต",
    "vulnerability": "5. ไม่มีการอัปเดตระบบ เช่น อุปกรณ์ไม่ได้รับการอัปเดตซอฟต์แวร์และแพตช์ความปลอดภัย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ปิดช่องโหว่ด้านความปลอดภัยที่อาจถูกผู้โจมตีใช้ผ่านแอปพลิเคชันหรือ OS ที่ล้าสมัย",
    "sub_actions": [
      "กำหนดให้เจ้าหน้าที่ตั้งค่าอัปเดตระบบปฏิบัติการ (OS) และแอปพลิเคชันทำงานให้เป็นปัจจุบันเสมอ",
      "บังคับใช้การยืนยันตัวตนแบบหลายปัจจัย (MFA) เมื่อต้องเข้าใช้งานแอปพลิเคชันสำคัญของหน่วยงานบนมือถือ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_56",
    "cluster": "ซอฟต์แวร์และระบบที่มีช่องโหว่ (Vulnerable Software and Systems)",
    "no": "12.0",
    "threat": "1. พบว่ามีการใช้ช่องโหว่ของซอฟต์แวร์ที่ไม่ได้อัปเดตเพื่อเข้าควบคุมระบบ (Exploitation of Unpatched Software)",
    "vulnerability": "1. ซอฟต์แวร์และระบบที่ไม่ได้อัปเดต เช่น การใช้เวอร์ชันที่ล้าสมัยของซอฟต์แวร์และระบบปฏิบัติการ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_57",
    "cluster": "ซอฟต์แวร์และระบบที่มีช่องโหว่ (Vulnerable Software and Systems)",
    "no": "",
    "threat": "2. มีการโจมตีผ่านช่องโหว่ของระบบปฏิบัติการ เช่น การโจมตีแบบ Zero-Day",
    "vulnerability": "2. การตั้งค่าที่ไม่ปลอดภัย (Misconfiguration) เช่น การตั้งค่าซอฟต์แวร์หรือเซิร์ฟเวอร์ที่เปิดเผยข้อมูลสำคัญ ทำให้เปิดช่องโหว่",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 2,
    "risk_level": 4,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เสริมสร้างเกราะป้องกันระดับโครงสร้างพื้นฐานเพื่อลดโอกาสที่ช่องโหว่ใหม่ ๆ จะถูกนำมาใช้โจมตี",
    "sub_actions": [
      "จัดทำมาตรฐานการตั้งค่าความปลอดภัย (Security Baseline) สำหรับเครื่อง Server",
      "ติดตั้งระบบตรวจจับการบุกรุก (IDS/IPS) เพื่อคัดกรองพฤติกรรมที่เข้าข่ายการใช้ช่องโหว่ Zero-Day"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_58",
    "cluster": "ซอฟต์แวร์และระบบที่มีช่องโหว่ (Vulnerable Software and Systems)",
    "no": "",
    "threat": "3. มีการโจมตีผ่านแอปพลิเคชันเว็บ เช่น SQL Injection, Cross-Site Scripting (XSS)",
    "vulnerability": "3. การใช้ซอฟต์แวร์ละเมิดลิขสิทธิ์ เช่น ซอฟต์แวร์ที่ไม่มีการรับประกันความปลอดภัยหรือไม่มีแพตช์อัปเดตหรือผ่านการถอดระหัสที่ไม่สมบรูณ์",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_59",
    "cluster": "ซอฟต์แวร์และระบบที่มีช่องโหว่ (Vulnerable Software and Systems)",
    "no": "",
    "threat": "4. มีการแฝงมัลแวร์ในส่วนของปลั๊กอินหรือส่วนเสริมของซอฟต์แวร์",
    "vulnerability": "4. ไม่มีระบบจัดการช่องโหว่ เช่น ขาดเครื่องมือและกระบวนการในการค้นหาและแก้ไขช่องโหว่ในระบบ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "สร้างกระบวนการค้นหาและแก้ไขจุดอ่อนของระบบอย่างเป็นระบบก่อนที่จะเกิดปัญหา",
    "sub_actions": [
      "ใช้เครื่องมือสแกนหาช่องโหว่ (Vulnerability Scanner) ตรวจสอบระบบเครือข่ายของ สสจ. เป็นรายไตรมาส",
      "กำหนดรายชื่อส่วนเสริม (Extensions/Plugins) ที่อนุญาตให้ติดตั้งและใช้งานได้ในองค์กร (Whitelisting)"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_60",
    "cluster": "ซอฟต์แวร์และระบบที่มีช่องโหว่ (Vulnerable Software and Systems)",
    "no": "",
    "threat": "5. มีการใช้บริการหรือโปรโตคอลที่ล้าสมัย เช่น FTP หรือ Telnet",
    "vulnerability": "5. ขาดการตรวจสอบซัพพลายเชนของซอฟต์แวร์ (Software Supply Chain) เช่น ไม่มีการตรวจสอบความน่าเชื่อถือของซอฟต์แวร์จากผู้จัดจำหน่าย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 3,
    "impact": 2,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ยกเลิกการใช้งานเทคโนโลยีที่ไม่มีการเข้ารหัสและตรวจสอบแหล่งที่มาของซอฟต์แวร์ให้ชัดเจน",
    "sub_actions": [
      "ปิดการใช้งานโปรโตคอลที่ไม่ปลอดภัยอย่าง FTP/Telnet และเปลี่ยนไปใช้ SFTP หรือ SSH ที่มีการเข้ารหัส",
      "จัดทำแนวทางการตรวจสอบความน่าเชื่อถือของผู้ผลิตซอฟต์แวร์ก่อนนำมาใช้งานในระบบ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_61",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของเครือข่าย (Network Security Risks)",
    "no": "13.0",
    "threat": "1. ถูกการโจมตีแบบ DDoS (Distributed Denial of Service) เช่น การส่งคำขอจำนวนมากเพื่อทำให้เครือข่ายหยุดทำงาน",
    "vulnerability": "1. การตั้งค่าความปลอดภัยที่ไม่เหมาะสม เช่น การตั้งค่าเราเตอร์หรือไฟร์วอลล์ที่ไม่ปลอดภัย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Transfer Risk",
    "treatment_plan": "เสริมความแข็งแกร่งให้แก่อุปกรณ์กระจายสัญญาณเพื่อรองรับภาระงานหนักและป้องกันการโจมตี",
    "sub_actions": [
      "ดำเนินการตรวจสอบและปรับปรุงคอนฟิก (Configuration Audit) ของเราเตอร์และไฟร์วอลล์ให้เป็นไปตามมาตรฐานความปลอดภัย",
      "ตั้งค่าการจำกัดปริมาณคำขอ (Rate Limiting) บนอุปกรณ์ไฟร์วอลล์เพื่อป้องกันการทำงานหนักเกินไปจากคำขอแปลกปลอม"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_62",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของเครือข่าย (Network Security Risks)",
    "no": "",
    "threat": "2. ถูกการโจมตีแบบ Man-in-the-Middle (MitM) เช่น การดักฟังข้อมูลระหว่างการสื่อสารผ่านเครือข่าย",
    "vulnerability": "2. ไม่มีการแยกเครือข่าย (Network Segmentation) เช่น ขาดการแยกเครือข่ายสำคัญออกจากเครือข่ายทั่วไป (VLAN)",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_63",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของเครือข่าย (Network Security Risks)",
    "no": "",
    "threat": "3. ถูกการโจมตีแบบ Phishing ผ่านเครือข่าย เช่น การส่งลิงก์ฟิชชิงหรือไฟล์ที่เป็นอันตรายผ่านอีเมล์หรือเครือข่าย",
    "vulnerability": "3. ขาดระบบตรวจจับและป้องกันภัยคุกคาม เช่น ไม่มีการติดตั้ง IDS/IPS (Intrusion Detection/Prevention Systems)",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Transfer Risk",
    "treatment_plan": "ใช้เทคโนโลยีตรวจสอบทราฟฟิกเพื่อค้นหาและระงับไฟล์หรือลิงก์อันตรายก่อนถึงตัวผู้ใช้",
    "sub_actions": [
      "ติดตั้งและเปิดใช้งานระบบ IDS/IPS เพื่อตรวจสอบและบล็อกพฤติกรรมการบุกรุกที่ผิดปกติในเครือข่ายสำนักงาน",
      "ตั้งค่าระบบกรองเนื้อหาอีเมล (Email Filtering) ที่ระดับเครือข่ายเพื่อตรวจสอบลิงก์และไฟล์แนบที่เป็นอันตราย"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_64",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของเครือข่าย (Network Security Risks)",
    "no": "",
    "threat": "4. มีการใช้ช่องโหว่ของโปรโตคอลเครือข่าย เช่น การโจมตีผ่านโปรโตคอล อาทิ DNS Spoofing หรือ ARP Poisoning",
    "vulnerability": "4. การใช้โปรโตคอลที่ล้าสมัย เช่น FTP หรือ Telnet ที่ไม่มีการเข้ารหัส",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Transfer Risk",
    "treatment_plan": "ยกเลิกการใช้เทคโนโลยีส่งข้อมูลแบบข้อความดิบ (Clear Text) และป้องกันการปลอมแปลงชื่อโดเมน",
    "sub_actions": [
      "ยกเลิกการใช้งาน FTP และ Telnet โดยเปลี่ยนไปใช้ SFTP และ SSH ที่มีการเข้ารหัสข้อมูลอย่างแน่นหนา",
      "เปิดใช้งานฟีเจอร์ DNSSEC บน DNS Server ของสำนักงานเพื่อป้องกันการโจมตีแบบ DNS Spoofing"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_65",
    "cluster": "ความเสี่ยงด้านความปลอดภัยของเครือข่าย (Network Security Risks)",
    "no": "",
    "threat": "5. มีการเข้าถึงเครือข่ายโดยไม่ได้รับอนุญาต เช่น บุคคลภายนอกหรืออุปกรณ์ที่ไม่ได้รับอนุญาตเชื่อมต่อกับเครือข่ายขององค์กร",
    "vulnerability": "5. ไม่มีการควบคุมการเข้าถึง (Access Control) เช่น ไม่มีการตรวจสอบอุปกรณ์หรือผู้ใช้ที่เชื่อมต่อกับเครือข่ายขององค์กร",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Transfer Risk",
    "treatment_plan": "ตรวจสอบตัวตนของอุปกรณ์และผู้ใช้งานทุกรายที่ต้องการเชื่อมต่อกับเครือข่ายภายใน",
    "sub_actions": [
      "บังคับใช้การยืนยันตัวตนด้วย MAC Address Filtering หรือมาตรฐาน 802.1X สำหรับอุปกรณ์ที่จะเชื่อมต่อเครือข่ายภายใน",
      "จัดทำบันทึกและตรวจสอบประวัติการเชื่อมต่อเครือข่าย (Network Log Review) อย่างสม่ำเสมอเพื่อค้นหาอุปกรณ์แปลกปลอม"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_66",
    "cluster": "ความเสี่ยงด้านความปลอดภัยทางกายภาพ (Physical Security Risks)",
    "no": "14.0",
    "threat": "1. มีการเข้าถึงพื้นที่โดยไม่ได้รับอนุญาต เช่น บุคคลภายนอกหรือผู้ไม่ได้รับอนุญาตสามารถเข้าถึงพื้นที่สำคัญได้ อาทิ ศูนย์ข้อมูลหรือเซิร์ฟเวอร์รูมหรือดาต้าเซ็นต์เตอร์",
    "vulnerability": "1. การขาดระบบควบคุมการเข้าถึง (Access Control) เช่น ไม่มีการกำหนดสิทธิ์หรือการยืนยันตัวตนก่อนเข้าถึงพื้นที่สำคัญ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_67",
    "cluster": "ความเสี่ยงด้านความปลอดภัยทางกายภาพ (Physical Security Risks)",
    "no": "",
    "threat": "2. มีการขโมยหรือสูญหายของอุปกรณ์ เช่น อุปกรณ์สำคัญต่างๆ อาทิ เซิร์ฟเวอร์ ฮาร์ดไดรฟ์ แล็ปท็อป ถูกขโมยหรือสูญหาย",
    "vulnerability": "2. ไม่มีการเฝ้าระวังด้วยกล้องวงจรปิด (CCTV) เช่น ขาดระบบเฝ้าระวังหรือการตรวจสอบเหตุการณ์ที่เกิดขึ้นในพื้นที่สำคัญ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_68",
    "cluster": "ความเสี่ยงด้านความปลอดภัยทางกายภาพ (Physical Security Risks)",
    "no": "",
    "threat": "3. มีการก่อวินาศกรรม (Sabotage) เช่น การทำลายทรัพย์สินหรือระบบโดยบุคคลภายในหรือบุคคลภายนอก",
    "vulnerability": "3. ไม่มีระบบป้องกันการก่อวินาศกรรม เช่น ขาดการออกแบบหรือมาตรการป้องกันการก่อวินาศกรรม",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_69",
    "cluster": "ความเสี่ยงด้านความปลอดภัยทางกายภาพ (Physical Security Risks)",
    "no": "",
    "threat": "4. เกิดภัยธรรมชาติ (Natural Disasters) เช่น น้ำท่วม ไฟไหม้ หรือแผ่นดินไหวที่ส่งผลกระทบต่ออุปกรณ์และข้อมูลสำคัญ",
    "vulnerability": "3. ไม่มีระบบป้องกันภัยธรรมชาติ เช่น ขาดการออกแบบหรือมาตรการป้องกันภัยธรรมชาติ อาทิ การป้องกันน้ำท่วม",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": false,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ลดผลกระทบจากอัคคีภัยหรืออุทกภัยที่อาจทำความเสียหายต่อข้อมูลยุทธศาสตร์จังหวัด",
    "sub_actions": [
      "ติดตั้งระบบตรวจจับควันและถังดับเพลิงชนิดไม่ทำลายอุปกรณ์อิเล็กทรอนิกส์ (เช่น CO2 หรือ FM-200)",
      "ติดตั้งอุปกรณ์บนชั้นวางที่สูงจากระดับพื้น (Raised Floor) เพื่อป้องกันความเสียหายจากน้ำท่วมขัง"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_70",
    "cluster": "ความเสี่ยงด้านความปลอดภัยทางกายภาพ (Physical Security Risks)",
    "no": "",
    "threat": "5. มีการขโมยข้อมูลผ่านการเข้าถึงทางกายภาพ เช่น การเชื่อมต่อกับพอร์ต USB หรือเครือข่ายโดยตรงในองค์กร เพื่อขโมยข้อมูล",
    "vulnerability": "5. การเก็บรักษาอุปกรณ์สำคัญในที่ไม่ปลอดภัย เช่น อุปกรณ์สำคัญถูกเก็บไว้ในพื้นที่ที่เข้าถึงได้ง่าย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ปิดช่องทางทางกายภาพที่อาจใช้ในการขโมยข้อมูลสำคัญหรือฝังมัลแวร์เข้าสู่ระบบ",
    "sub_actions": [
      "ติดตั้งอุปกรณ์ล็อคพอร์ต USB (Physical Port Blocker) สำหรับเครื่องคอมพิวเตอร์ที่เข้าถึงข้อมูล PDPA",
      "จัดห้องทำงานกลุ่มงานสุขภาพดิจิทัลให้เป็นสัดส่วน และไม่ทิ้งแล็ปท็อปไว้โดยไม่มีการล็อคกุญแจหรือสายเคเบิลล็อก"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_71",
    "cluster": "ความเสี่ยงจากการไม่ปฏิบัติตามกฎระเบียบและข้อบังคับ (Regulatory and Compliance Risks) (Non-Compliance Activity)",
    "no": "15.0",
    "threat": "1. บทลงโทษทางกฎหมาย เช่น การถูกปรับหรือฟ้องร้องจากการไม่ปฏิบัติตามกฎหมาย เช่น พรบ คอมพิวเตอร์, พรบ ข้อมูลส่วนบุคคล หรือ พรบ ไซเบอร์",
    "vulnerability": "1. การขาดความรู้เกี่ยวกับกฎหมายและข้อบังคับที่เกี่ยวข้อง เช่น พนักงานและผู้บริหารไม่ทราบถึงข้อกำหนดและกฎหมายที่ต้องปฏิบัติตาม",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ให้ความรู้เชิงลึกแก่ผู้บริหารและเจ้าหน้าที่เพื่อให้ปฏิบัติงานได้ถูกต้องตามระเบียบ",
    "sub_actions": [
      "จัดทำคู่มือปฏิบัติงานด้านกฎหมายดิจิทัล (Compliance Handbook) ฉบับย่อสำหรับเจ้าหน้าที่",
      "จัดประชุมชี้แจงข้อกฎหมายสำคัญที่เกี่ยวข้องกับงานสาธารณสุขจังหวัดให้แก่ผู้บริหารทุกระดับ"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_72",
    "cluster": "ความเสี่ยงจากการไม่ปฏิบัติตามกฎระเบียบและข้อบังคับ (Regulatory and Compliance Risks) (Non-Compliance Activity)",
    "no": "",
    "threat": "2. การเสียชื่อเสียง เช่น ความน่าเชื่อถือขององค์กรลดลงเนื่องจากการละเมิดกฎระเบียบข้อบังคับด้านความมั่นคงปลอดภัยของข้อมูล",
    "vulnerability": "2. ไม่มีระบบติดตามและตรวจสอบการปฏิบัติตามข้อกำหนด เช่น ขาดเครื่องมือหรือกระบวนการในการประเมินสถานะความสอดคล้อง",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_73",
    "cluster": "ความเสี่ยงจากการไม่ปฏิบัติตามกฎระเบียบและข้อบังคับ (Regulatory and Compliance Risks) (Non-Compliance Activity)",
    "no": "",
    "threat": "3. มีการหยุดชะงักของธุรกิจ เช่น การปิดระบบหรือบริการชั่วคราวเนื่องจากการตรวจสอบจากหน่วยงานกำกับดูแล",
    "vulnerability": "3. ขาดนโยบายและกระบวนการที่ชัดเจน เช่น ไม่มีแนวทางปฏิบัติที่ช่วยให้พนักงานรวมถึงหน่วยงานกำกับดูแลปฏิบัติตามข้อบังคับได้ง่าย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_74",
    "cluster": "ความเสี่ยงจากการไม่ปฏิบัติตามกฎระเบียบและข้อบังคับ (Regulatory and Compliance Risks) (Non-Compliance Activity)",
    "no": "",
    "threat": "4.มีความเสียหายทางการเงิน เช่น  การสูญเสียลูกค้าหรือโอกาสทางธุรกิจเนื่องจากการละเมิดข้อบังคับ",
    "vulnerability": "4. การจัดการเอกสารและข้อมูลที่ไม่เหมาะสม เช่น การจัดเก็บเอกสารหรือการตีความหมายของข้อมูลไม่ตรงตามข้อกำหนดของกฎหมาย",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_75",
    "cluster": "ความเสี่ยงจากการไม่ปฏิบัติตามกฎระเบียบและข้อบังคับ (Regulatory and Compliance Risks) (Non-Compliance Activity)",
    "no": "",
    "threat": "5. มีความเสี่ยงต่อความปลอดภัยของข้อมูล เช่น การจัดการข้อมูลไม่ตรงตามกฎหมาย อาจนำไปสู่การละเมิดข้อมูล",
    "vulnerability": "5. การไม่ทำการประเมินความเสี่ยงด้านข้อกำหนด เช่น ไม่ได้ตรวจสอบว่ากระบวนการใดอาจละเมิดข้อบังคับ",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "วิเคราะห์ความเสี่ยงของกระบวนการทำงานที่เกี่ยวข้องกับข้อมูลส่วนบุคคลอย่างเป็นระบบ",
    "sub_actions": [
      "ดำเนินการประเมินผลกระทบด้านการคุ้มครองข้อมูล (DPIA) สำหรับโครงการใหม่",
      "ทบทวนบันทึกรายการกิจกรรมประเมินผล (RoPA) เป็นประจำทุก 6 เดือน เพื่อให้ข้อมูลเป็นปัจจุบันที่สุด"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_76",
    "cluster": "การสูญหายหรือการรั่วไหลของข้อมูล (Data Loss or Data Leakage)",
    "no": "16.0",
    "threat": "1. มีการส่งข้อมูลโดยไม่ได้ตั้งใจ เช่น การส่งข้อมูลสำคัญไปยังผู้รับผิดคนหรือแพลตฟอร์มที่ไม่ปลอดภัย",
    "vulnerability": "1. การขาดการควบคุมการเข้าถึงข้อมูล เช่น ไม่มีการกำหนดสิทธิ์การเข้าถึงข้อมูลที่เหมาะสม",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ป้องกันความผิดพลาดจากการทำงาน (Human Error) โดยการจำกัดสิทธิ์และสร้างระบบทวนสอบ",
    "sub_actions": [
      "กำหนดสิทธิ์การเข้าถึงข้อมูลในระบบ Dashboard และฐานข้อมูลกลางตามบทบาทหน้าที่ (RBAC)",
      "กำหนดขั้นตอนการตรวจสอบและยืนยันรายชื่อผู้รับก่อนการส่งข้อมูลสำคัญออกสู่ภายนอกหน่วยงาน"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_77",
    "cluster": "การสูญหายหรือการรั่วไหลของข้อมูล (Data Loss or Data Leakage)",
    "no": "",
    "threat": "2. มีการขโมยข้อมูลโดยเจตนา เช่น พนักงานที่ไม่พอใจหรือบุคคลภายนอกขโมยข้อมูลเพื่อผลประโยชน์ส่วนตัว",
    "vulnerability": "2. การไม่มีการเข้ารหัสข้อมูล เช่น ข้อมูลที่จัดเก็บหรือรับส่งกัน ไม่มีการเข้ารหัส",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": false
    },
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "risk_owner": "CSMR",
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ปกป้องความลับด้วยเทคโนโลยีการเข้ารหัส",
    "sub_actions": [
      "บังคับใช้การเข้ารหัสไฟล์ข้อมูล (Encryption) ที่มีความอ่อนไหวสูงก่อนการจัดเก็บในเครื่องแม่ข่าย",
      "บังคับใช้โปรโตคอลการรับส่งข้อมูลที่มีการเข้ารหัสลับ (HTTPS/SSL) ในทุกระบบงานดิจิทัล"
    ],
    "expected_finish_date": "ภายใน 30 ก.ย. 69",
    "progress_percent": 0,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_78",
    "cluster": "การสูญหายหรือการรั่วไหลของข้อมูล (Data Loss or Data Leakage)",
    "no": "",
    "threat": "3. มีการละเมิดข้อมูลผ่านเครือข่ายที่ไม่ปลอดภัย เช่น การรั่วไหลของข้อมูลที่ส่งผ่าน Wi-Fi หรือเครือข่ายที่ไม่มีการเข้ารหัส",
    "vulnerability": "3. ขาดนโยบายและกระบวนการจัดการข้อมูล เช่น ไม่มีการกำหนดนโยบายในการจัดการข้อมูลสำคัญและข้อมูลส่วนบุคคล",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_score": 5,
    "further_actions": "5"
  },
  {
    "id": "risk_79",
    "cluster": "การสูญหายหรือการรั่วไหลของข้อมูล (Data Loss or Data Leakage)",
    "no": "",
    "threat": "4. ถูกการโจมตีแบบ Phishing เช่น ผู้โจมตีใช้ฟิชชิงเพื่อเข้าถึงข้อมูลสำคัญผ่านอีเมล์หรือข้อความ",
    "vulnerability": "4. การขาดระบบป้องกันข้อมูลรั่วไหล (Data Loss Prevention - DLP) เช่น ไม่มีการใช้ระบบเพื่อตรวจจับและป้องกันการถ่ายโอนข้อมูลที่ไม่ได้รับอนุญาต",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": false
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  },
  {
    "id": "risk_80",
    "cluster": "การสูญหายหรือการรั่วไหลของข้อมูล (Data Loss or Data Leakage)",
    "no": "",
    "threat": "5. มีการติดมัลแวร์หรือแรนซัมแวร์ เช่น มีการใช้มัลแวร์เพื่อดึงข้อมูลหรือขัดขวางการเข้าถึงข้อมูล",
    "vulnerability": "5. อุปกรณ์และบัญชีทรัพย์สินที่ไม่ได้รับการควบคุม เช่น อุปกรณ์พกพาหรือบัญชีผู้ใช้งานที่ไม่ได้ใช้งานยังสามารถเข้าถึงข้อมูลได้",
    "current_control": "ยังไม่มีมาตรการควบคุมที่เข้มแข็งและเพียงพอ",
    "impact_cia": {
      "c": true,
      "i": false,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": false,
      "o": false
    },
    "likelihood": 1,
    "impact": 3,
    "risk_level": 3,
    "risk_owner": "CSMR",
    "treatment_option": "Continue Monitoring",
    "treatment_plan": "",
    "sub_actions": [],
    "expected_finish_date": "",
    "progress_percent": 100,
    "residual_likelihood": 1,
    "residual_impact": 1,
    "residual_risk_score": 1,
    "further_actions": ""
  }
];

export const MODEL_MATRIX_CONFIG = {
  cols: [
    { id: 1, nameEn: 'Rare', nameTh: 'เกิดขึ้นได้ยาก', prob: '< 20%' },
    { id: 2, nameEn: 'Unlikely', nameTh: 'มีโอกาสเกิดขึ้นน้อย', prob: '20-40%' },
    { id: 3, nameEn: 'Moderate', nameTh: 'อาจเกิดขึ้น', prob: '40-60%' },
    { id: 4, nameEn: 'Likely', nameTh: 'มีโอกาสเกิดขึ้น', prob: '60-80%' },
    { id: 5, nameEn: 'Almost certain', nameTh: 'เกือบเกิดขึ้นแน่นอน', prob: '> 80%' }
  ],
  rows: [
    { id: 5, nameEn: 'Severe', nameTh: 'ระดับวิกฤต (ข)' },
    { id: 4, nameEn: 'Significant', nameTh: 'ระดับวิกฤต (ก)' },
    { id: 3, nameEn: 'Moderate', nameTh: 'ระดับร้ายแรง' },
    { id: 2, nameEn: 'Minor', nameTh: 'ระดับไม่ร้ายแรง' },
    { id: 1, nameEn: 'Insignificant', nameTh: 'ไม่มีผลกระทบหรือมีผลกระทบเล็กน้อย' }
  ],
  // Grid cells [rowId][colId]
  cells: {
    5: {
      1: { score: 5, label: 'Med 5', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      2: { score: 10, label: 'High 10', level: 'High', bg: '#fed7aa', text: '#9a3412', appetite: false },
      3: { score: 15, label: 'Very High 15', level: 'Very High', bg: '#fecaca', text: '#991b1b', appetite: false },
      4: { score: 20, label: 'Extreme 20', level: 'Very High', bg: '#f87171', text: '#ffffff', appetite: false },
      5: { score: 25, label: 'Extreme 25', level: 'Very High', bg: '#ef4444', text: '#ffffff', appetite: false }
    },
    4: {
      1: { score: 4, label: 'Med 4', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      2: { score: 8, label: 'Med 8', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      3: { score: 12, label: 'High 12', level: 'High', bg: '#fed7aa', text: '#9a3412', appetite: false },
      4: { score: 16, label: 'Very High 16', level: 'Very High', bg: '#fecaca', text: '#991b1b', appetite: false },
      5: { score: 20, label: 'Extreme 20', level: 'Very High', bg: '#f87171', text: '#ffffff', appetite: false }
    },
    3: {
      1: { score: 3, label: 'Low 3', level: 'Low', bg: '#86efac', text: '#14532d', appetite: true },
      2: { score: 6, label: 'Med 6', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      3: { score: 9, label: 'Med 9', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      4: { score: 12, label: 'High 12', level: 'High', bg: '#fed7aa', text: '#9a3412', appetite: false },
      5: { score: 15, label: 'Very High 15', level: 'Very High', bg: '#fecaca', text: '#991b1b', appetite: false }
    },
    2: {
      1: { score: 2, label: 'Very Low 2', level: 'Low', bg: '#86efac', text: '#14532d', appetite: true },
      2: { score: 4, label: 'Low 4', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      3: { score: 6, label: 'Med 6', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      4: { score: 8, label: 'Med 8', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      5: { score: 10, label: 'High 10', level: 'High', bg: '#fed7aa', text: '#9a3412', appetite: false }
    },
    1: {
      1: { score: 1, label: 'Very Low 1', level: 'Low', bg: '#86efac', text: '#14532d', appetite: true },
      2: { score: 2, label: 'Very Low 2', level: 'Low', bg: '#86efac', text: '#14532d', appetite: true },
      3: { score: 3, label: 'Low 3', level: 'Low', bg: '#86efac', text: '#14532d', appetite: true },
      4: { score: 4, label: 'Med 4', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false },
      5: { score: 5, label: 'Med 5', level: 'Moderate', bg: '#fef08a', text: '#854d0e', appetite: false }
    }
  }
};

export const RISK_CRITERIA_DATA = {
  severityImpact: [
    {
      level: '5. Severe (วิกฤต ข)',
      threatDesc: 'ภัยคุกคามที่มีผลกระทบอย่างรุนแรงมากที่สุด ถือว่าเป็นภัยต่อความมั่นคงของรัฐ ระบบพังทลายไม่สามารถกู้คืนได้',
      business: 'มีผลต่อธุรกิจอย่างต่อเนื่องในระดับประเทศและขยายวงกว้าง',
      userImpact: 'กระทบผู้ใช้งานเกินร้อยละ 50 ของทั้งหมด',
      reputation: 'กระทบต่อชื่อเสียงระยะยาวจนส่งผลต่อความน่าเชื่อถือ',
      image: 'ส่งผลกระทบอย่างรุนแรงมากระดับชาติและต่อการลงทุน',
      legal: 'ส่งผลโดยตรงต่อการปฏิบัติตามกฎหมายที่ต้องรายงานทันที',
      otherSystems: 'ส่งผลโดยตรงต่อโครงสร้างพื้นฐานสำคัญระดับประเทศในวงกว้าง'
    },
    {
      level: '4. Significant (วิกฤต ก)',
      threatDesc: 'ภัยคุกคามที่ส่งผลรุนแรงมากต่อการดำเนินงานหลัก ระบบทำงานล้มเหลวและไม่สามารถกู้คืนตามแผนได้',
      business: 'มีผลต่อธุรกิจอย่างต่อเนื่อง เนื่องจากไม่สามารถกู้คืน CII ได้',
      userImpact: 'กระทบผู้ใช้งานเกินร้อยละ 50 ของทั้งหมด',
      reputation: 'กระทบต่อชื่อเสียงระยะยาวจนส่งผลต่อความน่าเชื่อถือ',
      image: 'ส่งผลกระทบอย่างรุนแรงต่อความเชื่อมั่นในองค์กรและประเทศ',
      legal: 'ส่งผลโดยตรงต่อการปฏิบัติตามข้อบังคับทางกฎหมาย',
      otherSystems: 'ส่งผลต่อระบบโครงสร้างพื้นฐานอื่นๆ ได้'
    },
    {
      level: '3. Moderate (ร้ายแรง)',
      threatDesc: 'ภัยคุกคามมีผลกระทบสำคัญต่อหลายระบบ ทำให้บริการหลักหยุดชะงัก กู้คืนตามแผนไม่ได้',
      business: 'มีผลกระทบต่อการขยายของธุรกิจ',
      userImpact: 'กระทบผู้ใช้งานไม่เกินร้อยละ 50 ของทั้งหมด',
      reputation: 'กระทบต่อชื่อเสียงระยะสั้นของหน่วยงาน',
      image: 'ส่งผลกระทบต่อชื่อเสียงขององค์กร',
      legal: 'ส่งผลต่อการปฏิบัติตามข้อบังคับบางประการ',
      otherSystems: 'อาจขยายผลกระทบไปยังหลายระบบได้'
    },
    {
      level: '2. Minor (ไม่ร้ายแรง)',
      threatDesc: 'มีผลกระทบเพียงเล็กน้อยต่อระบบบางส่วนหรือในวงจำกัด บริการด้อยประสิทธิภาพลงแต่ไม่หยุดชะงัก',
      business: 'การเตรียมการป้องกันพื้นฐานป้องกันผลกระทบได้',
      userImpact: 'กระทบเฉพาะผู้ใช้งานภายในหน่วยงาน',
      reputation: 'ไม่กระทบต่อชื่อเสียงของหน่วยงาน',
      image: 'ไม่ได้รับผลกระทบที่ชัดเจน',
      legal: 'ไม่ละเมิดกฎหมายหรือข้อบังคับ',
      otherSystems: 'มีผลเพียงเล็กน้อยกับระบบบริการหลักที่ไม่สำคัญ'
    },
    {
      level: '1. Insignificant (กระทบเล็กน้อย)',
      threatDesc: 'ไม่มีผลกระทบใดๆ ต่อระบบ ข้อมูล หรือการดำเนินงานขององค์กร',
      business: 'ไม่มีการหยุดชะงักของระบบหรือข้อมูลใดๆ',
      userImpact: 'ไม่มีผลกระทบต่อผู้ใช้บริการ',
      reputation: 'ไม่กระทบต่อชื่อเสียงของหน่วยงาน',
      image: 'ไม่มีผลกระทบต่อภาพลักษณ์',
      legal: 'ไม่มีผลต่อการปฏิบัติตามข้อกำหนดหรือกฎหมาย',
      otherSystems: 'ระบบอื่นๆ ไม่ได้รับผลกระทบ'
    }
  ],
  likelihoodProbability: [
    { level: '5. Almost certain (เกือบเกิดขึ้นแน่นอน)', desc: 'เหตุการณ์ที่มีความแน่นอน หรือ เกือบเกิดขึ้นเป็นปกติ', freq: '> 80% หรือทุกๆ วัน' },
    { level: '4. Likely (มีโอกาสเกิดขึ้น)', desc: 'เหตุการณ์ที่เป็นไปได้สูง หรือมีโอกาสเกิดขึ้นเป็นปกติ', freq: '60 - 80% หรือทุกๆ สัปดาห์' },
    { level: '3. Moderate (อาจเกิดขึ้น)', desc: 'เหตุการณ์ที่น่าจะเป็นไปได้ หรืออาจเกิดขึ้นได้บางครั้ง', freq: '40 - 60% หรือทุกๆ เดือน' },
    { level: '2. Unlikely (มีโอกาสเกิดขึ้นน้อย)', desc: 'เหตุการณ์ที่อาจเกิดขึ้นน้อยมาก หรือมีโอกาสเกิดขึ้นได้น้อย', freq: '20 - 40% หรือทุกๆ 3 เดือน' },
    { level: '1. Rare (เกิดขึ้นได้ยาก)', desc: 'เหตุการณ์ที่ไม่น่ามีโอกาสเกิดขึ้นได้', freq: '0.1 - 20% หรือทุกๆ 6 เดือนหรือมากกว่า' }
  ],
  riskLevelScoring: [
    { score: '15 - 25', level: 'Very High / Severe', badge: 'bg-red-500 text-white', desc: 'เป็นความเสี่ยงขั้นวิกฤติ ต้องมีการดำเนินการโดยทันทีและมีการวางแผนจัดการความเสี่ยง' },
    { score: '10 - 12', level: 'High / Significant', badge: 'bg-orange-500 text-white', desc: 'เป็นความเสี่ยงสูง ต้องมีการดำเนินการบางอย่างเพื่อลดความเสี่ยง' },
    { score: '4 - 9', level: 'Moderate', badge: 'bg-yellow-400 text-yellow-900', desc: 'เป็นความเสี่ยงปานกลาง ดังนั้นต้องมีการติดตามและอาจมีมาตรการป้องกัน' },
    { score: '1 - 3', level: 'Low / Minor', badge: 'bg-emerald-500 text-white', desc: 'ต้องมีการติดตามเป็นระยะ แต่ยังไม่ต้องมีการดำเนินการใดๆ เพิ่มเติม' }
  ],
  riskLevelAverage: [
    { score: '12.5 - 25', level: 'Very High', color: 'แดง (Red)', badge: 'bg-red-500 text-white', desc: 'เป็นความเสี่ยงขั้นวิกฤติ ต้องมีการดำเนินการโดยทันทีและมีการวางแผนจัดการความเสี่ยง' },
    { score: '9.5 - 12.4', level: 'High', color: 'ส้ม (Orange)', badge: 'bg-orange-500 text-white', desc: 'เป็นความเสี่ยงสูง ต้องมีการดำเนินการบางอย่างเพื่อลดความเสี่ยง' },
    { score: '3.5 - 9.4', level: 'Moderate', color: 'เหลือง (Yellow)', badge: 'bg-yellow-400 text-yellow-900', desc: 'เป็นความเสี่ยงปานกลาง ดังนั้นต้องมีการติดตามและอาจมีมาตรการป้องกัน' },
    { score: '1 - 3.4', level: 'Low', color: 'เขียว (Green)', badge: 'bg-emerald-500 text-white', desc: 'ต้องมีการติดตามเป็นระยะ แต่ยังไม่ต้องมีการดำเนินการใดๆ เพิ่มเติม' }
  ],
  cyberActMinControls: [
    { tier: 'High (สูง)', minDocs: 17, scoreRange: '9.5 - 25', color: 'แดง (Red)', badge: 'bg-red-500 text-white', desc: 'ความเสี่ยงทางด้านไซเบอร์ขั้นสูง ต้องมีการจัดทำเอกสารอย่างน้อย 17 หัวข้อ ตามข้อกำหนด ซึ่งรวมเอกสารความเสี่ยงขั้นต่ำและขั้นปานกลางแล้ว' },
    { tier: 'Moderate (กลาง)', minDocs: 13, scoreRange: '4.5 - 9.4', color: 'เหลือง (Yellow)', badge: 'bg-yellow-400 text-yellow-900', desc: 'ความเสี่ยงทางด้านไซเบอร์ขั้นปานกลาง ต้องมีการจัดทำเอกสารอย่างน้อย 13 หัวข้อ ตามข้อกำหนด ซึ่งรวมเอกสารความเสี่ยงขั้นต่ำแล้ว' },
    { tier: 'Low (ต่ำ)', minDocs: 10, scoreRange: '1 - 4.4', color: 'เขียว (Green)', badge: 'bg-emerald-500 text-white', desc: 'ความเสี่ยงทางด้านไซเบอร์ขั้นต่ำ ต้องมีการจัดทำเอกสารอย่างน้อย 10 หัวข้อ ตามข้อกำหนด' }
  ],
  progressStatus: [
    { range: '1 - 50 %', color: 'แดง (Red)', badge: 'bg-red-500 text-white', desc: 'ต้องรีบเร่งดำเนินการ โดยเร่งด่วน' },
    { range: '51 - 80 %', color: 'เหลือง (Yellow)', badge: 'bg-yellow-400 text-yellow-900', desc: 'ต้องเร่งดำเนินการ โดยเร็ว' },
    { range: '81 - 100 %', color: 'เขียว (Green)', badge: 'bg-emerald-500 text-white', desc: 'อยู่ในระยะที่ปลอดภัย แค่ต้องติดตามให้ได้ตามเป้า' }
  ],
  residualRisk: [
    { range: '15 - 25', color: 'แดง (Red)', badge: 'bg-red-500 text-white', desc: 'เป็นความเสี่ยงขั้นวิกฤติ ต้องมีการดำเนินการโดยทันทีและมีการวางแผนจัดการความเสี่ยง' },
    { range: '10 - 12', color: 'ส้ม (Orange)', badge: 'bg-orange-500 text-white', desc: 'เป็นความเสี่ยงสูง ต้องมีการดำเนินการบางอย่างเพื่อลดความเสี่ยง' },
    { range: '6 - 9', color: 'เหลือง (Yellow)', badge: 'bg-yellow-400 text-yellow-900', desc: 'เป็นความเสี่ยงปานกลาง ดังนั้นต้องมีการติดตามและอาจมีมาตรการป้องกัน' },
    { range: '1 - 5', color: 'เขียว (Green)', badge: 'bg-emerald-500 text-white', desc: 'เป็นความเสี่ยงปานต่ำ แต่ต้องมีการติดตามเป็นระยะ' }
  ]
};

export const MANDATORY_DOCUMENTS_DATA = {
  title: 'การกำหนดมาตรการควบคุมความมั่นคงปลอดภัยไซเบอร์ขั้นต่ำ สำหรับข้อมูลหรือระบบสารสนเทศ',
  subtitle: 'ฉบับที่ 12 , มีผล 18 มกราคม 2568',
  tiers: [
    {
      id: 'low',
      title: 'ความเสี่ยงทางด้านไซเบอร์ต่ำ (10 ฉบับ)',
      scoreRange: '1 - 4.4',
      badgeColor: 'bg-emerald-600',
      items: [
        'Cybersecurity Risk Assessment',
        'Cybersecurity Incident Response Plan',
        'Asset MGT',
        'Risk Assessment and Risk MGT Strategy',
        'Access Control',
        'System Hardening',
        'Cybersecurity Awareness',
        'Cyber Threat Detection and Monitoring',
        'Crisis Communication Plan',
        'Cybersecurity Exercise'
      ]
    },
    {
      id: 'moderate',
      title: 'ความเสี่ยงทางด้านไซเบอร์ปานกลาง (13 ฉบับ)',
      scoreRange: '4.5 - 9.4',
      badgeColor: 'bg-yellow-500',
      parentNote: 'ทำตามความเสี่ยงต่ำทั้งหมด (10 ฉบับ)',
      items: [
        'Cybersecurity Audit Plan',
        'Remote Connection',
        'Removable Storage Media'
      ]
    },
    {
      id: 'high',
      title: 'ความเสี่ยงทางด้านไซเบอร์สูง (17 ฉบับ)',
      scoreRange: '9.5 - 25',
      badgeColor: 'bg-rose-600',
      parentNote: 'ทำตามความเสี่ยงปานกลางทั้งหมด (13 ฉบับ)',
      items: [
        'Vulner Assessment and Pen Testing',
        'Third Party MGT',
        'Information Sharing',
        'Cybersecurity Resilience and Recovery'
      ]
    }
  ]
};

export const COMPARE_MATRIX_DATA = [
  { no: 1, en: 'Risk ID', th: 'ความเสี่ยงลำดับที่ (Risk ID)', phase: 'Risk Identification', register: 'x', assess: 'x', profile: 'x' },
  { no: 2, en: 'Risk Category', th: 'กลุ่มความเสี่ยง', phase: 'Risk Identification', register: 'x-green', assess: '', profile: 'x-yellow' },
  { no: 3, en: 'Date Added', th: 'วันที่ระบุความเสี่ยง (Date the risk is identified)/ วันที่ทบทวน', phase: 'Risk Identification', register: 'x-red-on-green', assess: '', profile: '' },
  { no: 4, en: 'Risk Title', th: 'การระบุความเสี่ยง (Risk Identification)', phase: 'Risk Identification', register: 'x', assess: 'x', profile: 'x' },
  { no: 5, en: 'Risk Description', th: 'คำอธิบายของความเสี่ยง (Description of the risk)', phase: 'Risk Identification', register: 'x', assess: 'x', profile: 'x' },
  { no: 6, en: 'Likelihood (Frequency) / Probability', th: 'ความน่าจะเป็นหรือเกิดเหตุการณ์', phase: 'Risk Assessment/ Risk Analysis', register: 'x', assess: 'x', profile: 'x' },
  { no: 7, en: 'Consequence / Impact / Severity', th: 'ผลกระทบที่ตามมา', phase: 'Risk Assessment/ Risk Analysis', register: 'x', assess: 'x', profile: 'x' },
  { no: 8, en: 'Risk Grade / Risk Level', th: 'ระดับความเสี่ยง', phase: 'Risk Assessment/ Risk Analysis', register: 'x', assess: 'x', profile: 'x' },
  { no: 9, en: 'Prevention', th: 'ป้องกัน', phase: 'Plan Forward', register: 'x-green', assess: '', profile: 'x-yellow' },
  { no: 10, en: 'Monitoring & Control', th: 'เฝ้าระวังและควบคุม', phase: 'Plan Forward', register: 'x-green', assess: '', profile: 'x-yellow' },
  { no: 11, en: 'Mitigation', th: 'การจัดการความเสี่ยง (Risk Treatment)', phase: 'Plan Forward', register: 'x', assess: 'x', profile: 'x' },
  { no: 12, en: 'Risk Owner', th: 'เจ้าของความเสี่ยง (Risk Owner)', phase: 'Review', register: 'x', assess: 'x', profile: '' },
  { no: 13, en: 'Date Last Review', th: 'วันที่ทบทวนล่าสุด', phase: 'Review', register: 'x-red-on-green', assess: '', profile: '' },
  { no: 14, en: 'Risk Status', th: 'สถานะของการจัดการความเสี่ยง (Status of Risk Treatment)', phase: 'Review', register: 'x-green', assess: '', profile: '' },
  { no: 15, en: 'Data Quantitative', th: 'แสดงข้อมูลเชิงปริมาณ - จำนวนครั้งที่เกิดเหตุการณ์', phase: 'Review', register: '', assess: '', profile: 'x-yellow' }
];
