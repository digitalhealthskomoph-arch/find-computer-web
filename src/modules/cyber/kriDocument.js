import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import { showNotification } from '../../lib/utils.js'

export const FISCAL_MONTHS = [
  { key: 'oct', label: 'ตุลาคม', short: 'ต.ค.', order: 1 },
  { key: 'nov', label: 'พฤศจิกายน', short: 'พ.ย.', order: 2 },
  { key: 'dec', label: 'ธันวาคม', short: 'ธ.ค.', order: 3 },
  { key: 'jan', label: 'มกราคม', short: 'ม.ค.', order: 4 },
  { key: 'feb', label: 'กุมภาพันธ์', short: 'ก.พ.', order: 5 },
  { key: 'mar', label: 'มีนาคม', short: 'มี.ค.', order: 6 },
  { key: 'apr', label: 'เมษายน', short: 'เม.ย.', order: 7 },
  { key: 'may', label: 'พฤษภาคม', short: 'พ.ค.', order: 8 },
  { key: 'jun', label: 'มิถุนายน', short: 'มิ.ย.', order: 9 },
  { key: 'jul', label: 'กรกฎาคม', short: 'ก.ค.', order: 10 },
  { key: 'aug', label: 'สิงหาคม', short: 'ส.ค.', order: 11 },
  { key: 'sep', label: 'กันยายน', short: 'ก.ย.', order: 12 }
]

export const CALENDAR_MONTHS = [
  { key: 'jan', label: 'มกราคม', short: 'ม.ค.', order: 1 },
  { key: 'feb', label: 'กุมภาพันธ์', short: 'ก.พ.', order: 2 },
  { key: 'mar', label: 'มีนาคม', short: 'มี.ค.', order: 3 },
  { key: 'apr', label: 'เมษายน', short: 'เม.ย.', order: 4 },
  { key: 'may', label: 'พฤษภาคม', short: 'พ.ค.', order: 5 },
  { key: 'jun', label: 'มิถุนายน', short: 'มิ.ย.', order: 6 },
  { key: 'jul', label: 'กรกฎาคม', short: 'ก.ค.', order: 7 },
  { key: 'aug', label: 'สิงหาคม', short: 'ส.ค.', order: 8 },
  { key: 'sep', label: 'กันยายน', short: 'ก.ย.', order: 9 },
  { key: 'oct', label: 'ตุลาคม', short: 'ต.ค.', order: 10 },
  { key: 'nov', label: 'พฤศจิกายน', short: 'พ.ย.', order: 11 },
  { key: 'dec', label: 'ธันวาคม', short: 'ธ.ค.', order: 12 }
]

export const DEFAULT_KRI_DOCUMENT_DATA = {
  metadata: {
    agencyName: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    docTitle: 'ดัชนีชี้วัดความเสี่ยงที่สำคัญ (KRI - Key Risk Indicator)',
    presenter: 'นายธนกฤต นิธิตันติปัญญา',
    approver: 'นายอิทธิพล อุดตมะปัญญา',
    effectiveText: 'ตามปีงบประมาณ 2569'
  },
  items: [
    {
      id: 1,
      no: '1',
      name: 'จำนวนเหตุการณ์การโจมตีที่สำเร็จ',
      method: 'นับจำนวนเหตุการณ์ที่เกิดขึ้นจริงและได้รับการยืนยันในระบบ',
      criteria: '0 ครั้งต่อเดือน',
      owner: 'กลุ่มงาน ICT / ทีม CSIRT',
      condition: 'eq_0',
      months: { jan: '0', feb: '0', mar: '0', dec: '0' }
    },
    {
      id: 2,
      no: '2',
      name: 'ระยะเวลาตอบสนองต่อเหตุการณ์',
      method: 'วัดระยะเวลาตั้งแต่ได้รับแจ้งเหตุการณ์จนเริ่มดำเนินการตอบสนอง',
      criteria: 'น้อยกว่า 30 นาที',
      owner: 'กลุ่มงาน ICT / ทีม CSIRT',
      condition: 'lt_30',
      months: { jan: '0' }
    },
    {
      id: 3,
      no: '3',
      name: 'เปอร์เซ็นต์ของการอัปเดตแพตช์ความปลอดภัย',
      method: 'คำนวณเปอร์เซ็นต์ของระบบทั้งหมดที่อัปเดตแพตช์ล่าสุดภายในระยะเวลาที่กำหนด',
      criteria: 'มากกว่า 95%',
      owner: 'ผู้ดูแลระบบเซิร์ฟเวอร์',
      condition: 'gte_95',
      months: { jan: '98' }
    },
    {
      id: 4,
      no: '4',
      name: 'จำนวนเหตุการณ์ความปลอดภัยที่พนักงานรายงาน',
      method: 'นับจำนวนรายงานเหตุการณ์ที่พนักงานแจ้งผ่านช่องทางที่กำหนด',
      criteria: 'อย่างน้อย 5 รายงานต่อเดือน',
      owner: 'เจ้าหน้าที่ความปลอดภัยไซเบอร์',
      condition: 'gte_5',
      months: {}
    },
    {
      id: 5,
      no: '5',
      name: 'จำนวนบัญชีผู้ใช้ที่ไม่ได้ใช้งานแต่ยังเปิดอยู่',
      method: 'ตรวจสอบรายชื่อบัญชีผู้ใช้และสถานะการใช้งานจากระบบ Directory หรือ IAM',
      criteria: '0 บัญชีที่ไม่ใช้งานเกิน 30 วัน',
      owner: 'ผู้ดูแลระบบ Directory / IAM',
      condition: 'eq_0',
      months: {}
    },
    {
      id: 6,
      no: '6',
      name: 'จำนวนเหตุการณ์ข้อมูลรั่วไหล',
      method: 'นับจำนวนเหตุการณ์ข้อมูลรั่วไหลที่ได้รับรายงานหรือยืนยันโดยทีมงาน',
      criteria: '0 ครั้งต่อเดือน',
      owner: 'DPO / เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล',
      condition: 'eq_0',
      months: {}
    },
    {
      id: 7,
      no: '7',
      name: 'เปอร์เซ็นต์ของพนักงานที่ผ่านการฝึกอบรมด้านความมั่นคงปลอดภัยไซเบอร์',
      method: 'คำนวณเปอร์เซ็นต์ของพนักงานทั้งหมดที่ผ่านการฝึกอบรมในรอบปี',
      criteria: 'มากกว่า 90% ต่อปี',
      owner: 'กลุ่มงานทรัพยากรบุคคล / ICT',
      condition: 'gte_90',
      months: {}
    },
    {
      id: 8,
      no: '8',
      name: 'ระยะเวลาที่ใช้ในการกู้คืนระบบหลังเหตุการณ์',
      method: 'วัดระยะเวลาตั้งแต่ระบบล่มจนกลับมาใช้งานได้เต็มรูปแบบ',
      criteria: 'ภายใน 4 ชั่วโมง',
      owner: 'ทีมกู้คืนระบบ (Disaster Recovery Team)',
      condition: 'lte_4',
      months: {}
    },
    {
      id: 9,
      no: '9',
      name: 'จำนวนช่องโหว่ที่ตรวจพบในการตรวจสอบความปลอดภัย',
      method: 'นับจำนวนช่องโหว่ที่ถูกค้นพบระหว่างการตรวจสอบความปลอดภัยในแต่ละไตรมาส',
      criteria: 'น้อยกว่า 5 ช่องโหว่ต่อไตรมาส',
      owner: 'ทีมประเมินช่องโหว่ (VA Team)',
      condition: 'lt_5',
      months: {}
    },
    {
      id: 10,
      no: '10',
      name: 'จำนวนการหยุดชะงักของระบบเนื่องจากเหตุการณ์ไซเบอร์',
      method: 'นับจำนวนครั้งที่ระบบหยุดทำงานจากเหตุการณ์ด้านความมั่นคงปลอดภัย',
      criteria: 'น้อยกว่า 1 ครั้งต่อเดือน',
      owner: 'ผู้ดูแลระบบแม่ข่ายและเครือข่าย',
      condition: 'lt_1',
      months: {}
    },
    {
      id: 11,
      no: '12',
      name: 'จำนวนการเข้าถึงบัญชีผู้ใช้โดยไม่ได้รับอนุญาต',
      method: 'ตรวจสอบการเข้าถึงบัญชีที่ไม่มีสิทธิ์ผ่านระบบ Audit หรือ Log Monitoring',
      criteria: '0 ครั้งต่อเดือน',
      owner: 'ทีมเฝ้าระวังความปลอดภัย (SOC/Log)',
      condition: 'eq_0',
      months: {}
    },
    {
      id: 12,
      no: '14',
      name: 'จำนวนการใช้งานบัญชีผู้ใช้ที่มีสิทธิพิเศษโดยไม่ได้รับอนุญาต',
      method: 'ตรวจสอบจาก Log การใช้งานบัญชีที่มีสิทธิพิเศษโดยไม่ได้รับอนุญาต',
      criteria: '0 ครั้งต่อเดือน',
      owner: 'ผู้ดูแลระบบสารสนเทศ (Admin)',
      condition: 'eq_0',
      months: {}
    },
    {
      id: 13,
      no: '15',
      name: 'เปอร์เซ็นต์ของข้อมูลสำรองที่ผ่านการตรวจสอบ',
      method: 'คำนวณเปอร์เซ็นต์ของการสำรองข้อมูลที่ผ่านการทดสอบกู้คืนสำเร็จ',
      criteria: 'มากกว่า 99%',
      owner: 'ผู้ดูแลระบบสำรองข้อมูล (Backup Admin)',
      condition: 'gte_99',
      months: {}
    },
    {
      id: 14,
      no: '17',
      name: 'จำนวนเหตุการณ์ความปลอดภัยที่เกิดจากพนักงาน',
      method: 'นับจำนวนเหตุการณ์ที่พนักงานละเมิดนโยบายด้านความมั่นคงปลอดภัย',
      criteria: 'น้อยกว่า 1 ครั้งต่อไตรมาส',
      owner: 'คณะทำงานความมั่นคงปลอดภัยไซเบอร์',
      condition: 'lt_1',
      months: {}
    },
    {
      id: 15,
      no: '18',
      name: 'จำนวนการขอเข้าถึงระบบโดยผู้ให้บริการภายนอก',
      method: 'นับจำนวนคำขอเข้าระบบจากผู้ให้บริการภายนอกที่ได้รับการอนุมัติ',
      criteria: 'น้อยกว่า 5 ครั้งต่อเดือน',
      owner: 'ผู้ดูแลระบบและควบคุมผู้ให้บริการภายนอก',
      condition: 'lt_5',
      months: {}
    }
  ]
}

// Evaluate individual KRI month value against threshold
export function evaluateKriThreshold(kriItem, rawValue) {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return { status: 'empty', label: 'ยังไม่บันทึก' }
  }

  const val = parseFloat(String(rawValue).trim().replace(/,/g, ''))
  if (isNaN(val)) {
    return { status: 'empty', label: 'ยังไม่บันทึก' }
  }

  const cond = kriItem.condition || ''
  let isPass = true

  if (cond === 'eq_0') {
    isPass = (val === 0)
  } else if (cond === 'lt_30') {
    isPass = (val < 30)
  } else if (cond === 'gte_95') {
    isPass = (val >= 95)
  } else if (cond === 'gte_5') {
    isPass = (val >= 5)
  } else if (cond === 'gte_90') {
    isPass = (val >= 90)
  } else if (cond === 'lte_4') {
    isPass = (val <= 4)
  } else if (cond === 'lt_5') {
    isPass = (val < 5)
  } else if (cond === 'lt_1') {
    isPass = (val < 1)
  } else if (cond === 'gte_99') {
    isPass = (val >= 99)
  } else {
    // Dynamic fallback based on criteria text
    const text = kriItem.criteria || ''
    if (text.includes('0') && (text.includes('ครั้ง') || text.includes('บัญชี'))) {
      isPass = (val === 0)
    } else if (text.includes('มากกว่า') || text.includes('อย่างน้อย') || text.includes('>=')) {
      const match = text.match(/\d+(\.\d+)?/)
      const target = match ? parseFloat(match[0]) : 0
      isPass = (val >= target)
    } else if (text.includes('น้อยกว่า') || text.includes('ภายใน') || text.includes('<=')) {
      const match = text.match(/\d+(\.\d+)?/)
      const target = match ? parseFloat(match[0]) : 0
      isPass = (val <= target)
    }
  }

  return {
    status: isPass ? 'pass' : 'fail',
    isPass,
    label: isPass ? 'อยู่ในเกณฑ์ปกติ' : 'เกินเกณฑ์ยอมรับได้ (เสี่ยง)'
  }
}

// Calculate summary metrics across all KRI items and months
export function calculateKriMetrics(items = [], monthsList = FISCAL_MONTHS) {
  let totalEntries = 0
  let passEntries = 0
  let failEntries = 0

  let itemsAllPass = 0
  let itemsHasFail = 0
  let itemsPending = 0

  items.forEach(it => {
    let itemHasFail = false
    let itemHasEntry = false

    monthsList.forEach(m => {
      const val = it.months?.[m.key]
      const evalRes = evaluateKriThreshold(it, val)
      if (evalRes.status !== 'empty') {
        totalEntries++
        itemHasEntry = true
        if (evalRes.isPass) {
          passEntries++
        } else {
          failEntries++
          itemHasFail = true
        }
      }
    })

    if (!itemHasEntry) {
      itemsPending++
    } else if (itemHasFail) {
      itemsHasFail++
    } else {
      itemsAllPass++
    }
  })

  return {
    totalItems: items.length,
    totalEntries,
    passEntries,
    failEntries,
    itemsAllPass,
    itemsHasFail,
    itemsPending,
    passRate: totalEntries > 0 ? ((passEntries / totalEntries) * 100).toFixed(1) : '100.0'
  }
}

// Inject print styles for A4 landscape
export function ensureKriPrintStyles() {
  let style = document.getElementById('kri-print-style')
  if (!style) {
    style = document.createElement('style')
    style.id = 'kri-print-style'
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #kri-print-area, #kri-print-area * {
          visibility: visible;
        }
        #kri-print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 8mm 10mm !important;
          box-shadow: none !important;
          border: none !important;
          background: #fff !important;
        }
        .no-print {
          display: none !important;
        }
        .kri-field-input {
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          outline: none !important;
          color: #000 !important;
          resize: none !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
        }
        .table-kri-report {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 10px 0 !important;
          font-size: 11px !important;
        }
        .table-kri-report th, .table-kri-report td {
          border: 1px solid #1e293b !important;
          padding: 4px 6px !important;
          color: #000 !important;
          page-break-inside: avoid !important;
        }
        .table-kri-report th {
          background-color: #f1f5f9 !important;
          font-weight: 700 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .kri-cell-pass {
          background-color: #dcfce7 !important;
          color: #15803d !important;
          font-weight: 700 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .kri-cell-fail {
          background-color: #fee2e2 !important;
          color: #b91c1c !important;
          font-weight: 700 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @page {
          size: landscape;
          margin: 10mm 10mm 10mm 10mm;
        }
      }
    `
    document.head.appendChild(style)
  }
}

// Render HTML
export function renderKriDocumentHtml(kriData, viewMode = 'fiscal', currentYear = '2569', yearsList = ['2569']) {
  ensureKriPrintStyles()
  const data = kriData || DEFAULT_KRI_DOCUMENT_DATA
  const meta = data.metadata || DEFAULT_KRI_DOCUMENT_DATA.metadata
  const items = data.items || []
  const monthsList = viewMode === 'fiscal' ? FISCAL_MONTHS : CALENDAR_MONTHS
  const metrics = calculateKriMetrics(items, monthsList)

  return `
    <div style="background:#f8fafc; min-height:100%; padding:20px 10px;">
      
      <!-- Top Action Toolbar (no-print) -->
      <div class="no-print" style="max-width:1280px; margin:0 auto 20px auto; background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:14px 20px; box-shadow:0 2px 8px rgba(0,0,0,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        
        <!-- Left: Fiscal Year selector & Mode switcher -->
        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <label style="font-weight:700; font-size:13.5px; color:#1e293b; display:flex; align-items:center; gap:6px; margin:0;">
            <span>📅 ปีงบประมาณ:</span>
            <select id="kri-year-select" style="font-weight:700; color:#1e40af; border:1px solid #93c5fd; padding:6px 12px; border-radius:6px; background:#eff6ff; font-size:13px; cursor:pointer;">
              ${yearsList.map(y => `<option value="${y}" ${y === currentYear ? 'selected' : ''}>พ.ศ. ${y}</option>`).join('')}
            </select>
          </label>

          <button id="add-kri-year-btn" class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#2563eb; padding:5px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer;">
            + เพิ่มปีงบประมาณ
          </button>

          <!-- Switcher: Fiscal Months vs Calendar Months -->
          <div style="display:inline-flex; background:#e2e8f0; padding:3px; border-radius:7px; gap:2px;">
            <button id="kri-mode-fiscal-btn" class="btn" style="padding:4px 10px; font-size:12px; font-weight:600; border-radius:5px; border:none; cursor:pointer; ${viewMode === 'fiscal' ? 'background:#2563eb; color:#fff; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'background:transparent; color:#475569;'}">
              📅 ปีงบประมาณ (ต.ค. - ก.ย.)
            </button>
            <button id="kri-mode-calendar-btn" class="btn" style="padding:4px 10px; font-size:12px; font-weight:600; border-radius:5px; border:none; cursor:pointer; ${viewMode === 'calendar' ? 'background:#2563eb; color:#fff; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'background:transparent; color:#475569;'}">
              🗓️ ปีปฏิทิน (ม.ค. - ธ.ค.)
            </button>
          </div>

          <span style="display:inline-flex; align-items:center; gap:4px; font-size:11.5px; color:#16a34a; background:#f0fdf4; padding:4px 9px; border-radius:4px; border:1px solid #bbf7d0;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            บันทึกอัตโนมัติ
          </span>
        </div>

        <!-- Right: Actions -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button id="add-kri-item-btn" class="btn" style="background:#16a34a; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 1px 2px rgba(22,163,74,0.2);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + เพิ่มตัวชี้วัด KRI
          </button>

          <button id="export-kri-csv-btn" class="btn" style="background:#0284c7; color:#fff; border:none; padding:7px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ส่งออก Excel (.csv)
          </button>

          <button id="export-kri-word-btn" class="btn" style="background:#1d4ed8; color:#fff; border:none; padding:7px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            ส่งออก Word (.doc)
          </button>

          <button id="print-kri-btn" class="btn" style="background:#0f172a; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            พิมพ์รายงาน / PDF
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards (no-print) -->
      <div class="no-print" style="max-width:1280px; margin:0 auto 20px auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:16px 20px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; align-items:center; gap:14px;">
          <div style="width:44px; height:44px; border-radius:10px; background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
            📊
          </div>
          <div>
            <div style="font-size:12px; color:#64748b; font-weight:600;">ตัวชี้วัด KRI ทั้งหมด</div>
            <div style="font-size:22px; font-weight:800; color:#0f172a; line-height:1.2;">
              ${metrics.totalItems} <span style="font-size:13px; font-weight:500; color:#64748b;">ข้อ</span>
            </div>
          </div>
        </div>

        <div style="background:#fff; border:1px solid #bbf7d0; border-radius:10px; padding:16px 20px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; align-items:center; gap:14px;">
          <div style="width:44px; height:44px; border-radius:10px; background:#f0fdf4; color:#16a34a; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
            🟢
          </div>
          <div>
            <div style="font-size:12px; color:#16a34a; font-weight:600;">ผ่านเกณฑ์ยอมรับได้</div>
            <div style="font-size:22px; font-weight:800; color:#15803d; line-height:1.2;">
              ${metrics.passEntries} <span style="font-size:13px; font-weight:500; color:#16a34a;">ครั้ง (${metrics.passRate}%)</span>
            </div>
          </div>
        </div>

        <div style="background:#fff; border:1px solid #fecaca; border-radius:10px; padding:16px 20px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; align-items:center; gap:14px;">
          <div style="width:44px; height:44px; border-radius:10px; background:#fef2f2; color:#dc2626; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
            🔴
          </div>
          <div>
            <div style="font-size:12px; color:#dc2626; font-weight:600;">เกินเกณฑ์ / มีความเสี่ยง</div>
            <div style="font-size:22px; font-weight:800; color:#b91c1c; line-height:1.2;">
              ${metrics.failEntries} <span style="font-size:13px; font-weight:500; color:#dc2626;">ครั้ง</span>
            </div>
          </div>
        </div>

        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:16px 20px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; align-items:center; gap:14px;">
          <div style="width:44px; height:44px; border-radius:10px; background:#f8fafc; color:#64748b; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
            📋
          </div>
          <div>
            <div style="font-size:12px; color:#64748b; font-weight:600;">ผลประเมินรายตัวชี้วัด</div>
            <div style="font-size:13px; font-weight:700; color:#1e293b; margin-top:2px;">
              ผ่านสมบูรณ์ <span style="color:#16a34a;">${metrics.itemsAllPass}</span> | เสี่ยง <span style="color:#dc2626;">${metrics.itemsHasFail}</span> | รอประเมิน <span style="color:#64748b;">${metrics.itemsPending}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Printable Document Sheet (A4 Landscape) -->
      <div id="kri-print-area" style="max-width:1280px; margin:0 auto; background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:30px 36px; box-shadow:0 4px 16px rgba(0,0,0,0.06); font-family:'Sarabun', 'TH Sarabun New', -apple-system, sans-serif; color:#1e293b;">
        
        <!-- Document Title Header with MOPH Logo -->
        <div style="text-align:center; margin-bottom:20px;">
          <img src="${LOGO_MOPH_BASE64}" alt="ตรากระทรวงสาธารณสุข" style="width:68px; height:68px; object-fit:contain; margin-bottom:8px; display:inline-block;" />
          
          <div style="margin-bottom:4px;">
            <input type="text" class="kri-field-input" data-field="agencyName" value="${meta.agencyName || ''}" placeholder="ชื่อหน่วยงาน" style="text-align:center; font-size:18px; font-weight:700; color:#0f172a; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:2px 8px;">
          </div>

          <div style="margin-bottom:12px;">
            <input type="text" class="kri-field-input" data-field="docTitle" value="${meta.docTitle || ''}" placeholder="ชื่อเอกสาร KRI" style="text-align:center; font-size:20px; font-weight:800; color:#1e3a8a; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px;">
          </div>

          <!-- Metadata Box (ผู้นำเสนอ, ผู้อนุมัติ, มีผลบังคับใช้) -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 18px; text-align:left; font-size:13.5px; max-width:850px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:8px 16px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="color:#475569; width:80px; flex-shrink:0;">ผู้นำเสนอ :</strong>
              <input type="text" class="kri-field-input" data-field="presenter" value="${meta.presenter || ''}" placeholder="ชื่อผู้นำเสนอ" style="flex:1; border:1px dashed #cbd5e1; border-radius:4px; padding:2px 6px;">
            </div>

            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="color:#475569; width:80px; flex-shrink:0;">ผู้อนุมัติ :</strong>
              <input type="text" class="kri-field-input" data-field="approver" value="${meta.approver || ''}" placeholder="ชื่อผู้อนุมัติ" style="flex:1; border:1px dashed #cbd5e1; border-radius:4px; padding:2px 6px;">
            </div>

            <div style="display:flex; align-items:center; gap:6px; grid-column:1 / -1;">
              <strong style="color:#475569; width:110px; flex-shrink:0;">มีผลบังคับใช้ :</strong>
              <input type="text" class="kri-field-input" data-field="effectiveText" value="${meta.effectiveText || ''}" placeholder="เช่น ตามปีงบประมาณ 2569" style="flex:1; border:1px dashed #cbd5e1; border-radius:4px; padding:2px 6px;">
            </div>
          </div>
        </div>

        <!-- Hint Banner (no-print) -->
        <div class="no-print" style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:10px 16px; margin-bottom:14px; font-size:12.5px; color:#0369a1; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            💡 <strong>วิธีประเมินผล:</strong> กรอกค่าตัวเลขในช่องเดือน ระบบจะเปรียบเทียบกับเกณฑ์ที่ยอมรับได้อัตโนมัติ:
            <span style="color:#15803d; font-weight:700; margin-left:6px;">🟢 สีเขียว = ผ่านเกณฑ์</span> |
            <span style="color:#b91c1c; font-weight:700; margin-left:4px;">🔴 สีแดง = เกินเกณฑ์ (เสี่ยง)</span>
          </div>
          <div style="font-weight:600; color:#1e40af;">
            โหมดปัจจุบัน: ${viewMode === 'fiscal' ? 'ปีงบประมาณไทย (ต.ค. - ก.ย.)' : 'ปีปฏิทิน (ม.ค. - ธ.ค.)'}
          </div>
        </div>

        <!-- Main KRI Matrix Table -->
        <div style="overflow-x:auto;">
          <table class="table-kri-report" style="width:100%; border-collapse:collapse; font-size:12px; border:1px solid #cbd5e1; background:#fff;">
            <thead>
              <tr style="background:#f1f5f9; color:#0f172a; border-bottom:2px solid #cbd5e1; text-align:center;">
                <th style="width:36px; padding:8px 4px; border:1px solid #cbd5e1;">No.</th>
                <th style="width:190px; padding:8px 6px; border:1px solid #cbd5e1; text-align:left;">ดัชนีชี้วัดความเสี่ยงที่สำคัญ (KRI)</th>
                <th style="width:180px; padding:8px 6px; border:1px solid #cbd5e1; text-align:left;">วิธีการที่ใช้วัด</th>
                <th style="width:130px; padding:8px 6px; border:1px solid #cbd5e1; text-align:left;">เกณฑ์ที่ยอมรับได้</th>
                <th style="width:120px; padding:8px 6px; border:1px solid #cbd5e1; text-align:left;">ผู้รับผิดชอบ</th>
                ${monthsList.map(m => `
                  <th style="width:52px; padding:8px 2px; border:1px solid #cbd5e1;" title="${m.label}">
                    ${m.short}
                  </th>
                `).join('')}
                <th style="width:65px; padding:8px 4px; border:1px solid #cbd5e1;">สถานะรวม</th>
                <th class="no-print" style="width:38px; padding:8px 2px; border:1px solid #cbd5e1;">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${items.length === 0 ? `
                <tr>
                  <td colspan="19" style="text-align:center; padding:30px; color:#94a3b8; font-size:13px;">
                    ยังไม่มีตัวชี้วัด KRI ในปีงบประมาณนี้ สามารถกดปุ่ม <strong>+ เพิ่มตัวชี้วัด KRI</strong> ด้านบน
                  </td>
                </tr>
              ` : items.map((it, idx) => {
                // Calculate item months summary
                let itemPass = 0
                let itemFail = 0
                let itemEntries = 0
                monthsList.forEach(m => {
                  const ev = evaluateKriThreshold(it, it.months?.[m.key])
                  if (ev.status !== 'empty') {
                    itemEntries++
                    if (ev.isPass) itemPass++
                    else itemFail++
                  }
                })

                return `
                  <tr style="border-bottom:1px solid #e2e8f0; vertical-align:top;">
                    <!-- No -->
                    <td style="text-align:center; padding:6px 2px; border:1px solid #e2e8f0; font-weight:700;">
                      <input type="text" class="kri-item-input" data-id="${it.id}" data-field="no" value="${it.no || idx + 1}" style="width:100%; text-align:center; border:none; background:transparent; font-weight:700; font-size:12px;">
                    </td>

                    <!-- Name -->
                    <td style="padding:4px 6px; border:1px solid #e2e8f0;">
                      <textarea rows="2" class="kri-item-input" data-id="${it.id}" data-field="name" placeholder="ชื่อตัวชี้วัด" style="width:100%; font-size:11.5px; font-weight:600; color:#0f172a; border:1px dashed transparent; border-radius:4px; padding:2px 4px; resize:vertical;">${it.name || ''}</textarea>
                    </td>

                    <!-- Method -->
                    <td style="padding:4px 6px; border:1px solid #e2e8f0;">
                      <textarea rows="2" class="kri-item-input" data-id="${it.id}" data-field="method" placeholder="วิธีการวัด" style="width:100%; font-size:11px; color:#475569; border:1px dashed transparent; border-radius:4px; padding:2px 4px; resize:vertical;">${it.method || ''}</textarea>
                    </td>

                    <!-- Criteria -->
                    <td style="padding:4px 6px; border:1px solid #e2e8f0;">
                      <textarea rows="2" class="kri-item-input" data-id="${it.id}" data-field="criteria" placeholder="เกณฑ์ที่ยอมรับได้" style="width:100%; font-size:11px; font-weight:600; color:#b91c1c; border:1px dashed transparent; border-radius:4px; padding:2px 4px; resize:vertical;">${it.criteria || ''}</textarea>
                    </td>

                    <!-- Owner -->
                    <td style="padding:4px 6px; border:1px solid #e2e8f0;">
                      <input type="text" class="kri-item-input" data-id="${it.id}" data-field="owner" value="${it.owner || ''}" placeholder="ผู้รับผิดชอบ" style="width:100%; font-size:11px; color:#334155; border:1px dashed transparent; border-radius:4px; padding:2px 4px;">
                    </td>

                    <!-- 12 Months cells -->
                    ${monthsList.map(m => {
                      const val = it.months?.[m.key] !== undefined ? it.months[m.key] : ''
                      const ev = evaluateKriThreshold(it, val)
                      let cellClass = ''
                      let cellStyle = 'padding:3px 2px; text-align:center; border:1px solid #e2e8f0;'
                      let inputStyle = 'width:100%; text-align:center; font-size:12px; font-weight:700; border:none; border-radius:3px; padding:4px 0;'

                      if (ev.status === 'pass') {
                        cellClass = 'kri-cell-pass'
                        inputStyle += 'background:#dcfce7; color:#15803d;'
                      } else if (ev.status === 'fail') {
                        cellClass = 'kri-cell-fail'
                        inputStyle += 'background:#fee2e2; color:#b91c1c;'
                      } else {
                        inputStyle += 'background:transparent; color:#64748b;'
                      }

                      return `
                        <td class="${cellClass}" style="${cellStyle}">
                          <input type="text" class="kri-month-input" data-id="${it.id}" data-month="${m.key}" value="${val}" placeholder="-" title="${it.name} (${m.label}): ${val !== '' ? val : 'ยังไม่บันทึก'} [${ev.label}]" style="${inputStyle}">
                        </td>
                      `
                    }).join('')}

                    <!-- Overall status summary -->
                    <td style="text-align:center; padding:4px 2px; border:1px solid #e2e8f0; font-size:11px; vertical-align:middle;">
                      ${itemEntries === 0 ? `
                        <span style="color:#94a3b8;">-</span>
                      ` : itemFail === 0 ? `
                        <span style="display:inline-block; padding:2px 6px; border-radius:10px; background:#f0fdf4; color:#15803d; font-weight:700; border:1px solid #bbf7d0;">
                          ผ่าน (${itemPass})
                        </span>
                      ` : `
                        <span style="display:inline-block; padding:2px 6px; border-radius:10px; background:#fef2f2; color:#b91c1c; font-weight:700; border:1px solid #fecaca;">
                          เสี่ยง (${itemFail})
                        </span>
                      `}
                    </td>

                    <!-- Actions (no-print) -->
                    <td class="no-print" style="text-align:center; padding:4px 2px; border:1px solid #e2e8f0; vertical-align:middle;">
                      <button class="delete-kri-item-btn" data-id="${it.id}" title="ลบตัวชี้วัดนี้" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:14px; padding:2px;">
                        🗑️
                      </button>
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Signature Block -->
        <div style="margin-top:35px; border-top:1px solid #e2e8f0; padding-top:25px;">
          <table style="width:100%; border:none;">
            <tr style="border:none;">
              <td style="border:none; width:50%; text-align:center; vertical-align:top;">
                <div style="font-weight:600; color:#475569; font-size:13.5px; margin-bottom:45px;">
                  ลงชื่อ ผู้นำเสนอ :
                </div>
                <div style="border-bottom:1px dotted #94a3b8; width:220px; margin:0 auto 8px auto;"></div>
                <div style="font-weight:700; font-size:14px; color:#0f172a;">
                  (${meta.presenter || 'นายธนกฤต นิธิตันติปัญญา'})
                </div>
                <div style="color:#64748b; font-size:12.5px; margin-top:2px;">
                  ผู้จัดทำ / คณะทำงานความมั่นคงปลอดภัยไซเบอร์
                </div>
              </td>

              <td style="border:none; width:50%; text-align:center; vertical-align:top;">
                <div style="font-weight:600; color:#475569; font-size:13.5px; margin-bottom:45px;">
                  ลงชื่อ ผู้อนุมัติ :
                </div>
                <div style="border-bottom:1px dotted #94a3b8; width:220px; margin:0 auto 8px auto;"></div>
                <div style="font-weight:700; font-size:14px; color:#0f172a;">
                  (${meta.approver || 'นายแพทย์อิทธิพล อุดตมะปัญญา'})
                </div>
                <div style="color:#64748b; font-size:12.5px; margin-top:2px;">
                  ตำแหน่ง นายแพทย์เชี่ยวชาญ (CISO)
                </div>
              </td>
            </tr>
          </table>
        </div>

      </div>
    </div>
  `
}

// Export Word (.doc)
export function exportKriToWord(kriData, viewMode = 'fiscal') {
  const data = kriData || DEFAULT_KRI_DOCUMENT_DATA
  const meta = data.metadata || DEFAULT_KRI_DOCUMENT_DATA.metadata
  const items = data.items || []
  const monthsList = viewMode === 'fiscal' ? FISCAL_MONTHS : CALENDAR_MONTHS

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${meta.docTitle || 'Key Risk Indicators (KRI)'}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 29.7cm 21.0cm; /* A4 Landscape */
          margin: 1.5cm 1.5cm 1.5cm 1.5cm;
          mso-page-orientation: landscape;
        }
        body {
          font-family: 'TH Sarabun New', 'Sarabun', 'Angsana New', sans-serif;
          font-size: 14pt;
          line-height: 1.2;
          color: #000;
        }
        h1 {
          font-size: 18pt;
          font-weight: bold;
          text-align: center;
          margin: 4pt 0 4pt 0;
        }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 8pt 0;
        }
        th, td {
          border: 1pt solid #000;
          padding: 4pt 5pt;
          vertical-align: top;
          font-size: 12pt;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-align: center;
        }
        .header-logo {
          text-align: center;
          margin-bottom: 6pt;
        }
        .header-meta {
          margin: 6pt 0 10pt 0;
          font-size: 13pt;
        }
        .pass-cell {
          background-color: #dcfce7;
          color: #15803d;
          font-weight: bold;
          text-align: center;
        }
        .fail-cell {
          background-color: #fee2e2;
          color: #b91c1c;
          font-weight: bold;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header-logo">
        <img src="${LOGO_MOPH_BASE64}" width="65" height="65" alt="ตรากระทรวงสาธารณสุข" />
      </div>

      <div class="text-center bold" style="font-size:16pt;">
        ${meta.agencyName || 'สำนักงานสาธารณสุขจังหวัดสระแก้ว'}
      </div>

      <h1>${meta.docTitle || 'ดัชนีชี้วัดความเสี่ยงที่สำคัญ (KRI - Key Risk Indicator)'}</h1>

      <div class="header-meta">
        <table style="border:none; width:100%;">
          <tr style="border:none;">
            <td style="border:none; width:33%;"><span class="bold">ผู้นำเสนอ :</span> ${meta.presenter || ''}</td>
            <td style="border:none; width:33%;"><span class="bold">ผู้อนุมัติ :</span> ${meta.approver || ''}</td>
            <td style="border:none; width:34%;"><span class="bold">มีผลบังคับใช้ :</span> ${meta.effectiveText || ''}</td>
          </tr>
        </table>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:25pt;">No.</th>
            <th style="width:130pt;">ดัชนีชี้วัดความเสี่ยงที่สำคัญ</th>
            <th style="width:130pt;">วิธีการที่ใช้วัด</th>
            <th style="width:100pt;">เกณฑ์ที่ยอมรับได้</th>
            <th style="width:85pt;">ผู้รับผิดชอบ</th>
            ${monthsList.map(m => `
              <th style="width:36pt;">${m.short}</th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${items.map(it => `
            <tr>
              <td class="text-center bold">${it.no || ''}</td>
              <td class="bold">${it.name || ''}</td>
              <td>${it.method || ''}</td>
              <td>${it.criteria || ''}</td>
              <td>${it.owner || ''}</td>
              ${monthsList.map(m => {
                const val = it.months?.[m.key] !== undefined ? it.months[m.key] : ''
                const ev = evaluateKriThreshold(it, val)
                let cls = 'text-center'
                if (ev.status === 'pass') cls = 'pass-cell'
                else if (ev.status === 'fail') cls = 'fail-cell'
                return `<td class="${cls}">${val}</td>`
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <table style="border:none; margin-top:35pt; width:100%;">
        <tr style="border:none;">
          <td style="border:none; width:50%; text-align:center;">
            <p>ลงชื่อ ผู้นำเสนอ : &nbsp;&nbsp;&nbsp;&nbsp; ${meta.presenter || ''}</p>
            <p style="font-size:12pt; color:#444;">ผู้จัดทำ / คณะทำงานความมั่นคงปลอดภัยไซเบอร์</p>
          </td>
          <td style="border:none; width:50%; text-align:center;">
            <p>ลงชื่อ ผู้อนุมัติ : &nbsp;&nbsp;&nbsp;&nbsp; ${meta.approver || ''}</p>
            <p style="font-size:12pt; color:#444;">ตำแหน่ง นายแพทย์เชี่ยวชาญ (CISO)</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const safeAgency = (meta.agencyName || 'สสจ_สระแก้ว').replace(/[\s\/\:*?"<>|]/g, '_')
  a.href = url
  a.download = `KRI_Document_${safeAgency}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showNotification('ส่งออกไฟล์ Word (.doc) สำเร็จเรียบร้อยแล้ว', 'success')
}

// Export CSV (.csv with UTF-8 BOM)
export function exportKriToCsv(kriData, viewMode = 'fiscal') {
  const data = kriData || DEFAULT_KRI_DOCUMENT_DATA
  const meta = data.metadata || DEFAULT_KRI_DOCUMENT_DATA.metadata
  const items = data.items || []
  const monthsList = viewMode === 'fiscal' ? FISCAL_MONTHS : CALENDAR_MONTHS

  const headers = [
    'No.',
    'ดัชนีชี้วัดความเสี่ยงที่สำคัญ (KRI)',
    'วิธีการที่ใช้วัด',
    'เกณฑ์ที่ยอมรับได้',
    'ผู้รับผิดชอบ',
    ...monthsList.map(m => m.label)
  ]

  const rows = items.map(it => [
    `"${it.no || ''}"`,
    `"${(it.name || '').replace(/"/g, '""')}"`,
    `"${(it.method || '').replace(/"/g, '""')}"`,
    `"${(it.criteria || '').replace(/"/g, '""')}"`,
    `"${(it.owner || '').replace(/"/g, '""')}"`,
    ...monthsList.map(m => `"${it.months?.[m.key] !== undefined ? it.months[m.key] : ''}"`)
  ])

  const csvContent = '\uFEFF' + [
    `"รายงานดัชนีชี้วัดความเสี่ยงที่สำคัญ (KRI)"`,
    `"หน่วยงาน: ${meta.agencyName || ''} | ผู้นำเสนอ: ${meta.presenter || ''} | ผู้อนุมัติ: ${meta.approver || ''} | ${meta.effectiveText || ''}"`,
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `KRI_Document_${meta.agencyName || 'สสจ_สระแก้ว'}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showNotification('ส่งออกไฟล์ CSV สำเร็จเรียบร้อยแล้ว', 'success')
}

// Bind events
export function bindKriDocumentEvents(containerEl, currentKriData, onUpdate) {
  // 1. Year select
  document.getElementById('kri-year-select')?.addEventListener('change', (e) => {
    onUpdate({ type: 'change_year', year: e.target.value })
  })

  // 2. Add year
  document.getElementById('add-kri-year-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'add_year' })
  })

  // 3. Switch mode: Fiscal vs Calendar
  document.getElementById('kri-mode-fiscal-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'change_view_mode', mode: 'fiscal' })
  })

  document.getElementById('kri-mode-calendar-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'change_view_mode', mode: 'calendar' })
  })

  // 4. Export CSV
  document.getElementById('export-kri-csv-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'export_csv' })
  })

  // 5. Export Word
  document.getElementById('export-kri-word-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'export_word' })
  })

  // 6. Print
  document.getElementById('print-kri-btn')?.addEventListener('click', () => {
    window.print()
  })

  // 7. Add KRI Item
  document.getElementById('add-kri-item-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'add_item' })
  })

  // 8. Metadata fields change
  containerEl.querySelectorAll('.kri-field-input').forEach(input => {
    input.addEventListener('change', (e) => {
      onUpdate({
        type: 'update_meta',
        field: e.target.dataset.field,
        value: e.target.value
      })
    })
  })

  // 9. Item inputs change
  containerEl.querySelectorAll('.kri-item-input').forEach(input => {
    input.addEventListener('change', (e) => {
      onUpdate({
        type: 'update_item',
        id: Number(e.target.dataset.id),
        field: e.target.dataset.field,
        value: e.target.value
      })
    })
  })

  // 10. Month cells change
  containerEl.querySelectorAll('.kri-month-input').forEach(input => {
    input.addEventListener('change', (e) => {
      onUpdate({
        type: 'update_month',
        id: Number(e.target.dataset.id),
        month: e.target.dataset.month,
        value: e.target.value
      })
    })
  })

  // 11. Delete KRI Item
  containerEl.querySelectorAll('.delete-kri-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.dataset.id)
      if (confirm('คุณต้องการลบตัวชี้วัด KRI นี้ใช่หรือไม่?')) {
        onUpdate({ type: 'delete_item', id })
      }
    })
  })
}
