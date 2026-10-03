// ข้อมูลเริ่มต้นสำหรับ 1.7 BIA Report (Business Impact Analysis Report)
// สกัดจากไฟล์ 1.7 BIA Report.docx สำหรับสำนักงานสาธารณสุขจังหวัดสระแก้ว

export const DEFAULT_BIA_REPORT_DATA = {
  id: 'bia_report_2569',
  versionTitle: 'รายงานประจำปี พ.ศ. 2569 (25 ก.พ. 2569)',
  createdAt: '2569-02-25',
  header: {
    orgName: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    reportDate: '25 กุมภาพันธ์ 2569',
    author: 'นายธนกฤต นิธิตันติปัญญา',
    involvedTeams: 'ฝ่ายความเสี่ยง, ฝ่าย IT, ฝ่ายการเงิน, ฝ่ายปฏิบัติการ, ฝ่ายทรัพยากรบุคคล, ฝ่ายบริหารทั่วไป'
  },
  objective: 'รายงานนี้จัดทำขึ้นเพื่อวิเคราะห์ผลกระทบที่อาจเกิดขึ้นจากเหตุการณ์ที่ไม่คาดคิดต่อกระบวนการสำคัญขององค์กร และเพื่อกำหนดลำดับความสำคัญในการฟื้นฟูการดำเนินงานในกรณีที่เกิดการหยุดชะงัก',
  scope: {
    coreProcesses: [
      {
        title: 'กระบวนการสารบรรณดิจิทัล',
        desc: 'การรับ-ส่งหนังสือราชการระหว่างหน่วยงานผ่านระบบออนไลน์'
      },
      {
        title: 'กระบวนการบริหารทรัพยากรบุคคลและงบประมาณ',
        desc: 'การบริหารจัดการข้อมูลสวัสดิการ (Pay Slip) และระบบ ERP (Plan-D) เพื่อความโปร่งใสและถูกต้อง'
      },
      {
        title: 'กระบวนการสื่อสารและประชาสัมพันธ์ดิจิทัล',
        desc: 'การให้บริการข้อมูลผ่านเว็บไซต์สำนักงาน และการประชุมทางไกลผ่านระบบ WebEx'
      },
      {
        title: 'กระบวนการบริหารจัดการเวลาปฏิบัติราชการ',
        desc: 'การบันทึกและตรวจสอบเวลาเข้า-ออกงานผ่านระบบอัตลักษณ์บุคคล'
      }
    ],
    staffServices: [
      'จัดให้มีระบบเบิกจ่ายและตรวจสอบข้อมูลสวัสดิการแบบออนไลน์ที่เข้าถึงได้ตลอด 24 ชั่วโมง',
      'สนับสนุนเครื่องมือการสื่อสารแบบดิจิทัลเพื่อลดข้อจำกัดด้านสถานที่ในการปฏิบัติงาน',
      'รักษาความปลอดภัยของข้อมูลส่วนบุคคลและข้อมูลอัตลักษณ์ (Biometric) ของเจ้าหน้าที่ตามมาตรฐาน PDPA'
    ],
    internalManagement: [
      'การรวมศูนย์ข้อมูลการบริหารงานจากกลุ่มงานต่างๆ เข้าสู่ระบบ ERP เพื่อการวิเคราะห์และวางแผนเชิงกลยุทธ์',
      'การจัดเก็บบันทึกข้อมูลความรู้วิชาการและผลงานวิจัยเพื่อพัฒนาสมรรถนะองค์กร'
    ],
    criticalResources: [
      {
        category: 'ฐานข้อมูล (Databases)',
        desc: 'ฐานข้อมูลบุคลากร, ฐานข้อมูลเงินเดือน, และฐานข้อมูลเอกสารสิทธิ์ราชการ'
      },
      {
        category: 'เซิร์ฟเวอร์หลัก (Primary Servers)',
        desc: 'อุปกรณ์ Physical Server ในห้อง Data Center และระบบ Web Server ที่ให้บริการหน้าเว็บหลัก'
      },
      {
        category: 'เครือข่ายอินเทอร์เน็ตและระบบป้องกัน (Network & Security)',
        desc: 'ระบบอินเทอร์เน็ตความเร็วสูง (NT), อุปกรณ์กระจายสัญญาณ (Router), และระบบ Firewall Fortigate'
      }
    ]
  },
  tableRows: [
    {
      id: 'bia_row_1',
      no: 1,
      assetKey: 'Pay Slip',
      processName: '1. งานสวัสดิการเจ้าหน้าที่ (Pay Slip)',
      financialImpact: 120000,
      reputationImpact: 'เสียความน่าเชื่อถือ ต่อการดูแลบุคลากรภายใน',
      legalImpact: 'สูง (PDPA/ข้อมูลส่วนบุคคล)',
      mtpd: '7 วัน',
      rto: '24 ชม.',
      rpo: '24 ชม.',
      recommendation: 'เปิดใช้งาน MFA เพื่อกันการสวมรอย'
    },
    {
      id: 'bia_row_2',
      no: 2,
      assetKey: 'Plan-D',
      processName: '2. งานบริหารงบประมาณ (Plan-D ERP)',
      financialImpact: 150000,
      reputationImpact: 'ส่งผลต่อความไว้วางใจ ของผู้บริหารและหน่วยตรวจสอบ',
      legalImpact: 'สูง (ระเบียบการเบิกจ่าย)',
      mtpd: '24 ชม.',
      rto: '4 ชม.',
      rpo: '4 ชม.',
      recommendation: 'ทำ RBAC จำกัดสิทธิ์ตามหน้าที่จริง'
    },
    {
      id: 'bia_row_3',
      no: 3,
      assetKey: 'ระบบสารบรรณกระทรวง สธ.',
      processName: '3. งานธุรการ/รับส่งหนังสือ (สารบรรณ)',
      financialImpact: 180000,
      reputationImpact: 'เสียภาพลักษณ์ความเป็นมืออาชีพ ต่อหน่วยงานอื่น',
      legalImpact: 'สูง (ระเบียบงานสารบรรณ)',
      mtpd: '24 ชม.',
      rto: '2 ชม.',
      rpo: '1 ชม.',
      recommendation: 'จำกัดการเข้าถึงเฉพาะ Intranet/VPN'
    },
    {
      id: 'bia_row_4',
      no: 4,
      assetKey: 'Web : sko.moph.go.th/research',
      processName: '4. งานเผยแพร่วิชาการ (Web Research)',
      financialImpact: 5000,
      reputationImpact: 'เสียชื่อเสียงด้านวิชาการ ในระดับเล็กน้อย',
      legalImpact: 'ต่ำ',
      mtpd: '2 วัน',
      rto: '48 ชม.',
      rpo: '24 ชม.',
      recommendation: 'สำรองข้อมูลแบบ Offline รายเดือน'
    },
    {
      id: 'bia_row_5',
      no: 5,
      assetKey: 'Web : sko.moph.go.th',
      processName: '5. งานบริการประชาชน (Web Main)',
      financialImpact: 15000,
      reputationImpact: 'ส่งผลต่อความไว้วางใจ ของประชาชนที่สืบค้นข้อมูล',
      legalImpact: 'กลาง  (พรบ. ข้อมูลข่าวสาร)',
      mtpd: '2 วัน',
      rto: '24 ชม.',
      rpo: '24 ชม.',
      recommendation: 'ติดตั้ง WAF ป้องกันการแฮกหน้าเว็บ'
    },
    {
      id: 'bia_row_6',
      no: 6,
      assetKey: 'zyxel router',
      processName: '6. โครงสร้างพื้นฐานเครือข่าย (Zyxel)',
      financialImpact: 200000,
      reputationImpact: 'ภาพลักษณ์องค์กรดูแย่ เพราะติดต่อสื่อสารไม่ได้เลย',
      legalImpact: 'ต่ำ (ผลกระทบทางเทคนิค)',
      mtpd: '4 ชม.',
      rto: '1 ชม.',
      rpo: 'N/A',
      recommendation: 'ทำ Backup Link (Internet 2 ค่าย)'
    },
    {
      id: 'bia_row_7',
      no: 7,
      assetKey: 'Fortigate 100F (Firewall)',
      processName: '7. ระบบความมั่นคงไซเบอร์ (Fortigate)',
      financialImpact: 200000,
      reputationImpact: 'เสียความน่าเชื่อถืออย่างรุนแรง หากระบบถูกเจาะ',
      legalImpact: 'สูงมาก  (พรบ. ไซเบอร์)',
      mtpd: '4 ชม.',
      rto: '1 ชม.',
      rpo: 'N/A',
      recommendation: 'อัปเดต Firmware และ Hardening Rule'
    }
  ],
  budgetRequests: [
    {
      id: 'b_1',
      amount: '350,000 บาท',
      purpose: 'สำหรับการปรับปรุงระบบสำรองข้อมูล'
    },
    {
      id: 'b_2',
      amount: '350,000 บาท',
      purpose: 'สำหรับ เครื่อง Server สำรอง'
    },
    {
      id: 'b_3',
      amount: '250,000 บาท',
      purpose: 'สำหรับระบบ Firewall'
    }
  ],
  reEvaluationDate: 'ตามรอบปีงบประมาณ 2570',
  participants: [
    { name: 'นายณัฏฐ์ดนัย ตั้งธนพรสกุล', role: 'ฝ่าย IT' },
    { name: 'นางสุดารัตน์ ตะเพาพงษ์', role: 'ฝ่ายการเงิน' },
    { name: 'นางสริญญา วันดีราช', role: 'ฝ่ายความเสี่ยง' }
  ],
  signatories: {
    preparedBy: {
      name: 'นายธนกฤต นิธิตันติปัญญา',
      position: 'นักวิชาการคอมพิวเตอร์ / Lead Implementer'
    },
    acknowledgedBy: {
      name: 'นายแพทย์อิทธิพล อุดตมะปัญญา',
      position: 'นายแพทย์เชี่ยวชาญ (ด้านเวชกรรมป้องกัน) (CISO)'
    }
  }
}

// ฟังก์ชันช่วยซิงค์/ดึงข้อมูลล่าสุดจาก 1.6 BIA Evident เข้าสู่แถวตาราง 1.7 BIA Report
export function mergeBiaEvidentToReportRows(currentRows, biaEvidentItems) {
  if (!Array.isArray(biaEvidentItems) || biaEvidentItems.length === 0) {
    return currentRows
  }

  const updatedRows = (currentRows || []).map(row => {
    const key = ((row.assetKey || '') + ' ' + (row.processName || '')).toLowerCase()
    
    let matched = null
    if (key.includes('pay slip') || key.includes('สวัสดิการ')) {
      matched = biaEvidentItems.find(it => (it.asset_name || '').toLowerCase().includes('pay slip'))
    } else if (key.includes('plan-d') || key.includes('งบประมาณ')) {
      matched = biaEvidentItems.find(it => (it.asset_name || '').toLowerCase().includes('plan-d'))
    } else if (key.includes('สารบรรณ')) {
      matched = biaEvidentItems.find(it => (it.asset_name || '').toLowerCase().includes('สารบรรณ'))
    } else if (key.includes('research') || key.includes('วิชาการ')) {
      matched = biaEvidentItems.find(it => (it.asset_name || '').toLowerCase().includes('research'))
    } else if (key.includes('web main') || key.includes('บริการประชาชน') || (key.includes('sko.moph.go.th') && !key.includes('research'))) {
      matched = biaEvidentItems.find(it => {
        const n = (it.asset_name || '').toLowerCase()
        return n.includes('sko.moph.go.th') && !n.includes('research')
      })
    } else if (key.includes('zyxel') || key.includes('โครงสร้างพื้นฐาน')) {
      matched = biaEvidentItems.find(it => (it.asset_name || '').toLowerCase().includes('zyxel'))
    } else if (key.includes('fortigate') || key.includes('ความมั่นคงไซเบอร์')) {
      matched = biaEvidentItems.find(it => (it.asset_name || '').toLowerCase().includes('fortigate'))
    }

    if (!matched) return row

    return {
      ...row,
      financialImpact: Number(matched.financial_impact) !== undefined ? Number(matched.financial_impact) : row.financialImpact,
      reputationImpact: matched.reputational_impact || row.reputationImpact,
      legalImpact: matched.law_regulatory_impact || row.legalImpact,
      mtpd: matched.mtpd || row.mtpd,
      rto: matched.rto || row.rto,
      rpo: matched.rpo || row.rpo
    }
  })

  return updatedRows
}

