// ข้อมูลสำหรับโมดูล 4.5 การประเมินความเสี่ยงที่เกี่ยวข้องกับบริการและห่วงโซ่อุปทานผลิตภัณฑ์ (3rd party - Zero Trust)
// ถอดแบบจากเอกสารจริง สสจ.สระแก้ว

export const DEFAULT_THIRD_PARTY_HEADER = {
  evaluator: 'คณะกรรมการพิจารณาความเสี่ยง',
  recorder: 'นายธนกฤต นิธิตันติปัญญา, สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  meeting_date: '25 กุมภาพันธ์ 2569',
  vendor_name: 'ห้างหุ้นส่วนจำกัด มิพเบิ้ล',
  critical_service: 'Web Application บริหารจัดการระบบ BackOffice, การบริการเก็บข้อมูล (Cloud Hosting Service)'
}

export const DEFAULT_THIRD_PARTY_LOGS = [
  { id: 'log_1', date: '2 ก.ย. 2567', detail: 'เริ่มดำเนินการสร้าง Template จนแล้วเสร็จและทำการระบุวัตถุประสงค์ (Objective) และกำหนดเกณฑ์ที่ใช้ในการประเมิน ( Criteria)' },
  { id: 'log_2', date: '9 ก.ย. 2567', detail: 'ดำเนินการจัดการประเมินความเสี่ยงและทำการอัพเดทสถานะ' },
  { id: 'log_3', date: '23 ก.ย. 2567', detail: 'ทำการประเมินสถานภาพอีกครั้งอีกครั้ง เพื่อประเมินความพร้อมในการตรวจสอบ' },
  { id: 'log_4', date: '1 พ.ค. 2568', detail: 'ทำการปรับปรุงเงื่อนไขและผลกระทบ เพื่อความพร้อมในการตรวจสอบ' },
  { id: 'log_5', date: '4 พ.ค. 2568', detail: 'ทำการปรับปรุงการระบุความเสี่ยง (Risk Identification) ใหม่ทั้งหมด เพื่อให้สอดคล้องกับความเป็นจริง' },
  { id: 'log_6', date: '18 พ.ค. 2568', detail: 'ทำการปรับปรุงระดับความเสี่ยงที่ยอมรับได้ (Risk Appetite)' }
]

export const THIRD_PARTY_CLUSTERS = [
  {
    "id": 1,
    "name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)"
  },
  {
    "id": 2,
    "name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)"
  },
  {
    "id": 3,
    "name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)"
  },
  {
    "id": 4,
    "name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)"
  },
  {
    "id": 5,
    "name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)"
  },
  {
    "id": 6,
    "name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)"
  },
  {
    "id": 7,
    "name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)"
  },
  {
    "id": 8,
    "name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)"
  },
  {
    "id": 9,
    "name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)"
  },
  {
    "id": 10,
    "name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)"
  }
];

export const DEFAULT_THIRD_PARTY_ITEMS = [
  {
    "id": "item_1.1",
    "item_no": "1.1",
    "cluster_id": 1,
    "cluster_name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)",
    "title": "ไม่มีการแต่งตั้ง CISO / DPO หรือผู้ที่รับผิดชอบทางด้านไซเบอร์และป้องกันข้อมูลบุคคล",
    "threat": "ไม่มีการแต่งตั้ง CISO / DPO อย่างเป็นทางการ",
    "vulnerability": "ขาดความรับผิดชอบที่ชัดเจนในการควบคุมความมั่นคงปลอดภัย",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 5,
    "impact": 5,
    "risk_level": 25,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำคำสั่งแต่งตั้ง CISO / DPO ที่ชัดเจน และประกาศใช้อย่างเป็นทางการ | จัดทำ Org Chart และกำหนดหน้าที่ให้ชัดเจน",
    "responsible_person": "",
    "progress_percent": 50,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_1.2",
    "item_no": "1.2",
    "cluster_id": 1,
    "cluster_name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)",
    "title": "ไม่มีนโยบายความมั่นคงปลอดภัยไซเบอร์และข้อมูลสารสนเทศ",
    "threat": "ขาดนโยบายความมั่นคงปลอดภัยที่ครอบคลุม",
    "vulnerability": "นโยบายไม่ครอบคลุมทุกประเด็นหรือไม่อัปเดต",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำและประกาศใช้นโยบายที่สอดคล้องกับ พ.ร.บ.ไซเบอร์, ISO 27001 | จัดกระบวนการทบทวนและการอนุมัตินโยบาย",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 3,
    "residual_risk_level": 3,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_1.3",
    "item_no": "1.3",
    "cluster_id": 1,
    "cluster_name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)",
    "title": "ไม่มีการทบทวนและอัปเดตนโยบาย, ขั้นตอนการปฏิบัติงานเป็นประจำ",
    "threat": "ขาดการอัปเดตนโยบายตามสถานการณ์ปัจจุบัน",
    "vulnerability": "ไม่มีผู้รับผิดชอบในการทบทวนและไม่มี Log การเปลี่ยนแปลง",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนดรอบการทบทวนการป้องกัน เช่น ปีละ 1 ครั้ง หรือเมื่อเกิดเหตุการณ์ | จัดทำ Version Control และแต่งตั้งผู้ทบทวนอย่างเป็นทางการ",
    "responsible_person": "",
    "progress_percent": 45,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_1.4",
    "item_no": "1.4",
    "cluster_id": 1,
    "cluster_name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)",
    "title": "ไม่มีการเก็บหลักฐานการปฏิบัติงาน ตามนโยบาย, ขั้นตอนการปฏิบัติงาน หรืออื่นๆ",
    "threat": "ไม่มีหลักฐานยืนยันการปฏิบัติตามนโยบาย",
    "vulnerability": "ขาดระบบการจัดเก็บเอกสารและหลักฐานที่ปลอดภัย",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดเก็บ Log, เอกสาร, หรือรายงานผลการตรวจสอบ | ใช้ระบบ DMS - Document Management System หรือเก็บข้อมูลในพื้นที่ที่มีการควบคุมสิทธิ์เข้าถึง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_1.5",
    "item_no": "1.5",
    "cluster_id": 1,
    "cluster_name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)",
    "title": "ไม่มีการกำหนดบทบาทหน้าที่ของบุคคลกรที่ชัดเจนในด้านการรักษาความมั่นคงปลอดภัยไซเบอร์",
    "threat": "ชัดเจนในการดำเนินงานด้านไซเบอร์",
    "vulnerability": "ไม่มีเอกสารกำกับหน้าที่ หรือเกิดความซ้ำซ้อน",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ระบุใน JD - Job Description ของพนักงานอย่างชัดเจน | จัดทำ Job Description/Responsibility Matrix",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_1.6",
    "item_no": "1.6",
    "cluster_id": 1,
    "cluster_name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)",
    "title": "ไม่มีการมอบหมายผู้รับผิดชอบในการจัดการความเสี่ยงทางด้านไซเบอร์",
    "threat": "ไม่มีผู้รับผิดชอบด้าน Cyber Risk",
    "vulnerability": "ความเสี่ยงไม่ได้ถูกจัดการหรือติดตามอย่างต่อเนื่อง",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "แต่งตั้ง Risk Owner สำหรับความเสี่ยงแต่ละรายการ | ประยุกต์ Risk Register มาใช้ร่วมกับ CISOและผู้เกี่ยวข้อง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_1.7",
    "item_no": "1.7",
    "cluster_id": 1,
    "cluster_name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)",
    "title": "ไม่มีการประชุมติดตามงาน การแก้ไขปัญหาด้านความมั่นคงปลอดภัยไซเบอร์",
    "threat": "ติดตามปัญหาและแผนงานด้านไซเบอร์",
    "vulnerability": "ขาดการสื่อสารระหว่างฝ่ายต่างๆ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดประชุมรายเดือน พร้อมรายงานสรุป Cybersecurity Issues | จัดตั้ง Cybersecurity Committee และควรมีบันทึกการประชุม",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 3,
    "residual_risk_level": 3,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_1.8",
    "item_no": "1.8",
    "cluster_id": 1,
    "cluster_name": "Cybersecurity Governance & Policy (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 1 และ 2)",
    "title": "ไม่มีการรายงานสถานะทางด้านไซเบอร์ต่อผู้บริหาร",
    "threat": "สถานะความมั่นคงปลอดภัยไซเบอร์",
    "vulnerability": "ไม่มีรูปแบบรายงานที่เข้าใจง่าย สำหรับผู้บริหาร",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 4,
    "risk_level": 12,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Cybersecurity Dashboard หรือ Executive Summary | พัฒนาแบบฟอร์มรายงานรายเดือน พร้อมการสรุป Risk Level",
    "responsible_person": "",
    "progress_percent": 66,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 3,
    "residual_risk_level": 3,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_2.1",
    "item_no": "2.1",
    "cluster_id": 2,
    "cluster_name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)",
    "title": "ไม่มีการปฏิบัติตามข้อกำหนด พ.ร.บ.ไซเบอร์",
    "threat": "ฝ่าฝืน พ.ร.บ.ไซเบอร์ ทำให้องค์กรถูกลงโทษ",
    "vulnerability": "ขาดความเข้าใจในข้อกำหนดของ พ.ร.บ.ไซเบอร์",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำแผนปฏิบัติตาม พ.ร.บ.ไซเบอร์ พร้อมมีการตรวจสอบเป็นระยะ | อบรมผู้เกี่ยวข้องเรื่องข้อกำหนดกับแนวปฏิบัติภายในให้ถูกต้อง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_2.2",
    "item_no": "2.2",
    "cluster_id": 2,
    "cluster_name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)",
    "title": "ไม่มีการปฏิบัติตามข้อกำหนด พ.ร.บ.คอมพิวเตอร์",
    "threat": "มีการใช้งานระบบที่อาจเข้าข่ายผิด พ.ร.บ.คอมพิวเตอร์",
    "vulnerability": "ไม่มีคู่มือแนวปฏิบัติด้านการใช้ระบบคอมพิวเตอร์อย่างปลอดภัย",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ตรวจสอบการใช้งานระบบ IT ให้สอดคล้องกับกฎหมาย | จัดทำนโยบายการใช้ระบบคอมพิวเตอร์และสื่อสารให้แก่ผู้ใช้งานระบบ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_2.3",
    "item_no": "2.3",
    "cluster_id": 2,
    "cluster_name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)",
    "title": "ไม่มีการปฏิบัติตามข้อกำหนด พ.ร.บ.คุ้มครองข้อมูล",
    "threat": "ละเมิด พ.ร.บ.คุ้มครองข้อมูล ทำให้ถูกฟ้องร้อง",
    "vulnerability": "ขาดกระบวนการควบคุมข้อมูลส่วนบุคคลอย่างเป็นระบบ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ทำ DPIA (Data Protection Impact Assessment) และตรวจสอบ Data Flow | แต่งตั้ง DPO และจัดทำนโยบาย PDPA พร้อมกระบวนการร้องเรียน/ถอนความยินยอม",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_2.4",
    "item_no": "2.4",
    "cluster_id": 2,
    "cluster_name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)",
    "title": "ไม่มีการกำหนดบุคลากร (DPO) ตาม พ.ร.บ.คุ้มครองข้อมูล",
    "threat": "ไม่แต่งตั้ง DPO ตามที่กฎหมายกำหนด",
    "vulnerability": "บุคลากรไม่ทราบบทบาทหน้าที่ของ DPO",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "พิจารณาและแต่งตั้ง DPO อย่างเป็นทางการ | จัดทำ TOR / JD ของ DPO พร้อมอบรมบทบาทหน้าที่",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_2.5",
    "item_no": "2.5",
    "cluster_id": 2,
    "cluster_name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)",
    "title": "ไม่มีการแต่งตั้งทีมตรวจสอบความสอดคล้องของกฎหมายและข้อกำหนดในองค์กร",
    "threat": "ไม่มีทีมตรวจสอบด้านกฎหมาย ทำให้ละเลยข้อกำหนดใหม่ๆ",
    "vulnerability": "ไม่มีผู้รับผิดชอบติดตามกฎหมายใหม่",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ตั้งคณะทำงาน Legal & Compliance พร้อมกำหนดบทบาท | ติดตามข่าวสารจากหน่วยงานกำกับ เช่น     สกมช, สคส หรือหน่วยงานกำกับอื่นๆ ที่เกี่ยวข้อง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_2.6",
    "item_no": "2.6",
    "cluster_id": 2,
    "cluster_name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)",
    "title": "ไม่มีการตรวจสอบความสอดคล้องของกฎหมายและข้อกำหนดในองค์กร",
    "threat": "ไม่เคยตรวจสอบการปฏิบัติตามกฎหมาย",
    "vulnerability": "ไม่มีแบบฟอร์มหรือเกณฑ์ตรวจสอบ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนดแผน Audit Compliance ภายในองค์กรเป็นรายปี |  จัดทำ Checklist การตรวจสอบกฎหมายและบันทึกผลตรวจ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_2.7",
    "item_no": "2.7",
    "cluster_id": 2,
    "cluster_name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)",
    "title": "ไม่มีการเก็บ Log ตามระยะเวลาที่กฎหมายต่างๆกำหนดไว้",
    "threat": "ไม่เก็บ Log ตามระยะเวลาที่กฎหมายกำหนด เช่น 90 วัน, 1 ปี",
    "vulnerability": "ขาดการควบคุม Log หรือ Log ถูกลบก่อนเวลา",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำนโยบายและตั้งค่าระบบ Logging ให้ตรงตาม พ.ร.บ.คอมฯ | ใช้ SIEM หรือระบบ Log Management ที่สามารถกำหนดเวลาเก็บ Log ได้",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_2.8",
    "item_no": "2.8",
    "cluster_id": 2,
    "cluster_name": "Compliance & Legal Requirements (พรบ ไซเบอร์ หมวด 3, ส่วนที่ 3)",
    "title": "ไม่มีการอบรมพนักงานด้านพรบ ไซเบอร์ และ พรบ ข้อมูลส่วนบุคคล หรือ พรบ อื่นๆ ที่เกี่ยวข้อง",
    "threat": "พนักงานไม่เข้าใจข้อกำหนดกฎหมาย",
    "vulnerability": "ไม่มีหลักสูตรอบรมด้านกฎหมายที่เกี่ยวข้อง",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดอบรมพนักงานเป็นรายปี และหลังเข้าทำงานใหม่ | จัดทำหลักสูตรอบรมภายใน เช่น Cyber Law Awareness / PDPA Awareness",
    "responsible_person": "",
    "progress_percent": 54,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_3.1",
    "item_no": "3.1",
    "cluster_id": 3,
    "cluster_name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการประเมินความเสี่ยงในด้านต่างๆ ตาม พรบ ไซเบอร์ และ พรบ ข้อมูลส่วนบุคคล หรือตามมาตรฐานสากลที่เกี่ยวข้อง",
    "threat": "ไม่มีการประเมินความเสี่ยงไซเบอร์ที่ครอบคลุม",
    "vulnerability": "ขาดเอกสาร Risk Register หรือขาดบุคลากรผู้รับผิดชอบ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนดกระบวนการประเมินความเสี่ยงตาม พ.ร.บ.ไซเบอร์/ISO 27001 | แต่งตั้ง Risk Owner และสร้างแบบฟอร์ม Risk Assessment",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_3.2",
    "item_no": "3.2",
    "cluster_id": 3,
    "cluster_name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการประเมินผลกระทบทางธุรกิจ (BIA – Business Impact Analyst)",
    "threat": "ไม่ทราบผลกระทบทางธุรกิจเมื่อระบบล่ม",
    "vulnerability": "ไม่มีข้อมูล RTO/RPO/MTPD หรือขาดการจัดลำดับตามความสำคัญ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ BIA (Business Impact Analysis) ครอบคลุมทุกระบบหลัก | จัดทำรายงาน BIA และให้เชื่อมโยงกับ BCM Plan",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_3.3",
    "item_no": "3.3",
    "cluster_id": 3,
    "cluster_name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการประเมินซ้ำ เมื่อมีการเปลี่ยนแปลงระบบบางอย่างที่สำคัญ",
    "threat": "ระบบมีการเปลี่ยนแปลงแล้วแต่ไม่ได้ทำการประเมินความเสี่ยงใหม่",
    "vulnerability": "ขาดการเชื่อมโยงความสัมพันธ์ระหว่าง Change Management กับ Risk",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "สร้างขั้นตอน Risk Reassessment เมื่อมี Change Request | บังคับใช้ Change Control Process ที่รวมการประเมินความเสี่ยง",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_3.4",
    "item_no": "3.4",
    "cluster_id": 3,
    "cluster_name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการกิจกรรมหรือปฏิบัติตาม TOR / SLA ที่มีการระบุข้อกำหนดความมั่นคงปลอดภัยไซเบอร์",
    "threat": "TOR/SLA ไม่ครอบคลุมข้อกำหนดด้านความมั่นคงปลอดภัยไซเบอร์",
    "vulnerability": "ไม่มีการตรวจสอบ SLA กับผู้ให้บริการ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนดหัวข้อ Cybersecurity ใน TOR/SLA ทุกฉบับ | สร้างแบบฟอร์มตรวจสอบ SLA พร้อมใช้ KPI ในการวัดผล",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_3.5",
    "item_no": "3.5",
    "cluster_id": 3,
    "cluster_name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการจัดทำแผนบริหารความเสี่ยง (Risk Management Plan)",
    "threat": "ไม่มีแผนบริหารความเสี่ยงที่เป็นระบบ",
    "vulnerability": "ขาด Template และขั้นตอนดำเนินการ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Risk Management Plan และทบทวนทุกปี | ใช้กรอบ ISO 31000 / ISO 27005 ในการเขียนแผนก็ได้",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_3.6",
    "item_no": "3.6",
    "cluster_id": 3,
    "cluster_name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการระบุสินทรัพย์สารสนเทศที่สำคัญ (Asset Inventory List > Asset Register)",
    "threat": "ไม่ทราบสินทรัพย์สารสนเทศที่ต้องป้องกัน",
    "vulnerability": "ข้อมูลไม่อัปเดตหรือไม่มีเจ้าของรับผิดชอบ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Asset Inventory และกำหนด Critical Asset | ใช้ระบบ CMDB - Computer Management Database หรือ Excel + Owner Mapping",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_3.7",
    "item_no": "3.7",
    "cluster_id": 3,
    "cluster_name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการประเมินช่องโหว่ด้านไซเบอร์ (Cyber Vulnerability Assessment)",
    "threat": "ไม่เคยทำการประเมินช่องโหว่ทางเทคนิค",
    "vulnerability": "ขาดเครื่องมือหรือบุคลากรทางด้านเทคนิค",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "วางแผน Cyber Vulnerability Assessment รายปี (เช่น VA/PenTest) | ใช้เครื่องมือ Open-source เช่น Nessus, OpenVAS หรือจ้างผู้เชี่ยวชาญ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_3.8",
    "item_no": "3.8",
    "cluster_id": 3,
    "cluster_name": "Risk Management & Assessment (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการวิเคราะห์รวมถึงการจัดลำดับความสำคัญของความเสี่ยงไซเบอร์ที่พบ",
    "threat": "จัดการความเสี่ยงโดยไม่เรียงตามลำดับความสำคัญ",
    "vulnerability": "ไม่ทราบว่าความเสี่ยงไหนต้องทำการจัดการก่อน",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนด Risk Matrix (Impact x Likelihood) เพื่อจัดระดับความเสี่ยง | จัดทำ Cyber Risk และ Risk Treatment Plan",
    "responsible_person": "",
    "progress_percent": 54,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_4.1",
    "item_no": "4.1",
    "cluster_id": 4,
    "cluster_name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการทำแผนรับมือภัยคุกคามไซเบอร์ (Cybersecurity Incident Response Plan)",
    "threat": "ไม่มีแผนรับมือภัยคุกคามไซเบอร์ทำให้การตอบสนองล่าช้า",
    "vulnerability": "ไม่มีโครงสร้างการตอบสนอง หรือไม่เคยมีการอนุมัติในการใช้",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Incident Response Plan (IRP) ตามกรอบ พ.ร.บ.ไซเบอร์ / ISO 27035 | จัดทำ IRP พร้อมลงนามโดยผู้บริหารระดับสูง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_4.2",
    "item_no": "4.2",
    "cluster_id": 4,
    "cluster_name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการทดสอบหรือจำลองสถานการณ์ภัยคุกคาม พร้อมฝึกซ้อม",
    "threat": "บุคลากรไม่รู้วิธีการตอบสนองต่อภัยคุกคาม",
    "vulnerability": "ไม่มีการซ้อมแผน BCP",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ฝึกอบรมและฝึกซ้อมแผน เป็นประจำ | วางแผนงานการทดสอบ อย่างน้อยปีละ 1 ครั้ง พร้อมรายงานผลการฝึกซ้อม",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_4.3",
    "item_no": "4.3",
    "cluster_id": 4,
    "cluster_name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการแจ้งเตือนเมื่อเกิดเหตุการณ์ภัยคุกคามทางไซเบอร์",
    "threat": "ขาดระบบแจ้งเตือนแบบเรียลไทม์เมื่อเกิดเหตุ",
    "vulnerability": "การแจ้งเตือนไม่ครอบคลุมหรือล่าช้า กว่าที่กำหนด",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้ระบบ SIEM / IDS / SOC เพื่อแจ้งเตือนเหตุการณ์ | กำหนด Use Case ที่เหมาะสม",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_4.4",
    "item_no": "4.4",
    "cluster_id": 4,
    "cluster_name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการรายงานเหตุการณ์ไปยังหน่วยงานรัฐหรือหน่วยงานกำกับดูแลที่เกี่ยวข้อง",
    "threat": "ไม่รายงานเหตุการณ์ตามข้อกฎหมาย ทำให้เสี่ยงโดนลงโทษ",
    "vulnerability": "ไม่มีแบบฟอร์มหรือช่องทางการส่งรายงาน",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "สร้าง Incident Notification System/Process ไปยัง สกมช หรือหน่วยงานกำกับที่ดูแล | จัดทำแบบฟอร์มพร้อมช่องทางแจ้งที่ชัดเจน และฝึกอบรมผู้เกี่ยวข้อง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_4.5",
    "item_no": "4.5",
    "cluster_id": 4,
    "cluster_name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการจัดเก็บหลักฐานเหตุการณ์ที่ผิดปกติ",
    "threat": "ไม่มีหลักฐานเพื่อสืบสวนหรือรายงานต่อผู้บริหาร/กฎหมาย",
    "vulnerability": "เก็บหลักฐานไม่ถูกต้องหรือไม่ปลอดภัย",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนดวิธีการเก็บ Log | จัดอบรมบุคลากรและใช้ระบบจัดเก็บที่มีการเข้ารหัสและ Audit ได้",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_4.6",
    "item_no": "4.6",
    "cluster_id": 4,
    "cluster_name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีช่องทางการแจ้งเหตุเหตุการณ์ภัยคุกคามทางไซเบอร์ ภายในองค์กร",
    "threat": "บุคลากรไม่ทราบช่องทางการแจ้งเหตุ",
    "vulnerability": "ไม่มีการประชาสัมพันธ์ภายในองค์กร",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "สร้างช่องทางแจ้งเหตุ (Email, Hotline, Portal) ที่ชัดเจน | ติดป้าย / ประกาศภายในองค์กร และระบุในคู่มือบุคลากร (Employee Handbook)",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_4.7",
    "item_no": "4.7",
    "cluster_id": 4,
    "cluster_name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการกำหนดบทบาทผู้รับผิดชอบต่อเหตุการณ์",
    "threat": "ไม่มีผู้รับผิดชอบเหตุการณ์อย่างเป็นทางการ",
    "vulnerability": "ขาดการประสานงานเมื่อเกิดเหตุ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "แต่งตั้ง Incident Manager และ Incident Handling Team | จัดทำ Incident Role & Responsibility",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_4.8",
    "item_no": "4.8",
    "cluster_id": 4,
    "cluster_name": "Incident Management & Communication (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการประเมินผลหลังเกิดเหตุการณ์ (Post-Incident Review)",
    "threat": "ไม่เคยประเมินผลหลังเกิดเหตุการณ์ ทำให้ไม่เกิดการเรียนรู้",
    "vulnerability": "ไม่มีผู้รับผิดชอบในการสรุปผลหรือไม่มีแบบฟอร์ม",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Post-Incident Review (PIR) พร้อมมีการประชุม | กำหนดให้ทุก Incident ที่สำคัญต้องมี PIR และ Lessons Learned",
    "responsible_person": "",
    "progress_percent": 54,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_5.1",
    "item_no": "5.1",
    "cluster_id": 5,
    "cluster_name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีระบบ Log Management และการตรวจสอบข้อมูลย้อนหลัง",
    "threat": "ไม่สามารถตรวจสอบย้อนหลังเมื่อเกิดเหตุการณ์ผิดปกติ",
    "vulnerability": "ระบบไม่จัดเก็บ Log หรือระบบไม่เป็นมาตรฐาน",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้ระบบ Log Management ที่มีการทำ Audit Logs | ใช้ SIEM หรือระบบที่เก็บ Log ตามกรอบ พ.ร.บ.คอมพิวเตอร์ (≥90 วัน)",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_5.2",
    "item_no": "5.2",
    "cluster_id": 5,
    "cluster_name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการควบคุมอุปกรณ์พกพา Notebook, USB Storage หรืออื่นๆและมีการจำกัด Remote Access อย่างเหมาะสม",
    "threat": "อุปกรณ์พกพาถูกใช้โดยไม่ได้รับอนุญาต",
    "vulnerability": "ไม่มีการควบคุม USB, BYOD หรือไม่มีระบบล็อกการเข้าถึง",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้นโยบาย MDM (Mobile Device Management) และ VPN ที่ปลอดภัย | บังคับใช้ Endpoint Security และ จำกัด Remote Access โดยกฎบังคับ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_5.3",
    "item_no": "5.3",
    "cluster_id": 5,
    "cluster_name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการใช้ VPN, Firewall, IDS/IPS เป็นไปตามมาตรฐานสากล",
    "threat": "การเข้าถึงเครือข่ายไม่มีการควบคุมที่เข้มแข็ง",
    "vulnerability": "ไม่มีการ Monitoring หรือไม่มี กฎ (Rule) ที่ครอบคลุมภัยคุกคาม",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ติดตั้ง Firewall, IDS/IPS และอัปเดต Patch อย่างสม่ำเสมอ | ตรวจสอบกฎและเงื่อนไขของ Firewall / IDS และมีการทดสอบอย่างน้อยปีละ 1 ครั้ง",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_5.4",
    "item_no": "5.4",
    "cluster_id": 5,
    "cluster_name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการแยกเครือข่าย (Network Segmentation) เช่น VLAN",
    "threat": "การโจมตีสามารถกระจายไปทั่วระบบโดยง่าย",
    "vulnerability": "ระบบเครือข่ายเป็น Flat Network หรือไม่มีการแบ่ง Level",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "แบ่งเครือข่ายตามความเสี่ยง เช่น VLAN สำหรับ Admin / Guest / Server | ออกแบบ Network Architecture ใหม่โดยอิง Zero Trust Model",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_5.5",
    "item_no": "5.5",
    "cluster_id": 5,
    "cluster_name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการควบคุม Password และ User Account",
    "threat": "การเข้าถึงระบบโดยใช้รหัสผ่านที่อ่อนแอ",
    "vulnerability": "ไม่มีการบังคับใช้หรือล็อกการเปลี่ยนรหัสผ่านอัตโนมัติ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้นโยบาย Password Policy เช่น Complexity, Expiry, History | ใช้ระบบบังคับการตั้งค่าพร้อม Password Manager สำหรับผู้ใช้ระดับสูง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_5.6",
    "item_no": "5.6",
    "cluster_id": 5,
    "cluster_name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการจำกัดสิทธิ์ตามหน้าที่ของงานที่ได้รับผิดชอบ (Least Privilege)",
    "threat": "ผู้ใช้งานมีสิทธิ์เกินกว่าหน้าที่ ทำให้เสี่ยงถูกใช้ในทางที่ผิด",
    "vulnerability": "ขาดการตรวจสอบสิทธิ์ของผู้ใช้ ที่ไม่อัปเดตตาม Job Role",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้หลัก Least Privilege และ Role-Based Access Control (RBAC) | มีการทบทวนสิทธิ์เป็นรายไตรมาส และระบบอนุมัติการเปลี่ยนแปลงสิทธิ์",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_5.7",
    "item_no": "5.7",
    "cluster_id": 5,
    "cluster_name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการใช้ Multi-Factor Authentication",
    "threat": "การเข้าถึงระบบไม่มีการยืนยันตัวตนหลายขั้นตอน",
    "vulnerability": "ไม่มีนโยบาย MFA หรือการใช้เฉพาะกับบางระบบ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เปิดใช้งาน Multi-Factor Authentication (MFA) สำหรับ Admin และผู้ใช้ที่สำคัญ | บังคับใช้ MFA ทุกช่องทางที่เข้าถึงระบบสำคัญ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_5.8",
    "item_no": "5.8",
    "cluster_id": 5,
    "cluster_name": "Technical & Operational Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการตั้งค่าความปลอดภัยในระบบปฏิบัติ (OS), Network, Application หรือมาตรฐานขั้นต่ำ (Security Configuration Standard Baseline)",
    "threat": "ระบบไม่ได้รับการตั้งค่าความปลอดภัยขั้นพื้นฐาน",
    "vulnerability": "ไม่มีการทำให้ระบบแข็งแกร่ง หรือใช้ค่าตั้งต้น (Default) จากโรงงาน",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Baseline Configuration สำหรับ OS, Network, App | ใช้ CIS Benchmark / STIG ซึ่งทั้งสอง เป็นมาตรฐานที่ใช้ในการกำหนด \"มาตรฐานการตั้งค่าความปลอดภัย\" (Security Configuration Baseline)",
    "responsible_person": "",
    "progress_percent": 54,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_6.1",
    "item_no": "6.1",
    "cluster_id": 6,
    "cluster_name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการทำสำรองข้อมูล (Backup)และมีการทดสอบการกู้คืน (Restore)",
    "threat": "ข้อมูลสูญหายจากเหตุระบบล่มหรือมัลแวร์",
    "vulnerability": "Backup ไม่ครอบคลุม, ไม่เข้ารหัส หรือไม่มีการทดสอบ Restore",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำนโยบาย Backup และทดสอบการ Restore อย่างน้อยปีละ 1 ครั้ง | ใช้ 3-2-1 Backup Rule พร้อมทดสอบการกู้คืนข้อมูลเป็นประจำ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_6.2",
    "item_no": "6.2",
    "cluster_id": 6,
    "cluster_name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการควบคุมการใช้ระบบ Cloud หรือมีมาตรฐานรับรองต่างๆ",
    "threat": "ใช้บริการ Cloud ที่ไม่มีมาตรฐานหรือมีช่องโหว่",
    "vulnerability": "ไม่เคยประเมินความเสี่ยงหรือไม่มี Cloud Policy",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เลือกผู้ให้บริการที่ได้รับการรับรอง เช่น ISO 2701, 27018, 27701, CSA STAR | จัดทำนโยบายการใช้ Cloud พร้อมแบบฟอร์มการประเมิน Provider",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_6.3",
    "item_no": "6.3",
    "cluster_id": 6,
    "cluster_name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการควบคุมการเข้าถึงศูนย์ข้อมูลทางกายภาพ",
    "threat": "บุคคลภายนอกเข้าถึงศูนย์ข้อมูลโดยไม่ได้รับอนุญาต",
    "vulnerability": "ไม่มีระบบลงทะเบียน / ควบคุมสิทธิ์เข้า-ออก",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้มาตรการควบคุม เช่น Access Card, กล้องวงจรปิด, ล็อก 2 ชั้น | จัดระบบ Visitor Log, แจ้งเตือนเมื่อมีการเข้าศูนย์ข้อมูล",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_6.4",
    "item_no": "6.4",
    "cluster_id": 6,
    "cluster_name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการเข้าระหัสในการใช้งานอุปกรณ์ USB Storage",
    "threat": "ข้อมูลรั่วไหลจาก USB Drive หรืออุปกรณ์ภายนอก",
    "vulnerability": "ไม่มีการควบคุมการใช้งาน USB หรือ DLP",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เข้ารหัสข้อมูล USB, จำกัดสิทธิ์การใช้งาน USB บนอุปกรณ์ | ใช้ Endpoint Protection ที่มี USB Control และบังคับ Encryption",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_6.5",
    "item_no": "6.5",
    "cluster_id": 6,
    "cluster_name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการลบข้อมูลอย่างปลอดภัยเมื่อสิ้นสุดการใช้งาน",
    "threat": "ข้อมูลยังคงอยู่ในอุปกรณ์ที่ยกเลิกใช้งานแล้ว",
    "vulnerability": "ไม่มีนโยบายการทำลายข้อมูล",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้วิธีลบข้อมูลอย่างปลอดภัย (Secure Erase, Overwrite) | จัดทำนโยบาย Data Disposal และบันทึกหลักฐานการลบทุกครั้ง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_6.6",
    "item_no": "6.6",
    "cluster_id": 6,
    "cluster_name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการกำหนดสิทธิ์การเข้าถึงในระดับผู้ดูแลของผู้ให้บริการระบบ Cloud",
    "threat": "สิทธิ์ระดับ Admin ของ Cloud ถูกใช้ในทางไม่เหมาะสม",
    "vulnerability": "ไม่มีการควบคุมหรือ Review สิทธิ์ผู้ให้บริการ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนด Least Privilege สำหรับ Admin Cloud | ตรวจสอบสิทธิ์ระดับ Admin ทุกไตรมาสพร้อมใช้ MFA ทุกบัญชีผู้ดูแล",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_6.7",
    "item_no": "6.7",
    "cluster_id": 6,
    "cluster_name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการใช้ NDA – Non Disclosure Agreement ในองค์กรและผู้ที่เกี่ยวข้อง",
    "threat": "ข้อมูลความลับรั่วไหลจากพนักงาน / ผู้รับจ้าง",
    "vulnerability": "ไม่มีแบบฟอร์มหรือไม่มีการบังคับใช้",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ NDA สำหรับบุคลากร, ผู้ให้บริการ และบุคคลที่เกี่ยวข้อง | บังคับลงนาม NDA ทันทีเมื่อเริ่มงาน และเก็บรักษาไว้เป็นส่วนหนึ่งของเอกสาร HR/Legal",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_6.8",
    "item_no": "6.8",
    "cluster_id": 6,
    "cluster_name": "Data Protection & Cloud Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีขั้นตอนการคัดเลือกผู้ให้บริการระบบ Cloud ที่ได้มาตรฐาน",
    "threat": "เลือกผู้ให้บริการ Cloud โดยไม่มีมาตรฐานการประเมิน",
    "vulnerability": "ใช้ Provider โดยไม่มีการตรวจสอบ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนดเกณฑ์คัดเลือก โดยใช้มาตรฐานสากลต่างๆ | สร้างแบบประเมินเบื้องต้น (Cloud Selection Checklist) และตรวจสอบสถานะ Compliance",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_7.1",
    "item_no": "7.1",
    "cluster_id": 7,
    "cluster_name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการทำ Security Audit / Penetration Test เป็นประจำ",
    "threat": "ไม่มีการประเมินระบบความมั่นคงปลอดภัย ทำให้พบช่องโหว่ช้า",
    "vulnerability": "ไม่มีแผนทดสอบความมั่นคงปลอดภัย หรือบุคลากรไม่พร้อม",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 5,
    "risk_level": 10,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "วางแผนทำ Security Audit / Penetration Test เป็นประจำ (ปีละ 1–2 ครั้ง) | ใช้บุคลากรภายในหรือจ้างผู้เชี่ยวชาญภายนอกที่ผ่านการรับรอง เช่น OSCP, CEH",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_7.2",
    "item_no": "7.2",
    "cluster_id": 7,
    "cluster_name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการตรวจสอบการใช้ลิขสิทธิ์ของ Software ว่าถูกต้องตามกฎหมาย",
    "threat": "ใช้ Software เถื่อนหรือไม่ได้รับอนุญาต ทำให้มีความเสี่ยง",
    "vulnerability": "ขาดระบบตรวจสอบการใช้ Software License",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ตรวจสอบลิขสิทธิ์และจัดทำทะเบียนซอฟต์แวร์ภายใน | จัดทำนโยบายการจัดซื้อและการใช้งานซอฟต์แวร์",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_7.3",
    "item_no": "7.3",
    "cluster_id": 7,
    "cluster_name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีระบบที่ใช้ช่วยในการตรวจสอบและเฝ้าระวังภัยคุกคามทางไซเบอร์",
    "threat": "ไม่สามารถตรวจจับภัยคุกคามแบบเรียลไทม์",
    "vulnerability": "ขาดเครื่องมือหรือการแจ้งเตือนที่ครอบคลุม เหมาะสม",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้ระบบ SIEM, IDS/IPS หรือ EDR ในการตรวจจับและแจ้งเตือน | บูรณาการระบบ SOC ภายใน หรือใช้ outsource SOC",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_7.4",
    "item_no": "7.4",
    "cluster_id": 7,
    "cluster_name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการกำหนดตัวชี้วัด (KPI) สำหรับการรักษาความมั่นคงปลอดภัยทางไซเบอร์",
    "threat": "ไม่สามารถวัดผลด้านความมั่นคงปลอดภัยได้",
    "vulnerability": "ขาดตัวชี้วัดหรือตัวชี้วัดไม่สัมพันธ์กับความเสี่ยงจริง",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนด KPI ที่วัดผลได้จริง เช่น % Incident Resolved, Time to Detect | ใช้แนวทาง SMART KPI และเชื่อมโยงกับ Cyber Risk",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_7.5",
    "item_no": "7.5",
    "cluster_id": 7,
    "cluster_name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการตรวจติดตามมาตรการที่ได้นำเสนอไว้จากตัวชี้วัด (KPI)",
    "threat": "ตัวชี้วัดไม่ได้นำไปใช้งานหรือติดตามผลจริง",
    "vulnerability": "ไม่มีเจ้าภาพในการติดตามหรือตัวชี้วัดถูกละเลย",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดประชุมติดตาม KPI และนำผลไปปรับปรุงแผนงาน | ระบุเจ้าภาพ (KPI Owner) และจัดทำ Dashboard รายไตรมาส",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_7.6",
    "item_no": "7.6",
    "cluster_id": 7,
    "cluster_name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการส่งเสริมและพัฒนาความสามารถของทีม IT Security",
    "threat": "บุคลากร IT Security ขาดทักษะ/เครื่องมือในการทำงาน",
    "vulnerability": "ขาดแผนพัฒนาระยะยาว",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดแผนอบรม/สอบใบรับรอง เช่น CISA, CISSP, ISO 27001 LI | สร้าง Individual Development Plan (IDP) สำหรับแต่ละบุคคล",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_7.7",
    "item_no": "7.7",
    "cluster_id": 7,
    "cluster_name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีแผนการตรวจสอบและเฝ้าระวังภัยคุกคามไซเบอร์",
    "threat": "ไม่มีแผนติดตามเฝ้าระวังภัยคุกคาม ทำให้ตรวจไม่ทันเวลา",
    "vulnerability": "ตรวจสอบเฉพาะเมื่อเกิดเหตุ ไม่ได้ติดตามแบบเชิงรุก",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "วางแผน Threat Hunting, Network Monitoring, Log Review | กำหนดกิจกรรม Monitoring รายเดือน/สัปดาห์ และแจ้งผลต่อผู้บริหาร",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_7.8",
    "item_no": "7.8",
    "cluster_id": 7,
    "cluster_name": "Monitoring & Improvement (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการจัดทำแผนปรับปรุงเพื่อการพัฒนาทางไซเบอร์ ประจำปี เช่น แผนการฝึกอบรมพนักงาน",
    "threat": "ขาดการวางแผนพัฒนาองค์กรด้านไซเบอร์ในระยะยาว",
    "vulnerability": "ไม่มีแผนการพัฒนาองค์กร/บุคลากรในเชิงระบบ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Cybersecurity Improvement Plan รายปี เช่น Roadmap, Training Plan | เชื่อมโยงแผนกับผล KPI, Risk Assessment และแผนกลยุทธ์องค์กร",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_8.1",
    "item_no": "8.1",
    "cluster_id": 8,
    "cluster_name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการกำหนดสิทธิ์การเข้าถึงตามหน้าที่ที่ได้รับมอบหมาย",
    "threat": "ผู้ใช้เข้าถึงข้อมูลหรือระบบเกินสิทธิ์ที่ได้รับ",
    "vulnerability": "ไม่มีการจำกัดสิทธิ์ หรืออนุมัติสิทธิ์",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้นโยบาย RBAC (Role-Based Access Control) ตามหน้าที่จริง | ใช้ระบบ IAM หรือ Workflow การขอสิทธิ์ที่มีการตรวจสอบก่อนอนุมัติ",
    "responsible_person": "",
    "progress_percent": 54,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_8.2",
    "item_no": "8.2",
    "cluster_id": 8,
    "cluster_name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการระบุและตรวจสอบตัวตนผู้ใช้งาน ก่อนใช้งานระบบ",
    "threat": "การเข้าระบบโดยบุคคลผู้ที่แอบอ้าง",
    "vulnerability": "ไม่มีการตรวจสอบตัวตน หรือใช้รหัสผ่านง่าย",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 5,
    "risk_level": 10,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "มีระบบระบุตัวตน เช่น Username/Password, Certificate, Biometrics | บังคับใช้ Password Policy และใช้ Authentication หลายปัจจัย (MFA)",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_8.3",
    "item_no": "8.3",
    "cluster_id": 8,
    "cluster_name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการใช้ MFA ในระบบสำคัญและมีการบันทึกกิจกรรมการใช้งาน",
    "threat": "ไม่มีบันทึกกิจกรรมเมื่อผู้ใช้เข้าถึงระบบสำคัญ",
    "vulnerability": "Log ไม่ถูกเก็บ หรือไม่สามารถระบุผู้กระทำได้",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เปิดใช้งาน Audit Log และใช้ MFA สำหรับระบบสำคัญ | ใช้ SIEM หรือระบบเก็บ Log ที่สอดคล้องกับกฎหมาย (เช่น >90 วัน)",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_8.4",
    "item_no": "8.4",
    "cluster_id": 8,
    "cluster_name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการควบคุมบัญชีชั่วคราว/ผู้รับเหมาที่ต้องการเข้าระบบ",
    "threat": "ผู้รับเหมาเข้าระบบโดยไม่มีการควบคุมและขออนุญาต",
    "vulnerability": "ไม่มีระบบแยกการควบคุมบัญชีภายนอก",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "สร้างบัญชีชั่วคราว พร้อมระยะเวลาหมดอายุอัตโนมัติ | บังคับใช้ Contractor Access Policy และใช้ VPN / MFA เฉพาะกิจ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_8.5",
    "item_no": "8.5",
    "cluster_id": 8,
    "cluster_name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการระงับบัญชีที่ไม่ได้ใช้งานตามที่กำหนด",
    "threat": "บัญชีเก่าที่ไม่ได้ใช้งาน แต่ยังคงสามารถเข้าระบบ",
    "vulnerability": "ไม่มีการทบทวนบัญชีที่ไม่ได้ใช้งาน",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ตั้งระบบ Auto-disable หลังไม่มีการใช้งาน เช่น 30/90 วัน | ตรวจสอบบัญชีผู้ใช้รายเดือน และลบบัญชีที่ไม่ได้ใช้งาน",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_8.6",
    "item_no": "8.6",
    "cluster_id": 8,
    "cluster_name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการตรวจสอบสิทธิ์การเข้าถึงเป็นประจำ",
    "threat": "ไม่เคยตรวจสอบสิทธิ์การเข้าถึง ส่งผลให้เกิดสิทธิ์ซ้ำซ้อน",
    "vulnerability": "ไม่มี Process Review Access หรือขาดเอกสารประกอบ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ตรวจสอบสิทธิ์อย่างน้อยทุก 6 เดือน โดยเจ้าของระบบ | จัดทำ Access Review Checklist และลายเซ็นรับรองจากเจ้าของระบบ",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_8.7",
    "item_no": "8.7",
    "cluster_id": 8,
    "cluster_name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการแยกหน้าที่ความรับผิดชอบที่ชัดเจน (Segregation of Duties)",
    "threat": "ผู้ใช้งานคนเดียวสามารถดำเนินงานโดยไม่มีการตรวจสอบ",
    "vulnerability": "บทบาทงานไม่ได้มีการแยก หรือมีบุคคลเดียวถือหลายสิทธิ์",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดการแยกหน้าที่ (Segregation of Duties - SoD) เช่น การอนุมัติไม่ควรอยู่ที่คนๆเดียว | ปรับ Role / Workflow ให้มีจุดตรวจสอบ (Approval Point)",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_8.8",
    "item_no": "8.8",
    "cluster_id": 8,
    "cluster_name": "Access Control & Identity Management (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการควบคุมบัญชีผู้ดูแลระบบ (Admin)",
    "threat": "บัญชี Admin ถูกใช้ร่วมกันหรือไม่มีการควบคุมเฉพาะ",
    "vulnerability": "ใช้ Shared Account โดยที่ไม่มีการตรวจสอบสิทธิ์",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดการบัญชีผู้ดูแลแบบรายบุคคล พร้อม MFA และ Audit Logs | บังคับให้ใช้ชื่อบัญชีระบุผู้ใช้ (Non-shared Admin Account)",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_9.1",
    "item_no": "9.1",
    "cluster_id": 9,
    "cluster_name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการจัดทำแผน BCP / DRP",
    "threat": "เมื่อเกิดเหตุการณ์ร้ายแรง แล้วไม่มีแผนสำรองในการดำเนินงาน",
    "vulnerability": "ไม่เคยมีแผน BCP/DRP หรือแผน BCP/DRP เก่าไม่ได้อัปเดต",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำแผน BCP/DRP อย่างเป็นทางการ และผ่านความเห็นชอบจากผู้บริหาร | ทบทวน BCP/DRP อย่างน้อยปีละ 1 ครั้ง หรือเมื่อระบบมีการเปลี่ยนแปลง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_9.2",
    "item_no": "9.2",
    "cluster_id": 9,
    "cluster_name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการทดสอบแผนฟื้นฟูระบบเป็นประจำ",
    "threat": "แผน BCP/DRP ไม่สามารถใช้งานได้จริงเมื่อเกิดเหตุการณ์",
    "vulnerability": "ไม่เคยทดสอบแผน BCP/DRP  หรือมีเฉพาะในเอกสาร",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "วางแผนการทดสอบ เช่น Simulation หรือ Full Recovery Test | ทดสอบ BCP/DRP อย่างน้อยปีละครั้ง พร้อมจัดทำรายงานผล",
    "responsible_person": "",
    "progress_percent": 54,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_9.3",
    "item_no": "9.3",
    "cluster_id": 9,
    "cluster_name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการกำหนด RTO, RPO, MTPD",
    "threat": "ไม่รู้ว่าใช้เวลานานแค่ไหนจึงจะฟื้นฟูระบบได้",
    "vulnerability": "ไม่มีเอกสารกำหนดค่าพวกนี้ หรือไม่ตรงกับระบบจริง",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 5,
    "risk_level": 10,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "กำหนด RTO (เวลาในการกู้คืน), RPO (ข้อมูลที่ยอมให้สูญหายได้), MTPD (เวลาสูงสุดในการหยุดชะงัก) | ควรมีการประเมินร่วมกับ BIA และผู้ใช้งานระบบ เพื่อกำหนดค่าที่เหมาะสม",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_9.4",
    "item_no": "9.4",
    "cluster_id": 9,
    "cluster_name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีศูนย์สำรอง (Backup Site)",
    "threat": "ไม่มี Backup Site ทำให้ไม่สามารถฟื้นฟูระบบได้",
    "vulnerability": "ไม่มีแผน BCP/DRP สำรอง หรือไม่ทดสอบศูนย์สำรองเลย",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดตั้งศูนย์สำรองที่เหมาะสม เช่น Cold, Warm หรือ Hot Site | ระบุ Critical System และวางแผน DR Site ที่รองรับได้ตาม SLA",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_9.5",
    "item_no": "9.5",
    "cluster_id": 9,
    "cluster_name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการกำหนดทีมรับผิดชอบแผน BCP",
    "threat": "ไม่มีทีมผู้รับผิดชอบแผน BCP / DRP",
    "vulnerability": "ไม่รู้ว่าใครรับผิดชอบช่วงเกิดเหตุ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "แต่งตั้งทีม BCP/DRP พร้อม TOR / บทบาทหน้าที่ | ระบุชื่อผู้รับผิดชอบในแผน  BCP/DRP และมีรายชื่อสำรองกรณีฉุกเฉิน",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_9.6",
    "item_no": "9.6",
    "cluster_id": 9,
    "cluster_name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการจัดเก็บแผนฟื้นฟูและข้อมูล ไว้หลายๆแห่ง",
    "threat": "แผน BCP/DRP สำคัญหายหรือเข้าถึงไม่ได้เมื่อจำเป็น",
    "vulnerability": "เก็บไว้ที่เดียว หรือเก็บแบบไม่เข้ารหัส",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดเก็บแผน  BCP/DRP ในหลายรูปแบบ (เอกสาร, ดิจิทัล) และเก็บไว้หลายที่ (Onsite / Offsite / Cloud) | ใช้ระบบ DMS - Data Management System หรือ Cloud Drive ที่ปลอดภัย พร้อมกำหนดสิทธิ์เข้าถึง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_9.7",
    "item_no": "9.7",
    "cluster_id": 9,
    "cluster_name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการทำคู่มือต่างๆ ที่ใช้ในการฟื้นฟูระบบ",
    "threat": "บุคลากรไม่รู้วิธีการกู้คืนระบบจริง",
    "vulnerability": "ไม่มีคู่มือ หรือเป็นเอกสารที่ล้าสมัย",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Recovery Manual หรือ Runbook ที่ชัดเจนต่อระบบ | จัดทำเอกสารขั้นตอนกู้คืนรายระบบ พร้อม Flowchart, Contact, Credential",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_9.8",
    "item_no": "9.8",
    "cluster_id": 9,
    "cluster_name": "Business Continuity & Disaster Recovery (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการวิเคราะห์ผลทางธุรกิจ รวมถึงการประเมินผลกระทบต่อระบบที่สำคัญ",
    "threat": "ไม่รู้ว่าระบบใดสำคัญที่สุดเมื่อเกิดเหตุ",
    "vulnerability": "ไม่มีข้อมูลผลกระทบหากระบบหยุดชะงัก",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ทำ Business Impact Analysis (BIA) และจัดลำดับความสำคัญระบบ | ทำ BIA อย่างเป็นระบบ ร่วมกับหน่วยงานธุรกิจ และใช้ผลเพื่อจัดลำดับฟื้นฟูระบบ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_10.1",
    "item_no": "10.1",
    "cluster_id": 10,
    "cluster_name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการประเมินความเสี่ยง Supplier อื่นๆ ที่เกี่ยวข้อง",
    "threat": "Supplier ชอบก่อให้เกิดช่องโหว่/เหตุการณ์ที่กระทบต่อองค์กร",
    "vulnerability": "ไม่มีการประเมินความเสี่ยง หรือมีใช้เกณฑ์เดียวกันทุกกรณี",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำ Third-Party Risk Assessment สำหรับผู้ให้บริการรายสำคัญ | ทำการจัดระดับความเสี่ยงของ Supplier และประเมินตามประเภทบริการที่เกี่ยวข้อง",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_10.2",
    "item_no": "10.2",
    "cluster_id": 10,
    "cluster_name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการกำหนดข้อกำหนดด้านความมั่นคงปลอดภัยไซเบอร์",
    "threat": "ไม่มีข้อกำหนดด้าน Cybersecurity กับ Supplier",
    "vulnerability": "TOR/สัญญาไม่มีข้อกำหนดด้านการป้องกันข้อมูล",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เพิ่ม Cybersecurity Requirements ลงใน TOR, RFP (Request for Proposal), และสัญญา | ใช้ Cyber Clause Template ที่มีขั้นต่ำตาม ISO 27036 เป็นมาตรฐานเฉพาะด้านที่เกี่ยวข้องกับ การจัดการความมั่นคงปลอดภัยของข้อมูลในความสัมพันธ์กับผู้ให้บริการภายนอก (Third-Party / Supplier Security)",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_10.3",
    "item_no": "10.3",
    "cluster_id": 10,
    "cluster_name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีข้อตกลงระดับการให้บริการ (SLA)",
    "threat": "ไม่มี SLA ส่งผลต่อความไม่ชัดเจนในบริการ",
    "vulnerability": "ไม่มีข้อตกลงที่สามารถวัดผลได้",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 5,
    "risk_level": 20,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ระบุ SLA ชัดเจน เช่น เวลาตอบสนอง, เวลากู้คืน, Uptime | สร้าง SLA Template มาตรฐานที่วัดผลได้และ Audit ได้",
    "responsible_person": "",
    "progress_percent": 54,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_10.4",
    "item_no": "10.4",
    "cluster_id": 10,
    "cluster_name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีเงื่อนไขของสัญญากับผู้ให้บริการภายนอก",
    "threat": "ไม่มีเงื่อนไขในการควบคุม/ยุติสัญญาเมื่อเกิดเหตุผิดปกติ",
    "vulnerability": "สัญญาไม่กำหนดบทลงโทษหาก Supplier ไม่ปฏิบัติตาม",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 2,
    "impact": 5,
    "risk_level": 10,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "เพิ่ม Security & Termination Clause ในสัญญาทุกฉบับ | กำหนดสิทธิ์การยึดคืนข้อมูลและทรัพย์สิน",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_10.5",
    "item_no": "10.5",
    "cluster_id": 10,
    "cluster_name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการจำกัดสิทธิ์การเข้าถึงข้อมูลหรือระบบ",
    "threat": "Supplier เข้าถึงข้อมูล/ระบบมากกว่าที่จำเป็น",
    "vulnerability": "ไม่มีระบบควบคุมสิทธิ์ของผู้ให้บริการ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ใช้หลัก Least Privilegeกับผู้ใช้งานภายนอก | สร้างบัญชีแยกเฉพาะ Supplier พร้อมกำหนดสิทธิ์ขั้นต่ำ",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_10.6",
    "item_no": "10.6",
    "cluster_id": 10,
    "cluster_name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการรับรองผู้ให้บริการตามมาตรฐานสากลหรือมีใบรับรองต่างๆ",
    "threat": "เลือก Supplier ที่ไม่มีมาตรฐานหรือไม่มีใบรับรอง",
    "vulnerability": "ไม่ตรวจสอบใบรับรอง หากหมดอายุ หรือไม่อัปเดตสถานะ",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 3,
    "risk_level": 9,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "พิจารณา Supplier ที่ได้รับ ISO 27001, ISO 27701, ISO 27018 ฯลฯ | จัดทำ Supplier Compliance Checklist",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 5,
    "residual_risk_level": 5,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_10.7",
    "item_no": "10.7",
    "cluster_id": 10,
    "cluster_name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีการทำระบบวัดความพึงพอใจ ผู้ใช้บริการ พร้อมการติดตามการแก้ไขปัญหา",
    "threat": "ผู้ใช้บริการไม่พอใจหรือไม่ได้รับการดูแลเมื่อเกิดเหตุ",
    "vulnerability": "ไม่มีระบบติดตามปัญหาและการแก้ไขจาก Supplier",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "ทำแบบสอบถามความพึงพอใจพร้อมมีระบบรับเรื่องร้องเรียน | สร้าง Customer Satisfaction Workflow พร้อมกำหนด KPI เพื่อติดตามปัญหา",
    "responsible_person": "",
    "progress_percent": 90,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  },
  {
    "id": "item_10.8",
    "item_no": "10.8",
    "cluster_id": 10,
    "cluster_name": "Third-Party Security (พรบ ไซเบอร์ ประมวลแนวทางฯและกรอบฯ)",
    "title": "ไม่มีกระบวนการการยุติการเข้าถึงระบบเมื่อสิ้นสุดสัญญา",
    "threat": "เมื่อสิ้นสุดสัญญา ยังสามารถเข้าระบบได้",
    "vulnerability": "ลืมลบบัญชีผู้ใช้งานหรือสิทธิ์หลังจบสัญญา",
    "cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "likelihood": 4,
    "impact": 4,
    "risk_level": 16,
    "treatment_option": "Mitigate Risk",
    "treatment_plan": "จัดทำกระบวนการ Exit Access เช่น Disable Account, ลบสิทธิ์, คืนข้อมูล | จัดทำ Exit Checklist สำหรับ Third Party Access",
    "responsible_person": "",
    "progress_percent": 78,
    "expected_finish_date": "30 ก.ย. 67",
    "residual_cia": {
      "c": true,
      "i": true,
      "a": true
    },
    "residual_severity_fsrilo": {
      "f": true,
      "s": true,
      "r": true,
      "i": true,
      "l": true,
      "o": true
    },
    "residual_likelihood": 1,
    "residual_impact": 4,
    "residual_risk_level": 4,
    "further_actions": "เฝ้าติดตามเป็นระยะ"
  }
];

export const DEFAULT_THIRD_PARTY_PROFILES = [
  {
    id: 'vendor_meeple',
    vendor_name: 'ห้างหุ้นส่วนจำกัด มิพเบิ้ล',
    header: DEFAULT_THIRD_PARTY_HEADER,
    logs: DEFAULT_THIRD_PARTY_LOGS,
    items: DEFAULT_THIRD_PARTY_ITEMS
  }
];

export const THIRD_PARTY_CRITERIA_DATA = {
  matrix5x5: [
    { impact: 5, label: '5. Severe (ระดับวิกฤต (ข))', cells: [
      { likelihood: 1, score: 5, level: 'Med', bg: '#fef9c3', color: '#854d0e' },
      { likelihood: 2, score: 10, level: 'High', bg: '#ffedd5', color: '#9a3412' },
      { likelihood: 3, score: 15, level: 'Very High', bg: '#fee2e2', color: '#991b1b' },
      { likelihood: 4, score: 20, level: 'Extreme', bg: '#fecaca', color: '#7f1d1d' },
      { likelihood: 5, score: 25, level: 'Extreme', bg: '#fca5a5', color: '#7f1d1d' }
    ]},
    { impact: 4, label: '4. Significant (ระดับวิกฤต (ก))', cells: [
      { likelihood: 1, score: 4, level: 'Med', bg: '#fef9c3', color: '#854d0e' },
      { likelihood: 2, score: 8, level: 'Med', bg: '#fef9c3', color: '#854d0e' },
      { likelihood: 3, score: 12, level: 'High', bg: '#ffedd5', color: '#9a3412' },
      { likelihood: 4, score: 16, level: 'Very High', bg: '#fee2e2', color: '#991b1b' },
      { likelihood: 5, score: 20, level: 'Extreme', bg: '#fecaca', color: '#7f1d1d' }
    ]},
    { impact: 3, label: '3. Moderate (ระดับร้ายแรง)', cells: [
      { likelihood: 1, score: 3, level: 'Low', bg: '#dcfce7', color: '#166534' },
      { likelihood: 2, score: 6, level: 'Med', bg: '#fef9c3', color: '#854d0e' },
      { likelihood: 3, score: 9, level: 'Med', bg: '#fef9c3', color: '#854d0e' },
      { likelihood: 4, score: 12, level: 'High', bg: '#ffedd5', color: '#9a3412' },
      { likelihood: 5, score: 15, level: 'Very High', bg: '#fee2e2', color: '#991b1b' }
    ]},
    { impact: 2, label: '2. Minor (ระดับไม่ร้ายแรง)', cells: [
      { likelihood: 1, score: 2, level: 'Very Low', bg: '#dcfce7', color: '#166534' },
      { likelihood: 2, score: 4, level: 'Low', bg: '#dcfce7', color: '#166534' },
      { likelihood: 3, score: 6, level: 'Med', bg: '#fef9c3', color: '#854d0e' },
      { likelihood: 4, score: 8, level: 'Med', bg: '#fef9c3', color: '#854d0e' },
      { likelihood: 5, score: 10, level: 'High', bg: '#ffedd5', color: '#9a3412' }
    ]},
    { impact: 1, label: '1. Insignificant (มีผลกระทบเล็กน้อย)', cells: [
      { likelihood: 1, score: 1, level: 'Very Low', bg: '#dcfce7', color: '#166534' },
      { likelihood: 2, score: 2, level: 'Very Low', bg: '#dcfce7', color: '#166534' },
      { likelihood: 3, score: 3, level: 'Low', bg: '#dcfce7', color: '#166534' },
      { likelihood: 4, score: 4, level: 'Med', bg: '#fef9c3', color: '#854d0e' },
      { likelihood: 5, score: 5, level: 'Med', bg: '#fef9c3', color: '#854d0e' }
    ]}
  ],
  riskScoreRanges: [
    { range: '16 - 25', level: 'Very High', label: 'สูงมาก / วิกฤติ', desc: 'เป็นความเสี่ยงขั้นวิกฤติ ต้องมีการดำเนินการโดยทันทีและมีการวางแผนจัดการความเสี่ยง', bg: '#fee2e2', color: '#991b1b', border: '#f87171' },
    { range: '11 - 15', level: 'High', label: 'สูง', desc: 'เป็นความเสี่ยงสูง ต้องมีการดำเนินการบางอย่างเพื่อลดความเสี่ยง', bg: '#ffedd5', color: '#9a3412', border: '#fb923c' },
    { range: '6 - 10', level: 'Moderate', label: 'ปานกลาง', desc: 'เป็นความเสี่ยงปานกลาง ดังนั้นต้องมีการติดตามและอาจมีมาตรการป้องกัน', bg: '#fef9c3', color: '#854d0e', border: '#facc15' },
    { range: '1 - 5', level: 'Low', label: 'ต่ำ', desc: 'ต้องมีการติดตามเป็นระยะ แต่ยังไม่ต้องมีการดำเนินการใดๆเพิ่มเติม', bg: '#dcfce7', color: '#166534', border: '#4ade80' }
  ],
  clusterAvgRanges: [
    { range: '12.5 - 25.0', level: 'Very High', label: 'สูงมาก / วิกฤติ', desc: 'เป็นความเสี่ยงขั้นวิกฤติ ต้องมีการดำเนินการโดยทันทีและมีการวางแผนจัดการความเสี่ยง', bg: '#fee2e2', color: '#991b1b' },
    { range: '9.5 - 12.4', level: 'High', label: 'สูง', desc: 'เป็นความเสี่ยงสูง ต้องมีการดำเนินการบางอย่างเพื่อลดความเสี่ยง', bg: '#ffedd5', color: '#9a3412' },
    { range: '3.5 - 9.4', level: 'Moderate', label: 'ปานกลาง', desc: 'เป็นความเสี่ยงปานกลาง ต้องมีการติดตามและอาจมีมาตรการป้องกัน', bg: '#fef9c3', color: '#854d0e' },
    { range: '1.0 - 3.4', level: 'Low', label: 'ต่ำ', desc: 'เป็นความเสี่ยงต่ำ ต้องมีการติดตามเป็นระยะ แต่ยังไม่ต้องมีการดำเนินการใดๆเพิ่มเติม', bg: '#dcfce7', color: '#166534' }
  ],
  likelihoodLevels: [
    { level: 5, code: 'Almost certain', title: 'เกือบเกิดขึ้นแน่นอน', desc: 'เหตุการณ์ที่เกิดขึ้นเกือบจะแน่นอน หรือเกิดขึ้นเป็นประจำอย่างต่อเนื่อง' },
    { level: 4, code: 'Likely', title: 'มีโอกาสเกิดขึ้น', desc: 'เหตุการณ์ที่น่าจะเกิดขึ้น หรือเกิดขึ้นบ่อยครั้งในการดำเนินงาน' },
    { level: 3, code: 'Moderate', title: 'อาจเกิดขึ้น', desc: 'เหตุการณ์ที่น่าจะเป็นไปได้ หรืออาจเกิดขึ้นได้บางครั้ง' },
    { level: 2, code: 'Unlikely', title: 'มีโอกาสเกิดขึ้นน้อย', desc: 'เหตุการณ์ที่อาจเกิดขึ้นน้อยมาก หรือมีโอกาสเกิดขึ้นได้น้อย' },
    { level: 1, code: 'Rare', title: 'เกิดขึ้นได้ยาก', desc: 'เหตุการณ์ที่ไม่น่ามีโอกาสเกิดขึ้นได้ หรือแทบไม่เคยเกิดขึ้น' }
  ],
  impactDimensions: [
    {
      level: 5,
      title: '5. Severe (ระดับวิกฤต (ข))',
      financial: 'สร้างความเสียหายต่อทรัพย์สินหรือมูลค่าทางการเงินสูงมาก',
      safety: 'มีผลกระทบร้ายแรงต่อความปลอดภัยของผู้ใช้บริการ หรือบริการหลักหยุดชะงักสมบูรณ์',
      reputation: 'กระทบต่อชื่อเสียงและความเชื่อมั่นขององค์กรในระดับประเทศอย่างรุนแรงและยาวนาน',
      image: 'ภาพลักษณ์เสียหายอย่างมากต่อสาธารณชน',
      legal: 'ละเมิดกฎหมายสำคัญ ถูกดำเนินคดีขั้นร้ายแรงหรือสั่งระงับการดำเนินงาน',
      other: 'ส่งผลกระทบต่อเนื่องไปยังระบบสารสนเทศระดับสำคัญของประเทศ (CII อื่นๆ)'
    },
    {
      level: 4,
      title: '4. Significant (ระดับวิกฤต (ก))',
      financial: 'สร้างความเสียหายทางการเงินสูง',
      safety: 'ส่งผลกระทบต่อบริการสำคัญอย่างมาก กู้คืนได้ยาก',
      reputation: 'กระทบต่อชื่อเสียงขององค์กรอย่างกว้างขวาง',
      image: 'ภาพลักษณ์องค์กรได้รับความเสียหายในระดับสูง',
      legal: 'ละเมิดข้อบังคับหรือกฎหมายที่มีบทลงโทษสูง',
      other: 'กระทบต่อระบบสำคัญหลายระบบในเครือข่าย'
    },
    {
      level: 3,
      title: '3. Moderate (ระดับร้ายแรง)',
      financial: 'มีความเสียหายทางการเงินในระดับปานกลาง',
      safety: 'บริการหลักหยุดชะงักบางช่วงเวลา แต่กู้คืนได้ตามแผน BCP/DRP',
      reputation: 'กระทบต่อชื่อเสียงในระยะสั้น',
      image: 'ส่งผลกระทบต่อภาพลักษณ์บางส่วน',
      legal: 'ส่งผลต่อการปฏิบัติตามข้อบังคับบางประการ',
      other: 'อาจขยายผลกระทบไปยังบางระบบที่เชื่อมต่อ'
    },
    {
      level: 2,
      title: '2. Minor (ระดับไม่ร้ายแรง)',
      financial: 'ความเสียหายทางการเงินต่ำ',
      safety: 'บริการด้อยประสิทธิภาพลงเล็กน้อย แต่ไม่หยุดชะงัก สามารถกู้คืนได้รวดเร็ว',
      reputation: 'กระทบเฉพาะผู้ใช้งานภายใน ไม่กระทบชื่อเสียงภายนอก',
      image: 'ไม่ได้รับผลกระทบที่ชัดเจน',
      legal: 'ไม่ละเมิดกฎหมายหรือข้อบังคับหลัก',
      other: 'มีผลเพียงเล็กน้อยกับระบบบริการที่ไม่สำคัญ'
    },
    {
      level: 1,
      title: '1. Insignificant (มีผลกระทบเล็กน้อย)',
      financial: 'ไม่มีความเสียหายทางการเงิน',
      safety: 'ไม่มีการหยุดชะงักของระบบหรือบริการใดๆ',
      reputation: 'ไม่กระทบต่อชื่อเสียงของหน่วยงาน',
      image: 'ไม่มีผลกระทบต่อภาพลักษณ์',
      legal: 'ไม่มีผลต่อการปฏิบัติตามกฎหมาย',
      other: 'ระบบอื่นๆ ไม่ได้รับผลกระทบ'
    }
  ]
};

// Helper: Risk Level Info (คะแนนรายข้อ 1-25)
export function getThirdPartyRiskLevelInfo(score) {
  const s = Number(score) || 1
  if (s >= 16) {
    return { level: 'Very High', label: 'สูงมาก / วิกฤติ', bg: '#fee2e2', color: '#991b1b', border: '#f87171' }
  } else if (s >= 11) {
    return { level: 'High', label: 'สูง', bg: '#ffedd5', color: '#9a3412', border: '#fb923c' }
  } else if (s >= 6) {
    return { level: 'Moderate', label: 'ปานกลาง', bg: '#fef9c3', color: '#854d0e', border: '#facc15' }
  } else {
    return { level: 'Low', label: 'ต่ำ', bg: '#dcfce7', color: '#166534', border: '#4ade80' }
  }
}

// Helper: Cluster Average Info (ค่าเฉลี่ย 1.0 - 25.0)
export function getThirdPartyClusterAvgInfo(avgScore) {
  const a = Number(avgScore) || 0
  if (a >= 12.5) {
    return { level: 'Very High', label: 'สูงมาก / วิกฤติ', bg: '#fee2e2', color: '#991b1b' }
  } else if (a >= 9.5) {
    return { level: 'High', label: 'สูง', bg: '#ffedd5', color: '#9a3412' }
  } else if (a >= 3.5) {
    return { level: 'Moderate', label: 'ปานกลาง', bg: '#fef9c3', color: '#854d0e' }
  } else {
    return { level: 'Low', label: 'ต่ำ', bg: '#dcfce7', color: '#166534' }
  }
}

// Calculate Cluster and Overall Metrics
export function calculateThirdPartyMetrics(items = []) {
  const total = items.length
  if (total === 0) {
    return {
      total: 0,
      overallAvg: '0.00',
      overallAvgInfo: getThirdPartyClusterAvgInfo(0),
      residualAvg: '0.00',
      residualAvgInfo: getThirdPartyClusterAvgInfo(0),
      counts: { veryHigh: 0, high: 0, moderate: 0, low: 0 },
      clusterAverages: {},
      avgProgress: 0
    }
  }

  let sumScore = 0
  let sumResidual = 0
  let sumProgress = 0

  const counts = { veryHigh: 0, high: 0, moderate: 0, low: 0 }
  const clusterSums = {}
  const clusterCounts = {}
  const clusterResSums = {}

  items.forEach(it => {
    const s = Number(it.risk_level) || (Number(it.likelihood || 1) * Number(it.impact || 1))
    const res = Number(it.residual_risk_level) || (Number(it.residual_likelihood || 1) * Number(it.residual_impact || 1))
    const prog = Number(it.progress_percent) || 0
    const cid = it.cluster_id

    sumScore += s
    sumResidual += res
    sumProgress += prog

    if (s >= 16) counts.veryHigh++
    else if (s >= 11) counts.high++
    else if (s >= 6) counts.moderate++
    else counts.low++

    clusterSums[cid] = (clusterSums[cid] || 0) + s
    clusterCounts[cid] = (clusterCounts[cid] || 0) + 1
    clusterResSums[cid] = (clusterResSums[cid] || 0) + res
  })

  const overallAvg = (sumScore / total).toFixed(2)
  const residualAvg = (sumResidual / total).toFixed(2)
  const avgProgress = Math.round(sumProgress / total)

  const clusterAverages = {}
  THIRD_PARTY_CLUSTERS.forEach(c => {
    const cnt = clusterCounts[c.id] || 0
    const sum = clusterSums[c.id] || 0
    const resSum = clusterResSums[c.id] || 0
    const avg = cnt > 0 ? (sum / cnt).toFixed(2) : '0.00'
    const resAvg = cnt > 0 ? (resSum / cnt).toFixed(2) : '0.00'
    clusterAverages[c.id] = {
      clusterId: c.id,
      clusterName: c.name,
      count: cnt,
      avgScore: avg,
      avgInfo: getThirdPartyClusterAvgInfo(avg),
      residualAvgScore: resAvg,
      residualAvgInfo: getThirdPartyClusterAvgInfo(resAvg)
    }
  })

  return {
    total,
    overallAvg,
    overallAvgInfo: getThirdPartyClusterAvgInfo(overallAvg),
    residualAvg,
    residualAvgInfo: getThirdPartyClusterAvgInfo(residualAvg),
    counts,
    clusterAverages,
    avgProgress
  }
}
