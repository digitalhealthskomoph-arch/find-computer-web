import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import {
  DEFAULT_BIA_HEADER,
  DEFAULT_BIA_LOGS,
  DEFAULT_BIA_ITEMS,
  BIA_BCM_CONCEPTS,
  BIA_CLUSTERS
} from './biaData.js'
import { supabase } from '../../lib/supabase.js'
import { showNotification } from '../../lib/utils.js'

// Helper: Risk score styling badge
export function getBiaRiskBadge(score) {
  const num = Number(score) || 0
  if (num >= 20) {
    return { level: 'Extreme', label: `วิกฤต (${num})`, bg: '#fee2e2', color: '#991b1b', border: '#f87171' }
  } else if (num >= 10) {
    return { level: 'High', label: `สูง (${num})`, bg: '#ffedd5', color: '#9a3412', border: '#fb923c' }
  } else if (num >= 4) {
    return { level: 'Moderate', label: `ปานกลาง (${num})`, bg: '#fef9c3', color: '#854d0e', border: '#facc15' }
  } else {
    return { level: 'Low', label: `ต่ำ (${num})`, bg: '#dcfce7', color: '#166534', border: '#4ade80' }
  }
}

// Helper: CIA level styling badge
export function getCiaLevelBadge(level) {
  const str = String(level || 'ต่ำ').trim()
  if (str === 'สูง') {
    return { bg: '#fee2e2', color: '#991b1b', border: '#f87171' }
  } else if (str === 'กลาง') {
    return { bg: '#fef9c3', color: '#854d0e', border: '#facc15' }
  } else {
    return { bg: '#dcfce7', color: '#166534', border: '#4ade80' }
  }
}

// Calculate metrics across all BIA items
export function calculateBiaMetrics(items) {
  const list = items || []
  const total = list.length
  let sumScore = 0
  let totalFinancial = 0
  let criticalRtoCount = 0

  list.forEach(item => {
    const l = Number(item.likelihood) || 1
    const i = Number(item.impact) || 1
    const score = l * i
    item.risk_level = score
    sumScore += score

    totalFinancial += Number(item.financial_impact) || 0

    const rtoStr = String(item.rto || '').toLowerCase()
    if (rtoStr.includes('1 ชม') || rtoStr.includes('2 ชม') || rtoStr.includes('4 ชม') || rtoStr.includes('1 hr') || rtoStr.includes('2 hr') || rtoStr.includes('4 hr')) {
      criticalRtoCount++
    }
  })

  const overallAvg = total > 0 ? Math.round((sumScore / total) * 100) / 100 : 8.44

  return {
    total,
    overallAvg,
    totalFinancial,
    criticalRtoCount
  }
}

// Main HTML Renderer for Topic 1.6
export function renderBiaEvidentHtml(
  state,
  activeSubTab = '1-matrix',
  clusterFilter = 'all',
  searchQuery = '',
  viewMode = 'card'
) {
  const header = state?.header || DEFAULT_BIA_HEADER
  const logs = state?.logs || DEFAULT_BIA_LOGS
  const items = state?.items || DEFAULT_BIA_ITEMS
  const metrics = calculateBiaMetrics(items)

  // Filter items
  const filtered = items.filter(item => {
    if (clusterFilter !== 'all' && item.cluster !== clusterFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchName = (item.asset_name || '').toLowerCase().includes(q)
      const matchCluster = (item.cluster || '').toLowerCase().includes(q)
      const matchService = (item.critical_service || '').toLowerCase().includes(q)
      const matchOp = (item.operational_impact || '').toLowerCase().includes(q)
      if (!matchName && !matchCluster && !matchService && !matchOp) return false
    }
    return true
  })

  const subTabs = [
    { id: '0-log', label: '0. Update Log', badge: logs.length },
    { id: '1-matrix', label: '1. BIA Assessment Matrix', badge: `${metrics.total} บริการสำคัญ`, isMain: true },
    { id: '2-bcm', label: '2. BCM Knowledge & Criteria', badge: 'MTPD / RTO / RPO' }
  ]

  return `
    <div class="bia-evident-container" style="display:flex; flex-direction:column; gap:20px; font-family:'Sarabun', 'Prompt', -apple-system, sans-serif;">
      
      <!-- SUBTABS NAVIGATION BAR -->
      <div class="no-print" style="display:flex; flex-wrap:wrap; gap:8px; background:#f8fafc; padding:10px 14px; border-radius:12px; border:1px solid #e2e8f0; align-items:center; justify-content:space-between;">
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${subTabs.map(t => {
            const isActive = activeSubTab === t.id
            return `
              <button 
                class="bia-subtab-btn ${isActive ? 'active' : ''}" 
                data-subtab="${t.id}"
                style="
                  display:inline-flex; 
                  align-items:center; 
                  gap:8px; 
                  padding:8px 16px; 
                  border-radius:8px; 
                  font-size:13px; 
                  font-weight:${isActive ? '700' : '500'}; 
                  cursor:pointer; 
                  border:${isActive ? '1px solid #0f766e' : '1px solid #cbd5e1'}; 
                  background:${isActive ? '#0f766e' : '#ffffff'}; 
                  color:${isActive ? '#ffffff' : '#334155'};
                  box-shadow:${isActive ? '0 2px 4px rgba(15,118,110,0.2)' : 'none'};
                  transition: all 0.15s ease;
                "
              >
                <span>${t.label}</span>
                <span style="
                  font-size:11px; 
                  padding:1px 6px; 
                  border-radius:10px; 
                  background:${isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0'}; 
                  color:${isActive ? '#ffffff' : '#475569'};
                  font-weight:700;
                ">${t.badge}</span>
              </button>
            `
          }).join('')}
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#059669; font-weight:600; background:#ecfdf5; padding:4px 10px; border-radius:20px; border:1px solid #a7f3d0;">
            <span style="width:7px; height:7px; border-radius:50%; background:#10b981;"></span>
            ซิงค์อัตโนมัติ (Supabase & LocalStorage)
          </span>
        </div>
      </div>

      <!-- MAIN SUBTAB CONTENT -->
      ${activeSubTab === '0-log' ? renderBiaLogsSubtab(logs) : ''}
      ${activeSubTab === '1-matrix' ? renderBiaMatrixSubtab(header, filtered, metrics, clusterFilter, searchQuery, viewMode) : ''}
      ${activeSubTab === '2-bcm' ? renderBiaBcmSubtab() : ''}

    </div>
  `
}

// Subtab 0: Update Log
function renderBiaLogsSubtab(logs) {
  return `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <div>
          <h2 style="font-size:17px; font-weight:700; color:#1e293b; margin:0 0 4px 0;">0. Update Log (บันทึกประวัติการปรับปรุงเอกสาร BIA)</h2>
          <p style="font-size:12.5px; color:#64748b; margin:0;">ประวัติการปรับปรุงเงื่อนไข ผลกระทบ และระดับความเสี่ยงที่ยอมรับได้ (Risk Appetite)</p>
        </div>
        <button id="btn-add-bia-log" style="background:#0f766e; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer;">
          ➕ เพิ่มบันทึกใหม่
        </button>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
          <thead>
            <tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1; color:#334155;">
              <th style="padding:10px 14px; width:60px; text-align:center;">ลำดับ</th>
              <th style="padding:10px 14px; width:160px;">วันที่ปรับปรุง</th>
              <th style="padding:10px 14px;">สิ่งที่ปรับปรุง / แก้ไข</th>
              <th style="padding:10px 14px; width:100px; text-align:center;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${logs.length === 0 ? `
              <tr><td colspan="4" style="text-align:center; padding:24px; color:#94a3b8;">ยังไม่มีประวัติการปรับปรุง</td></tr>
            ` : logs.map((log, idx) => `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px 14px; text-align:center; font-weight:600; color:#64748b;">${idx + 1}</td>
                <td style="padding:10px 14px; font-weight:600; color:#0f766e;">${log.date || '-'}</td>
                <td style="padding:10px 14px; color:#334155;">${log.detail || '-'}</td>
                <td style="padding:10px 14px; text-align:center;">
                  <button class="btn-del-bia-log" data-id="${log.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:13px; padding:2px 6px;">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// Subtab 1: BIA Assessment Matrix (Main)
function renderBiaMatrixSubtab(header, items, metrics, clusterFilter, searchQuery, viewMode) {
  const formattedFin = new Intl.NumberFormat('th-TH').format(metrics.totalFinancial)

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- 1. EDITABLE HEADER CARD WITH LOGO & SUMMARY -->
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; box-shadow:0 1px 3px rgba(0,0,0,0.05); overflow:hidden;">
        
        <!-- Header Banner -->
        <div style="background:linear-gradient(135deg, #042f2e 0%, #115e59 100%); color:#ffffff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="background:#ffffff; border-radius:10px; padding:6px; display:flex; align-items:center; justify-content:center; width:58px; height:58px; box-shadow:0 2px 6px rgba(0,0,0,0.2);">
              <img src="${LOGO_MOPH_BASE64}" alt="ตรากระทรวงสาธารณสุข" style="max-height:46px; max-width:46px; object-fit:contain;" />
            </div>
            <div>
              <div style="font-size:12px; color:#99f6e4; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">กลุ่มงานสุขภาพดิจิทัล สำนักงานสาธารณสุขจังหวัดสระแก้ว</div>
              <h1 style="font-size:18px; font-weight:700; margin:3px 0 0 0; color:#f0fdfa;">
                การวิเคราะห์ผลกระทบทางธุรกิจ (1.6 Business Impact Analysis - BIA)
              </h1>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:10px;">
            <button id="btn-edit-bia-header" style="background:rgba(255,255,255,0.18); color:#ffffff; border:1px solid rgba(255,255,255,0.3); padding:8px 14px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              ✏️ แก้ไขหัวรายงาน
            </button>
          </div>
        </div>

        <!-- Metadata Grid -->
        <div style="padding:18px 24px; background:#f0fdfa; border-bottom:1px solid #ccfbf1; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; font-size:13px;">
          <div>
            <div style="color:#0f766e; font-size:11.5px; font-weight:600;">ผู้บันทึก :</div>
            <div style="color:#134e4a; font-weight:600;">${header.recorder || '-'}</div>
          </div>
          <div>
            <div style="color:#0f766e; font-size:11.5px; font-weight:600;">วันที่ทำการบันทึก :</div>
            <div style="color:#0d9488; font-weight:700;">${header.record_date || '-'}</div>
          </div>
          <div>
            <div style="color:#0f766e; font-size:11.5px; font-weight:600;">สถานที่ :</div>
            <div style="color:#134e4a; font-weight:600;">${header.location || '-'}</div>
          </div>
          <div>
            <div style="color:#0f766e; font-size:11.5px; font-weight:600;">ระบบบริการที่สำคัญ :</div>
            <div style="color:#115e59; font-weight:700;">${header.critical_service || 'All critical application'}</div>
          </div>
        </div>

        <!-- 4 BIA KPI CARDS -->
        <div style="padding:18px 24px; background:#ffffff; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
          
          <!-- Card 1: Overall Risk Score -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:4px;">
            <span style="font-size:12px; color:#64748b; font-weight:600;">คะแนนความเสี่ยงเฉลี่ยรวม (Overall Score)</span>
            <div style="font-size:24px; font-weight:800; color:#0f766e;">${metrics.overallAvg}</div>
            <span style="font-size:11.5px; color:#10b981; font-weight:600;">เกณฑ์ปานกลาง (ค่ามาตรฐาน 8.44)</span>
          </div>

          <!-- Card 2: Financial Impact Total -->
          <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:4px;">
            <span style="font-size:12px; color:#991b1b; font-weight:600;">ผลกระทบทางการเงินรวม (บาท/วัน)</span>
            <div style="font-size:24px; font-weight:800; color:#b91c1c;">฿${formattedFin}</div>
            <span style="font-size:11.5px; color:#dc2626;">ประเมินความเสียหายกรณีระบบหยุดชะงัก</span>
          </div>

          <!-- Card 3: Critical RTO Systems -->
          <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:4px;">
            <span style="font-size:12px; color:#92400e; font-weight:600;">บริการวิกฤตสูงสุด (RTO &le; 4 ชม.)</span>
            <div style="font-size:24px; font-weight:800; color:#d97706;">${metrics.criticalRtoCount} ระบบ</div>
            <span style="font-size:11.5px; color:#b45309;">เช่น Router, Firewall, สารบรรณ, Plan-D</span>
          </div>

          <!-- Card 4: Total Systems -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:4px;">
            <span style="font-size:12px; color:#166534; font-weight:600;">ระบบและบริการสำคัญทั้งหมด</span>
            <div style="font-size:24px; font-weight:800; color:#15803d;">${metrics.total} รายการ</div>
            <span style="font-size:11.5px; color:#16a34a;">ครอบคลุมทั้ง HW และ Applications</span>
          </div>

        </div>
      </div>

      <!-- 2. TOOLBAR & CONTROLS -->
      <div class="no-print" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px 20px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <!-- Dual View Toggle -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:12.5px; font-weight:700; color:#475569; margin-right:4px;">รูปแบบการแสดงผล:</span>
            <button 
              id="btn-bia-view-card" 
              style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; font-size:12.5px; font-weight:700; cursor:pointer; border:1px solid ${viewMode === 'card' ? '#0f766e' : '#cbd5e1'}; background:${viewMode === 'card' ? '#0f766e' : '#ffffff'}; color:${viewMode === 'card' ? '#ffffff' : '#475569'};"
            >
              🗂️ มุมมองการ์ดแบ่ง 3 ส่วน (Card View)
            </button>
            <button 
              id="btn-bia-view-table" 
              style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; font-size:12.5px; font-weight:700; cursor:pointer; border:1px solid ${viewMode === 'table' ? '#0f766e' : '#cbd5e1'}; background:${viewMode === 'table' ? '#0f766e' : '#ffffff'}; color:${viewMode === 'table' ? '#ffffff' : '#475569'};"
            >
              📊 มุมมองตาราง Excel (Data Grid View)
            </button>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <button id="btn-add-bia-item" style="background:#0f766e; color:#ffffff; border:none; padding:7px 14px; border-radius:7px; font-size:12.5px; font-weight:600; cursor:pointer;">
              ➕ เพิ่มบริการสำคัญใหม่
            </button>
            <button id="btn-export-bia-word" style="background:#2563eb; color:#ffffff; border:none; padding:7px 12px; border-radius:7px; font-size:12.5px; font-weight:600; cursor:pointer;">
              📄 Export Word
            </button>
            <button id="btn-export-bia-csv" style="background:#059669; color:#ffffff; border:none; padding:7px 12px; border-radius:7px; font-size:12.5px; font-weight:600; cursor:pointer;">
              📊 Export Excel (CSV)
            </button>
            <button id="btn-print-bia" style="background:#475569; color:#ffffff; border:none; padding:7px 12px; border-radius:7px; font-size:12.5px; font-weight:600; cursor:pointer;">
              🖨️ พิมพ์ / PDF
            </button>
            <button id="btn-reset-bia-default" style="background:none; border:1px solid #cbd5e1; color:#64748b; padding:6px 10px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer;">
              🔄 รีเซ็ตค่าเริ่มต้น
            </button>
          </div>
        </div>

        <!-- Filter Pills by Cluster -->
        <div>
          <div style="font-size:11.5px; font-weight:700; color:#64748b; margin-bottom:6px;">กรองตามประเภททรัพย์สิน / Cluster:</div>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            <button 
              class="bia-cluster-pill ${clusterFilter === 'all' ? 'active' : ''}" 
              data-cluster="all"
              style="padding:4px 12px; border-radius:14px; font-size:12px; font-weight:${clusterFilter === 'all' ? '700' : '500'}; border:1px solid ${clusterFilter === 'all' ? '#0f766e' : '#cbd5e1'}; background:${clusterFilter === 'all' ? '#ccfbf1' : '#ffffff'}; color:${clusterFilter === 'all' ? '#0f766e' : '#475569'}; cursor:pointer;"
            >
              ทั้งหมด (${metrics.total})
            </button>
            ${BIA_CLUSTERS.map(c => {
              const isPillActive = clusterFilter === c
              const count = items.filter(it => it.cluster === c).length
              if (count === 0) return ''
              return `
                <button 
                  class="bia-cluster-pill ${isPillActive ? 'active' : ''}" 
                  data-cluster="${c}"
                  style="padding:4px 12px; border-radius:14px; font-size:12px; font-weight:${isPillActive ? '700' : '500'}; border:1px solid ${isPillActive ? '#0f766e' : '#cbd5e1'}; background:${isPillActive ? '#ccfbf1' : '#ffffff'}; color:${isPillActive ? '#0f766e' : '#475569'}; cursor:pointer;"
                >
                  ${c} (${count})
                </button>
              `
            }).join('')}
          </div>
        </div>

        <!-- Search Bar -->
        <div>
          <input 
            type="text" 
            id="input-bia-search" 
            placeholder="🔍 ค้นหาชื่อบริการสำคัญ, ทรัพย์สิน, หรือผลกระทบด้านการปฏิบัติการ..." 
            value="${searchQuery}"
            style="width:100%; box-sizing:border-box; padding:8px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px;"
          />
        </div>
      </div>

      <!-- 3. MAIN DATA VIEW (Step Card View OR Data Grid View) -->
      ${viewMode === 'card' ? renderBiaCardView(items) : renderBiaDataGridView(items)}

    </div>
  `
}

// 3.1 Step Card View
function renderBiaCardView(items) {
  if (items.length === 0) {
    return `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:40px; text-align:center; color:#94a3b8;">
        ไม่พบข้อมูลตามเงื่อนไขที่เลือก
      </div>
    `
  }

  return `
    <div style="display:flex; flex-direction:column; gap:16px;">
      ${items.map(item => {
        const badge = getBiaRiskBadge(item.risk_level)
        const badgeC = getCiaLevelBadge(item.impact_c)
        const badgeI = getCiaLevelBadge(item.impact_i)
        const badgeA = getCiaLevelBadge(item.impact_a)
        const formattedFin = new Intl.NumberFormat('th-TH').format(item.financial_impact || 0)

        return `
          <div class="bia-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.05); overflow:hidden;">
            
            <!-- Card Header -->
            <div style="padding:14px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-size:12px; font-weight:700; color:#64748b; background:#e2e8f0; padding:2px 8px; border-radius:4px;">
                  ข้อที่ ${item.order_num || '-'}
                </span>
                <span style="font-size:12px; font-weight:600; color:#0f766e; background:#ccfbf1; padding:2px 8px; border-radius:4px;">
                  ${item.cluster}
                </span>
                <h3 style="font-size:16px; font-weight:700; color:#0f172a; margin:0;">
                  ${item.asset_name}
                </h3>
              </div>

              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:12px; font-weight:700; padding:4px 10px; border-radius:6px; background:${badge.bg}; color:${badge.color}; border:1px solid ${badge.border};">
                  ระดับความเสี่ยง: ${badge.label}
                </span>
                <button class="btn-edit-bia-item" data-id="${item.id}" style="background:none; border:1px solid #cbd5e1; border-radius:6px; padding:4px 8px; color:#0f766e; cursor:pointer; font-size:12px; font-weight:600;">
                  ✏️ แก้ไข
                </button>
                <button class="btn-del-bia-item" data-id="${item.id}" style="background:none; border:1px solid #fecaca; border-radius:6px; padding:4px 8px; color:#ef4444; cursor:pointer; font-size:12px; font-weight:600;">
                  🗑️
                </button>
              </div>
            </div>

            <!-- Card Body - 3 Sections -->
            <div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
              
              <!-- SECTION 1: Service Description & Risk Score -->
              <div style="display:grid; grid-template-columns:1fr 1fr 220px; gap:14px; background:#f8fafc; padding:12px 16px; border-radius:8px; font-size:12.5px;">
                <div>
                  <span style="color:#64748b; font-weight:600;">คำอธิบายบริการ/ระบบ:</span>
                  <div style="color:#1e293b; margin-top:2px;">${item.description || '-'}</div>
                </div>
                <div>
                  <span style="color:#64748b; font-weight:600;">บริการ/ฟังก์ชันที่สำคัญ:</span>
                  <div style="color:#1e293b; margin-top:2px;">${item.critical_service || '-'}</div>
                </div>
                <div style="border-left:1px solid #e2e8f0; padding-left:12px;">
                  <span style="color:#64748b; font-weight:600;">Risk Analyst:</span>
                  <div style="margin-top:2px;">
                    โอกาสเกิด (A) = <strong>${item.likelihood || 1}</strong> &times; รุนแรง (B) = <strong>${item.impact || 1}</strong>
                    <div style="font-weight:700; color:#0f766e; margin-top:2px;">&rArr; ระดับความเสี่ยง = ${item.risk_level || 1}</div>
                  </div>
                </div>
              </div>

              <!-- SECTION 2: CIA Impact Level & 4 Impact Domains -->
              <div style="display:grid; grid-template-columns:240px 1fr; gap:14px; font-size:12.5px;">
                
                <!-- CIA Box -->
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:8px;">
                  <strong style="color:#334155; font-size:12.5px;">ระดับผลกระทบที่อาจเกิดขึ้น (CIA):</strong>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#475569;">ความลับ (Confidential):</span>
                    <span style="padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px; background:${badgeC.bg}; color:${badgeC.color}; border:1px solid ${badgeC.border};">${item.impact_c}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#475569;">ความถูกต้อง (Integrity):</span>
                    <span style="padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px; background:${badgeI.bg}; color:${badgeI.color}; border:1px solid ${badgeI.border};">${item.impact_i}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#475569;">ความพร้อมใช้ (Availability):</span>
                    <span style="padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px; background:${badgeA.bg}; color:${badgeA.color}; border:1px solid ${badgeA.border};">${item.impact_a}</span>
                  </div>
                </div>

                <!-- 4 Impact Domains -->
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
                  <div>
                    <span style="color:#b91c1c; font-weight:700;">💰 ผลกระทบทางการเงิน:</span>
                    <div style="font-size:13px; font-weight:700; color:#991b1b; margin-top:2px;">฿${formattedFin} บาท/วัน</div>
                  </div>
                  <div>
                    <span style="color:#c2410c; font-weight:700;">⚙️ ผลกระทบด้านการปฏิบัติการ:</span>
                    <div style="color:#431407; margin-top:2px;">${item.operational_impact || '-'}</div>
                  </div>
                  <div>
                    <span style="color:#1d4ed8; font-weight:700;">⚖️ ผลกระทบกฎหมาย/ระเบียบ:</span>
                    <div style="color:#172554; margin-top:2px;">${item.law_regulatory_impact || '-'}</div>
                  </div>
                  <div>
                    <span style="color:#6b21a8; font-weight:700;">🏢 ผลกระทบชื่อเสียง/ภาพลักษณ์:</span>
                    <div style="color:#3b0764; margin-top:2px;">${item.reputational_impact || '-'}</div>
                  </div>
                </div>

              </div>

              <!-- SECTION 3: BCM Targets (MTPD, RTO, RPO) -->
              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; font-size:12.5px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <strong style="color:#166534; font-size:13px;">เป้าหมายความต่อเนื่องทางธุรกิจ (BCM):</strong>
                </div>

                <div style="display:flex; gap:24px; flex-wrap:wrap;">
                  <div>
                    <span style="color:#15803d; font-weight:600;">MTPD (หยุดได้สูงสุด):</span>
                    <strong style="color:#166534; font-size:13.5px; margin-left:4px;">${item.mtpd || '-'}</strong>
                  </div>
                  <div>
                    <span style="color:#15803d; font-weight:600;">RTO (กู้คืนภายใน):</span>
                    <strong style="color:#0f766e; font-size:13.5px; margin-left:4px;">${item.rto || '-'}</strong>
                  </div>
                  <div>
                    <span style="color:#15803d; font-weight:600;">RPO (ข้อมูลหายได้ไม่เกิน):</span>
                    <strong style="color:#0369a1; font-size:13.5px; margin-left:4px;">${item.rpo || '-'}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

// 3.2 Data Grid View (Excel-like wide table)
function renderBiaDataGridView(items) {
  return `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="overflow-x:auto; max-height:800px;">
        <table class="bia-datagrid" style="width:100%; min-width:2400px; border-collapse:collapse; font-size:12px; text-align:left;">
          <thead>
            <!-- Top Group Headers -->
            <tr style="background:#042f2e; color:#ffffff; text-align:center; font-weight:700;">
              <th colspan="6" style="padding:10px; border:1px solid #115e59; background:#042f2e;">ข้อมูลทรัพย์สินและบริการสำคัญ</th>
              <th colspan="3" style="padding:10px; border:1px solid #115e59; background:#115e59;">Risk Analyst</th>
              <th colspan="3" style="padding:10px; border:1px solid #115e59; background:#0f766e;">ระดับผลกระทบที่อาจเกิดขึ้น (CIA)</th>
              <th colspan="4" style="padding:10px; border:1px solid #115e59; background:#1e3a8a;">ผลกระทบด้านต่างๆ</th>
              <th colspan="3" style="padding:10px; border:1px solid #115e59; background:#14532d;">เป้าหมาย BCM</th>
              <th rowspan="2" style="padding:10px; border:1px solid #115e59; background:#042f2e; width:80px;">จัดการ</th>
            </tr>

            <!-- Subheaders -->
            <tr style="background:#f1f5f9; color:#334155; text-align:center; font-weight:700;">
              <th style="padding:8px; border:1px solid #cbd5e1; width:45px;">No.</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:140px;">Type of Asset / Cluster</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:160px;">Asset Name</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:180px;">Description</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:220px;">Critical Services / Functions</th>
              
              <!-- Risk Analyst -->
              <th style="padding:8px; border:1px solid #cbd5e1; width:55px;">A (เกิด)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:55px;">B (แรง)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:65px;">ระดับความเสี่ยง</th>

              <!-- CIA -->
              <th style="padding:8px; border:1px solid #cbd5e1; width:80px;">ความลับ (C)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:80px;">ความถูกต้อง (I)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:80px;">พร้อมใช้ (A)</th>

              <!-- 4 Domains -->
              <th style="padding:8px; border:1px solid #cbd5e1; width:120px;">Financial Impact (บาท/วัน)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:180px;">Operational Impact</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:180px;">Law / Regulatory Impact</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:180px;">Reputational / Image Impact</th>

              <!-- BCM -->
              <th style="padding:8px; border:1px solid #cbd5e1; width:90px;">MTPD</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:90px;">RTO</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:90px;">RPO</th>
            </tr>
          </thead>

          <tbody>
            ${items.map(item => {
              const badge = getBiaRiskBadge(item.risk_level)
              const badgeC = getCiaLevelBadge(item.impact_c)
              const badgeI = getCiaLevelBadge(item.impact_i)
              const badgeA = getCiaLevelBadge(item.impact_a)
              const formattedFin = new Intl.NumberFormat('th-TH').format(item.financial_impact || 0)

              return `
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#64748b;">${item.order_num || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; font-weight:600; color:#0f766e;">${item.cluster}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; font-weight:700; color:#0f172a;">${item.asset_name}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#475569;">${item.description || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#334155;">${item.critical_service || '-'}</td>

                  <!-- Risk Analyst -->
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:600;">${item.likelihood || 1}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:600;">${item.impact || 1}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:800; background:${badge.bg}; color:${badge.color};">${item.risk_level || 1}</td>

                  <!-- CIA -->
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">
                    <span style="padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px; background:${badgeC.bg}; color:${badgeC.color};">${item.impact_c}</span>
                  </td>
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">
                    <span style="padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px; background:${badgeI.bg}; color:${badgeI.color};">${item.impact_i}</span>
                  </td>
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">
                    <span style="padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px; background:${badgeA.bg}; color:${badgeA.color};">${item.impact_a}</span>
                  </td>

                  <!-- 4 Domains -->
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:right; font-weight:700; color:#991b1b;">฿${formattedFin}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#431407;">${item.operational_impact || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#172554;">${item.law_regulatory_impact || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#3b0764;">${item.reputational_impact || '-'}</td>

                  <!-- BCM -->
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:600; color:#166534;">${item.mtpd || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#0f766e;">${item.rto || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#0369a1;">${item.rpo || '-'}</td>

                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">
                    <button class="btn-edit-bia-item" data-id="${item.id}" style="background:none; border:none; color:#0f766e; cursor:pointer; font-size:14px; padding:2px;">✏️</button>
                    <button class="btn-del-bia-item" data-id="${item.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:14px; padding:2px;">🗑️</button>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// Subtab 2: BCM Concepts & Criteria
function renderBiaBcmSubtab() {
  return `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:24px;">
      
      <div>
        <h2 style="font-size:17px; font-weight:700; color:#1e293b; margin:0 0 6px 0;">2. BCM Knowledge & Criteria (แนวคิดการบริหารความต่อเนื่องและเกณฑ์ประเมิน)</h2>
        <p style="font-size:13px; color:#64748b; margin:0;">ทำความเข้าใจเกี่ยวกับ MTPD, RTO, RPO ในการวางแผน Business Continuity Management (BCM) และ Disaster Recovery (DR)</p>
      </div>

      <!-- 3 Concept Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
        ${BIA_BCM_CONCEPTS.map(c => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px; display:flex; flex-direction:column; gap:10px;">
            <strong style="color:#0f766e; font-size:14.5px;">${c.term}</strong>
            <p style="font-size:13px; color:#334155; margin:0; line-height:1.5;">${c.definition}</p>
            <div style="font-size:12px; color:#64748b; background:#ffffff; padding:10px; border-radius:6px; border:1px solid #e2e8f0;">
              💡 <strong>ตัวอย่าง:</strong> ${c.example}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Comparison Diagram Box -->
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:18px;">
        <h3 style="margin:0 0 8px 0; font-size:14px; color:#166534;">ความสัมพันธ์เชิงเวลา (Timeline Relationship)</h3>
        <p style="margin:0; font-size:13px; color:#14532d; line-height:1.6;">
          <strong>RTO ต้องสั้นกว่า MTPD เสมอ (RTO &lt; MTPD):</strong> เพราะองค์กรต้องกู้คืนระบบและบริการให้กลับมาใช้งานได้ก่อนที่จะถึงจุดที่ธุรกิจ/บริการหลักยอมรับไม่ได้<br>
          <strong>RPO ขึ้นอยู่กับความถี่ในการสำรองข้อมูล:</strong> ยิ่ง RPO สั้นเท่าใด หมายความว่าต้องมีการสำรองข้อมูลบ่อยขึ้นเท่านั้นเพื่อลดการสูญหายของข้อมูล
        </p>
      </div>

    </div>
  `
}

// 4. Modals (Header, Item CRUD)
export function showBiaHeaderModal(header, onSave) {
  const overlay = document.createElement('div')
  overlay.className = 'bia-modal-overlay'
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;'

  overlay.innerHTML = `
    <div style="background:#fff; border-radius:14px; width:100%; max-width:540px; box-shadow:0 10px 25px rgba(0,0,0,0.2); overflow:hidden;">
      <div style="padding:16px 20px; background:#042f2e; color:#fff; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size:16px; font-weight:700;">✏️ แก้ไขข้อมูลส่วนหัวรายงาน BIA</h3>
        <button id="btn-close-bia-header" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>
      </div>

      <div style="padding:20px; display:flex; flex-direction:column; gap:14px; font-size:13px;">
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ผู้บันทึก:</label>
          <input type="text" id="m-bia-recorder" value="${header.recorder || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">วันที่ทำการบันทึก:</label>
          <input type="text" id="m-bia-date" value="${header.record_date || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">สถานที่:</label>
          <input type="text" id="m-bia-location" value="${header.location || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ที่อยู่:</label>
          <input type="text" id="m-bia-address" value="${header.address || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ระบบบริการที่สำคัญ:</label>
          <input type="text" id="m-bia-critical" value="${header.critical_service || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
      </div>

      <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
        <button id="btn-cancel-bia-header" style="background:#e2e8f0; color:#475569; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:600;">ยกเลิก</button>
        <button id="btn-save-bia-header" style="background:#0f766e; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600;">บันทึกข้อมูล</button>
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  const close = () => overlay.remove()
  overlay.querySelector('#btn-close-bia-header').onclick = close
  overlay.querySelector('#btn-cancel-bia-header').onclick = close

  overlay.querySelector('#btn-save-bia-header').onclick = () => {
    const updated = {
      ...header,
      recorder: overlay.querySelector('#m-bia-recorder').value.trim(),
      record_date: overlay.querySelector('#m-bia-date').value.trim(),
      location: overlay.querySelector('#m-bia-location').value.trim(),
      address: overlay.querySelector('#m-bia-address').value.trim(),
      critical_service: overlay.querySelector('#m-bia-critical').value.trim()
    }
    onSave(updated)
    close()
  }
}

// BIA Item Add/Edit Modal
export function showBiaItemModal(item = null, onSave) {
  const isEdit = !!item
  const overlay = document.createElement('div')
  overlay.className = 'bia-modal-overlay'
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;'

  const current = item || {
    order_num: 1,
    cluster: 'Application-Major',
    asset_name: '',
    description: '',
    critical_service: '',
    likelihood: 2, impact: 4, risk_level: 8,
    impact_c: 'กลาง', impact_i: 'กลาง', impact_a: 'กลาง',
    financial_impact: 10000,
    operational_impact: '',
    law_regulatory_impact: '',
    reputational_impact: '',
    mtpd: '24 ชม.', rto: '4 ชม.', rpo: '4 ชม.'
  }

  overlay.innerHTML = `
    <div style="background:#fff; border-radius:14px; width:100%; max-width:800px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 15px 35px rgba(0,0,0,0.3); overflow:hidden;">
      <div style="padding:16px 20px; background:#042f2e; color:#fff; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size:16px; font-weight:700;">${isEdit ? '✏️ แก้ไขข้อมูล BIA ของบริการสำคัญ' : '➕ เพิ่มบริการสำคัญใหม่ (BIA)'}</h3>
        <button id="btn-close-bia-modal" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>
      </div>

      <div style="padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; font-size:13px;">
        
        <!-- Row 1: Order, Cluster, Name -->
        <div style="display:grid; grid-template-columns:80px 180px 1fr; gap:12px;">
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ลำดับ No.</label>
            <input type="number" id="m-bia-order" value="${current.order_num}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">Cluster</label>
            <select id="m-bia-cluster" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;">
              ${BIA_CLUSTERS.map(c => `<option value="${c}" ${current.cluster === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ชื่อทรัพย์สิน/บริการสำคัญ *</label>
            <input type="text" id="m-bia-name" value="${current.asset_name}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" required />
          </div>
        </div>

        <!-- Row 2: Desc & Service -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">คำอธิบาย (Description)</label>
            <input type="text" id="m-bia-desc" value="${current.description || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">บริการ/ฟังก์ชันที่สำคัญ (Critical Functions)</label>
            <input type="text" id="m-bia-service" value="${current.critical_service || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
        </div>

        <!-- Row 3: Likelihood, Impact, CIA -->
        <div style="display:grid; grid-template-columns:100px 100px 1fr 1fr 1fr; gap:10px; background:#f8fafc; padding:12px; border-radius:8px;">
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">โอกาสเกิด (A)</label>
            <select id="m-bia-like" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;">
              ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${Number(current.likelihood) === v ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ความรุนแรง (B)</label>
            <select id="m-bia-imp" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;">
              ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${Number(current.impact) === v ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ความลับ (C)</label>
            <select id="m-bia-c" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;">
              ${['สูง', 'กลาง', 'ต่ำ'].map(l => `<option value="${l}" ${current.impact_c === l ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ความถูกต้อง (I)</label>
            <select id="m-bia-i" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;">
              ${['สูง', 'กลาง', 'ต่ำ'].map(l => `<option value="${l}" ${current.impact_i === l ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ความพร้อมใช้ (A)</label>
            <select id="m-bia-a" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;">
              ${['สูง', 'กลาง', 'ต่ำ'].map(l => `<option value="${l}" ${current.impact_a === l ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Row 4: 4 Domains -->
        <div>
          <label style="display:block; font-weight:600; color:#b91c1c; margin-bottom:4px;">Financial Impact (บาทต่อวัน)</label>
          <input type="number" id="m-bia-fin" value="${current.financial_impact || 0}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>

        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">Operational Impact (ผลกระทบด้านการปฏิบัติการ)</label>
          <input type="text" id="m-bia-op" value="${current.operational_impact || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">Law / Regulatory Impact (กฎหมาย/ระเบียบ)</label>
            <input type="text" id="m-bia-law" value="${current.law_regulatory_impact || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">Reputational / Image Impact (ชื่อเสียง/ภาพลักษณ์)</label>
            <input type="text" id="m-bia-rep" value="${current.reputational_impact || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
        </div>

        <!-- Row 5: BCM (MTPD, RTO, RPO) -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; background:#f0fdf4; padding:12px; border-radius:8px;">
          <div>
            <label style="display:block; font-weight:700; color:#166534; margin-bottom:4px;">MTPD (หยุดได้สูงสุด)</label>
            <input type="text" id="m-bia-mtpd" value="${current.mtpd || ''}" placeholder="เช่น 24 ชม., 7 วัน" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
          <div>
            <label style="display:block; font-weight:700; color:#166534; margin-bottom:4px;">RTO (กู้คืนภายใน)</label>
            <input type="text" id="m-bia-rto" value="${current.rto || ''}" placeholder="เช่น 4 ชม., 24 ชม." style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
          <div>
            <label style="display:block; font-weight:700; color:#166534; margin-bottom:4px;">RPO (ข้อมูลหายไม่เกิน)</label>
            <input type="text" id="m-bia-rpo" value="${current.rpo || ''}" placeholder="เช่น 1 ชม., N/A" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
        </div>

      </div>

      <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
        <button id="btn-cancel-bia-modal" style="background:#e2e8f0; color:#475569; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:600;">ยกเลิก</button>
        <button id="btn-save-bia-modal" style="background:#0f766e; color:#fff; border:none; padding:8px 18px; border-radius:6px; cursor:pointer; font-weight:600;">บันทึกรายการ</button>
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  const close = () => overlay.remove()
  overlay.querySelector('#btn-close-bia-modal').onclick = close
  overlay.querySelector('#btn-cancel-bia-modal').onclick = close

  overlay.querySelector('#btn-save-bia-modal').onclick = () => {
    const name = overlay.querySelector('#m-bia-name').value.trim()
    if (!name) {
      alert('กรุณาระบุชื่อทรัพย์สิน/บริการสำคัญ')
      return
    }

    const like = Number(overlay.querySelector('#m-bia-like').value) || 1
    const imp = Number(overlay.querySelector('#m-bia-imp').value) || 1

    const updated = {
      ...current,
      id: current.id || `bia_item_${Date.now()}`,
      order_num: Number(overlay.querySelector('#m-bia-order').value) || current.order_num,
      cluster: overlay.querySelector('#m-bia-cluster').value,
      asset_name: name,
      description: overlay.querySelector('#m-bia-desc').value.trim(),
      critical_service: overlay.querySelector('#m-bia-service').value.trim(),
      likelihood: like,
      impact: imp,
      risk_level: like * imp,
      impact_c: overlay.querySelector('#m-bia-c').value,
      impact_i: overlay.querySelector('#m-bia-i').value,
      impact_a: overlay.querySelector('#m-bia-a').value,
      financial_impact: Number(overlay.querySelector('#m-bia-fin').value) || 0,
      operational_impact: overlay.querySelector('#m-bia-op').value.trim(),
      law_regulatory_impact: overlay.querySelector('#m-bia-law').value.trim(),
      reputational_impact: overlay.querySelector('#m-bia-rep').value.trim(),
      mtpd: overlay.querySelector('#m-bia-mtpd').value.trim(),
      rto: overlay.querySelector('#m-bia-rto').value.trim(),
      rpo: overlay.querySelector('#m-bia-rpo').value.trim()
    }

    onSave(updated)
    close()
  }
}

// 5. Exports (Word, CSV)
export function exportBiaWord(state) {
  const header = state.header || DEFAULT_BIA_HEADER
  const items = state.items || DEFAULT_BIA_ITEMS
  const metrics = calculateBiaMetrics(items)

  const rowsHtml = items.map((it, idx) => `
    <tr>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${idx + 1}</td>
      <td style="border:1px solid #999; padding:6px;">${it.cluster}</td>
      <td style="border:1px solid #999; padding:6px; font-weight:bold;">${it.asset_name}</td>
      <td style="border:1px solid #999; padding:6px;">${it.critical_service || '-'}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${it.likelihood}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${it.impact}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center; font-weight:bold;">${it.risk_level}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${it.impact_c}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${it.impact_i}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${it.impact_a}</td>
      <td style="border:1px solid #999; padding:6px; text-align:right;">${new Intl.NumberFormat('th-TH').format(it.financial_impact || 0)}</td>
      <td style="border:1px solid #999; padding:6px;">${it.operational_impact || '-'}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${it.mtpd || '-'}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${it.rto || '-'}</td>
      <td style="border:1px solid #999; padding:6px; text-align:center;">${it.rpo || '-'}</td>
    </tr>
  `).join('')

  const docHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>1.6 Business Impact Analysis - BIA</title>
      <style>
        body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 11pt; }
        table { border-collapse: collapse; width: 100%; }
        th { background: #e2e8f0; font-weight: bold; border: 1px solid #999; padding: 6px; }
      </style>
    </head>
    <body>
      <div style="text-align:center; margin-bottom:16px;">
        <img src="${LOGO_MOPH_BASE64}" width="70" height="70" /><br>
        <h2 style="margin:4px 0;">การวิเคราะห์ผลกระทบทางธุรกิจ (Business Impact Analysis - BIA)</h2>
        <h3 style="margin:2px 0; color:#334155;">1.6 BIA Evident</h3>
        <p style="margin:2px 0;">สำนักงานสาธารณสุขจังหวัดสระแก้ว</p>
      </div>

      <div style="margin-bottom:14px; font-size:10pt;">
        <p><strong>ผู้บันทึก :</strong> ${header.recorder} | <strong>วันที่ :</strong> ${header.record_date}</p>
        <p><strong>สถานที่ :</strong> ${header.location} | <strong>ที่อยู่ :</strong> ${header.address}</p>
        <p><strong>ระบบบริการที่สำคัญ :</strong> ${header.critical_service}</p>
        <p><strong>ผลการประเมินความเสี่ยง(เฉลี่ย) โดยรวม :</strong> ${metrics.overallAvg}</p>
        <p><strong>ผลกระทบทางการเงินรวม :</strong> ฿${new Intl.NumberFormat('th-TH').format(metrics.totalFinancial)} บาท/วัน</p>
      </div>

      <table style="font-size:9pt;">
        <thead>
          <tr>
            <th>No.</th>
            <th>Cluster</th>
            <th>Asset Name</th>
            <th>Critical Service</th>
            <th>A</th>
            <th>B</th>
            <th>Risk Level</th>
            <th>C</th>
            <th>I</th>
            <th>A</th>
            <th>Financial (บาท/วัน)</th>
            <th>Operational Impact</th>
            <th>MTPD</th>
            <th>RTO</th>
            <th>RPO</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `

  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `1.6_BIA_Evident_สสจ_สระแก้ว_${Date.now()}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportBiaCsv(state) {
  const items = state.items || DEFAULT_BIA_ITEMS
  const headers = [
    'No.', 'Cluster', 'Asset Name', 'Description', 'Critical Service',
    'Likelihood (A)', 'Impact (B)', 'Risk Level',
    'Confidential (C)', 'Integrity (I)', 'Availability (A)',
    'Financial Impact (บาท/วัน)', 'Operational Impact', 'Law Regulatory Impact', 'Reputational Impact',
    'MTPD', 'RTO', 'RPO'
  ]

  const rows = items.map(it => [
    it.order_num || '',
    `"${(it.cluster || '').replace(/"/g, '""')}"`,
    `"${(it.asset_name || '').replace(/"/g, '""')}"`,
    `"${(it.description || '').replace(/"/g, '""')}"`,
    `"${(it.critical_service || '').replace(/"/g, '""')}"`,
    it.likelihood || 1,
    it.impact || 1,
    it.risk_level || 1,
    it.impact_c || 'ต่ำ',
    it.impact_i || 'ต่ำ',
    it.impact_a || 'ต่ำ',
    it.financial_impact || 0,
    `"${(it.operational_impact || '').replace(/"/g, '""')}"`,
    `"${(it.law_regulatory_impact || '').replace(/"/g, '""')}"`,
    `"${(it.reputational_impact || '').replace(/"/g, '""')}"`,
    `"${(it.mtpd || '').replace(/"/g, '""')}"`,
    `"${(it.rto || '').replace(/"/g, '""')}"`,
    `"${(it.rpo || '').replace(/"/g, '""')}"`
  ].join(','))

  const csvContent = '\ufeff' + headers.join(',') + '\n' + rows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `1.6_BIA_Evident_สสจ_สระแก้ว_${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 6. Supabase Sync Helpers
export async function syncBiaToSupabase(state) {
  try {
    if (!supabase) return

    // 1. Header
    if (state.header) {
      await supabase.from('cyber_bia_header').upsert({
        id: 'default',
        recorder: state.header.recorder,
        record_date: state.header.record_date,
        location: state.header.location,
        address: state.header.address,
        critical_service: state.header.critical_service,
        overall_score: state.header.overall_score || 8.44,
        updated_at: new Date().toISOString()
      })
    }

    // 2. Items
    if (state.items && state.items.length > 0) {
      const rows = state.items.map(it => ({
        id: String(it.id),
        item_no: it.order_num,
        cluster: it.cluster,
        asset_name: it.asset_name,
        description: it.description,
        critical_service: it.critical_service,
        likelihood: it.likelihood,
        impact: it.impact,
        risk_level: it.risk_level,
        impact_c: it.impact_c,
        impact_i: it.impact_i,
        impact_a: it.impact_a,
        financial_impact: it.financial_impact,
        operational_impact: it.operational_impact,
        law_regulatory_impact: it.law_regulatory_impact,
        reputational_impact: it.reputational_impact,
        mtpd: it.mtpd,
        rto: it.rto,
        rpo: it.rpo,
        updated_at: new Date().toISOString()
      }))
      await supabase.from('cyber_bia_evident_items').upsert(rows)
    }

    // 3. Logs
    if (state.logs && state.logs.length > 0) {
      const logRows = state.logs.map(l => ({
        id: String(l.id),
        log_date: l.date,
        detail: l.detail,
        updated_at: new Date().toISOString()
      }))
      await supabase.from('cyber_bia_logs').upsert(logRows)
    }

    // 4. Module state
    await supabase.from('cyber_module_states').upsert({
      module_key: 'bia_evident',
      data: state,
      updated_at: new Date().toISOString()
    })
  } catch (e) {
    console.warn('Supabase sync deferred for BIA:', e.message)
  }
}

export async function fetchBiaFromSupabase() {
  try {
    if (!supabase) return null

    // Check module state first
    const { data: stateData, error: stateErr } = await supabase
      .from('cyber_module_states')
      .select('data')
      .eq('module_key', 'bia_evident')
      .maybeSingle()

    if (!stateErr && stateData?.data?.items?.length > 0) {
      return stateData.data
    }

    // Otherwise check items table
    const { data: itemsData, error: itemsErr } = await supabase
      .from('cyber_bia_evident_items')
      .select('*')
      .order('item_no', { ascending: true })

    if (!itemsErr && itemsData && itemsData.length > 0) {
      const { data: headerData } = await supabase
        .from('cyber_bia_header')
        .select('*')
        .eq('id', 'default')
        .maybeSingle()

      const { data: logsData } = await supabase
        .from('cyber_bia_logs')
        .select('*')
        .order('log_date', { ascending: false })

      return {
        header: headerData || DEFAULT_BIA_HEADER,
        logs: (logsData && logsData.length > 0) 
          ? logsData.map(l => ({ id: l.id, date: l.log_date, detail: l.detail }))
          : DEFAULT_BIA_LOGS,
        items: itemsData.map(r => ({
          id: r.id,
          order_num: r.item_no,
          cluster: r.cluster,
          asset_name: r.asset_name,
          description: r.description,
          critical_service: r.critical_service,
          likelihood: r.likelihood,
          impact: r.impact,
          risk_level: r.risk_level,
          impact_c: r.impact_c,
          impact_i: r.impact_i,
          impact_a: r.impact_a,
          financial_impact: r.financial_impact,
          operational_impact: r.operational_impact,
          law_regulatory_impact: r.law_regulatory_impact,
          reputational_impact: r.reputational_impact,
          mtpd: r.mtpd,
          rto: r.rto,
          rpo: r.rpo
        }))
      }
    }
  } catch (err) {
    console.warn('Fetch BIA from Supabase deferred:', err.message)
  }
  return null
}

// 7. Event Binding Handler
export function bindBiaEvents(el, state, onAction) {
  if (!el) return

  // Subtabs
  el.querySelectorAll('.bia-subtab-btn').forEach(btn => {
    btn.onclick = () => {
      onAction({ type: 'change_subtab', subtab: btn.dataset.subtab })
    }
  })

  // View toggle
  const btnViewCard = el.querySelector('#btn-bia-view-card')
  if (btnViewCard) btnViewCard.onclick = () => onAction({ type: 'change_view_mode', viewMode: 'card' })

  const btnViewTable = el.querySelector('#btn-bia-view-table')
  if (btnViewTable) btnViewTable.onclick = () => onAction({ type: 'change_view_mode', viewMode: 'table' })

  // Cluster pills
  el.querySelectorAll('.bia-cluster-pill').forEach(btn => {
    btn.onclick = () => onAction({ type: 'change_cluster', cluster: btn.dataset.cluster })
  })

  // Search input
  const searchInput = el.querySelector('#input-bia-search')
  if (searchInput) {
    let debounce
    searchInput.oninput = (e) => {
      clearTimeout(debounce)
      debounce = setTimeout(() => {
        onAction({ type: 'search', query: e.target.value.trim() })
      }, 250)
    }
  }

  // Edit Header
  const btnEditHeader = el.querySelector('#btn-edit-bia-header')
  if (btnEditHeader) {
    btnEditHeader.onclick = () => {
      showBiaHeaderModal(state.header || DEFAULT_BIA_HEADER, (newHeader) => {
        onAction({ type: 'update_header', header: newHeader })
      })
    }
  }

  // Add Item
  const btnAddItem = el.querySelector('#btn-add-bia-item')
  if (btnAddItem) {
    btnAddItem.onclick = () => {
      showBiaItemModal(null, (newItem) => {
        onAction({ type: 'add_item', item: newItem })
      })
    }
  }

  // Edit Item
  el.querySelectorAll('.btn-edit-bia-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      const item = (state.items || []).find(it => it.id === id)
      if (item) {
        showBiaItemModal(item, (updated) => {
          onAction({ type: 'update_item', item: updated })
        })
      }
    }
  })

  // Delete Item
  el.querySelectorAll('.btn-del-bia-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      const item = (state.items || []).find(it => it.id === id)
      const name = item ? item.asset_name : id
      if (confirm(`ยืนยันการลบบริการสำคัญ ${name} ออกจาก BIA หรือไม่?`)) {
        onAction({ type: 'delete_item', id })
      }
    }
  })

  // Add Log
  const btnAddLog = el.querySelector('#btn-add-bia-log')
  if (btnAddLog) {
    btnAddLog.onclick = () => {
      const detail = prompt('กรอกรายละเอียดสิ่งที่ปรับปรุง/แก้ไข:')
      if (detail && detail.trim()) {
        const todayStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
        onAction({ type: 'add_log', date: todayStr, detail: detail.trim() })
      }
    }
  }

  // Delete Log
  el.querySelectorAll('.btn-del-bia-log').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      if (confirm('ยืนยันการลบบันทึกประวัตินี้หรือไม่?')) {
        onAction({ type: 'delete_log', id })
      }
    }
  })

  // Exports & Print
  const btnWord = el.querySelector('#btn-export-bia-word')
  if (btnWord) btnWord.onclick = () => exportBiaWord(state)

  const btnCsv = el.querySelector('#btn-export-bia-csv')
  if (btnCsv) btnCsv.onclick = () => exportBiaCsv(state)

  const btnPrint = el.querySelector('#btn-print-bia')
  if (btnPrint) btnPrint.onclick = () => window.print()

  // Reset default
  const btnReset = el.querySelector('#btn-reset-bia-default')
  if (btnReset) {
    btnReset.onclick = () => {
      if (confirm('ยืนยันการรีเซ็ตข้อมูล BIA เป็นค่าเริ่มต้นจากไฟล์จริง (9 บริการสำคัญ) หรือไม่?')) {
        onAction({ type: 'reset_default' })
      }
    }
  }
}
