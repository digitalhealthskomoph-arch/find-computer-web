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
    clusterStats[c] = { count: 0, sumScore: 0, sumProgress: 0, avgScore: 0 }
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

    // Recalculate average progress from sub_actions if present
    if (item.sub_actions && item.sub_actions.length > 0) {
      const subSum = item.sub_actions.reduce((acc, s) => acc + (Number(s.progress_percent) || 0), 0)
      item.progress_percent = Math.round(subSum / item.sub_actions.length)
    }

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
      clusterStats[item.cluster] = { count: 0, sumScore: 0, sumProgress: 0, avgScore: 0 }
    }
    clusterStats[item.cluster].count++
    clusterStats[item.cluster].sumScore += score
    clusterStats[item.cluster].sumProgress += Number(item.progress_percent) || 0
  })

  // Compute average per cluster
  Object.keys(clusterStats).forEach(cName => {
    const cs = clusterStats[cName]
    cs.avgScore = cs.count > 0 ? Number((cs.sumScore / cs.count).toFixed(2)) : 0
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
  if (score >= 15) return { text: `${score} (Very High)`, bg: 'background:#fee2e2; color:#991b1b; border:1px solid #f87171;' }
  if (score >= 10) return { text: `${score} (High)`, bg: 'background:#ffedd5; color:#9a3412; border:1px solid #fb923c;' }
  if (score >= 4) return { text: `${score} (Moderate)`, bg: 'background:#fef9c3; color:#854d0e; border:1px solid #facc15;' }
  return { text: `${score} (Low)`, bg: 'background:#dcfce7; color:#166534; border:1px solid #4ade80;' }
}

export function getProgressBadge(pct) {
  if (pct > 80) return { color: 'background:#16a34a; color:#fff;', label: 'ปลอดภัย (81-100%)' }
  if (pct >= 51) return { color: 'background:#eab308; color:#fff;', label: 'ต้องเร่งดำเนินการ (51-80%)' }
  return { color: 'background:#ef4444; color:#fff;', label: 'เร่งด่วน (1-50%)' }
}

// Master HTML
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
              ระบบประเมินและบริหารจัดการความเสี่ยงด้านความมั่นคงปลอดภัยทางไซเบอร์ พร้อมตาราง Data Grid 4 พาร์ท และแบบจำลองเมทริกซ์
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

        <!-- Subtab Navigation -->
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
          <tbody>
            ${cfg.rows.map(r => {
              const rId = r.id
              return `
                <tr>
                  <td style="background:#e0e7ff; border:1px solid #94a3b8; font-size:16px; font-weight:700; color:#1e3a8a; width:40px; padding:6px;">
                    ${rId}
                  </td>
                  <td style="background:#e2e8f0; border:1px solid #94a3b8; font-size:12px; font-weight:700; color:#1e293b; width:170px; text-align:left; padding:6px 10px;">
                    ${r.nameEn}<br/>
                    <span style="font-size:11px; font-weight:500; color:#475569;">${r.nameTh}</span>
                  </td>
                  ${cfg.cols.map(c => {
                    const cId = c.id
                    const cellInfo = cfg.cells[rId][cId]
                    const countInCell = metrics.matrixCounts[rId][cId] || 0
                    
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

// SUBTAB 3: Risk assess (Threat and Vul) - CORE ASSESSMENT DATA GRID TABLE (4 PARTS)
function renderRiskAssessTab(riskState, metrics, clusterFilter = 'all', matrixFilter = null, searchQuery = '') {
  const meta = riskState.metadata || DEFAULT_RISK_METADATA
  const items = riskState.items || []

  // Filter items
  const filteredItems = items.filter(item => {
    if (clusterFilter !== 'all' && item.cluster !== clusterFilter) return false
    if (matrixFilter && (item.impact !== matrixFilter.row || item.likelihood !== matrixFilter.col)) return false
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim()
      const inThreat = (item.threat || '').toLowerCase().includes(q)
      const inVul = (item.vulnerability || '').toLowerCase().includes(q)
      const inPlan = (item.treatment_plan || '').toLowerCase().includes(q)
      const inCluster = (item.cluster || '').toLowerCase().includes(q)
      const inSub = (item.sub_actions || []).some(s => (s.name || '').toLowerCase().includes(q))
      if (!inThreat && !inVul && !inPlan && !inCluster && !inSub) return false
    }
    return true
  })

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- 1. EDITABLE HEADER CARD (ตรงตามภาพ Screenshot & ความต้องการของผู้ใช้) -->
      <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:20px 24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:16px; border-bottom:1px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
          <div>
            <h3 style="margin:0; font-size:18px; font-weight:800; color:#1e293b;">
              การประเมินและการจัดการความเสี่ยงด้านการรักษาความมั่นคงปลอดภัยไซเบอร์
            </h3>
            <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
              [Risk Assessment and Risk Treatment (Threat & Vulner.) of Cybersecurity Act]
            </p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px; color:#64748b; margin-bottom:2px;">หน่วยงานที่รับการประเมิน:</div>
            <div style="font-size:16px; font-weight:800; color:#0f766e;">
              ${meta.orgName || 'สำนักงานสาธารณสุขจังหวัดสระแก้ว'}
            </div>
          </div>
        </div>

        <!-- Editable Metadata Form Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:14px; font-size:13px;">
          <div>
            <label style="display:block; font-weight:700; color:#475569; margin-bottom:4px;">
              ผู้พิจารณาประเมิน:
            </label>
            <input 
              type="text" 
              class="risk-meta-input form-control" 
              data-field="reviewer"
              value="${meta.reviewer || ''}"
              placeholder="เช่น สมาชิกคณะกรรมการพิจารณาความเสี่ยง"
              style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;"
            />
          </div>

          <div>
            <label style="display:block; font-weight:700; color:#475569; margin-bottom:4px;">
              ผู้บันทึก:
            </label>
            <input 
              type="text" 
              class="risk-meta-input form-control" 
              data-field="recorder"
              value="${meta.recorder || ''}"
              placeholder="เช่น นายธนกฤต นิธิตันติปัญญา, สมาชิกคณะกรรมการพิจารณาความเสี่ยง"
              style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;"
            />
          </div>

          <div>
            <label style="display:block; font-weight:700; color:#475569; margin-bottom:4px;">
              วันที่ประชุมบันทึก:
            </label>
            <input 
              type="text" 
              class="risk-meta-input form-control" 
              data-field="meetingDate"
              value="${meta.meetingDate || ''}"
              placeholder="เช่น 23 ก.พ. 69"
              style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;"
            />
          </div>

          <div>
            <label style="display:block; font-weight:700; color:#475569; margin-bottom:4px;">
              สถานที่:
            </label>
            <input 
              type="text" 
              class="risk-meta-input form-control" 
              data-field="location"
              value="${meta.location || ''}"
              placeholder="เช่น ห้องประชุม Cockpit สำนักงานสาธารณสุขจังหวัดสระแก้ว"
              style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;"
            />
          </div>

          <div>
            <label style="display:block; font-weight:700; color:#475569; margin-bottom:4px;">
              ระบบบริการที่สำคัญ:
            </label>
            <input 
              type="text" 
              class="risk-meta-input form-control" 
              data-field="mainSystem"
              value="${meta.mainSystem || ''}"
              placeholder="เช่น All application as HIS"
              style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; font-weight:600; color:#2563eb;"
            />
          </div>

          <div class="no-print" style="display:flex; align-items:flex-end;">
            <div style="font-size:12px; color:#10b981; font-weight:600; background:#ecfdf5; padding:6px 12px; border-radius:6px; border:1px solid #a7f3d0; width:100%;">
              ✓ ข้อมูลส่วนหัวจะถูกบันทึกอัตโนมัติทันทีที่พิมพ์
            </div>
          </div>
        </div>

      </div>

      <!-- Filters & Toolbar -->
      <div class="no-print" style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:14px 18px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">กรองตามหมวดหมู่ (Cluster):</label>
            <select id="select-risk-cluster" style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; min-width:260px; max-width:340px;">
              <option value="all" ${clusterFilter === 'all' ? 'selected' : ''}>-- แสดงทั้งหมด (16 Clusters, ${metrics.total} ข้อ) --</option>
              ${RISK_CLUSTERS.map(c => `
                <option value="${c}" ${clusterFilter === c ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>

          <div>
            <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">ค้นหาภัยคุกคาม / ช่องโหว่ / แผน:</label>
            <input 
              type="text" 
              id="input-risk-search" 
              value="${searchQuery || ''}" 
              placeholder="พิมพ์ข้อความค้นหา..." 
              style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; width:220px;"
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

        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:13px; color:#64748b;">
            แสดงผล <strong>${filteredItems.length}</strong> จาก <strong>${metrics.total}</strong> ข้อ
          </span>
          <button id="btn-add-new-risk-item" class="btn-action" style="background:#2563eb; color:#ffffff; border:none; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
            ➕ เพิ่มข้อความเสี่ยงใหม่
          </button>
        </div>
      </div>

      <!-- 2. FULL EXCEL DATA GRID TABLE (4 PARTS) -->
      <div class="risk-datagrid-scroll" style="overflow-x:auto; max-width:100%; border:1px solid #cbd5e1; border-radius:8px; background:#ffffff;">
        <table class="risk-datagrid-table" style="width:100%; min-width:2200px; border-collapse:collapse; font-size:12px; text-align:left;">
          
          <!-- TIER 1 HEADER: 4 PARTS -->
          <thead>
            <tr style="text-align:center; font-weight:800; font-size:13px; color:#ffffff;">
              <th rowspan="2" class="sticky-col-1" style="background:#0f172a; border:1px solid #334155; padding:10px 6px; width:50px;">
                No.
              </th>
              <th rowspan="2" class="sticky-col-2" style="background:#0f172a; border:1px solid #334155; padding:10px 8px; width:150px; text-align:left;">
                หมวดหมู่ความเสี่ยง (Risk Cluster)
              </th>
              
              <!-- PART 1 -->
              <th colspan="17" style="background:#1e3a8a; border:1px solid #1e40af; padding:10px;">
                PART 1 : RISK ASSESSMENT (การประเมินความเสี่ยงก่อนจัดการ)
              </th>

              <!-- PART 2 -->
              <th colspan="4" style="background:#0f766e; border:1px solid #115e59; padding:10px;">
                PART 2 : RISK TREATMENT (การจัดการความเสี่ยง)
              </th>

              <!-- PART 3 -->
              <th colspan="2" style="background:#15803d; border:1px solid #166534; padding:10px;">
                PART 3 : PROGRESS (ความคืบหน้า)
              </th>

              <!-- PART 4 -->
              <th colspan="13" style="background:#4338ca; border:1px solid #3730a3; padding:10px;">
                PART 4 : RISK EVALUATION AFTER RESOLVED 100 % (การประเมินหลังจัดการ)
              </th>

              <th rowspan="2" class="no-print" style="background:#0f172a; border:1px solid #334155; padding:10px; width:60px;">
                ลบ
              </th>
            </tr>

            <!-- TIER 2 HEADER: SUB-COLUMNS -->
            <tr style="text-align:center; font-weight:700; font-size:11px; background:#f1f5f9; color:#1e293b;">
              <!-- Under PART 1 -->
              <th style="padding:8px; border:1px solid #cbd5e1; width:220px; text-align:left;">ภัยคุกคาม (Threat)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:220px; text-align:left;">ช่องโหว่ (Vulner.)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:200px; text-align:left;">มาตรการควบคุมในปัจจุบัน</th>
              
              <!-- Impact C, I, A -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:30px; background:#dbeafe;" title="Confidentiality">C</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:30px; background:#dbeafe;" title="Integrity">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:30px; background:#dbeafe;" title="Availability">A</th>

              <!-- Severity F, S, R, I, L, O -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#fed7aa;" title="Financial">F</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#fed7aa;" title="Safety/Service">S</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#fed7aa;" title="Reputation">R</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#fed7aa;" title="Image">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#fed7aa;" title="Legal">L</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#fed7aa;" title="Other CII">O</th>

              <!-- Scoring -->
              <th style="padding:8px; border:1px solid #cbd5e1; width:65px;">A: โอกาส (L)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:65px;">B: รุนแรง (I)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:90px; background:#fef08a;">C = A*B (Risk Level)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:130px;">เจ้าของความเสี่ยง (Owner)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:110px; background:#fef9c3;">ค่าเฉลี่ย Cluster</th>

              <!-- Under PART 2 -->
              <th style="padding:8px; border:1px solid #cbd5e1; width:130px;">ตัวเลือกการตอบสนอง</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:220px; text-align:left;">แผนจัดการความเสี่ยง (ข้อใหญ่)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:320px; text-align:left;">แผนจัดการ มาตรการย่อย</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:110px;">คาดว่าเสร็จ (Part 2)</th>

              <!-- Under PART 3 -->
              <th style="padding:8px; border:1px solid #cbd5e1; width:120px; background:#dcfce7;">สถานะคืบหน้า (%)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:110px;">คาดว่าเสร็จ (Part 3)</th>

              <!-- Under PART 4 -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:30px; background:#e0e7ff;" title="Residual C">C</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:30px; background:#e0e7ff;" title="Residual I">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:30px; background:#e0e7ff;" title="Residual A">A</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#ffedd5;" title="Residual F">F</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#ffedd5;" title="Residual S">S</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#ffedd5;" title="Residual R">R</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#ffedd5;" title="Residual I">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#ffedd5;" title="Residual L">L</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#ffedd5;" title="Residual O">O</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:65px;">A: โอกาส (RL)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:65px;">B: รุนแรง (RI)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:90px; background:#fef08a;">ระดับคงเหลือ (RL*RI)</th>
              <th style="padding:8px; border:1px solid #cbd5e1; width:200px; text-align:left;">ดำเนินการเพิ่มเติม (Further Actions)</th>
            </tr>
          </thead>

          <!-- TABLE BODY -->
          <tbody>
            ${filteredItems.length === 0 ? `
              <tr>
                <td colspan="40" style="text-align:center; padding:40px; color:#94a3b8; font-size:14px;">
                  ไม่พบรายการความเสี่ยงที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            ` : filteredItems.map((item, idx) => {
              const clusterAvg = metrics.clusterStats[item.cluster]?.avgScore || 0
              const scoreBadge = getScoreBadge(item.risk_level)
              const resBadge = getScoreBadge(item.residual_risk_score)
              const progBadge = getProgressBadge(item.progress_percent)
              const subActions = item.sub_actions || []

              return `
                <tr class="risk-table-row" data-risk-id="${item.id}" style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; vertical-align:top;">
                  
                  <!-- Sticky No. -->
                  <td class="sticky-col-1" style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; background:inherit;">
                    ${item.no || (idx + 1)}
                  </td>

                  <!-- Sticky Cluster -->
                  <td class="sticky-col-2" style="padding:8px; border:1px solid #e2e8f0; font-size:11px; font-weight:600; color:#334155; background:inherit;">
                    ${item.cluster}
                  </td>

                  <!-- PART 1: Threat, Vul, Control -->
                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <textarea 
                      class="risk-cell-input form-control" 
                      data-field="threat" 
                      data-risk-id="${item.id}"
                      rows="3" 
                      style="width:100%; font-size:11px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; resize:vertical;"
                    >${item.threat || ''}</textarea>
                  </td>

                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <textarea 
                      class="risk-cell-input form-control" 
                      data-field="vulnerability" 
                      data-risk-id="${item.id}"
                      rows="3" 
                      style="width:100%; font-size:11px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; resize:vertical;"
                    >${item.vulnerability || ''}</textarea>
                  </td>

                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <textarea 
                      class="risk-cell-input form-control" 
                      data-field="current_control" 
                      data-risk-id="${item.id}"
                      rows="3" 
                      style="width:100%; font-size:11px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; resize:vertical;"
                    >${item.current_control || ''}</textarea>
                  </td>

                  <!-- CIA Part 1 -->
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-cia-chk" data-factor="c" data-part="initial" data-risk-id="${item.id}" ${item.impact_cia?.c ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-cia-chk" data-factor="i" data-part="initial" data-risk-id="${item.id}" ${item.impact_cia?.i ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-cia-chk" data-factor="a" data-part="initial" data-risk-id="${item.id}" ${item.impact_cia?.a ? 'checked' : ''} />
                  </td>

                  <!-- FSRILO Part 1 -->
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="f" data-part="initial" data-risk-id="${item.id}" ${item.severity_fsrilo?.f ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="s" data-part="initial" data-risk-id="${item.id}" ${item.severity_fsrilo?.s ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="r" data-part="initial" data-risk-id="${item.id}" ${item.severity_fsrilo?.r ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="i" data-part="initial" data-risk-id="${item.id}" ${item.severity_fsrilo?.i ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="l" data-part="initial" data-risk-id="${item.id}" ${item.severity_fsrilo?.l ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="o" data-part="initial" data-risk-id="${item.id}" ${item.severity_fsrilo?.o ? 'checked' : ''} />
                  </td>

                  <!-- Likelihood (A) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; text-align:center;">
                    <select class="risk-score-select" data-field="likelihood" data-risk-id="${item.id}" style="padding:4px; font-size:12px; font-weight:700; border-radius:4px; border:1px solid #cbd5e1;">
                      ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${item.likelihood === v ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                  </td>

                  <!-- Impact (B) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; text-align:center;">
                    <select class="risk-score-select" data-field="impact" data-risk-id="${item.id}" style="padding:4px; font-size:12px; font-weight:700; border-radius:4px; border:1px solid #cbd5e1;">
                      ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${item.impact === v ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                  </td>

                  <!-- C = A*B (Risk Level) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; text-align:center;">
                    <span style="display:inline-block; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:800; ${scoreBadge.bg}">
                      ${scoreBadge.text}
                    </span>
                  </td>

                  <!-- Risk Owner -->
                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <input 
                      type="text" 
                      class="risk-cell-input form-control" 
                      data-field="risk_owner" 
                      data-risk-id="${item.id}"
                      value="${item.risk_owner || ''}"
                      style="width:100%; font-size:11px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;"
                    />
                  </td>

                  <!-- Cluster Risk Level Average (คิดคะแนนเฉลี่ยจากข้อย่อยรายหมวดหมู่ความเสี่ยง) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; text-align:center; background:#fef9c3;">
                    <span style="font-size:13px; font-weight:800; color:#854d0e;">
                      ${clusterAvg}
                    </span>
                  </td>

                  <!-- PART 2: Treatment Option, Plan, Sub-actions, Expected Date -->
                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <select 
                      class="risk-cell-input form-control" 
                      data-field="treatment_option" 
                      data-risk-id="${item.id}"
                      style="width:100%; font-size:11px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600;"
                    >
                      ${['Mitigate Risk', 'Transfer Risk', 'Accept Risk', 'Avoid Risk', 'Continue Monitoring'].map(opt => `
                        <option value="${opt}" ${item.treatment_option === opt ? 'selected' : ''}>${opt}</option>
                      `).join('')}
                    </select>
                  </td>

                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <textarea 
                      class="risk-cell-input form-control" 
                      data-field="treatment_plan" 
                      data-risk-id="${item.id}"
                      rows="3" 
                      style="width:100%; font-size:11px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; resize:vertical;"
                    >${item.treatment_plan || ''}</textarea>
                  </td>

                  <!-- มาตรการย่อย (Part 2) -->
                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                      ${subActions.map((sub, sIdx) => `
                        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:4px; padding:6px; position:relative;">
                          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <span style="font-weight:700; color:#0f766e; font-size:10px;">มาตรการย่อย ${sIdx + 1}:</span>
                            <button 
                              class="btn-delete-subaction" 
                              data-risk-id="${item.id}" 
                              data-sub-id="${sub.id}"
                              title="ลบมาตรการย่อยนี้"
                              style="background:#fee2e2; color:#dc2626; border:none; padding:1px 5px; border-radius:3px; font-size:10px; cursor:pointer;"
                            >✕</button>
                          </div>
                          <textarea 
                            class="subaction-name-input form-control" 
                            data-risk-id="${item.id}" 
                            data-sub-id="${sub.id}"
                            rows="2" 
                            style="width:100%; font-size:11px; padding:3px 5px; border:1px solid #e2e8f0; border-radius:3px; resize:vertical;"
                          >${sub.name || ''}</textarea>
                        </div>
                      `).join('')}
                      <button 
                        class="btn-add-subaction" 
                        data-risk-id="${item.id}"
                        style="background:#e0f2fe; color:#0369a1; border:1px dashed #7dd3fc; border-radius:4px; padding:4px; font-size:10px; font-weight:700; cursor:pointer;"
                      >
                        ➕ เพิ่มมาตรการย่อย
                      </button>
                    </div>
                  </td>

                  <!-- Expected Finish Date (Part 2) -->
                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <input 
                      type="text" 
                      class="risk-cell-input form-control" 
                      data-field="expected_finish_date" 
                      data-risk-id="${item.id}"
                      value="${item.expected_finish_date || ''}"
                      placeholder="เช่น ภายใน 30 ก.ย. 69"
                      style="width:100%; font-size:11px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;"
                    />
                  </td>

                  <!-- PART 3: PROGRESS (ต่อเนื่องจากมาตรการย่อย) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; background:#f0fdf4;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                      <!-- Average Progress Badge -->
                      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #bbf7d0; padding-bottom:4px;">
                        <span style="font-size:10px; font-weight:700; color:#166534;">เฉลี่ยรวม:</span>
                        <span style="font-size:11px; font-weight:800; padding:1px 6px; border-radius:10px; ${progBadge.color}">
                          ${item.progress_percent || 0}%
                        </span>
                      </div>
                      <!-- Per sub-action progress input -->
                      ${subActions.map((sub, sIdx) => `
                        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:4px; padding:4px 6px; display:flex; align-items:center; justify-content:space-between; gap:4px;">
                          <span style="font-size:10px; color:#475569;">ย่อย ${sIdx + 1}:</span>
                          <div style="display:flex; align-items:center; gap:2px;">
                            <input 
                              type="number" 
                              min="0" 
                              max="100" 
                              class="subaction-prog-input" 
                              data-risk-id="${item.id}" 
                              data-sub-id="${sub.id}"
                              value="${sub.progress_percent || 0}"
                              style="width:45px; font-size:11px; padding:2px 4px; text-align:center; border:1px solid #cbd5e1; border-radius:3px;"
                            />
                            <span style="font-size:10px;">%</span>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </td>

                  <!-- Expected Finish Date (Part 3) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; background:#f0fdf4;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                      ${subActions.map((sub, sIdx) => `
                        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:4px; padding:3px 5px;">
                          <div style="font-size:9px; color:#64748b;">ย่อย ${sIdx + 1}:</div>
                          <input 
                            type="text" 
                            class="subaction-p3date-input form-control" 
                            data-risk-id="${item.id}" 
                            data-sub-id="${sub.id}"
                            value="${sub.expected_date_part3 || ''}"
                            placeholder="วันที่เสร็จ..."
                            style="width:100%; font-size:10px; padding:2px 4px; border:1px solid #e2e8f0; border-radius:3px;"
                          />
                        </div>
                      `).join('')}
                    </div>
                  </td>

                  <!-- PART 4: Residual CIA, FSRILO, RL, RI, Residual Level, Further Actions -->
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-cia-chk" data-factor="c" data-part="residual" data-risk-id="${item.id}" ${item.residual_cia?.c ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-cia-chk" data-factor="i" data-part="residual" data-risk-id="${item.id}" ${item.residual_cia?.i ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-cia-chk" data-factor="a" data-part="residual" data-risk-id="${item.id}" ${item.residual_cia?.a ? 'checked' : ''} />
                  </td>

                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="f" data-part="residual" data-risk-id="${item.id}" ${item.residual_fsrilo?.f ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="s" data-part="residual" data-risk-id="${item.id}" ${item.residual_fsrilo?.s ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="r" data-part="residual" data-risk-id="${item.id}" ${item.residual_fsrilo?.r ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="i" data-part="residual" data-risk-id="${item.id}" ${item.residual_fsrilo?.i ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="l" data-part="residual" data-risk-id="${item.id}" ${item.residual_fsrilo?.l ? 'checked' : ''} />
                  </td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-factor="o" data-part="residual" data-risk-id="${item.id}" ${item.residual_fsrilo?.o ? 'checked' : ''} />
                  </td>

                  <!-- Residual Likelihood (A) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; text-align:center;">
                    <select class="risk-score-select" data-field="residual_likelihood" data-risk-id="${item.id}" style="padding:4px; font-size:12px; font-weight:700; border-radius:4px; border:1px solid #cbd5e1;">
                      ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${item.residual_likelihood === v ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                  </td>

                  <!-- Residual Impact (B) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; text-align:center;">
                    <select class="risk-score-select" data-field="residual_impact" data-risk-id="${item.id}" style="padding:4px; font-size:12px; font-weight:700; border-radius:4px; border:1px solid #cbd5e1;">
                      ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${item.residual_impact === v ? 'selected' : ''}>${v}</option>`).join('')}
                    </select>
                  </td>

                  <!-- Residual Risk Level (C = A*B) -->
                  <td style="padding:6px; border:1px solid #e2e8f0; text-align:center;">
                    <span style="display:inline-block; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:800; ${resBadge.bg}">
                      ${resBadge.text}
                    </span>
                  </td>

                  <!-- Further Actions -->
                  <td style="padding:6px; border:1px solid #e2e8f0;">
                    <textarea 
                      class="risk-cell-input form-control" 
                      data-field="further_actions" 
                      data-risk-id="${item.id}"
                      rows="3" 
                      placeholder="มาตรการลดความเสี่ยงเพิ่มเติม..."
                      style="width:100%; font-size:11px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; resize:vertical;"
                    >${item.further_actions || ''}</textarea>
                  </td>

                  <!-- Action: Delete -->
                  <td class="no-print" style="padding:6px; border:1px solid #e2e8f0; text-align:center; vertical-align:middle;">
                    <button 
                      class="btn-delete-risk-item" 
                      data-risk-id="${item.id}"
                      title="ลบข้อความเสี่ยงนี้"
                      style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;"
                    >
                      🗑️
                    </button>
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
            ${data.map((row) => `
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
                
                <td style="padding:8px 12px; border:1px solid #000000; text-align:center; ${getCellStyle(row.register)}">
                  ${renderMarker(row.register)}
                </td>

                <td style="padding:8px 12px; border:1px solid #000000; text-align:center; ${getCellStyle(row.assess)}">
                  ${renderMarker(row.assess)}
                </td>

                <td style="padding:8px 12px; border:1px solid #000000; text-align:center; ${getCellStyle(row.profile)}">
                  ${renderMarker(row.profile)}
                </td>
              </tr>
            `).join('')}
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
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-subtab')
      if (tabId && onUpdate) onUpdate({ type: 'switch_subtab', subtab: tabId })
    })
  })

  // 2. Editable Header Card Inputs
  containerEl.querySelectorAll('.risk-meta-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const field = input.getAttribute('data-field')
      const val = e.target.value
      if (onUpdate) onUpdate({ type: 'update_risk_metadata', field, value: val })
    })
  })

  // 3. Cluster Filter
  const clusterSelect = containerEl.querySelector('#select-risk-cluster')
  if (clusterSelect) {
    clusterSelect.addEventListener('change', (e) => {
      if (onUpdate) onUpdate({ type: 'filter_cluster', cluster: e.target.value })
    })
  }

  // 4. Search Filter
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

  // 5. Matrix Cell Click
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

  const clearMatrixBtn = containerEl.querySelector('#btn-clear-matrix-filter')
  if (clearMatrixBtn) {
    clearMatrixBtn.addEventListener('click', () => {
      if (onUpdate) onUpdate({ type: 'clear_matrix_filter' })
    })
  }

  // 6. Risk Cell Inputs & Scores
  containerEl.querySelectorAll('.risk-score-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const riskId = sel.getAttribute('data-risk-id')
      const field = sel.getAttribute('data-field')
      const val = Number(sel.value)
      if (onUpdate) onUpdate({ type: 'update_risk_score', riskId, field, value: val })
    })
  })

  containerEl.querySelectorAll('.risk-cell-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const riskId = input.getAttribute('data-risk-id')
      const field = input.getAttribute('data-field')
      const val = e.target.value
      if (onUpdate) onUpdate({ type: 'update_risk_field', riskId, field, value: val })
    })
  })

  // 7. Checkboxes: CIA & FSRILO (Initial & Residual)
  containerEl.querySelectorAll('.risk-cia-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const riskId = chk.getAttribute('data-risk-id')
      const factor = chk.getAttribute('data-factor')
      const part = chk.getAttribute('data-part') // 'initial' | 'residual'
      const checked = chk.checked
      if (onUpdate) onUpdate({ type: 'update_risk_cia', riskId, factor, part, checked })
    })
  })

  containerEl.querySelectorAll('.risk-fsrilo-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const riskId = chk.getAttribute('data-risk-id')
      const factor = chk.getAttribute('data-factor')
      const part = chk.getAttribute('data-part') // 'initial' | 'residual'
      const checked = chk.checked
      if (onUpdate) onUpdate({ type: 'update_risk_fsrilo', riskId, factor, part, checked })
    })
  })

  // 8. Sub-actions Management
  containerEl.querySelectorAll('.btn-add-subaction').forEach(btn => {
    btn.addEventListener('click', () => {
      const riskId = btn.getAttribute('data-risk-id')
      if (onUpdate) onUpdate({ type: 'add_sub_action', riskId })
    })
  })

  containerEl.querySelectorAll('.btn-delete-subaction').forEach(btn => {
    btn.addEventListener('click', () => {
      const riskId = btn.getAttribute('data-risk-id')
      const subId = btn.getAttribute('data-sub-id')
      if (confirm('คุณต้องการลบมาตรการย่อยนี้หรือไม่?') && onUpdate) {
        onUpdate({ type: 'delete_sub_action', riskId, subId })
      }
    })
  })

  containerEl.querySelectorAll('.subaction-name-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const riskId = input.getAttribute('data-risk-id')
      const subId = input.getAttribute('data-sub-id')
      if (onUpdate) onUpdate({ type: 'update_sub_action_field', riskId, subId, field: 'name', value: e.target.value })
    })
  })

  containerEl.querySelectorAll('.subaction-p3date-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const riskId = input.getAttribute('data-risk-id')
      const subId = input.getAttribute('data-sub-id')
      if (onUpdate) onUpdate({ type: 'update_sub_action_field', riskId, subId, field: 'expected_date_part3', value: e.target.value })
    })
  })

  containerEl.querySelectorAll('.subaction-prog-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const riskId = input.getAttribute('data-risk-id')
      const subId = input.getAttribute('data-sub-id')
      let val = Number(e.target.value) || 0
      val = Math.max(0, Math.min(100, val))
      input.value = val
      if (onUpdate) onUpdate({ type: 'update_sub_action_prog', riskId, subId, value: val })
    })
  })

  // 9. Add / Delete Custom Risk Item
  const addRiskBtn = containerEl.querySelector('#btn-add-new-risk-item')
  if (addRiskBtn) {
    addRiskBtn.addEventListener('click', () => {
      if (onUpdate) onUpdate({ type: 'add_risk_item' })
    })
  }

  containerEl.querySelectorAll('.btn-delete-risk-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const riskId = btn.getAttribute('data-risk-id')
      if (confirm('คุณต้องการลบข้อความเสี่ยงนี้หรือไม่?') && onUpdate) {
        onUpdate({ type: 'delete_risk_item', riskId })
      }
    })
  })

  // 10. Update Log Events
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

  // 11. Print Report
  const printBtn = containerEl.querySelector('#btn-print-risk')
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print()
    })
  }

  // 12. Export CSV
  const exportBtn = containerEl.querySelector('#btn-export-risk-csv')
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportRiskAssessmentToCsv(riskState)
    })
  }
}

// Export CSV / Excel
export function exportRiskAssessmentToCsv(riskState) {
  const items = riskState.items || []
  const metrics = calculateRiskMetrics(riskState)

  let csv = '\uFEFF' // UTF-8 BOM
  csv += 'การประเมินและการจัดการความเสี่ยงด้านการรักษาความมั่นคงปลอดภัยไซเบอร์ (Risk Assessment & Treatment)\n'
  csv += `หน่วยงาน,${riskState.metadata?.orgName || 'สสจ.สระแก้ว'}\n`
  csv += `ผู้พิจารณาประเมิน,${riskState.metadata?.reviewer || ''},ผู้บันทึก,${riskState.metadata?.recorder || ''}\n`
  csv += `วันที่ประชุมบันทึก,${riskState.metadata?.meetingDate || ''},สถานที่,${riskState.metadata?.location || ''}\n`
  csv += `คะแนนเฉลี่ยภาพรวม,${metrics.avgScore},ระดับ,${metrics.overallLevel}\n`
  csv += `เอกสารมาตรการขั้นต่ำ,${metrics.mandatoryDocsCount} ฉบับ (${metrics.mandatoryTierName})\n\n`

  const headers = [
    'No',
    'หมวดหมู่ (Cluster)',
    'ภัยคุกคาม (Threat)',
    'ช่องโหว่ (Vulnerability)',
    'มาตรการควบคุมปัจจุบัน',
    'C', 'I', 'A',
    'F', 'S', 'R', 'I', 'L', 'O',
    'โอกาสเกิด (L)',
    'ความรุนแรง (I)',
    'ระดับความเสี่ยง (Risk Level)',
    'เจ้าของความเสี่ยง (Risk Owner)',
    'ค่าเฉลี่ยระดับความเสี่ยงของ Cluster',
    'ตัวเลือกการตอบสนอง (Treatment Option)',
    'แผนจัดการความเสี่ยง (Treatment Plan)',
    'มาตรการย่อย',
    'กำหนดแล้วเสร็จ (Part 2)',
    'ความคืบหน้า (%)',
    'กำหนดแล้วเสร็จ (Part 3)',
    'Residual C', 'Residual I', 'Residual A',
    'Residual F', 'Residual S', 'Residual R', 'Residual I', 'Residual L', 'Residual O',
    'โอกาสคงเหลือ (RL)',
    'ความรุนแรงคงเหลือ (RI)',
    'คะแนนคงเหลือ (Residual Score)',
    'การดำเนินการเพิ่มเติม'
  ]
  csv += headers.map(h => `"${h}"`).join(',') + '\n'

  items.forEach((item, idx) => {
    const clusterAvg = metrics.clusterStats[item.cluster]?.avgScore || 0
    const subNames = (item.sub_actions || []).map((s, si) => `${si + 1}. ${s.name}`).join(' | ')
    const subDates = (item.sub_actions || []).map((s, si) => `${si + 1}. ${s.expected_date_part3 || '-'}`).join(' | ')

    const row = [
      item.no || (idx + 1),
      item.cluster,
      item.threat,
      item.vulnerability,
      item.current_control,
      item.impact_cia?.c ? 'X' : '-',
      item.impact_cia?.i ? 'X' : '-',
      item.impact_cia?.a ? 'X' : '-',
      item.severity_fsrilo?.f ? 'X' : '-',
      item.severity_fsrilo?.s ? 'X' : '-',
      item.severity_fsrilo?.r ? 'X' : '-',
      item.severity_fsrilo?.i ? 'X' : '-',
      item.severity_fsrilo?.l ? 'X' : '-',
      item.severity_fsrilo?.o ? 'X' : '-',
      item.likelihood,
      item.impact,
      item.risk_level,
      item.risk_owner,
      clusterAvg,
      item.treatment_option,
      item.treatment_plan,
      subNames,
      item.expected_finish_date,
      item.progress_percent,
      subDates,
      item.residual_cia?.c ? 'X' : '-',
      item.residual_cia?.i ? 'X' : '-',
      item.residual_cia?.a ? 'X' : '-',
      item.residual_fsrilo?.f ? 'X' : '-',
      item.residual_fsrilo?.s ? 'X' : '-',
      item.residual_fsrilo?.r ? 'X' : '-',
      item.residual_fsrilo?.i ? 'X' : '-',
      item.residual_fsrilo?.l ? 'X' : '-',
      item.residual_fsrilo?.o ? 'X' : '-',
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
    .sticky-col-1 {
      position: sticky;
      left: 0;
      z-index: 5;
    }
    .sticky-col-2 {
      position: sticky;
      left: 50px;
      z-index: 5;
    }
    thead th.sticky-col-1, thead th.sticky-col-2 {
      z-index: 10;
    }
    .matrix-clickable-cell:hover {
      transform: scale(1.04);
      z-index: 10;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .subtab-btn:hover {
      opacity: 0.9;
    }
    .risk-datagrid-table td {
      border: 1px solid #e2e8f0;
    }
    .risk-datagrid-table tr:hover {
      background-color: #f1f5f9 !important;
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
        size: A4 landscape;
        margin: 10mm;
      }
    }
  `
  document.head.appendChild(style)
}
