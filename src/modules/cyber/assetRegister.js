import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import { showNotification } from '../../lib/utils.js'

export const ASSET_REGISTER_CLUSTERS = [
  { group: 'Hardware', type: 'HW-Switch' },
  { group: 'Hardware', type: 'HW-Servers' },
  { group: 'Hardware', type: 'HW-WIFI' },
  { group: 'Hardware', type: 'HW-Router/Firewall' },
  { group: 'Hardware', type: 'HW-Others' },
  { group: 'Software & Applications', type: 'Application-Major' },
  { group: 'Software & Applications', type: 'Application-Minor' },
  { group: 'Software & Applications', type: 'SW-Windows' },
  { group: 'Software & Applications', type: 'SW-Others' }
]

export const DEFAULT_ASSET_REGISTER_METADATA = {
  docTitle: 'ทะเบียนทรัพย์สินของบริการที่สำคัญของหน่วยงาน (Asset Register)',
  agencyName: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  recorder: 'นายธนกฤต นิธิตันติปัญญา, สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  recordDate: '2026-02-25',
  location: 'Data Center, กลุ่มงานสุขภาพดิจิทัล',
  address: '609 สำนักงานสาธารณสุขจังหวัดสระแก้ว ต.ท่าเกษม อ.เมืองสระแก้ว จ.สระแก้ว 27000',
  mainSystem: 'All application as HIS'
}

export const DEFAULT_ASSET_REGISTER_ITEMS = [
  {
    id: 1,
    no: 1,
    assetType: 'Application-Major',
    name: 'Pay Slip',
    description: 'Web Application ออกใบสลิปเงินเดือน',
    concernedApp: 'ระบบเงินเดือน',
    criticalFunction: 'รองรับการบันทึกข้อมูลเงินเดือนของบุคลากรจากงานการเงิน และออกใบสลิปเงินเดือนแบบออนไลน์ให้กับบุคลากรภายในสำนักงานสาธารณสุขจังหวัดสระแก้ว',
    criticality: 'สูง',
    owner: 'งานการเงิน',
    location: 'Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1 อาคาร สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    connectedAsset: 'ระบบไฟฟ้า เครื่องแม่ข่ายให้ (Server) บริการฐานข้อมูล'
  },
  {
    id: 2,
    no: 2,
    assetType: 'Application-Major',
    name: 'Plan-D',
    description: 'ระบบสารบรรณ สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    concernedApp: 'Web App ระบบสารบรรณสำนักงานสาธารณสุขจังหวัดสระแก้ว',
    criticalFunction: 'ระบบงานด้านสารบรรณแบะ Back Office อื่นๆ รองรับการบริหารจัดการข้อมูล การบันทึกข้อมูล',
    criticality: 'สูง',
    owner: 'กลุ่มงานสุขภาพดิจิทัล',
    location: 'Google Cloud',
    connectedAsset: 'Google Cloud'
  },
  {
    id: 3,
    no: 3,
    assetType: 'Application-Minor',
    name: 'WebEx',
    description: 'ระบบประชุมออนไลน์ Online Conference',
    concernedApp: 'Software บริหารจัดการการประชุมออนไลน์',
    criticalFunction: 'บริหารจัดการ สร้างลิงค์ประชุม การประชุมผ่านรับบออนไลน์',
    criticality: 'กลาง',
    owner: 'กลุ่มงานสุขภาพดิจิทัล',
    location: 'WebEx Cloud',
    connectedAsset: 'WebEx Cloud'
  },
  {
    id: 4,
    no: 4,
    assetType: 'Application-Minor',
    name: 'ระบบสารบรรณกระทรวง สธ.',
    description: 'รับส่งหนังสือออนไลน์จากสำนักงานปลัดกระทรวงสาธารณสุข',
    concernedApp: 'ระบบสารบรรณของ\nสป.สธ.',
    criticalFunction: 'สารบรรณ',
    criticality: 'กลาง',
    owner: 'กลุ่มงานสุขภาพดิจิทัล',
    location: 'Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1 อาคาร สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    connectedAsset: 'ระบบไฟฟ้า เครื่องแม่ข่ายให้ (Server) บริการฐานข้อมูล'
  },
  {
    id: 5,
    no: 5,
    assetType: 'HW-Servers',
    name: 'Web : sko.moph.go.th/research',
    description: 'Web site ให้บริการเผยแพร่ผลงานวิชาการระดับจังหวัด',
    concernedApp: 'ระบบเผยแพร่ผลงานวิชาการ',
    criticalFunction: 'พื้นที่ให้บุคลากรภายในจังหวัดสระแก้วนำผลงานวิชาการมาประกาศเผยแพร่',
    criticality: 'ต่ำ',
    owner: 'กลุ่มงานสุขภาพดิจิทัล',
    location: 'Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1 อาคาร สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    connectedAsset: 'ระบบไฟฟ้า เครื่องแม่ข่ายให้ (Server) บริการฐานข้อมูล'
  },
  {
    id: 6,
    no: 6,
    assetType: 'HW-Servers',
    name: 'Web : sko.moph.go.th',
    description: 'Web Application ของสำนักงานสาธารณสุขจังหวัดสระแก้ว',
    concernedApp: 'Web site สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    criticalFunction: 'ให้บริการเว็บสำหรับให้ข้อมูลและประชาสัมพันธ์ ข้อมูลและการดำเนินงานต่างๆ ของสำนักงานสาธารณสุขจังหวัดสระแก้ว',
    criticality: 'สูง',
    owner: 'กลุ่มงานสุขภาพดิจิทัล',
    location: 'Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1 อาคาร สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    connectedAsset: 'ระบบไฟฟ้า เครื่องแม่ข่ายให้ (Server) บริการฐานข้อมูล'
  },
  {
    id: 7,
    no: 7,
    assetType: 'HW-Router/Firewall',
    name: 'zyxel router',
    description: 'บริการอินเตอร์เน็ต NT',
    concernedApp: 'เว็บสำนักงาน',
    criticalFunction: 'เชื่อมต่อ เครื่องข่าย Gnode ของกระทรวงสาธารณสุข',
    criticality: 'สูง',
    owner: 'กลุ่มงานสุขภาพดิจิทัล',
    location: 'Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1 อาคาร สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    connectedAsset: 'ระบบไฟฟ้า เครื่องแม่ข่ายให้ (Server) บริการฐานข้อมูล'
  },
  {
    id: 8,
    no: 8,
    assetType: 'HW-Router/Firewall',
    name: 'Fortigate 100F',
    description: 'ระบบป้องกันเครือข่ายภายใน',
    concernedApp: 'Firewall',
    criticalFunction: 'ระบบป้องกันภัยคุกคามเครือข่ายภายในของสำนักงานสาธารณสุขจังหวัดสระแก้ว',
    criticality: 'สูง',
    owner: 'กลุ่มงานสุขภาพดิจิทัล',
    location: 'Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1 อาคาร สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    connectedAsset: 'ระบบไฟฟ้า'
  },
  {
    id: 9,
    no: 9,
    assetType: 'HW-Others',
    name: 'Scan Face Hikvision',
    description: 'อุปกรณ์สแกนใบหน้าบันทึกและตรวจสอบเวลา เข้า-ออก การทำงาน',
    concernedApp: 'ระบบจัดการและประชาสัมพันธ์',
    criticalFunction: 'จัดเก็บข้อมูลใบหน้าบุคลากร',
    criticality: 'ต่ำ',
    owner: 'กลุ่มงานทรัพย์ยากรบุคคล',
    location: 'Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1 อาคาร สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    connectedAsset: 'ระบบไฟฟ้า'
  }
]

export const DEFAULT_ASSET_REGISTER_DATA = {
  metadata: { ...DEFAULT_ASSET_REGISTER_METADATA },
  items: JSON.parse(JSON.stringify(DEFAULT_ASSET_REGISTER_ITEMS))
}

export function formatThaiDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear() + (d.getFullYear() < 2500 ? 543 : 0)
    return `${day} ${month} ${year}`
  } catch (e) {
    return dateStr
  }
}

export function getCriticalityBadge(criticality = 'กลาง') {
  const crit = String(criticality).trim()
  if (crit === 'สูง') {
    return `<span style="display:inline-block; padding:3px 10px; border-radius:12px; font-size:11.5px; font-weight:700; background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;">สูง (High)</span>`
  }
  if (crit === 'ต่ำ') {
    return `<span style="display:inline-block; padding:3px 10px; border-radius:12px; font-size:11.5px; font-weight:700; background:#d1fae5; color:#047857; border:1px solid #6ee7b7;">ต่ำ (Low)</span>`
  }
  return `<span style="display:inline-block; padding:3px 10px; border-radius:12px; font-size:11.5px; font-weight:700; background:#fef3c7; color:#b45309; border:1px solid #fcd34d;">กลาง (Medium)</span>`
}

export function getTypeBadge(type = '') {
  const t = String(type).trim()
  const isHw = t.startsWith('HW-')
  let bg = '#eff6ff'
  let color = '#1d4ed8'
  let border = '#bfdbfe'
  let icon = '🖥️'

  if (!isHw) {
    bg = '#f5f3ff'
    color = '#6d28d9'
    border = '#ddd6fe'
    icon = '📱'
  }

  return `<span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:6px; font-size:11.5px; font-weight:600; background:${bg}; color:${color}; border:1px solid ${border}; white-space:nowrap;">
    <span>${icon}</span>
    <span>${t}</span>
  </span>`
}

export function calculateRegisterMetrics(items = []) {
  const total = items.length
  let highCrit = 0
  let medCrit = 0
  let lowCrit = 0
  let hwCount = 0
  let swCount = 0

  items.forEach(it => {
    const t = String(it.assetType || '').trim()
    if (t.startsWith('HW-')) hwCount++
    else swCount++

    const c = String(it.criticality || '').trim()
    if (c === 'สูง') highCrit++
    else if (c === 'ต่ำ') lowCrit++
    else medCrit++
  })

  return {
    total,
    highCrit,
    medCrit,
    lowCrit,
    hwCount,
    swCount
  }
}

export function renderAssetRegisterHtml(registerData, searchQuery = '', typeFilter = 'all', critFilter = 'all') {
  const meta = registerData?.metadata || DEFAULT_ASSET_REGISTER_METADATA
  const allItems = registerData?.items || []
  const metrics = calculateRegisterMetrics(allItems)

  let filteredItems = allItems

  // Filter by Type
  if (typeFilter && typeFilter !== 'all') {
    filteredItems = filteredItems.filter(it => it.assetType === typeFilter)
  }

  // Filter by Criticality
  if (critFilter && critFilter !== 'all') {
    filteredItems = filteredItems.filter(it => it.criticality === critFilter)
  }

  // Filter by search query
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim()
    filteredItems = filteredItems.filter(it => 
      (it.name || '').toLowerCase().includes(q) ||
      (it.assetType || '').toLowerCase().includes(q) ||
      (it.description || '').toLowerCase().includes(q) ||
      (it.concernedApp || '').toLowerCase().includes(q) ||
      (it.criticalFunction || '').toLowerCase().includes(q) ||
      (it.owner || '').toLowerCase().includes(q) ||
      (it.location || '').toLowerCase().includes(q) ||
      (it.connectedAsset || '').toLowerCase().includes(q)
    )
  }

  return `
    <div class="asset-register-container" style="background:#fff; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 1px 3px rgba(0,0,0,0.05); overflow:hidden;">
      
      <!-- 1. Header Card (Document Info & Metadata) -->
      <div style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#fff; padding:24px 28px; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
          <div style="display:flex; align-items:center; gap:16px;">
            <img src="${LOGO_MOPH_BASE64}" alt="MOPH Logo" style="width:58px; height:58px; object-fit:contain; background:#fff; padding:3px; border-radius:50%; box-shadow:0 2px 8px rgba(0,0,0,0.3);" />
            <div>
              <div style="font-size:12px; font-weight:700; color:#38bdf8; letter-spacing:0.8px; text-transform:uppercase; margin-bottom:2px;">
                CII &amp; CYBERSECURITY • 1.3 ASSET REGISTER
              </div>
              <h1 style="font-size:1.45rem; font-weight:800; margin:0 0 4px 0; color:#f8fafc; line-height:1.3;">
                ${meta.docTitle}
              </h1>
              <div style="font-size:13px; color:#94a3b8;">
                ทะเบียนทรัพย์สินของบริการที่สำคัญ — <span style="color:#e2e8f0; font-weight:600;">${meta.agencyName}</span>
              </div>
            </div>
          </div>
          
          <!-- Top Right Action Controls -->
          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <button type="button" id="btn-edit-reg-meta" class="btn" style="background:#334155; color:#f1f5f9; font-size:12px; font-weight:600; padding:6px 14px; border-radius:8px; border:1px solid #475569; display:flex; align-items:center; gap:6px; cursor:pointer;">
              ✏️ แก้ไขข้อมูลส่วนหัว
            </button>
            <button type="button" id="btn-export-reg-word" class="btn" style="background:#2563eb; color:#fff; font-size:12px; font-weight:600; padding:6px 14px; border-radius:8px; border:none; display:flex; align-items:center; gap:6px; cursor:pointer;">
              📄 ส่งออก Word (.doc)
            </button>
            <button type="button" id="btn-export-reg-csv" class="btn" style="background:#10b981; color:#fff; font-size:12px; font-weight:600; padding:6px 14px; border-radius:8px; border:none; display:flex; align-items:center; gap:6px; cursor:pointer;">
              📊 ส่งออก Excel (.xlsx/.csv)
            </button>
            <button type="button" id="btn-print-reg" class="btn" style="background:#475569; color:#fff; font-size:12px; font-weight:600; padding:6px 14px; border-radius:8px; border:none; display:flex; align-items:center; gap:6px; cursor:pointer;">
              🖨️ พิมพ์ / PDF (A4)
            </button>
          </div>
        </div>

        <!-- Metadata Summary Badges Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.12); font-size:12.5px;">
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="color:#38bdf8;">👤</span>
            <div>
              <span style="color:#94a3b8; display:block; font-size:11px;">ผู้บันทึก:</span>
              <span style="font-weight:600; color:#f1f5f9;">${meta.recorder}</span>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="color:#38bdf8;">📅</span>
            <div>
              <span style="color:#94a3b8; display:block; font-size:11px;">วันที่ทำการบันทึก:</span>
              <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                <input type="date" id="reg-header-date-input" value="${meta.recordDate || '2026-02-25'}" 
                  style="background:#0f172a; color:#38bdf8; border:1px solid #334155; border-radius:6px; padding:2px 8px; font-size:12px; font-weight:700; cursor:pointer;" />
                <span style="color:#cbd5e1; font-weight:600;">(${formatThaiDate(meta.recordDate)})</span>
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="color:#38bdf8;">📍</span>
            <div>
              <span style="color:#94a3b8; display:block; font-size:11px;">สถานที่:</span>
              <span style="font-weight:600; color:#f1f5f9;">${meta.location}</span>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="color:#38bdf8;">🛡️</span>
            <div>
              <span style="color:#94a3b8; display:block; font-size:11px;">ระบบบริการที่สำคัญ:</span>
              <span style="font-weight:600; color:#38bdf8;">${meta.mainSystem}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. KPI Summary Cards Banner -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; padding:18px 24px; background:#f8fafc; border-bottom:1px solid #e2e8f0;">
        <div style="background:#fff; padding:12px 16px; border-radius:10px; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
          <div>
            <div style="font-size:11.5px; color:#64748b; font-weight:600;">ทรัพย์สินบริการสำคัญ</div>
            <div style="font-size:1.5rem; font-weight:800; color:#0f172a; margin-top:2px;">${metrics.total} <span style="font-size:12px; font-weight:500; color:#94a3b8;">รายการ</span></div>
          </div>
          <div style="font-size:24px;">🌐</div>
        </div>

        <div style="background:#fff; padding:12px 16px; border-radius:10px; border:1px solid #fecaca; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11.5px; color:#b91c1c; font-weight:600;">🔴 ความสำคัญสูง</div>
            <div style="font-size:1.5rem; font-weight:800; color:#dc2626; margin-top:2px;">${metrics.highCrit} <span style="font-size:12px; font-weight:500; color:#f87171;">รายการ</span></div>
          </div>
          <div style="font-size:11px; background:#fee2e2; color:#b91c1c; font-weight:700; padding:2px 8px; border-radius:10px;">High</div>
        </div>

        <div style="background:#fff; padding:12px 16px; border-radius:10px; border:1px solid #fde68a; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11.5px; color:#b45309; font-weight:600;">🟡 ความสำคัญกลาง</div>
            <div style="font-size:1.5rem; font-weight:800; color:#d97706; margin-top:2px;">${metrics.medCrit} <span style="font-size:12px; font-weight:500; color:#fbbf24;">รายการ</span></div>
          </div>
          <div style="font-size:11px; background:#fef3c7; color:#b45309; font-weight:700; padding:2px 8px; border-radius:10px;">Med</div>
        </div>

        <div style="background:#fff; padding:12px 16px; border-radius:10px; border:1px solid #a7f3d0; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11.5px; color:#047857; font-weight:600;">🟢 ความสำคัญต่ำ</div>
            <div style="font-size:1.5rem; font-weight:800; color:#059669; margin-top:2px;">${metrics.lowCrit} <span style="font-size:12px; font-weight:500; color:#34d399;">รายการ</span></div>
          </div>
          <div style="font-size:11px; background:#d1fae5; color:#047857; font-weight:700; padding:2px 8px; border-radius:10px;">Low</div>
        </div>

        <div style="background:#eff6ff; padding:12px 16px; border-radius:10px; border:1px solid #bfdbfe; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11.5px; color:#1e40af; font-weight:600;">🖥️ Hardware</div>
            <div style="font-size:1.5rem; font-weight:800; color:#1d4ed8; margin-top:2px;">${metrics.hwCount} <span style="font-size:12px; font-weight:500; color:#60a5fa;">รายการ</span></div>
          </div>
          <div style="font-size:22px;">💻</div>
        </div>

        <div style="background:#f5f3ff; padding:12px 16px; border-radius:10px; border:1px solid #ddd6fe; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11.5px; color:#5b21b6; font-weight:600;">📱 Software &amp; Apps</div>
            <div style="font-size:1.5rem; font-weight:800; color:#6d28d9; margin-top:2px;">${metrics.swCount} <span style="font-size:12px; font-weight:500; color:#a78bfa;">รายการ</span></div>
          </div>
          <div style="font-size:22px;">📲</div>
        </div>
      </div>

      <!-- 3. All-in-one Filter & Search Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 24px; background:#fff; border-bottom:1px solid #e2e8f0; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; flex:1; max-width:440px;">
          <div style="position:relative; width:100%;">
            <input type="text" id="reg-search-input" value="${searchQuery}" placeholder="🔍 ค้นหา (ชื่อ, ชนิด, คำอธิบาย, ระบบ, เจ้าของ, สถานที่)..."
              style="width:100%; font-size:12.5px; padding:7px 12px 7px 32px; border-radius:8px; border:1px solid #cbd5e1; background:#fff;" />
            <span style="position:absolute; left:10px; top:8px; color:#94a3b8; font-size:12px;">🔍</span>
          </div>
          ${searchQuery ? `<button type="button" id="btn-clear-reg-search" style="border:none; background:none; color:#ef4444; font-size:12px; cursor:pointer; font-weight:600;">ล้าง</button>` : ''}
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:12px;">
          <!-- Dropdown: ชนิดทรัพย์สิน -->
          <div style="display:flex; align-items:center; gap:5px;">
            <span style="color:#64748b; font-weight:600;">ชนิดทรัพย์สิน:</span>
            <select id="reg-type-filter-select" style="padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12px; font-weight:600; background:#fff; cursor:pointer;">
              <option value="all" ${typeFilter === 'all' ? 'selected' : ''}>ทุกชนิด (All Types)</option>
              ${ASSET_REGISTER_CLUSTERS.map(c => `<option value="${c.type}" ${typeFilter === c.type ? 'selected' : ''}>${c.type}</option>`).join('')}
            </select>
          </div>

          <!-- Dropdown: ระดับความสำคัญ -->
          <div style="display:flex; align-items:center; gap:5px;">
            <span style="color:#64748b; font-weight:600;">ความสำคัญ:</span>
            <select id="reg-crit-filter-select" style="padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12px; font-weight:600; background:#fff; cursor:pointer;">
              <option value="all" ${critFilter === 'all' ? 'selected' : ''}>ทุกระดับ (All)</option>
              <option value="สูง" ${critFilter === 'สูง' ? 'selected' : ''}>🔴 สูง (High)</option>
              <option value="กลาง" ${critFilter === 'กลาง' ? 'selected' : ''}>🟡 กลาง (Medium)</option>
              <option value="ต่ำ" ${critFilter === 'ต่ำ' ? 'selected' : ''}>🟢 ต่ำ (Low)</option>
            </select>
          </div>

          <button type="button" id="btn-add-new-reg-item" class="btn" style="background:#059669; color:#fff; font-size:12.5px; font-weight:700; padding:6px 14px; border-radius:8px; border:none; display:flex; align-items:center; gap:5px; cursor:pointer;">
            ➕ เพิ่มทรัพย์สิน
          </button>

          <button type="button" id="btn-reset-reg-default" class="btn" style="background:#fff; color:#dc2626; border:1px solid #fecaca; font-size:11.5px; font-weight:600; padding:6px 10px; border-radius:6px; cursor:pointer;">
            🔄 คืนค่า 9 รายการเดิม
          </button>
        </div>
      </div>

      <!-- 4. All-in-one Data Table (10 Columns Matching 1.3 Asset Register.xlsx) -->
      <div style="overflow-x:auto;">
        <table class="table" style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
          <thead>
            <tr style="background:#f1f5f9; color:#334155; border-bottom:2px solid #cbd5e1;">
              <th style="padding:10px 8px; width:45px; text-align:center; font-weight:700;">No.</th>
              <th style="padding:10px 10px; width:145px; font-weight:700;">ชนิดของทรัพย์สิน<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Type of Asset)</span></th>
              <th style="padding:10px 10px; width:155px; font-weight:700;">ชื่อทรัพย์สิน<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Asset Name)</span></th>
              <th style="padding:10px 10px; min-width:180px; font-weight:700;">คำอธิบาย<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Description)</span></th>
              <th style="padding:10px 10px; width:135px; font-weight:700;">ระบบที่เกี่ยวข้อง<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Concerned App)</span></th>
              <th style="padding:10px 10px; min-width:200px; font-weight:700;">บริการที่สำคัญ/ฟังก์ชันที่สำคัญ<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Critical Function)</span></th>
              <th style="padding:10px 10px; width:105px; text-align:center; font-weight:700;">ความสำคัญ<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Criticality)</span></th>
              <th style="padding:10px 10px; width:130px; font-weight:700;">เจ้าของทรัพย์สิน<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Asset Owner)</span></th>
              <th style="padding:10px 10px; min-width:160px; font-weight:700;">สถานที่, ตำแหน่งทางกายภาพ<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Asset Location)</span></th>
              <th style="padding:10px 10px; min-width:160px; font-weight:700;">การขึ้นต่อกัน/ระบบเชื่อมโยง<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Connected Asset)</span></th>
              <th style="padding:10px 10px; width:80px; text-align:center; font-weight:700;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.length === 0 ? `
              <tr>
                <td colspan="11" style="text-align:center; padding:48px 20px; color:#94a3b8; font-size:13.5px;">
                  <div style="font-size:32px; margin-bottom:8px;">🔍</div>
                  ไม่พบรายการทรัพย์สินตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ` : filteredItems.map((item, idx) => `
              <tr style="border-bottom:1px solid #e2e8f0; background:${idx % 2 === 0 ? '#fff' : '#fcfdfe'}; transition:background 0.15s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='${idx % 2 === 0 ? '#fff' : '#fcfdfe'}'">
                <td style="padding:10px 8px; text-align:center; font-weight:700; color:#64748b;">
                  ${item.no || (idx + 1)}
                </td>
                <td style="padding:10px 10px;">
                  ${getTypeBadge(item.assetType)}
                </td>
                <td style="padding:10px 10px; font-weight:700; color:#0f172a;">
                  ${item.name || '-'}
                </td>
                <td style="padding:10px 10px; color:#334155; line-height:1.45;">
                  ${item.description || '-'}
                </td>
                <td style="padding:10px 10px; color:#475569;">
                  ${item.concernedApp ? item.concernedApp.replace(/\n/g, '<br/>') : '-'}
                </td>
                <td style="padding:10px 10px; color:#334155; line-height:1.45;">
                  ${item.criticalFunction || '-'}
                </td>
                <td style="padding:10px 10px; text-align:center;">
                  ${getCriticalityBadge(item.criticality)}
                </td>
                <td style="padding:10px 10px; color:#475569; font-weight:500;">
                  ${item.owner || '-'}
                </td>
                <td style="padding:10px 10px; color:#475569; font-size:11.5px; line-height:1.35;">
                  ${item.location || '-'}
                </td>
                <td style="padding:10px 10px; color:#475569; font-size:11.5px; line-height:1.35;">
                  ${item.connectedAsset || '-'}
                </td>
                <td style="padding:10px 10px; text-align:center;">
                  <div style="display:inline-flex; gap:4px;">
                    <button type="button" class="btn-edit-reg-item" data-id="${item.id}" title="แก้ไขรายการ"
                      style="border:none; background:#eff6ff; color:#2563eb; padding:5px 8px; border-radius:6px; cursor:pointer; font-size:12px;">
                      ✏️
                    </button>
                    <button type="button" class="btn-delete-reg-item" data-id="${item.id}" title="ลบรายการ"
                      style="border:none; background:#fee2e2; color:#dc2626; padding:5px 8px; border-radius:6px; cursor:pointer; font-size:12px;">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Footer Info Bar -->
      <div style="padding:12px 24px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:#64748b;">
        <div>
          แสดง <strong>${filteredItems.length}</strong> จากทั้งหมด <strong>${allItems.length}</strong> รายการทรัพย์สินของบริการที่สำคัญ
        </div>
        <div style="font-weight:600;">
          สำนักงานสาธารณสุขจังหวัดสระแก้ว • กลุ่มงานสุขภาพดิจิทัล
        </div>
      </div>

    </div>

    <!-- Modal 1: Add / Edit Register Item -->
    <div id="modal-reg-item" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; align-items:center; justify-content:center; padding:16px;">
      <div style="background:#fff; width:100%; max-width:680px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.25); overflow:hidden; display:flex; flex-direction:column; max-height:92vh;">
        <div style="padding:16px 20px; background:#1e293b; color:#fff; display:flex; justify-content:space-between; align-items:center;">
          <h3 id="modal-reg-item-title" style="margin:0; font-size:1.15rem; font-weight:700;">➕ เพิ่มทรัพย์สินของบริการที่สำคัญ</h3>
          <button type="button" id="btn-close-reg-modal" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer;">✕</button>
        </div>
        <div style="padding:20px; overflow-y:auto; flex:1; font-size:12.5px;">
          <form id="form-reg-item">
            <input type="hidden" id="form-reg-id" value="" />
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ชนิดทรัพย์สิน (Type of Asset) *</label>
                <select id="form-reg-type" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;">
                  ${ASSET_REGISTER_CLUSTERS.map(c => `<option value="${c.type}">${c.type} (${c.group})</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ความสำคัญ (Criticality) *</label>
                <select id="form-reg-crit" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;">
                  <option value="สูง">🔴 สูง (High)</option>
                  <option value="กลาง" selected>🟡 กลาง (Medium)</option>
                  <option value="ต่ำ">🟢 ต่ำ (Low)</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ชื่อทรัพย์สิน (Asset Name) *</label>
                <input type="text" id="form-reg-name" required placeholder="เช่น Pay Slip, Plan-D, Fortigate 100F" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ระบบที่เกี่ยวข้อง (Concerned App)</label>
                <input type="text" id="form-reg-concerned" placeholder="เช่น ระบบเงินเดือน, เว็บสำนักงาน" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">คำอธิบาย (Description)</label>
              <textarea id="form-reg-desc" rows="2" placeholder="อธิบายหน้าที่หรือรายละเอียดทรัพย์สิน" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;"></textarea>
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">บริการที่สำคัญ / ฟังก์ชันที่สำคัญ (Critical Function)</label>
              <textarea id="form-reg-function" rows="2" placeholder="อธิบายบทบาทและฟังก์ชันสำคัญของระบบ" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;"></textarea>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">เจ้าของทรัพย์สิน (Asset Owner)</label>
                <input type="text" id="form-reg-owner" placeholder="เช่น กลุ่มงานสุขภาพดิจิทัล" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">สถานที่, ตำแหน่งทางกายภาพ (Location)</label>
                <input type="text" id="form-reg-loc" placeholder="เช่น Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">การขึ้นต่อกันของทรัพย์สิน / ระบบที่เกี่ยวข้องกัน (Connected Asset)</label>
              <input type="text" id="form-reg-connected" placeholder="เช่น ระบบไฟฟ้า เครื่องแม่ข่ายให้ (Server) บริการฐานข้อมูล" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
            </div>

          </form>
        </div>
        <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" id="btn-cancel-reg-modal" class="btn" style="background:#fff; color:#475569; border:1px solid #cbd5e1; font-size:13px; font-weight:600; padding:8px 16px; border-radius:6px; cursor:pointer;">
            ยกเลิก
          </button>
          <button type="button" id="btn-save-reg-item" class="btn" style="background:#2563eb; color:#fff; border:none; font-size:13px; font-weight:700; padding:8px 20px; border-radius:6px; cursor:pointer;">
            💾 บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 2: Edit Header Metadata -->
    <div id="modal-reg-meta" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; align-items:center; justify-content:center; padding:16px;">
      <div style="background:#fff; width:100%; max-width:620px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.25); overflow:hidden; display:flex; flex-direction:column;">
        <div style="padding:16px 20px; background:#1e293b; color:#fff; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:700;">✏️ แก้ไขข้อมูลส่วนหัวทะเบียนทรัพย์สิน</h3>
          <button type="button" id="btn-close-reg-meta-modal" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer;">✕</button>
        </div>
        <div style="padding:20px; overflow-y:auto; font-size:12.5px;">
          <form id="form-reg-meta">
            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ชื่อเอกสารทะเบียน</label>
              <input type="text" id="meta-reg-doc-title" value="${meta.docTitle}" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ชื่อหน่วยงาน</label>
              <input type="text" id="meta-reg-agency-name" value="${meta.agencyName}" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ผู้บันทึก</label>
                <input type="text" id="meta-reg-recorder" value="${meta.recorder}" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">วันที่ทำการบันทึก</label>
                <input type="date" id="meta-reg-record-date" value="${meta.recordDate || '2026-02-25'}" 
                  style="width:100%; padding:7px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">สถานที่</label>
                <input type="text" id="meta-reg-location" value="${meta.location}" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ระบบบริการที่สำคัญ</label>
                <input type="text" id="meta-reg-main-system" value="${meta.mainSystem}" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ที่อยู่</label>
              <textarea id="meta-reg-address" rows="2" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;">${meta.address}</textarea>
            </div>
          </form>
        </div>
        <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" id="btn-cancel-reg-meta-modal" class="btn" style="background:#fff; color:#475569; border:1px solid #cbd5e1; font-size:13px; font-weight:600; padding:8px 16px; border-radius:6px; cursor:pointer;">
            ยกเลิก
          </button>
          <button type="button" id="btn-save-reg-meta" class="btn" style="background:#2563eb; color:#fff; border:none; font-size:13px; font-weight:700; padding:8px 20px; border-radius:6px; cursor:pointer;">
            💾 บันทึกส่วนหัว
          </button>
        </div>
      </div>
    </div>
  `
}

export function bindAssetRegisterEvents(containerEl, registerData, onAction) {
  if (!containerEl) return

  // 1. Search input
  const searchInput = containerEl.querySelector('#reg-search-input')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      onAction({ type: 'SEARCH', query: e.target.value })
    })
  }

  const btnClearSearch = containerEl.querySelector('#btn-clear-reg-search')
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      onAction({ type: 'SEARCH', query: '' })
    })
  }

  // 2. Type Filter Dropdown
  const typeFilterSelect = containerEl.querySelector('#reg-type-filter-select')
  if (typeFilterSelect) {
    typeFilterSelect.addEventListener('change', (e) => {
      onAction({ type: 'FILTER_TYPE', typeFilter: e.target.value })
    })
  }

  // 3. Criticality Filter Dropdown
  const critFilterSelect = containerEl.querySelector('#reg-crit-filter-select')
  if (critFilterSelect) {
    critFilterSelect.addEventListener('change', (e) => {
      onAction({ type: 'FILTER_CRIT', critFilter: e.target.value })
    })
  }

  // 4. Header Date Input Direct Change
  const headerDateInput = containerEl.querySelector('#reg-header-date-input')
  if (headerDateInput) {
    headerDateInput.addEventListener('change', (e) => {
      onAction({ type: 'UPDATE_HEADER_DATE', date: e.target.value })
    })
  }

  // 5. Reset to Default 9 items
  const btnReset = containerEl.querySelector('#btn-reset-reg-default')
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('คุณต้องการรีเซ็ตข้อมูลทะเบียนทรัพย์สินเป็น 9 รายการตั้งต้นเดิมตามไฟล์ 1.3 Asset Register.xlsx ใช่หรือไม่?')) {
        onAction({ type: 'RESET_DEFAULT' })
      }
    })
  }

  // 6. Export Buttons
  const btnExportWord = containerEl.querySelector('#btn-export-reg-word')
  if (btnExportWord) {
    btnExportWord.addEventListener('click', () => {
      onAction({ type: 'EXPORT_WORD' })
    })
  }

  const btnExportCsv = containerEl.querySelector('#btn-export-reg-csv')
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      onAction({ type: 'EXPORT_CSV' })
    })
  }

  const btnPrint = containerEl.querySelector('#btn-print-reg')
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print()
    })
  }

  // 7. Add Asset Modal Open
  const btnAdd = containerEl.querySelector('#btn-add-new-reg-item')
  const modalItem = containerEl.querySelector('#modal-reg-item')

  if (btnAdd && modalItem) {
    btnAdd.addEventListener('click', () => {
      containerEl.querySelector('#modal-reg-item-title').textContent = '➕ เพิ่มทรัพย์สินของบริการที่สำคัญ'
      containerEl.querySelector('#form-reg-id').value = ''
      containerEl.querySelector('#form-reg-name').value = ''
      containerEl.querySelector('#form-reg-type').value = 'Application-Major'
      containerEl.querySelector('#form-reg-crit').value = 'สูง'
      containerEl.querySelector('#form-reg-concerned').value = ''
      containerEl.querySelector('#form-reg-desc').value = ''
      containerEl.querySelector('#form-reg-function').value = ''
      containerEl.querySelector('#form-reg-owner').value = 'กลุ่มงานสุขภาพดิจิทัล'
      containerEl.querySelector('#form-reg-loc').value = 'Data Center กลุ่มงานสุขภาพดิจิทัล ชั้น 1'
      containerEl.querySelector('#form-reg-connected').value = ''

      modalItem.style.display = 'flex'
    })
  }

  // Close Item Modal
  const btnCloseModal = containerEl.querySelector('#btn-close-reg-modal')
  const btnCancelModal = containerEl.querySelector('#btn-cancel-reg-modal')
  if (btnCloseModal && modalItem) {
    btnCloseModal.addEventListener('click', () => { modalItem.style.display = 'none' })
  }
  if (btnCancelModal && modalItem) {
    btnCancelModal.addEventListener('click', () => { modalItem.style.display = 'none' })
  }

  // Save Item (Add or Edit)
  const btnSaveItem = containerEl.querySelector('#btn-save-reg-item')
  if (btnSaveItem && modalItem) {
    btnSaveItem.addEventListener('click', () => {
      const name = containerEl.querySelector('#form-reg-name').value.trim()
      if (!name) {
        alert('กรุณาระบุชื่อทรัพย์สิน (Asset Name)')
        return
      }

      const idVal = containerEl.querySelector('#form-reg-id').value
      const itemData = {
        id: idVal ? parseInt(idVal, 10) : Date.now(),
        assetType: containerEl.querySelector('#form-reg-type').value,
        name,
        description: containerEl.querySelector('#form-reg-desc').value.trim(),
        concernedApp: containerEl.querySelector('#form-reg-concerned').value.trim(),
        criticalFunction: containerEl.querySelector('#form-reg-function').value.trim(),
        criticality: containerEl.querySelector('#form-reg-crit').value,
        owner: containerEl.querySelector('#form-reg-owner').value.trim(),
        location: containerEl.querySelector('#form-reg-loc').value.trim(),
        connectedAsset: containerEl.querySelector('#form-reg-connected').value.trim()
      }

      modalItem.style.display = 'none'
      onAction({
        type: idVal ? 'UPDATE_ITEM' : 'ADD_ITEM',
        item: itemData
      })
    })
  }

  // 8. Edit Item Modal Open
  containerEl.querySelectorAll('.btn-edit-reg-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10)
      const targetItem = (registerData?.items || []).find(it => it.id === id)
      if (!targetItem || !modalItem) return

      containerEl.querySelector('#modal-reg-item-title').textContent = `✏️ แก้ไขทรัพย์สิน (${targetItem.name || ''})`
      containerEl.querySelector('#form-reg-id').value = targetItem.id
      containerEl.querySelector('#form-reg-name').value = targetItem.name || ''
      containerEl.querySelector('#form-reg-type').value = targetItem.assetType || 'Application-Major'
      containerEl.querySelector('#form-reg-crit').value = targetItem.criticality || 'สูง'
      containerEl.querySelector('#form-reg-concerned').value = targetItem.concernedApp || ''
      containerEl.querySelector('#form-reg-desc').value = targetItem.description || ''
      containerEl.querySelector('#form-reg-function').value = targetItem.criticalFunction || ''
      containerEl.querySelector('#form-reg-owner').value = targetItem.owner || ''
      containerEl.querySelector('#form-reg-loc').value = targetItem.location || ''
      containerEl.querySelector('#form-reg-connected').value = targetItem.connectedAsset || ''

      modalItem.style.display = 'flex'
    })
  })

  // 9. Delete Item
  containerEl.querySelectorAll('.btn-delete-reg-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10)
      const targetItem = (registerData?.items || []).find(it => it.id === id)
      if (!targetItem) return

      if (confirm(`คุณต้องการลบรายการทรัพย์สิน "${targetItem.name}" ใช่หรือไม่?`)) {
        onAction({ type: 'DELETE_ITEM', id })
      }
    })
  })

  // 10. Header Meta Modal
  const btnEditMeta = containerEl.querySelector('#btn-edit-reg-meta')
  const modalMeta = containerEl.querySelector('#modal-reg-meta')
  const btnCloseMeta = containerEl.querySelector('#btn-close-reg-meta-modal')
  const btnCancelMeta = containerEl.querySelector('#btn-cancel-reg-meta-modal')
  const btnSaveMeta = containerEl.querySelector('#btn-save-reg-meta')

  if (btnEditMeta && modalMeta) {
    btnEditMeta.addEventListener('click', () => {
      modalMeta.style.display = 'flex'
    })
  }

  if (btnCloseMeta && modalMeta) {
    btnCloseMeta.addEventListener('click', () => { modalMeta.style.display = 'none' })
  }
  if (btnCancelMeta && modalMeta) {
    btnCancelMeta.addEventListener('click', () => { modalMeta.style.display = 'none' })
  }

  if (btnSaveMeta && modalMeta) {
    btnSaveMeta.addEventListener('click', () => {
      const updatedMeta = {
        docTitle: containerEl.querySelector('#meta-reg-doc-title').value.trim(),
        agencyName: containerEl.querySelector('#meta-reg-agency-name').value.trim(),
        recorder: containerEl.querySelector('#meta-reg-recorder').value.trim(),
        recordDate: containerEl.querySelector('#meta-reg-record-date').value,
        location: containerEl.querySelector('#meta-reg-location').value.trim(),
        address: containerEl.querySelector('#meta-reg-address').value.trim(),
        mainSystem: containerEl.querySelector('#meta-reg-main-system').value.trim()
      }

      modalMeta.style.display = 'none'
      onAction({ type: 'UPDATE_METADATA', metadata: updatedMeta })
    })
  }
}

export function exportAssetRegisterToCsv(registerData) {
  const meta = registerData?.metadata || DEFAULT_ASSET_REGISTER_METADATA
  const items = registerData?.items || []

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""'
    const s = String(str).replace(/"/g, '""')
    return `"${s}"`
  }

  const csvRows = [
    `\uFEFF${escapeCsv(meta.docTitle)}`,
    `${escapeCsv('ผู้บันทึก :')},${escapeCsv(meta.recorder)}`,
    `${escapeCsv('วันที่ทำการบันทึก :')},${escapeCsv(formatThaiDate(meta.recordDate))}`,
    `${escapeCsv('สถานที่ :')},${escapeCsv(meta.location)}`,
    `${escapeCsv('ที่อยู่ :')},${escapeCsv(meta.address)}`,
    `${escapeCsv('ระบบบริการที่สำคัญ :')},${escapeCsv(meta.mainSystem)}`,
    '',
    [
      'No.',
      'ชนิดของทรัพย์สิน (Type of Asset)',
      'ชื่อ (Asset Name)',
      'คำอธิบาย (Description)',
      'ระบบที่เกี่ยวข้อง (Concerned Application)',
      'บริการที่สำคัญ/ฟังก์ชันที่สำคัญ (Critical Service/ Function)',
      'ความสำคัญ (Criticality) หรือระดับผลกระทบที่อาจเกิดขึ้น',
      'เจ้าของ (Asset Owner)',
      'สถานที่, ตำแหน่งทางกายภาพ (Asset Location)',
      'การขึ้นต่อกันของทรัพย์สินของบริการที่สำคัญ / หรือระบบที่เกี่ยวข้องกัน (Connected Asset)/หมายเหตุ (Remark)'
    ].map(escapeCsv).join(',')
  ]

  items.forEach((it, index) => {
    csvRows.push([
      it.no || (index + 1),
      it.assetType || '',
      it.name || '',
      it.description || '',
      it.concernedApp || '',
      it.criticalFunction || '',
      it.criticality || '',
      it.owner || '',
      it.location || '',
      it.connectedAsset || ''
    ].map(escapeCsv).join(','))
  })

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `1.3_Asset_Register_${meta.recordDate || '2569'}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportAssetRegisterToWord(registerData) {
  const meta = registerData?.metadata || DEFAULT_ASSET_REGISTER_METADATA
  const items = registerData?.items || []
  const metrics = calculateRegisterMetrics(items)

  const tableRows = items.map((it, idx) => `
    <tr>
      <td style="text-align:center; padding:6px 4px; font-weight:bold;">${it.no || (idx + 1)}</td>
      <td style="padding:6px 6px; font-weight:bold;">${it.assetType || ''}</td>
      <td style="padding:6px 6px; font-weight:bold; color:#1e40af;">${it.name || ''}</td>
      <td style="padding:6px 6px;">${it.description || ''}</td>
      <td style="padding:6px 6px;">${(it.concernedApp || '').replace(/\n/g, '<br/>')}</td>
      <td style="padding:6px 6px;">${it.criticalFunction || ''}</td>
      <td style="text-align:center; padding:6px 4px; font-weight:bold; ${it.criticality === 'สูง' ? 'color:#dc2626;' : it.criticality === 'ต่ำ' ? 'color:#15803d;' : 'color:#b45309;'}">
        ${it.criticality || ''}
      </td>
      <td style="padding:6px 6px;">${it.owner || ''}</td>
      <td style="padding:6px 6px; font-size:10.5pt;">${it.location || ''}</td>
      <td style="padding:6px 6px; font-size:10.5pt;">${it.connectedAsset || ''}</td>
    </tr>
  `).join('')

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${meta.docTitle}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 1.2cm 1.2cm 1.2cm 1.2cm;
          mso-page-orientation: landscape;
        }
        body {
          font-family: 'TH Sarabun New', 'TH SarabunPSK', AngsanaUPC, CordiaUPC, sans-serif;
          font-size: 13.5pt;
          line-height: 1.25;
          color: #000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 15px;
          font-size: 11pt;
        }
        th, td {
          border: 1px solid #333;
          vertical-align: top;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: center;
          padding: 8px 4px;
        }
        .header-meta-box {
          border: 1px solid #94a3b8;
          background-color: #f8fafc;
          padding: 12px 16px;
          margin-bottom: 14px;
          font-size: 12.5pt;
        }
      </style>
    </head>
    <body>
      <div style="text-align:center; margin-bottom:12px;">
        <img src="${LOGO_MOPH_BASE64}" width="70" height="70" style="margin-bottom:6px;" alt="MOPH Logo" />
        <h2 style="font-size:18pt; margin:4px 0 2px 0; font-weight:bold; color:#0f172a;">
          ${meta.docTitle}
        </h2>
        <div style="font-size:13pt; color:#475569;">
          ${meta.agencyName}
        </div>
      </div>

      <div class="header-meta-box">
        <table style="width:100%; border:none; margin:0; font-size:12pt;">
          <tr style="border:none;">
            <td style="border:none; width:50%; padding:2px 0;"><strong>ผู้บันทึก:</strong> ${meta.recorder}</td>
            <td style="border:none; width:50%; padding:2px 0;"><strong>วันที่ทำการบันทึก:</strong> ${formatThaiDate(meta.recordDate)}</td>
          </tr>
          <tr style="border:none;">
            <td style="border:none; padding:2px 0;"><strong>สถานที่:</strong> ${meta.location}</td>
            <td style="border:none; padding:2px 0;"><strong>ระบบบริการที่สำคัญ:</strong> ${meta.mainSystem}</td>
          </tr>
          <tr style="border:none;">
            <td style="border:none; padding:2px 0;" colspan="2"><strong>ที่อยู่:</strong> ${meta.address}</td>
          </tr>
        </table>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:30px;">No.</th>
            <th style="width:100px;">ชนิดของทรัพย์สิน<br/>(Type of Asset)</th>
            <th style="width:115px;">ชื่อ (Asset Name)</th>
            <th style="width:140px;">คำอธิบาย (Description)</th>
            <th style="width:100px;">ระบบที่เกี่ยวข้อง<br/>(Concerned App)</th>
            <th style="width:160px;">บริการที่สำคัญ/ฟังก์ชันที่สำคัญ<br/>(Critical Function)</th>
            <th style="width:75px;">ความสำคัญ<br/>(Criticality)</th>
            <th style="width:95px;">เจ้าของ<br/>(Asset Owner)</th>
            <th style="width:120px;">สถานที่, ตำแหน่ง<br/>(Asset Location)</th>
            <th style="width:120px;">การขึ้นต่อกัน/ระบบเชื่อมโยง<br/>(Connected Asset)</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div style="margin-top:24px; font-size:12pt; display:flex; justify-content:space-between;">
        <div style="width:50%; text-align:center; float:left;">
          <p>ลงชื่อ..............................................................ผู้จัดทำทะเบียน<br/>
          (${meta.recorder.split(',')[0].replace('ผู้บันทึก : ', '').trim()})<br/>
          ตำแหน่ง ..............................................................<br/>
          วันที่ ......../......../............</p>
        </div>
        <div style="width:50%; text-align:center; float:right;">
          <p>ลงชื่อ..............................................................ผู้รับรอง/อนุมัติ<br/>
          (..............................................................)<br/>
          ตำแหน่ง นายแพทย์สาธารณสุขจังหวัดสระแก้ว<br/>
          วันที่ ......../......../............</p>
        </div>
      </div>
    </body>
    </html>
  `

  const blob = new Blob([wordHtml], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `1.3_Asset_Register_${meta.recordDate || '2569'}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
