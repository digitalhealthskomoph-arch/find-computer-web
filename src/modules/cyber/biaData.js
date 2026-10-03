// ข้อมูลเริ่มต้นสำหรับ 1.6 BIA Evident การวิเคราะห์ผลกระทบทางธุรกิจ (Business Impact Analysis)
// สกัดจากไฟล์ 1.6 BIA Evident .xlsx แผ่น 'BIA Sample', 'Update Log', 'BCM', 'Criteria'

export const DEFAULT_BIA_HEADER = {
  "recorder": "นายธนกฤต นิธิตันติปัญญา, สำนักงานสาธารณสุขจังหวัดสระแก้ว",
  "record_date": "25 กุมภาพันธ์ 2569",
  "location": "Data Center, กลุ่มงานสุขภาพดิจิทัล",
  "address": "609 สำนักงานสาธารณสุขจังหวัดสระแก้ว ต.ท่าเกษม อ.เมืองสระแก้ว จ.สระแก้ว 27000",
  "critical_service": "All critical application",
  "overall_score": 8.44
};

export const DEFAULT_BIA_LOGS = [
  {
    "id": "bia_log_1",
    "date": "2567-09-02",
    "detail": "เริ่มดำเนินการสร้าง Template จนแล้วเสร็จและทำการระบุวัตถุประสงค์ (Objective) และกำหนดเกณฑ์ที่ใช้ในการประเมิน ( Criteria)"
  },
  {
    "id": "bia_log_2",
    "date": "2567-09-09",
    "detail": "ดำเนินการจัดการประเมินความเสี่ยงและทำการอัพเดทสถานะ"
  },
  {
    "id": "bia_log_3",
    "date": "2567-09-23",
    "detail": "ทำการประเมินสถานภาพอีกครั้งอีกครั้ง เพื่อประเมินความพร้อมในการตรวจสอบ"
  },
  {
    "id": "bia_log_4",
    "date": "2568-05-01",
    "detail": "ทำการปรับปรุงเงื่อนไขและผลกระทบ เพื่อความพร้อมในการตรวจสอบ"
  },
  {
    "id": "bia_log_5",
    "date": "2568-05-18",
    "detail": "ทำการปรับปรุงระดับความเสี่ยงที่ยอมรับได้ (Risk Appetite)"
  }
];

export const DEFAULT_BIA_ITEMS = [
  {
    "id": "bia_item_1",
    "order_num": 1,
    "cluster": "Application-Major",
    "asset_name": "Pay Slip",
    "description": "Web Application ออกใบสลิปเงินเดือน",
    "critical_service": "รองรับการบันทึกข้อมูลเงินเดือนของบุคลากรจากงานการเงิน และออกใบสลิปเงินเดือนแบบออนไลน์ให้กับบุคลากรภายในสำนักงานสาธารณสุขจังหวัดสระแก้ว",
    "likelihood": 3,
    "impact": 5,
    "risk_level": 15,
    "impact_c": "สูง",
    "impact_i": "กลาง",
    "impact_a": "ต่ำ",
    "financial_impact": 120000.0,
    "operational_impact": "กระทบขวัญกำลังใจเจ้าหน้าที่ และงานการเงินล่าช้า",
    "law_regulatory_impact": "เสี่ยงผิดกฎหมาย PDPA (ข้อมูลเงินเดือน/บัญชี)",
    "reputational_impact": "เสียความน่าเชื่อถือ ต่อการบริหารจัดการภายในองค์กร",
    "mtpd": "7 วัน",
    "rto": "24 ชม.",
    "rpo": "24 ชม."
  },
  {
    "id": "bia_item_2",
    "order_num": 2,
    "cluster": "Application-Major",
    "asset_name": "Plan-D",
    "description": "ระบบ ERP back office ของสำนักงาน",
    "critical_service": "ระบบงานด้านสารบรรณและ Back Office อื่นๆ รองรับการบริหารจัดการข้อมูล การบันทึกข้อมูล",
    "likelihood": 2,
    "impact": 5,
    "risk_level": 10,
    "impact_c": "สูง",
    "impact_i": "สูง",
    "impact_a": "สูง",
    "financial_impact": 150000.0,
    "operational_impact": "ระบบบริหารจัดการภายในหยุดชะงัก (พัสดุ/บัญชี)",
    "law_regulatory_impact": "ผิดระเบียบการเบิกจ่ายงบประมาณภาครัฐ",
    "reputational_impact": "ส่งผลต่อความไว้วางใจ ของหน่วยงานตรวจสอบและผู้บริหาร",
    "mtpd": "24 ชม.",
    "rto": "4 ชม.",
    "rpo": "4 ชม."
  },
  {
    "id": "bia_item_3",
    "order_num": 3,
    "cluster": "Application-Minor",
    "asset_name": "WebEx",
    "description": "ระบบประชุมออนไลน์ Online Conference",
    "critical_service": "บริหารจัดการ สร้างลิงค์ประชุม การประชุมผ่านรับบออนไลน์",
    "likelihood": 1,
    "impact": 2,
    "risk_level": 2,
    "impact_c": "สูง",
    "impact_i": "สูง",
    "impact_a": "สูง",
    "financial_impact": 40000.0,
    "operational_impact": "การสื่อสารและประชุมสำคัญถูกระงับ",
    "law_regulatory_impact": "ต่ำ (ยกเว้นมีการแชร์ข้อมูลลับในที่ประชุม)",
    "reputational_impact": "ส่งผลต่อความเชื่อมั่น ในการรักษาความลับของการประชุม",
    "mtpd": "48 ชม.",
    "rto": "4 ชม.",
    "rpo": "N/A"
  },
  {
    "id": "bia_item_4",
    "order_num": 4,
    "cluster": "Application-Minor",
    "asset_name": "ระบบสารบรรณกระทรวง สธ.",
    "description": "รับส่งหนังสือออนไลน์จากสำนักงานปลัดกระทรวงสาธารณสุข",
    "critical_service": "สารบรรณ",
    "likelihood": 2,
    "impact": 5,
    "risk_level": 10,
    "impact_c": "กลาง",
    "impact_i": "สูง",
    "impact_a": "กลาง",
    "financial_impact": 180000.0,
    "operational_impact": "งานรับ-ส่งหนังสือราชการล่าช้า กระทบทั้งจังหวัด",
    "law_regulatory_impact": "ผิดระเบียบงานสารบรรณสำนักนายกฯ",
    "reputational_impact": "เสียภาพลักษณ์ ความเป็นมืออาชีพต่อหน่วยงานภายนอกที่ติดต่อ",
    "mtpd": "24 ชม.",
    "rto": "2 ชม.",
    "rpo": "1 ชม."
  },
  {
    "id": "bia_item_5",
    "order_num": 5,
    "cluster": "HW-Servers",
    "asset_name": "Web : sko.moph.go.th/research",
    "description": "Web site ให้บริการเผยแพร่ผลงานวิชาการระดับจังหวัด",
    "critical_service": "พื้นที่ให้บุคลากรภายในจังหวัดสระแก้วนำผลงานวิชาการมาประกาศเผยแพร่",
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "impact_c": "ต่ำ",
    "impact_i": "ต่ำ",
    "impact_a": "ต่ำ",
    "financial_impact": 5000.0,
    "operational_impact": "ไม่สามารถเผยแพร่ผลงานวิชาการได้",
    "law_regulatory_impact": "ต่ำ",
    "reputational_impact": "เสียชื่อเสียงด้านวิชาการ ในระดับเล็กน้อย",
    "mtpd": "2 วัน",
    "rto": "48 ชม.",
    "rpo": "24 ชม."
  },
  {
    "id": "bia_item_6",
    "order_num": 6,
    "cluster": "HW-Servers",
    "asset_name": "Web : sko.moph.go.th",
    "description": "Web Application ของสำนักงานสาธารณสุขจังหวัดสระแก้ว",
    "critical_service": "ให้บริการเว็บสำหรับให้ข้อมูลและประชาสัมพันธ์ ข้อมูลและการดำเนินงานต่างๆ ของสำนักงานสาธารณสุขจังหวัดสระแก้ว",
    "likelihood": 2,
    "impact": 4,
    "risk_level": 8,
    "impact_c": "ต่ำ",
    "impact_i": "ต่ำ",
    "impact_a": "ต่ำ",
    "financial_impact": 15000.0,
    "operational_impact": "ประชาชนไม่ได้รับข้อมูลข่าวสาร/ร้องเรียนไม่ได้",
    "law_regulatory_impact": "ผิด พรบ. ข้อมูลข่าวสารของราชการ",
    "reputational_impact": "ส่งผลต่อความไว้วางใจในประชาชน ที่เข้ามาสืบค้นข้อมูล",
    "mtpd": "2 วัน",
    "rto": "24 ชม.",
    "rpo": "24 ชม."
  },
  {
    "id": "bia_item_7",
    "order_num": 7,
    "cluster": "HW-Router/Firewall",
    "asset_name": "zyxel router",
    "description": "บริการอินเตอร์เน็ต NT",
    "critical_service": "เชื่อมต่อ เครื่องข่าย Gnode ของกระทรวงสาธารณสุข",
    "likelihood": 3,
    "impact": 4,
    "risk_level": 12,
    "impact_c": "ต่ำ",
    "impact_i": "สูง",
    "impact_a": "สูง",
    "financial_impact": 200000.0,
    "operational_impact": "อินเทอร์เน็ตล่ม ส่งผลให้ระบบอื่นใช้ไม่ได้ทั้งหมด",
    "law_regulatory_impact": "ต่ำ (เป็นผลกระทบทางเทคนิค)",
    "reputational_impact": "ภาพลักษณ์องค์กรดูแย่ เนื่องจากติดต่อสื่อสารไม่ได้ทุกช่องทาง",
    "mtpd": "4 ชม.",
    "rto": "1 ชม.",
    "rpo": "N/A"
  },
  {
    "id": "bia_item_8",
    "order_num": 8,
    "cluster": "HW-Router/Firewall",
    "asset_name": "Fortigate 100F",
    "description": "ระบบป้องกันเครือข่ายภายใน",
    "critical_service": "ระบบป้องกันภัยคุกคามเครือข่ายภายในของสำนักงานสาธารณสุขจังหวัดสระแก้ว",
    "likelihood": 2,
    "impact": 3,
    "risk_level": 6,
    "impact_c": "สูง",
    "impact_i": "สูง",
    "impact_a": "สูง",
    "financial_impact": 200000.0,
    "operational_impact": "ระบบรักษาความปลอดภัยล้มเหลว เสี่ยงถูกเจาะ",
    "law_regulatory_impact": "ผิด พรบ. ไซเบอร์ (ไม่รักษามาตรฐานขั้นต่ำ)",
    "reputational_impact": "เสียความน่าเชื่อถืออย่างรุนแรง หากข้อมูลรั่วไหลเพราะ Firewall ล่ม",
    "mtpd": "4 ชม.",
    "rto": "1 ชม.",
    "rpo": "N/A"
  },
  {
    "id": "bia_item_9",
    "order_num": 9,
    "cluster": "HW-Others",
    "asset_name": "Scan Face Hikvision",
    "description": "อุปกรณ์สแกนใบหน้าบันทึกและตรวจสอบเวลา เข้า-ออก การทำงาน",
    "critical_service": "จัดเก็บข้อมูลใบหน้าบุคลากร",
    "likelihood": 1,
    "impact": 5,
    "risk_level": 5,
    "impact_c": "กลาง",
    "impact_i": "สูง",
    "impact_a": "สูง",
    "financial_impact": 2000.0,
    "operational_impact": "ต้องใช้การลงชื่อด้วยมือ ซึ่งพิสูจน์เวลาได้ยาก",
    "law_regulatory_impact": "สูงมาก (ข้อมูล Biometric ภายใต้ PDPA)",
    "reputational_impact": "ส่งผลต่อความเชื่อมั่นด้านความปลอดภัย ข้อมูลส่วนบุคคลของพนักงาน",
    "mtpd": "7 วัน",
    "rto": "48 ชม.",
    "rpo": "24 ชม."
  }
];

export const BIA_BCM_CONCEPTS = [
  {
    "term": "MTPD (Maximum Tolerable Period of Disruption)",
    "definition": "ระยะเวลาสูงสุดที่ธุรกิจ/ระบบงานสามารถหยุดชะงักได้ ก่อนที่ผลกระทบจะรุนแรงจนองค์กรไม่สามารถยอมรับได้ (ยิ่งน้อยยิ่งวิกฤต)",
    "example": "เช่น ระบบเบิกจ่ายเงินเดือนอาจมี MTPD 7 วัน แต่ระบบอินเทอร์เน็ตหลักอาจมี MTPD เพียง 4 ชั่วโมง"
  },
  {
    "term": "RTO (Recovery Time Objective)",
    "definition": "ระยะเวลาเป้าหมายสูงสุดที่ต้องกู้คืนระบบหรือบริการให้กลับมาใช้งานได้หลังจากเกิดเหตุการณ์หยุดชะงัก (ต้องสั้นกว่า MTPD เสมอ)",
    "example": "เช่น กำหนด RTO ไว้ที่ 1 - 4 ชั่วโมง เพื่อให้ระบบหลักกลับมาใช้งานได้ก่อนเข้าสู่จุดวิกฤต"
  },
  {
    "term": "RPO (Recovery Point Objective)",
    "definition": "ระยะเวลาสูงสุดของข้อมูลที่ยอมให้สูญหายได้ (คำนวณจากความถี่ในการสำรองข้อมูล / Backup Frequency)",
    "example": "เช่น กำหนด RPO 1 ชั่วโมง หมายถึงต้องสำรองข้อมูลอย่างน้อยทุก 1 ชั่วโมง เพื่อให้ข้อมูลหายได้ไม่เกิน 1 ชั่วโมง"
  }
];

export const BIA_CLUSTERS = [
  'Application-Major',
  'Application-Minor',
  'HW-Servers',
  'HW-Router/Firewall',
  'HW-Others',
  'HW-Switch',
  'HW-WIFI',
  'SW-Windows',
  'SW-Others'
];
