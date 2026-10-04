// =========================================================================
// 1.3 User Permission Matrix / Review (สสจ.สระแก้ว)
// ข้อมูลตั้งต้นสำหรับตารางกำหนดสิทธิ์ (Permission Matrix) และการทบทวนสิทธิ์ (Access Review)
// =========================================================================

export const DEFAULT_USER_PERMISSION_HEADER = {
  agency: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  system_name: 'ระบบสารสนเทศ เซิร์ฟเวอร์ และเครือข่ายความมั่นคงปลอดภัยไซเบอร์ (Protect: Access Control)',
  evaluator: 'นายธนกฤต นิธิตันติปัญญา',
  evaluator_position: 'นักวิชาการคอมพิวเตอร์',
  reviewer: 'นายอิทธิพล อุดตมะปัญญา',
  reviewer_position: 'นายแพทย์เชี่ยวชาญ (ด้านเวชกรรมป้องกัน)',
  review_cycle: 'ประจำปีงบประมาณ พ.ศ. 2569',
  last_review_date: '2026-02-26',
  doc_ref: 'อ้างอิง: พรบ.ไซเบอร์ 2562 (ม.43), ประกาศ สกมช. [ข้อ 22.1.1, 22.1.3]'
}

export const DEFAULT_USER_PERMISSION_LOGS = [
  {
    id: 'log_upm_1',
    date: '2026-02-26',
    displayDate: '26 กุมภาพันธ์ 2569',
    author: 'นายธนกฤต นิธิตันติปัญญา',
    detail: 'ดำเนินการทบทวนสิทธิ์การเข้าถึงระบบสารสนเทศและระดับ Admin ประจำปีงบประมาณ 2569 พร้อมปรับปรุงสถานะการถือครองสิทธิ์ตามมาตรการ Least Privilege'
  },
  {
    id: 'log_upm_2',
    date: '2026-02-23',
    displayDate: '23 กุมภาพันธ์ 2569',
    author: 'นายณัฏฐ์ดนัย ตั้งธนพรสกุล',
    detail: 'จัดทำโครงสร้างเมทริกซ์กำหนดสิทธิ์ (Permission Matrix) 8 บทบาทหน้าที่ และสำรวจรายชื่อบัญชีผู้ดูแลระบบสำคัญของ สสจ.สระแก้ว'
  }
]

// ระบบงานและฟังก์ชันหลักของ สสจ.สระแก้ว
export const SSK_SYSTEMS = [
  {
    id: 'sys_ad',
    name: 'Active Directory & DC',
    description: 'ระบบควบคุมโดเมนและยืนยันตัวตนกลาง (Windows Domain Controller)',
    category: 'Infrastructure',
    functions: [
      { id: 'fn_ad_user', label: 'จัดการบัญชีผู้ใช้ (User/Group)' },
      { id: 'fn_ad_gpo', label: 'จัดการ Group Policy (GPO)' },
      { id: 'fn_ad_dc', label: 'ตั้งค่าระบบ Domain Controller' },
      { id: 'fn_ad_reset', label: 'รีเซ็ตรหัสผ่านผู้ใช้งาน' }
    ]
  },
  {
    id: 'sys_network',
    name: 'Network & Firewall',
    description: 'ไฟร์วอลล์ สวิตช์เครือข่าย และ SSL-VPN สสจ.สระแก้ว',
    category: 'Perimeter Security',
    functions: [
      { id: 'fn_fw_rule', label: 'จัดการ Security & Firewall Rules' },
      { id: 'fn_fw_vpn', label: 'อนุมัติและจัดการ SSL-VPN บัญชีผู้ใช้' },
      { id: 'fn_fw_monitor', label: 'ตรวจสอบ Traffic & Log เครือข่าย' }
    ]
  },
  {
    id: 'sys_portal',
    name: 'Web Portal & Apps',
    description: 'เว็บไซต์ สสจ.สระแก้ว และเว็บแอปพลิเคชันภายใน',
    category: 'Application',
    functions: [
      { id: 'fn_web_admin', label: 'จัดการสิทธิ์ผู้ใช้งานระบบเว็บ' },
      { id: 'fn_web_content', label: 'แก้ไขข่าวสารและเผยแพร่ข้อมูล' },
      { id: 'fn_web_config', label: 'ปรับแต่งการตั้งค่าระบบเว็บ' }
    ]
  },
  {
    id: 'sys_saraban',
    name: 'สารบรรณอิเล็กทรอนิกส์',
    description: 'ระบบรับ-ส่งหนังสือราชการและลงนามดิจิทัล (e-Document)',
    category: 'Administration',
    functions: [
      { id: 'fn_sb_admin', label: 'จัดการสิทธิ์/กลุ่มงานในสารบรรณ' },
      { id: 'fn_sb_sign', label: 'ลงนามและเกษียนหนังสือราชการ' },
      { id: 'fn_sb_operate', label: 'รับ-ส่ง ออกเลขหนังสือราชการ' }
    ]
  },
  {
    id: 'sys_database',
    name: 'HDC & DB Server',
    description: 'คลังข้อมูลสุขภาพ HDC สสจ.สระแก้ว และ Database Server',
    category: 'Database',
    functions: [
      { id: 'fn_db_schema', label: 'จัดการ Database Schema & Config' },
      { id: 'fn_db_backup', label: 'สำรองและกู้คืนข้อมูล (Backup/Restore)' },
      { id: 'fn_db_query', label: 'สืบค้นและรายงานผลข้อมูลสาธารณสุข' }
    ]
  },
  {
    id: 'sys_governance',
    name: 'Portal จัดหาคอมฯ & Cyber',
    description: 'ระบบจัดหาคอมพิวเตอร์ ธรรมาภิบาลข้อมูล PDPA และ CII Cyber Portal',
    category: 'Governance Suite',
    functions: [
      { id: 'fn_gov_super', label: 'จัดการข้อมูลระบบและสิทธิ์ Super Admin' },
      { id: 'fn_gov_meeting', label: 'จัดการรอบประชุมและมติจัดหาคอมฯ' },
      { id: 'fn_gov_pdpa', label: 'ทบทวน ROPA และบันทึกข้อมูลส่วนบุคคล' }
    ]
  }
]

// บทบาทในระบบ (Roles) สำหรับ สสจ.สระแก้ว
export const SSK_ROLES = [
  {
    id: 'ROLE_SUPER_ADMIN',
    code: 'SSK-ADM01',
    title: 'ผู้ดูแลระบบความมั่นคงปลอดภัยสูงสุด (ISM / Super Admin)',
    description: 'มีสิทธิ์สูงสุดในการควบคุม บริหารจัดการโครงสร้างพื้นฐาน และตั้งค่าความปลอดภัย',
    user_count: 2
  },
  {
    id: 'ROLE_NETWORK_ADMIN',
    code: 'SSK-ADM02',
    title: 'ผู้ดูแลระบบเครือข่ายและความมั่นคงปลอดภัย (Network & Sec Admin)',
    description: 'ดูแลอุปกรณ์ Firewall, Core Switch, Router, Wi-Fi และ SSL-VPN',
    user_count: 2
  },
  {
    id: 'ROLE_SYSTEM_ADMIN',
    code: 'SSK-ADM03',
    title: 'ผู้ดูแลระบบแม่ข่ายและ Active Directory (SysAdmin)',
    description: 'ดูแล Server, Virtual Machine, Active Directory และการจัดการบัญชีผู้ใช้งาน',
    user_count: 2
  },
  {
    id: 'ROLE_DB_ADMIN',
    code: 'SSK-ADM04',
    title: 'ผู้ดูแลระบบฐานข้อมูลและคลังข้อมูลสุขภาพ (DBA / Data Admin)',
    description: 'ดูแลฐานข้อมูล HDC, ฐานข้อมูล Portal, การสำรองข้อมูล และความสมบูรณ์ของข้อมูล',
    user_count: 2
  },
  {
    id: 'ROLE_WEB_ADMIN',
    code: 'SSK-APP01',
    title: 'ผู้ดูแลระบบแอปพลิเคชันและเว็บพอร์ทัล (Webmaster)',
    description: 'ดูแลเว็บไซต์ สสจ.สระแก้ว, ข้อมูลข่าวสาร และระบบบริการประชาชน',
    user_count: 3
  },
  {
    id: 'ROLE_SARABUN_ADMIN',
    code: 'SSK-ADM05',
    title: 'ผู้ดูแลระบบสารบรรณอิเล็กทรอนิกส์ (e-Document Admin)',
    description: 'จัดการผังหน่วยงาน สิทธิ์การใช้งาน และเลขที่หนังสือราชการ',
    user_count: 2
  },
  {
    id: 'ROLE_OPERATOR',
    code: 'SSK-USR01',
    title: 'เจ้าหน้าที่ผู้ปฏิบัติงานสารสนเทศ (IT Support / Operator)',
    description: 'ปฏิบัติงานสนับสนุน ตรวจสอบเบื้องต้น และให้บริการผู้ใช้งานทั่วไป',
    user_count: 3
  },
  {
    id: 'ROLE_AUDITOR',
    code: 'SSK-AUD01',
    title: 'ผู้ตรวจประเมินภายใน / ผู้บริหาร (Auditor / Executive)',
    description: 'มีสิทธิ์เรียกดูข้อมูลและรายงานเพื่อการกำกับดูแลและตรวจสอบ (View Only)',
    user_count: 2
  }
]

// ตาราง Permission Matrix (สิทธิ์การเข้าถึงแต่ละฟังก์ชัน)
// ค่าสิทธิ์: 'X' = จัดการได้ทั้งหมด (Full Admin), 'O' = ปฏิบัติงาน/แก้ไข (Operator), 'V' = ดูได้อย่างเดียว (View Only), '-' = ไม่มีสิทธิ์ (No Access)
export const DEFAULT_PERMISSION_MATRIX = {
  ROLE_SUPER_ADMIN: {
    fn_ad_user: 'X', fn_ad_gpo: 'X', fn_ad_dc: 'X', fn_ad_reset: 'X',
    fn_fw_rule: 'X', fn_fw_vpn: 'X', fn_fw_monitor: 'X',
    fn_web_admin: 'X', fn_web_content: 'X', fn_web_config: 'X',
    fn_sb_admin: 'X', fn_sb_sign: 'V', fn_sb_operate: 'V',
    fn_db_schema: 'X', fn_db_backup: 'X', fn_db_query: 'X',
    fn_gov_super: 'X', fn_gov_meeting: 'X', fn_gov_pdpa: 'X'
  },
  ROLE_NETWORK_ADMIN: {
    fn_ad_user: 'V', fn_ad_gpo: '-', fn_ad_dc: '-', fn_ad_reset: 'V',
    fn_fw_rule: 'X', fn_fw_vpn: 'X', fn_fw_monitor: 'X',
    fn_web_admin: '-', fn_web_content: '-', fn_web_config: 'V',
    fn_sb_admin: '-', fn_sb_sign: '-', fn_sb_operate: '-',
    fn_db_schema: '-', fn_db_backup: 'V', fn_db_query: '-',
    fn_gov_super: 'V', fn_gov_meeting: '-', fn_gov_pdpa: '-'
  },
  ROLE_SYSTEM_ADMIN: {
    fn_ad_user: 'X', fn_ad_gpo: 'X', fn_ad_dc: 'X', fn_ad_reset: 'X',
    fn_fw_rule: 'V', fn_fw_vpn: 'O', fn_fw_monitor: 'V',
    fn_web_admin: 'O', fn_web_content: '-', fn_web_config: 'O',
    fn_sb_admin: 'O', fn_sb_sign: '-', fn_sb_operate: '-',
    fn_db_schema: 'V', fn_db_backup: 'X', fn_db_query: 'V',
    fn_gov_super: 'O', fn_gov_meeting: '-', fn_gov_pdpa: '-'
  },
  ROLE_DB_ADMIN: {
    fn_ad_user: '-', fn_ad_gpo: '-', fn_ad_dc: '-', fn_ad_reset: '-',
    fn_fw_rule: '-', fn_fw_vpn: '-', fn_fw_monitor: '-',
    fn_web_admin: 'V', fn_web_content: '-', fn_web_config: 'V',
    fn_sb_admin: '-', fn_sb_sign: '-', fn_sb_operate: '-',
    fn_db_schema: 'X', fn_db_backup: 'X', fn_db_query: 'X',
    fn_gov_super: 'V', fn_gov_meeting: '-', fn_gov_pdpa: 'O'
  },
  ROLE_WEB_ADMIN: {
    fn_ad_user: '-', fn_ad_gpo: '-', fn_ad_dc: '-', fn_ad_reset: '-',
    fn_fw_rule: '-', fn_fw_vpn: '-', fn_fw_monitor: '-',
    fn_web_admin: 'X', fn_web_content: 'X', fn_web_config: 'X',
    fn_sb_admin: '-', fn_sb_sign: '-', fn_sb_operate: '-',
    fn_db_schema: '-', fn_db_backup: 'V', fn_db_query: 'V',
    fn_gov_super: 'O', fn_gov_meeting: '-', fn_gov_pdpa: '-'
  },
  ROLE_SARABUN_ADMIN: {
    fn_ad_user: '-', fn_ad_gpo: '-', fn_ad_dc: '-', fn_ad_reset: '-',
    fn_fw_rule: '-', fn_fw_vpn: '-', fn_fw_monitor: '-',
    fn_web_admin: '-', fn_web_content: '-', fn_web_config: '-',
    fn_sb_admin: 'X', fn_sb_sign: 'O', fn_sb_operate: 'X',
    fn_db_schema: '-', fn_db_backup: '-', fn_db_query: '-',
    fn_gov_super: '-', fn_gov_meeting: '-', fn_gov_pdpa: '-'
  },
  ROLE_OPERATOR: {
    fn_ad_user: 'V', fn_ad_gpo: '-', fn_ad_dc: '-', fn_ad_reset: 'O',
    fn_fw_rule: '-', fn_fw_vpn: 'V', fn_fw_monitor: 'V',
    fn_web_admin: 'V', fn_web_content: 'O', fn_web_config: '-',
    fn_sb_admin: 'V', fn_sb_sign: '-', fn_sb_operate: 'O',
    fn_db_schema: '-', fn_db_backup: 'V', fn_db_query: 'V',
    fn_gov_super: 'V', fn_gov_meeting: 'O', fn_gov_pdpa: 'O'
  },
  ROLE_AUDITOR: {
    fn_ad_user: 'V', fn_ad_gpo: 'V', fn_ad_dc: 'V', fn_ad_reset: 'V',
    fn_fw_rule: 'V', fn_fw_vpn: 'V', fn_fw_monitor: 'V',
    fn_web_admin: 'V', fn_web_content: 'V', fn_web_config: 'V',
    fn_sb_admin: 'V', fn_sb_sign: 'V', fn_sb_operate: 'V',
    fn_db_schema: 'V', fn_db_backup: 'V', fn_db_query: 'V',
    fn_gov_super: 'V', fn_gov_meeting: 'V', fn_gov_pdpa: 'V'
  }
}

// รายชื่อบัญชีผู้ใช้งานระบบสำคัญสำหรับการทบทวนสิทธิ์ (User Access Review Accounts)
// โครงสร้างคอลัมน์ตรงกับชีต User ID - Role -BO ของอาจารย์ไก่ แต่ปรับเป็นบริบท สสจ.สระแก้ว
export const DEFAULT_USER_REVIEW_ACCOUNTS = [
  {
    id: 'usr_01',
    user_id: 'thanakrit.n',
    user_ad: 'SKO\\thanakrit.n',
    name: 'นายธนกฤต นิธิตันติปัญญา',
    position: 'นักวิชาการคอมพิวเตอร์ ชำนาญการ',
    department: 'กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข',
    business_owner: 'นายแพทย์เชี่ยวชาญ (ด้านเวชกรรมป้องกัน)',
    target_system: 'Active Directory / Firewall / Portal',
    system_role: 'SSK-ADM01 (ผู้ดูแลระบบความมั่นคงปลอดภัยสูงสุด)',
    function_desc: 'ควบคุม บริหารจัดการโครงสร้างพื้นฐาน ตั้งค่าความปลอดภัย และดูแลสิทธิ์ระบบทั้งหมด',
    privilege_level: 'Super Admin',
    jobs_permission: 'FULL_CONTROL (X)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง', // 'คงสิทธิ์ถูกต้อง', 'รอปรับลดสิทธิ์', 'รอเพิกถอนสิทธิ์', 'สิทธิ์เกินความจำเป็น'
    review_remark: 'สิทธิ์ตรงตามภารกิจหัวหน้างานสารสนเทศและคณะทำงาน Cyber Security'
  },
  {
    id: 'usr_02',
    user_id: 'nattadanai.t',
    user_ad: 'SKO\\nattadanai.t',
    name: 'นายณัฏฐ์ดนัย ตั้งธนพรสกุล',
    position: 'นักวิชาการคอมพิวเตอร์ ปฏิบัติการ',
    department: 'กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข',
    business_owner: 'หัวหน้ากลุ่มงานพัฒนายุทธศาสตร์ฯ',
    target_system: 'Network & Firewall / SSL-VPN',
    system_role: 'SSK-ADM02 (ผู้ดูแลระบบเครือข่ายและความมั่นคงปลอดภัย)',
    function_desc: 'จัดการ Firewall Rules, VPN Access, และตรวจสอบ Traffic เครือข่าย',
    privilege_level: 'Network Admin',
    jobs_permission: 'FW_CONFIG, VPN_ADMIN (X)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง',
    review_remark: 'สิทธิ์ตรงตามภารกิจผู้ดูแลระบบเครือข่ายและเกตเวย์ความปลอดภัย'
  },
  {
    id: 'usr_03',
    user_id: 'piyanat.v',
    user_ad: 'SKO\\piyanat.v',
    name: 'นายปิยะณัฐ วิเชียร',
    position: 'นักวิชาการคอมพิวเตอร์',
    department: 'กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข',
    business_owner: 'หัวหน้ากลุ่มงานพัฒนายุทธศาสตร์ฯ',
    target_system: 'Active Directory / Server VM / Web Portal',
    system_role: 'SSK-ADM03 (ผู้ดูแลระบบแม่ข่ายและ Active Directory)',
    function_desc: 'จัดการบัญชีผู้ใช้งาน AD, ดูแล Server OS และระบบงานดิจิทัล',
    privilege_level: 'System Admin',
    jobs_permission: 'AD_MANAGE, VM_CONTROL (X)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง',
    review_remark: 'สิทธิ์ถูกต้องตามภารกิจดูแลเซิร์ฟเวอร์กลางและแอปพลิเคชันพอร์ทัล'
  },
  {
    id: 'usr_04',
    user_id: 'hdc.admin',
    user_ad: 'SKO\\hdc.admin',
    name: 'นายวรวุฒิ นามสมมุติ',
    position: 'นักวิชาการสถิติ / นักวิเคราะห์นโยบายและแผน',
    department: 'กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข',
    business_owner: 'หัวหน้ากลุ่มงานพัฒนายุทธศาสตร์ฯ',
    target_system: 'HDC & DB Server (คลังข้อมูลสุขภาพ)',
    system_role: 'SSK-ADM04 (ผู้ดูแลระบบฐานข้อมูลและคลังข้อมูล)',
    function_desc: 'จัดการระบบฐานข้อมูล HDC, ตรวจสอบ Schema, สำรองข้อมูล และออกรายงาน',
    privilege_level: 'Database Admin',
    jobs_permission: 'DB_SCHEMA, DB_BACKUP (X)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง',
    review_remark: 'สิทธิ์เฉพาะระบบคลังข้อมูลสุขภาพ HDC ไม่สามารถเข้าถึง AD หรือ Firewall'
  },
  {
    id: 'usr_05',
    user_id: 'webmaster',
    user_ad: 'SKO\\webmaster',
    name: 'นางสาวชลิตา วงศ์สวัสดิ์',
    position: 'นักวิชาการคอมพิวเตอร์',
    department: 'กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข',
    business_owner: 'หัวหน้ากลุ่มงานพัฒนายุทธศาสตร์ฯ',
    target_system: 'Web Portal & Data Platform สสจ.สระแก้ว',
    system_role: 'SSK-APP01 (ผู้ดูแลระบบแอปพลิเคชันและเว็บพอร์ทัล)',
    function_desc: 'ดูแลหน้าเว็บ จัดการข่าวสาร และโครงสร้างเมนูบริการดิจิทัล',
    privilege_level: 'Application Admin',
    jobs_permission: 'WEB_CONTENT, WEB_CONFIG (X)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง',
    review_remark: 'สิทธิ์ถูกต้อง มีสิทธิ์เฉพาะหน้าเว็บและระบบจัดการเนื้อหา'
  },
  {
    id: 'usr_06',
    user_id: 'kannika.k',
    user_ad: 'SKO\\kannika.k',
    name: 'นางสาวกรรณิการ์ ขุนวงศ์',
    position: 'เจ้าพนักงานธุรการ ชำนาญงาน',
    department: 'กลุ่มงานบริหารทั่วไป',
    business_owner: 'หัวหน้ากลุ่มงานบริหารทั่วไป',
    target_system: 'ระบบสารบรรณอิเล็กทรอนิกส์ (e-Document)',
    system_role: 'SSK-ADM05 (ผู้ดูแลระบบสารบรรณอิเล็กทรอนิกส์)',
    function_desc: 'จัดการผังหน่วยงาน สิทธิ์การใช้งาน และออกเลขหนังสือราชการ สสจ.',
    privilege_level: 'Application Admin',
    jobs_permission: 'SARABUN_ADMIN (X)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง',
    review_remark: 'สิทธิ์เฉพาะระบบสารบรรณอิเล็กทรอนิกส์ตามคำสั่งแต่งตั้งนายทะเบียนสารบรรณ'
  },
  {
    id: 'usr_07',
    user_id: 'saraban.staff01',
    user_ad: 'SKO\\saraban.staff01',
    name: 'นางสาวสุดารัตน์ ใจดี',
    position: 'เจ้าพนักงานธุรการ',
    department: 'กลุ่มงานบริหารทั่วไป',
    business_owner: 'หัวหน้ากลุ่มงานบริหารทั่วไป',
    target_system: 'ระบบสารบรรณอิเล็กทรอนิกส์ (e-Document)',
    system_role: 'SSK-USR01 (เจ้าหน้าที่ผู้ปฏิบัติงานสารบรรณ)',
    function_desc: 'ลงรับ-ส่งหนังสือราชการ ประจำกลุ่มงาน',
    privilege_level: 'Operator',
    jobs_permission: 'SARABUN_OPERATE (O)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง',
    review_remark: 'สิทธิ์ผู้ใช้งานทั่วไปประจำกลุ่มงาน'
  },
  {
    id: 'usr_08',
    user_id: 'it.support01',
    user_ad: 'SKO\\it.support01',
    name: 'นายสมชาย มุ่งมั่น',
    position: 'เจ้าหน้าที่คอมพิวเตอร์',
    department: 'กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข',
    business_owner: 'หัวหน้ากลุ่มงานพัฒนายุทธศาสตร์ฯ',
    target_system: 'Active Directory / Support Helpdesk',
    system_role: 'SSK-USR01 (เจ้าหน้าที่ผู้ปฏิบัติงานสารสนเทศทั่วไป)',
    function_desc: 'บริการช่วยเหลือผู้ใช้งาน รีเซ็ตรหัสผ่านคอมพิวเตอร์ ตรวจสอบเครื่องลูกข่าย',
    privilege_level: 'Operator',
    jobs_permission: 'PW_RESET, CLIENT_SUPPORT (O)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง',
    review_remark: 'สิทธิ์รีเซ็ตรหัสผ่านจำกัดเฉพาะ OU ผู้ใช้งานทั่วไป ห้ามรีเซ็ตระดับ Admin'
  },
  {
    id: 'usr_09',
    user_id: 'svc_backup',
    user_ad: 'SKO\\svc_backup',
    name: 'Service Account: Backup Automation',
    position: 'บัญชีระบบอัตโนมัติ (Service Account)',
    department: 'ศูนย์คอมพิวเตอร์ สสจ.สระแก้ว',
    business_owner: 'หัวหน้ากลุ่มงานพัฒนายุทธศาสตร์ฯ',
    target_system: 'Database & File Server Backup',
    system_role: 'SSK-ADM03 (System Admin - Backup Only)',
    function_desc: 'บัญชีเซอร์วิสสำหรับสำรองข้อมูลอัตโนมัติทุกเที่ยงคืน',
    privilege_level: 'Service Account',
    jobs_permission: 'BACKUP_EXECUTE (O)',
    last_reviewed_date: '2026-02-26',
    review_status: 'คงสิทธิ์ถูกต้อง',
    review_remark: 'ตรวจสอบแล้ว เป็นบัญชีสำรองข้อมูล ตั้งค่า Non-interactive Login เรียบร้อย'
  },
  {
    id: 'usr_10',
    user_id: 'somchai.retired',
    user_ad: 'SKO\\somchai.retired',
    name: 'นายสมศักดิ์ ชูไกรไทย (อดีตเจ้าหน้าที่)',
    position: 'นักวิชาการสาธารณสุข (ย้ายไปปฏิบัติหน้าที่อื่น)',
    department: 'กลุ่มงานประกันสุขภาพ (เดิม)',
    business_owner: 'หัวหน้ากลุ่มงานประกันสุขภาพ',
    target_system: 'Web Portal & HDC Data Query',
    system_role: 'SSK-USR01 (ผู้ใช้งานระบบคลังข้อมูลเดิม)',
    function_desc: 'เข้าถึงข้อมูลรายงานและระบบสิทธิการรักษาพยาบาล',
    privilege_level: 'Operator',
    jobs_permission: 'DATA_QUERY (V)',
    last_reviewed_date: '2026-02-26',
    review_status: 'รอเพิกถอนสิทธิ์', // จำลองรายการที่ตรวจพบในการทบทวนสิทธิ์
    review_remark: 'ย้ายไปปฏิบัติหน้าที่อื่นแล้ว รอเพิกถอนสิทธิ์ใน Active Directory และระบบ HDC'
  }
]
