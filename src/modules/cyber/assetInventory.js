import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import {
  DEFAULT_ASSET_METADATA,
  DEFAULT_HARDWARE_ITEMS,
  DEFAULT_SOFTWARE_ITEMS,
  DEFAULT_ASSET_INVENTORY_ITEMS
} from './assetInventoryData.js'

export {
  DEFAULT_ASSET_METADATA,
  DEFAULT_HARDWARE_ITEMS,
  DEFAULT_SOFTWARE_ITEMS,
  DEFAULT_ASSET_INVENTORY_ITEMS
}

export const DEFAULT_ASSET_INVENTORY_DATA = {
  metadata: { ...DEFAULT_ASSET_METADATA },
  items: JSON.parse(JSON.stringify(DEFAULT_ASSET_INVENTORY_ITEMS))
}

export const ASSET_GROUPS = {
  hardware: [
    'Computer',
    'Power',
    'Printer',
    'Network',
    'Peripherals',
    'Tablet',
    'Data Center',
    'IoT/Security'
  ],
  software: [
    'General SW-01',
    'General SW-02',
    'General SW-03',
    'General SW-04'
  ]
}

export function isHardwareAsset(item = {}) {
  if (item.category) return item.category === 'hardware'
  const type = String(item.assetType || item.type || '').trim()
  const aid = String(item.assetId || '').trim()
  return type.startsWith('HW-') || aid.startsWith('Server') || aid.startsWith('Firewall') || aid.startsWith('SW') || aid.startsWith('Core') || aid.startsWith('AIO') || aid.startsWith('UPS') || aid.startsWith('PT') || aid.startsWith('MT') || aid.startsWith('TP') || aid.startsWith('PC') || aid.startsWith('SEC') || aid.startsWith('RCK')
}

export function isSoftwareAsset(item = {}) {
  if (item.category) return item.category === 'software'
  const type = String(item.assetType || item.type || '').trim()
  const aid = String(item.assetId || '').trim()
  return type.startsWith('Application-') || type.startsWith('SW') || aid.startsWith('SW ')
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

export function getAssetGroupBadge(group = '') {
  const g = String(group).trim()
  const styles = {
    'Computer': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', icon: '💻' },
    'Power': { bg: '#fef3c7', color: '#b45309', border: '#fcd34d', icon: '⚡' },
    'Printer': { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1', icon: '🖨️' },
    'Network': { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', icon: '🌐' },
    'Peripherals': { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff', icon: '🖥️' },
    'Tablet': { bg: '#fff1f2', color: '#be123c', border: '#fecdd3', icon: '📱' },
    'Data Center': { bg: '#0f172a', color: '#38bdf8', border: '#334155', icon: '🏢' },
    'IoT/Security': { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5', icon: '🛡️' }
  }

  const s = styles[g] || { bg: '#f8fafc', color: '#475569', border: '#e2e8f0', icon: '📦' }
  return `<span style="display:inline-flex; align-items:center; gap:4px; padding:2px 7px; border-radius:6px; font-size:11px; font-weight:600; background:${s.bg}; color:${s.color}; border:1px solid ${s.border}; white-space:nowrap;">
    <span>${s.icon}</span>
    <span>${g || 'ทั่วไป'}</span>
  </span>`
}

export function calculateAssetMetrics(items = []) {
  const total = items.length
  let hardwareCount = 0
  let softwareCount = 0
  let computerCount = 0
  let powerCount = 0
  let printerCount = 0
  let networkCount = 0
  let tabletCount = 0
  let peripheralsCount = 0
  let dataCenterCount = 0
  let securityCount = 0

  items.forEach(it => {
    if (it.category === 'software' || isSoftwareAsset(it)) {
      softwareCount++
    } else {
      hardwareCount++
      const g = (it.assetGroup || '').trim()
      if (g === 'Computer') computerCount++
      else if (g === 'Power') powerCount++
      else if (g === 'Printer') printerCount++
      else if (g === 'Network') networkCount++
      else if (g === 'Tablet') tabletCount++
      else if (g === 'Peripherals') peripheralsCount++
      else if (g === 'Data Center') dataCenterCount++
      else if (g === 'IoT/Security') securityCount++
    }
  })

  return {
    total,
    hardwareCount,
    softwareCount,
    computerCount,
    powerCount,
    printerCount,
    networkCount,
    tabletCount,
    peripheralsCount,
    dataCenterCount,
    securityCount
  }
}

export function renderAssetInventoryHtml(assetData, activeSubTab = 'hardware', searchQuery = '', groupFilter = 'all') {
  const meta = assetData?.metadata || DEFAULT_ASSET_METADATA
  const allItems = assetData?.items || []
  const metrics = calculateAssetMetrics(allItems)

  // Filter items according to activeSubTab
  let filteredItems = allItems.filter(it => {
    const isSw = it.category === 'software' || isSoftwareAsset(it)
    if (activeSubTab === 'hardware') return !isSw
    if (activeSubTab === 'software') return isSw
    return true // 'all'
  })

  // Filter by group
  if (groupFilter && groupFilter !== 'all') {
    filteredItems = filteredItems.filter(it => (it.assetGroup || '').trim() === groupFilter)
  }

  // Filter by search query
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim()
    filteredItems = filteredItems.filter(it => 
      (it.assetId || '').toLowerCase().includes(q) ||
      (it.name || '').toLowerCase().includes(q) ||
      (it.assetType || '').toLowerCase().includes(q) ||
      (it.assetGroup || '').toLowerCase().includes(q) ||
      (it.owner || '').toLowerCase().includes(q) ||
      (it.location || '').toLowerCase().includes(q) ||
      (it.propTag || '').toLowerCase().includes(q) ||
      (it.mfrModelSn || '').toLowerCase().includes(q) ||
      (it.netAddr || '').toLowerCase().includes(q) ||
      (it.supplier || '').toLowerCase().includes(q) ||
      (it.spec || '').toLowerCase().includes(q) ||
      (it.purpose || '').toLowerCase().includes(q) ||
      (it.remarks || '').toLowerCase().includes(q)
    )
  }

  // Available groups for filter dropdown
  const availableGroups = activeSubTab === 'software' 
    ? ASSET_GROUPS.software 
    : activeSubTab === 'hardware' 
    ? ASSET_GROUPS.hardware 
    : [...ASSET_GROUPS.hardware, ...ASSET_GROUPS.software]

  return `
    <div class="asset-inventory-container" style="background:#fff; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 1px 3px rgba(0,0,0,0.05); overflow:hidden;">
      
      <!-- 1. Header Card (Document Info & Metadata) -->
      <div style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#fff; padding:24px 28px; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
          <div style="display:flex; align-items:center; gap:16px;">
            <img src="${LOGO_MOPH_BASE64}" alt="MOPH Logo" style="width:58px; height:58px; object-fit:contain; background:#fff; padding:3px; border-radius:50%; box-shadow:0 2px 8px rgba(0,0,0,0.3);" />
            <div>
              <div style="font-size:12px; font-weight:700; color:#38bdf8; letter-spacing:0.8px; text-transform:uppercase; margin-bottom:2px;">
                CII &amp; CYBERSECURITY ASSET INVENTORY • 1.2
              </div>
              <h1 style="font-size:1.45rem; font-weight:800; margin:0 0 4px 0; color:#f8fafc; line-height:1.3;">
                ${meta.docTitle}
              </h1>
              <div style="font-size:13px; color:#94a3b8;">
                ${meta.subTitle} — <span style="color:#e2e8f0; font-weight:600;">${meta.agencyName}</span>
              </div>
            </div>
          </div>
          
          <!-- Top Right Action Controls -->
          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <button type="button" id="btn-edit-asset-meta" class="btn" style="background:#334155; color:#f1f5f9; font-size:12px; font-weight:600; padding:6px 14px; border-radius:8px; border:1px solid #475569; display:flex; align-items:center; gap:6px; cursor:pointer;">
              ✏️ แก้ไขข้อมูลส่วนหัว
            </button>
            <button type="button" id="btn-export-asset-word" class="btn" style="background:#2563eb; color:#fff; font-size:12px; font-weight:600; padding:6px 14px; border-radius:8px; border:none; display:flex; align-items:center; gap:6px; cursor:pointer;">
              📄 ส่งออก Word (.doc)
            </button>
            <button type="button" id="btn-export-asset-csv" class="btn" style="background:#10b981; color:#fff; font-size:12px; font-weight:600; padding:6px 14px; border-radius:8px; border:none; display:flex; align-items:center; gap:6px; cursor:pointer;">
              📊 ส่งออก Excel (.csv)
            </button>
            <button type="button" id="btn-print-asset-inv" class="btn" style="background:#475569; color:#fff; font-size:12px; font-weight:600; padding:6px 14px; border-radius:8px; border:none; display:flex; align-items:center; gap:6px; cursor:pointer;">
              🖨️ พิมพ์ (Print A4)
            </button>
          </div>
        </div>

        <!-- Metadata Summary Badges Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.12); font-size:12.5px;">
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="color:#38bdf8;">👤</span>
            <div>
              <span style="color:#94a3b8; display:block; font-size:11px;">ผู้บันทึกทะเบียน:</span>
              <span style="font-weight:600; color:#f1f5f9;">${meta.recorder}</span>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="color:#38bdf8;">📅</span>
            <div>
              <span style="color:#94a3b8; display:block; font-size:11px;">วันที่ปรับปรุงทะเบียนล่าสุด (เลือกได้):</span>
              <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                <input type="date" id="header-asset-date-input" value="${meta.updatedDate || '2026-02-25'}" 
                  style="background:#0f172a; color:#38bdf8; border:1px solid #334155; border-radius:6px; padding:2px 8px; font-size:12px; font-weight:700; cursor:pointer;" />
                <span style="color:#cbd5e1; font-weight:600;">(${formatThaiDate(meta.updatedDate)})</span>
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="color:#38bdf8;">📍</span>
            <div>
              <span style="color:#94a3b8; display:block; font-size:11px;">สถานที่ / ศูนย์ข้อมูล:</span>
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
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; padding:18px 24px; background:#f8fafc; border-bottom:1px solid #e2e8f0;">
        <div style="background:#fff; padding:12px 14px; border-radius:10px; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
          <div>
            <div style="font-size:11px; color:#64748b; font-weight:600;">ทรัพย์สินทั้งหมด</div>
            <div style="font-size:1.45rem; font-weight:800; color:#0f172a; margin-top:2px;">${metrics.total} <span style="font-size:11px; font-weight:500; color:#94a3b8;">รายการ</span></div>
          </div>
          <div style="font-size:22px;">🌐</div>
        </div>

        <div style="background:#eff6ff; padding:12px 14px; border-radius:10px; border:1px solid #bfdbfe; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11px; color:#1e40af; font-weight:600;">🖥️ Hardware</div>
            <div style="font-size:1.45rem; font-weight:800; color:#1d4ed8; margin-top:2px;">${metrics.hardwareCount} <span style="font-size:11px; font-weight:500; color:#60a5fa;">รายการ</span></div>
          </div>
          <div style="font-size:22px;">💻</div>
        </div>

        <div style="background:#f5f3ff; padding:12px 14px; border-radius:10px; border:1px solid #ddd6fe; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11px; color:#5b21b6; font-weight:600;">📱 Software &amp; Apps</div>
            <div style="font-size:1.45rem; font-weight:800; color:#6d28d9; margin-top:2px;">${metrics.softwareCount} <span style="font-size:11px; font-weight:500; color:#a78bfa;">รายการ</span></div>
          </div>
          <div style="font-size:22px;">📲</div>
        </div>

        <div style="background:#fff; padding:12px 14px; border-radius:10px; border:1px solid #cbd5e1; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11px; color:#334155; font-weight:600;">💻 Computer / PC</div>
            <div style="font-size:1.45rem; font-weight:800; color:#0f172a; margin-top:2px;">${metrics.computerCount} <span style="font-size:11px; font-weight:500; color:#94a3b8;">เครื่อง</span></div>
          </div>
          <div style="font-size:20px;">🖥️</div>
        </div>

        <div style="background:#fff; padding:12px 14px; border-radius:10px; border:1px solid #fde68a; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11px; color:#b45309; font-weight:600;">⚡ Power / UPS</div>
            <div style="font-size:1.45rem; font-weight:800; color:#d97706; margin-top:2px;">${metrics.powerCount} <span style="font-size:11px; font-weight:500; color:#fbbf24;">ตัว</span></div>
          </div>
          <div style="font-size:20px;">🔋</div>
        </div>

        <div style="background:#fff; padding:12px 14px; border-radius:10px; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11px; color:#475569; font-weight:600;">🖨️ Printer</div>
            <div style="font-size:1.45rem; font-weight:800; color:#334155; margin-top:2px;">${metrics.printerCount} <span style="font-size:11px; font-weight:500; color:#94a3b8;">เครื่อง</span></div>
          </div>
          <div style="font-size:20px;">📠</div>
        </div>

        <div style="background:#fff; padding:12px 14px; border-radius:10px; border:1px solid #a7f3d0; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11px; color:#047857; font-weight:600;">🌐 Network Switch</div>
            <div style="font-size:1.45rem; font-weight:800; color:#059669; margin-top:2px;">${metrics.networkCount} <span style="font-size:11px; font-weight:500; color:#34d399;">ตัว</span></div>
          </div>
          <div style="font-size:20px;">🔀</div>
        </div>
      </div>

      <!-- 3. Sub-tabs Navigation -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 24px; border-bottom:1px solid #e2e8f0; background:#fff; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; gap:6px;">
          <button type="button" class="asset-subtab-btn ${activeSubTab === 'hardware' ? 'active' : ''}" data-subtab="hardware"
            style="padding:8px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:1px solid ${activeSubTab === 'hardware' ? '#2563eb' : '#cbd5e1'}; background:${activeSubTab === 'hardware' ? '#2563eb' : '#fff'}; color:${activeSubTab === 'hardware' ? '#fff' : '#475569'}; display:flex; align-items:center; gap:6px;">
            <span>🖥️ Hardware</span>
            <span style="background:${activeSubTab === 'hardware' ? 'rgba(255,255,255,0.25)' : '#e2e8f0'}; padding:1px 7px; border-radius:10px; font-size:11px;">${metrics.hardwareCount}</span>
          </button>

          <button type="button" class="asset-subtab-btn ${activeSubTab === 'software' ? 'active' : ''}" data-subtab="software"
            style="padding:8px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:1px solid ${activeSubTab === 'software' ? '#7c3aed' : '#cbd5e1'}; background:${activeSubTab === 'software' ? '#7c3aed' : '#fff'}; color:${activeSubTab === 'software' ? '#fff' : '#475569'}; display:flex; align-items:center; gap:6px;">
            <span>📱 Software &amp; Applications</span>
            <span style="background:${activeSubTab === 'software' ? 'rgba(255,255,255,0.25)' : '#e2e8f0'}; padding:1px 7px; border-radius:10px; font-size:11px;">${metrics.softwareCount}</span>
          </button>

          <button type="button" class="asset-subtab-btn ${activeSubTab === 'all' ? 'active' : ''}" data-subtab="all"
            style="padding:8px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:1px solid ${activeSubTab === 'all' ? '#0f172a' : '#cbd5e1'}; background:${activeSubTab === 'all' ? '#0f172a' : '#fff'}; color:${activeSubTab === 'all' ? '#fff' : '#475569'}; display:flex; align-items:center; gap:6px;">
            <span>🌐 ทั้งหมด (All Assets)</span>
            <span style="background:${activeSubTab === 'all' ? 'rgba(255,255,255,0.25)' : '#e2e8f0'}; padding:1px 7px; border-radius:10px; font-size:11px;">${metrics.total}</span>
          </button>
        </div>

        <!-- Add Asset Button -->
        <div>
          <button type="button" id="btn-add-new-asset" class="btn" style="background:#059669; color:#fff; font-size:13px; font-weight:700; padding:8px 18px; border-radius:8px; border:none; display:flex; align-items:center; gap:6px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer;">
            <span>➕</span> เพิ่มรายการทรัพย์สินใหม่
          </button>
        </div>
      </div>

      <!-- 4. Filter & Search Controls Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 24px; background:#f8fafc; border-bottom:1px solid #e2e8f0; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; flex:1; max-width:480px;">
          <div style="position:relative; width:100%;">
            <input type="text" id="asset-search-input" value="${searchQuery}" placeholder="🔍 ค้นหา (รหัส Asset ID, ชื่อ, รุ่น, S/N, เลขครุภัณฑ์, IP, สถานที่)..."
              style="width:100%; font-size:12.5px; padding:7px 12px 7px 32px; border-radius:8px; border:1px solid #cbd5e1; background:#fff;" />
            <span style="position:absolute; left:10px; top:8px; color:#94a3b8; font-size:12px;">🔍</span>
          </div>
          ${searchQuery ? `<button type="button" id="btn-clear-asset-search" style="border:none; background:none; color:#ef4444; font-size:12px; cursor:pointer; font-weight:600;">ล้างค้นหา</button>` : ''}
        </div>

        <div style="display:flex; align-items:center; gap:12px; font-size:12px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="color:#64748b; font-weight:600;">กลุ่มทรัพย์สิน:</span>
            <select id="asset-group-filter-select" style="padding:5px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12px; font-weight:600; background:#fff; cursor:pointer;">
              <option value="all" ${groupFilter === 'all' ? 'selected' : ''}>ทั้งหมดทุกกลุ่ม (${allItems.length})</option>
              ${availableGroups.map(g => `<option value="${g}" ${groupFilter === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          </div>
          
          <button type="button" id="btn-reset-asset-default" class="btn" style="background:#fff; color:#dc2626; border:1px solid #fecaca; font-size:11.5px; font-weight:600; padding:5px 12px; border-radius:6px; cursor:pointer;">
            🔄 คืนค่าตั้งต้นเดิม (118 HW + 4 SW)
          </button>
        </div>
      </div>

      <!-- 5. Interactive Asset Register Data Table -->
      <div style="overflow-x:auto;">
        <table class="table" style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
          <thead>
            <tr style="background:#f1f5f9; color:#334155; border-bottom:2px solid #cbd5e1;">
              <th style="padding:10px 8px; width:45px; text-align:center; font-weight:700;">No.</th>
              <th style="padding:10px 10px; width:110px; font-weight:700; color:#1e40af;">รหัสทรัพย์สิน<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Asset No / ID)</span></th>
              <th style="padding:10px 10px; min-width:160px; font-weight:700;">ชื่อทรัพย์สิน<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Asset Name)</span></th>
              <th style="padding:10px 10px; width:120px; font-weight:700;">กลุ่มทรัพย์สิน<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Asset Group)</span></th>
              ${activeSubTab === 'software' ? `
                <th style="padding:10px 10px; min-width:140px; font-weight:700;">วัตถุประสงค์การใช้งาน<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Business Purpose)</span></th>
                <th style="padding:10px 10px; width:110px; font-weight:700;">วันหมดอายุ<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(EOL Date)</span></th>
                <th style="padding:10px 10px; width:110px; font-weight:700;">สิทธิ์ / หมายเหตุ<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Remarks)</span></th>
              ` : `
                <th style="padding:10px 10px; min-width:150px; font-weight:700;">คุณลักษณะ / สเปก<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Specification)</span></th>
                <th style="padding:10px 10px; width:135px; font-weight:700;">เลขทะเบียนครุภัณฑ์<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(HW Property Tag)</span></th>
                <th style="padding:10px 10px; min-width:160px; font-weight:700;">ผู้ผลิต/รุ่น/Serial No.<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Manufacturer/Model/SN)</span></th>
                <th style="padding:10px 10px; width:110px; font-weight:700;">IP Address<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Network Addr)</span></th>
              `}
              <th style="padding:10px 10px; min-width:140px; font-weight:700;">สถานที่ติดตั้ง<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Location)</span></th>
              <th style="padding:10px 10px; width:125px; text-align:center; font-weight:700;">วันที่อัปเดตล่าสุด<br/><span style="font-size:10.5px; font-weight:500; color:#64748b;">(Last Updated)</span></th>
              <th style="padding:10px 10px; width:80px; text-align:center; font-weight:700;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.length === 0 ? `
              <tr>
                <td colspan="11" style="text-align:center; padding:48px 20px; color:#94a3b8; font-size:13.5px;">
                  <div style="font-size:32px; margin-bottom:8px;">🔍</div>
                  ไม่พบรายการทรัพย์สินตามเงื่อนไขที่เลือก หรือยังไม่มีข้อมูลในหมวดนี้
                </td>
              </tr>
            ` : filteredItems.map((item, idx) => `
              <tr style="border-bottom:1px solid #e2e8f0; background:${idx % 2 === 0 ? '#fff' : '#fcfdfe'}; transition:background 0.15s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='${idx % 2 === 0 ? '#fff' : '#fcfdfe'}'">
                <td style="padding:10px 8px; text-align:center; font-weight:700; color:#64748b;">
                  ${item.no || (idx + 1)}
                </td>
                <td style="padding:10px 10px;">
                  <span style="display:inline-block; font-family:monospace; font-weight:800; font-size:12px; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 8px; border-radius:6px;">
                    ${item.assetId || '-'}
                  </span>
                </td>
                <td style="padding:10px 10px; font-weight:700; color:#0f172a;">
                  <div>${item.name || '-'}</div>
                  ${item.assetType && item.assetType !== item.name ? `<div style="font-size:10.5px; font-weight:500; color:#64748b; margin-top:2px;">${item.assetType}</div>` : ''}
                </td>
                <td style="padding:10px 10px;">
                  ${getAssetGroupBadge(item.assetGroup)}
                </td>
                ${activeSubTab === 'software' ? `
                  <td style="padding:10px 10px; color:#334155; line-height:1.4;">
                    ${item.purpose || item.spec || '-'}
                  </td>
                  <td style="padding:10px 10px; color:#64748b; font-weight:500;">
                    ${item.eol || '-'}
                  </td>
                  <td style="padding:10px 10px; color:#1e40af; font-weight:600;">
                    ${item.remarks || item.connectedComp || '-'}
                  </td>
                ` : `
                  <td style="padding:10px 10px; color:#334155; line-height:1.4;">
                    ${item.spec || '-'}
                  </td>
                  <td style="padding:10px 10px; color:#475569; font-family:monospace; font-size:11px;">
                    ${item.propTag && item.propTag !== 'N/A' && item.propTag !== '-' ? `<span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; border:1px solid #e2e8f0;">${item.propTag}</span>` : '<span style="color:#94a3b8;">-</span>'}
                  </td>
                  <td style="padding:10px 10px; color:#334155; font-size:11.5px; line-height:1.35;">
                    ${item.mfrModelSn && item.mfrModelSn !== 'N/A' ? item.mfrModelSn : '<span style="color:#94a3b8;">-</span>'}
                  </td>
                  <td style="padding:10px 10px;">
                    ${item.netAddr && item.netAddr !== 'N/A' ? `<span style="font-family:monospace; font-weight:700; color:#0284c7; background:#f0f9ff; border:1px solid #bae6fd; padding:1px 6px; border-radius:4px; font-size:11px;">${item.netAddr}</span>` : '<span style="color:#94a3b8;">-</span>'}
                  </td>
                `}
                <td style="padding:10px 10px; color:#475569; font-size:11.5px; line-height:1.35;">
                  ${item.location || '-'}
                </td>
                <td style="padding:10px 10px; text-align:center;">
                  <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                    <input type="date" class="asset-item-date-input" data-id="${item.id}" value="${item.lastUpdated || '2026-02-25'}" 
                      style="font-size:11px; padding:2px 4px; border:1px solid #cbd5e1; border-radius:5px; background:#fff; cursor:pointer; width:110px;" />
                    <span style="font-size:10px; color:#64748b; font-weight:500;">${formatThaiDate(item.lastUpdated)}</span>
                  </div>
                </td>
                <td style="padding:10px 10px; text-align:center;">
                  <div style="display:inline-flex; gap:4px;">
                    <button type="button" class="btn-edit-asset-item" data-id="${item.id}" title="แก้ไข/ดูรายละเอียด"
                      style="border:none; background:#eff6ff; color:#2563eb; padding:5px 8px; border-radius:6px; cursor:pointer; font-size:12px;">
                      ✏️
                    </button>
                    <button type="button" class="btn-delete-asset-item" data-id="${item.id}" title="ลบรายการ"
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
          แสดง <strong>${filteredItems.length}</strong> จากทั้งหมด <strong>${allItems.length}</strong> รายการทรัพย์สิน (Hardware: ${metrics.hardwareCount}, Software: ${metrics.softwareCount})
        </div>
        <div style="font-weight:600;">
          สำนักงานสาธารณสุขจังหวัดสระแก้ว • กลุ่มงานสุขภาพดิจิทัล
        </div>
      </div>

    </div>

    <!-- Modal 1: Add / Edit Asset Item -->
    <div id="modal-asset-item" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; align-items:center; justify-content:center; padding:16px;">
      <div style="background:#fff; width:100%; max-width:720px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.25); overflow:hidden; display:flex; flex-direction:column; max-height:92vh;">
        <div style="padding:16px 20px; background:#1e293b; color:#fff; display:flex; justify-content:space-between; align-items:center;">
          <h3 id="modal-asset-item-title" style="margin:0; font-size:1.15rem; font-weight:700;">➕ เพิ่มรายการทรัพย์สินใหม่</h3>
          <button type="button" id="btn-close-asset-modal" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer;">✕</button>
        </div>
        <div style="padding:20px; overflow-y:auto; flex:1; font-size:12.5px;">
          <form id="form-asset-item">
            <input type="hidden" id="form-asset-id" value="" />
            
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">หมวดหมู่หลัก *</label>
                <select id="form-asset-category" style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;">
                  <option value="hardware">🖥️ Hardware (ฮาร์ดแวร์ / อุปกรณ์)</option>
                  <option value="software">📱 Software (ซอฟต์แวร์ / แอปพลิเคชัน)</option>
                </select>
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#1e40af; margin-bottom:4px;">รหัสทรัพย์สิน (Asset No / ID) *</label>
                <input type="text" id="form-asset-aid" required placeholder="เช่น Server01, AIO21, SW 05" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px; font-family:monospace; font-weight:700;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">กลุ่มทรัพย์สิน (Asset Group)</label>
                <input type="text" id="form-asset-group" placeholder="เช่น Computer, Power, Network" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ชื่อทรัพย์สิน (Asset Name) *</label>
                <input type="text" id="form-asset-name" required placeholder="เช่น เครื่องคอมพิวเตอร์ All in one" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ชนิดทรัพย์สิน (Asset Type)</label>
                <input type="text" id="form-asset-type" placeholder="เช่น ครุภัณฑ์คอมพิวเตอร์, Rack Server" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">คุณลักษณะ / สเปก / วัตถุประสงค์ (Specification / Purpose)</label>
              <textarea id="form-asset-spec" rows="2" placeholder="รายละเอียดสเปก หรือวัตถุประสงค์การใช้งาน" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;"></textarea>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">เลขทะเบียนครุภัณฑ์ (Property Tag #)</label>
                <input type="text" id="form-asset-tag" placeholder="เช่น 7440-001-0006/246" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px; font-family:monospace;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ผู้ผลิต, รุ่น, Serial Number</label>
                <input type="text" id="form-asset-sn" placeholder="เช่น Lenovo: AIO 24ARR9" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">IP / Network Address</label>
                <input type="text" id="form-asset-ip" placeholder="เช่น 192.168.101.10" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px; font-family:monospace;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">เจ้าของ/ผู้รับผิดชอบ (Owner)</label>
                <input type="text" id="form-asset-owner" value="สสจ.สระแก้ว" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">วันที่อัปเดตล่าสุด</label>
                <input type="date" id="form-asset-date" value="2026-02-25" 
                  style="width:100%; padding:7px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">สถานที่/ตำแหน่งทางกายภาพ (Location)</label>
                <input type="text" id="form-asset-loc" placeholder="เช่น ห้อง Data Center, Wall Rack 1" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">วันที่จัดซื้อ / ผู้จัดส่ง (Purchase &amp; Supplier)</label>
                <input type="text" id="form-asset-supplier" placeholder="เช่น บจก. พีทีโอเอ เซ็นเตอร์" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">การเชื่อมต่อโครงสร้างพื้นฐาน / หมายเหตุ (Connected / Remarks)</label>
              <input type="text" id="form-asset-remarks" placeholder="เช่น Connected to Client Floor 1, 80 License" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
            </div>

          </form>
        </div>
        <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" id="btn-cancel-asset-modal" class="btn" style="background:#fff; color:#475569; border:1px solid #cbd5e1; font-size:13px; font-weight:600; padding:8px 16px; border-radius:6px; cursor:pointer;">
            ยกเลิก
          </button>
          <button type="button" id="btn-save-asset-item" class="btn" style="background:#2563eb; color:#fff; border:none; font-size:13px; font-weight:700; padding:8px 20px; border-radius:6px; cursor:pointer;">
            💾 บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 2: Edit Header Metadata -->
    <div id="modal-asset-meta" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; align-items:center; justify-content:center; padding:16px;">
      <div style="background:#fff; width:100%; max-width:620px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.25); overflow:hidden; display:flex; flex-direction:column;">
        <div style="padding:16px 20px; background:#1e293b; color:#fff; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:700;">✏️ แก้ไขข้อมูลส่วนหัวทะเบียนทรัพย์สิน</h3>
          <button type="button" id="btn-close-asset-meta-modal" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer;">✕</button>
        </div>
        <div style="padding:20px; overflow-y:auto; font-size:12.5px;">
          <form id="form-asset-meta">
            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ชื่อทะเบียนทรัพย์สิน</label>
              <input type="text" id="meta-doc-title" value="${meta.docTitle}" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ชื่อหน่วยงาน</label>
              <input type="text" id="meta-agency-name" value="${meta.agencyName}" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ผู้บันทึกทะเบียน</label>
                <input type="text" id="meta-recorder" value="${meta.recorder}" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">วันที่ทำการบันทึก / ปรับปรุงล่าสุด</label>
                <input type="date" id="meta-updated-date" value="${meta.updatedDate || '2026-02-25'}" 
                  style="width:100%; padding:7px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">สถานที่ / ศูนย์ข้อมูล</label>
                <input type="text" id="meta-location" value="${meta.location}" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
              <div>
                <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ระบบบริการที่สำคัญ</label>
                <input type="text" id="meta-main-system" value="${meta.mainSystem}" 
                  style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;" />
              </div>
            </div>

            <div style="margin-bottom:12px;">
              <label style="display:block; font-weight:700; color:#334155; margin-bottom:4px;">ที่อยู่หน่วยงาน</label>
              <textarea id="meta-address" rows="2" 
                style="width:100%; padding:8px 10px; border-radius:6px; border:1px solid #cbd5e1; font-size:12.5px;">${meta.address}</textarea>
            </div>
          </form>
        </div>
        <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" id="btn-cancel-asset-meta-modal" class="btn" style="background:#fff; color:#475569; border:1px solid #cbd5e1; font-size:13px; font-weight:600; padding:8px 16px; border-radius:6px; cursor:pointer;">
            ยกเลิก
          </button>
          <button type="button" id="btn-save-asset-meta" class="btn" style="background:#2563eb; color:#fff; border:none; font-size:13px; font-weight:700; padding:8px 20px; border-radius:6px; cursor:pointer;">
            💾 บันทึกส่วนหัว
          </button>
        </div>
      </div>
    </div>
  `
}

export function bindAssetInventoryEvents(containerEl, assetData, onAction) {
  if (!containerEl) return

  // 1. Subtab switcher
  containerEl.querySelectorAll('.asset-subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const subtab = btn.getAttribute('data-subtab')
      onAction({ type: 'SWITCH_SUBTAB', subtab })
    })
  })

  // 2. Search input
  const searchInput = containerEl.querySelector('#asset-search-input')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      onAction({ type: 'SEARCH', query: e.target.value })
    })
  }

  const btnClearSearch = containerEl.querySelector('#btn-clear-asset-search')
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      onAction({ type: 'SEARCH', query: '' })
    })
  }

  // 3. Group Filter
  const groupFilterSelect = containerEl.querySelector('#asset-group-filter-select')
  if (groupFilterSelect) {
    groupFilterSelect.addEventListener('change', (e) => {
      onAction({ type: 'FILTER_GROUP', groupFilter: e.target.value })
    })
  }

  // 4. Header Date Input Direct Change
  const headerDateInput = containerEl.querySelector('#header-asset-date-input')
  if (headerDateInput) {
    headerDateInput.addEventListener('change', (e) => {
      onAction({ type: 'UPDATE_HEADER_DATE', date: e.target.value })
    })
  }

  // 5. Item Date Input Direct Change
  containerEl.querySelectorAll('.asset-item-date-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const id = parseInt(inp.getAttribute('data-id'), 10)
      onAction({ type: 'UPDATE_ITEM_DATE', id, date: e.target.value })
    })
  })

  // 6. Reset to Default (118 HW + 4 SW)
  const btnReset = containerEl.querySelector('#btn-reset-asset-default')
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('คุณต้องการรีเซ็ตข้อมูลทะเบียนทรัพย์สินเป็นค่าเริ่มต้น (Hardware 118 รายการ และ Software 4 รายการ) ใช่หรือไม่?')) {
        onAction({ type: 'RESET_DEFAULT' })
      }
    })
  }

  // 7. Export Buttons
  const btnExportWord = containerEl.querySelector('#btn-export-asset-word')
  if (btnExportWord) {
    btnExportWord.addEventListener('click', () => {
      onAction({ type: 'EXPORT_WORD' })
    })
  }

  const btnExportCsv = containerEl.querySelector('#btn-export-asset-csv')
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      onAction({ type: 'EXPORT_CSV' })
    })
  }

  const btnPrint = containerEl.querySelector('#btn-print-asset-inv')
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print()
    })
  }

  // 8. Add Asset Modal Open
  const btnAdd = containerEl.querySelector('#btn-add-new-asset')
  const modalItem = containerEl.querySelector('#modal-asset-item')

  if (btnAdd && modalItem) {
    btnAdd.addEventListener('click', () => {
      containerEl.querySelector('#modal-asset-item-title').textContent = '➕ เพิ่มรายการทรัพย์สินใหม่'
      containerEl.querySelector('#form-asset-id').value = ''
      containerEl.querySelector('#form-asset-category').value = 'hardware'
      containerEl.querySelector('#form-asset-aid').value = ''
      containerEl.querySelector('#form-asset-group').value = 'Computer'
      containerEl.querySelector('#form-asset-name').value = ''
      containerEl.querySelector('#form-asset-type').value = 'ครุภัณฑ์คอมพิวเตอร์'
      containerEl.querySelector('#form-asset-spec').value = ''
      containerEl.querySelector('#form-asset-tag').value = ''
      containerEl.querySelector('#form-asset-sn').value = ''
      containerEl.querySelector('#form-asset-ip').value = ''
      containerEl.querySelector('#form-asset-owner').value = 'สสจ.สระแก้ว'
      containerEl.querySelector('#form-asset-date').value = new Date().toISOString().split('T')[0]
      containerEl.querySelector('#form-asset-loc').value = 'ห้อง Data Center'
      containerEl.querySelector('#form-asset-supplier').value = ''
      containerEl.querySelector('#form-asset-remarks').value = ''

      modalItem.style.display = 'flex'
    })
  }

  // Close Item Modal
  const btnCloseModal = containerEl.querySelector('#btn-close-asset-modal')
  const btnCancelModal = containerEl.querySelector('#btn-cancel-asset-modal')
  if (btnCloseModal && modalItem) {
    btnCloseModal.addEventListener('click', () => { modalItem.style.display = 'none' })
  }
  if (btnCancelModal && modalItem) {
    btnCancelModal.addEventListener('click', () => { modalItem.style.display = 'none' })
  }

  // Save Item (Add or Edit)
  const btnSaveItem = containerEl.querySelector('#btn-save-asset-item')
  if (btnSaveItem && modalItem) {
    btnSaveItem.addEventListener('click', () => {
      const name = containerEl.querySelector('#form-asset-name').value.trim()
      const assetId = containerEl.querySelector('#form-asset-aid').value.trim()

      if (!name) {
        alert('กรุณาระบุชื่อทรัพย์สิน (Asset Name)')
        return
      }
      if (!assetId) {
        alert('กรุณาระบุรหัสทรัพย์สิน (Asset No / ID)')
        return
      }

      const idVal = containerEl.querySelector('#form-asset-id').value
      const category = containerEl.querySelector('#form-asset-category').value
      const itemData = {
        id: idVal ? parseInt(idVal, 10) : Date.now(),
        category,
        assetId,
        assetGroup: containerEl.querySelector('#form-asset-group').value.trim(),
        name,
        assetType: containerEl.querySelector('#form-asset-type').value.trim(),
        spec: containerEl.querySelector('#form-asset-spec').value.trim(),
        purpose: containerEl.querySelector('#form-asset-spec').value.trim(),
        propTag: containerEl.querySelector('#form-asset-tag').value.trim(),
        mfrModelSn: containerEl.querySelector('#form-asset-sn').value.trim(),
        netAddr: containerEl.querySelector('#form-asset-ip').value.trim(),
        owner: containerEl.querySelector('#form-asset-owner').value.trim(),
        lastUpdated: containerEl.querySelector('#form-asset-date').value || '2026-02-25',
        location: containerEl.querySelector('#form-asset-loc').value.trim(),
        supplier: containerEl.querySelector('#form-asset-supplier').value.trim(),
        remarks: containerEl.querySelector('#form-asset-remarks').value.trim(),
        connectedComp: containerEl.querySelector('#form-asset-remarks').value.trim()
      }

      modalItem.style.display = 'none'
      onAction({
        type: idVal ? 'UPDATE_ITEM' : 'ADD_ITEM',
        item: itemData
      })
    })
  }

  // 9. Edit Item Modal Open
  containerEl.querySelectorAll('.btn-edit-asset-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10)
      const targetItem = (assetData?.items || []).find(it => it.id === id)
      if (!targetItem || !modalItem) return

      containerEl.querySelector('#modal-asset-item-title').textContent = `✏️ แก้ไขข้อมูลทรัพย์สิน (${targetItem.assetId || ''})`
      containerEl.querySelector('#form-asset-id').value = targetItem.id
      containerEl.querySelector('#form-asset-category').value = targetItem.category || (isSoftwareAsset(targetItem) ? 'software' : 'hardware')
      containerEl.querySelector('#form-asset-aid').value = targetItem.assetId || ''
      containerEl.querySelector('#form-asset-group').value = targetItem.assetGroup || ''
      containerEl.querySelector('#form-asset-name').value = targetItem.name || ''
      containerEl.querySelector('#form-asset-type').value = targetItem.assetType || ''
      containerEl.querySelector('#form-asset-spec').value = targetItem.spec || targetItem.purpose || ''
      containerEl.querySelector('#form-asset-tag').value = targetItem.propTag || ''
      containerEl.querySelector('#form-asset-sn').value = targetItem.mfrModelSn || ''
      containerEl.querySelector('#form-asset-ip').value = targetItem.netAddr || ''
      containerEl.querySelector('#form-asset-owner').value = targetItem.owner || 'สสจ.สระแก้ว'
      containerEl.querySelector('#form-asset-date').value = targetItem.lastUpdated || '2026-02-25'
      containerEl.querySelector('#form-asset-loc').value = targetItem.location || ''
      containerEl.querySelector('#form-asset-supplier').value = targetItem.supplier || targetItem.purchaseInfo || ''
      containerEl.querySelector('#form-asset-remarks').value = targetItem.remarks || targetItem.connectedComp || ''

      modalItem.style.display = 'flex'
    })
  })

  // 10. Delete Item
  containerEl.querySelectorAll('.btn-delete-asset-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10)
      const targetItem = (assetData?.items || []).find(it => it.id === id)
      if (!targetItem) return

      if (confirm(`คุณต้องการลบรายการทรัพย์สิน "${targetItem.assetId || ''} - ${targetItem.name}" ใช่หรือไม่?`)) {
        onAction({ type: 'DELETE_ITEM', id })
      }
    })
  })

  // 11. Header Meta Modal
  const btnEditMeta = containerEl.querySelector('#btn-edit-asset-meta')
  const modalMeta = containerEl.querySelector('#modal-asset-meta')
  const btnCloseMeta = containerEl.querySelector('#btn-close-asset-meta-modal')
  const btnCancelMeta = containerEl.querySelector('#btn-cancel-asset-meta-modal')
  const btnSaveMeta = containerEl.querySelector('#btn-save-asset-meta')

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
        docTitle: containerEl.querySelector('#meta-doc-title').value.trim(),
        subTitle: DEFAULT_ASSET_METADATA.subTitle,
        agencyName: containerEl.querySelector('#meta-agency-name').value.trim(),
        recorder: containerEl.querySelector('#meta-recorder').value.trim(),
        updatedDate: containerEl.querySelector('#meta-updated-date').value,
        location: containerEl.querySelector('#meta-location').value.trim(),
        address: containerEl.querySelector('#meta-address').value.trim(),
        mainSystem: containerEl.querySelector('#meta-main-system').value.trim()
      }

      modalMeta.style.display = 'none'
      onAction({ type: 'UPDATE_METADATA', metadata: updatedMeta })
    })
  }
}

export function exportAssetInventoryToCsv(assetData, activeSubTab = 'all') {
  const meta = assetData?.metadata || DEFAULT_ASSET_METADATA
  const items = assetData?.items || []

  let filtered = items
  if (activeSubTab === 'hardware') filtered = items.filter(it => it.category === 'hardware' || isHardwareAsset(it))
  else if (activeSubTab === 'software') filtered = items.filter(it => it.category === 'software' || isSoftwareAsset(it))

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""'
    const s = String(str).replace(/"/g, '""')
    return `"${s}"`
  }

  const csvRows = [
    `\uFEFF${escapeCsv(meta.docTitle)}`,
    `${escapeCsv('หน่วยงาน:')},${escapeCsv(meta.agencyName)}`,
    `${escapeCsv('ผู้บันทึก:')},${escapeCsv(meta.recorder)}`,
    `${escapeCsv('วันที่บันทึก/ปรับปรุงล่าสุด:')},${escapeCsv(formatThaiDate(meta.updatedDate))}`,
    `${escapeCsv('สถานที่/ศูนย์ข้อมูล:')},${escapeCsv(meta.location)}`,
    `${escapeCsv('ที่อยู่:')},${escapeCsv(meta.address)}`,
    `${escapeCsv('ระบบบริการที่สำคัญ:')},${escapeCsv(meta.mainSystem)}`,
    '',
    [
      'No',
      'Asset No / ID',
      'Asset Name',
      'Asset Category',
      'Asset Group',
      'Asset Type',
      'Asset Specification / Purpose',
      'HW Property tag #',
      'Manufacturer, Model #, Serial #',
      'Network Address',
      'Asset Physical Location',
      'Asset Owner',
      'Date Purchased',
      'Supplier',
      'Warranty / Remarks',
      'Last Updated Date'
    ].map(escapeCsv).join(',')
  ]

  filtered.forEach((it, index) => {
    csvRows.push([
      it.no || (index + 1),
      it.assetId || '',
      it.name || '',
      it.category || (isSoftwareAsset(it) ? 'software' : 'hardware'),
      it.assetGroup || '',
      it.assetType || '',
      it.spec || it.purpose || '',
      it.propTag || '',
      it.mfrModelSn || '',
      it.netAddr || '',
      it.location || '',
      it.owner || '',
      it.datePurchased || it.purchaseInfo || '',
      it.supplier || '',
      it.remarks || it.warranty || it.connectedComp || '',
      it.lastUpdated || ''
    ].map(escapeCsv).join(','))
  })

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `1.2_Asset_Inventory_Register_${activeSubTab}_${meta.updatedDate || '2569'}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportAssetInventoryToWord(assetData, activeSubTab = 'all') {
  const meta = assetData?.metadata || DEFAULT_ASSET_METADATA
  const items = assetData?.items || []
  const metrics = calculateAssetMetrics(items)

  let filtered = items
  let tabLabel = 'ทรัพย์สินทั้งหมด (All Assets)'
  if (activeSubTab === 'hardware') {
    filtered = items.filter(it => it.category === 'hardware' || isHardwareAsset(it))
    tabLabel = `อุปกรณ์ฮาร์ดแวร์และระบบเครือข่าย (Hardware - ${metrics.hardwareCount} รายการ)`
  } else if (activeSubTab === 'software') {
    filtered = items.filter(it => it.category === 'software' || isSoftwareAsset(it))
    tabLabel = `ซอฟต์แวร์และแอปพลิเคชัน (Software & Applications - ${metrics.softwareCount} รายการ)`
  }

  const tableRows = filtered.map((it, idx) => `
    <tr>
      <td style="text-align:center; padding:5px 3px; font-weight:bold;">${it.no || (idx + 1)}</td>
      <td style="padding:5px 5px; font-weight:bold; font-family:monospace; color:#1e40af; text-align:center;">${it.assetId || ''}</td>
      <td style="padding:5px 6px; font-weight:bold; color:#0f172a;">${it.name || ''}</td>
      <td style="padding:5px 5px; text-align:center;">${it.assetGroup || ''}</td>
      <td style="padding:5px 5px;">${it.spec || it.purpose || it.assetType || ''}</td>
      <td style="padding:5px 5px; font-family:monospace; font-size:10pt;">${it.propTag || '-'}</td>
      <td style="padding:5px 5px; font-size:10pt;">${it.mfrModelSn || '-'}</td>
      <td style="padding:5px 5px; font-family:monospace; font-size:10pt; text-align:center;">${it.netAddr || '-'}</td>
      <td style="padding:5px 5px; font-size:10pt;">${it.location || ''}</td>
      <td style="padding:5px 5px; font-size:10pt;">${it.remarks || it.connectedComp || it.warranty || '-'}</td>
      <td style="text-align:center; padding:5px 4px; font-size:10pt;">${formatThaiDate(it.lastUpdated)}</td>
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
          font-size: 13pt;
          line-height: 1.2;
          color: #000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 15px;
          font-size: 10.5pt;
        }
        th, td {
          border: 1px solid #333;
          vertical-align: top;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: center;
          padding: 6px 3px;
        }
        .header-meta-box {
          border: 1px solid #94a3b8;
          background-color: #f8fafc;
          padding: 10px 14px;
          margin-bottom: 12px;
          font-size: 12pt;
        }
      </style>
    </head>
    <body>
      <div style="text-align:center; margin-bottom:12px;">
        <img src="${LOGO_MOPH_BASE64}" width="65" height="65" style="margin-bottom:4px;" alt="MOPH Logo" />
        <h2 style="font-size:17pt; margin:4px 0 2px 0; font-weight:bold; color:#0f172a;">
          ${meta.docTitle}
        </h2>
        <div style="font-size:13pt; color:#334155; font-weight:bold;">
          ${meta.subTitle}
        </div>
        <div style="font-size:12pt; color:#475569;">
          ${meta.agencyName}
        </div>
      </div>

      <div class="header-meta-box">
        <table style="width:100%; border:none; margin:0; font-size:11.5pt;">
          <tr style="border:none;">
            <td style="border:none; width:50%; padding:2px 0;"><strong>ผู้บันทึกทะเบียน:</strong> ${meta.recorder}</td>
            <td style="border:none; width:50%; padding:2px 0;"><strong>วันที่ทำการบันทึก / ปรับปรุงล่าสุด:</strong> ${formatThaiDate(meta.updatedDate)}</td>
          </tr>
          <tr style="border:none;">
            <td style="border:none; padding:2px 0;"><strong>สถานที่ / ศูนย์ข้อมูล:</strong> ${meta.location}</td>
            <td style="border:none; padding:2px 0;"><strong>ระบบบริการที่สำคัญ:</strong> ${meta.mainSystem}</td>
          </tr>
          <tr style="border:none;">
            <td style="border:none; padding:2px 0;" colspan="2"><strong>ที่อยู่หน่วยงาน:</strong> ${meta.address}</td>
          </tr>
          <tr style="border:none;">
            <td style="border:none; padding:2px 0;" colspan="2"><strong>หมวดหมู่รายงาน:</strong> ${tabLabel} (แสดง ${filtered.length} จากทั้งหมด ${metrics.total} รายการ)</td>
          </tr>
        </table>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:28px;">No.</th>
            <th style="width:65px;">Asset No / ID</th>
            <th style="width:120px;">Asset Name</th>
            <th style="width:75px;">Group</th>
            <th style="width:130px;">Specification / Purpose</th>
            <th style="width:90px;">Property Tag #</th>
            <th style="width:120px;">Model / Serial No.</th>
            <th style="width:80px;">Network IP</th>
            <th style="width:95px;">Location</th>
            <th style="width:90px;">Remarks</th>
            <th style="width:75px;">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div style="margin-top:20px; font-size:12pt; display:flex; justify-content:space-between;">
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
  a.download = `1.2_Asset_Inventory_${activeSubTab}_${meta.updatedDate || '2569'}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
