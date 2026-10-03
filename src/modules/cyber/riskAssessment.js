import {
  DEFAULT_RISK_METADATA,
  DEFAULT_UPDATE_LOGS,
  DEFAULT_RISK_ITEMS,
  RISK_CLUSTERS,
  MODEL_MATRIX_CONFIG,
  RISK_CRITERIA_DATA,
  MANDATORY_DOCUMENTS_DATA,
  COMPARE_MATRIX_DATA
} from './riskAssessmentData.js'
import { showNotification } from '../../lib/utils.js'

// Calculate all metrics dynamically
export function calculateRiskMetrics(riskState) {
  const items = riskState.items || []
  const total = items.length || 1

  let sumScore = 0
  let sumResidual = 0
  let sumProgress = 0

  let countVeryHigh = 0
  let countHigh = 0
  let countModerate = 0
  let countLow = 0

  // 5x5 matrix counts [row 1-5][col 1-5]
  const matrixCounts = {
    5: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    4: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    3: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    2: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    1: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  }

  // Cluster stats
  const clusterStats = {}
  RISK_CLUSTERS.forEach(c => {
    clusterStats[c] = { count: 0, sumScore: 0, sumProgress: 0 }
  })

  items.forEach(item => {
    const l = Number(item.likelihood) || 1
    const i = Number(item.impact) || 1
    const score = l * i
    item.risk_level = score

    const rl = Number(item.residual_likelihood) || 1
    const ri = Number(item.residual_impact) || 1
    const resScore = rl * ri
    item.residual_risk_score = resScore

    sumScore += score
    sumResidual += resScore
    sumProgress += Number(item.progress_percent) || 0

    // Categorize initial level
    if (score >= 15) countVeryHigh++
    else if (score >= 10) countHigh++
    else if (score >= 4) countModerate++
    else countLow++

    // Matrix
    const r = Math.min(Math.max(i, 1), 5)
    const c = Math.min(Math.max(l, 1), 5)
    if (matrixCounts[r] && matrixCounts[r][c] !== undefined) {
      matrixCounts[r][c]++
    }

    // Cluster stats
    if (!clusterStats[item.cluster]) {
      clusterStats[item.cluster] = { count: 0, sumScore: 0, sumProgress: 0 }
    }
    clusterStats[item.cluster].count++
    clusterStats[item.cluster].sumScore += score
    clusterStats[item.cluster].sumProgress += Number(item.progress_percent) || 0
  })

  const avgScore = total > 0 ? Number((sumScore / total).toFixed(2)) : 0
  const avgProgress = total > 0 ? Math.round(sumProgress / total) : 0
  const avgResidual = total > 0 ? Number((sumResidual / total).toFixed(2)) : 0

  // Overall level based on Criteria 1.4
  let overallLevel = 'Moderate'
  let overallBadge = 'bg-amber-100 text-amber-800 border-amber-300'
  let overallColorName = 'เหลือง (Yellow)'
  if (avgScore >= 12.5) {
    overallLevel = 'Very High'
    overallBadge = 'bg-rose-100 text-rose-800 border-rose-300'
    overallColorName = 'แดง (Red)'
  } else if (avgScore >= 9.5) {
    overallLevel = 'High'
    overallBadge = 'bg-orange-100 text-orange-800 border-orange-300'
    overallColorName = 'ส้ม (Orange)'
  } else if (avgScore >= 3.5) {
    overallLevel = 'Moderate'
    overallBadge = 'bg-amber-100 text-amber-800 border-amber-300'
    overallColorName = 'เหลือง (Yellow)'
  } else {
    overallLevel = 'Low'
    overallBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300'
    overallColorName = 'เขียว (Green)'
  }

  // Criteria 1.5 Mandatory Documents Tier
  let mandatoryTier = 'moderate'
  let mandatoryDocsCount = 13
  let mandatoryTierName = 'ปานกลาง'
  if (avgScore >= 9.5) {
    mandatoryTier = 'high'
    mandatoryDocsCount = 17
    mandatoryTierName = 'สูง'
  } else if (avgScore >= 4.5) {
    mandatoryTier = 'moderate'
    mandatoryDocsCount = 13
    mandatoryTierName = 'ปานกลาง'
  } else {
    mandatoryTier = 'low'
    mandatoryDocsCount = 10
    mandatoryTierName = 'ต่ำ'
  }

  return {
    total,
    sumScore,
    avgScore,
    avgProgress,
    avgResidual,
    overallLevel,
    overallBadge,
    overallColorName,
    mandatoryTier,
    mandatoryDocsCount,
    mandatoryTierName,
    countVeryHigh,
    countHigh,
    countModerate,
    countLow,
    matrixCounts,
    clusterStats
  }
}

export function getScoreBadge(score) {
  if (score >= 15) return { text: `${score} (Very High)`, bg: 'bg-rose-600 text-white', ring: 'ring-rose-500' }
  if (score >= 10) return { text: `${score} (High)`, bg: 'bg-orange-500 text-white', ring: 'ring-orange-400' }
  if (score >= 4) return { text: `${score} (Moderate)`, bg: 'bg-amber-400 text-amber-950 font-bold', ring: 'ring-amber-400' }
  return { text: `${score} (Low)`, bg: 'bg-emerald-600 text-white', ring: 'ring-emerald-500' }
}

export function getProgressBadge(pct) {
  if (pct > 80) return { color: 'bg-emerald-600', text: 'text-emerald-700', bgText: 'bg-emerald-50', label: 'ปลอดภัย (81-100%)' }
  if (pct >= 51) return { color: 'bg-amber-500', text: 'text-amber-800', bgText: 'bg-amber-50', label: 'ต้องเร่งดำเนินการ (51-80%)' }
  return { color: 'bg-rose-500', text: 'text-rose-700', bgText: 'bg-rose-50', label: 'เร่งด่วน (1-50%)' }
}

// Render Master HTML
export function renderRiskAssessmentHtml(riskState, activeSubTab = '3-assess', clusterFilter = 'all', matrixFilter = null, searchQuery = '') {
  const metrics = calculateRiskMetrics(riskState)
  ensureRiskAssessmentStyles()

  const tabs = [
    { id: '0-log', label: '0. Update Log', badge: `${(riskState.logs || []).length}`, icon: '📝' },
    { id: '1-matrix', label: '1. Model Matrix', badge: '5x5', icon: '🎯' },
    { id: '2-criteria', label: '2. Risk Criteria', badge: '7 เกณฑ์', icon: '📏' },
    { id: '3-assess', label: '3. Risk assess (Threat and Vul)', badge: `${metrics.total} ข้อ`, icon: '⚡' },
    { id: '4-mandatory', label: '4. Mandatory Document', badge: `${metrics.mandatoryDocsCount} ฉบับ`, icon: '📜' },
    { id: '5-compare', label: '5. Compare', badge: '15 ข้อ', icon: '⚖️' }
  ]

  return `
    <div class="risk-assessment-container" style="background:#f8fafc; border-radius:12px; padding:20px; font-family:'Sarabun', -apple-system, BlinkMacSystemFont, sans-serif;">
      
      <!-- Top Action & Navigation Header -->
      <div class="no-print" style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:16px 20px; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:16px; margin-bottom:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:#2563eb; color:#ffffff; font-size:12px; font-weight:700; padding:3px 8px; border-radius:4px;">ข้อ 2.3</span>
              <h2 style="margin:0; font-size:20px; font-weight:700; color:#1e293b;">
                Risk Assessment and Treatment (Threat & Vulnerability)
              </h2>
            </div>
            <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
              ระบบประเมินและบริหารจัดการความเสี่ยงด้านความมั่นคงปลอดภัยทางไซเบอร์ พร้อมแบบจำลองเมทริกซ์และเกณฑ์มาตรฐาน
            </p>
          </div>

          <div style="display:flex; align-items:center; gap:10px;">
            <button id="btn-export-risk-csv" class="btn-action" style="display:inline-flex; align-items:center; gap:6px; background:#10b981; color:#ffffff; border:none; padding:8px 14px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
              📊 ส่งออกไฟล์ Excel / CSV
            </button>
            <button id="btn-print-risk" class="btn-action" style="display:inline-flex; align-items:center; gap:6px; background:#3b82f6; color:#ffffff; border:none; padding:8px 14px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
              🖨️ พิมพ์รายงาน / PDF
            </button>
          </div>
        </div>

        <!-- Quick Summary Ribbon -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; background:#f1f5f9; padding:12px 16px; border-radius:8px; border:1px solid #e2e8f0; font-size:13px;">
          <div>
            <span style="color:#64748b;">คะแนนความเสี่ยงเฉลี่ย:</span>
            <span class="inline-block px-2 py-0.5 rounded font-bold ${metrics.overallBadge}" style="margin-left:6px;">
              ${metrics.avgScore} (${metrics.overallLevel})
            </span>
          </div>
          <div>
            <span style="color:#64748b;">เกณฑ์เอกสารขั้นต่ำ:</span>
            <span style="font-weight:700; color:#0f766e; margin-left:6px;">
              ${metrics.mandatoryDocsCount} ฉบับ (${metrics.mandatoryTierName})
            </span>
          </div>
          <div>
            <span style="color:#64748b;">ระดับความเสี่ยง:</span>
            <span style="margin-left:4px; font-size:12px;">
              <span style="color:#dc2626; font-weight:700;">🔴 ${metrics.countVeryHigh}</span> |
              <span style="color:#ea580c; font-weight:700;">🟠 ${metrics.countHigh}</span> |
              <span style="color:#d97706; font-weight:700;">🟡 ${metrics.countModerate}</span> |
              <span style="color:#16a34a; font-weight:700;">🟢 ${metrics.countLow}</span>
            </span>
          </div>
          <div>
            <span style="color:#64748b;">ความคืบหน้าภาพรวม:</span>
            <span style="font-weight:700; color:#2563eb; margin-left:6px;">
              ${metrics.avgProgress}%
            </span>
          </div>
        </div>

        <!-- Subtab Pills Navigation -->
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; border-top:1px solid #e2e8f0; padding-top:14px;">
          ${tabs.map(t => {
            const isActive = activeSubTab === t.id
            return `
              <button 
                class="subtab-btn ${isActive ? 'active' : ''}" 
                data-subtab="${t.id}"
                style="
                  display:inline-flex; align-items:center; gap:8px; 
                  padding:8px 14px; border-radius:20px; font-size:13px; font-weight:600; cursor:pointer;
                  border: 1px solid ${isActive ? '#2563eb' : '#cbd5e1'};
                  background: ${isActive ? '#2563eb' : '#ffffff'};
                  color: ${isActive ? '#ffffff' : '#334155'};
                  transition: all 0.2s;
                "
              >
                <span>${t.icon}</span>
                <span>${t.label}</span>
                <span style="
                  background:${isActive ? '#1d4ed8' : '#f1f5f9'}; 
                  color:${isActive ? '#ffffff' : '#475569'}; 
                  font-size:11px; padding:1px 7px; border-radius:10px; font-weight:700;
                ">
                  ${t.badge}
                </span>
              </button>
            `
          }).join('')}
        </div>
      </div>

      <!-- Main Subtab Content Area -->
      <div class="subtab-content-panel">
        ${activeSubTab === '0-log' ? renderUpdateLogTab(riskState) : ''}
        ${activeSubTab === '1-matrix' ? renderModelMatrixTab(riskState, metrics) : ''}
        ${activeSubTab === '2-criteria' ? renderRiskCriteriaTab() : ''}
        ${activeSubTab === '3-assess' ? renderRiskAssessTab(riskState, metrics, clusterFilter, matrixFilter, searchQuery) : ''}
        ${activeSubTab === '4-mandatory' ? renderMandatoryDocTab(metrics) : ''}
        ${activeSubTab === '5-compare' ? renderCompareTab() : ''}
      </div>

    </div>
  `
}

// SUBTAB 0: Update Log
function renderUpdateLogTab(riskState) {
  const logs = riskState.logs || []
  return `
    <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <div>
          <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">0. Update Log (บันทึกประวัติการปรับปรุง)</h3>
          <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
            ประวัติการแก้ไขและปรับปรุงเกณฑ์การประเมินความเสี่ยงด้านไซเบอร์ (2 คอลัมน์ตามต้นฉบับ)
          </p>
        </div>
        <button id="btn-add-log-row" class="no-print" style="display:inline-flex; align-items:center; gap:6px; background:#2563eb; color:#ffffff; border:none; padding:7px 14px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
          ➕ เพิ่มรายการปรับปรุง
        </button>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:14px; border:1px solid #cbd5e1;">
          <thead>
            <tr style="background:#0f172a; color:#ffffff; text-align:left;">
              <th style="padding:12px 16px; border:1px solid #334155; width:200px;">วันที่ปรับปรุง</th>
              <th style="padding:12px 16px; border:1px solid #334155;">สิ่งที่ปรับปรุง/แก้ไข</th>
              <th class="no-print" style="padding:12px 16px; border:1px solid #334155; width:90px; text-align:center;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${logs.length === 0 ? `
              <tr>
                <td colspan="3" style="text-align:center; padding:30px; color:#94a3b8;">ยังไม่มีรายการประวัติการปรับปรุง</td>
              </tr>
            ` : logs.map((log, idx) => `
              <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding:12px 16px; border:1px solid #e2e8f0; vertical-align:top;">
                  <input 
                    type="text" 
                    class="log-date-input" 
                    data-log-id="${log.id || idx}" 
                    value="${log.date || ''}" 
                    style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;"
                    placeholder="YYYY-MM-DD หรือ วันที่"
                  />
                </td>
                <td style="padding:12px 16px; border:1px solid #e2e8f0; vertical-align:top;">
                  <textarea 
                    class="log-detail-input" 
                    data-log-id="${log.id || idx}" 
                    rows="2" 
                    style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px; resize:vertical;"
                    placeholder="ระบุสิ่งที่ปรับปรุง/แก้ไข..."
                  >${log.detail || ''}</textarea>
                </td>
                <td class="no-print" style="padding:12px 16px; border:1px solid #e2e8f0; text-align:center; vertical-align:middle;">
                  <button 
                    class="btn-delete-log" 
                    data-log-id="${log.id || idx}" 
                    title="ลบแถวนี้"
                    style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// SUBTAB 1: Model Matrix
function renderModelMatrixTab(riskState, metrics) {
  const cfg = MODEL_MATRIX_CONFIG
  return `
    <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:20px;">
        <div>
          <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">1. Model Matrix (5x5 Heatmap)</h3>
          <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
            เมทริกซ์ประเมินความเสี่ยงด้านไซเบอร์ 5x5 พร้อมเส้นแบ่งระดับความเสี่ยงที่ยอมรับได้ (Risk Appetite) และตัวเลขสรุปความเสี่ยงแบบ Real-time
          </p>
        </div>
        <div class="no-print" style="display:flex; align-items:center; gap:8px; font-size:12px; background:#f8fafc; padding:8px 12px; border-radius:6px; border:1px solid #e2e8f0;">
          <span style="color:#64748b;">คำแนะนำ:</span>
          <span style="color:#334155;">คลิกที่ช่องใดก็ได้ในตารางเพื่อกรองดูรายการความเสี่ยงในแท็บที่ 3</span>
        </div>
      </div>

      <!-- Matrix Container -->
      <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="margin:0 auto; border-collapse:collapse; min-width:750px; font-size:13px; text-align:center; border:2px solid #334155;">
          
          <!-- Column Headers -->
          <thead>
            <tr>
              <th colspan="2" rowspan="2" style="background:#e2e8f0; border:1px solid #94a3b8; padding:10px; color:#1e293b; font-weight:700;">
                Likelihood / Probability<br/>
                <span style="font-size:12px; font-weight:600; color:#475569;">Severity / Impact</span>
              </th>
              ${cfg.cols.map(c => `
                <th style="background:#fef08a; border:1px solid #94a3b8; padding:8px; color:#1e293b; font-weight:700; width:120px;">
                  <div style="font-size:16px;">${c.id}</div>
                  <div style="font-size:13px; font-weight:700; color:#1e3a8a;">${c.nameEn}</div>
                  <div style="font-size:11px; font-weight:500; color:#475569;">${c.nameTh}</div>
                </th>
              `).join('')}
            </tr>
          </thead>

          <!-- Rows -->
          <tbody>
            ${cfg.rows.map(r => {
              const rId = r.id
              return `
                <tr>
                  <!-- Row Header -->
                  <td style="background:#e0e7ff; border:1px solid #94a3b8; font-size:16px; font-weight:700; color:#1e3a8a; width:40px; padding:6px;">
                    ${rId}
                  </td>
                  <td style="background:#e2e8f0; border:1px solid #94a3b8; font-size:12px; font-weight:700; color:#1e293b; width:170px; text-align:left; padding:6px 10px;">
                    ${r.nameEn}<br/>
                    <span style="font-size:11px; font-weight:500; color:#475569;">${r.nameTh}</span>
                  </td>

                  <!-- 5 Columns Cells -->
                  ${cfg.cols.map(c => {
                    const cId = c.id
                    const cellInfo = cfg.cells[rId][cId]
                    const countInCell = metrics.matrixCounts[rId][cId] || 0
                    
                    // Appetite border calculation (Exact matching screenshot red step boundary line)
                    // The step line in the screenshot:
                    // Under Row 4 Col 1 (so Row 4 Col 1 bottom border is red)
                    // Down between Col 1 and Col 2 for Row 3 (Row 3 Col 1 right border is red)
                    // Under Row 3 Col 2 (Row 3 Col 2 bottom border is red)
                    // Down between Col 2 and Col 3 for Row 2 & Row 1 (Row 2 Col 2 right border & Row 1 Col 2 right border is red)
                    let borderTop = '1px solid #94a3b8'
                    let borderBottom = '1px solid #94a3b8'
                    let borderLeft = '1px solid #94a3b8'
                    let borderRight = '1px solid #94a3b8'

                    if (rId === 4 && cId === 1) borderBottom = '4px solid #ef4444'
                    if (rId === 3 && cId === 1) {
                      borderTop = '4px solid #ef4444'
                      borderRight = '4px solid #ef4444'
                    }
                    if (rId === 3 && cId === 2) {
                      borderLeft = '4px solid #ef4444'
                      borderBottom = '4px solid #ef4444'
                    }
                    if (rId === 2 && cId === 2) {
                      borderTop = '4px solid #ef4444'
                      borderRight = '4px solid #ef4444'
                    }
                    if (rId === 1 && cId === 2) {
                      borderRight = '4px solid #ef4444'
                    }
                    if (rId === 2 && cId === 3) borderLeft = '4px solid #ef4444'
                    if (rId === 1 && cId === 3) borderLeft = '4px solid #ef4444'

                    return `
                      <td 
                        class="matrix-clickable-cell"
                        data-row="${rId}" 
                        data-col="${cId}"
                        title="คลิกเพื่อกรองข้อความเสี่ยงที่ตกช่องนี้ (${r.nameEn} x ${c.nameEn})"
                        style="
                          background:${cellInfo.bg}; 
                          color:${cellInfo.text}; 
                          border-top:${borderTop};
                          border-bottom:${borderBottom};
                          border-left:${borderLeft};
                          border-right:${borderRight};
                          padding:12px 6px; 
                          cursor:pointer;
                          position:relative;
                          transition:transform 0.15s, box-shadow 0.15s;
                        "
                      >
                        <div style="font-size:14px; font-weight:700;">${cellInfo.label}</div>
                        <div style="margin-top:4px;">
                          <span style="
                            display:inline-block; 
                            background:${countInCell > 0 ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.15)'}; 
                            color:#ffffff; 
                            font-size:11px; 
                            font-weight:700; 
                            padding:1px 6px; 
                            border-radius:10px;
                          ">
                            ${countInCell} ข้อ
                          </span>
                        </div>
                      </td>
                    `
                  }).join('')}
                </tr>
              `
            }).join('')}
          </tbody>
        </table>

        <!-- Appetite Footnote Marker -->
        <div style="display:flex; justify-content:center; margin-top:10px;">
          <div style="display:inline-flex; align-items:center; gap:8px; background:#fff1f2; border:1px solid #fecdd3; padding:6px 14px; border-radius:20px; font-size:12px;">
            <span style="display:inline-block; width:20px; height:4px; background:#ef4444; border-radius:2px;"></span>
            <span style="font-weight:700; color:#9f1239;">เส้นขั้นบันไดสีแดง: ระดับความเสี่ยงที่ยอมรับได้ (Risk Appetite)</span>
          </div>
        </div>
      </div>

      <!-- Legend Cards -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; font-size:12px;">
        <div style="background:#fee2e2; border:1px solid #fca5a5; padding:10px 14px; border-radius:6px; color:#991b1b;">
          <strong>🔴 Very High / Extreme (15-25):</strong> ความเสี่ยงขั้นวิกฤติ ต้องดำเนินการโดยทันทีและวางแผนจัดการ
        </div>
        <div style="background:#ffedd5; border:1px solid #fdba74; padding:10px 14px; border-radius:6px; color:#9a3412;">
          <strong>🟠 High (10-12):</strong> ความเสี่ยงสูง ต้องมีมาตรการลดความเสี่ยง
        </div>
        <div style="background:#fef9c3; border:1px solid #fde047; padding:10px 14px; border-radius:6px; color:#854d0e;">
          <strong>🟡 Moderate (4-9):</strong> ความเสี่ยงปานกลาง ต้องติดตามและมีมาตรการป้องกัน
        </div>
        <div style="background:#dcfce7; border:1px solid #86efac; padding:10px 14px; border-radius:6px; color:#166534;">
          <strong>🟢 Low / Very Low (1-3):</strong> ความเสี่ยงต่ำ ต้องติดตามเป็นระยะ
        </div>
      </div>
    </div>
  `
}

// SUBTAB 2: Risk Criteria
function renderRiskCriteriaTab() {
  const c = RISK_CRITERIA_DATA
  return `
    <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05); font-size:13px;">
      <div style="margin-bottom:20px;">
        <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">2. Risk Criteria (เกณฑ์การประเมินความเสี่ยงด้านไซเบอร์)</h3>
        <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
          อ้างอิง: กฎหมายลำดับรอง ฉบับที่ 6 พรบ.การรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562
        </p>
      </div>

      <!-- 1.1 Severity / Impact -->
      <div style="margin-bottom:28px;">
        <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin:0 0 10px 0; border-left:4px solid #2563eb; padding-left:10px;">
          1.1 เกณฑ์ผลกระทบ (Severity / Impact)
        </h4>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff; text-align:left;">
                <th style="padding:8px 10px; border:1px solid #334155; width:150px;">ระดับความรุนแรง</th>
                <th style="padding:8px 10px; border:1px solid #334155;">ลักษณะภัยคุกคาม</th>
                <th style="padding:8px 10px; border:1px solid #334155;">ความต่อเนื่องธุรกิจ (B)</th>
                <th style="padding:8px 10px; border:1px solid #334155;">ผู้ใช้บริการ (S)</th>
                <th style="padding:8px 10px; border:1px solid #334155;">ชื่อเสียง (R)</th>
                <th style="padding:8px 10px; border:1px solid #334155;">ภาพลักษณ์ (I)</th>
                <th style="padding:8px 10px; border:1px solid #334155;">กฎหมาย (L)</th>
                <th style="padding:8px 10px; border:1px solid #334155;">ระบบอื่นๆ (O)</th>
              </tr>
            </thead>
            <tbody>
              ${c.severityImpact.map((row, idx) => `
                <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; font-weight:700; color:#1e293b;">${row.level}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.threatDesc}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.business}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.userImpact}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.reputation}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.image}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.legal}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.otherSystems}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 1.2 Likelihood / Probability -->
      <div style="margin-bottom:28px;">
        <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin:0 0 10px 0; border-left:4px solid #2563eb; padding-left:10px;">
          1.2 เกณฑ์โอกาสเกิด (Likelihood / Probability)
        </h4>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff; text-align:left;">
                <th style="padding:8px 12px; border:1px solid #334155; width:220px;">ระดับโอกาสเกิด</th>
                <th style="padding:8px 12px; border:1px solid #334155;">รายละเอียดเหตุการณ์</th>
                <th style="padding:8px 12px; border:1px solid #334155; width:200px;">ความถี่ (Frequency)</th>
              </tr>
            </thead>
            <tbody>
              ${c.likelihoodProbability.map((row, idx) => `
                <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="padding:8px 12px; border:1px solid #e2e8f0; font-weight:700; color:#1e293b;">${row.level}</td>
                  <td style="padding:8px 12px; border:1px solid #e2e8f0;">${row.desc}</td>
                  <td style="padding:8px 12px; border:1px solid #e2e8f0; font-weight:600; color:#2563eb;">${row.freq}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 1.3 & 1.4 Risk Scoring & Average Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(400px, 1fr)); gap:20px; margin-bottom:28px;">
        
        <!-- 1.3 Scoring -->
        <div>
          <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin:0 0 10px 0; border-left:4px solid #2563eb; padding-left:10px;">
            1.3 ระดับความเสี่ยง (Risk Level & Scoring)
          </h4>
          <p style="margin:0 0 8px 0; font-size:12px; color:#475569; font-style:italic;">
            สมการ: ระดับความเสี่ยง (Risk Level) = โอกาสเกิด (Likelihood) x ความรุนแรง (Impact)
          </p>
          <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff; text-align:left;">
                <th style="padding:8px 10px; border:1px solid #334155; width:90px; text-align:center;">คะแนน</th>
                <th style="padding:8px 10px; border:1px solid #334155; width:130px;">ระดับความเสี่ยง</th>
                <th style="padding:8px 10px; border:1px solid #334155;">เกณฑ์ที่ยอมรับได้ / คำอธิบาย</th>
              </tr>
            </thead>
            <tbody>
              ${c.riskLevelScoring.map(row => `
                <tr>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; text-align:center; font-weight:700;">${row.score}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">
                    <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${row.badge}">${row.level}</span>
                  </td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- 1.4 Average -->
        <div>
          <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin:0 0 10px 0; border-left:4px solid #2563eb; padding-left:10px;">
            1.4 ค่าเฉลี่ยของระดับความเสี่ยง (Risk Level Average)
          </h4>
          <p style="margin:0 0 8px 0; font-size:12px; color:#475569; font-style:italic;">
            ใช้สำหรับประเมินภาพรวมทั้งองค์กร (16 Clusters, 80 ข้อ)
          </p>
          <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff; text-align:left;">
                <th style="padding:8px 10px; border:1px solid #334155; width:100px;">ระดับ (Level)</th>
                <th style="padding:8px 10px; border:1px solid #334155; width:90px; text-align:center;">ช่วงคะแนน</th>
                <th style="padding:8px 10px; border:1px solid #334155;">คำอธิบายการดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              ${c.riskLevelAverage.map(row => `
                <tr>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">
                    <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${row.badge}">${row.level}</span>
                  </td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; text-align:center; font-weight:700;">${row.score}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 1.5, 1.6 & 1.7 Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
        
        <!-- 1.5 Minimum Controls -->
        <div>
          <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin:0 0 8px 0; border-left:4px solid #2563eb; padding-left:10px;">
            1.5 มาตรการไซเบอร์ขั้นต่ำ (ตามเกณฑ์ พรบ.)
          </h4>
          <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff;">
                <th style="padding:6px 8px; border:1px solid #334155;">ระดับ</th>
                <th style="padding:6px 8px; border:1px solid #334155; text-align:center;">คะแนนเฉลี่ย</th>
                <th style="padding:6px 8px; border:1px solid #334155; text-align:center;">เอกสารขั้นต่ำ</th>
              </tr>
            </thead>
            <tbody>
              ${c.cyberActMinControls.map(row => `
                <tr>
                  <td style="padding:6px 8px; border:1px solid #e2e8f0;">
                    <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${row.badge}">${row.tier}</span>
                  </td>
                  <td style="padding:6px 8px; border:1px solid #e2e8f0; text-align:center; font-weight:700;">${row.scoreRange}</td>
                  <td style="padding:6px 8px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#0f766e;">${row.minDocs} ฉบับ</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- 1.6 Progress Status -->
        <div>
          <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin:0 0 8px 0; border-left:4px solid #2563eb; padding-left:10px;">
            1.6 สถานะความคืบหน้า (Progress)
          </h4>
          <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff;">
                <th style="padding:6px 8px; border:1px solid #334155; text-align:center;">ร้อยละ (%)</th>
                <th style="padding:6px 8px; border:1px solid #334155;">คำอธิบายสถานะ</th>
              </tr>
            </thead>
            <tbody>
              ${c.progressStatus.map(row => `
                <tr>
                  <td style="padding:6px 8px; border:1px solid #e2e8f0; text-align:center;">
                    <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${row.badge}">${row.range}</span>
                  </td>
                  <td style="padding:6px 8px; border:1px solid #e2e8f0;">${row.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- 1.7 Residual Risk -->
        <div>
          <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin:0 0 8px 0; border-left:4px solid #2563eb; padding-left:10px;">
            1.7 ความเสี่ยงคงเหลือ (Residual Risk)
          </h4>
          <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff;">
                <th style="padding:6px 8px; border:1px solid #334155; text-align:center;">ช่วงคะแนน</th>
                <th style="padding:6px 8px; border:1px solid #334155;">คำอธิบายการดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              ${c.residualRisk.map(row => `
                <tr>
                  <td style="padding:6px 8px; border:1px solid #e2e8f0; text-align:center;">
                    <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${row.badge}">${row.range}</span>
                  </td>
                  <td style="padding:6px 8px; border:1px solid #e2e8f0;">${row.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
}

// SUBTAB 3: Risk assess (Threat and Vul) - CORE ASSESSMENT SYSTEM
function renderRiskAssessTab(riskState, metrics, clusterFilter = 'all', matrixFilter = null, searchQuery = '') {
  const meta = riskState.metadata || DEFAULT_RISK_METADATA
  const items = riskState.items || []

  // Filter items
  const filteredItems = items.filter(item => {
    // Cluster filter
    if (clusterFilter !== 'all' && item.cluster !== clusterFilter) {
      return false
    }
    // Matrix cell filter
    if (matrixFilter && (item.impact !== matrixFilter.row || item.likelihood !== matrixFilter.col)) {
      return false
    }
    // Search query
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      const inThreat = (item.threat || '').toLowerCase().includes(q)
      const inVul = (item.vulnerability || '').toLowerCase().includes(q)
      const inPlan = (item.treatment_plan || '').toLowerCase().includes(q)
      const inCluster = (item.cluster || '').toLowerCase().includes(q)
      if (!inThreat && !inVul && !inPlan && !inCluster) return false
    }
    return true
  })

  // Group filtered items by cluster
  const clusterGroups = {}
  filteredItems.forEach(item => {
    if (!clusterGroups[item.cluster]) {
      clusterGroups[item.cluster] = []
    }
    clusterGroups[item.cluster].push(item)
  })

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- Top Metadata Header Box -->
      <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:20px 24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:16px; border-bottom:1px solid #e2e8f0; padding-bottom:16px; margin-bottom:16px;">
          <div>
            <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">
              การประเมินและการจัดการความเสี่ยงด้านการรักษาความมั่นคงปลอดภัยไซเบอร์
            </h3>
            <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
              [Risk Assessment and Risk Treatment (Threat & Vulner.) of Cybersecurity Act]
            </p>
          </div>
          <div style="text-align:right;">
            <span style="font-size:12px; color:#64748b;">หน่วยงานที่รับการประเมิน:</span>
            <div style="font-size:16px; font-weight:700; color:#0f766e;">${meta.orgName}</div>
          </div>
        </div>

        <!-- Meta fields grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; font-size:13px;">
          <div>
            <strong style="color:#475569;">ผู้พิจารณาประเมิน:</strong>
            <span style="color:#1e293b;">${meta.reviewer}</span>
          </div>
          <div>
            <strong style="color:#475569;">ผู้บันทึก:</strong>
            <span style="color:#1e293b;">${meta.recorder}</span>
          </div>
          <div>
            <strong style="color:#475569;">วันที่ประชุมบันทึก:</strong>
            <span style="color:#1e293b; font-weight:600;">${meta.meetingDate}</span>
          </div>
          <div>
            <strong style="color:#475569;">สถานที่:</strong>
            <span style="color:#1e293b;">${meta.location}</span>
          </div>
          <div style="grid-column: span 2;">
            <strong style="color:#475569;">ระบบบริการที่สำคัญ:</strong>
            <span style="color:#2563eb; font-weight:600;">${meta.mainSystem}</span>
          </div>
        </div>
      </div>

      <!-- KPI Executive Summary Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
        <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:16px; border-left:5px solid #2563eb; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:12px; font-weight:600; color:#64748b;">คะแนนความเสี่ยงเฉลี่ยองค์กร</div>
          <div style="display:flex; align-items:baseline; gap:8px; margin-top:4px;">
            <span style="font-size:26px; font-weight:800; color:#1e293b;">${metrics.avgScore}</span>
            <span class="inline-block px-2 py-0.5 rounded text-xs font-bold ${metrics.overallBadge}">
              ${metrics.overallLevel}
            </span>
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:4px;">จาก 16 Clusters (80 ข้อ)</div>
        </div>

        <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:16px; border-left:5px solid #0d9488; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:12px; font-weight:600; color:#64748b;">เอกสารมาตรการขั้นต่ำตามเกณฑ์</div>
          <div style="display:flex; align-items:baseline; gap:8px; margin-top:4px;">
            <span style="font-size:26px; font-weight:800; color:#0f766e;">${metrics.mandatoryDocsCount}</span>
            <span style="font-size:13px; font-weight:600; color:#0f766e;">ฉบับ (${metrics.mandatoryTierName})</span>
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:4px;">ตาม พรบ.ไซเบอร์ ฉบับที่ 12</div>
        </div>

        <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:16px; border-left:5px solid #ea580c; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:12px; font-weight:600; color:#64748b;">การกระจายระดับความเสี่ยง</div>
          <div style="display:flex; gap:10px; margin-top:8px; font-size:12px; font-weight:700;">
            <span style="color:#dc2626;">🔴 ${metrics.countVeryHigh}</span>
            <span style="color:#ea580c;">🟠 ${metrics.countHigh}</span>
            <span style="color:#d97706;">🟡 ${metrics.countModerate}</span>
            <span style="color:#16a34a;">🟢 ${metrics.countLow}</span>
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:4px;">ข้อความเสี่ยงเริ่มต้น</div>
        </div>

        <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:16px; border-left:5px solid #16a34a; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:12px; font-weight:600; color:#64748b;">ความคืบหน้าการจัดการภาพรวม</div>
          <div style="display:flex; align-items:baseline; gap:8px; margin-top:4px;">
            <span style="font-size:26px; font-weight:800; color:#16a34a;">${metrics.avgProgress}%</span>
            <span style="font-size:11px; color:#64748b;">ความเสี่ยงคงเหลือ: ${metrics.avgResidual}</span>
          </div>
          <div style="background:#e2e8f0; border-radius:10px; height:6px; margin-top:6px; overflow:hidden;">
            <div style="background:#16a34a; height:100%; width:${metrics.avgProgress}%;"></div>
          </div>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="no-print" style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:14px 18px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px;">
          <div>
            <label style="font-size:12px; font-weight:600; color:#64748b; display:block; margin-bottom:2px;">กรองตามหมวดหมู่ (Cluster):</label>
            <select id="select-risk-cluster" style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; min-width:240px; max-width:320px;">
              <option value="all" ${clusterFilter === 'all' ? 'selected' : ''}>-- แสดงทั้งหมด (16 Clusters, ${metrics.total} ข้อ) --</option>
              ${RISK_CLUSTERS.map(c => `
                <option value="${c}" ${clusterFilter === c ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>

          <div>
            <label style="font-size:12px; font-weight:600; color:#64748b; display:block; margin-bottom:2px;">ค้นหาภัยคุกคาม / ช่องโหว่:</label>
            <input 
              type="text" 
              id="input-risk-search" 
              value="${searchQuery || ''}" 
              placeholder="พิมพ์คำค้นหา..." 
              style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; width:200px;"
            />
          </div>

          ${matrixFilter ? `
            <div style="align-self:flex-end;">
              <span style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; font-size:12px; font-weight:600; padding:6px 10px; border-radius:6px; display:inline-flex; align-items:center; gap:6px;">
                กรองจาก Matrix: I=${matrixFilter.row}, L=${matrixFilter.col}
                <button id="btn-clear-matrix-filter" style="background:none; border:none; color:#dc2626; font-size:14px; font-weight:700; cursor:pointer;">×</button>
              </span>
            </div>
          ` : ''}
        </div>

        <div style="font-size:13px; color:#64748b;">
          แสดงผล <strong>${filteredItems.length}</strong> จาก <strong>${metrics.total}</strong> ข้อ
        </div>
      </div>

      <!-- Cluster Accordion / Groups -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        ${Object.keys(clusterGroups).length === 0 ? `
          <div style="background:#ffffff; border-radius:10px; padding:40px; text-align:center; color:#94a3b8; border:1px solid #e2e8f0;">
            <div style="font-size:32px; margin-bottom:8px;">🔍</div>
            <div style="font-size:16px; font-weight:600; color:#64748b;">ไม่พบรายการความเสี่ยงที่ตรงกับเงื่อนไขการค้นหา</div>
          </div>
        ` : Object.keys(clusterGroups).map((clusterName, cIdx) => {
          const cItems = clusterGroups[clusterName]
          const cStats = metrics.clusterStats[clusterName] || { count: cItems.length, sumScore: 0, sumProgress: 0 }
          const cAvg = cStats.count > 0 ? (cStats.sumScore / cStats.count).toFixed(1) : 0
          const cProg = cStats.count > 0 ? Math.round(cStats.sumProgress / cStats.count) : 0

          return `
            <div class="cluster-card" style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
              
              <!-- Cluster Header -->
              <div style="background:#1e293b; color:#ffffff; padding:12px 20px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="background:#3b82f6; color:#ffffff; font-size:12px; font-weight:700; padding:2px 8px; border-radius:12px;">
                    Cluster ${RISK_CLUSTERS.indexOf(clusterName) + 1}
                  </span>
                  <h4 style="margin:0; font-size:15px; font-weight:700; color:#f8fafc;">
                    ${clusterName}
                  </h4>
                </div>
                <div style="display:flex; align-items:center; gap:14px; font-size:12px;">
                  <span>จำนวน: <strong>${cItems.length}</strong> ข้อ</span>
                  <span>คะแนนเฉลี่ย: <strong style="color:#fde047;">${cAvg}</strong></span>
                  <span>คืบหน้า: <strong style="color:#86efac;">${cProg}%</strong></span>
                </div>
              </div>

              <!-- Risk Items in this Cluster -->
              <div style="padding:16px; display:flex; flex-direction:column; gap:16px; background:#f8fafc;">
                ${cItems.map((item, iIdx) => renderSingleRiskCard(item, iIdx)).join('')}
              </div>

            </div>
          `
        }).join('')}
      </div>

    </div>
  `
}

// Single Risk Item Component (4 Parts Layout)
function renderSingleRiskCard(item, idx) {
  const scoreBadge = getScoreBadge(item.risk_level)
  const resBadge = getScoreBadge(item.residual_risk_score)
  const progBadge = getProgressBadge(item.progress_percent)

  return `
    <div 
      class="risk-item-row" 
      data-risk-id="${item.id}"
      style="background:#ffffff; border-radius:8px; border:1px solid #e2e8f0; padding:16px; box-shadow:0 1px 2px rgba(0,0,0,0.04);"
    >
      <!-- Item Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; border-bottom:1px solid #f1f5f9; padding-bottom:10px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="background:#e2e8f0; color:#334155; font-size:12px; font-weight:700; padding:3px 8px; border-radius:4px;">
            ลำดับ ${item.no || (idx + 1)}
          </span>
          <span style="font-size:14px; font-weight:700; color:#1e293b;">
            ${item.threat}
          </span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="inline-block px-2.5 py-1 rounded text-xs font-bold ${scoreBadge.bg}">
            ระดับความเสี่ยง: ${scoreBadge.text}
          </span>
        </div>
      </div>

      <!-- 4-Parts Grid -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:16px; font-size:13px;">
        
        <!-- PART 1: RISK ASSESSMENT -->
        <div style="background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0; padding:12px;">
          <div style="font-weight:700; font-size:12px; color:#1e3a8a; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">
            PART 1: การประเมินความเสี่ยงเริ่มต้น
          </div>

          <div style="margin-bottom:8px;">
            <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">ช่องโหว่ (Vulnerability):</label>
            <div style="color:#334155;">${item.vulnerability || '-'}</div>
          </div>

          <div style="margin-bottom:8px;">
            <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">มาตรการควบคุมในปัจจุบัน:</label>
            <input 
              type="text" 
              class="risk-input" 
              data-field="current_control" 
              data-risk-id="${item.id}"
              value="${item.current_control || ''}" 
              style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px;"
            />
          </div>

          <!-- Impact Factors C, I, A -->
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="font-size:11px; font-weight:600; color:#64748b;">ผลกระทบต่อ:</span>
            <label style="display:inline-flex; align-items:center; gap:2px; font-size:12px; cursor:pointer;">
              <input type="checkbox" class="risk-cia-chk" data-factor="c" data-risk-id="${item.id}" ${item.impact_cia.c ? 'checked' : ''} /> C
            </label>
            <label style="display:inline-flex; align-items:center; gap:2px; font-size:12px; cursor:pointer;">
              <input type="checkbox" class="risk-cia-chk" data-factor="i" data-risk-id="${item.id}" ${item.impact_cia.i ? 'checked' : ''} /> I
            </label>
            <label style="display:inline-flex; align-items:center; gap:2px; font-size:12px; cursor:pointer;">
              <input type="checkbox" class="risk-cia-chk" data-factor="a" data-risk-id="${item.id}" ${item.impact_cia.a ? 'checked' : ''} /> A
            </label>
          </div>

          <!-- Likelihood & Impact Selectors -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:8px;">
            <div>
              <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">โอกาสเกิด (L 1-5):</label>
              <select class="risk-score-select" data-field="likelihood" data-risk-id="${item.id}" style="width:100%; padding:4px 6px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; font-weight:700;">
                ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${item.likelihood === v ? 'selected' : ''}>${v} - ${MODEL_MATRIX_CONFIG.cols[v-1].nameEn}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">ความรุนแรง (I 1-5):</label>
              <select class="risk-score-select" data-field="impact" data-risk-id="${item.id}" style="width:100%; padding:4px 6px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; font-weight:700;">
                ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${item.impact === v ? 'selected' : ''}>${v} - ${MODEL_MATRIX_CONFIG.rows[5-v].nameEn}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- PART 2: RISK TREATMENT -->
        <div style="background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0; padding:12px;">
          <div style="font-weight:700; font-size:12px; color:#1e3a8a; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">
            PART 2: การจัดการความเสี่ยง (Risk Treatment)
          </div>

          <div style="margin-bottom:8px;">
            <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">ตัวเลือกการตอบสนอง:</label>
            <select class="risk-input" data-field="treatment_option" data-risk-id="${item.id}" style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600;">
              ${['Mitigate Risk', 'Transfer Risk', 'Accept Risk', 'Avoid Risk', 'Continue Monitoring'].map(opt => `
                <option value="${opt}" ${item.treatment_option === opt ? 'selected' : ''}>${opt}</option>
              `).join('')}
            </select>
          </div>

          <div style="margin-bottom:8px;">
            <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">แผนจัดการความเสี่ยง (Treatment Plan):</label>
            <textarea 
              class="risk-input" 
              data-field="treatment_plan" 
              data-risk-id="${item.id}" 
              rows="2"
              style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; resize:vertical;"
            >${item.treatment_plan || ''}</textarea>
          </div>

          ${item.sub_actions && item.sub_actions.length > 0 ? `
            <div>
              <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">มาตรการย่อย:</label>
              <ul style="margin:2px 0 0 0; padding-left:16px; font-size:11px; color:#475569;">
                ${item.sub_actions.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- PART 3: PROGRESS -->
        <div style="background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0; padding:12px;">
          <div style="font-weight:700; font-size:12px; color:#1e3a8a; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">
            PART 3: ความคืบหน้า (Progress)
          </div>

          <div style="margin-bottom:8px;">
            <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">คาดว่าดำเนินการแล้วเสร็จ (Expected Date):</label>
            <input 
              type="text" 
              class="risk-input" 
              data-field="expected_finish_date" 
              data-risk-id="${item.id}"
              value="${item.expected_finish_date || ''}" 
              style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px;"
            />
          </div>

          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <label style="font-size:11px; font-weight:600; color:#64748b;">ความคืบหน้า (%):</label>
              <span class="inline-block px-1.5 py-0.5 rounded text-xs font-bold ${progBadge.bgText} ${progBadge.text}">
                ${item.progress_percent}% - ${progBadge.label}
              </span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <input 
                type="range" 
                class="risk-progress-slider" 
                data-risk-id="${item.id}"
                min="0" 
                max="100" 
                step="5"
                value="${item.progress_percent || 0}" 
                style="flex:1;"
              />
              <input 
                type="number" 
                class="risk-progress-num" 
                data-risk-id="${item.id}"
                min="0" 
                max="100" 
                value="${item.progress_percent || 0}" 
                style="width:55px; padding:2px 4px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; text-align:center;"
              />
            </div>
          </div>

          <div>
            <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">เจ้าของความเสี่ยง (Risk Owner):</label>
            <input 
              type="text" 
              class="risk-input" 
              data-field="risk_owner" 
              data-risk-id="${item.id}"
              value="${item.risk_owner || ''}" 
              style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px;"
            />
          </div>
        </div>

        <!-- PART 4: RESIDUAL RISK -->
        <div style="background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">
            <span style="font-weight:700; font-size:12px; color:#1e3a8a;">
              PART 4: ความเสี่ยงคงเหลือ (Residual Risk)
            </span>
            <span class="inline-block px-2 py-0.5 rounded text-xs font-bold ${resBadge.bg}">
              คะแนนคงเหลือ: ${resBadge.text}
            </span>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
            <div>
              <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">โอกาสคงเหลือ (RL):</label>
              <select class="risk-score-select" data-field="residual_likelihood" data-risk-id="${item.id}" style="width:100%; padding:4px 6px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; font-weight:700;">
                ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${item.residual_likelihood === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">ความรุนแรงคงเหลือ (RI):</label>
              <select class="risk-score-select" data-field="residual_impact" data-risk-id="${item.id}" style="width:100%; padding:4px 6px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; font-weight:700;">
                ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${item.residual_impact === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </div>
          </div>

          <div>
            <label style="font-size:11px; font-weight:600; color:#64748b; display:block;">การดำเนินการเพิ่มเติม (Further Actions):</label>
            <input 
              type="text" 
              class="risk-input" 
              data-field="further_actions" 
              data-risk-id="${item.id}"
              placeholder="แนวทางลดความเสี่ยงเพิ่มเติม..."
              value="${item.further_actions || ''}" 
              style="width:100%; padding:4px 8px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px;"
            />
          </div>
        </div>

      </div>
    </div>
  `
}

// SUBTAB 4: Mandatory Document
function renderMandatoryDocTab(metrics) {
  const docData = MANDATORY_DOCUMENTS_DATA
  return `
    <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="text-align:center; margin-bottom:24px;">
        <h3 style="margin:0; font-size:18px; font-weight:800; color:#1e293b;">
          ${docData.title}
        </h3>
        <p style="margin:4px 0 0 0; font-size:14px; font-weight:600; color:#475569;">
          ${docData.subtitle}
        </p>
      </div>

      <!-- 3 Columns Layout matching screenshot Screenshot 2569-10-03 at 14.23.31.png -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
        ${docData.tiers.map(tier => {
          const isActive = metrics.mandatoryTier === tier.id
          return `
            <div 
              style="
                border: 2px solid ${isActive ? '#2563eb' : '#cbd5e1'}; 
                border-radius:10px; 
                background:${isActive ? '#f0fdf4' : '#ffffff'}; 
                overflow:hidden;
                box-shadow:${isActive ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none'};
                position:relative;
              "
            >
              <!-- Card Header -->
              <div style="background:${isActive ? '#1e40af' : '#0f172a'}; color:#ffffff; padding:12px 16px; text-align:center;">
                <h4 style="margin:0; font-size:15px; font-weight:700;">
                  ${tier.title}
                </h4>
                <div style="font-size:12px; opacity:0.9; margin-top:2px;">
                  เกณฑ์คะแนนเฉลี่ย: ${tier.scoreRange}
                </div>
              </div>

              ${isActive ? `
                <div style="background:#dbeafe; color:#1e40af; font-size:12px; font-weight:700; text-align:center; padding:6px; border-bottom:1px solid #bfdbfe;">
                  ⭐ ระดับที่องค์กรเข้าข่ายในปัจจุบัน (คะแนนเฉลี่ย ${metrics.avgScore})
                </div>
              ` : ''}

              <!-- Items list -->
              <div style="padding:16px;">
                ${tier.parentNote ? `
                  <div style="background:#f1f5f9; padding:8px 12px; border-radius:6px; font-size:13px; font-weight:700; color:#334155; margin-bottom:12px; border-left:4px solid #3b82f6;">
                    ${tier.parentNote}
                  </div>
                ` : ''}

                <ol style="margin:0; padding-left:22px; font-size:13px; color:#1e293b; display:flex; flex-direction:column; gap:8px;">
                  ${tier.items.map(item => `
                    <li style="line-height:1.4;"><strong>${item}</strong></li>
                  `).join('')}
                </ol>
              </div>
            </div>
          `
        }).join('')}
      </div>

      <!-- Footnote -->
      <div style="margin-top:24px; padding:12px 16px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0; font-size:12px; color:#64748b; text-align:center;">
        * อ้างอิงตามประกาศการกำหนดมาตรการควบคุมความมั่นคงปลอดภัยไซเบอร์ขั้นต่ำ ฉบับที่ 12 สำหรับหน่วยงานโครงสร้างพื้นฐานสำคัญทางสารสนเทศ (CII)
      </div>
    </div>
  `
}

// SUBTAB 5: Compare
function renderCompareTab() {
  const data = COMPARE_MATRIX_DATA
  return `
    <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="margin-bottom:20px; text-align:center;">
        <h3 style="margin:0; font-size:18px; font-weight:800; color:#1e293b;">
          Risk Register vs Risk Assessment vs Risk Profile
        </h3>
        <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
          ตารางเปรียบเทียบความแตกต่างระหว่าง ทะเบียนความเสี่ยง, การประเมินความเสี่ยง และโปรไฟล์ความเสี่ยง (15 ข้อตามต้นฉบับ)
        </p>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13px; border:2px solid #000000;">
          <thead>
            <tr style="background:#ffffff; color:#000000; text-align:center; font-weight:800; border-bottom:2px solid #000000;">
              <th colspan="3" style="padding:12px; border:1px solid #000000; font-size:18px; background:#f8fafc;">
                Risk Register vs Risk Assessment vs Risk Profile
              </th>
              <th style="padding:12px; border:1px solid #000000; width:120px; font-size:12px;">
                Risk Identification / Phase
              </th>
              <th style="padding:12px; border:1px solid #000000; width:150px;">
                Risk Register<br/>
                <span style="font-size:12px; font-weight:normal;">(ทะเบียนความเสี่ยง)</span>
              </th>
              <th style="padding:12px; border:1px solid #000000; width:150px;">
                Risk Assessment<br/>
                <span style="font-size:12px; font-weight:normal;">(การประเมินความเสี่ยง)</span>
              </th>
              <th style="padding:12px; border:1px solid #000000; width:150px;">
                Risk Profile<br/>
                <span style="font-size:12px; font-weight:normal;">(โปรไฟล์ความเสี่ยง)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            ${data.map((row, idx) => {
              // Group phase rowspan simulation or label
              return `
                <tr style="background:#ffffff;">
                  <td style="padding:8px 12px; border:1px solid #000000; text-align:center; width:45px; font-weight:700;">
                    ${row.no}
                  </td>
                  <td style="padding:8px 12px; border:1px solid #000000; font-weight:700; width:220px;">
                    ${row.en}
                  </td>
                  <td style="padding:8px 12px; border:1px solid #000000; color:#334155;">
                    ${row.th}
                  </td>
                  <td style="padding:8px 12px; border:1px solid #000000; font-weight:700; text-align:center; background:#f8fafc; font-size:12px;">
                    ${row.phase}
                  </td>
                  
                  <!-- Register Cell -->
                  <td style="padding:8px 12px; border:1px solid #000000; text-align:center; ${getCellStyle(row.register)}">
                    ${renderMarker(row.register)}
                  </td>

                  <!-- Assess Cell -->
                  <td style="padding:8px 12px; border:1px solid #000000; text-align:center; ${getCellStyle(row.assess)}">
                    ${renderMarker(row.assess)}
                  </td>

                  <!-- Profile Cell -->
                  <td style="padding:8px 12px; border:1px solid #000000; text-align:center; ${getCellStyle(row.profile)}">
                    ${renderMarker(row.profile)}
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

function getCellStyle(val) {
  if (val === 'x-green' || val === 'x-red-on-green') return 'background:#86efac;'
  if (val === 'x-yellow') return 'background:#fef08a;'
  return ''
}

function renderMarker(val) {
  if (!val) return ''
  if (val === 'x') return '<strong style="font-size:16px;">x</strong>'
  if (val === 'x-green') return '<strong style="font-size:16px; color:#000000;">x</strong>'
  if (val === 'x-yellow') return '<strong style="font-size:16px; color:#000000;">x</strong>'
  if (val === 'x-red-on-green') return '<strong style="font-size:16px; color:#dc2626;">x</strong>'
  return val
}

// BIND EVENTS
export function bindRiskAssessmentEvents(containerEl, riskState, onUpdate) {
  if (!containerEl) return

  // 1. Subtab Switching
  containerEl.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = btn.getAttribute('data-subtab')
      if (tabId && onUpdate) {
        onUpdate({ type: 'switch_subtab', subtab: tabId })
      }
    })
  })

  // 2. Cluster Filter
  const clusterSelect = containerEl.querySelector('#select-risk-cluster')
  if (clusterSelect) {
    clusterSelect.addEventListener('change', (e) => {
      if (onUpdate) onUpdate({ type: 'filter_cluster', cluster: e.target.value })
    })
  }

  // 3. Search Filter
  const searchInput = containerEl.querySelector('#input-risk-search')
  if (searchInput) {
    let debounceTimer
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        if (onUpdate) onUpdate({ type: 'search', query: e.target.value })
      }, 300)
    })
  }

  // 4. Matrix Click Cell -> Jump to Tab 3 with filter
  containerEl.querySelectorAll('.matrix-clickable-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const row = Number(cell.getAttribute('data-row'))
      const col = Number(cell.getAttribute('data-col'))
      if (onUpdate) {
        onUpdate({ 
          type: 'matrix_filter', 
          matrixFilter: { row, col },
          subtab: '3-assess'
        })
      }
    })
  })

  // Clear Matrix filter
  const clearMatrixBtn = containerEl.querySelector('#btn-clear-matrix-filter')
  if (clearMatrixBtn) {
    clearMatrixBtn.addEventListener('click', () => {
      if (onUpdate) onUpdate({ type: 'clear_matrix_filter' })
    })
  }

  // 5. Update Risk Fields (L, I, Scores, CIA, etc)
  containerEl.querySelectorAll('.risk-score-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const riskId = sel.getAttribute('data-risk-id')
      const field = sel.getAttribute('data-field')
      const val = Number(sel.value)
      if (onUpdate) onUpdate({ type: 'update_risk_score', riskId, field, value: val })
    })
  })

  containerEl.querySelectorAll('.risk-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const riskId = input.getAttribute('data-risk-id')
      const field = input.getAttribute('data-field')
      const val = input.value
      if (onUpdate) onUpdate({ type: 'update_risk_field', riskId, field, value: val })
    })
  })

  // Progress sliders
  containerEl.querySelectorAll('.risk-progress-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const riskId = slider.getAttribute('data-risk-id')
      const val = Number(e.target.value)
      // Sync number box
      const numInput = containerEl.querySelector(`.risk-progress-num[data-risk-id="${riskId}"]`)
      if (numInput) numInput.value = val
    })
    slider.addEventListener('change', (e) => {
      const riskId = slider.getAttribute('data-risk-id')
      const val = Number(e.target.value)
      if (onUpdate) onUpdate({ type: 'update_risk_field', riskId, field: 'progress_percent', value: val })
    })
  })

  containerEl.querySelectorAll('.risk-progress-num').forEach(num => {
    num.addEventListener('change', (e) => {
      const riskId = num.getAttribute('data-risk-id')
      let val = Number(e.target.value) || 0
      val = Math.max(0, Math.min(100, val))
      num.value = val
      if (onUpdate) onUpdate({ type: 'update_risk_field', riskId, field: 'progress_percent', value: val })
    })
  })

  // CIA checkboxes
  containerEl.querySelectorAll('.risk-cia-chk').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const riskId = chk.getAttribute('data-risk-id')
      const factor = chk.getAttribute('data-factor')
      const checked = chk.checked
      if (onUpdate) onUpdate({ type: 'update_risk_cia', riskId, factor, checked })
    })
  })

  // 6. Update Log Events
  const addLogBtn = containerEl.querySelector('#btn-add-log-row')
  if (addLogBtn) {
    addLogBtn.addEventListener('click', () => {
      if (onUpdate) onUpdate({ type: 'add_log_row' })
    })
  }

  containerEl.querySelectorAll('.log-date-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const logId = input.getAttribute('data-log-id')
      if (onUpdate) onUpdate({ type: 'update_log_date', logId, date: e.target.value })
    })
  })

  containerEl.querySelectorAll('.log-detail-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const logId = input.getAttribute('data-log-id')
      if (onUpdate) onUpdate({ type: 'update_log_detail', logId, detail: e.target.value })
    })
  })

  containerEl.querySelectorAll('.btn-delete-log').forEach(btn => {
    btn.addEventListener('click', () => {
      const logId = btn.getAttribute('data-log-id')
      if (confirm('คุณต้องการลบรายการบันทึกนี้หรือไม่?') && onUpdate) {
        onUpdate({ type: 'delete_log', logId })
      }
    })
  })

  // 7. Print Report
  const printBtn = containerEl.querySelector('#btn-print-risk')
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print()
    })
  }

  // 8. Export CSV
  const exportBtn = containerEl.querySelector('#btn-export-risk-csv')
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportRiskAssessmentToCsv(riskState)
    })
  }
}

// Export CSV / Excel Compatible
export function exportRiskAssessmentToCsv(riskState) {
  const items = riskState.items || []
  const metrics = calculateRiskMetrics(riskState)

  let csv = '\uFEFF' // UTF-8 BOM
  csv += 'การประเมินและการจัดการความเสี่ยงด้านการรักษาความมั่นคงปลอดภัยไซเบอร์ (Risk Assessment & Treatment)\n'
  csv += `หน่วยงาน,${riskState.metadata?.orgName || 'สสจ.สระแก้ว'}\n`
  csv += `คะแนนเฉลี่ยภาพรวม,${metrics.avgScore},ระดับ,${metrics.overallLevel}\n`
  csv += `เอกสารมาตรการขั้นต่ำ,${metrics.mandatoryDocsCount} ฉบับ (${metrics.mandatoryTierName})\n\n`

  // Table Headers
  const headers = [
    'No',
    'หมวดหมู่ (Cluster)',
    'ภัยคุกคาม (Threat)',
    'ช่องโหว่ (Vulnerability)',
    'มาตรการควบคุมปัจจุบัน',
    'C', 'I', 'A',
    'โอกาสเกิด (L)',
    'ความรุนแรง (I)',
    'ระดับความเสี่ยงเริ่มต้น (Risk Level)',
    'เจ้าของความเสี่ยง (Risk Owner)',
    'ตัวเลือกการตอบสนอง (Treatment Option)',
    'แผนจัดการความเสี่ยง (Treatment Plan)',
    'กำหนดแล้วเสร็จ (Expected Date)',
    'ความคืบหน้า (%)',
    'โอกาสคงเหลือ (RL)',
    'ความรุนแรงคงเหลือ (RI)',
    'คะแนนคงเหลือ (Residual Score)',
    'การดำเนินการเพิ่มเติม'
  ]
  csv += headers.map(h => `"${h}"`).join(',') + '\n'

  items.forEach((item, idx) => {
    const row = [
      item.no || (idx + 1),
      item.cluster,
      item.threat,
      item.vulnerability,
      item.current_control,
      item.impact_cia?.c ? 'X' : '-',
      item.impact_cia?.i ? 'X' : '-',
      item.impact_cia?.a ? 'X' : '-',
      item.likelihood,
      item.impact,
      item.risk_level,
      item.risk_owner,
      item.treatment_option,
      item.treatment_plan,
      item.expected_finish_date,
      item.progress_percent,
      item.residual_likelihood,
      item.residual_impact,
      item.residual_risk_score,
      item.further_actions || ''
    ]
    csv += row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',') + '\n'
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Risk_Assessment_Cyber_SKO_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showNotification('ส่งออกไฟล์ข้อมูลการประเมินความเสี่ยงสำเร็จ (CSV/Excel)', 'success')
}

// Print & Display CSS Styles
function ensureRiskAssessmentStyles() {
  if (document.getElementById('risk-assessment-styles')) return
  const style = document.createElement('style')
  style.id = 'risk-assessment-styles'
  style.textContent = `
    .matrix-clickable-cell:hover {
      transform: scale(1.04);
      z-index: 10;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .subtab-btn:hover {
      opacity: 0.9;
    }
    @media print {
      body * {
        visibility: hidden;
      }
      .risk-assessment-container, .risk-assessment-container * {
        visibility: visible;
      }
      .risk-assessment-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100% !important;
        background: #ffffff !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
    }
  `
  document.head.appendChild(style)
}
