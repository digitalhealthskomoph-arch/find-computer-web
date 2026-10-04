// =========================================================================
// 1.2 Logs of all access (สสจ.สระแก้ว)
// ข้อมูลตั้งต้นสำหรับบันทึกการเข้าถึงระบบสำคัญ (Access Logs) และการตรวจทาน Log รายสัปดาห์/เดือน
// อ้างอิง: พรบ.ไซเบอร์ 2562 (ม.43), ประกาศ สกมช. [ข้อ 22.1.2]
// =========================================================================

export const DEFAULT_ACCESS_LOGS_HEADER = {
  agency: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  system_name: 'ระบบจัดเก็บบันทึกและตรวจทานการเข้าถึงบริการสำคัญ (Protect: Logs of All Access)',
  evaluator: 'นายธนกฤต นิธิตันติปัญญา',
  evaluator_position: 'นักวิชาการคอมพิวเตอร์',
  reviewer: 'นายอิทธิพล อุดตมะปัญญา',
  reviewer_position: 'นายแพทย์เชี่ยวชาญ (ด้านเวชกรรมป้องกัน)',
  review_cycle: 'ประจำเดือน กุมภาพันธ์ พ.ศ. 2569',
  retention_policy: 'จัดเก็บบันทึกประวัติการเข้าถึง (Access Log) ไม่น้อยกว่า 90 วัน ตาม พรบ.คอมพิวเตอร์ และ พรบ.ไซเบอร์ 2562',
  central_log_server: 'Central Syslog Server (IP: 192.168.1.250 / Storage: 2 TB NAS)',
  last_review_date: '2026-02-26',
  doc_ref: 'อ้างอิง: พรบ.ไซเบอร์ 2562 (ม.43), ประกาศ สกมช. [ข้อ 22.1.2 การเก็บรักษาและการตรวจสอบบันทึกการเข้าถึง]'
}

export const DEFAULT_ACCESS_LOGS_UPDATE_LOGS = [
  {
    id: 'log_al_1',
    date: '2026-02-26',
    displayDate: '26 กุมภาพันธ์ 2569',
    author: 'นายธนกฤต นิธิตันติปัญญา',
    detail: 'ตรวจทานบันทึกการเข้าถึงเซิร์ฟเวอร์และไฟร์วอลล์ สัปดาห์ที่ 4 ประจำเดือนกุมภาพันธ์ 2569 ไม่พบกิจกรรมผิดปกติร้ายแรง'
  },
  {
    id: 'log_al_2',
    date: '2026-02-19',
    displayDate: '19 กุมภาพันธ์ 2569',
    author: 'นายณัฏฐ์ดนัย ตั้งธนพรสกุล',
    detail: 'ตรวจทานบันทึกการเข้าถึง สัปดาห์ที่ 3 พบการพยายามล็อกอินผิดปกติผ่าน SSL-VPN 5 ครั้ง จาก IP ภายนอก ได้ทำการบล็อก IP ชั่วคราวเรียบร้อย'
  }
]

// 1. ตารางบันทึกประวัติการเข้าถึงระบบสำคัญ (Access Audit Trail / Access Logs)
export const DEFAULT_ACCESS_LOG_ITEMS = [
  {
    id: 'log_item_01',
    timestamp: '2026-02-26 14:35:12',
    user_id: 'thanakrit.n',
    user_name: 'นายธนกฤต นิธิตันติปัญญา',
    target_system: 'Active Directory (DC-01)',
    source_ip: '192.168.1.15',
    action_type: 'Interactive Login',
    privilege_used: 'Domain Admin',
    event_detail: 'เข้าสู่ระบบจัดการเซิร์ฟเวอร์โดเมนหลัก DC-01 เพื่อตรวจสอบสถานะการซิงค์',
    status: 'Success', // 'Success' | 'Failed'
    severity: 'Normal' // 'Normal' | 'Warning' | 'Critical'
  },
  {
    id: 'log_item_02',
    timestamp: '2026-02-26 13:20:05',
    user_id: 'nattadanai.t',
    user_name: 'นายณัฏฐ์ดนัย ตั้งธนพรสกุล',
    target_system: 'Firewall (FortiGate-FG100)',
    source_ip: '192.168.1.20',
    action_type: 'Config Change',
    privilege_used: 'Network Admin',
    event_detail: 'ปรับปรุง Firewall Policy #14 สำหรับอนุญาตเฉพาะ IP เครือข่ายสาธารณสุข',
    status: 'Success',
    severity: 'Warning'
  },
  {
    id: 'log_item_03',
    timestamp: '2026-02-26 11:15:40',
    user_id: 'piyanat.v',
    user_name: 'นายปิยะณัฐ วิเชียร',
    target_system: 'Web Portal & Data Platform',
    source_ip: '192.168.1.25',
    action_type: 'Web Login',
    privilege_used: 'System Admin',
    event_detail: 'เข้าสู่ระบบจัดการเนื้อหา Portal สสจ.สระแก้ว และอัปเดตประกาศข่าวสาร',
    status: 'Success',
    severity: 'Normal'
  },
  {
    id: 'log_item_04',
    timestamp: '2026-02-26 09:42:18',
    user_id: 'kannika.k',
    user_name: 'นางสาวกรรณิการ์ ขุนวงศ์',
    target_system: 'ระบบสารบรรณอิเล็กทรอนิกส์ (e-Saraban)',
    source_ip: '192.168.2.10',
    action_type: 'User Login',
    privilege_used: 'Saraban Admin',
    event_detail: 'เข้าสู่ระบบลงรับและจ่ายหนังสือราชการประจำวัน',
    status: 'Success',
    severity: 'Normal'
  },
  {
    id: 'log_item_05',
    timestamp: '2026-02-25 23:45:00',
    user_id: 'svc_backup',
    user_name: 'Service Account: Backup Automation',
    target_system: 'Database Server (HDC-DB)',
    source_ip: '192.168.1.250',
    action_type: 'Backup Job',
    privilege_used: 'Service Account',
    event_detail: 'รันคำสั่งสำรองข้อมูลฐานข้อมูล HDC ประจำวัน (Automated Nightly Backup สำเร็จ 100%)',
    status: 'Success',
    severity: 'Normal'
  },
  {
    id: 'log_item_06',
    timestamp: '2026-02-25 18:30:11',
    user_id: 'unknown_root',
    user_name: 'ผู้ไม่ประสงค์ดี (พยายามสุ่มรหัส)',
    target_system: 'Firewall SSL-VPN',
    source_ip: '203.150.12.88 (External)',
    action_type: 'Failed Login Attempt',
    privilege_used: 'Guest/Unknown',
    event_detail: 'พยายามล็อกอิน SSL-VPN ด้วยบัญชี root รหัสผ่านผิด 3 ครั้ง (Firewall Auto-blocked IP)',
    status: 'Failed',
    severity: 'Critical'
  },
  {
    id: 'log_item_07',
    timestamp: '2026-02-25 15:10:22',
    user_id: 'hdc.admin',
    user_name: 'นายวรวุฒิ นามสมมุติ',
    target_system: 'Database Server (HDC-DB)',
    source_ip: '192.168.1.30',
    action_type: 'Data Query/Export',
    privilege_used: 'Database Admin',
    event_detail: 'สืบค้นข้อมูลสรุปสถิติผู้ป่วยโรคไม่ติดต่อเรื้อรัง (NCDs) เพื่อจัดทำรายงานยุทธศาสตร์',
    status: 'Success',
    severity: 'Normal'
  },
  {
    id: 'log_item_08',
    timestamp: '2026-02-24 16:50:33',
    user_id: 'thanakrit.n',
    user_name: 'นายธนกฤต นิธิตันติปัญญา',
    target_system: 'Active Directory (DC-01)',
    source_ip: '192.168.1.15',
    action_type: 'Password Reset',
    privilege_used: 'Domain Admin',
    event_detail: 'รีเซ็ตรหัสผ่านและตั้งค่า Force change password ให้แก่บุคลากรบรรจุใหม่กลุ่มงานเวชฯ',
    status: 'Success',
    severity: 'Normal'
  },
  {
    id: 'log_item_09',
    timestamp: '2026-02-24 10:12:44',
    user_id: 'it.support01',
    user_name: 'นายสมชาย มุ่งมั่น',
    target_system: 'Active Directory (DC-01)',
    source_ip: '192.168.1.40',
    action_type: 'Client Join Domain',
    privilege_used: 'IT Operator',
    event_detail: 'นำเครื่องคอมพิวเตอร์จัดหาใหม่ 2 เครื่องเข้าร่วม Windows Domain สสจ.สระแก้ว',
    status: 'Success',
    severity: 'Normal'
  },
  {
    id: 'log_item_10',
    timestamp: '2026-02-23 20:15:02',
    user_id: 'somchai.retired',
    user_name: 'นายสมศักดิ์ ชูไกรไทย (ย้ายหน้าที่แล้ว)',
    target_system: 'Web Portal & Data Platform',
    source_ip: '192.168.1.105',
    action_type: 'Failed Login Attempt',
    privilege_used: 'Disabled Account',
    event_detail: 'พยายามเข้าสู่ระบบแต่ไม่สำเร็จเนื่องจากบัญชีถูกระงับสิทธิ์การใช้งาน (Account Disabled)',
    status: 'Failed',
    severity: 'Warning'
  }
]

// 2. แบบรายงานการตรวจทาน Log ประจำสัปดาห์/เดือน (Weekly/Monthly Log Review Checklists)
// อ้างอิงตามข้อกำหนด สกมช. ข้อ 22.1.2 ต้องมีการตรวจสอบบันทึกการเข้าถึงอย่างน้อยรายสัปดาห์
export const DEFAULT_LOG_REVIEW_ROUNDS = [
  {
    id: 'review_w4',
    title: 'การตรวจทานบันทึกการเข้าถึง สัปดาห์ที่ 4 (23 - 26 ก.พ. 2569)',
    review_date: '2026-02-26',
    auditor_name: 'นายธนกฤต นิธิตันติปัญญา',
    auditor_position: 'นักวิชาการคอมพิวเตอร์ (ผู้รับผิดชอบระบบ)',
    overall_result: 'ปกติ (Normal)', // 'ปกติ (Normal)', 'พบข้อสังเกต (Observation)', 'พบเหตุการณ์ผิดปกติ (Incident)'
    items: [
      {
        check_id: 'chk_1',
        title: '1. ตรวจสอบการพยายามเข้าสู่ระบบล้มเหลวซ้ำๆ (Failed Login / Brute Force)',
        detail: 'ตรวจสอบบันทึกบน AD และ Firewall มีการล็อกอินล้มเหลวต่อเนื่องเกิน 5 ครั้งหรือไม่',
        result: 'ผ่าน (Pass)',
        finding: 'พบล็อกอินผิดปกติจาก IP ภายนอก 1 ครั้ง แต่ระบบ Firewall บล็อก IP อัตโนมัติทันที ไม่เกิดผลกระทบ'
      },
      {
        check_id: 'chk_2',
        title: '2. ตรวจสอบการเข้าใช้งานนอกเวลาราชการที่ไม่ได้แจ้งล่วงหน้า (After-Hours Access)',
        detail: 'ตรวจสอบประวัติการล็อกอินหลัง 18:30 น. และช่วงวันหยุดเสาร์-อาทิตย์',
        result: 'ผ่าน (Pass)',
        finding: 'มีเฉพาะการทำงานของ Automated Backup Service ในเวลา 23:45 น. ซึ่งเป็นปกติ'
      },
      {
        check_id: 'chk_3',
        title: '3. ตรวจสอบการใช้งานบัญชีสิทธิ์ระดับสูง (Root / Domain Admin / Privilege Elevation)',
        detail: 'ตรวจสอบว่ามีการใช้บัญชี Admin ทำการแก้ไขคอนฟิกสำคัญโดยไม่มีเหตุจำเป็นหรือไม่',
        result: 'ผ่าน (Pass)',
        finding: 'มีบันทึกการปรับปรุง Firewall Rule และรีเซ็ตรหัสผ่าน โดยระบุเหตุผลและผู้ดำเนินการชัดเจน'
      },
      {
        check_id: 'chk_4',
        title: '4. ตรวจสอบการเชื่อมต่อระยะไกลผ่าน SSL-VPN / Remote Desktop',
        detail: 'ตรวจสอบบัญชีที่เชื่อมต่อผ่าน VPN จากภายนอก สอดคล้องกับรายชื่อที่ได้รับอนุมัติหรือไม่',
        result: 'ผ่าน (Pass)',
        finding: 'มีการใช้งานเฉพาะบุคลากร IT ที่ได้รับอนุญาต และเชื่อมต่อผ่านการยืนยันตัวตนแบบรหัสผ่านสองชั้น (2FA)'
      },
      {
        check_id: 'chk_5',
        title: '5. ตรวจสอบการพยายามเข้าใช้งานของบัญชีที่ระงับสิทธิ์หรือลาออกแล้ว (Dormant/Disabled Accounts)',
        detail: 'ตรวจสอบว่ามีบัญชีของผู้ที่ย้ายไปที่อื่นพยายามเข้าสู่ระบบหรือไม่',
        result: 'ข้อสังเกต (Observation)',
        finding: 'พบบัญชี somchai.retired มีการพยายามล็อกอินเข้าระบบเว็บ 1 ครั้ง ระบบปฏิเสธการเข้าถึงเรียบร้อย'
      }
    ],
    action_taken: 'ตรวจสอบสถานะบัญชีที่ย้ายกลุ่มงาน ดำเนินการเพิกถอนสิทธิ์ถาวรใน Active Directory และยืนยันการตั้งค่าบล็อก IP ต้องสงสัยบนไฟร์วอลล์',
    approver_name: 'นายอิทธิพล อุดตมะปัญญา (นายแพทย์เชี่ยวชาญ / ISM)',
    approved_date: '2026-02-26'
  },
  {
    id: 'review_w3',
    title: 'การตรวจทานบันทึกการเข้าถึง สัปดาห์ที่ 3 (16 - 20 ก.พ. 2569)',
    review_date: '2026-02-20',
    auditor_name: 'นายณัฏฐ์ดนัย ตั้งธนพรสกุล',
    auditor_position: 'นักวิชาการคอมพิวเตอร์',
    overall_result: 'ปกติ (Normal)',
    items: [
      {
        check_id: 'chk_1',
        title: '1. ตรวจสอบการพยายามเข้าสู่ระบบล้มเหลวซ้ำๆ (Failed Login / Brute Force)',
        detail: 'ตรวจสอบบันทึกบน AD และ Firewall มีการล็อกอินล้มเหลวต่อเนื่องเกิน 5 ครั้งหรือไม่',
        result: 'ผ่าน (Pass)',
        finding: 'ไม่พบเหตุการณ์ Brute force บนระบบเครือข่ายภายใน'
      },
      {
        check_id: 'chk_2',
        title: '2. ตรวจสอบการเข้าใช้งานนอกเวลาราชการที่ไม่ได้แจ้งล่วงหน้า (After-Hours Access)',
        detail: 'ตรวจสอบประวัติการล็อกอินหลัง 18:30 น. และช่วงวันหยุดเสาร์-อาทิตย์',
        result: 'ผ่าน (Pass)',
        finding: 'ไม่พบการล็อกอินผิดปกติ'
      },
      {
        check_id: 'chk_3',
        title: '3. ตรวจสอบการใช้งานบัญชีสิทธิ์ระดับสูง (Root / Domain Admin / Privilege Elevation)',
        detail: 'ตรวจสอบว่ามีการใช้บัญชี Admin ทำการแก้ไขคอนฟิกสำคัญโดยไม่มีเหตุจำเป็นหรือไม่',
        result: 'ผ่าน (Pass)',
        finding: 'การใช้งานบัญชีแอดมินสอดคล้องกับแผนงานบำรุงรักษา'
      },
      {
        check_id: 'chk_4',
        title: '4. ตรวจสอบการเชื่อมต่อระยะไกลผ่าน SSL-VPN / Remote Desktop',
        detail: 'ตรวจสอบบัญชีที่เชื่อมต่อผ่าน VPN จากภายนอก สอดคล้องกับรายชื่อที่ได้รับอนุมัติหรือไม่',
        result: 'ผ่าน (Pass)',
        finding: 'บัญชี VPN ทั้งหมดเป็นบุคลากรของ สสจ. ที่ได้รับอนุญาต'
      },
      {
        check_id: 'chk_5',
        title: '5. ตรวจสอบการพยายามเข้าใช้งานของบัญชีที่ระงับสิทธิ์หรือลาออกแล้ว (Dormant/Disabled Accounts)',
        detail: 'ตรวจสอบว่ามีบัญชีของผู้ที่ย้ายไปที่อื่นพยายามเข้าสู่ระบบหรือไม่',
        result: 'ผ่าน (Pass)',
        finding: 'ไม่พบบันทึกการพยายามเข้าใช้งาน'
      }
    ],
    action_taken: 'บันทึกประวัติการตรวจทานและจัดเก็บสำเนา Log ลงระบบ NAS ประจำสัปดาห์',
    approver_name: 'นายอิทธิพล อุดตมะปัญญา (นายแพทย์เชี่ยวชาญ / ISM)',
    approved_date: '2026-02-20'
  }
]
