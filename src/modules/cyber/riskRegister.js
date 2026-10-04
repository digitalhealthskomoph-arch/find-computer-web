// โมดูล 2.2 Risk Register - ทะเบียนความเสี่ยง
// รองรับ 4 แถบย่อย: ทะเบียนความเสี่ยง, Update Log, Criteria, Compare พร้อม Table/Card View, Modal และ Supabase Sync

import {
  DEFAULT_RISK_REGISTER_HEADER,
  DEFAULT_RISK_REGISTER_LOGS,
  DEFAULT_RISK_REGISTER_ITEMS,
  RISK_REGISTER_CLUSTERS,
  RISK_REGISTER_COMPARE_DATA,
  CRITERIA_IMPACT_LEVELS,
  CRITERIA_LIKELIHOOD_LEVELS,
  CRITERIA_RISK_SCORE_RANGES,
  CRITERIA_CLUSTER_AVG_RANGES,
  getRiskLevelInfo,
  getClusterAvgInfo,
  calculateClusterAverages
} from './riskRegisterData.js'
import { supabase } from '../../lib/supabase.js'
import { showNotification } from '../../lib/utils.js'
import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'

export function renderRiskRegisterHtml(
  registerData = {
    header: DEFAULT_RISK_REGISTER_HEADER,
    logs: DEFAULT_RISK_REGISTER_LOGS,
    items: DEFAULT_RISK_REGISTER_ITEMS
  },
  activeSubTab = 'register',
  clusterFilter = 'all',
  searchQuery = '',
  viewMode = 'table'
) {
  const header = registerData.header || DEFAULT_RISK_REGISTER_HEADER
  const logs = registerData.logs || DEFAULT_RISK_REGISTER_LOGS
  const allItems = registerData.items || DEFAULT_RISK_REGISTER_ITEMS

  // Filter items
  const filteredItems = allItems.filter(item => {
    const matchCluster = clusterFilter === 'all' || (item.category || '').toLowerCase() === clusterFilter.toLowerCase()
    const q = searchQuery.toLowerCase().trim()
    const matchSearch = !q ||
      (item.system || '').toLowerCase().includes(q) ||
      (item.threat || '').toLowerCase().includes(q) ||
      (item.vulnerability || '').toLowerCase().includes(q) ||
      (item.treatment_plan || '').toLowerCase().includes(q) ||
      (item.risk_owner || '').toLowerCase().includes(q)
    return matchCluster && matchSearch
  })

  // Calculate cluster averages
  const clusterAverages = calculateClusterAverages(allItems)

  // Overall statistics
  const totalCount = allItems.length
  const openCount = allItems.filter(i => (i.status || 'Open').toLowerCase() === 'open').length
  const inProgressCount = allItems.filter(i => (i.status || '').toLowerCase() === 'in progress' || (i.status || '').includes('ดำเนิน')).length
  const closedCount = allItems.filter(i => (i.status || '').toLowerCase() === 'closed').length

  const avgOverall = totalCount > 0
    ? (allItems.reduce((acc, i) => acc + (Number(i.risk_level) || 0), 0) / totalCount).toFixed(2)
    : "0.00"
  const overallAvgInfo = getClusterAvgInfo(avgOverall)

  return `
    <div style="font-family:'Sarabun',-apple-system,sans-serif; color:#1e293b; max-width:1400px; margin:0 auto; padding-bottom:60px;">
      
      <!-- Top Navigation Sub-Tabs -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #e2e8f0; padding-bottom:12px; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn rr-subtab-btn ${activeSubTab === 'register' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="register" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>📋</span> ทะเบียนความเสี่ยง (Risk Register)
            <span class="badge" style="background:#2563eb; color:#fff; border-radius:999px; padding:2px 7px; font-size:11px;">${allItems.length}</span>
          </button>
          <button class="btn rr-subtab-btn ${activeSubTab === 'log' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="log" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>📝</span> ประวัติการปรับปรุง (Update Log)
            <span class="badge" style="background:#64748b; color:#fff; border-radius:999px; padding:2px 7px; font-size:11px;">${logs.length}</span>
          </button>
          <button class="btn rr-subtab-btn ${activeSubTab === 'criteria' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="criteria" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>📊</span> เกณฑ์การประเมิน (Criteria & Matrix)
          </button>
          <button class="btn rr-subtab-btn ${activeSubTab === 'compare' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="compare" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>⚖️</span> ตารางเปรียบเทียบ (Compare)
          </button>
        </div>

        ${activeSubTab === 'register' ? `
          <div style="display:flex; align-items:center; gap:8px;">
            <button id="btn-add-rr-item" class="btn btn-sm btn-primary" style="font-size:12.5px; font-weight:700; border-radius:6px; padding:6px 14px; background:#2563eb; border:none; display:inline-flex; align-items:center; gap:5px;">
              <span>+</span> เพิ่มความเสี่ยงใหม่
            </button>
            <button id="btn-export-rr-word" class="btn btn-sm btn-outline-primary" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:4px;">
              <span>📄</span> ส่งออก Word
            </button>
            <button id="btn-export-rr-csv" class="btn btn-sm btn-outline-success" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:4px;">
              <span>📊</span> ส่งออก CSV
            </button>
            <button id="btn-reset-rr-default" class="btn btn-sm btn-outline-secondary" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 10px;" title="รีเซ็ตค่าเริ่มต้นจากเอกสารจริง">
              รีเซ็ต
            </button>
            <button id="btn-print-rr" class="btn btn-sm btn-outline-dark" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:4px;">
              <span>🖨️</span> พิมพ์
            </button>
          </div>
        ` : ''}
      </div>

      ${activeSubTab === 'register' ? renderRegisterTabContent(header, filteredItems, clusterAverages, clusterFilter, searchQuery, viewMode, totalCount, openCount, inProgressCount, closedCount, avgOverall, overallAvgInfo) : ''}
      ${activeSubTab === 'log' ? renderUpdateLogTabContent(logs) : ''}
      ${activeSubTab === 'criteria' ? renderCriteriaTabContent() : ''}
      ${activeSubTab === 'compare' ? renderCompareTabContent() : ''}

    </div>
  `
}

// 1. Tab: ทะเบียนความเสี่ยง (Risk Register)
function renderRegisterTabContent(
  header,
  items,
  clusterAverages,
  clusterFilter,
  searchQuery,
  viewMode,
  totalCount,
  openCount,
  inProgressCount,
  closedCount,
  avgOverall,
  overallAvgInfo
) {
  return `
    <div>
      <!-- Header Information Banner -->
      <div style="background:#fff; border-radius:10px; border:1px solid #e2e8f0; padding:18px 24px; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
          <div>
            <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0 0 4px 0; display:flex; align-items:center; gap:8px;">
              <span>🛡️</span> ทะเบียนความเสี่ยง (Risk Register)
            </h2>
            <div style="font-size:13px; color:#64748b;">
              ระบบบริการที่สำคัญ: <strong style="color:#2563eb;">${header.critical_service || 'All critical application'}</strong> | สถานที่: <span>${header.location || '-'}</span>
            </div>
          </div>
          <button id="btn-edit-rr-header" class="btn btn-sm btn-outline-primary" style="font-size:12px; font-weight:600; border-radius:6px; padding:4px 10px;">
            ✏️ แก้ไขข้อมูลส่วนหัว
          </button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; font-size:12.5px; background:#f8fafc; padding:12px 16px; border-radius:8px; border:1px solid #e2e8f0;">
          <div>
            <span style="color:#64748b; font-weight:600;">ผู้บันทึก:</span>
            <div style="font-weight:700; color:#1e293b; margin-top:2px;">${header.recorder || '-'}</div>
          </div>
          <div>
            <span style="color:#64748b; font-weight:600;">วันที่ประชุมพร้อมบันทึก:</span>
            <div style="font-weight:700; color:#1e293b; margin-top:2px;">${header.meeting_date || '-'} (ประจำเดือน: ${header.record_month || '-'})</div>
          </div>
          <div>
            <span style="color:#64748b; font-weight:600;">ที่อยู่:</span>
            <div style="color:#334155; margin-top:2px;">${header.address || '-'}</div>
          </div>
          <div>
            <span style="color:#64748b; font-weight:600;">คำอธิบายเกณฑ์ความเสี่ยง:</span>
            <div style="color:#16a34a; font-weight:700; margin-top:2px;">1 - 3.4 เป็นความเสี่ยงต่ำ ติดตามเป็นระยะ</div>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards (Cluster Averages & Status) -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:20px;">
        <!-- Total Risks -->
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">ความเสี่ยงทั้งหมด</div>
          <div style="font-size:1.75rem; font-weight:800; color:#0f172a; margin:4px 0 2px 0;">${totalCount} <span style="font-size:12px; font-weight:600; color:#64748b;">รายการ</span></div>
          <div style="font-size:11.5px; color:#64748b;">
            <span style="color:#dc2626; font-weight:700;">Open: ${openCount}</span> | 
            <span style="color:#ca8a04; font-weight:700;">Progress: ${inProgressCount}</span> | 
            <span style="color:#16a34a; font-weight:700;">Closed: ${closedCount}</span>
          </div>
        </div>

        <!-- Overall Average -->
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">ค่าเฉลี่ยความเสี่ยงรวม</div>
          <div style="display:flex; align-items:baseline; gap:8px; margin:4px 0 2px 0;">
            <div style="font-size:1.75rem; font-weight:800; color:#0f172a;">${avgOverall}</div>
            <span class="badge" style="background:${overallAvgInfo.bg}; color:${overallAvgInfo.color}; border:1px solid ${overallAvgInfo.border}; font-weight:700; font-size:11px; padding:3px 7px; border-radius:4px;">
              ${overallAvgInfo.text}
            </span>
          </div>
          <div style="font-size:11.5px; color:#64748b;">เกณฑ์คะแนนเฉลี่ย 1.0 - 25.0</div>
        </div>

        <!-- Operational Cluster Avg -->
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Cluster: Operational</div>
          <div style="display:flex; align-items:baseline; gap:8px; margin:4px 0 2px 0;">
            <div style="font-size:1.75rem; font-weight:800; color:#0f172a;">${clusterAverages['Operational'] || '0.00'}</div>
            ${(() => {
              const info = getClusterAvgInfo(clusterAverages['Operational'] || 0)
              return `<span class="badge" style="background:${info.bg}; color:${info.color}; border:1px solid ${info.border}; font-weight:700; font-size:11px; padding:3px 7px; border-radius:4px;">${info.text}</span>`
            })()}
          </div>
          <div style="font-size:11.5px; color:#64748b;">ด้านการปฏิบัติงานและบริการ</div>
        </div>

        <!-- Strategic Cluster Avg -->
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Cluster: Strategic</div>
          <div style="display:flex; align-items:baseline; gap:8px; margin:4px 0 2px 0;">
            <div style="font-size:1.75rem; font-weight:800; color:#0f172a;">${clusterAverages['Strategic'] || '0.00'}</div>
            ${(() => {
              const info = getClusterAvgInfo(clusterAverages['Strategic'] || 0)
              return `<span class="badge" style="background:${info.bg}; color:${info.color}; border:1px solid ${info.border}; font-weight:700; font-size:11px; padding:3px 7px; border-radius:4px;">${info.text}</span>`
            })()}
          </div>
          <div style="font-size:11.5px; color:#64748b;">ด้านยุทธศาสตร์และกลยุทธ์</div>
        </div>

        <!-- Compliance Cluster Avg -->
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase;">Cluster: Compliance</div>
          <div style="display:flex; align-items:baseline; gap:8px; margin:4px 0 2px 0;">
            <div style="font-size:1.75rem; font-weight:800; color:#0f172a;">${clusterAverages['Compliance'] || '0.00'}</div>
            ${(() => {
              const info = getClusterAvgInfo(clusterAverages['Compliance'] || 0)
              return `<span class="badge" style="background:${info.bg}; color:${info.color}; border:1px solid ${info.border}; font-weight:700; font-size:11px; padding:3px 7px; border-radius:4px;">${info.text}</span>`
            })()}
          </div>
          <div style="font-size:11.5px; color:#64748b;">ด้านกฎหมายและการปฏิบัติตาม</div>
        </div>
      </div>

      <!-- Control Bar (Search, Cluster Filter, View Mode Toggle) -->
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:12px 18px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex:1;">
          <!-- Search Input -->
          <div style="position:relative; min-width:240px; max-width:320px; flex:1;">
            <input type="text" id="input-search-rr" placeholder="ค้นหา ระบบงาน / ภัยคุกคาม / แผนจัดการ..." 
              value="${searchQuery}" class="form-control form-control-sm" 
              style="padding-left:30px; font-size:13px; border-radius:6px; border:1px solid #cbd5e1;">
            <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:13px;">🔍</span>
          </div>

          <!-- Cluster Filter -->
          <select id="select-cluster-filter-rr" class="form-select form-select-sm" style="width:auto; font-size:13px; font-weight:600; border-radius:6px; padding:5px 12px; border:1px solid #cbd5e1;">
            <option value="all" ${clusterFilter === 'all' ? 'selected' : ''}>🌐 ทุกกลุ่มความเสี่ยง (All Clusters)</option>
            ${RISK_REGISTER_CLUSTERS.map(c => `
              <option value="${c}" ${clusterFilter.toLowerCase() === c.toLowerCase() ? 'selected' : ''}>${c}</option>
            `).join('')}
          </select>
        </div>

        <!-- View Mode Buttons -->
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:12px; color:#64748b; font-weight:600; margin-right:4px;">มุมมอง:</span>
          <button class="btn btn-sm btn-mode-rr ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}" data-mode="table" style="font-size:12px; font-weight:600; border-radius:6px; padding:5px 12px;">
            📊 ตาราง Matrix
          </button>
          <button class="btn btn-sm btn-mode-rr ${viewMode === 'card' ? 'btn-primary' : 'btn-outline-secondary'}" data-mode="card" style="font-size:12px; font-weight:600; border-radius:6px; padding:5px 12px;">
            🗂️ การ์ด (Card)
          </button>
        </div>
      </div>

      <!-- Content View: Matrix Table or Card View -->
      ${viewMode === 'table' ? renderMatrixTableView(items, clusterAverages) : renderCardView(items, clusterAverages)}

    </div>
  `
}

// 2. Matrix Table View (Full Multi-Part Horizontal Matrix)
function renderMatrixTableView(items, clusterAverages) {
  if (items.length === 0) {
    return `
      <div style="background:#fff; border:1px dashed #cbd5e1; border-radius:10px; padding:48px 20px; text-align:center; color:#94a3b8;">
        <div style="font-size:36px; margin-bottom:8px;">🔍</div>
        <div style="font-weight:700; font-size:15px; color:#475569;">ไม่พบรายการความเสี่ยงที่ตรงกับเงื่อนไข</div>
        <div style="font-size:13px; margin-top:4px;">ลองเปลี่ยนคำค้นหา หรือเลือกกลุ่มความเสี่ยงใหม่</div>
      </div>
    `
  }

  return `
    <div style="background:#fff; border:1px solid #cbd5e1; border-radius:10px; overflow-x:auto; box-shadow:0 1px 3px rgba(0,0,0,0.04); margin-bottom:24px;">
      <table style="width:100%; border-collapse:collapse; font-size:12px; min-width:2100px; text-align:left;">
        <thead>
          <!-- Top Multi-Part Header Row -->
          <tr style="background:#0f172a; color:#fff; font-weight:800; font-size:12px; text-align:center; border-bottom:1px solid #334155;">
            <th colspan="17" style="padding:10px 8px; border-right:2px solid #38bdf8; background:#0f172a; color:#38bdf8; letter-spacing:0.3px;">
              PART 1 : Risk Assessment, Record and 1st Evaluation (การระบุและประเมินความเสี่ยงรอบแรก)
            </th>
            <th colspan="15" style="padding:10px 8px; border-right:2px solid #34d399; background:#064e3b; color:#34d399; letter-spacing:0.3px;">
              PART 2 : Risk Treatment Plan and Expected Assessment with Risk Residual (แผนจัดการและประเมินความเสี่ยงคงเหลือ)
            </th>
            <th colspan="3" style="padding:10px 8px; background:#1e1b4b; color:#a5b4fc; letter-spacing:0.3px;">
              PART 3 : Follow Up (การติดตามผล)
            </th>
          </tr>

          <!-- Sub-Header Row 2 -->
          <tr style="background:#f1f5f9; color:#334155; font-weight:700; font-size:11.5px; text-align:center; border-bottom:1px solid #cbd5e1;">
            <!-- Part 1 basic -->
            <th style="padding:6px; border:1px solid #cbd5e1; width:40px;">#</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:80px;">วันที่ระบุ</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:95px;">กลุ่มความเสี่ยง</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:150px;">ระบบงาน (System)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:140px;">ภัยคุกคาม (Threat)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:160px;">ช่องโหว่ (Vulner.)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:150px;">มาตรการควบคุมเดิม</th>
            
            <!-- CIA -->
            <th colspan="3" style="padding:6px; border:1px solid #cbd5e1; background:#e0f2fe; color:#0369a1;">กระทบต่อ (CIA)</th>
            
            <!-- FSRILO -->
            <th colspan="6" style="padding:6px; border:1px solid #cbd5e1; background:#fef3c7; color:#92400e;">ความรุนแรงแต่ละด้าน (FSRILO)</th>
            
            <!-- Risk Analysis -->
            <th style="padding:6px; border:1px solid #cbd5e1; width:55px;">A (โอกาส)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:55px;">B (รุนแรง)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:85px; background:#fee2e2; color:#991b1b;">C = A*B (ระดับ)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:140px;">เจ้าของความเสี่ยง</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:95px; border-right:2px solid #38bdf8; background:#f0fdf4; color:#166534;">ค่าเฉลี่ย Cluster</th>

            <!-- Part 2 Treatment -->
            <th style="padding:6px; border:1px solid #cbd5e1; width:110px;">การตอบสนอง</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:170px;">แผนจัดการความเสี่ยง</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:70px;">คืบหน้า (%)</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:85px;">คาดแล้วเสร็จ</th>
            
            <!-- Residual CIA -->
            <th colspan="3" style="padding:6px; border:1px solid #cbd5e1; background:#e0f2fe; color:#0369a1;">คงเหลือ CIA</th>

            <!-- Residual FSRILO -->
            <th colspan="6" style="padding:6px; border:1px solid #cbd5e1; background:#fef3c7; color:#92400e;">คงเหลือ FSRILO</th>
            
            <!-- Residual Score -->
            <th style="padding:6px; border:1px solid #cbd5e1; width:55px;">A คงเหลือ</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:55px;">B คงเหลือ</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:85px; border-right:2px solid #34d399; background:#dcfce7; color:#166534;">ระดับคงเหลือ</th>

            <!-- Part 3 Follow Up -->
            <th style="padding:6px; border:1px solid #cbd5e1; width:75px;">สถานะ</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:140px;">รายละเอียดคืบหน้า</th>
            <th style="padding:6px; border:1px solid #cbd5e1; width:80px; text-align:center;">จัดการ</th>
          </tr>

          <!-- Sub-Header Row 3 (Specific sub-indicators) -->
          <tr style="background:#f8fafc; font-size:10.5px; text-align:center; color:#64748b; border-bottom:2px solid #cbd5e1;">
            <th colspan="7" style="border:1px solid #cbd5e1;"></th>
            
            <!-- CIA -->
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#e0f2fe; color:#0369a1;">C</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#e0f2fe; color:#0369a1;">I</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#e0f2fe; color:#0369a1;">A</th>
            
            <!-- FSRILO -->
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;" title="Financial (การเงิน)">F</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;" title="Safety (ความปลอดภัย)">S</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;" title="Reputation (ชื่อเสียง)">R</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;" title="Infrastructure (โครงสร้างพื้นฐาน)">I</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;" title="Legal (กฎหมาย)">L</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;" title="Operation (การดำเนินงาน)">O</th>

            <th colspan="5" style="border:1px solid #cbd5e1; border-right:2px solid #38bdf8;"></th>

            <th colspan="4" style="border:1px solid #cbd5e1;"></th>

            <!-- Residual CIA -->
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#e0f2fe; color:#0369a1;">C</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#e0f2fe; color:#0369a1;">I</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#e0f2fe; color:#0369a1;">A</th>

            <!-- Residual FSRILO -->
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;">F</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;">S</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;">R</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;">I</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;">L</th>
            <th style="padding:4px; border:1px solid #cbd5e1; width:26px; background:#fef3c7; color:#92400e;">O</th>

            <th colspan="3" style="border:1px solid #cbd5e1; border-right:2px solid #34d399;"></th>
            <th colspan="3" style="border:1px solid #cbd5e1;"></th>
          </tr>
        </thead>
        <tbody>
          ${items.map((it, idx) => {
            const riskInfo = getRiskLevelInfo(it.risk_level)
            const resRiskInfo = getRiskLevelInfo(it.residual_risk_level)
            const clusterAvg = clusterAverages[it.category] || '0.00'
            const clusterAvgInfo = getClusterAvgInfo(clusterAvg)
            const isEven = idx % 2 === 0

            return `
              <tr style="background:${isEven ? '#fff' : '#f8fafc'}; transition:background 0.15s ease;" class="rr-row-hover">
                <!-- No -->
                <td style="padding:8px 4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:#64748b;">${idx + 1}</td>
                
                <!-- Date -->
                <td style="padding:8px 6px; border:1px solid #cbd5e1; white-space:nowrap; color:#475569;">${it.date_identified || '-'}</td>
                
                <!-- Category/Cluster -->
                <td style="padding:8px 6px; border:1px solid #cbd5e1;">
                  <span style="background:#f1f5f9; color:#0f172a; padding:2px 6px; border-radius:4px; font-weight:600; font-size:11px; white-space:nowrap;">
                    ${it.category || 'Operational'}
                  </span>
                </td>
                
                <!-- System -->
                <td style="padding:8px; border:1px solid #cbd5e1; font-weight:700; color:#0f172a;">${it.system || '-'}</td>
                
                <!-- Threat -->
                <td style="padding:8px; border:1px solid #cbd5e1; color:#334155; line-height:1.4;">${it.threat || '-'}</td>
                
                <!-- Vulnerability -->
                <td style="padding:8px; border:1px solid #cbd5e1; color:#475569; font-size:11.5px; line-height:1.4;">${it.vulnerability || '-'}</td>
                
                <!-- Current Control -->
                <td style="padding:8px; border:1px solid #cbd5e1; color:#475569; font-size:11.5px; line-height:1.4;">${it.existing_controls || '-'}</td>
                
                <!-- CIA -->
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.impact_cia?.c ? '#dc2626' : '#94a3b8'};">${it.impact_cia?.c ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.impact_cia?.i ? '#dc2626' : '#94a3b8'};">${it.impact_cia?.i ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.impact_cia?.a ? '#dc2626' : '#94a3b8'};">${it.impact_cia?.a ? '✓' : '-'}</td>
                
                <!-- FSRILO -->
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.severity_fsrilo?.f ? '#b45309' : '#94a3b8'};">${it.severity_fsrilo?.f ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.severity_fsrilo?.s ? '#b45309' : '#94a3b8'};">${it.severity_fsrilo?.s ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.severity_fsrilo?.r ? '#b45309' : '#94a3b8'};">${it.severity_fsrilo?.r ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.severity_fsrilo?.i ? '#b45309' : '#94a3b8'};">${it.severity_fsrilo?.i ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.severity_fsrilo?.l ? '#b45309' : '#94a3b8'};">${it.severity_fsrilo?.l ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.severity_fsrilo?.o ? '#b45309' : '#94a3b8'};">${it.severity_fsrilo?.o ? '✓' : '-'}</td>

                <!-- Likelihood & Impact -->
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:#0f172a;">${it.likelihood || 1}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:#0f172a;">${it.impact || 1}</td>
                
                <!-- Risk Level -->
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center;">
                  <span class="badge" style="background:${riskInfo.bg}; color:${riskInfo.color}; border:1px solid ${riskInfo.border}; font-weight:800; font-size:12px; padding:3px 8px; border-radius:4px; display:inline-block; min-width:48px;">
                    ${it.risk_level || (it.likelihood * it.impact)}
                  </span>
                </td>

                <!-- Risk Owner -->
                <td style="padding:8px 6px; border:1px solid #cbd5e1; font-size:11.5px; color:#475569;">${it.risk_owner || '-'}</td>

                <!-- Cluster Avg Score -->
                <td style="padding:6px; border:1px solid #cbd5e1; border-right:2px solid #38bdf8; text-align:center;">
                  <span class="badge" style="background:${clusterAvgInfo.bg}; color:${clusterAvgInfo.color}; border:1px solid ${clusterAvgInfo.border}; font-weight:700; font-size:11px; padding:2px 6px; border-radius:4px;" title="ค่าเฉลี่ยของกลุ่ม ${it.category}: ${clusterAvg}">
                    ${clusterAvg}
                  </span>
                </td>

                <!-- Part 2: Treatment Option -->
                <td style="padding:8px 6px; border:1px solid #cbd5e1;">
                  <span style="background:#f0fdf4; color:#166534; font-weight:700; font-size:11px; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0; display:inline-block;">
                    ${it.treatment_option || 'Mitigate Risk'}
                  </span>
                </td>

                <!-- Treatment Plan -->
                <td style="padding:8px; border:1px solid #cbd5e1; line-height:1.4;">
                  <div style="font-weight:600; color:#0f172a; margin-bottom:2px;">${it.treatment_plan || '-'}</div>
                  ${(it.sub_actions && it.sub_actions.length > 0) ? `
                    <div style="font-size:11px; color:#64748b; margin-top:4px;">
                      ${it.sub_actions.map(s => `• ${s.name} (${s.progress_percent || 0}%)`).join('<br/>')}
                    </div>
                  ` : ''}
                </td>

                <!-- Progress Status % -->
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center;">
                  <div style="font-weight:700; color:#2563eb; font-size:11.5px;">${it.progress_percent || 0}%</div>
                  <div style="width:100%; background:#e2e8f0; height:4px; border-radius:2px; margin-top:3px; overflow:hidden;">
                    <div style="width:${Math.min(100, it.progress_percent || 0)}%; background:#2563eb; height:100%;"></div>
                  </div>
                </td>

                <!-- Expected Date -->
                <td style="padding:8px 6px; border:1px solid #cbd5e1; font-size:11.5px; color:#475569; white-space:nowrap;">
                  ${it.expected_finish_date || '-'}
                </td>

                <!-- Residual CIA -->
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_cia?.c ? '#dc2626' : '#94a3b8'};">${it.residual_cia?.c ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_cia?.i ? '#dc2626' : '#94a3b8'};">${it.residual_cia?.i ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_cia?.a ? '#dc2626' : '#94a3b8'};">${it.residual_cia?.a ? '✓' : '-'}</td>

                <!-- Residual FSRILO -->
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_fsrilo?.f ? '#b45309' : '#94a3b8'};">${it.residual_fsrilo?.f ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_fsrilo?.s ? '#b45309' : '#94a3b8'};">${it.residual_fsrilo?.s ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_fsrilo?.r ? '#b45309' : '#94a3b8'};">${it.residual_fsrilo?.r ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_fsrilo?.i ? '#b45309' : '#94a3b8'};">${it.residual_fsrilo?.i ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_fsrilo?.l ? '#b45309' : '#94a3b8'};">${it.residual_fsrilo?.l ? '✓' : '-'}</td>
                <td style="padding:4px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:${it.residual_fsrilo?.o ? '#b45309' : '#94a3b8'};">${it.residual_fsrilo?.o ? '✓' : '-'}</td>

                <!-- Residual Likelihood & Impact -->
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:#166534;">${it.residual_likelihood || 1}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:700; color:#166534;">${it.residual_impact || 1}</td>

                <!-- Residual Risk Level -->
                <td style="padding:6px; border:1px solid #cbd5e1; border-right:2px solid #34d399; text-align:center;">
                  <span class="badge" style="background:${resRiskInfo.bg}; color:${resRiskInfo.color}; border:1px solid ${resRiskInfo.border}; font-weight:800; font-size:12px; padding:3px 8px; border-radius:4px; display:inline-block; min-width:48px;">
                    ${it.residual_risk_level || (it.residual_likelihood * it.residual_impact)}
                  </span>
                </td>

                <!-- Part 3: Status -->
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center;">
                  <span class="badge" style="background:${(it.status || 'Open') === 'Closed' ? '#dcfce7' : (it.status || '').includes('Progress') ? '#fef9c3' : '#fee2e2'}; color:${(it.status || 'Open') === 'Closed' ? '#166534' : (it.status || '').includes('Progress') ? '#854d0e' : '#991b1b'}; font-weight:700; font-size:11px; padding:3px 7px; border-radius:4px;">
                    ${it.status || 'Open'}
                  </span>
                </td>

                <!-- Progress Details -->
                <td style="padding:8px 6px; border:1px solid #cbd5e1; font-size:11.5px; color:#475569;">
                  ${it.follow_up_progress || '-'}
                </td>

                <!-- Actions -->
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; white-space:nowrap;">
                  <button class="btn btn-sm btn-outline-primary btn-edit-rr-item" data-id="${it.id}" style="padding:2px 6px; font-size:11px; border-radius:4px; margin-right:3px;" title="แก้ไขรายการ">
                    ✏️
                  </button>
                  <button class="btn btn-sm btn-outline-danger btn-del-rr-item" data-id="${it.id}" style="padding:2px 6px; font-size:11px; border-radius:4px;" title="ลบรายการ">
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

// 3. Card View (Readable responsive cards)
function renderCardView(items, clusterAverages) {
  if (items.length === 0) {
    return `
      <div style="background:#fff; border:1px dashed #cbd5e1; border-radius:10px; padding:48px 20px; text-align:center; color:#94a3b8;">
        <div style="font-size:36px; margin-bottom:8px;">🔍</div>
        <div style="font-weight:700; font-size:15px; color:#475569;">ไม่พบรายการความเสี่ยงที่ตรงกับเงื่อนไข</div>
      </div>
    `
  }

  return `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(420px, 1fr)); gap:16px; margin-bottom:24px;">
      ${items.map((it, idx) => {
        const riskInfo = getRiskLevelInfo(it.risk_level)
        const resRiskInfo = getRiskLevelInfo(it.residual_risk_level)
        const clusterAvg = clusterAverages[it.category] || '0.00'

        return `
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <!-- Card Header -->
            <div style="padding:12px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-weight:800; color:#2563eb; font-size:14px;">#${idx + 1}</span>
                <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-weight:700; font-size:11.5px;">${it.category || 'Operational'}</span>
                <span style="font-size:12px; color:#64748b;">📅 ${it.date_identified || '-'}</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="badge" style="background:${(it.status || 'Open') === 'Closed' ? '#dcfce7' : '#fee2e2'}; color:${(it.status || 'Open') === 'Closed' ? '#166534' : '#991b1b'}; font-weight:700; font-size:11px; padding:3px 8px; border-radius:4px;">
                  ${it.status || 'Open'}
                </span>
                <button class="btn btn-sm btn-outline-primary btn-edit-rr-item" data-id="${it.id}" style="padding:2px 6px; font-size:11px; border-radius:4px;">✏️</button>
                <button class="btn btn-sm btn-outline-danger btn-del-rr-item" data-id="${it.id}" style="padding:2px 6px; font-size:11px; border-radius:4px;">🗑️</button>
              </div>
            </div>

            <div style="padding:16px 18px;">
              <!-- System Title -->
              <h3 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0 0 10px 0;">
                ${it.system || '-'}
              </h3>

              <!-- PART 1 Summary -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:12px; font-size:12.5px;">
                <div style="margin-bottom:6px;">
                  <strong style="color:#dc2626;">ภัยคุกคาม:</strong> <span>${it.threat || '-'}</span>
                </div>
                <div style="margin-bottom:6px;">
                  <strong style="color:#b45309;">ช่องโหว่:</strong> <span>${it.vulnerability || '-'}</span>
                </div>
                <div style="margin-bottom:8px; color:#475569;">
                  <strong>มาตรการเดิม:</strong> <span>${it.existing_controls || '-'}</span>
                </div>

                <!-- Scores Grid -->
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #cbd5e1; padding-top:8px;">
                  <div style="font-size:11.5px; color:#64748b;">
                    โอกาส: <strong>${it.likelihood}</strong> × รุนแรง: <strong>${it.impact}</strong>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:12px; font-weight:700;">ระดับความเสี่ยง:</span>
                    <span class="badge" style="background:${riskInfo.bg}; color:${riskInfo.color}; border:1px solid ${riskInfo.border}; font-weight:800; font-size:12px; padding:2px 8px; border-radius:4px;">
                      ${it.risk_level} (${riskInfo.text})
                    </span>
                  </div>
                </div>
              </div>

              <!-- PART 2 Treatment Summary -->
              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px; margin-bottom:12px; font-size:12.5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span style="font-weight:700; color:#166534; font-size:12px;">แผนจัดการความเสี่ยง (${it.treatment_option || 'Mitigate Risk'})</span>
                  <span style="font-size:12px; font-weight:800; color:#2563eb;">${it.progress_percent || 0}%</span>
                </div>
                <div style="color:#1e293b; font-weight:600; margin-bottom:6px;">
                  ${it.treatment_plan || '-'}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:#475569; border-top:1px dashed #bbf7d0; padding-top:6px;">
                  <span>คาดแล้วเสร็จ: <strong>${it.expected_finish_date || '-'}</strong></span>
                  <span>ความเสี่ยงคงเหลือ: <strong style="color:${resRiskInfo.color}; font-weight:800;">${it.residual_risk_level} (${resRiskInfo.text})</strong></span>
                </div>
              </div>

              <!-- PART 3 Follow Up Details -->
              <div style="font-size:12px; color:#64748b; display:flex; justify-content:space-between;">
                <span>ผู้รับผิดชอบ: <strong>${it.risk_owner || '-'}</strong></span>
                <span>คืบหน้า: <strong style="color:#0f172a;">${it.follow_up_progress || '-'}</strong></span>
              </div>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

// 4. Tab: Update Log
function renderUpdateLogTabContent(logs) {
  return `
    <div style="background:#fff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <div>
          <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin:0 0 4px 0;">
            📝 ประวัติการปรับปรุงเอกสารทะเบียนความเสี่ยง (Update Log)
          </h3>
          <div style="font-size:13px; color:#64748b;">
            บันทึกประวัติการปรับปรุง แก้ไขเงื่อนไข และทบทวนสถานภาพทะเบียนความเสี่ยง
          </div>
        </div>
        <button id="btn-add-rr-log" class="btn btn-sm btn-primary" style="font-size:12.5px; font-weight:700; border-radius:6px; padding:6px 14px; background:#2563eb; border:none;">
          + เพิ่มบันทึกประวัติใหม่
        </button>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="background:#f8fafc; border-bottom:2px solid #cbd5e1; text-align:left;">
              <th style="padding:10px 14px; border:1px solid #e2e8f0; width:60px; text-align:center;">ลำดับ</th>
              <th style="padding:10px 14px; border:1px solid #e2e8f0; width:160px;">วันที่ปรับปรุง</th>
              <th style="padding:10px 14px; border:1px solid #e2e8f0;">สิ่งที่ปรับปรุง / แก้ไข</th>
              <th style="padding:10px 14px; border:1px solid #e2e8f0; width:110px; text-align:center;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map((l, idx) => `
              <tr style="background:${idx % 2 === 0 ? '#fff' : '#f8fafc'};">
                <td style="padding:10px 14px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#64748b;">${idx + 1}</td>
                <td style="padding:10px 14px; border:1px solid #e2e8f0; font-weight:600; color:#0f172a; white-space:nowrap;">📅 ${l.date || '-'}</td>
                <td style="padding:10px 14px; border:1px solid #e2e8f0; color:#334155; line-height:1.5;">${l.detail || '-'}</td>
                <td style="padding:10px 14px; border:1px solid #e2e8f0; text-align:center; white-space:nowrap;">
                  <button class="btn btn-sm btn-outline-primary btn-edit-rr-log" data-id="${l.id}" style="padding:2px 8px; font-size:11.5px; border-radius:4px; margin-right:4px;">✏️ แก้ไข</button>
                  <button class="btn btn-sm btn-outline-danger btn-del-rr-log" data-id="${l.id}" style="padding:2px 8px; font-size:11.5px; border-radius:4px;">🗑️ ลบ</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// 5. Tab: Criteria & Matrix
function renderCriteriaTabContent() {
  return `
    <div style="display:flex; flex-direction:column; gap:24px;">
      <!-- Section 1: 5x5 Matrix Grid -->
      <div style="background:#fff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin:0 0 16px 0;">
          📊 ตารางเมทริกซ์ระดับความเสี่ยง 5x5 (Risk Assessment Matrix)
        </h3>
        <div style="overflow-x:auto;">
          <table style="width:100%; max-width:850px; border-collapse:collapse; font-size:12.5px; text-align:center; margin:0 auto;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th rowspan="2" style="padding:10px; border:1px solid #cbd5e1; width:160px; font-weight:800;">ความรุนแรง (Severity / Impact)</th>
                <th colspan="5" style="padding:8px; border:1px solid #cbd5e1; font-weight:800; background:#e0f2fe; color:#0369a1;">โอกาสเกิด (Likelihood / Probability)</th>
              </tr>
              <tr style="background:#f8fafc; font-size:11.5px;">
                <th style="padding:6px; border:1px solid #cbd5e1; width:110px;">1: Rare<br/>(เกิดขึ้นได้ยาก)</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:110px;">2: Unlikely<br/>(โอกาสน้อย)</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:110px;">3: Moderate<br/>(อาจเกิดขึ้น)</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:110px;">4: Likely<br/>(มีโอกาสเกิด)</th>
                <th style="padding:6px; border:1px solid #cbd5e1; width:110px;">5: Almost Certain<br/>(เกือบแน่นอน)</th>
              </tr>
            </thead>
            <tbody>
              <!-- Row 5 Severe -->
              <tr>
                <td style="padding:8px 10px; border:1px solid #cbd5e1; font-weight:700; text-align:left; background:#f8fafc;">5. Severe (ระดับวิกฤต ข)</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 5</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#ffedd5; color:#9a3412; font-weight:800;">High 10</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:800;">Very High 15</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:800;">Extreme 20</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fca5a5; color:#7f1d1d; font-weight:800;">Extreme 25</td>
              </tr>
              <!-- Row 4 Significant -->
              <tr>
                <td style="padding:8px 10px; border:1px solid #cbd5e1; font-weight:700; text-align:left; background:#f8fafc;">4. Significant (ระดับวิกฤต ก)</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 4</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 8</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#ffedd5; color:#9a3412; font-weight:800;">High 12</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:800;">Very High 16</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:800;">Extreme 20</td>
              </tr>
              <!-- Row 3 Moderate -->
              <tr>
                <td style="padding:8px 10px; border:1px solid #cbd5e1; font-weight:700; text-align:left; background:#f8fafc;">3. Moderate (ระดับร้ายแรง)</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:800;">Low 3</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 6</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 9</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#ffedd5; color:#9a3412; font-weight:800;">High 12</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fee2e2; color:#991b1b; font-weight:800;">Very High 15</td>
              </tr>
              <!-- Row 2 Minor -->
              <tr>
                <td style="padding:8px 10px; border:1px solid #cbd5e1; font-weight:700; text-align:left; background:#f8fafc;">2. Minor (ระดับไม่ร้ายแรง)</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:800;">Very Low 2</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:800;">Low 4</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 6</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 8</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#ffedd5; color:#9a3412; font-weight:800;">High 10</td>
              </tr>
              <!-- Row 1 Insignificant -->
              <tr>
                <td style="padding:8px 10px; border:1px solid #cbd5e1; font-weight:700; text-align:left; background:#f8fafc;">1. Insignificant (ไม่มีผลกระทบ)</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:800;">Very Low 1</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:800;">Very Low 2</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#dcfce7; color:#166534; font-weight:800;">Low 3</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 4</td>
                <td style="padding:8px; border:1px solid #cbd5e1; background:#fef9c3; color:#854d0e; font-weight:800;">Med 5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Score Ranges (Criteria Level) -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(380px, 1fr)); gap:18px;">
        <!-- รายข้อ C = A*B -->
        <div style="background:#fff; border-radius:10px; border:1px solid #e2e8f0; padding:20px;">
          <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0 0 12px 0;">
            1. เกณฑ์ระดับความเสี่ยงรายข้อ (Risk Score: A × B = C)
          </h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${CRITERIA_RISK_SCORE_RANGES.map(r => `
              <div style="background:${r.bg}; border:1px solid ${r.color}33; border-radius:8px; padding:12px 14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <strong style="color:${r.color}; font-size:13.5px;">${r.level}</strong>
                  <span class="badge" style="background:${r.color}; color:#fff; font-weight:800; font-size:11.5px; padding:3px 8px; border-radius:4px;">
                    คะแนน ${r.min} - ${r.max}
                  </span>
                </div>
                <div style="font-size:12px; color:#334155; line-height:1.4;">${r.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ค่าเฉลี่ย Cluster -->
        <div style="background:#fff; border-radius:10px; border:1px solid #e2e8f0; padding:20px;">
          <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0 0 12px 0;">
            2. เกณฑ์ค่าเฉลี่ยของระดับความเสี่ยง (Cluster Average)
          </h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${CRITERIA_CLUSTER_AVG_RANGES.map(r => `
              <div style="background:${r.bg}; border:1px solid ${r.color}33; border-radius:8px; padding:12px 14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <strong style="color:${r.color}; font-size:13.5px;">${r.level}</strong>
                  <span class="badge" style="background:${r.color}; color:#fff; font-weight:800; font-size:11.5px; padding:3px 8px; border-radius:4px;">
                    ค่าเฉลี่ย ${r.min} - ${r.max}
                  </span>
                </div>
                <div style="font-size:12px; color:#334155; line-height:1.4;">${r.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Section 3: Detailed Criteria Dimensions -->
      <div style="background:#fff; border-radius:10px; border:1px solid #e2e8f0; padding:20px;">
        <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0 0 14px 0;">
          3. คำอธิบายระดับความรุนแรงและผลกระทบในแต่ละมิติ (Severity Details)
        </h4>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
            <thead>
              <tr style="background:#f8fafc; border-bottom:2px solid #cbd5e1; text-align:left;">
                <th style="padding:8px 12px; border:1px solid #e2e8f0; width:180px;">ระดับความรุนแรง</th>
                <th style="padding:8px 12px; border:1px solid #e2e8f0;">คำอธิบายผลกระทบต่อระบบ</th>
                <th style="padding:8px 12px; border:1px solid #e2e8f0; width:180px;">ผลกระทบด้านการเงิน</th>
                <th style="padding:8px 12px; border:1px solid #e2e8f0; width:180px;">ผลกระทบด้านชื่อเสียง</th>
                <th style="padding:8px 12px; border:1px solid #e2e8f0; width:180px;">ผลกระทบด้านกฎหมาย</th>
              </tr>
            </thead>
            <tbody>
              ${CRITERIA_IMPACT_LEVELS.map(c => `
                <tr>
                  <td style="padding:10px 12px; border:1px solid #e2e8f0; font-weight:700; color:#0f172a;">${c.name}</td>
                  <td style="padding:10px 12px; border:1px solid #e2e8f0; color:#334155;">${c.desc}</td>
                  <td style="padding:10px 12px; border:1px solid #e2e8f0; color:#dc2626;">${c.fin}</td>
                  <td style="padding:10px 12px; border:1px solid #e2e8f0; color:#475569;">${c.rep}</td>
                  <td style="padding:10px 12px; border:1px solid #e2e8f0; color:#0369a1;">${c.law}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
}

// 6. Tab: Compare (Risk Register vs Risk Assessment vs Risk Profile)
function renderCompareTabContent() {
  return `
    <div style="background:#fff; border-radius:10px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <div style="margin-bottom:20px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin:0 0 4px 0;">
          ⚖️ ตารางเปรียบเทียบ Risk Register vs Risk Assessment vs Risk Profile
        </h3>
        <div style="font-size:13px; color:#64748b;">
          วิเคราะห์ความแตกต่างและความเชื่อมโยงระหว่างทะเบียนความเสี่ยง การประเมินความเสี่ยง และโปรไฟล์ความเสี่ยง ตามเอกสารอาจารย์ไก่
        </div>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="background:#0f172a; color:#fff; text-align:center;">
              <th style="padding:10px 12px; border:1px solid #334155; width:50px;">#</th>
              <th style="padding:10px 14px; border:1px solid #334155; width:160px; text-align:left;">รายการ (Item)</th>
              <th style="padding:10px 14px; border:1px solid #334155; text-align:left;">คำอธิบาย (Description)</th>
              <th style="padding:10px 14px; border:1px solid #334155; width:160px; text-align:left;">หมวดหมู่ (Category)</th>
              <th style="padding:10px 12px; border:1px solid #334155; width:130px; background:#1e3a8a; color:#93c5fd;">Risk Register<br/>(ทะเบียนความเสี่ยง)</th>
              <th style="padding:10px 12px; border:1px solid #334155; width:130px; background:#14532d; color:#86efac;">Risk Assessment<br/>(การประเมินความเสี่ยง)</th>
              <th style="padding:10px 12px; border:1px solid #334155; width:130px; background:#581c87; color:#d8b4fe;">Risk Profile<br/>(โปรไฟล์ความเสี่ยง)</th>
            </tr>
          </thead>
          <tbody>
            ${RISK_REGISTER_COMPARE_DATA.map((row, idx) => `
              <tr style="background:${idx % 2 === 0 ? '#fff' : '#f8fafc'};">
                <td style="padding:10px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#64748b;">${row.no}</td>
                <td style="padding:10px 14px; border:1px solid #e2e8f0; font-weight:700; color:#0f172a;">${row.code}</td>
                <td style="padding:10px 14px; border:1px solid #e2e8f0; color:#334155;">${row.name}</td>
                <td style="padding:10px 14px; border:1px solid #e2e8f0; color:#64748b; font-size:12px;">${row.category}</td>
                <td style="padding:10px; border:1px solid #e2e8f0; text-align:center; font-weight:800; font-size:16px; color:${row.rr ? '#2563eb' : '#cbd5e1'}; background:${row.rr ? '#eff6ff' : 'transparent'};">
                  ${row.rr ? '✓' : '-'}
                </td>
                <td style="padding:10px; border:1px solid #e2e8f0; text-align:center; font-weight:800; font-size:16px; color:${row.ra ? '#16a34a' : '#cbd5e1'}; background:${row.ra ? '#f0fdf4' : 'transparent'};">
                  ${row.ra ? '✓' : '-'}
                </td>
                <td style="padding:10px; border:1px solid #e2e8f0; text-align:center; font-weight:800; font-size:16px; color:${row.rp ? '#9333ea' : '#cbd5e1'}; background:${row.rp ? '#faf5ff' : 'transparent'};">
                  ${row.rp ? '✓' : '-'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// 7. Supabase Sync Helpers
export async function syncRiskRegisterToSupabase(data) {
  try {
    if (!supabase || !data) return

    // 1. Module state cache
    await supabase.from('cyber_module_states').upsert({
      module_key: 'risk_register',
      data: data,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.warn('Supabase sync deferred for Risk Register:', err.message)
  }
}

export async function fetchRiskRegisterFromSupabase() {
  try {
    if (!supabase) return null

    const { data: stateData, error: stateErr } = await supabase
      .from('cyber_module_states')
      .select('data')
      .eq('module_key', 'risk_register')
      .maybeSingle()

    if (!stateErr && stateData?.data) {
      return stateData.data
    }
  } catch (err) {
    console.warn('Fetch Risk Register from Supabase deferred:', err.message)
  }
  return null
}

// 8. Word & CSV Exporters
export function exportRiskRegisterWord(registerData = {}) {
  const header = registerData.header || DEFAULT_RISK_REGISTER_HEADER
  const items = registerData.items || DEFAULT_RISK_REGISTER_ITEMS
  const clusterAverages = calculateClusterAverages(items)
  const totalCount = items.length
  const avgOverall = totalCount > 0
    ? (items.reduce((acc, i) => acc + (Number(i.risk_level) || 0), 0) / totalCount).toFixed(2)
    : "0.00"
  const overallAvgInfo = getClusterAvgInfo(avgOverall)

  const rowsHtml = items.map((item, idx) => {
    const cia = item.impact_cia || {}
    const fsr = item.severity_fsrilo || {}
    const rInfo = getRiskLevelInfo(item.risk_level || 1)
    const resInfo = getRiskLevelInfo(item.residual_risk_level || 1)
    const cStat = clusterAverages[item.category] || { avgScore: '-' }

    return `
      <tr>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${idx + 1}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${item.date_identified || '-'}</td>
        <td style="border:1px solid #999; padding:5px;">${item.category || '-'}</td>
        <td style="border:1px solid #999; padding:5px; font-weight:bold;">${item.system || '-'}</td>
        <td style="border:1px solid #999; padding:5px;">${item.threat || '-'}</td>
        <td style="border:1px solid #999; padding:5px;">${item.vulnerability || '-'}</td>
        <td style="border:1px solid #999; padding:5px;">${item.existing_controls || '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${cia.c ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${cia.i ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${cia.a ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${fsr.f ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${fsr.s ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${fsr.r ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${fsr.i ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${fsr.l ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${fsr.o ? '✓' : '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${item.likelihood || 1}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${item.impact || 1}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center; font-weight:bold; background:${rInfo.bg}; color:${rInfo.color};">${item.risk_level || 1}</td>
        <td style="border:1px solid #999; padding:5px;">${item.risk_owner || '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center; font-weight:bold;">${cStat.avgScore}</td>
        <td style="border:1px solid #999; padding:5px;">${item.treatment_option || '-'}</td>
        <td style="border:1px solid #999; padding:5px;">${item.treatment_plan || '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center; font-weight:bold;">${item.progress_percent || 0}%</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${item.expected_finish_date || '-'}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${item.residual_likelihood || 1}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center;">${item.residual_impact || 1}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center; font-weight:bold; background:${resInfo.bg}; color:${resInfo.color};">${item.residual_risk_level || 1}</td>
        <td style="border:1px solid #999; padding:5px; text-align:center; font-weight:bold;">${item.status || 'Open'}</td>
        <td style="border:1px solid #999; padding:5px;">${item.follow_up_progress || '-'}</td>
      </tr>
    `
  }).join('')

  const docHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>2.2 Risk Register - ทะเบียนความเสี่ยง</title>
      <style>
        body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 10pt; }
        table { border-collapse: collapse; width: 100%; }
        th { background: #f1f5f9; font-weight: bold; border: 1px solid #999; padding: 4px; font-size: 8.5pt; text-align:center; }
        td { border: 1px solid #999; padding: 4px; font-size: 8.5pt; }
      </style>
    </head>
    <body>
      <div style="text-align:center; margin-bottom:16px;">
        <img src="${LOGO_MOPH_BASE64}" width="70" height="70" /><br>
        <h2 style="margin:4px 0;">ทะเบียนความเสี่ยงด้านความมั่นคงปลอดภัยไซเบอร์ (Risk Register)</h2>
        <h3 style="margin:2px 0; color:#334155;">2.2 Risk Register - สำนักงานสาธารณสุขจังหวัดสระแก้ว</h3>
      </div>

      <div style="margin-bottom:14px; font-size:9.5pt; border:1px solid #cbd5e1; padding:10px; background:#f8fafc;">
        <p style="margin:3px 0;"><strong>ผู้พิจารณาประเมิน :</strong> ${header.evaluator || '-'}</p>
        <p style="margin:3px 0;"><strong>ผู้บันทึก :</strong> ${header.recorder || '-'} | <strong>ประจำเดือน/รอบ :</strong> ${header.period_month || '-'}</p>
        <p style="margin:3px 0;"><strong>วันที่ประชุมความเสี่ยงพร้อมบันทึก :</strong> ${header.meeting_date || '-'}</p>
        <p style="margin:3px 0;"><strong>สถานที่ :</strong> ${header.location || '-'} | <strong>ที่อยู่ :</strong> ${header.address || '-'}</p>
        <p style="margin:3px 0;"><strong>ระบบบริการที่สำคัญ :</strong> ${header.critical_service || '-'}</p>
        <p style="margin:3px 0;"><strong>ค่าเฉลี่ยระดับความเสี่ยงขององค์กรโดยรวม :</strong> ${avgOverall} (${overallAvgInfo.label})</p>
      </div>

      <table>
        <thead>
          <tr style="background:#e2e8f0;">
            <th colspan="21" style="background:#dbeafe; color:#1e40af;">PART 1 : Risk Assessment , Record and 1st Evaluation</th>
            <th colspan="7" style="background:#dcfce7; color:#166534;">PART 2 : Treatment Plan & Risk Residual</th>
            <th colspan="2" style="background:#f3e8ff; color:#6b21a8;">PART 3 : Follow Up</th>
          </tr>
          <tr>
            <th>#</th>
            <th>วันที่</th>
            <th>กลุ่มความเสี่ยง</th>
            <th>หมวดหมู่ทรัพย์สิน/ระบบงาน</th>
            <th>ภัยคุกคาม</th>
            <th>ช่องโหว่</th>
            <th>มาตรการควบคุม</th>
            <th>C</th>
            <th>I</th>
            <th>A</th>
            <th>F</th>
            <th>S</th>
            <th>R</th>
            <th>I</th>
            <th>L</th>
            <th>O</th>
            <th>A</th>
            <th>B</th>
            <th>C=A*B</th>
            <th>เจ้าของ</th>
            <th>Avg Cluster</th>
            <th>ทางเลือกจัดการ</th>
            <th>แผนการจัดการความเสี่ยง</th>
            <th>% สำเร็จ</th>
            <th>กำหนดเสร็จ</th>
            <th>Res A</th>
            <th>Res B</th>
            <th>Res C</th>
            <th>สถานะ</th>
            <th>ความคืบหน้า</th>
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
  a.download = `2.2_Risk_Register_สสจ_สระแก้ว_${Date.now()}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportRiskRegisterCsv(registerData = {}) {
  const items = registerData.items || DEFAULT_RISK_REGISTER_ITEMS
  const clusterAverages = calculateClusterAverages(items)

  const headers = [
    'No.', 'Date Identified', 'Risk Category', 'Asset Group / System',
    'Threat', 'Vulnerability', 'Existing Controls',
    'CIA_C', 'CIA_I', 'CIA_A',
    'Sev_F', 'Sev_S', 'Sev_R', 'Sev_I', 'Sev_L', 'Sev_O',
    'Likelihood (A)', 'Impact (B)', 'Risk Level (C=A*B)', 'Risk Owner', 'Cluster Avg Score',
    'Treatment Option', 'Treatment Plan', 'Progress %', 'Expected Finish Date',
    'Residual Likelihood', 'Residual Impact', 'Residual Risk Level',
    'Status', 'Follow Up Progress'
  ]

  const rows = items.map((item, idx) => {
    const cia = item.impact_cia || {}
    const fsr = item.severity_fsrilo || {}
    const cStat = clusterAverages[item.category] || { avgScore: '' }

    return [
      idx + 1,
      `"${(item.date_identified || '').replace(/"/g, '""')}"`,
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${(item.system || '').replace(/"/g, '""')}"`,
      `"${(item.threat || '').replace(/"/g, '""')}"`,
      `"${(item.vulnerability || '').replace(/"/g, '""')}"`,
      `"${(item.existing_controls || '').replace(/"/g, '""')}"`,
      cia.c ? '1' : '0',
      cia.i ? '1' : '0',
      cia.a ? '1' : '0',
      fsr.f ? '1' : '0',
      fsr.s ? '1' : '0',
      fsr.r ? '1' : '0',
      fsr.i ? '1' : '0',
      fsr.l ? '1' : '0',
      fsr.o ? '1' : '0',
      item.likelihood || 1,
      item.impact || 1,
      item.risk_level || 1,
      `"${(item.risk_owner || '').replace(/"/g, '""')}"`,
      cStat.avgScore || '',
      `"${(item.treatment_option || '').replace(/"/g, '""')}"`,
      `"${(item.treatment_plan || '').replace(/"/g, '""')}"`,
      item.progress_percent || 0,
      `"${(item.expected_finish_date || '').replace(/"/g, '""')}"`,
      item.residual_likelihood || 1,
      item.residual_impact || 1,
      item.residual_risk_level || 1,
      `"${(item.status || 'Open').replace(/"/g, '""')}"`,
      `"${(item.follow_up_progress || '').replace(/"/g, '""')}"`
    ]
  })

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `2.2_Risk_Register_สสจ_สระแก้ว_${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 9. Event Binder
export function bindRiskRegisterEvents(el, registerData, onAction) {
  if (!el) return

  // Export Word
  const btnExportWord = el.querySelector('#btn-export-rr-word')
  if (btnExportWord) {
    btnExportWord.onclick = () => exportRiskRegisterWord(registerData)
  }

  // Export CSV
  const btnExportCsv = el.querySelector('#btn-export-rr-csv')
  if (btnExportCsv) {
    btnExportCsv.onclick = () => exportRiskRegisterCsv(registerData)
  }

  // Sub-tab switching
  el.querySelectorAll('.rr-subtab-btn').forEach(btn => {
    btn.onclick = () => {
      onAction({ type: 'change_subtab', subtab: btn.dataset.subtab })
    }
  })

  // View Mode switching
  el.querySelectorAll('.btn-mode-rr').forEach(btn => {
    btn.onclick = () => {
      onAction({ type: 'change_view_mode', mode: btn.dataset.mode })
    }
  })

  // Cluster filter
  const selCluster = el.querySelector('#select-cluster-filter-rr')
  if (selCluster) {
    selCluster.onchange = (e) => {
      onAction({ type: 'filter_cluster', cluster: e.target.value })
    }
  }

  // Search input
  const inputSearch = el.querySelector('#input-search-rr')
  if (inputSearch) {
    inputSearch.oninput = (e) => {
      onAction({ type: 'search_query', query: e.target.value })
    }
  }

  // Reset default
  const btnReset = el.querySelector('#btn-reset-rr-default')
  if (btnReset) {
    btnReset.onclick = () => {
      if (confirm('ยืนยันการรีเซ็ตข้อมูลทะเบียนความเสี่ยงเป็นค่าเริ่มต้นจากเอกสารจริงหรือไม่?')) {
        onAction({ type: 'reset_default' })
      }
    }
  }

  // Print
  const btnPrint = el.querySelector('#btn-print-rr')
  if (btnPrint) {
    btnPrint.onclick = () => window.print()
  }

  // Edit Header
  const btnEditHeader = el.querySelector('#btn-edit-rr-header')
  if (btnEditHeader) {
    btnEditHeader.onclick = () => {
      openHeaderModal(registerData.header || DEFAULT_RISK_REGISTER_HEADER, onAction)
    }
  }

  // Add Item
  const btnAddItem = el.querySelector('#btn-add-rr-item')
  if (btnAddItem) {
    btnAddItem.onclick = () => {
      openItemModal(null, onAction)
    }
  }

  // Edit Item
  el.querySelectorAll('.btn-edit-rr-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      const item = (registerData.items || []).find(i => i.id === id)
      if (item) openItemModal(item, onAction)
    }
  })

  // Delete Item
  el.querySelectorAll('.btn-del-rr-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      if (confirm('ยืนยันการลบรายการความเสี่ยงนี้ออกจากทะเบียนหรือไม่?')) {
        onAction({ type: 'delete_item', id })
      }
    }
  })

  // Add Log
  const btnAddLog = el.querySelector('#btn-add-rr-log')
  if (btnAddLog) {
    btnAddLog.onclick = () => {
      const detail = prompt('กรอกรายละเอียดสิ่งที่ปรับปรุง / แก้ไข:')
      if (detail && detail.trim()) {
        const todayStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
        onAction({ type: 'add_log', date: todayStr, detail: detail.trim() })
      }
    }
  }

  // Edit Log
  el.querySelectorAll('.btn-edit-rr-log').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      const log = (registerData.logs || []).find(l => l.id === id)
      if (log) {
        const newDetail = prompt('แก้ไขรายละเอียดสิ่งที่ปรับปรุง:', log.detail)
        if (newDetail && newDetail.trim()) {
          onAction({ type: 'edit_log', id, detail: newDetail.trim() })
        }
      }
    }
  })

  // Delete Log
  el.querySelectorAll('.btn-del-rr-log').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      if (confirm('ยืนยันการลบบันทึกประวัตินี้หรือไม่?')) {
        onAction({ type: 'delete_log', id })
      }
    }
  })
}

// Modal: แก้ไขส่วนหัว
function openHeaderModal(header, onAction) {
  let modalEl = document.getElementById('rr-header-modal')
  if (!modalEl) {
    modalEl = document.createElement('div')
    modalEl.id = 'rr-header-modal'
    document.body.appendChild(modalEl)
  }

  modalEl.innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px;">
      <div style="background:#fff; border-radius:12px; width:100%; max-width:550px; box-shadow:0 10px 25px rgba(0,0,0,0.2); overflow:hidden; font-family:'Sarabun',sans-serif;">
        <div style="padding:16px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:16px; font-weight:800; color:#0f172a;">✏️ แก้ไขข้อมูลส่วนหัว (Risk Register Header)</h3>
          <button id="close-modal-header" style="border:none; background:transparent; font-size:20px; color:#94a3b8; cursor:pointer;">&times;</button>
        </div>
        <div style="padding:20px; max-height:80vh; overflow-y:auto; font-size:13px; display:flex; flex-direction:column; gap:12px;">
          <div>
            <label style="font-weight:700; color:#475569; display:block; margin-bottom:4px;">ผู้บันทึก:</label>
            <input type="text" id="m-rr-recorder" class="form-control" value="${header.recorder || ''}" style="font-size:13px;">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-weight:700; color:#475569; display:block; margin-bottom:4px;">ประจำเดือน:</label>
              <input type="text" id="m-rr-month" class="form-control" value="${header.record_month || ''}" style="font-size:13px;">
            </div>
            <div>
              <label style="font-weight:700; color:#475569; display:block; margin-bottom:4px;">วันที่ประชุมพร้อมบันทึก:</label>
              <input type="text" id="m-rr-date" class="form-control" value="${header.meeting_date || ''}" style="font-size:13px;">
            </div>
          </div>
          <div>
            <label style="font-weight:700; color:#475569; display:block; margin-bottom:4px;">สถานที่:</label>
            <input type="text" id="m-rr-loc" class="form-control" value="${header.location || ''}" style="font-size:13px;">
          </div>
          <div>
            <label style="font-weight:700; color:#475569; display:block; margin-bottom:4px;">ที่อยู่:</label>
            <textarea id="m-rr-addr" class="form-control" rows="2" style="font-size:13px;">${header.address || ''}</textarea>
          </div>
          <div>
            <label style="font-weight:700; color:#475569; display:block; margin-bottom:4px;">ระบบบริการที่สำคัญ:</label>
            <input type="text" id="m-rr-service" class="form-control" value="${header.critical_service || ''}" style="font-size:13px;">
          </div>
        </div>
        <div style="padding:12px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:8px;">
          <button id="cancel-modal-header" class="btn btn-sm btn-outline-secondary" style="font-size:12.5px;">ยกเลิก</button>
          <button id="save-modal-header" class="btn btn-sm btn-primary" style="font-size:12.5px; font-weight:700; background:#2563eb; border:none;">💾 บันทึกส่วนหัว</button>
        </div>
      </div>
    </div>
  `

  const close = () => { modalEl.innerHTML = '' }
  modalEl.querySelector('#close-modal-header').onclick = close
  modalEl.querySelector('#cancel-modal-header').onclick = close
  modalEl.querySelector('#save-modal-header').onclick = () => {
    const updated = {
      ...header,
      recorder: modalEl.querySelector('#m-rr-recorder').value,
      record_month: modalEl.querySelector('#m-rr-month').value,
      meeting_date: modalEl.querySelector('#m-rr-date').value,
      location: modalEl.querySelector('#m-rr-loc').value,
      address: modalEl.querySelector('#m-rr-addr').value,
      critical_service: modalEl.querySelector('#m-rr-service').value
    }
    onAction({ type: 'update_header', header: updated })
    close()
  }
}

// Modal: เพิ่ม / แก้ไข รายการความเสี่ยง (Full 3-Part Form)
function openItemModal(item, onAction) {
  const isEdit = Boolean(item)
  const it = item || {
    id: 'rr_item_' + Date.now(),
    date_identified: '25 ก.พ. 69',
    category: 'Operational',
    system: '',
    threat: '',
    vulnerability: '',
    existing_controls: '',
    impact_cia: { c: false, i: false, a: false },
    severity_fsrilo: { f: false, s: false, r: false, i: false, l: false, o: false },
    likelihood: 1,
    impact: 1,
    risk_level: 1,
    risk_owner: 'ผู้อำนวยการฝ่ายบำรุงรักษาระบบเทคโนโลยีสารสนเทศ',
    treatment_option: 'Mitigate Risk',
    treatment_plan: '',
    sub_actions: [],
    progress_percent: 0,
    expected_finish_date: '30 ก.ย. 69',
    residual_cia: { c: false, i: false, a: false },
    residual_fsrilo: { f: false, s: false, r: false, i: false, l: false, o: false },
    residual_likelihood: 1,
    residual_impact: 1,
    residual_risk_level: 1,
    status: 'Open',
    follow_up_progress: 'ยังไม่ได้ดำเนินการ'
  }

  let modalEl = document.getElementById('rr-item-modal')
  if (!modalEl) {
    modalEl = document.createElement('div')
    modalEl.id = 'rr-item-modal'
    document.body.appendChild(modalEl)
  }

  modalEl.innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.65); z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px;">
      <div style="background:#fff; border-radius:12px; width:100%; max-width:850px; max-height:92vh; display:flex; flex-direction:column; box-shadow:0 10px 30px rgba(0,0,0,0.25); overflow:hidden; font-family:'Sarabun',sans-serif;">
        <!-- Modal Header -->
        <div style="padding:14px 20px; background:#0f172a; color:#fff; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:16px; font-weight:800; color:#38bdf8;">
            ${isEdit ? '✏️ แก้ไขรายการความเสี่ยงในทะเบียน' : '➕ เพิ่มรายการความเสี่ยงใหม่'}
          </h3>
          <button id="close-item-modal" style="border:none; background:transparent; font-size:22px; color:#94a3b8; cursor:pointer;">&times;</button>
        </div>

        <!-- Modal Body (3 PART Form) -->
        <div style="padding:20px; overflow-y:auto; font-size:13px; display:flex; flex-direction:column; gap:18px;">
          
          <!-- PART 1 -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:16px;">
            <div style="font-weight:800; font-size:13.5px; color:#0369a1; margin-bottom:12px; border-bottom:1px solid #cbd5e1; padding-bottom:6px;">
              PART 1 : Risk Assessment, Record and 1st Evaluation
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-weight:700; color:#475569;">วันที่ระบุความเสี่ยง:</label>
                <input type="text" id="f-rr-date" class="form-control form-control-sm" value="${it.date_identified || ''}">
              </div>
              <div>
                <label style="font-weight:700; color:#475569;">กลุ่มความเสี่ยง (Cluster):</label>
                <select id="f-rr-category" class="form-select form-select-sm">
                  ${RISK_REGISTER_CLUSTERS.map(c => `
                    <option value="${c}" ${(it.category || '').toLowerCase() === c.toLowerCase() ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
              </div>
              <div>
                <label style="font-weight:700; color:#475569;">ระบบงาน (System / Asset):</label>
                <input type="text" id="f-rr-system" class="form-control form-control-sm" value="${it.system || ''}" placeholder="เช่น โปรแกรมระบบงานบุคคลเก่า">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-weight:700; color:#475569;">ภัยคุกคาม (Threat):</label>
                <textarea id="f-rr-threat" class="form-control form-control-sm" rows="2">${it.threat || ''}</textarea>
              </div>
              <div>
                <label style="font-weight:700; color:#475569;">ช่องโหว่ (Vulnerability):</label>
                <textarea id="f-rr-vulner" class="form-control form-control-sm" rows="2">${it.vulnerability || ''}</textarea>
              </div>
            </div>

            <div style="margin-bottom:12px;">
              <label style="font-weight:700; color:#475569;">มาตรการควบคุมในปัจจุบัน:</label>
              <textarea id="f-rr-controls" class="form-control form-control-sm" rows="2">${it.existing_controls || ''}</textarea>
            </div>

            <!-- Checkboxes CIA & FSRILO -->
            <div style="display:grid; grid-template-columns:1fr 2fr; gap:12px; margin-bottom:14px; background:#fff; padding:10px; border-radius:6px; border:1px solid #e2e8f0;">
              <div>
                <label style="font-weight:700; color:#0369a1; display:block; margin-bottom:6px;">กระทบต่อ (CIA):</label>
                <div style="display:flex; gap:12px;">
                  <label><input type="checkbox" id="f-rr-c" ${it.impact_cia?.c ? 'checked' : ''}> C</label>
                  <label><input type="checkbox" id="f-rr-i" ${it.impact_cia?.i ? 'checked' : ''}> I</label>
                  <label><input type="checkbox" id="f-rr-a" ${it.impact_cia?.a ? 'checked' : ''}> A</label>
                </div>
              </div>
              <div>
                <label style="font-weight:700; color:#92400e; display:block; margin-bottom:6px;">ความรุนแรงแต่ละด้าน (FSRILO):</label>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                  <label><input type="checkbox" id="f-rr-f" ${it.severity_fsrilo?.f ? 'checked' : ''}> F (การเงิน)</label>
                  <label><input type="checkbox" id="f-rr-s" ${it.severity_fsrilo?.s ? 'checked' : ''}> S (ปลอดภัย)</label>
                  <label><input type="checkbox" id="f-rr-r" ${it.severity_fsrilo?.r ? 'checked' : ''}> R (ชื่อเสียง)</label>
                  <label><input type="checkbox" id="f-rr-i2" ${it.severity_fsrilo?.i ? 'checked' : ''}> I (โครงสร้าง)</label>
                  <label><input type="checkbox" id="f-rr-l" ${it.severity_fsrilo?.l ? 'checked' : ''}> L (กฎหมาย)</label>
                  <label><input type="checkbox" id="f-rr-o" ${it.severity_fsrilo?.o ? 'checked' : ''}> O (การดำเนินงาน)</label>
                </div>
              </div>
            </div>

            <!-- Scores & Owner -->
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr 2fr; gap:10px; align-items:center;">
              <div>
                <label style="font-weight:700; color:#475569;">A (โอกาสเกิด 1-5):</label>
                <select id="f-rr-lh" class="form-select form-select-sm">
                  ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${it.likelihood === v ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="font-weight:700; color:#475569;">B (ความรุนแรง 1-5):</label>
                <select id="f-rr-imp" class="form-select form-select-sm">
                  ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${it.impact === v ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="font-weight:700; color:#dc2626;">C = A*B ระดับความเสี่ยง:</label>
                <input type="text" id="f-rr-score" class="form-control form-control-sm" readonly style="font-weight:800; text-align:center; background:#fee2e2; color:#991b1b;" value="${it.risk_level || (it.likelihood * it.impact)}">
              </div>
              <div>
                <label style="font-weight:700; color:#475569;">เจ้าของความเสี่ยง (Risk Owner):</label>
                <input type="text" id="f-rr-owner" class="form-control form-control-sm" value="${it.risk_owner || ''}">
              </div>
            </div>
          </div>

          <!-- PART 2 -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px;">
            <div style="font-weight:800; font-size:13.5px; color:#166534; margin-bottom:12px; border-bottom:1px solid #bbf7d0; padding-bottom:6px;">
              PART 2 : Risk Treatment Plan & Risk Residual
            </div>
            <div style="display:grid; grid-template-columns:1fr 2fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-weight:700; color:#475569;">ตัวเลือกการตอบสนอง:</label>
                <select id="f-rr-treatment-opt" class="form-select form-select-sm">
                  <option value="Mitigate Risk" ${it.treatment_option === 'Mitigate Risk' ? 'selected' : ''}>Mitigate Risk (ลดความเสี่ยง)</option>
                  <option value="Continue Monitoring" ${it.treatment_option === 'Continue Monitoring' ? 'selected' : ''}>Continue Monitoring (เฝ้าระวังต่อเนื่อง)</option>
                  <option value="Avoid Risk" ${it.treatment_option === 'Avoid Risk' ? 'selected' : ''}>Avoid Risk (หลีกเลี่ยงความเสี่ยง)</option>
                  <option value="Transfer Risk" ${it.treatment_option === 'Transfer Risk' ? 'selected' : ''}>Transfer Risk (ถ่ายโอนความเสี่ยง/ประกัน)</option>
                  <option value="Accept Risk" ${it.treatment_option === 'Accept Risk' ? 'selected' : ''}>Accept Risk (ยอมรับความเสี่ยง)</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; color:#475569;">แผนจัดการความเสี่ยง (Treatment Plan):</label>
                <input type="text" id="f-rr-treatment-plan" class="form-control form-control-sm" value="${it.treatment_plan || ''}">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
              <div>
                <label style="font-weight:700; color:#475569;">ความคืบหน้า (%):</label>
                <input type="number" id="f-rr-progress-pct" class="form-control form-control-sm" min="0" max="100" value="${it.progress_percent || 0}">
              </div>
              <div>
                <label style="font-weight:700; color:#475569;">คาดว่าดำเนินการแล้วเสร็จ:</label>
                <input type="text" id="f-rr-exp-date" class="form-control form-control-sm" value="${it.expected_finish_date || ''}">
              </div>
            </div>

            <!-- Residual Scores -->
            <div style="background:#fff; border:1px solid #bbf7d0; border-radius:6px; padding:10px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; align-items:center;">
              <div>
                <label style="font-weight:700; color:#166534;">A คงเหลือ (1-5):</label>
                <select id="f-rr-res-lh" class="form-select form-select-sm">
                  ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${it.residual_likelihood === v ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="font-weight:700; color:#166534;">B คงเหลือ (1-5):</label>
                <select id="f-rr-res-imp" class="form-select form-select-sm">
                  ${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${it.residual_impact === v ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="font-weight:700; color:#166534;">ระดับความเสี่ยงคงเหลือ:</label>
                <input type="text" id="f-rr-res-score" class="form-control form-control-sm" readonly style="font-weight:800; text-align:center; background:#dcfce7; color:#166534;" value="${it.residual_risk_level || (it.residual_likelihood * it.residual_impact)}">
              </div>
            </div>
          </div>

          <!-- PART 3 -->
          <div style="background:#eef2ff; border:1px solid #c7d2fe; border-radius:8px; padding:16px;">
            <div style="font-weight:800; font-size:13.5px; color:#3730a3; margin-bottom:12px; border-bottom:1px solid #c7d2fe; padding-bottom:6px;">
              PART 3 : Follow Up
            </div>
            <div style="display:grid; grid-template-columns:1fr 2fr; gap:12px;">
              <div>
                <label style="font-weight:700; color:#475569;">สถานะ (Status):</label>
                <select id="f-rr-status" class="form-select form-select-sm">
                  <option value="Open" ${it.status === 'Open' ? 'selected' : ''}>Open</option>
                  <option value="In Progress" ${it.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Closed" ${it.status === 'Closed' ? 'selected' : ''}>Closed</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; color:#475569;">สถานะความคืบหน้า (รายละเอียด):</label>
                <input type="text" id="f-rr-follow-detail" class="form-control form-control-sm" value="${it.follow_up_progress || ''}">
              </div>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div style="padding:12px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:8px;">
          <button id="cancel-item-modal" class="btn btn-sm btn-outline-secondary" style="font-size:12.5px;">ยกเลิก</button>
          <button id="save-item-modal" class="btn btn-sm btn-primary" style="font-size:12.5px; font-weight:700; background:#2563eb; border:none;">💾 บันทึกรายการ</button>
        </div>
      </div>
    </div>
  `

  const close = () => { modalEl.innerHTML = '' }
  modalEl.querySelector('#close-item-modal').onclick = close
  modalEl.querySelector('#cancel-item-modal').onclick = close

  // Auto calculate scores
  const recalcP1 = () => {
    const l = Number(modalEl.querySelector('#f-rr-lh').value) || 1
    const i = Number(modalEl.querySelector('#f-rr-imp').value) || 1
    modalEl.querySelector('#f-rr-score').value = l * i
  }
  modalEl.querySelector('#f-rr-lh').onchange = recalcP1
  modalEl.querySelector('#f-rr-imp').onchange = recalcP1

  const recalcP2 = () => {
    const l = Number(modalEl.querySelector('#f-rr-res-lh').value) || 1
    const i = Number(modalEl.querySelector('#f-rr-res-imp').value) || 1
    modalEl.querySelector('#f-rr-res-score').value = l * i
  }
  modalEl.querySelector('#f-rr-res-lh').onchange = recalcP2
  modalEl.querySelector('#f-rr-res-imp').onchange = recalcP2

  modalEl.querySelector('#save-item-modal').onclick = () => {
    const sys = modalEl.querySelector('#f-rr-system').value.trim()
    if (!sys) {
      alert('กรุณากรอกชื่อระบบงาน (System / Asset)')
      return
    }

    const lh1 = Number(modalEl.querySelector('#f-rr-lh').value) || 1
    const imp1 = Number(modalEl.querySelector('#f-rr-imp').value) || 1
    const lh2 = Number(modalEl.querySelector('#f-rr-res-lh').value) || 1
    const imp2 = Number(modalEl.querySelector('#f-rr-res-imp').value) || 1

    const updatedItem = {
      ...it,
      date_identified: modalEl.querySelector('#f-rr-date').value.trim(),
      category: modalEl.querySelector('#f-rr-category').value,
      system: sys,
      threat: modalEl.querySelector('#f-rr-threat').value.trim(),
      vulnerability: modalEl.querySelector('#f-rr-vulner').value.trim(),
      existing_controls: modalEl.querySelector('#f-rr-controls').value.trim(),
      impact_cia: {
        c: modalEl.querySelector('#f-rr-c').checked,
        i: modalEl.querySelector('#f-rr-i').checked,
        a: modalEl.querySelector('#f-rr-a').checked
      },
      severity_fsrilo: {
        f: modalEl.querySelector('#f-rr-f').checked,
        s: modalEl.querySelector('#f-rr-s').checked,
        r: modalEl.querySelector('#f-rr-r').checked,
        i: modalEl.querySelector('#f-rr-i2').checked,
        l: modalEl.querySelector('#f-rr-l').checked,
        o: modalEl.querySelector('#f-rr-o').checked
      },
      likelihood: lh1,
      impact: imp1,
      risk_level: lh1 * imp1,
      risk_owner: modalEl.querySelector('#f-rr-owner').value.trim(),
      treatment_option: modalEl.querySelector('#f-rr-treatment-opt').value,
      treatment_plan: modalEl.querySelector('#f-rr-treatment-plan').value.trim(),
      progress_percent: Number(modalEl.querySelector('#f-rr-progress-pct').value) || 0,
      expected_finish_date: modalEl.querySelector('#f-rr-exp-date').value.trim(),
      residual_likelihood: lh2,
      residual_impact: imp2,
      residual_risk_level: lh2 * imp2,
      status: modalEl.querySelector('#f-rr-status').value,
      follow_up_progress: modalEl.querySelector('#f-rr-follow-detail').value.trim()
    }

    if (isEdit) {
      onAction({ type: 'update_item', item: updatedItem })
    } else {
      onAction({ type: 'add_item', item: updatedItem })
    }
    close()
  }
}
