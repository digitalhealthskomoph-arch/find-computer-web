import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import {
  DEFAULT_ASSET_RISK_HEADER,
  DEFAULT_ASSET_RISK_LOGS,
  ASSET_RISK_CLUSTERS,
  ASSET_RISK_ITEMS,
  ASSET_RISK_CRITERIA_LIKELIHOOD,
  ASSET_RISK_CRITERIA_SEVERITY,
  ASSET_RISK_LEVEL_THRESHOLDS
} from './assetRiskData.js'
import { supabase } from '../../lib/supabase.js'
import { showNotification } from '../../lib/utils.js'

// Helper: Risk score styling badge
export function getAssetRiskLevelBadge(score) {
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

// Calculate metrics across all 1.4 risk items
export function calculateAssetRiskMetrics(items) {
  const list = items || []
  const total = list.length
  let sumScore = 0
  let countExtreme = 0
  let countHigh = 0
  let countModerate = 0
  let countLow = 0

  const clusterGroups = {}

  list.forEach(item => {
    const l = Number(item.likelihood) || 1
    const i = Number(item.impact) || 1
    const score = l * i
    item.risk_level = score
    sumScore += score

    if (score >= 20) countExtreme++
    else if (score >= 10) countHigh++
    else if (score >= 4) countModerate++
    else countLow++

    const c = item.cluster || 'Other'
    if (!clusterGroups[c]) clusterGroups[c] = []
    clusterGroups[c].push(score)
  })

  // Calculate cluster averages
  const clusterStats = {}
  let sumClusterAvgs = 0
  const clusterNames = Object.keys(clusterGroups)
  clusterNames.forEach(c => {
    const arr = clusterGroups[c]
    const avg = arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0
    clusterStats[c] = {
      count: arr.length,
      avgScore: Math.round(avg * 10) / 10
    }
    sumClusterAvgs += avg
  })

  const overallAvg = clusterNames.length > 0 
    ? Math.round((sumClusterAvgs / clusterNames.length) * 10) / 10 
    : (total > 0 ? Math.round((sumScore / total) * 10) / 10 : 0)

  return {
    total,
    countExtreme,
    countHigh,
    countModerate,
    countLow,
    clusterStats,
    overallAvg
  }
}

// Render the entire HTML for Topic 1.4
export function renderAssetRiskAssessmentHtml(
  state,
  activeSubTab = '1-assess',
  clusterFilter = 'all',
  searchQuery = '',
  viewMode = 'card'
) {
  const header = state?.header || DEFAULT_ASSET_RISK_HEADER
  const logs = state?.logs || DEFAULT_ASSET_RISK_LOGS
  const items = state?.items || ASSET_RISK_ITEMS
  const metrics = calculateAssetRiskMetrics(items)

  // Filter items
  const filtered = items.filter(item => {
    if (clusterFilter !== 'all' && item.cluster !== clusterFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchName = (item.asset_name || '').toLowerCase().includes(q)
      const matchCluster = (item.cluster || '').toLowerCase().includes(q)
      const matchApp = (item.concerned_app || '').toLowerCase().includes(q)
      const matchThreat = (item.threat || '').toLowerCase().includes(q)
      const matchOwner = (item.asset_owner || '').toLowerCase().includes(q)
      if (!matchName && !matchCluster && !matchApp && !matchThreat && !matchOwner) return false
    }
    return true
  })

  const subTabs = [
    { id: '0-log', label: '0. Update Log', badge: logs.length },
    { id: '1-assess', label: '1. Asset Risk Assessment & Treatment', badge: `${metrics.total} ทรัพย์สิน`, isMain: true },
    { id: '2-criteria', label: '2. Risk Criteria & Model Matrix', badge: '5x5 Matrix' }
  ]

  return `
    <div class="asset-risk-container" style="display:flex; flex-direction:column; gap:20px; font-family:'Sarabun', 'Prompt', -apple-system, sans-serif;">
      
      <!-- SUBTABS NAVIGATION BAR -->
      <div class="no-print" style="display:flex; flex-wrap:wrap; gap:8px; background:#f8fafc; padding:10px 14px; border-radius:12px; border:1px solid #e2e8f0; align-items:center; justify-content:space-between;">
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${subTabs.map(t => {
            const isActive = activeSubTab === t.id
            return `
              <button 
                class="asset-risk-subtab-btn ${isActive ? 'active' : ''}" 
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
                  border:${isActive ? '1px solid #0284c7' : '1px solid #cbd5e1'}; 
                  background:${isActive ? '#0284c7' : '#ffffff'}; 
                  color:${isActive ? '#ffffff' : '#334155'};
                  box-shadow:${isActive ? '0 2px 4px rgba(2,132,199,0.2)' : 'none'};
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

        <!-- Sync / DB Status Badge -->
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#059669; font-weight:600; background:#ecfdf5; padding:4px 10px; border-radius:20px; border:1px solid #a7f3d0;">
            <span style="width:7px; height:7px; border-radius:50%; background:#10b981;"></span>
            ซิงค์อัตโนมัติ (Supabase & LocalStorage)
          </span>
        </div>
      </div>

      <!-- MAIN SUBTAB CONTENT -->
      ${activeSubTab === '0-log' ? renderLogsSubtab(logs) : ''}
      ${activeSubTab === '1-assess' ? renderAssessSubtab(header, filtered, metrics, clusterFilter, searchQuery, viewMode) : ''}
      ${activeSubTab === '2-criteria' ? renderCriteriaSubtab() : ''}

    </div>
  `
}

// Subtab 0: Update Log
function renderLogsSubtab(logs) {
  return `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <div>
          <h2 style="font-size:17px; font-weight:700; color:#1e293b; margin:0 0 4px 0;">0. Update Log (บันทึกประวัติการปรับปรุงเอกสาร)</h2>
          <p style="font-size:12.5px; color:#64748b; margin:0;">ประวัติการจัดทำและการประเมินความพร้อมตามรอบการตรวจสอบ</p>
        </div>
        <button id="btn-add-asset-risk-log" style="background:#0284c7; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer;">
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
                <td style="padding:10px 14px; font-weight:600; color:#0284c7;">${log.date || '-'}</td>
                <td style="padding:10px 14px; color:#334155;">${log.detail || '-'}</td>
                <td style="padding:10px 14px; text-align:center;">
                  <button class="btn-edit-log" data-id="${log.id}" style="background:none; border:none; color:#0284c7; cursor:pointer; font-size:13px; padding:2px 6px;">✏️</button>
                  <button class="btn-del-log" data-id="${log.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:13px; padding:2px 6px;">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// Subtab 1: Asset Risk Assessment & Treatment (Main)
function renderAssessSubtab(header, items, metrics, clusterFilter, searchQuery, viewMode) {
  const overallBadge = metrics.overallAvg >= 17 
    ? { text: 'แดง (สูง) >= 17', bg: '#fee2e2', color: '#991b1b' }
    : metrics.overallAvg >= 13
    ? { text: 'เหลือง (กลาง) >= 13', bg: '#fef9c3', color: '#854d0e' }
    : { text: 'เขียว (ต่ำ) = 10', bg: '#dcfce7', color: '#166534' }

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- 1. EDITABLE HEADER CARD WITH LOGO & OVERALL SCORE -->
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; box-shadow:0 1px 3px rgba(0,0,0,0.05); overflow:hidden;">
        <!-- Header Banner -->
        <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="background:#ffffff; border-radius:10px; padding:6px; display:flex; align-items:center; justify-content:center; width:58px; height:58px; box-shadow:0 2px 6px rgba(0,0,0,0.2);">
              <img src="${LOGO_MOPH_BASE64}" alt="ตรากระทรวงสาธารณสุข" style="max-height:46px; max-width:46px; object-fit:contain;" />
            </div>
            <div>
              <div style="font-size:12px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">กลุ่มงานสุขภาพดิจิทัล สำนักงานสาธารณสุขจังหวัดสระแก้ว</div>
              <h1 style="font-size:18px; font-weight:700; margin:3px 0 0 0; color:#f8fafc;">
                การประเมินและการจัดการความเสี่ยงทรัพย์สินและการบริการที่สำคัญ (1.4 Asset Risk Assessment and Risk Treatment)
              </h1>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:10px;">
            <button id="btn-edit-asset-risk-header" style="background:rgba(255,255,255,0.15); color:#ffffff; border:1px solid rgba(255,255,255,0.3); padding:8px 14px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              ✏️ แก้ไขหัวรายงาน
            </button>
          </div>
        </div>

        <!-- Metadata Grid & KPI Summary -->
        <div style="padding:18px 24px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; font-size:13px;">
          <div>
            <div style="color:#64748b; font-size:11.5px; font-weight:600;">ผู้พิจารณาประเมิน :</div>
            <div style="color:#1e293b; font-weight:600;">${header.evaluator || '-'}</div>
          </div>
          <div>
            <div style="color:#64748b; font-size:11.5px; font-weight:600;">ผู้บันทึก :</div>
            <div style="color:#1e293b; font-weight:600;">${header.recorder || '-'}</div>
          </div>
          <div>
            <div style="color:#64748b; font-size:11.5px; font-weight:600;">วันที่ทำการประชุมความเสี่ยงพร้อมบันทึก :</div>
            <div style="color:#0284c7; font-weight:700;">${header.meeting_date || '-'}</div>
          </div>
          <div>
            <div style="color:#64748b; font-size:11.5px; font-weight:600;">สถานที่ :</div>
            <div style="color:#1e293b; font-weight:600;">${header.location || '-'}</div>
          </div>
          <div style="grid-column: 1 / -1;">
            <div style="color:#64748b; font-size:11.5px; font-weight:600;">ระบบบริการที่สำคัญ :</div>
            <div style="color:#0f766e; font-weight:700;">${header.critical_service || 'All critical application'}</div>
          </div>
        </div>

        <!-- Overall Risk Evaluation Score Box -->
        <div style="padding:16px 24px; background:#ffffff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="font-size:13.5px; font-weight:700; color:#1e293b;">
              ผลการประเมินความเสี่ยงทรัพย์สินและการบริการที่สำคัญ (เฉลี่ย) โดยรวมขององค์กร:
            </div>
            <div style="font-size:20px; font-weight:800; color:#0284c7; background:#e0f2fe; padding:4px 14px; border-radius:8px; border:1px solid #7dd3fc;">
              ${metrics.overallAvg}
            </div>
            <div style="font-size:12px; font-weight:700; padding:4px 10px; border-radius:6px; background:${overallBadge.bg}; color:${overallBadge.color}; border:1px solid ${overallBadge.color}33;">
              เกณฑ์: ${overallBadge.text}
            </div>
          </div>

          <!-- Quick counts badges -->
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <span style="font-size:12px; font-weight:600; padding:4px 10px; border-radius:6px; background:#f1f5f9; color:#475569;">ทั้งหมด ${metrics.total} ข้อ</span>
            <span style="font-size:12px; font-weight:600; padding:4px 10px; border-radius:6px; background:#fee2e2; color:#991b1b;">วิกฤต ${metrics.countExtreme}</span>
            <span style="font-size:12px; font-weight:600; padding:4px 10px; border-radius:6px; background:#ffedd5; color:#9a3412;">สูง ${metrics.countHigh}</span>
            <span style="font-size:12px; font-weight:600; padding:4px 10px; border-radius:6px; background:#fef9c3; color:#854d0e;">ปานกลาง ${metrics.countModerate}</span>
            <span style="font-size:12px; font-weight:600; padding:4px 10px; border-radius:6px; background:#dcfce7; color:#166534;">ต่ำ ${metrics.countLow}</span>
          </div>
        </div>
      </div>

      <!-- 2. TOOLBAR & CONTROLS (View toggle, Cluster filter, Search, Export) -->
      <div class="no-print" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px 20px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <!-- Dual View Toggle -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:12.5px; font-weight:700; color:#475569; margin-right:4px;">รูปแบบการแสดงผล:</span>
            <button 
              id="btn-view-card" 
              style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; font-size:12.5px; font-weight:700; cursor:pointer; border:1px solid ${viewMode === 'card' ? '#0284c7' : '#cbd5e1'}; background:${viewMode === 'card' ? '#0284c7' : '#ffffff'}; color:${viewMode === 'card' ? '#ffffff' : '#475569'};"
            >
              🗂️ มุมมองการ์ด 4 ส่วน (Step Card View)
            </button>
            <button 
              id="btn-view-table" 
              style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; font-size:12.5px; font-weight:700; cursor:pointer; border:1px solid ${viewMode === 'table' ? '#0284c7' : '#cbd5e1'}; background:${viewMode === 'table' ? '#0284c7' : '#ffffff'}; color:${viewMode === 'table' ? '#ffffff' : '#475569'};"
            >
              📊 มุมมองตาราง Excel (Data Grid View)
            </button>
          </div>

          <!-- Action buttons -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <button id="btn-add-asset-risk-item" style="background:#0284c7; color:#ffffff; border:none; padding:7px 14px; border-radius:7px; font-size:12.5px; font-weight:600; cursor:pointer;">
              ➕ เพิ่มทรัพย์สินใหม่
            </button>
            <button id="btn-export-asset-risk-word" style="background:#2563eb; color:#ffffff; border:none; padding:7px 12px; border-radius:7px; font-size:12.5px; font-weight:600; cursor:pointer;">
              📄 Export Word
            </button>
            <button id="btn-export-asset-risk-csv" style="background:#059669; color:#ffffff; border:none; padding:7px 12px; border-radius:7px; font-size:12.5px; font-weight:600; cursor:pointer;">
              📊 Export Excel (CSV)
            </button>
            <button id="btn-print-asset-risk" style="background:#475569; color:#ffffff; border:none; padding:7px 12px; border-radius:7px; font-size:12.5px; font-weight:600; cursor:pointer;">
              🖨️ พิมพ์ / PDF
            </button>
            <button id="btn-reset-asset-risk-default" style="background:none; border:1px solid #cbd5e1; color:#64748b; padding:6px 10px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer;">
              🔄 รีเซ็ตค่าเริ่มต้น
            </button>
          </div>
        </div>

        <!-- Filter Pills by Cluster -->
        <div>
          <div style="font-size:11.5px; font-weight:700; color:#64748b; margin-bottom:6px;">กรองตามประเภททรัพย์สิน / Cluster:</div>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            <button 
              class="asset-cluster-pill ${clusterFilter === 'all' ? 'active' : ''}" 
              data-cluster="all"
              style="padding:4px 12px; border-radius:14px; font-size:12px; font-weight:${clusterFilter === 'all' ? '700' : '500'}; border:1px solid ${clusterFilter === 'all' ? '#0284c7' : '#cbd5e1'}; background:${clusterFilter === 'all' ? '#e0f2fe' : '#ffffff'}; color:${clusterFilter === 'all' ? '#0369a1' : '#475569'}; cursor:pointer;"
            >
              ทั้งหมด (${metrics.total})
            </button>
            ${ASSET_RISK_CLUSTERS.map(c => {
              const cs = metrics.clusterStats[c] || { count: 0, avgScore: 0 }
              const isPillActive = clusterFilter === c
              return `
                <button 
                  class="asset-cluster-pill ${isPillActive ? 'active' : ''}" 
                  data-cluster="${c}"
                  style="padding:4px 12px; border-radius:14px; font-size:12px; font-weight:${isPillActive ? '700' : '500'}; border:1px solid ${isPillActive ? '#0284c7' : '#cbd5e1'}; background:${isPillActive ? '#e0f2fe' : '#ffffff'}; color:${isPillActive ? '#0369a1' : '#475569'}; cursor:pointer;"
                >
                  ${c} (${cs.count}) <span style="font-size:10.5px; font-weight:700; opacity:0.8;">[เฉลี่ย ${cs.avgScore}]</span>
                </button>
              `
            }).join('')}
          </div>
        </div>

        <!-- Search Bar -->
        <div>
          <input 
            type="text" 
            id="input-asset-risk-search" 
            placeholder="🔍 ค้นหาชื่อทรัพย์สิน, ระบบงาน, ภัยคุกคาม, หรือเจ้าของทรัพย์สิน..." 
            value="${searchQuery}"
            style="width:100%; box-sizing:border-box; padding:8px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px;"
          />
        </div>
      </div>

      <!-- 3. MAIN DATA VIEW (Step Card View OR Data Grid View) -->
      ${viewMode === 'card' ? renderStepCardView(items, metrics) : renderDataGridView(items, metrics)}

    </div>
  `
}

// 3.1 Step Card View
function renderStepCardView(items, metrics) {
  if (items.length === 0) {
    return `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:40px; text-align:center; color:#94a3b8;">
        ไม่พบข้อมูลทรัพย์สินตามเงื่อนไขที่เลือก
      </div>
    `
  }

  return `
    <div style="display:flex; flex-direction:column; gap:16px;">
      ${items.map(item => {
        const badge = getAssetRiskLevelBadge(item.risk_level)
        const subActions = item.sub_actions || []
        const cStat = metrics.clusterStats[item.cluster] || { avgScore: 0 }

        return `
          <div class="asset-risk-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.05); overflow:hidden;">
            
            <!-- Card Header -->
            <div style="padding:14px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-size:12px; font-weight:700; color:#64748b; background:#e2e8f0; padding:2px 8px; border-radius:4px;">
                  ข้อที่ ${item.order_num || '-'}
                </span>
                <span style="font-size:12px; font-weight:600; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:4px;">
                  ${item.cluster}
                </span>
                <h3 style="font-size:16px; font-weight:700; color:#0f172a; margin:0;">
                  ${item.asset_name}
                </h3>
              </div>

              <div style="display:flex; align-items:center; gap:10px;">
                <!-- Cluster Avg -->
                <span style="font-size:12px; color:#64748b;">
                  เฉลี่ย Cluster: <strong style="color:#0284c7;">${cStat.avgScore}</strong>
                </span>

                <!-- Risk Badge -->
                <span style="font-size:12px; font-weight:700; padding:4px 10px; border-radius:6px; background:${badge.bg}; color:${badge.color}; border:1px solid ${badge.border};">
                  ระดับความเสี่ยง: ${badge.label}
                </span>

                <button class="btn-edit-asset-item" data-id="${item.id}" style="background:none; border:1px solid #cbd5e1; border-radius:6px; padding:4px 8px; color:#0284c7; cursor:pointer; font-size:12px; font-weight:600;">
                  ✏️ แก้ไข
                </button>
                <button class="btn-del-asset-item" data-id="${item.id}" style="background:none; border:1px solid #fecaca; border-radius:6px; padding:4px 8px; color:#ef4444; cursor:pointer; font-size:12px; font-weight:600;">
                  🗑️
                </button>
              </div>
            </div>

            <!-- Card Body - 4 Parts Layout -->
            <div style="padding:20px; display:flex; flex-direction:column; gap:18px;">
              
              <!-- PART 1: RISK ASSESSMENT -->
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">
                  <span style="font-size:13.5px; font-weight:700; color:#0f172a;">
                    PART 1 : การระบุและวิเคราะห์ความเสี่ยง (RISK ASSESSMENT)
                  </span>
                  <span style="font-size:12px; color:#64748b;">
                    เจ้าของความเสี่ยง: <strong style="color:#1e293b;">${item.asset_owner || '-'}</strong>
                  </span>
                </div>

                <!-- Basic Asset info -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-bottom:14px; font-size:12.5px; background:#f8fafc; padding:10px 14px; border-radius:8px;">
                  <div>
                    <span style="color:#64748b;">คำอธิบาย:</span> 
                    <div style="color:#1e293b; font-weight:500;">${item.description || '-'}</div>
                  </div>
                  <div>
                    <span style="color:#64748b;">ระบบที่เกี่ยวข้อง:</span> 
                    <div style="color:#1e293b; font-weight:500;">${item.concerned_app || '-'}</div>
                  </div>
                  <div>
                    <span style="color:#64748b;">บริการ/ฟังก์ชันสำคัญ:</span> 
                    <div style="color:#1e293b; font-weight:500;">${item.critical_service || '-'}</div>
                  </div>
                </div>

                <!-- Threat & Vulnerability -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; font-size:12.5px;">
                  <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; padding:10px 12px;">
                    <strong style="color:#be123c;">⚠️ ภัยคุกคาม (Threat):</strong>
                    <div style="color:#4c0519; margin-top:4px;">${item.threat || '-'}</div>
                  </div>
                  <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:8px; padding:10px 12px;">
                    <strong style="color:#b45309;">🔓 ช่องโหว่ (Vulnerability):</strong>
                    <div style="color:#78350f; margin-top:4px;">${item.vulnerability || '-'}</div>
                  </div>
                </div>

                <!-- Controls, CIA, Severity, Likelihood x Impact -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:12px; background:#f1f5f9; padding:12px; border-radius:8px; align-items:center;">
                  <div>
                    <span style="color:#64748b; font-weight:600;">ผลกระทบต่อ CIA:</span>
                    <div style="margin-top:4px; display:flex; gap:6px;">
                      <span style="padding:2px 6px; border-radius:4px; font-weight:700; ${item.impact_c ? 'background:#ef4444; color:#fff;' : 'background:#e2e8f0; color:#94a3b8;'}">C</span>
                      <span style="padding:2px 6px; border-radius:4px; font-weight:700; ${item.impact_i ? 'background:#ef4444; color:#fff;' : 'background:#e2e8f0; color:#94a3b8;'}">I</span>
                      <span style="padding:2px 6px; border-radius:4px; font-weight:700; ${item.impact_a ? 'background:#ef4444; color:#fff;' : 'background:#e2e8f0; color:#94a3b8;'}">A</span>
                    </div>
                  </div>

                  <div>
                    <span style="color:#64748b; font-weight:600;">ความรุนแรง (F,S,R,I,L,O):</span>
                    <div style="margin-top:4px; display:flex; gap:4px;">
                      ${['f', 's', 'r', 'i', 'l', 'o'].map(f => {
                        const active = item[`severity_${f}`]
                        return `<span style="padding:2px 5px; border-radius:4px; font-weight:700; ${active ? 'background:#f97316; color:#fff;' : 'background:#e2e8f0; color:#94a3b8;'}">${f.toUpperCase()}</span>`
                      }).join('')}
                    </div>
                  </div>

                  <div>
                    <span style="color:#64748b; font-weight:600;">การวิเคราะห์ความเสี่ยง:</span>
                    <div style="margin-top:4px; font-size:12.5px;">
                      โอกาสเกิด (A) = <strong>${item.likelihood || 1}</strong> &times; ความรุนแรง (B) = <strong>${item.impact || 1}</strong>
                      <span style="margin-left:6px; font-weight:800; color:#0284c7;">&rArr; ระดับ = ${item.risk_level || 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PART 2: RISK TREATMENT -->
              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:14px 16px;">
                <span style="font-size:13px; font-weight:700; color:#166534; display:block; margin-bottom:8px;">
                  PART 2 : แผนจัดการความเสี่ยง (RISK TREATMENT)
                </span>
                <div style="display:grid; grid-template-columns:220px 1fr; gap:12px; font-size:12.5px;">
                  <div>
                    <span style="color:#15803d; font-weight:600;">ตัวเลือกการตอบสนอง:</span>
                    <div style="color:#166534; font-weight:700; margin-top:2px;">${item.treatment || 'Mitigate Risk'}</div>
                  </div>
                  <div>
                    <span style="color:#15803d; font-weight:600;">แผนจัดการความเสี่ยง (ข้อใหญ่):</span>
                    <div style="color:#14532d; font-weight:600; margin-top:2px;">${item.treatment_plan_main || '-'}</div>
                  </div>
                </div>
              </div>

              <!-- PART 3 & 4: SUB-ACTIONS, PROGRESS & RESIDUAL EVALUATION -->
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <span style="font-size:13px; font-weight:700; color:#0f172a;">
                    PART 3 & 4 : มาตรการย่อย, ความคืบหน้า และความเสี่ยงคงเหลือ (PROGRESS & RESIDUAL RISK)
                  </span>
                  <button class="btn-add-subaction" data-item-id="${item.id}" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11.5px; font-weight:600; cursor:pointer;">
                    ➕ เพิ่มมาตรการย่อย
                  </button>
                </div>

                ${subActions.length === 0 ? `
                  <div style="text-align:center; padding:14px; color:#94a3b8; font-size:12px; background:#f8fafc; border-radius:6px;">
                    ยังไม่มีมาตรการย่อยสำหรับทรัพย์สินนี้ กดปุ่ม "+ เพิ่มมาตรการย่อย" เพื่อเริ่มกำหนดแผน
                  </div>
                ` : `
                  <div style="display:flex; flex-direction:column; gap:10px;">
                    ${subActions.map((sub, sIdx) => {
                      const resBadge = getAssetRiskLevelBadge(sub.residual_risk_level || 1)
                      const is100 = (sub.progress_percent || 0) >= 100

                      return `
                        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:12px; background:#f8fafc; font-size:12px; display:flex; flex-direction:column; gap:8px;">
                          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                            <div style="flex:1;">
                              <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-weight:700; color:#0284c7;">มาตรการย่อยที่ ${sIdx + 1}:</span>
                                <strong style="color:#1e293b; font-size:12.5px;">${sub.name || '-'}</strong>
                              </div>
                              <div style="color:#64748b; margin-top:3px;">
                                คาดว่าจะแล้วเสร็จ: <strong>${sub.expected_date || '-'}</strong> | 
                                ดำเนินการแล้วเสร็จ: <strong>${sub.done_date || '-'}</strong>
                              </div>
                            </div>

                            <div style="display:flex; align-items:center; gap:8px;">
                              <!-- Progress bar -->
                              <div style="width:130px; text-align:right;">
                                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:#334155; margin-bottom:2px;">
                                  <span>ความคืบหน้า</span>
                                  <span style="color:${is100 ? '#16a34a' : '#0284c7'};">${sub.progress_percent || 0}%</span>
                                </div>
                                <div style="background:#e2e8f0; border-radius:10px; height:6px; overflow:hidden;">
                                  <div style="background:${is100 ? '#16a34a' : '#0284c7'}; height:100%; width:${sub.progress_percent || 0}%;"></div>
                                </div>
                              </div>

                              <button class="btn-edit-subaction" data-item-id="${item.id}" data-sub-id="${sub.id}" style="background:none; border:none; color:#0284c7; cursor:pointer; font-size:12px;">✏️</button>
                              <button class="btn-del-subaction" data-item-id="${item.id}" data-sub-id="${sub.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:12px;">🗑️</button>
                            </div>
                          </div>

                          <!-- Residual Risk Evaluation -->
                          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                            <div style="display:flex; align-items:center; gap:12px;">
                              <span style="font-weight:700; color:#475569;">PART 4 ความเสี่ยงคงเหลือ:</span>
                              <span>โอกาสเกิด (A) = <strong>${sub.residual_likelihood || 1}</strong> &times; รุนแรง (B) = <strong>${sub.residual_impact || 1}</strong></span>
                              <span style="padding:2px 8px; border-radius:4px; font-weight:700; font-size:11.5px; background:${resBadge.bg}; color:${resBadge.color}; border:1px solid ${resBadge.border};">
                                คงเหลือ: ${sub.residual_risk_level || 1} (${resBadge.level})
                              </span>
                            </div>

                            ${sub.further_action ? `
                              <div style="color:#0f766e; font-size:11.5px;">
                                <strong>การดำเนินการเพิ่มเติม:</strong> ${sub.further_action}
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      `
                    }).join('')}
                  </div>
                `}
              </div>

            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

// 3.2 Data Grid View (Excel-like wide table)
function renderDataGridView(items, metrics) {
  return `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="overflow-x:auto; max-height:800px;">
        <table class="asset-risk-datagrid" style="width:100%; min-width:2800px; border-collapse:collapse; font-size:12px; text-align:left;">
          <thead>
            <!-- Top Header Groups -->
            <tr style="background:#1e293b; color:#ffffff; text-align:center; font-weight:700;">
              <th colspan="7" style="padding:10px; border:1px solid #334155; background:#0f172a;">ข้อมูลทรัพย์สินและบริการสำคัญ</th>
              <th colspan="12" style="padding:10px; border:1px solid #334155; background:#1e293b;">PART 1 : RISK ASSESSMENT (การประเมินความเสี่ยง)</th>
              <th colspan="4" style="padding:10px; border:1px solid #334155; background:#14532d;">PART 2 : RISK TREATMENT</th>
              <th colspan="2" style="padding:10px; border:1px solid #334155; background:#1e3a8a;">PART 3 : PROGRESS</th>
              <th colspan="11" style="padding:10px; border:1px solid #334155; background:#581c87;">PART 4 : RISK EVALUATION (RESOLVED 100%)</th>
              <th rowspan="3" style="padding:10px; border:1px solid #334155; background:#0f172a; width:80px;">จัดการ</th>
            </tr>

            <!-- Subheader Column Labels -->
            <tr style="background:#f1f5f9; color:#334155; text-align:center; font-weight:700;">
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:45px;">No.</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:140px;">Type of Asset / Cluster</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:160px;">ชื่อ (Asset Name)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:180px;">คำอธิบาย (Description)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:150px;">ระบบที่เกี่ยวข้อง</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:200px;">บริการ/ฟังก์ชันที่สำคัญ</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:180px;">มาตรการควบคุมในปัจจุบัน</th>

              <!-- Part 1 columns -->
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:180px;">ภัยคุกคาม (Threat)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:180px;">ช่องโหว่ (Vulner.)</th>
              <th colspan="3" style="padding:4px; border:1px solid #cbd5e1;">ผลกระทบต่อ</th>
              <th colspan="6" style="padding:4px; border:1px solid #cbd5e1;">ความรุนแรงแต่ละด้าน</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:55px;">A (เกิด)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:55px;">B (แรง)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:65px;">C=A*B (ระดับ)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:140px;">เจ้าของ (Asset Owner)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:70px;">เฉลี่ย Cluster</th>

              <!-- Part 2 columns -->
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:130px;">การตอบสนอง</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:200px;">แผนจัดการ (ข้อใหญ่)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:220px;">มาตรการย่อย</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:120px;">คาดว่าจะเสร็จ</th>

              <!-- Part 3 columns -->
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:90px;">สถานะ (%)</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:110px;">ดำเนินการแล้วเสร็จ</th>

              <!-- Part 4 columns -->
              <th colspan="3" style="padding:4px; border:1px solid #cbd5e1;">กระทบต่อ</th>
              <th colspan="6" style="padding:4px; border:1px solid #cbd5e1;">ความรุนแรงแต่ละด้าน</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:50px;">A</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:50px;">B</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:60px;">ระดับคงเหลือ</th>
              <th rowspan="2" style="padding:8px; border:1px solid #cbd5e1; width:200px;">ดำเนินการเพิ่มเติม</th>
            </tr>

            <!-- Detailed Checkbox Headers (CIA / FSRILO) -->
            <tr style="background:#e2e8f0; color:#475569; text-align:center; font-size:11px;">
              <!-- Part 1 CIA -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">C</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">A</th>
              <!-- Part 1 FSRILO -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">F</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">S</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">R</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">L</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">O</th>

              <!-- Part 4 CIA -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">C</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">A</th>
              <!-- Part 4 FSRILO -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">F</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">S</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">R</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">L</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;">O</th>
            </tr>
          </thead>

          <tbody>
            ${items.map(item => {
              const badge = getAssetRiskLevelBadge(item.risk_level)
              const cStat = metrics.clusterStats[item.cluster] || { avgScore: 0 }
              const subActions = item.sub_actions && item.sub_actions.length > 0 
                ? item.sub_actions 
                : [{
                    name: '-',
                    expected_date: '-',
                    progress_percent: 0,
                    done_date: '-',
                    residual_c: false, residual_i: false, residual_a: false,
                    residual_f: false, residual_s: false, residual_r: false, residual_i_sev: false, residual_l: false, residual_o: false,
                    residual_likelihood: 1, residual_impact: 1, residual_risk_level: 1, further_action: ''
                  }]

              return subActions.map((sub, sIdx) => {
                const isFirstSub = sIdx === 0
                const rowSpan = subActions.length
                const resBadge = getAssetRiskLevelBadge(sub.residual_risk_level || 1)

                return `
                  <tr style="border-bottom:1px solid #e2e8f0; background:${sIdx % 2 === 0 ? '#ffffff' : '#fcfdfd'};">
                    ${isFirstSub ? `
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#64748b;">${item.order_num || '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; font-weight:600; color:#0284c7;">${item.cluster}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; font-weight:700; color:#0f172a;">${item.asset_name}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; color:#475569;">${item.description || '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; color:#475569;">${item.concerned_app || '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; color:#475569;">${item.critical_service || '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; color:#64748b;">${item.existing_controls || '-'}</td>

                      <!-- Part 1 columns -->
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; color:#be123c;">${item.threat || '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; color:#b45309;">${item.vulnerability || '-'}</td>
                      
                      <!-- CIA -->
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.impact_c ? '#ef4444' : '#cbd5e1'};">${item.impact_c ? 'x' : '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.impact_i ? '#ef4444' : '#cbd5e1'};">${item.impact_i ? 'x' : '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.impact_a ? '#ef4444' : '#cbd5e1'};">${item.impact_a ? 'x' : '-'}</td>

                      <!-- FSRILO -->
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.severity_f ? '#f97316' : '#cbd5e1'};">${item.severity_f ? 'x' : '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.severity_s ? '#f97316' : '#cbd5e1'};">${item.severity_s ? 'x' : '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.severity_r ? '#f97316' : '#cbd5e1'};">${item.severity_r ? 'x' : '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.severity_i ? '#f97316' : '#cbd5e1'};">${item.severity_i ? 'x' : '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.severity_l ? '#f97316' : '#cbd5e1'};">${item.severity_l ? 'x' : '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${item.severity_o ? '#f97316' : '#cbd5e1'};">${item.severity_o ? 'x' : '-'}</td>

                      <!-- A, B, C -->
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:600;">${item.likelihood || 1}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:600;">${item.impact || 1}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:800; background:${badge.bg}; color:${badge.color};">${item.risk_level || 1}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; color:#334155;">${item.asset_owner || '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#0284c7;">${cStat.avgScore}</td>

                      <!-- Part 2 Main -->
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; font-weight:600; color:#15803d;">${item.treatment || '-'}</td>
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; color:#166534;">${item.treatment_plan_main || '-'}</td>
                    ` : ''}

                    <!-- Part 2 Sub-action -->
                    <td style="padding:8px; border:1px solid #e2e8f0; color:#0f172a; font-weight:500;">${sub.name || '-'}</td>
                    <td style="padding:8px; border:1px solid #e2e8f0; color:#475569;">${sub.expected_date || '-'}</td>

                    <!-- Part 3 Progress -->
                    <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${sub.progress_percent >= 100 ? '#16a34a' : '#0284c7'};">
                      ${sub.progress_percent || 0}%
                    </td>
                    <td style="padding:8px; border:1px solid #e2e8f0; color:#475569;">${sub.done_date || '-'}</td>

                    <!-- Part 4 CIA -->
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_c ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_c ? 'x' : '-'}</td>
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_i ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_i ? 'x' : '-'}</td>
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_a ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_a ? 'x' : '-'}</td>

                    <!-- Part 4 FSRILO -->
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_f ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_f ? 'x' : '-'}</td>
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_s ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_s ? 'x' : '-'}</td>
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_r ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_r ? 'x' : '-'}</td>
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_i_sev ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_i_sev ? 'x' : '-'}</td>
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_l ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_l ? 'x' : '-'}</td>
                    <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; color:${sub.residual_o ? '#7c3aed' : '#cbd5e1'}; font-weight:700;">${sub.residual_o ? 'x' : '-'}</td>

                    <!-- Part 4 Score -->
                    <td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">${sub.residual_likelihood || 1}</td>
                    <td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">${sub.residual_impact || 1}</td>
                    <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; font-weight:700; background:${resBadge.bg}; color:${resBadge.color};">${sub.residual_risk_level || 1}</td>
                    <td style="padding:8px; border:1px solid #e2e8f0; color:#0f766e;">${sub.further_action || '-'}</td>

                    ${isFirstSub ? `
                      <td rowspan="${rowSpan}" style="padding:8px; border:1px solid #e2e8f0; text-align:center;">
                        <button class="btn-edit-asset-item" data-id="${item.id}" style="background:none; border:none; color:#0284c7; cursor:pointer; font-size:14px; padding:2px;">✏️</button>
                        <button class="btn-del-asset-item" data-id="${item.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:14px; padding:2px;">🗑️</button>
                      </td>
                    ` : ''}
                  </tr>
                `
              }).join('')
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// Subtab 2: Risk Criteria & Matrix
function renderCriteriaSubtab() {
  return `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:24px;">
      
      <div>
        <h2 style="font-size:17px; font-weight:700; color:#1e293b; margin:0 0 6px 0;">2. Risk Criteria & Model Matrix (เกณฑ์การประเมินความเสี่ยงและเมทริกซ์ 5x5)</h2>
        <p style="font-size:13px; color:#64748b; margin:0;">อ้างอิงตามมาตรฐานความมั่นคงปลอดภัยไซเบอร์และเอกสารเกณฑ์ของอาจารย์ไก่</p>
      </div>

      <!-- 5x5 Model Matrix Table -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px;">
        <h3 style="font-size:14.5px; font-weight:700; color:#0f172a; margin:0 0 12px 0;">ตารางระดับความเสี่ยง (5x5 Risk Matrix)</h3>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12.5px;">
            <thead>
              <tr style="background:#0f172a; color:#fff;">
                <th style="padding:10px; border:1px solid #334155; width:220px;" rowspan="2">ความรุนแรง / ผลกระทบ (Impact)</th>
                <th colspan="5" style="padding:8px; border:1px solid #334155;">โอกาสเกิด (Likelihood / Probability)</th>
              </tr>
              <tr style="background:#1e293b; color:#fff; font-size:11.5px;">
                <th style="padding:6px; border:1px solid #334155;">1. Rare<br><span style="font-weight:400; opacity:0.8;">เกิดขึ้นได้ยาก</span></th>
                <th style="padding:6px; border:1px solid #334155;">2. Unlikely<br><span style="font-weight:400; opacity:0.8;">เกิดขึ้นน้อย</span></th>
                <th style="padding:6px; border:1px solid #334155;">3. Moderate<br><span style="font-weight:400; opacity:0.8;">อาจเกิดขึ้น</span></th>
                <th style="padding:6px; border:1px solid #334155;">4. Likely<br><span style="font-weight:400; opacity:0.8;">มีโอกาสเกิด</span></th>
                <th style="padding:6px; border:1px solid #334155;">5. Almost Certain<br><span style="font-weight:400; opacity:0.8;">เกือบแน่นอน</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:10px; border:1px solid #cbd5e1; font-weight:700; background:#f1f5f9; text-align:left;">5. Severe (วิกฤต ข)</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 5</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#ffedd5; color:#9a3412; font-weight:700;">High 10</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:700;">Very High 15</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:700;">Extreme 20</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:700;">Extreme 25</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #cbd5e1; font-weight:700; background:#f1f5f9; text-align:left;">4. Significant (วิกฤต ก)</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 4</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 8</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#ffedd5; color:#9a3412; font-weight:700;">High 12</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:700;">Very High 16</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:700;">Extreme 20</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #cbd5e1; font-weight:700; background:#f1f5f9; text-align:left;">3. Moderate (ร้ายแรง)</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:700;">Low 3</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 6</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 9</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#ffedd5; color:#9a3412; font-weight:700;">High 12</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:700;">Very High 15</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #cbd5e1; font-weight:700; background:#f1f5f9; text-align:left;">2. Minor (ไม่ร้ายแรง)</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:700;">Low 2</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:700;">Low 4</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 6</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 8</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#ffedd5; color:#9a3412; font-weight:700;">High 10</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #cbd5e1; font-weight:700; background:#f1f5f9; text-align:left;">1. Insignificant (เล็กน้อย)</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:700;">Low 1</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:700;">Low 2</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:700;">Low 3</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 4</td>
                <td style="padding:10px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:700;">Med 5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Thresholds & Actions -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
        ${ASSET_RISK_LEVEL_THRESHOLDS.map(t => `
          <div style="border:1px solid ${t.color}55; border-radius:8px; padding:14px; background:${t.color}10;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <strong style="color:${t.color}; font-size:14px;">${t.level} (${t.min} - ${t.max})</strong>
              <span style="font-size:11px; background:${t.color}; color:#fff; padding:2px 8px; border-radius:10px; font-weight:700;">Risk Score</span>
            </div>
            <div style="font-size:12.5px; color:#334155;"><strong>แนวทางปฏิบัติ:</strong> ${t.action}</div>
          </div>
        `).join('')}
      </div>

    </div>
  `
}

// 4. Modals (Header, Asset CRUD, Subaction CRUD, Log CRUD)
export function showAssetRiskHeaderModal(header, onSave) {
  const overlay = document.createElement('div')
  overlay.className = 'asset-risk-modal-overlay'
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;'

  overlay.innerHTML = `
    <div style="background:#fff; border-radius:14px; width:100%; max-width:540px; box-shadow:0 10px 25px rgba(0,0,0,0.2); overflow:hidden;">
      <div style="padding:16px 20px; background:#0f172a; color:#fff; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size:16px; font-weight:700;">✏️ แก้ไขข้อมูลส่วนหัวรายงาน (1.4 Header Metadata)</h3>
        <button id="btn-close-header-modal" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>
      </div>

      <div style="padding:20px; display:flex; flex-direction:column; gap:14px; font-size:13px;">
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ผู้พิจารณาประเมิน:</label>
          <input type="text" id="m-header-evaluator" value="${header.evaluator || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ผู้บันทึก:</label>
          <input type="text" id="m-header-recorder" value="${header.recorder || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">วันที่ทำการประชุมความเสี่ยงพร้อมบันทึก:</label>
          <input type="text" id="m-header-date" value="${header.meeting_date || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">สถานที่:</label>
          <input type="text" id="m-header-location" value="${header.location || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ที่อยู่:</label>
          <input type="text" id="m-header-address" value="${header.address || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ระบบบริการที่สำคัญ:</label>
          <input type="text" id="m-header-critical" value="${header.critical_service || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>
      </div>

      <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
        <button id="btn-cancel-header-modal" style="background:#e2e8f0; color:#475569; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:600;">ยกเลิก</button>
        <button id="btn-save-header-modal" style="background:#0284c7; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600;">บันทึกข้อมูล</button>
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  const close = () => overlay.remove()
  overlay.querySelector('#btn-close-header-modal').onclick = close
  overlay.querySelector('#btn-cancel-header-modal').onclick = close

  overlay.querySelector('#btn-save-header-modal').onclick = () => {
    const updated = {
      evaluator: overlay.querySelector('#m-header-evaluator').value.trim(),
      recorder: overlay.querySelector('#m-header-recorder').value.trim(),
      meeting_date: overlay.querySelector('#m-header-date').value.trim(),
      location: overlay.querySelector('#m-header-location').value.trim(),
      address: overlay.querySelector('#m-header-address').value.trim(),
      critical_service: overlay.querySelector('#m-header-critical').value.trim()
    }
    onSave(updated)
    close()
  }
}

// Asset Item Add/Edit Modal
export function showAssetItemModal(item = null, onSave) {
  const isEdit = !!item
  const overlay = document.createElement('div')
  overlay.className = 'asset-risk-modal-overlay'
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;'

  const current = item || {
    order_num: 1,
    cluster: 'Application-Major',
    asset_name: '',
    description: '',
    concerned_app: '',
    critical_service: '',
    threat: '',
    vulnerability: '',
    existing_controls: 'มีระบบควบคุมการเข้าถึงและสำรองข้อมูลตามรอบปกติ',
    impact_c: true, impact_i: true, impact_a: true,
    severity_f: false, severity_s: false, severity_r: true, severity_i: true, severity_l: true, severity_o: true,
    likelihood: 2, impact: 4, risk_level: 8,
    asset_owner: 'หัวหน้างานเทคโนโลยีสารสนเทศ',
    treatment: 'Mitigate Risk',
    treatment_plan_main: '',
    sub_actions: []
  }

  overlay.innerHTML = `
    <div style="background:#fff; border-radius:14px; width:100%; max-width:800px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 15px 35px rgba(0,0,0,0.3); overflow:hidden;">
      <div style="padding:16px 20px; background:#0f172a; color:#fff; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size:16px; font-weight:700;">${isEdit ? '✏️ แก้ไขข้อความเสี่ยงทรัพย์สิน' : '➕ เพิ่มข้อความเสี่ยงทรัพย์สินใหม่'}</h3>
        <button id="btn-close-item-modal" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>
      </div>

      <div style="padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; font-size:13px;">
        
        <!-- Row 1: Order, Cluster, Name -->
        <div style="display:grid; grid-template-columns:80px 180px 1fr; gap:12px;">
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ลำดับ No.</label>
            <input type="number" id="m-item-order" value="${current.order_num}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">Cluster</label>
            <select id="m-item-cluster" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;">
              ${ASSET_RISK_CLUSTERS.map(c => `<option value="${c}" ${current.cluster === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ชื่อทรัพย์สิน (Asset Name) *</label>
            <input type="text" id="m-item-name" value="${current.asset_name}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" required />
          </div>
        </div>

        <!-- Row 2: Desc, App, Service -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">คำอธิบาย (Description)</label>
            <input type="text" id="m-item-desc" value="${current.description || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ระบบที่เกี่ยวข้อง (Concerned Application)</label>
            <input type="text" id="m-item-app" value="${current.concerned_app || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
        </div>

        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">บริการ/ฟังก์ชันที่สำคัญ (Critical Service / Function)</label>
          <input type="text" id="m-item-service" value="${current.critical_service || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>

        <!-- Threat & Vuln -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <label style="display:block; font-weight:600; color:#be123c; margin-bottom:4px;">⚠️ ภัยคุกคาม (Threat)</label>
            <textarea id="m-item-threat" rows="2" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;">${current.threat || ''}</textarea>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#b45309; margin-bottom:4px;">🔓 ช่องโหว่ (Vulnerability)</label>
            <textarea id="m-item-vuln" rows="2" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;">${current.vulnerability || ''}</textarea>
          </div>
        </div>

        <!-- Existing controls -->
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">มาตรการควบคุมในปัจจุบัน</label>
          <input type="text" id="m-item-controls" value="${current.existing_controls || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>

        <!-- CIA & FSRILO checkboxes -->
        <div style="display:grid; grid-template-columns:1fr 1.5fr; gap:12px; background:#f8fafc; padding:12px; border-radius:8px;">
          <div>
            <span style="font-weight:700; color:#334155; display:block; margin-bottom:6px;">กระทบต่อ CIA:</span>
            <div style="display:flex; gap:12px;">
              <label><input type="checkbox" id="m-item-c" ${current.impact_c ? 'checked' : ''} /> C (Confidentiality)</label>
              <label><input type="checkbox" id="m-item-i" ${current.impact_i ? 'checked' : ''} /> I (Integrity)</label>
              <label><input type="checkbox" id="m-item-a" ${current.impact_a ? 'checked' : ''} /> A (Availability)</label>
            </div>
          </div>
          <div>
            <span style="font-weight:700; color:#334155; display:block; margin-bottom:6px;">ความรุนแรงแต่ละด้าน (F,S,R,I,L,O):</span>
            <div style="display:flex; flex-wrap:wrap; gap:10px;">
              <label><input type="checkbox" id="m-item-f" ${current.severity_f ? 'checked' : ''} /> F</label>
              <label><input type="checkbox" id="m-item-s" ${current.severity_s ? 'checked' : ''} /> S</label>
              <label><input type="checkbox" id="m-item-r" ${current.severity_r ? 'checked' : ''} /> R</label>
              <label><input type="checkbox" id="m-item-i-sev" ${current.severity_i ? 'checked' : ''} /> I</label>
              <label><input type="checkbox" id="m-item-l" ${current.severity_l ? 'checked' : ''} /> L</label>
              <label><input type="checkbox" id="m-item-o" ${current.severity_o ? 'checked' : ''} /> O</label>
            </div>
          </div>
        </div>

        <!-- Likelihood, Impact, Owner, Treatment -->
        <div style="display:grid; grid-template-columns:100px 100px 150px 1fr; gap:12px; align-items:flex-end;">
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">โอกาสเกิด (A)</label>
            <select id="m-item-like" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;">
              ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${Number(current.likelihood) === v ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ความรุนแรง (B)</label>
            <select id="m-item-imp" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;">
              ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${Number(current.impact) === v ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">การตอบสนอง</label>
            <select id="m-item-treatment" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;">
              <option value="Mitigate Risk" ${current.treatment === 'Mitigate Risk' ? 'selected' : ''}>Mitigate Risk</option>
              <option value="Accept Risk" ${current.treatment === 'Accept Risk' ? 'selected' : ''}>Accept Risk</option>
              <option value="Transfer Risk" ${current.treatment === 'Transfer Risk' ? 'selected' : ''}>Transfer Risk</option>
              <option value="Avoid Risk" ${current.treatment === 'Avoid Risk' ? 'selected' : ''}>Avoid Risk</option>
              <option value="Continue Monitoring" ${current.treatment === 'Continue Monitoring' ? 'selected' : ''}>Continue Monitoring</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">เจ้าของความเสี่ยง (Owner)</label>
            <input type="text" id="m-item-owner" value="${current.asset_owner || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
        </div>

        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">แผนจัดการความเสี่ยง (ข้อใหญ่)</label>
          <input type="text" id="m-item-plan-main" value="${current.treatment_plan_main || ''}" style="width:100%; box-sizing:border-box; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
        </div>

      </div>

      <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
        <button id="btn-cancel-item-modal" style="background:#e2e8f0; color:#475569; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:600;">ยกเลิก</button>
        <button id="btn-save-item-modal" style="background:#0284c7; color:#fff; border:none; padding:8px 18px; border-radius:6px; cursor:pointer; font-weight:600;">บันทึกรายการ</button>
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  const close = () => overlay.remove()
  overlay.querySelector('#btn-close-item-modal').onclick = close
  overlay.querySelector('#btn-cancel-item-modal').onclick = close

  overlay.querySelector('#btn-save-item-modal').onclick = () => {
    const name = overlay.querySelector('#m-item-name').value.trim()
    if (!name) {
      alert('กรุณาระบุชื่อทรัพย์สิน (Asset Name)')
      return
    }

    const like = Number(overlay.querySelector('#m-item-like').value) || 1
    const imp = Number(overlay.querySelector('#m-item-imp').value) || 1

    const updated = {
      ...current,
      id: current.id || `asset_risk_${Date.now()}`,
      order_num: Number(overlay.querySelector('#m-item-order').value) || current.order_num,
      cluster: overlay.querySelector('#m-item-cluster').value,
      asset_name: name,
      description: overlay.querySelector('#m-item-desc').value.trim(),
      concerned_app: overlay.querySelector('#m-item-app').value.trim(),
      critical_service: overlay.querySelector('#m-item-service').value.trim(),
      threat: overlay.querySelector('#m-item-threat').value.trim(),
      vulnerability: overlay.querySelector('#m-item-vuln').value.trim(),
      existing_controls: overlay.querySelector('#m-item-controls').value.trim(),
      impact_c: overlay.querySelector('#m-item-c').checked,
      impact_i: overlay.querySelector('#m-item-i').checked,
      impact_a: overlay.querySelector('#m-item-a').checked,
      severity_f: overlay.querySelector('#m-item-f').checked,
      severity_s: overlay.querySelector('#m-item-s').checked,
      severity_r: overlay.querySelector('#m-item-r').checked,
      severity_i: overlay.querySelector('#m-item-i-sev').checked,
      severity_l: overlay.querySelector('#m-item-l').checked,
      severity_o: overlay.querySelector('#m-item-o').checked,
      likelihood: like,
      impact: imp,
      risk_level: like * imp,
      treatment: overlay.querySelector('#m-item-treatment').value,
      treatment_plan_main: overlay.querySelector('#m-item-plan-main').value.trim(),
      asset_owner: overlay.querySelector('#m-item-owner').value.trim(),
      sub_actions: current.sub_actions || []
    }

    onSave(updated)
    close()
  }
}

// Subaction Modal
export function showSubActionModal(subAction = null, onSave) {
  const isEdit = !!subAction
  const current = subAction || {
    name: '',
    expected_date: 'ภายใน 30 ก.ย. 69',
    progress_percent: 0,
    done_date: '',
    residual_c: false, residual_i: false, residual_a: false,
    residual_f: false, residual_s: false, residual_r: false, residual_i_sev: false, residual_l: false, residual_o: false,
    residual_likelihood: 1, residual_impact: 1, residual_risk_level: 1,
    further_action: 'เฝ้าติดตามเป็นระยะ'
  }

  const overlay = document.createElement('div')
  overlay.className = 'asset-risk-modal-overlay'
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;'

  overlay.innerHTML = `
    <div style="background:#fff; border-radius:14px; width:100%; max-width:680px; max-height:90vh; overflow-y:auto; box-shadow:0 15px 35px rgba(0,0,0,0.3); overflow:hidden;">
      <div style="padding:16px 20px; background:#0f172a; color:#fff; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size:16px; font-weight:700;">${isEdit ? '✏️ แก้ไขมาตรการย่อย' : '➕ เพิ่มมาตรการย่อยใหม่'}</h3>
        <button id="btn-close-sub-modal" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>
      </div>

      <div style="padding:20px; display:flex; flex-direction:column; gap:14px; font-size:13px;">
        
        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ชื่อมาตรการย่อย (Sub-action Name) *</label>
          <input type="text" id="m-sub-name" value="${current.name}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" required />
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">คาดว่าดำเนินการแล้วเสร็จ</label>
            <input type="text" id="m-sub-exp-date" value="${current.expected_date || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">วันที่ดำเนินการแล้วเสร็จจริง</label>
            <input type="text" id="m-sub-done-date" value="${current.done_date || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
        </div>

        <div>
          <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ความคืบหน้า (Progress: 0 - 100%)</label>
          <div style="display:flex; align-items:center; gap:12px;">
            <input type="range" id="m-sub-prog-range" min="0" max="100" step="5" value="${current.progress_percent || 0}" style="flex:1;" />
            <input type="number" id="m-sub-prog-num" min="0" max="100" value="${current.progress_percent || 0}" style="width:70px; padding:6px; border:1px solid #cbd5e1; border-radius:6px; text-align:center; font-weight:700;" />
            <span>%</span>
          </div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:10px;">
          <strong style="color:#0f172a; font-size:13.5px;">PART 4 : การประเมินความเสี่ยงคงเหลือ (Residual Risk)</strong>
          
          <div style="display:grid; grid-template-columns:120px 120px 1fr; gap:12px; align-items:flex-end;">
            <div>
              <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">โอกาสเกิด (A)</label>
              <select id="m-sub-like" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;">
                ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${Number(current.residual_likelihood) === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ความรุนแรง (B)</label>
              <select id="m-sub-imp" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px;">
                ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${Number(current.residual_impact) === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ระดับความเสี่ยงคงเหลือ</label>
              <div id="m-sub-score-preview" style="padding:6px 10px; border-radius:6px; font-weight:700; background:#dcfce7; color:#166534; text-align:center;">
                ${(current.residual_likelihood || 1) * (current.residual_impact || 1)}
              </div>
            </div>
          </div>

          <div>
            <label style="display:block; font-weight:600; color:#334155; margin-bottom:4px;">ดำเนินการเพิ่มเติมเพื่อลดความเสี่ยงให้น้อยลงอีก</label>
            <input type="text" id="m-sub-further" value="${current.further_action || ''}" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
          </div>
        </div>

      </div>

      <div style="padding:14px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
        <button id="btn-cancel-sub-modal" style="background:#e2e8f0; color:#475569; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:600;">ยกเลิก</button>
        <button id="btn-save-sub-modal" style="background:#0284c7; color:#fff; border:none; padding:8px 18px; border-radius:6px; cursor:pointer; font-weight:600;">บันทึกมาตรการย่อย</button>
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  const range = overlay.querySelector('#m-sub-prog-range')
  const num = overlay.querySelector('#m-sub-prog-num')
  range.oninput = () => { num.value = range.value }
  num.oninput = () => { range.value = num.value }

  const selLike = overlay.querySelector('#m-sub-like')
  const selImp = overlay.querySelector('#m-sub-imp')
  const preview = overlay.querySelector('#m-sub-score-preview')

  const updatePreview = () => {
    const l = Number(selLike.value) || 1
    const i = Number(selImp.value) || 1
    const s = l * i
    const badge = getAssetRiskLevelBadge(s)
    preview.innerText = `${s} (${badge.level})`
    preview.style.background = badge.bg
    preview.style.color = badge.color
  }
  selLike.onchange = updatePreview
  selImp.onchange = updatePreview

  const close = () => overlay.remove()
  overlay.querySelector('#btn-close-sub-modal').onclick = close
  overlay.querySelector('#btn-cancel-sub-modal').onclick = close

  overlay.querySelector('#btn-save-sub-modal').onclick = () => {
    const name = overlay.querySelector('#m-sub-name').value.trim()
    if (!name) {
      alert('กรุณาระบุชื่อมาตรการย่อย')
      return
    }

    const l = Number(selLike.value) || 1
    const i = Number(selImp.value) || 1

    const updated = {
      ...current,
      id: current.id || `sub_${Date.now()}`,
      name,
      expected_date: overlay.querySelector('#m-sub-exp-date').value.trim(),
      done_date: overlay.querySelector('#m-sub-done-date').value.trim(),
      progress_percent: Number(num.value) || 0,
      residual_likelihood: l,
      residual_impact: i,
      residual_risk_level: l * i,
      further_action: overlay.querySelector('#m-sub-further').value.trim()
    }

    onSave(updated)
    close()
  }
}

// 5. EXPORT UTILITIES (Word, CSV, Print)
export function exportAssetRiskWord(state) {
  const header = state.header || DEFAULT_ASSET_RISK_HEADER
  const items = state.items || ASSET_RISK_ITEMS
  const metrics = calculateAssetRiskMetrics(items)

  const rowsHtml = items.map((item, idx) => {
    const sub = (item.sub_actions && item.sub_actions[0]) || {}
    return `
      <tr>
        <td style="border:1px solid #999; padding:6px; text-align:center;">${idx + 1}</td>
        <td style="border:1px solid #999; padding:6px;">${item.cluster}</td>
        <td style="border:1px solid #999; padding:6px; font-weight:bold;">${item.asset_name}</td>
        <td style="border:1px solid #999; padding:6px;">${item.description || '-'}</td>
        <td style="border:1px solid #999; padding:6px;">${item.threat || '-'}</td>
        <td style="border:1px solid #999; padding:6px;">${item.vulnerability || '-'}</td>
        <td style="border:1px solid #999; padding:6px; text-align:center;">${item.likelihood}</td>
        <td style="border:1px solid #999; padding:6px; text-align:center;">${item.impact}</td>
        <td style="border:1px solid #999; padding:6px; text-align:center; font-weight:bold;">${item.risk_level}</td>
        <td style="border:1px solid #999; padding:6px;">${item.asset_owner || '-'}</td>
        <td style="border:1px solid #999; padding:6px;">${item.treatment || '-'}</td>
        <td style="border:1px solid #999; padding:6px;">${sub.name || item.treatment_plan_main || '-'}</td>
        <td style="border:1px solid #999; padding:6px; text-align:center;">${sub.progress_percent || 0}%</td>
        <td style="border:1px solid #999; padding:6px; text-align:center;">${sub.residual_risk_level || 1}</td>
      </tr>
    `
  }).join('')

  const docHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>1.4 Asset Risk Assessment and Risk Treatment</title>
      <style>
        body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 11pt; }
        table { border-collapse: collapse; width: 100%; }
        th { background: #e2e8f0; font-weight: bold; border: 1px solid #999; padding: 6px; }
      </style>
    </head>
    <body>
      <div style="text-align:center; margin-bottom:16px;">
        <img src="${LOGO_MOPH_BASE64}" width="70" height="70" /><br>
        <h2 style="margin:4px 0;">การประเมินและการจัดการความเสี่ยงทรัพย์สินและการบริการที่สำคัญ</h2>
        <h3 style="margin:2px 0; color:#334155;">1.4 Asset Risk Assessment and Risk Treatment</h3>
        <p style="margin:2px 0;">สำนักงานสาธารณสุขจังหวัดสระแก้ว</p>
      </div>

      <div style="margin-bottom:14px; font-size:10pt;">
        <p><strong>ผู้พิจารณาประเมิน :</strong> ${header.evaluator}</p>
        <p><strong>ผู้บันทึก :</strong> ${header.recorder} | <strong>วันที่ :</strong> ${header.meeting_date}</p>
        <p><strong>สถานที่ :</strong> ${header.location} | <strong>ที่อยู่ :</strong> ${header.address}</p>
        <p><strong>ระบบบริการที่สำคัญ :</strong> ${header.critical_service}</p>
        <p><strong>ผลการประเมินความเสี่ยงทรัพย์สินและการบริการที่สำคัญ (เฉลี่ย) โดยรวมขององค์กร :</strong> ${metrics.overallAvg}</p>
      </div>

      <table style="font-size:9pt;">
        <thead>
          <tr>
            <th>No.</th>
            <th>Cluster</th>
            <th>Asset Name</th>
            <th>คำอธิบาย</th>
            <th>ภัยคุกคาม (Threat)</th>
            <th>ช่องโหว่ (Vulner.)</th>
            <th>A</th>
            <th>B</th>
            <th>Risk Level</th>
            <th>Owner</th>
            <th>Treatment</th>
            <th>แผนจัดการความเสี่ยง</th>
            <th>Progress</th>
            <th>Residual</th>
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
  a.download = `1.4_Asset_Risk_Assessment_สสจ_สระแก้ว_${Date.now()}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportAssetRiskCsv(state) {
  const items = state.items || ASSET_RISK_ITEMS
  const headers = [
    'No.', 'Cluster', 'Asset Name', 'Description', 'Concerned Application', 'Critical Service',
    'Threat', 'Vulnerability', 'Existing Controls',
    'Impact C', 'Impact I', 'Impact A',
    'Sev F', 'Sev S', 'Sev R', 'Sev I', 'Sev L', 'Sev O',
    'Likelihood (A)', 'Impact (B)', 'Risk Level (C=A*B)',
    'Asset Owner', 'Risk Treatment', 'Treatment Plan Main',
    'Sub Action Name', 'Expected Finish Date', 'Progress %', 'Done Date',
    'Residual Likelihood', 'Residual Impact', 'Residual Risk Level', 'Further Actions'
  ]

  const rows = []
  items.forEach(item => {
    const subActions = item.sub_actions && item.sub_actions.length > 0 ? item.sub_actions : [{}]
    subActions.forEach(sub => {
      rows.push([
        item.order_num || '',
        `"${(item.cluster || '').replace(/"/g, '""')}"`,
        `"${(item.asset_name || '').replace(/"/g, '""')}"`,
        `"${(item.description || '').replace(/"/g, '""')}"`,
        `"${(item.concerned_app || '').replace(/"/g, '""')}"`,
        `"${(item.critical_service || '').replace(/"/g, '""')}"`,
        `"${(item.threat || '').replace(/"/g, '""')}"`,
        `"${(item.vulnerability || '').replace(/"/g, '""')}"`,
        `"${(item.existing_controls || '').replace(/"/g, '""')}"`,
        item.impact_c ? 'x' : '-', item.impact_i ? 'x' : '-', item.impact_a ? 'x' : '-',
        item.severity_f ? 'x' : '-', item.severity_s ? 'x' : '-', item.severity_r ? 'x' : '-',
        item.severity_i ? 'x' : '-', item.severity_l ? 'x' : '-', item.severity_o ? 'x' : '-',
        item.likelihood || 1, item.impact || 1, item.risk_level || 1,
        `"${(item.asset_owner || '').replace(/"/g, '""')}"`,
        `"${(item.treatment || '').replace(/"/g, '""')}"`,
        `"${(item.treatment_plan_main || '').replace(/"/g, '""')}"`,
        `"${(sub.name || '').replace(/"/g, '""')}"`,
        `"${(sub.expected_date || '').replace(/"/g, '""')}"`,
        sub.progress_percent || 0,
        `"${(sub.done_date || '').replace(/"/g, '""')}"`,
        sub.residual_likelihood || 1, sub.residual_impact || 1, sub.residual_risk_level || 1,
        `"${(sub.further_action || '').replace(/"/g, '""')}"`
      ].join(','))
    })
  })

  const csvContent = '\ufeff' + headers.join(',') + '\n' + rows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `1.4_Asset_Risk_Assessment_สสจ_สระแก้ว_${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 6. SUPABASE SYNCHRONIZATION HELPERS
export async function syncAssetRiskToSupabase(state) {
  try {
    if (!supabase) return

    // 1. Upsert Header
    if (state.header) {
      await supabase.from('cyber_asset_risk_header').upsert({
        id: 'default',
        evaluator: state.header.evaluator,
        recorder: state.header.recorder,
        meeting_date: state.header.meeting_date,
        location: state.header.location,
        address: state.header.address,
        critical_service: state.header.critical_service,
        updated_at: new Date().toISOString()
      })
    }

    // 2. Upsert Items
    if (state.items && state.items.length > 0) {
      const dbRows = state.items.map(item => ({
        id: item.id,
        item_no: item.order_num,
        cluster: item.cluster,
        asset_name: item.asset_name,
        description: item.description,
        concerned_app: item.concerned_app,
        critical_service: item.critical_service,
        threat: item.threat,
        vulnerability: item.vulnerability,
        existing_controls: item.existing_controls,
        impact_c: !!item.impact_c,
        impact_i: !!item.impact_i,
        impact_a: !!item.impact_a,
        severity_f: !!item.severity_f,
        severity_s: !!item.severity_s,
        severity_r: !!item.severity_r,
        severity_i: !!item.severity_i,
        severity_l: !!item.severity_l,
        severity_o: !!item.severity_o,
        likelihood: item.likelihood,
        impact: item.impact,
        risk_level: item.risk_level,
        asset_owner: item.asset_owner,
        treatment: item.treatment,
        treatment_plan_main: item.treatment_plan_main,
        sub_actions: item.sub_actions || [],
        updated_at: new Date().toISOString()
      }))
      await supabase.from('cyber_asset_risk_items').upsert(dbRows)
    }

    // 3. Upsert Global Module State
    await supabase.from('cyber_module_states').upsert({
      module_key: 'asset_risk_assessment',
      data: state,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.warn('Supabase sync skipped/deferred (offline or schema pending):', err.message)
  }
}

export async function fetchAssetRiskFromSupabase() {
  try {
    if (!supabase) return null

    // Check module state first
    const { data: stateData, error: stateErr } = await supabase
      .from('cyber_module_states')
      .select('data')
      .eq('module_key', 'asset_risk_assessment')
      .maybeSingle()

    if (!stateErr && stateData?.data?.items?.length > 0) {
      return stateData.data
    }

    // Otherwise check items table
    const { data: itemsData, error: itemsErr } = await supabase
      .from('cyber_asset_risk_items')
      .select('*')
      .order('item_no', { ascending: true })

    if (!itemsErr && itemsData && itemsData.length > 0) {
      const { data: headerData } = await supabase
        .from('cyber_asset_risk_header')
        .select('*')
        .eq('id', 'default')
        .maybeSingle()

      return {
        header: headerData || DEFAULT_ASSET_RISK_HEADER,
        logs: DEFAULT_ASSET_RISK_LOGS,
        items: itemsData.map(r => ({
          id: r.id,
          order_num: r.item_no,
          cluster: r.cluster,
          asset_name: r.asset_name,
          description: r.description,
          concerned_app: r.concerned_app,
          critical_service: r.critical_service,
          threat: r.threat,
          vulnerability: r.vulnerability,
          existing_controls: r.existing_controls,
          impact_c: r.impact_c,
          impact_i: r.impact_i,
          impact_a: r.impact_a,
          severity_f: r.severity_f,
          severity_s: r.severity_s,
          severity_r: r.severity_r,
          severity_i: r.severity_i,
          severity_l: r.severity_l,
          severity_o: r.severity_o,
          likelihood: r.likelihood,
          impact: r.impact,
          risk_level: r.risk_level,
          asset_owner: r.asset_owner,
          treatment: r.treatment,
          treatment_plan_main: r.treatment_plan_main,
          sub_actions: r.sub_actions || []
        }))
      }
    }
  } catch (err) {
    console.warn('Fetch from Supabase deferred:', err.message)
  }
  return null
}


// 7. EVENT BINDING HANDLER
export function bindAssetRiskEvents(el, state, onAction) {
  if (!el) return;

  // Subtabs navigation
  el.querySelectorAll('.asset-risk-subtab-btn').forEach(btn => {
    btn.onclick = () => {
      const subtab = btn.dataset.subtab;
      onAction({ type: 'change_subtab', subtab });
    };
  });

  // View mode toggle
  const btnViewCard = el.querySelector('#btn-view-card');
  if (btnViewCard) {
    btnViewCard.onclick = () => onAction({ type: 'change_view_mode', viewMode: 'card' });
  }

  const btnViewTable = el.querySelector('#btn-view-table');
  if (btnViewTable) {
    btnViewTable.onclick = () => onAction({ type: 'change_view_mode', viewMode: 'table' });
  }

  // Cluster pills filter
  el.querySelectorAll('.asset-cluster-pill').forEach(btn => {
    btn.onclick = () => {
      const cluster = btn.dataset.cluster;
      onAction({ type: 'change_cluster', cluster });
    };
  });

  // Search input
  const searchInput = el.querySelector('#input-asset-risk-search');
  if (searchInput) {
    let debounceTimer;
    searchInput.oninput = (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        onAction({ type: 'search', query: e.target.value.trim() });
      }, 250);
    };
  }

  // Edit Header
  const btnEditHeader = el.querySelector('#btn-edit-asset-risk-header');
  if (btnEditHeader) {
    btnEditHeader.onclick = () => {
      showAssetRiskHeaderModal(state.header || DEFAULT_ASSET_RISK_HEADER, (newHeader) => {
        onAction({ type: 'update_header', header: newHeader });
      });
    };
  }

  // Add Item
  const btnAddItem = el.querySelector('#btn-add-asset-risk-item');
  if (btnAddItem) {
    btnAddItem.onclick = () => {
      showAssetItemModal(null, (newItem) => {
        onAction({ type: 'add_item', item: newItem });
      });
    };
  }

  // Edit Item
  el.querySelectorAll('.btn-edit-asset-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const item = (state.items || []).find(it => it.id === id);
      if (item) {
        showAssetItemModal(item, (updatedItem) => {
          onAction({ type: 'update_item', item: updatedItem });
        });
      }
    };
  });

  // Delete Item
  el.querySelectorAll('.btn-del-asset-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const item = (state.items || []).find(it => it.id === id);
      const name = item ? item.asset_name : id;
      if (confirm(`ยืนยันการลบข้อความเสี่ยงทรัพย์สิน ${name} หรือไม่?`)) {
        onAction({ type: 'delete_item', id });
      }
    };
  });

  // Add Subaction
  el.querySelectorAll('.btn-add-subaction').forEach(btn => {
    btn.onclick = () => {
      const itemId = btn.dataset.itemId;
      showSubActionModal(null, (newSub) => {
        onAction({ type: 'add_subaction', itemId, subAction: newSub });
      });
    };
  });

  // Edit Subaction
  el.querySelectorAll('.btn-edit-subaction').forEach(btn => {
    btn.onclick = () => {
      const itemId = btn.dataset.itemId;
      const subId = btn.dataset.subId;
      const item = (state.items || []).find(it => it.id === itemId);
      const sub = item?.sub_actions?.find(s => s.id === subId);
      if (sub) {
        showSubActionModal(sub, (updatedSub) => {
          onAction({ type: 'update_subaction', itemId, subId, subAction: updatedSub });
        });
      }
    };
  });

  // Delete Subaction
  el.querySelectorAll('.btn-del-subaction').forEach(btn => {
    btn.onclick = () => {
      const itemId = btn.dataset.itemId;
      const subId = btn.dataset.subId;
      if (confirm('ยืนยันการลบมาตรการย่อยนี้หรือไม่?')) {
        onAction({ type: 'delete_subaction', itemId, subId });
      }
    };
  });

  // Add Log
  const btnAddLog = el.querySelector('#btn-add-asset-risk-log');
  if (btnAddLog) {
    btnAddLog.onclick = () => {
      const detail = prompt('กรอกรายละเอียดสิ่งที่ปรับปรุง/แก้ไข:');
      if (detail && detail.trim()) {
        const todayStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
        onAction({ type: 'add_log', date: todayStr, detail: detail.trim() });
      }
    };
  }

  // Delete Log
  el.querySelectorAll('.btn-del-log').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      if (confirm('ยืนยันการลบบันทึกประวัตินี้หรือไม่?')) {
        onAction({ type: 'delete_log', id });
      }
    };
  });

  // Exports & Print
  const btnWord = el.querySelector('#btn-export-asset-risk-word');
  if (btnWord) btnWord.onclick = () => exportAssetRiskWord(state);

  const btnCsv = el.querySelector('#btn-export-asset-risk-csv');
  if (btnCsv) btnCsv.onclick = () => exportAssetRiskCsv(state);

  const btnPrint = el.querySelector('#btn-print-asset-risk');
  if (btnPrint) btnPrint.onclick = () => window.print();

  // Reset default
  const btnReset = el.querySelector('#btn-reset-asset-risk-default');
  if (btnReset) {
    btnReset.onclick = () => {
      if (confirm('ยืนยันการรีเซ็ตข้อมูลเป็นค่ามาตรฐานเริ่มต้นจากไฟล์จริง (สสจ.สระแก้ว 9 รายการ) หรือไม่?')) {
        onAction({ type: 'reset_default' });
      }
    };
  }
}
