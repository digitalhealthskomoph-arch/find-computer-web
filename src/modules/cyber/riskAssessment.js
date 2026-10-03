import { showNotification } from '../../lib/utils.js'
import {
  DEFAULT_RISK_METADATA,
  DEFAULT_UPDATE_LOGS,
  RISK_CLUSTERS,
  MODEL_MATRIX_CONFIG,
  RISK_CRITERIA_DATA,
  MANDATORY_DOCUMENTS_DATA,
  COMPARE_MATRIX_DATA
} from './riskAssessmentData.js'

// Helper: FSRILO title descriptions
export function getFsriloTitle(factor) {
  const map = {
    f: 'Financial (การเงิน/ความเสียหายทางทรัพย์สิน)',
    s: 'Safety & Service (ความปลอดภัยของผู้ใช้บริการ/การให้บริการ)',
    r: 'Reputation (ชื่อเสียงองค์กร)',
    i: 'Image (ภาพลักษณ์องค์กร)',
    l: 'Legal (กฎหมายและข้อบังคับ)',
    o: 'Other CII / Systems (ระบบสารสนเทศอื่น)'
  }
  return map[factor] || factor
}

// Calculate summary metrics across all risk items
export function calculateRiskMetrics(riskState) {
  const items = riskState?.items || []
  const total = items.length
  let sumScore = 0
  let sumResidual = 0
  let sumProgress = 0

  let countVeryHigh = 0
  let countHigh = 0
  let countModerate = 0
  let countLow = 0

  const matrixCounts = {
    5: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    4: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    3: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    2: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    1: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  }

  const clusterStats = {}

  items.forEach(item => {
    const l = Number(item.likelihood) || 1
    const i = Number(item.impact) || 1
    const score = l * i
    item.risk_level = score

    // Recalculate average progress from sub_actions if present
    if (item.sub_actions && item.sub_actions.length > 0) {
      const subSum = item.sub_actions.reduce((acc, s) => acc + (Number(s.progress_percent) || 0), 0)
      item.progress_percent = Math.round(subSum / item.sub_actions.length)

      // Recalculate sub_actions residual scores
      item.sub_actions.forEach(s => {
        const rl = Number(s.residual_likelihood) || 1
        const ri = Number(s.residual_impact) || 1
        s.residual_risk_score = rl * ri
      })
      const avgSubRes = item.sub_actions.reduce((acc, s) => acc + (s.residual_risk_score || 0), 0) / item.sub_actions.length
      item.residual_risk_score = Number(avgSubRes.toFixed(1))
    } else {
      const rl = Number(item.residual_likelihood) || 1
      const ri = Number(item.residual_impact) || 1
      item.residual_risk_score = rl * ri
    }

    sumScore += score
    sumResidual += Number(item.residual_risk_score) || 0
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
    countVeryHigh,
    countHigh,
    countModerate,
    countLow,
    matrixCounts,
    clusterStats,
    overallLevel,
    overallBadge,
    overallColorName,
    mandatoryTier,
    mandatoryDocsCount,
    mandatoryTierName
  }
}

// Get Badge for initial/residual scores
export function getScoreBadge(score) {
  if (score >= 15) return { cls: 'bg-rose-100 text-rose-800 border-rose-300', text: 'Extreme / Very High' }
  if (score >= 10) return { cls: 'bg-orange-100 text-orange-800 border-orange-300', text: 'High' }
  if (score >= 4) return { cls: 'bg-amber-100 text-amber-800 border-amber-300', text: 'Moderate' }
  return { cls: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'Low' }
}

// Get Badge for progress %
export function getProgressBadge(pct) {
  if (pct >= 81) return { cls: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'ดีเยี่ยม / ใกล้แล้วเสร็จ (81-100%)' }
  if (pct >= 51) return { cls: 'bg-amber-100 text-amber-800 border-amber-300', text: 'ปานกลาง / กำลังดำเนินการ (51-80%)' }
  return { cls: 'bg-rose-100 text-rose-800 border-rose-300', text: 'ล่าช้า / เพิ่งเริ่มต้น (1-50%)' }
}

// MAIN ENTRY RENDERER
export function renderRiskAssessmentHtml(
  riskState, 
  activeSubTab = '3-assess', 
  clusterFilter = 'all', 
  matrixFilter = null, 
  searchQuery = '',
  viewMode = 'card'
) {
  ensureRiskAssessmentStyles()
  const metrics = calculateRiskMetrics(riskState)

  const subTabs = [
    { id: '0-log', label: '0. Update Log', badge: riskState?.logs?.length || 0 },
    { id: '1-matrix', label: '1. Model Matrix', badge: '5x5' },
    { id: '2-criteria', label: '2. Risk Criteria', badge: 'เกณฑ์ พรบ.' },
    { id: '3-assess', label: '3. Risk assess (Threat and Vul)', badge: `${metrics.total} ข้อ`, isMain: true },
    { id: '4-mandatory', label: '4. Mandatory Document', badge: `${metrics.mandatoryDocsCount} ฉบับ` },
    { id: '5-compare', label: '5. Compare', badge: '15 เกณฑ์' }
  ]

  return `
    <div class="risk-assessment-container" style="display:flex; flex-direction:column; gap:16px;">
      
      <!-- SUBTABS NAVIGATION BAR -->
      <div class="no-print" style="display:flex; flex-wrap:wrap; gap:8px; background:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #e2e8f0; align-items:center; justify-content:space-between;">
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${subTabs.map(t => {
            const isActive = activeSubTab === t.id
            return `
              <button 
                class="subtab-btn ${isActive ? 'active' : ''}" 
                data-subtab="${t.id}"
                style="
                  display:inline-flex; 
                  align-items:center; 
                  gap:6px; 
                  padding:8px 14px; 
                  border-radius:8px; 
                  font-size:13px; 
                  font-weight:${isActive ? '700' : '500'}; 
                  cursor:pointer; 
                  border:${isActive ? '1px solid #2563eb' : '1px solid #cbd5e1'}; 
                  background:${isActive ? '#2563eb' : '#ffffff'}; 
                  color:${isActive ? '#ffffff' : '#334155'};
                  box-shadow:${isActive ? '0 2px 4px rgba(37,99,235,0.2)' : 'none'};
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
                ">
                  ${t.badge}
                </span>
              </button>
            `
          }).join('')}
        </div>

        <!-- Print & Export Toolbar -->
        <div style="display:flex; align-items:center; gap:8px;">
          <button 
            id="btn-print-risk" 
            style="display:inline-flex; align-items:center; gap:6px; padding:7px 12px; background:#475569; color:#ffffff; border:none; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer;"
          >
            🖨️ พิมพ์รายงาน / PDF
          </button>
          <button 
            id="btn-export-risk-csv" 
            style="display:inline-flex; align-items:center; gap:6px; padding:7px 12px; background:#0f766e; color:#ffffff; border:none; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer;"
          >
            📊 ส่งออก CSV / Excel
          </button>
        </div>
      </div>

      <!-- ACTIVE SUBTAB CONTENT -->
      <div>
        ${
          activeSubTab === '0-log' ? renderUpdateLogTab(riskState)
          : activeSubTab === '1-matrix' ? renderModelMatrixTab(riskState, metrics)
          : activeSubTab === '2-criteria' ? renderRiskCriteriaTab()
          : activeSubTab === '3-assess' ? renderRiskAssessTab(riskState, metrics, clusterFilter, matrixFilter, searchQuery, viewMode)
          : activeSubTab === '4-mandatory' ? renderMandatoryDocTab(metrics)
          : renderCompareTab()
        }
      </div>

    </div>
  `
}

// SUBTAB 0: Update Log
function renderUpdateLogTab(riskState) {
  const logs = riskState?.logs || DEFAULT_UPDATE_LOGS
  return `
    <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">0. Update Log (ประวัติการปรับปรุงเอกสารและข้อมูล)</h3>
          <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">บันทึกวันที่ปรับปรุงและรายละเอียดสิ่งที่แก้ไขในระบบบริหารจัดการความเสี่ยง</p>
        </div>
        <button 
          id="btn-add-log-row" 
          class="no-print"
          style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; background:#2563eb; color:#ffffff; border:none; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;"
        >
          ➕ เพิ่มรายการปรับปรุง
        </button>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:13px;">
          <thead>
            <tr style="background:#0f172a; color:#ffffff; text-align:left;">
              <th style="padding:10px 14px; width:160px; border:1px solid #334155;">วันที่ปรับปรุง</th>
              <th style="padding:10px 14px; border:1px solid #334155;">สิ่งที่ปรับปรุง / แก้ไข</th>
              <th style="padding:10px 14px; width:70px; text-align:center; border:1px solid #334155;" class="no-print">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(log => `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px 14px; border:1px solid #cbd5e1; font-weight:600; vertical-align:top;">
                  <input 
                    type="date" 
                    class="log-date-input" 
                    data-log-id="${log.id}" 
                    value="${log.date || ''}" 
                    style="width:100%; padding:4px 8px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px;"
                  />
                </td>
                <td style="padding:10px 14px; border:1px solid #cbd5e1; color:#334155;">
                  <textarea 
                    class="log-detail-input" 
                    data-log-id="${log.id}" 
                    rows="2" 
                    style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px; resize:vertical;"
                  >${log.detail || ''}</textarea>
                </td>
                <td style="padding:10px 14px; border:1px solid #cbd5e1; text-align:center; vertical-align:middle;" class="no-print">
                  <button 
                    class="btn-delete-log" 
                    data-log-id="${log.id}" 
                    style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;"
                    title="ลบรายการนี้"
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
      <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
        <div>
          <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">1. Model Matrix (แบบจำลองเมทริกซ์ความเสี่ยง 5x5)</h3>
          <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
            ความสัมพันธ์ระหว่าง ความรุนแรง (Severity / Impact) กับ โอกาสเกิด (Likelihood / Probability)
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:13px; color:#475569;">คะแนนความเสี่ยงเฉลี่ยองค์กร:</span>
          <span class="inline-block px-3 py-1 rounded-full text-sm font-bold border ${metrics.overallBadge}">
            ${metrics.avgScore} (${metrics.overallLevel})
          </span>
        </div>
      </div>

      <!-- 5x5 Matrix Grid Table -->
      <div style="overflow-x:auto; margin-bottom:20px;">
        <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12.5px;">
          <thead>
            <tr>
              <th rowspan="2" colspan="2" style="background:#0f172a; color:#ffffff; padding:10px; border:1px solid #334155; width:220px;">
                ระดับความเสี่ยง (Risk Matrix 5x5)
              </th>
              <th colspan="5" style="background:#1e3a8a; color:#ffffff; padding:8px; border:1px solid #334155;">
                โอกาสเกิด (Likelihood / Probability)
              </th>
            </tr>
            <tr style="background:#0f172a; color:#ffffff;">
              ${cfg.cols.map(c => `
                <th style="padding:8px 6px; border:1px solid #334155; width:140px;">
                  <div style="font-weight:700;">${c.id} ${c.nameEn}</div>
                  <div style="font-size:11px; font-weight:400; opacity:0.85;">${c.nameTh} (${c.prob})</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${cfg.rows.map(r => {
              const rowId = r.id
              return `
                <tr>
                  ${rowId === 5 ? `
                    <th rowspan="5" style="background:#1e3a8a; color:#ffffff; padding:8px; border:1px solid #334155; width:36px; writing-mode:vertical-rl; transform:rotate(180deg); font-weight:700;">
                      ความรุนแรง (Severity / Impact)
                    </th>
                  ` : ''}
                  <th style="background:#0f172a; color:#ffffff; padding:10px; border:1px solid #334155; text-align:left;">
                    <div style="font-weight:700;">${r.id} ${r.nameEn}</div>
                    <div style="font-size:11px; font-weight:400; opacity:0.85;">${r.nameTh}</div>
                  </th>
                  ${cfg.cols.map(col => {
                    const colId = col.id
                    const cellInfo = cfg.grid[rowId][colId]
                    const countInCell = metrics.matrixCounts[rowId]?.[colId] || 0
                    const isAppetiteBoundary = cellInfo.isRiskAppetiteBoundary
                    return `
                      <td 
                        class="matrix-clickable-cell"
                        data-row="${rowId}" 
                        data-col="${colId}"
                        style="
                          background:${cellInfo.bg}; 
                          color:${cellInfo.color}; 
                          border:1px solid #cbd5e1; 
                          ${isAppetiteBoundary ? 'border-top: 3px solid #ef4444; border-right: 3px solid #ef4444;' : ''}
                          padding:14px 8px; 
                          cursor:pointer;
                          position:relative;
                          transition:transform 0.15s, box-shadow 0.15s;
                        "
                        title="คลิกเพื่อกรองดูข้อที่ตกในช่องนี้ (I=${rowId}, L=${colId})"
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
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">${row.acceptance}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div>
          <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin:0 0 10px 0; border-left:4px solid #2563eb; padding-left:10px;">
            1.4 ค่าเฉลี่ยระดับความเสี่ยง (Risk Level Average)
          </h4>
          <p style="margin:0 0 8px 0; font-size:12px; color:#475569; font-style:italic;">
            คำนวณจากคะแนนเฉลี่ยรวมทุกข้อเพื่อวัดระดับภาพรวมขององค์กร
          </p>
          <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff; text-align:left;">
                <th style="padding:8px 10px; border:1px solid #334155; width:110px; text-align:center;">ช่วงคะแนนเฉลี่ย</th>
                <th style="padding:8px 10px; border:1px solid #334155; width:130px;">ระดับความเสี่ยง</th>
                <th style="padding:8px 10px; border:1px solid #334155;">สีสัญลักษณ์</th>
              </tr>
            </thead>
            <tbody>
              ${c.riskLevelAverage.map(row => `
                <tr>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; text-align:center; font-weight:700;">${row.scoreRange}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0;">
                    <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold ${row.badge}">${row.level}</span>
                  </td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; font-weight:600;">${row.colorName}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 1.5, 1.6 & 1.7 Standards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
        <div>
          <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin:0 0 8px 0; border-left:4px solid #2563eb; padding-left:10px;">
            1.5 มาตรการไซเบอร์ขั้นต่ำ (พรบ.ฉบับที่ 12)
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

// SUBTAB 3: Risk assess (Threat and Vul) - CORE ASSESSMENT
function renderRiskAssessTab(
  riskState, 
  metrics, 
  clusterFilter = 'all', 
  matrixFilter = null, 
  searchQuery = '', 
  viewMode = 'card'
) {
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
    <div style="display:flex; flex-direction:column; gap:16px;">
      
      <!-- 1. EDITABLE HEADER CARD (Inline editable with auto-save) -->
      <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:18px 22px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:#1e3a8a; color:#fff; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px;">CII SKO</span>
              <h3 style="margin:0; font-size:17px; font-weight:800; color:#0f172a;">
                การประเมินและการจัดการความเสี่ยงด้านการรักษาความมั่นคงปลอดภัยไซเบอร์ (Risk Assessment & Treatment)
              </h3>
            </div>
            <p style="margin:4px 0 0 0; font-size:12.5px; color:#475569;">
              หน่วยงาน: <strong>${meta.orgName || 'สำนักงานสาธารณสุขจังหวัดสระแก้ว'}</strong> | กรอบมาตรฐานการรักษาความมั่นคงปลอดภัยไซเบอร์
            </p>
          </div>

          <!-- Overall KPI Badges -->
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
            <div style="background:#f1f5f9; border:1px solid #cbd5e1; padding:5px 10px; border-radius:8px; text-align:center;">
              <div style="font-size:10px; font-weight:700; color:#64748b;">คะแนนความเสี่ยงเฉลี่ย</div>
              <div style="font-size:15px; font-weight:800; color:#1e293b;">${metrics.avgScore}</div>
              <span class="inline-block px-1.5 py-0.2 rounded text-xs font-bold border ${metrics.overallBadge}">${metrics.overallLevel}</span>
            </div>

            <div style="background:#f0fdfa; border:1px solid #99f6e4; padding:5px 10px; border-radius:8px; text-align:center;">
              <div style="font-size:10px; font-weight:700; color:#0f766e;">เอกสารมาตรการขั้นต่ำ</div>
              <div style="font-size:15px; font-weight:800; color:#0d9488;">${metrics.mandatoryDocsCount} ฉบับ</div>
              <div style="font-size:10px; font-weight:600; color:#0f766e;">(${metrics.mandatoryTierName})</div>
            </div>

            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:5px 10px; border-radius:8px; text-align:center;">
              <div style="font-size:10px; font-weight:700; color:#166534;">ความคืบหน้าเฉลี่ย</div>
              <div style="font-size:15px; font-weight:800; color:#15803d;">${metrics.avgProgress}%</div>
              <div style="font-size:10px; font-weight:600; color:#166534;">Part 3 Progress</div>
            </div>
          </div>
        </div>

        <!-- 5 Editable Metadata Fields -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; font-size:12px;">
          <div>
            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">ผู้พิจารณาประเมิน:</label>
            <input 
              type="text" 
              class="risk-meta-input" 
              data-field="reviewer" 
              value="${meta.reviewer || ''}" 
              placeholder="เช่น สมาชิกคณะกรรมการพิจารณาความเสี่ยง"
              style="width:100%; padding:5px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:600; color:#1e293b;"
            />
          </div>

          <div>
            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">ผู้บันทึก:</label>
            <input 
              type="text" 
              class="risk-meta-input" 
              data-field="recorder" 
              value="${meta.recorder || ''}" 
              placeholder="เช่น นายธนกฤต นิธิตันติปัญญา"
              style="width:100%; padding:5px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:600; color:#1e293b;"
            />
          </div>

          <div>
            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">วันที่ประชุมบันทึก:</label>
            <input 
              type="text" 
              class="risk-meta-input" 
              data-field="meetingDate" 
              value="${meta.meetingDate || ''}" 
              placeholder="เช่น 23 ก.พ. 69"
              style="width:100%; padding:5px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:600; color:#1e293b;"
            />
          </div>

          <div>
            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">สถานที่:</label>
            <input 
              type="text" 
              class="risk-meta-input" 
              data-field="location" 
              value="${meta.location || ''}" 
              placeholder="เช่น ห้องประชุม Cockpit สสจ.สระแก้ว"
              style="width:100%; padding:5px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:600; color:#1e293b;"
            />
          </div>

          <div>
            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">ระบบบริการที่สำคัญ:</label>
            <input 
              type="text" 
              class="risk-meta-input" 
              data-field="mainSystem" 
              value="${meta.mainSystem || ''}" 
              placeholder="เช่น All application as HIS"
              style="width:100%; padding:5px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:600; color:#1e293b;"
            />
          </div>
        </div>
      </div>

      <!-- 2. TOOLBAR: VIEW TOGGLE & CLUSTER SELECTOR PILLS -->
      <div class="no-print" style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:14px 18px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; flex-direction:column; gap:12px;">
        
        <!-- View Toggle Buttons & Actions -->
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
          
          <!-- View Mode Toggle -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:12px; font-weight:700; color:#475569; margin-right:4px;">รูปแบบการแสดงผล:</span>
            <button 
              id="btn-view-card" 
              class="${viewMode === 'card' ? 'btn-view-active' : 'btn-view-inactive'}"
              style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700; cursor:pointer;"
            >
              🗂️ มุมมองการ์ด (Step Card View - ประเมินง่าย ไม่ต้องเลื่อนซ้ายขวา)
            </button>
            <button 
              id="btn-view-table" 
              class="${viewMode === 'table' ? 'btn-view-active' : 'btn-view-inactive'}"
              style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:6px; font-size:12.5px; font-weight:700; cursor:pointer;"
            >
              📊 มุมมองตาราง Excel (Data Grid View - ภาพรวม 24+ คอลัมภ์)
            </button>
          </div>

          <!-- Add Item & Total Count -->
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:12.5px; color:#64748b;">
              แสดง <strong>${filteredItems.length}</strong> จาก <strong>${metrics.total}</strong> ข้อ
            </span>
            <button id="btn-add-new-risk-item" style="background:#2563eb; color:#ffffff; border:none; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
              ➕ เพิ่มข้อความเสี่ยงใหม่
            </button>
          </div>
        </div>

        <!-- 16 Cluster Quick Filter Pills -->
        <div>
          <div style="font-size:11.5px; font-weight:700; color:#475569; margin-bottom:6px;">
            เลือกหมวดหมู่ความเสี่ยง (16 Risk Clusters):
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            <button 
              class="cluster-pill-btn ${clusterFilter === 'all' ? 'pill-active' : ''}" 
              data-cluster="all"
              style="padding:4px 10px; border-radius:14px; font-size:11.5px; font-weight:700; cursor:pointer;"
            >
              ทั้งหมด (${metrics.total})
            </button>
            ${RISK_CLUSTERS.map((c, cIdx) => {
              const cs = metrics.clusterStats[c] || { count: 5, avgScore: 0 }
              const isPillActive = clusterFilter === c
              const shortName = c.replace(/\(.*?\)/g, '').trim()
              return `
                <button 
                  class="cluster-pill-btn ${isPillActive ? 'pill-active' : ''}" 
                  data-cluster="${c}"
                  style="padding:4px 10px; border-radius:14px; font-size:11.5px; font-weight:${isPillActive ? '700' : '500'}; cursor:pointer;"
                  title="${c}"
                >
                  ${cIdx + 1}. ${shortName}
                  <span style="font-size:10px; opacity:0.85; margin-left:2px; font-weight:700;">
                    [${cs.avgScore}]
                  </span>
                </button>
              `
            }).join('')}
          </div>
        </div>

        <!-- Search Input & Matrix Clear Filter -->
        <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px;">
          <div style="flex:1; min-width:260px;">
            <input 
              type="text" 
              id="input-risk-search" 
              value="${searchQuery || ''}" 
              placeholder="🔍 พิมพ์คำค้นหาภัยคุกคาม / ช่องโหว่ / แผนจัดการ / มาตรการย่อย..." 
              style="width:100%; padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:12.5px;"
            />
          </div>

          ${matrixFilter ? `
            <div>
              <span style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; font-size:12px; font-weight:600; padding:5px 10px; border-radius:6px; display:inline-flex; align-items:center; gap:6px;">
                กรองจาก Matrix: I=${matrixFilter.row}, L=${matrixFilter.col}
                <button id="btn-clear-matrix-filter" style="background:none; border:none; color:#dc2626; font-size:14px; font-weight:700; cursor:pointer;">×</button>
              </span>
            </div>
          ` : ''}
        </div>

      </div>

      <!-- 3. MAIN CONTENT: CARD VIEW vs TABLE VIEW -->
      <div>
        ${
          viewMode === 'card' 
            ? renderRiskCardViewHtml(filteredItems, metrics) 
            : renderRiskTableViewHtml(filteredItems, metrics)
        }
      </div>

    </div>
  `
}

// 3.1 CARD VIEW (STEP-BY-STEP VERTICAL FLOW)
function renderRiskCardViewHtml(items, metrics) {
  if (items.length === 0) {
    return `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:40px; text-align:center; color:#94a3b8; font-size:14px;">
        ไม่พบรายการความเสี่ยงที่ตรงกับเงื่อนไขการค้นหา
      </div>
    `
  }

  return `
    <div style="display:flex; flex-direction:column; gap:18px;">
      ${items.map(item => {
        const scoreBadge = getScoreBadge(item.risk_level)
        const progBadge = getProgressBadge(item.progress_percent)
        const clusterAvg = metrics.clusterStats[item.cluster]?.avgScore || 0

        return `
          <div class="risk-card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; box-shadow:0 1px 3px rgba(0,0,0,0.05); overflow:hidden;">
            
            <!-- Card Header -->
            <div style="background:#0f172a; color:#ffffff; padding:10px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="background:#2563eb; color:#ffffff; font-weight:800; font-size:12.5px; padding:2px 8px; border-radius:4px;">
                  ข้อที่ ${item.no}
                </span>
                <span style="font-size:12.5px; font-weight:700; color:#f8fafc;">
                  ${item.cluster}
                </span>
                <span style="font-size:11px; background:#334155; color:#cbd5e1; padding:1px 6px; border-radius:10px;">
                  Cluster เฉลี่ย: ${clusterAvg}
                </span>
              </div>

              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; color:#cbd5e1;">ความเสี่ยงตั้งต้น:</span>
                <span class="inline-block px-2 py-0.5 rounded text-xs font-bold border ${scoreBadge.cls}">
                  ${item.risk_level} (${scoreBadge.text})
                </span>
                
                <span style="font-size:11px; color:#cbd5e1; margin-left:4px;">ความคืบหน้ารวม:</span>
                <span class="inline-block px-2 py-0.5 rounded text-xs font-bold ${progBadge.cls}">
                  ${item.progress_percent}%
                </span>

                <button 
                  class="btn-delete-risk-item no-print" 
                  data-risk-id="${item.id}" 
                  style="background:#ef4444; color:#ffffff; border:none; padding:2px 7px; border-radius:4px; font-size:11px; cursor:pointer;" 
                  title="ลบข้อความเสี่ยงนี้"
                >
                  ✕ ลบข้อนี้
                </button>
              </div>
            </div>

            <!-- Card Body: Step Flow -->
            <div style="padding:16px 18px; display:flex; flex-direction:column; gap:14px;">
              
              <!-- PART 1 : RISK ASSESSMENT (การประเมินความเสี่ยงเริ่มต้น) -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
                <div style="font-size:12.5px; font-weight:800; color:#1e3a8a; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
                  <span style="background:#1e3a8a; color:#fff; width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:10.5px;">1</span>
                  PART 1 : RISK ASSESSMENT (การประเมินความเสี่ยงก่อนจัดการ)
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:10px; margin-bottom:12px;">
                  <div>
                    <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">ภัยคุกคาม (Threat):</label>
                    <textarea class="risk-cell-input" data-risk-id="${item.id}" data-field="threat" rows="2" style="width:100%; padding:5px 8px; border:1px solid #cbd5e1; border-radius:5px; font-size:12px; resize:vertical;">${item.threat || ''}</textarea>
                  </div>
                  <div>
                    <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">ช่องโหว่ (Vulnerability):</label>
                    <textarea class="risk-cell-input" data-risk-id="${item.id}" data-field="vulnerability" rows="2" style="width:100%; padding:5px 8px; border:1px solid #cbd5e1; border-radius:5px; font-size:12px; resize:vertical;">${item.vulnerability || ''}</textarea>
                  </div>
                  <div>
                    <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:2px;">มาตรการควบคุมปัจจุบัน (Current Controls):</label>
                    <textarea class="risk-cell-input" data-risk-id="${item.id}" data-field="current_control" rows="2" style="width:100%; padding:5px 8px; border:1px solid #cbd5e1; border-radius:5px; font-size:12px; resize:vertical;">${item.current_control || ''}</textarea>
                  </div>
                </div>

                <!-- CIA, FSRILO, Scoring -->
                <div style="display:flex; flex-wrap:wrap; gap:14px; align-items:center; background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px 12px;">
                  <!-- CIA -->
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:11px; font-weight:700; color:#1e40af;">กระทบต่อ CIA:</span>
                    <label style="display:inline-flex; align-items:center; gap:2px; font-size:11px; font-weight:600; cursor:pointer;">
                      <input type="checkbox" class="risk-cia-chk" data-risk-id="${item.id}" data-factor="c" data-part="initial" ${item.impact_cia?.c ? 'checked' : ''} /> C
                    </label>
                    <label style="display:inline-flex; align-items:center; gap:2px; font-size:11px; font-weight:600; cursor:pointer;">
                      <input type="checkbox" class="risk-cia-chk" data-risk-id="${item.id}" data-factor="i" data-part="initial" ${item.impact_cia?.i ? 'checked' : ''} /> I
                    </label>
                    <label style="display:inline-flex; align-items:center; gap:2px; font-size:11px; font-weight:600; cursor:pointer;">
                      <input type="checkbox" class="risk-cia-chk" data-risk-id="${item.id}" data-factor="a" data-part="initial" ${item.impact_cia?.a ? 'checked' : ''} /> A
                    </label>
                  </div>

                  <div style="width:1px; height:20px; background:#e2e8f0;"></div>

                  <!-- FSRILO -->
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:11px; font-weight:700; color:#c2410c;">ความรุนแรง (F,S,R,I,L,O):</span>
                    ${['f','s','r','i','l','o'].map(f => `
                      <label style="display:inline-flex; align-items:center; gap:2px; font-size:11px; font-weight:600; cursor:pointer;" title="${getFsriloTitle(f)}">
                        <input type="checkbox" class="risk-fsrilo-chk" data-risk-id="${item.id}" data-factor="${f}" data-part="initial" ${item.severity_fsrilo?.[f] ? 'checked' : ''} /> ${f.toUpperCase()}
                      </label>
                    `).join('')}
                  </div>

                  <div style="width:1px; height:20px; background:#e2e8f0;"></div>

                  <!-- Scoring: L, I, Score, Owner -->
                  <div style="display:flex; align-items:center; gap:8px;">
                    <label style="display:inline-flex; align-items:center; gap:3px; font-size:11px; font-weight:700; color:#334155;">
                      L:
                      <select class="risk-score-select" data-risk-id="${item.id}" data-field="likelihood" style="padding:2px 4px; border:1px solid #cbd5e1; border-radius:4px; font-size:11.5px; font-weight:700;">
                        ${[1,2,3,4,5].map(v => `<option value="${v}" ${item.likelihood == v ? 'selected' : ''}>${v}</option>`).join('')}
                      </select>
                    </label>

                    <label style="display:inline-flex; align-items:center; gap:3px; font-size:11px; font-weight:700; color:#334155;">
                      I:
                      <select class="risk-score-select" data-risk-id="${item.id}" data-field="impact" style="padding:2px 4px; border:1px solid #cbd5e1; border-radius:4px; font-size:11.5px; font-weight:700;">
                        ${[1,2,3,4,5].map(v => `<option value="${v}" ${item.impact == v ? 'selected' : ''}>${v}</option>`).join('')}
                      </select>
                    </label>

                    <div style="display:inline-flex; align-items:center; gap:3px; font-size:11px; font-weight:700; color:#334155;">
                      = คะแนน: <strong>${item.risk_level}</strong>
                    </div>

                    <label style="display:inline-flex; align-items:center; gap:3px; font-size:11px; font-weight:700; color:#334155; margin-left:4px;">
                      Owner:
                      <input type="text" class="risk-cell-input" data-risk-id="${item.id}" data-field="risk_owner" value="${item.risk_owner || 'สสจ.สระแก้ว'}" style="padding:2px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; width:90px;" />
                    </label>
                  </div>
                </div>
              </div>

              <!-- PART 2 : RISK TREATMENT OVERVIEW (แผนจัดการภาพรวม) -->
              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px 14px;">
                <div style="font-size:12.5px; font-weight:800; color:#166534; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                  <span style="background:#166534; color:#fff; width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:10.5px;">2</span>
                  PART 2 : RISK TREATMENT (แผนจัดการความเสี่ยงภาพรวม)
                </div>
                
                <div style="display:grid; grid-template-columns: 180px 1fr; gap:10px; align-items:center;">
                  <div>
                    <label style="font-size:10.5px; font-weight:700; color:#166534; display:block; margin-bottom:2px;">ตัวเลือกการตอบสนอง:</label>
                    <select class="risk-cell-input" data-risk-id="${item.id}" data-field="treatment_option" style="width:100%; padding:4px 6px; border:1px solid #86efac; border-radius:5px; font-size:11.5px; font-weight:600; background:#fff;">
                      ${['Mitigate Risk', 'Mitigate', 'Transfer', 'Accept', 'Avoid', 'Continue Monitoring'].map(opt => `
                        <option value="${opt}" ${(item.treatment_option || '').trim() === opt ? 'selected' : ''}>${opt}</option>
                      `).join('')}
                    </select>
                  </div>
                  <div>
                    <label style="font-size:10.5px; font-weight:700; color:#166534; display:block; margin-bottom:2px;">แผนจัดการความเสี่ยง (Treatment Plan ข้อใหญ่):</label>
                    <input type="text" class="risk-cell-input" data-risk-id="${item.id}" data-field="treatment_plan" value="${item.treatment_plan || ''}" placeholder="ระบุแผนจัดการความเสี่ยงข้อใหญ่..." style="width:100%; padding:4px 8px; border:1px solid #86efac; border-radius:5px; font-size:11.5px; background:#fff;" />
                  </div>
                </div>
              </div>

              <!-- SUB-ACTIONS: CONTINUOUS PROGRESS (PART 3) & RESIDUAL RISK (PART 4) -->
              <div style="background:#faf5ff; border:1px solid #e9d5ff; border-radius:8px; padding:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
                  <div style="font-size:12.5px; font-weight:800; color:#7e22ce; display:flex; align-items:center; gap:6px;">
                    <span style="background:#7e22ce; color:#fff; width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:10.5px;">3</span>
                    มาตรการย่อย ➔ ความคืบหน้า (PART 3) ➔ ประเมินความเสี่ยงคงเหลือ (PART 4)
                    <span style="background:#f3e8ff; color:#6b21a8; font-size:11px; padding:1px 6px; border-radius:10px; font-weight:700;">
                      ${item.sub_actions?.length || 0} มาตรการย่อย
                    </span>
                  </div>

                  <button 
                    class="btn-add-subaction" 
                    data-risk-id="${item.id}" 
                    style="background:#9333ea; color:#ffffff; border:none; padding:4px 10px; border-radius:5px; font-size:11.5px; font-weight:700; cursor:pointer;"
                  >
                    ➕ เพิ่มมาตรการย่อย
                  </button>
                </div>

                <!-- Sub-action Cards List -->
                <div style="display:flex; flex-direction:column; gap:10px;">
                  ${(item.sub_actions || []).map((sub, sIdx) => {
                    const subProgBadge = getProgressBadge(sub.progress_percent)
                    const subResBadge = getScoreBadge(sub.residual_risk_score)
                    const is100 = (Number(sub.progress_percent) === 100)

                    return `
                      <div class="subaction-card" style="background:#ffffff; border:1px solid ${is100 ? '#86efac' : '#cbd5e1'}; border-radius:8px; padding:12px; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
                        
                        <!-- Row 1: Name, Part 2 date, Delete -->
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px;">
                          <div style="flex:1;">
                            <div style="display:flex; align-items:center; gap:6px; margin-bottom:3px;">
                              <span style="background:#f3e8ff; color:#7e22ce; font-weight:700; font-size:11px; padding:1px 6px; border-radius:4px;">
                                มาตรการย่อยที่ ${sIdx + 1}
                              </span>
                              ${is100 ? `
                                <span style="background:#dcfce7; color:#166534; font-size:10px; font-weight:700; padding:1px 6px; border-radius:10px; border:1px solid #86efac;">
                                  ✓ ดำเนินการแล้วเสร็จ 100%
                                </span>
                              ` : ''}
                            </div>
                            <textarea 
                              class="subaction-name-input" 
                              data-risk-id="${item.id}" 
                              data-sub-id="${sub.id}" 
                              rows="1" 
                              placeholder="ระบุรายละเอียดมาตรการย่อย..." 
                              style="width:100%; padding:4px 8px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px; resize:vertical;"
                            >${sub.name || ''}</textarea>
                          </div>

                          <div style="width:160px;">
                            <label style="font-size:10.5px; font-weight:700; color:#64748b; display:block; margin-bottom:2px;">กำหนดเสร็จ (Part 2):</label>
                            <input 
                              type="text" 
                              class="subaction-p2date-input" 
                              data-risk-id="${item.id}" 
                              data-sub-id="${sub.id}" 
                              value="${sub.expected_date_part2 || ''}" 
                              placeholder="เช่น ภายใน 30 ก.ย. 69" 
                              style="width:100%; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px;"
                            />
                          </div>

                          <button 
                            class="btn-delete-subaction" 
                            data-risk-id="${item.id}" 
                            data-sub-id="${sub.id}" 
                            style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; width:24px; height:24px; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-top:16px;" 
                            title="ลบมาตรการย่อยนี้"
                          >
                            ✕
                          </button>
                        </div>

                        <!-- Row 2: PART 3 PROGRESS -->
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:6px 10px; margin-bottom:8px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:8px;">
                          <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:240px;">
                            <span style="font-size:11px; font-weight:700; color:#15803d;">PART 3 ความคืบหน้า:</span>
                            <input 
                              type="range" 
                              class="subaction-prog-slider" 
                              data-risk-id="${item.id}" 
                              data-sub-id="${sub.id}" 
                              min="0" 
                              max="100" 
                              step="5" 
                              value="${sub.progress_percent || 0}" 
                              style="flex:1; cursor:pointer;"
                            />
                            <div style="display:inline-flex; align-items:center; gap:2px;">
                              <input 
                                type="number" 
                                class="subaction-prog-input" 
                                data-risk-id="${item.id}" 
                                data-sub-id="${sub.id}" 
                                min="0" 
                                max="100" 
                                value="${sub.progress_percent || 0}" 
                                style="width:46px; padding:2px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; font-weight:700; text-align:center;"
                              />
                              <span style="font-size:11px; font-weight:700;">%</span>
                            </div>
                            <span class="inline-block px-2 py-0.5 rounded text-xs font-bold ${subProgBadge.cls}">
                              ${sub.progress_percent || 0}%
                            </span>
                          </div>

                          <div style="display:flex; align-items:center; gap:4px;">
                            <label style="font-size:10.5px; font-weight:700; color:#64748b;">คาดว่าแล้วเสร็จ (Part 3):</label>
                            <input 
                              type="text" 
                              class="subaction-p3date-input" 
                              data-risk-id="${item.id}" 
                              data-sub-id="${sub.id}" 
                              value="${sub.expected_date_part3 || ''}" 
                              placeholder="เช่น 15 ก.ย. 69" 
                              style="padding:3px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; width:110px;"
                            />
                          </div>
                        </div>

                        <!-- Row 3: PART 4 RESIDUAL RISK EVALUATION -->
                        <div style="background:#f5f3ff; border:1px solid #ddd6fe; border-radius:6px; padding:8px 10px;">
                          <div style="font-size:11px; font-weight:800; color:#5b21b6; margin-bottom:6px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:4px;">
                            <span>PART 4 : การประเมินความเสี่ยงคงเหลือ (Residual Risk Evaluation)</span>
                            <span class="inline-block px-2 py-0.5 rounded text-xs font-bold border ${subResBadge.cls}">
                              ระดับคงเหลือ: ${sub.residual_risk_score} (${subResBadge.text})
                            </span>
                          </div>

                          <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:6px;">
                            <!-- Residual CIA -->
                            <div style="display:flex; align-items:center; gap:4px;">
                              <span style="font-size:10.5px; font-weight:700; color:#4c1d95;">Residual CIA:</span>
                              <label style="display:inline-flex; align-items:center; gap:1px; font-size:10.5px; cursor:pointer;">
                                <input type="checkbox" class="subaction-cia-chk" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-factor="c" ${sub.residual_cia?.c ? 'checked' : ''} /> C
                              </label>
                              <label style="display:inline-flex; align-items:center; gap:1px; font-size:10.5px; cursor:pointer;">
                                <input type="checkbox" class="subaction-cia-chk" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-factor="i" ${sub.residual_cia?.i ? 'checked' : ''} /> I
                              </label>
                              <label style="display:inline-flex; align-items:center; gap:1px; font-size:10.5px; cursor:pointer;">
                                <input type="checkbox" class="subaction-cia-chk" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-factor="a" ${sub.residual_cia?.a ? 'checked' : ''} /> A
                              </label>
                            </div>

                            <div style="width:1px; height:16px; background:#c4b5fd;"></div>

                            <!-- Residual FSRILO -->
                            <div style="display:flex; align-items:center; gap:4px;">
                              <span style="font-size:10.5px; font-weight:700; color:#4c1d95;">Residual FSRILO:</span>
                              ${['f','s','r','i','l','o'].map(f => `
                                <label style="display:inline-flex; align-items:center; gap:1px; font-size:10.5px; cursor:pointer;" title="${getFsriloTitle(f)}">
                                  <input type="checkbox" class="subaction-fsrilo-chk" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-factor="${f}" ${sub.residual_fsrilo?.[f] ? 'checked' : ''} /> ${f.toUpperCase()}
                                </label>
                              `).join('')}
                            </div>

                            <div style="width:1px; height:16px; background:#c4b5fd;"></div>

                            <!-- Residual L, I, Score -->
                            <div style="display:flex; align-items:center; gap:6px;">
                              <label style="display:inline-flex; align-items:center; gap:2px; font-size:10.5px; font-weight:700; color:#4c1d95;">
                                RL:
                                <select class="subaction-score-select" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-field="residual_likelihood" style="padding:1px 4px; border:1px solid #c4b5fd; border-radius:3px; font-size:11px; font-weight:700; background:#fff;">
                                  ${[1,2,3,4,5].map(v => `<option value="${v}" ${sub.residual_likelihood == v ? 'selected' : ''}>${v}</option>`).join('')}
                                </select>
                              </label>

                              <label style="display:inline-flex; align-items:center; gap:2px; font-size:10.5px; font-weight:700; color:#4c1d95;">
                                RI:
                                <select class="subaction-score-select" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-field="residual_impact" style="padding:1px 4px; border:1px solid #c4b5fd; border-radius:3px; font-size:11px; font-weight:700; background:#fff;">
                                  ${[1,2,3,4,5].map(v => `<option value="${v}" ${sub.residual_impact == v ? 'selected' : ''}>${v}</option>`).join('')}
                                </select>
                              </label>

                              <span style="font-size:11px; font-weight:700; color:#4c1d95;">
                                = <strong>${sub.residual_risk_score}</strong>
                              </span>
                            </div>
                          </div>

                          <!-- Further Actions -->
                          <div>
                            <label style="font-size:10px; font-weight:700; color:#5b21b6; display:block; margin-bottom:1px;">ดำเนินการเพิ่มเติมเพื่อลดความเสี่ยงให้น้อยลงอีก (Further Actions):</label>
                            <input 
                              type="text" 
                              class="subaction-further-input" 
                              data-risk-id="${item.id}" 
                              data-sub-id="${sub.id}" 
                              value="${sub.further_actions || ''}" 
                              placeholder="ระบุมาตรการเพิ่มเติม เช่น เฝ้าติดตามเป็นระยะ..." 
                              style="width:100%; padding:3px 6px; border:1px solid #c4b5fd; border-radius:4px; font-size:11px; background:#fff;"
                            />
                          </div>

                        </div>

                      </div>
                    `
                  }).join('')}
                </div>
              </div>

            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

// 3.2 TABLE VIEW (FULL EXCEL DATA GRID TABLE)
function renderRiskTableViewHtml(items, metrics) {
  return `
    <div class="risk-datagrid-scroll" style="overflow-x:auto; max-width:100%; border:1px solid #cbd5e1; border-radius:8px; background:#ffffff;">
      <table class="risk-datagrid-table" style="width:100%; min-width:2400px; border-collapse:collapse; font-size:12px; text-align:left;">
        
        <!-- TIER 1 HEADER: 4 PARTS -->
        <thead>
          <tr style="text-align:center; font-weight:800; font-size:13px; color:#ffffff;">
            <th rowspan="2" class="sticky-col-1" style="background:#0f172a; border:1px solid #334155; padding:8px 4px; width:45px;">
              No.
            </th>
            <th rowspan="2" class="sticky-col-2" style="background:#0f172a; border:1px solid #334155; padding:8px; width:140px; text-align:left;">
              หมวดหมู่ความเสี่ยง (Cluster)
            </th>
            
            <!-- PART 1 -->
            <th colspan="17" style="background:#1e3a8a; border:1px solid #1e40af; padding:8px;">
              PART 1 : RISK ASSESSMENT (การประเมินความเสี่ยงก่อนจัดการ)
            </th>

            <!-- PART 2 -->
            <th colspan="4" style="background:#0f766e; border:1px solid #115e59; padding:8px;">
              PART 2 : RISK TREATMENT (การจัดการความเสี่ยง)
            </th>

            <!-- PART 3 -->
            <th colspan="2" style="background:#15803d; border:1px solid #166534; padding:8px;">
              PART 3 : PROGRESS (ความคืบหน้า)
            </th>

            <!-- PART 4 -->
            <th colspan="13" style="background:#4338ca; border:1px solid #3730a3; padding:8px;">
              PART 4 : RISK EVALUATION AFTER RESOLVED 100 % (การประเมินหลังจัดการ)
            </th>

            <th rowspan="2" class="no-print" style="background:#0f172a; border:1px solid #334155; padding:8px; width:50px;">
              ลบ
            </th>
          </tr>

          <!-- TIER 2 HEADER: SUB-COLUMNS -->
          <tr style="text-align:center; font-weight:700; font-size:11px; background:#f1f5f9; color:#1e293b;">
            <!-- Under PART 1 -->
            <th style="padding:6px; border:1px solid #cbd5e1; width:200px; text-align:left;">ภัยคุกคาม (Threat)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:200px; text-align:left;">ช่องโหว่ (Vulner.)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:180px; text-align:left;">มาตรการควบคุมปัจจุบัน</th>
            
            <!-- Impact C, I, A -->
            <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#dbeafe;" title="Confidentiality">C</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#dbeafe;" title="Integrity">I</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#dbeafe;" title="Availability">A</th>

            <!-- Severity F, S, R, I, L, O -->
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fed7aa;" title="Financial">F</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fed7aa;" title="Safety/Service">S</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fed7aa;" title="Reputation">R</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fed7aa;" title="Image">I</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fed7aa;" title="Legal">L</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fed7aa;" title="Other CII">O</th>

            <!-- Scoring -->
            <th style="padding:4px; border:1px solid #cbd5e1; width:45px;" title="Likelihood (1-5)">A (L)</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:45px;" title="Impact (1-5)">B (I)</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:60px;" title="Risk Level (A*B)">C = A*B</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:90px;">เจ้าของความเสี่ยง</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:75px;" title="ค่าเฉลี่ยของ Cluster">ค่าเฉลี่ย Cluster</th>

            <!-- Under PART 2 -->
            <th style="padding:6px; border:1px solid #cbd5e1; width:120px;">การตอบสนอง</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:180px;">แผนจัดการความเสี่ยง (ใหญ่)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:220px;">มาตรการย่อย</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:95px;">กำหนดเสร็จ (P2)</th>

            <!-- Under PART 3 -->
            <th style="padding:6px; border:1px solid #cbd5e1; width:75px;">ความคืบหน้า (%)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:95px;">กำหนดเสร็จ (P3)</th>

            <!-- Under PART 4 -->
            <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#e0e7ff;" title="Residual Confidentiality">C</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#e0e7ff;" title="Residual Integrity">I</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:28px; background:#e0e7ff;" title="Residual Availability">A</th>

            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fce7f3;" title="Residual Financial">F</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fce7f3;" title="Residual Safety/Service">S</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fce7f3;" title="Residual Reputation">R</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fce7f3;" title="Residual Image">I</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fce7f3;" title="Residual Legal">L</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fce7f3;" title="Residual Other CII">O</th>

            <th style="padding:4px; border:1px solid #cbd5e1; width:45px;" title="Residual Likelihood (1-5)">RL</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:45px;" title="Residual Impact (1-5)">RI</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:60px;" title="Residual Score">คะแนนคงเหลือ</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:160px;">ดำเนินการเพิ่มเติม</th>
          </tr>
        </thead>

        <!-- TABLE BODY -->
        <tbody>
          ${items.map((item, idx) => {
            const scoreBadge = getScoreBadge(item.risk_level)
            const progBadge = getProgressBadge(item.progress_percent)
            const clusterAvg = metrics.clusterStats[item.cluster]?.avgScore || 0
            const isEven = idx % 2 === 0
            const rowBg = isEven ? '#ffffff' : '#f8fafc'

            return `
              <tr style="background:${rowBg}; border-bottom:1px solid #e2e8f0; vertical-align:top;">
                <!-- Sticky Col 1: No. -->
                <td class="sticky-col-1" style="background:${rowBg}; border:1px solid #e2e8f0; padding:6px 4px; text-align:center; font-weight:700;">
                  ${item.no}
                </td>

                <!-- Sticky Col 2: Cluster -->
                <td class="sticky-col-2" style="background:${rowBg}; border:1px solid #e2e8f0; padding:6px; font-weight:600; color:#1e293b; line-height:1.3;">
                  ${item.cluster}
                </td>

                <!-- PART 1: Threat, Vul, Control -->
                <td style="padding:5px; border:1px solid #e2e8f0;">
                  <textarea class="risk-cell-input" data-risk-id="${item.id}" data-field="threat" rows="2" style="width:100%; border:1px solid #cbd5e1; border-radius:4px; padding:3px; font-size:11.5px; resize:vertical;">${item.threat || ''}</textarea>
                </td>
                <td style="padding:5px; border:1px solid #e2e8f0;">
                  <textarea class="risk-cell-input" data-risk-id="${item.id}" data-field="vulnerability" rows="2" style="width:100%; border:1px solid #cbd5e1; border-radius:4px; padding:3px; font-size:11.5px; resize:vertical;">${item.vulnerability || ''}</textarea>
                </td>
                <td style="padding:5px; border:1px solid #e2e8f0;">
                  <textarea class="risk-cell-input" data-risk-id="${item.id}" data-field="current_control" rows="2" style="width:100%; border:1px solid #cbd5e1; border-radius:4px; padding:3px; font-size:11.5px; resize:vertical;">${item.current_control || ''}</textarea>
                </td>

                <!-- CIA -->
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <input type="checkbox" class="risk-cia-chk" data-risk-id="${item.id}" data-factor="c" data-part="initial" ${item.impact_cia?.c ? 'checked' : ''} />
                </td>
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <input type="checkbox" class="risk-cia-chk" data-risk-id="${item.id}" data-factor="i" data-part="initial" ${item.impact_cia?.i ? 'checked' : ''} />
                </td>
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <input type="checkbox" class="risk-cia-chk" data-risk-id="${item.id}" data-factor="a" data-part="initial" ${item.impact_cia?.a ? 'checked' : ''} />
                </td>

                <!-- FSRILO -->
                ${['f','s','r','i','l','o'].map(f => `
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="checkbox" class="risk-fsrilo-chk" data-risk-id="${item.id}" data-factor="${f}" data-part="initial" ${item.severity_fsrilo?.[f] ? 'checked' : ''} />
                  </td>
                `).join('')}

                <!-- Likelihood & Impact -->
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <select class="risk-score-select" data-risk-id="${item.id}" data-field="likelihood" style="padding:2px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; font-weight:700;">
                    ${[1,2,3,4,5].map(v => `<option value="${v}" ${item.likelihood == v ? 'selected' : ''}>${v}</option>`).join('')}
                  </select>
                </td>
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <select class="risk-score-select" data-risk-id="${item.id}" data-field="impact" style="padding:2px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; font-weight:700;">
                    ${[1,2,3,4,5].map(v => `<option value="${v}" ${item.impact == v ? 'selected' : ''}>${v}</option>`).join('')}
                  </select>
                </td>

                <!-- Risk Level Badge -->
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <span class="inline-block px-1.5 py-0.5 rounded text-xs font-bold border ${scoreBadge.cls}">
                    ${item.risk_level}
                  </span>
                </td>

                <!-- Owner & Cluster Avg -->
                <td style="padding:4px; border:1px solid #e2e8f0;">
                  <input type="text" class="risk-cell-input" data-risk-id="${item.id}" data-field="risk_owner" value="${item.risk_owner || 'สสจ.สระแก้ว'}" style="width:100%; border:1px solid #cbd5e1; border-radius:4px; padding:2px 4px; font-size:11px;" />
                </td>
                <td style="padding:6px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#1e293b;">
                  ${clusterAvg}
                </td>

                <!-- PART 2: Treatment Option, Plan, Subactions List, Date -->
                <td style="padding:4px; border:1px solid #e2e8f0;">
                  <select class="risk-cell-input" data-risk-id="${item.id}" data-field="treatment_option" style="width:100%; padding:2px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px;">
                    ${['Mitigate Risk', 'Mitigate', 'Transfer', 'Accept', 'Avoid', 'Continue Monitoring'].map(opt => `
                      <option value="${opt}" ${(item.treatment_option || '').trim() === opt ? 'selected' : ''}>${opt}</option>
                    `).join('')}
                  </select>
                </td>
                <td style="padding:4px; border:1px solid #e2e8f0;">
                  <textarea class="risk-cell-input" data-risk-id="${item.id}" data-field="treatment_plan" rows="2" style="width:100%; border:1px solid #cbd5e1; border-radius:4px; padding:3px; font-size:11px; resize:vertical;">${item.treatment_plan || ''}</textarea>
                </td>
                
                <!-- Sub-actions column (Part 2 + Part 3 + Part 4 summary) -->
                <td style="padding:4px; border:1px solid #e2e8f0;">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    ${(item.sub_actions || []).map((sub, si) => `
                      <div style="display:flex; align-items:center; gap:4px; background:#f1f5f9; padding:2px 4px; border-radius:4px; font-size:11px;">
                        <span style="font-weight:700; color:#475569;">${si + 1}.</span>
                        <input type="text" class="subaction-name-input" data-risk-id="${item.id}" data-sub-id="${sub.id}" value="${sub.name || ''}" style="flex:1; border:1px solid #cbd5e1; border-radius:3px; padding:1px 4px; font-size:10.5px;" />
                        <button class="btn-delete-subaction" data-risk-id="${item.id}" data-sub-id="${sub.id}" style="color:#ef4444; border:none; background:none; cursor:pointer; font-weight:700; padding:0 2px;">✕</button>
                      </div>
                    `).join('')}
                    <button class="btn-add-subaction" data-risk-id="${item.id}" style="font-size:10.5px; padding:1px 6px; background:#e0e7ff; color:#3730a3; border:none; border-radius:3px; cursor:pointer; font-weight:600; align-self:flex-start;">
                      + เพิ่ม
                    </button>
                  </div>
                </td>

                <td style="padding:4px; border:1px solid #e2e8f0;">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    ${(item.sub_actions || []).map(sub => `
                      <input type="text" class="subaction-p2date-input" data-risk-id="${item.id}" data-sub-id="${sub.id}" value="${sub.expected_date_part2 || ''}" style="width:100%; border:1px solid #cbd5e1; border-radius:3px; padding:1px 4px; font-size:10.5px;" />
                    `).join('')}
                  </div>
                </td>

                <!-- PART 3: Progress % & Date per sub-action -->
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <div style="margin-bottom:3px;">
                    <span class="inline-block px-1.5 py-0.5 rounded text-xs font-bold ${progBadge.cls}">
                      เฉลี่ย ${item.progress_percent}%
                    </span>
                  </div>
                  <div style="display:flex; flex-direction:column; gap:3px;">
                    ${(item.sub_actions || []).map(sub => `
                      <div style="display:flex; align-items:center; gap:2px; justify-content:center;">
                        <input type="number" class="subaction-prog-input" data-risk-id="${item.id}" data-sub-id="${sub.id}" min="0" max="100" value="${sub.progress_percent || 0}" style="width:38px; border:1px solid #cbd5e1; border-radius:3px; padding:1px; font-size:10px; text-align:center; font-weight:700;" />
                        <span style="font-size:10px;">%</span>
                      </div>
                    `).join('')}
                  </div>
                </td>

                <td style="padding:4px; border:1px solid #e2e8f0;">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    ${(item.sub_actions || []).map(sub => `
                      <input type="text" class="subaction-p3date-input" data-risk-id="${item.id}" data-sub-id="${sub.id}" value="${sub.expected_date_part3 || ''}" style="width:100%; border:1px solid #cbd5e1; border-radius:3px; padding:1px 4px; font-size:10.5px;" />
                    `).join('')}
                  </div>
                </td>

                <!-- PART 4: Residual CIA, FSRILO, RL, RI, Score, Further actions per sub-action -->
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <div style="display:flex; flex-direction:column; gap:6px;">
                    ${(item.sub_actions || []).map(sub => `
                      <input type="checkbox" class="subaction-cia-chk" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-factor="c" ${sub.residual_cia?.c ? 'checked' : ''} />
                    `).join('')}
                  </div>
                </td>
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <div style="display:flex; flex-direction:column; gap:6px;">
                    ${(item.sub_actions || []).map(sub => `
                      <input type="checkbox" class="subaction-cia-chk" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-factor="i" ${sub.residual_cia?.i ? 'checked' : ''} />
                    `).join('')}
                  </div>
                </td>
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <div style="display:flex; flex-direction:column; gap:6px;">
                    ${(item.sub_actions || []).map(sub => `
                      <input type="checkbox" class="subaction-cia-chk" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-factor="a" ${sub.residual_cia?.a ? 'checked' : ''} />
                    `).join('')}
                  </div>
                </td>

                <!-- Residual FSRILO -->
                ${['f','s','r','i','l','o'].map(f => `
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                      ${(item.sub_actions || []).map(sub => `
                        <input type="checkbox" class="subaction-fsrilo-chk" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-factor="${f}" ${sub.residual_fsrilo?.[f] ? 'checked' : ''} />
                      `).join('')}
                    </div>
                  </td>
                `).join('')}

                <!-- RL & RI per sub-action -->
                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    ${(item.sub_actions || []).map(sub => `
                      <select class="subaction-score-select" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-field="residual_likelihood" style="padding:1px; border:1px solid #cbd5e1; border-radius:3px; font-size:10px; font-weight:700;">
                        ${[1,2,3,4,5].map(v => `<option value="${v}" ${sub.residual_likelihood == v ? 'selected' : ''}>${v}</option>`).join('')}
                      </select>
                    `).join('')}
                  </div>
                </td>

                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    ${(item.sub_actions || []).map(sub => `
                      <select class="subaction-score-select" data-risk-id="${item.id}" data-sub-id="${sub.id}" data-field="residual_impact" style="padding:1px; border:1px solid #cbd5e1; border-radius:3px; font-size:10px; font-weight:700;">
                        ${[1,2,3,4,5].map(v => `<option value="${v}" ${sub.residual_impact == v ? 'selected' : ''}>${v}</option>`).join('')}
                      </select>
                    `).join('')}
                  </div>
                </td>

                <td style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <div style="display:flex; flex-direction:column; gap:6px;">
                    ${(item.sub_actions || []).map(sub => {
                      const resBadge = getScoreBadge(sub.residual_risk_score)
                      return `
                        <span class="inline-block px-1.5 py-0.2 rounded text-xs font-bold border ${resBadge.cls}">
                          ${sub.residual_risk_score}
                        </span>
                      `
                    }).join('')}
                  </div>
                </td>

                <td style="padding:4px; border:1px solid #e2e8f0;">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    ${(item.sub_actions || []).map(sub => `
                      <input type="text" class="subaction-further-input" data-risk-id="${item.id}" data-sub-id="${sub.id}" value="${sub.further_actions || ''}" style="width:100%; border:1px solid #cbd5e1; border-radius:3px; padding:1px 4px; font-size:10.5px;" />
                    `).join('')}
                  </div>
                </td>

                <!-- Delete row button -->
                <td class="no-print" style="padding:4px; border:1px solid #e2e8f0; text-align:center;">
                  <button class="btn-delete-risk-item" data-risk-id="${item.id}" style="color:#ef4444; border:none; background:none; cursor:pointer; font-size:13px;" title="ลบข้อนี้">
                    🗑️
                  </button>
                </td>
              </tr>
            `
          }).join('')}
        </tbody>

      </table>
    </div>
  `
}

// SUBTAB 4: Mandatory Document
function renderMandatoryDocTab(metrics) {
  const d = MANDATORY_DOCUMENTS_DATA
  const activeTier = metrics.mandatoryTier // 'low' | 'moderate' | 'high'
  return `
    <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05); font-size:13px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">
            4. Mandatory Document (เอกสารมาตรการควบคุมขั้นต่ำ 24 ฉบับ)
          </h3>
          <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
            อ้างอิง: กฎหมายลำดับรอง ฉบับที่ 12 พรบ.ไซเบอร์ 2562 (เกณฑ์การบังคับใช้เอกสารตามระดับความเสี่ยงของหน่วยงาน)
          </p>
        </div>
        
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:13px; color:#475569;">สถานะหน่วยงานปัจจุบัน:</span>
          <span class="inline-block px-3 py-1 rounded-full text-sm font-bold bg-teal-100 text-teal-800 border border-teal-300">
            ระดับ ${metrics.mandatoryTierName} (${metrics.mandatoryDocsCount} ฉบับ)
          </span>
        </div>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
          <thead>
            <tr style="background:#0f172a; color:#ffffff; text-align:left;">
              <th style="padding:10px; width:45px; text-align:center; border:1px solid #334155;">ลำดับ</th>
              <th style="padding:10px; border:1px solid #334155;">ชื่อนโยบาย / เอกสารมาตรการขั้นต่ำ</th>
              <th style="padding:10px; width:130px; text-align:center; border:1px solid #334155; ${activeTier === 'low' ? 'background:#059669;' : ''}">
                <div>ความเสี่ยงต่ำ</div>
                <div style="font-size:11px; opacity:0.85;">10 ฉบับ</div>
              </th>
              <th style="padding:10px; width:130px; text-align:center; border:1px solid #334155; ${activeTier === 'moderate' ? 'background:#0d9488;' : ''}">
                <div>ความเสี่ยงปานกลาง</div>
                <div style="font-size:11px; opacity:0.85;">13 ฉบับ</div>
              </th>
              <th style="padding:10px; width:130px; text-align:center; border:1px solid #334155; ${activeTier === 'high' ? 'background:#ea580c;' : ''}">
                <div>ความเสี่ยงสูง</div>
                <div style="font-size:11px; opacity:0.85;">17 ฉบับ</div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${d.items.map(row => {
              const isEven = row.no % 2 === 0
              return `
                <tr style="background:${isEven ? '#ffffff' : '#f8fafc'};">
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; text-align:center; font-weight:700;">${row.no}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; color:#1e293b; font-weight:500;">${row.title}</td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; text-align:center; ${activeTier === 'low' ? 'background:#f0fdf4;' : ''}">
                    ${row.lowRisk ? '<span style="color:#16a34a; font-weight:800; font-size:14px;">✓ บังคับ</span>' : '<span style="color:#cbd5e1;">-</span>'}
                  </td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; text-align:center; ${activeTier === 'moderate' ? 'background:#f0fdfa;' : ''}">
                    ${row.moderateRisk ? '<span style="color:#0d9488; font-weight:800; font-size:14px;">✓ บังคับ</span>' : '<span style="color:#cbd5e1;">-</span>'}
                  </td>
                  <td style="padding:8px 10px; border:1px solid #e2e8f0; text-align:center; ${activeTier === 'high' ? 'background:#fff7ed;' : ''}">
                    ${row.highRisk ? '<span style="color:#ea580c; font-weight:800; font-size:14px;">✓ บังคับ</span>' : '<span style="color:#cbd5e1;">-</span>'}
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

// SUBTAB 5: Compare
function renderCompareTab() {
  const rows = COMPARE_MATRIX_DATA
  return `
    <div style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05); font-size:13px;">
      <div style="margin-bottom:20px;">
        <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">
          5. Compare (ตารางเปรียบเทียบ Risk Register vs Risk Assessment vs Risk Profile)
        </h3>
        <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">
          จำลองตามมาตรฐานการประเมินและการกำกับดูแลความเสี่ยง 15 ขั้นตอนหลัก
        </p>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:12px;">
          <thead>
            <tr style="background:#0f172a; color:#ffffff; text-align:left;">
              <th style="padding:10px 12px; width:45px; text-align:center; border:1px solid #334155;">ลำดับ</th>
              <th style="padding:10px 12px; width:220px; border:1px solid #334155;">ระยะ (Phase)</th>
              <th style="padding:10px 12px; border:1px solid #334155;">กิจกรรมความเสี่ยง (Risk Activity)</th>
              <th style="padding:10px 12px; width:140px; text-align:center; border:1px solid #334155;">Risk Register</th>
              <th style="padding:10px 12px; width:140px; text-align:center; border:1px solid #334155;">Risk Assessment</th>
              <th style="padding:10px 12px; width:140px; text-align:center; border:1px solid #334155;">Risk Profile</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => {
              const isEven = row.id % 2 === 0
              return `
                <tr style="background:${isEven ? '#ffffff' : '#f8fafc'};">
                  <td style="padding:8px 12px; border:1px solid #e2e8f0; text-align:center; font-weight:700;">${row.id}</td>
                  <td style="padding:8px 12px; border:1px solid #e2e8f0; font-weight:600; color:#475569;">${row.phase}</td>
                  <td style="padding:8px 12px; border:1px solid #e2e8f0; color:#1e293b; font-weight:500;">${row.activity}</td>
                  <td style="padding:8px 12px; border:1px solid #e2e8f0; text-align:center; ${getCellStyle(row.register)}">
                    ${renderMarker(row.register)}
                  </td>
                  <td style="padding:8px 12px; border:1px solid #e2e8f0; text-align:center; ${getCellStyle(row.assess)}">
                    ${renderMarker(row.assess)}
                  </td>
                  <td style="padding:8px 12px; border:1px solid #e2e8f0; text-align:center; ${getCellStyle(row.profile)}">
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
  if (val === 'x') return 'background:#dcfce7; color:#166534; font-weight:800; font-size:14px;'
  if (val === 'O') return 'background:#fef9c3; color:#854d0e; font-weight:800; font-size:14px;'
  return 'background:#ffffff; color:#cbd5e1;'
}

function renderMarker(val) {
  if (val === 'x') return '✓'
  if (val === 'O') return 'O'
  return '-'
}

// BIND ALL EVENTS
export function bindRiskAssessmentEvents(containerEl, riskState, onUpdate) {
  if (!containerEl) return

  // 1. Subtab Switching
  containerEl.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-subtab')
      if (tabId && onUpdate) onUpdate({ type: 'switch_subtab', subtab: tabId })
    })
  })

  // 2. View Mode Toggle (Card vs Table)
  const btnViewCard = containerEl.querySelector('#btn-view-card')
  if (btnViewCard) {
    btnViewCard.addEventListener('click', () => {
      if (onUpdate) onUpdate({ type: 'switch_view_mode', mode: 'card' })
    })
  }

  const btnViewTable = containerEl.querySelector('#btn-view-table')
  if (btnViewTable) {
    btnViewTable.addEventListener('click', () => {
      if (onUpdate) onUpdate({ type: 'switch_view_mode', mode: 'table' })
    })
  }

  // 3. Cluster Filter Pills
  containerEl.querySelectorAll('.cluster-pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      const cluster = pill.getAttribute('data-cluster')
      if (onUpdate) onUpdate({ type: 'filter_cluster', cluster })
    })
  })

  // 4. Editable Header Card Inputs
  containerEl.querySelectorAll('.risk-meta-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const field = input.getAttribute('data-field')
      const val = e.target.value
      if (onUpdate) onUpdate({ type: 'update_risk_metadata', field, value: val })
    })
  })

  // 5. Cluster Dropdown Filter
  const clusterSelect = containerEl.querySelector('#select-risk-cluster')
  if (clusterSelect) {
    clusterSelect.addEventListener('change', (e) => {
      if (onUpdate) onUpdate({ type: 'filter_cluster', cluster: e.target.value })
    })
  }

  // 6. Search Filter
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

  // 7. Matrix Cell Click
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

  // 8. Item Cell Inputs & Scores
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

  // 9. Initial Checkboxes: CIA & FSRILO
  containerEl.querySelectorAll('.risk-cia-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const riskId = chk.getAttribute('data-risk-id')
      const factor = chk.getAttribute('data-factor')
      const checked = chk.checked
      if (onUpdate) onUpdate({ type: 'update_risk_cia', riskId, factor, part: 'initial', checked })
    })
  })

  containerEl.querySelectorAll('.risk-fsrilo-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const riskId = chk.getAttribute('data-risk-id')
      const factor = chk.getAttribute('data-factor')
      const checked = chk.checked
      if (onUpdate) onUpdate({ type: 'update_risk_fsrilo', riskId, factor, part: 'initial', checked })
    })
  })

  // 10. Sub-actions Management (Part 2, 3 & 4)
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

  containerEl.querySelectorAll('.subaction-p2date-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const riskId = input.getAttribute('data-risk-id')
      const subId = input.getAttribute('data-sub-id')
      if (onUpdate) onUpdate({ type: 'update_sub_action_field', riskId, subId, field: 'expected_date_part2', value: e.target.value })
    })
  })

  containerEl.querySelectorAll('.subaction-p3date-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const riskId = input.getAttribute('data-risk-id')
      const subId = input.getAttribute('data-sub-id')
      if (onUpdate) onUpdate({ type: 'update_sub_action_field', riskId, subId, field: 'expected_date_part3', value: e.target.value })
    })
  })

  // Progress input (number) & slider (range)
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

  containerEl.querySelectorAll('.subaction-prog-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const riskId = slider.getAttribute('data-risk-id')
      const subId = slider.getAttribute('data-sub-id')
      const val = Number(e.target.value) || 0
      if (onUpdate) onUpdate({ type: 'update_sub_action_prog', riskId, subId, value: val })
    })
  })

  // Residual CIA & FSRILO per sub-action
  containerEl.querySelectorAll('.subaction-cia-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const riskId = chk.getAttribute('data-risk-id')
      const subId = chk.getAttribute('data-sub-id')
      const factor = chk.getAttribute('data-factor')
      const checked = chk.checked
      if (onUpdate) onUpdate({ type: 'update_sub_action_cia', riskId, subId, factor, checked })
    })
  })

  containerEl.querySelectorAll('.subaction-fsrilo-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const riskId = chk.getAttribute('data-risk-id')
      const subId = chk.getAttribute('data-sub-id')
      const factor = chk.getAttribute('data-factor')
      const checked = chk.checked
      if (onUpdate) onUpdate({ type: 'update_sub_action_fsrilo', riskId, subId, factor, checked })
    })
  })

  // Residual RL, RI score select per sub-action
  containerEl.querySelectorAll('.subaction-score-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const riskId = sel.getAttribute('data-risk-id')
      const subId = sel.getAttribute('data-sub-id')
      const field = sel.getAttribute('data-field')
      const val = Number(sel.value)
      if (onUpdate) onUpdate({ type: 'update_sub_action_score', riskId, subId, field, value: val })
    })
  })

  // Further Actions input per sub-action
  containerEl.querySelectorAll('.subaction-further-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const riskId = input.getAttribute('data-risk-id')
      const subId = input.getAttribute('data-sub-id')
      if (onUpdate) onUpdate({ type: 'update_sub_action_field', riskId, subId, field: 'further_actions', value: e.target.value })
    })
  })

  // 11. Add / Delete Custom Risk Item
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

  // 12. Update Log Events
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

  // 13. Print Report
  const printBtn = containerEl.querySelector('#btn-print-risk')
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print()
    })
  }

  // 14. Export CSV
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
    'ลำดับมาตรการย่อย',
    'ชื่อมาตรการย่อย',
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
    const subList = item.sub_actions && item.sub_actions.length > 0 ? item.sub_actions : [{}]

    subList.forEach((sub, sIdx) => {
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
        sIdx + 1,
        sub.name || '',
        sub.expected_date_part2 || '',
        sub.progress_percent !== undefined ? sub.progress_percent : item.progress_percent,
        sub.expected_date_part3 || '',
        sub.residual_cia?.c ? 'X' : '-',
        sub.residual_cia?.i ? 'X' : '-',
        sub.residual_cia?.a ? 'X' : '-',
        sub.residual_fsrilo?.f ? 'X' : '-',
        sub.residual_fsrilo?.s ? 'X' : '-',
        sub.residual_fsrilo?.r ? 'X' : '-',
        sub.residual_fsrilo?.i ? 'X' : '-',
        sub.residual_fsrilo?.l ? 'X' : '-',
        sub.residual_fsrilo?.o ? 'X' : '-',
        sub.residual_likelihood || 1,
        sub.residual_impact || 1,
        sub.residual_risk_score || 1,
        sub.further_actions || ''
      ]
      csv += row.map(v => `"${String(v !== undefined && v !== null ? v : '').replace(/"/g, '""')}"`).join(',') + '\n'
    })
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
      left: 45px;
      z-index: 5;
    }
    thead th.sticky-col-1, thead th.sticky-col-2 {
      z-index: 10;
    }
    .matrix-clickable-cell:hover {
      transform: scale(1.03);
      z-index: 10;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .subtab-btn:hover {
      opacity: 0.92;
    }
    .cluster-pill-btn {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      transition: all 0.15s ease;
    }
    .cluster-pill-btn:hover {
      background: #e2e8f0;
    }
    .cluster-pill-btn.pill-active {
      background: #1e3a8a !important;
      color: #ffffff !important;
      border-color: #1e3a8a !important;
      box-shadow: 0 2px 4px rgba(30,58,138,0.25);
    }
    .btn-view-active {
      background: #2563eb !important;
      color: #ffffff !important;
      border: 1px solid #2563eb !important;
      box-shadow: 0 2px 4px rgba(37,99,235,0.2);
    }
    .btn-view-inactive {
      background: #ffffff !important;
      color: #475569 !important;
      border: 1px solid #cbd5e1 !important;
    }
    .btn-view-inactive:hover {
      background: #f8fafc !important;
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
