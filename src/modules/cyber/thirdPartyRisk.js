// โมดูล 4.5 การประเมินความเสี่ยงที่เกี่ยวข้องกับบริการและห่วงโซ่อุปทานผลิตภัณฑ์ (3rd party - Zero Trust)
// สำนักงานสาธารณสุขจังหวัดสระแก้ว
// รองรับ 3 แถบย่อย: ประเมินความเสี่ยง 3rd Party, Update Log, Risk Criteria พร้อมระบบ Multi-vendor, Table/Card View, Modal และ Supabase Sync

import {
  DEFAULT_THIRD_PARTY_HEADER,
  DEFAULT_THIRD_PARTY_LOGS,
  DEFAULT_THIRD_PARTY_ITEMS,
  DEFAULT_THIRD_PARTY_PROFILES,
  THIRD_PARTY_CLUSTERS,
  THIRD_PARTY_CRITERIA_DATA,
  getThirdPartyRiskLevelInfo,
  getThirdPartyClusterAvgInfo,
  calculateThirdPartyMetrics
} from './thirdPartyRiskData.js'
import { supabase } from '../../lib/supabase.js'
import { showNotification } from '../../lib/utils.js'
import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'

// 1. Main Render Function
export function renderThirdPartyRiskHtml(
  profiles = DEFAULT_THIRD_PARTY_PROFILES,
  activeVendorId = 'vendor_meeple',
  activeSubTab = 'assess',
  clusterFilter = 'all',
  searchQuery = '',
  viewMode = 'table',
  matrixFilter = null
) {
  // Ensure profile exists
  let currentProfile = profiles.find(p => p.id === activeVendorId)
  if (!currentProfile) {
    currentProfile = profiles[0] || DEFAULT_THIRD_PARTY_PROFILES[0]
  }

  const header = currentProfile.header || DEFAULT_THIRD_PARTY_HEADER
  const logs = currentProfile.logs || DEFAULT_THIRD_PARTY_LOGS
  const allItems = currentProfile.items || DEFAULT_THIRD_PARTY_ITEMS

  // Filter items
  const filteredItems = allItems.filter(item => {
    const matchCluster = clusterFilter === 'all' || String(item.cluster_id) === String(clusterFilter)
    const matchMatrix = !matrixFilter || (
      Number(item.likelihood) === Number(matrixFilter.likelihood) &&
      Number(item.impact) === Number(matrixFilter.impact)
    )
    const q = searchQuery.toLowerCase().trim()
    const matchSearch = !q ||
      (item.title || '').toLowerCase().includes(q) ||
      (item.threat || '').toLowerCase().includes(q) ||
      (item.vulnerability || '').toLowerCase().includes(q) ||
      (item.treatment_plan || '').toLowerCase().includes(q) ||
      (item.responsible_person || '').toLowerCase().includes(q) ||
      (item.item_no || '').toLowerCase().includes(q)

    return matchCluster && matchMatrix && matchSearch
  })

  // Metrics
  const metrics = calculateThirdPartyMetrics(allItems)

  return `
    <div style="font-family:'Sarabun',-apple-system,sans-serif; color:#1e293b; max-width:1450px; margin:0 auto; padding-bottom:60px;">
      
      <!-- Top Navigation Sub-Tabs & Vendor Selector -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #e2e8f0; padding-bottom:12px; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <button class="btn tpr-subtab-btn ${activeSubTab === 'assess' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="assess" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>🛡️</span> ประเมินความเสี่ยง 3rd Party (3rd party - Zero Trust)
            <span class="badge" style="background:#2563eb; color:#fff; border-radius:999px; padding:2px 7px; font-size:11px;">${allItems.length} ข้อ</span>
          </button>
          <button class="btn tpr-subtab-btn ${activeSubTab === 'log' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="log" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>📝</span> ประวัติการปรับปรุง (Update Log)
            <span class="badge" style="background:#64748b; color:#fff; border-radius:999px; padding:2px 7px; font-size:11px;">${logs.length}</span>
          </button>
          <button class="btn tpr-subtab-btn ${activeSubTab === 'criteria' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="criteria" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>📊</span> เกณฑ์การประเมิน (Risk Criteria & Matrix)
          </button>
        </div>

        <!-- Vendor Profile Selector -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:6px; background:#f1f5f9; padding:4px 10px; border-radius:8px; border:1px solid #cbd5e1;">
            <span style="font-size:12px; font-weight:700; color:#475569;">🏢 ผู้ให้บริการ:</span>
            <select id="select-tpr-vendor" class="form-select form-select-sm" style="font-size:12.5px; font-weight:600; min-width:200px; padding:4px 8px; border-radius:6px; border:1px solid #94a3b8; background:#fff;">
              ${profiles.map(p => `
                <option value="${p.id}" ${p.id === activeVendorId ? 'selected' : ''}>
                  ${p.vendor_name || p.header?.vendor_name || 'ไม่ระบุชื่อ'}
                </option>
              `).join('')}
            </select>
          </div>
          <button id="btn-add-tpr-vendor" class="btn btn-sm btn-outline-primary" style="font-size:12px; font-weight:700; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:4px;" title="สร้างชุดประเมินสำหรับบริษัทอื่น">
            <span>+</span> บริษัทใหม่
          </button>
          ${profiles.length > 1 ? `
            <button id="btn-del-tpr-vendor" class="btn btn-sm btn-outline-danger" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 10px;" title="ลบชุดประเมินบริษัทนี้">
              🗑️ ลบ
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Tab Content Rendering -->
      ${activeSubTab === 'assess' ? renderAssessTabContent(header, filteredItems, metrics, clusterFilter, searchQuery, viewMode, matrixFilter, allItems.length, currentProfile) : ''}
      ${activeSubTab === 'log' ? renderUpdateLogTabContent(logs) : ''}
      ${activeSubTab === 'criteria' ? renderCriteriaTabContent() : ''}

    </div>
  `
}

// 2. Assess Tab Content
function renderAssessTabContent(header, filteredItems, metrics, clusterFilter, searchQuery, viewMode, matrixFilter, totalItemsCount, profile) {
  return `
    <!-- Header Card -->
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:20px 24px; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05); position:relative;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; gap:16px; align-items:flex-start;">
          <div style="padding:10px; background:#eff6ff; border-radius:10px; border:1px solid #bfdbfe;">
            <img src="${LOGO_MOPH_BASE64}" alt="MOPH Logo" style="width:48px; height:48px; object-fit:contain;" />
          </div>
          <div>
            <div style="display:inline-block; font-size:11.5px; font-weight:800; color:#1d4ed8; background:#dbeafe; padding:2px 8px; border-radius:4px; margin-bottom:4px;">
              4.5 Risk Assessment for Services & Product Supply Chain (3rd Party - Zero Trust)
            </div>
            <h1 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0 0 6px 0;">
              การประเมินความเสี่ยงของบุคคลภายนอก (3rd Party Risk Assessment)
            </h1>
            <div style="font-size:13.5px; color:#334155; line-height:1.6;">
              <div><strong>🏢 ชื่อบุคคล/องค์กรภายนอก:</strong> <span style="font-weight:700; color:#2563eb; font-size:14.5px;">${header.vendor_name || '-'}</span></div>
              <div><strong>🛡️ ระบบบริการที่สำคัญ:</strong> <span style="font-weight:600; color:#0f172a;">${header.critical_service || '-'}</span></div>
              <div style="color:#64748b; font-size:12.5px; margin-top:2px;">
                <span><strong>ผู้พิจารณาประเมิน:</strong> ${header.evaluator || '-'}</span> | 
                <span><strong>ผู้บันทึก:</strong> ${header.recorder || '-'}</span> | 
                <span><strong>วันที่ประชุม:</strong> ${header.meeting_date || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
          <button id="btn-edit-tpr-header" class="btn btn-sm btn-outline-secondary" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:5px; background:#f8fafc;">
            <span>✏️</span> แก้ไขข้อมูลส่วนหัว/ผู้ให้บริการ
          </button>
          <div style="display:flex; gap:10px; margin-top:4px;">
            <div style="text-align:right; padding:6px 12px; background:${metrics.overallAvgInfo.bg}; border-radius:8px; border:1px solid ${metrics.overallAvgInfo.color};">
              <div style="font-size:11px; color:#64748b; font-weight:600;">ค่าเฉลี่ยความเสี่ยงก่อนจัดการ</div>
              <div style="font-size:18px; font-weight:800; color:${metrics.overallAvgInfo.color};">${metrics.overallAvg} (${metrics.overallAvgInfo.label})</div>
            </div>
            <div style="text-align:right; padding:6px 12px; background:${metrics.residualAvgInfo.bg}; border-radius:8px; border:1px solid ${metrics.residualAvgInfo.color};">
              <div style="font-size:11px; color:#64748b; font-weight:600;">ค่าเฉลี่ยคงเหลือหลังจัดการ</div>
              <div style="font-size:18px; font-weight:800; color:${metrics.residualAvgInfo.color};">${metrics.residualAvg} (${metrics.residualAvgInfo.label})</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Dashboard Cards -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px; margin-bottom:20px;">
      <div style="background:#ffffff; padding:14px 16px; border-radius:10px; border:1px solid #e2e8f0; box-shadow:0 1px 2px rgba(0,0,0,0.04);">
        <div style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase;">จำนวนประเด็นทั้งหมด</div>
        <div style="font-size:24px; font-weight:800; color:#0f172a; margin-top:4px;">${totalItemsCount} <span style="font-size:12px; font-weight:500; color:#64748b;">ข้อ (10 Clusters)</span></div>
        <div style="font-size:11.5px; color:#16a34a; font-weight:600; margin-top:2px;">ครอบคลุม พรบ. และ Zero Trust</div>
      </div>

      <div style="background:#fee2e2; padding:14px 16px; border-radius:10px; border:1px solid #fca5a5;">
        <div style="font-size:11.5px; font-weight:700; color:#991b1b; text-transform:uppercase;">สูงมาก / วิกฤติ (16-25)</div>
        <div style="font-size:24px; font-weight:800; color:#991b1b; margin-top:4px;">${metrics.counts.veryHigh} <span style="font-size:12px; font-weight:500;">ข้อ</span></div>
        <div style="font-size:11px; color:#7f1d1d; margin-top:2px;">ต้องดำเนินการทันที</div>
      </div>

      <div style="background:#ffedd5; padding:14px 16px; border-radius:10px; border:1px solid #fdba74;">
        <div style="font-size:11.5px; font-weight:700; color:#9a3412; text-transform:uppercase;">ความเสี่ยงสูง (11-15)</div>
        <div style="font-size:24px; font-weight:800; color:#9a3412; margin-top:4px;">${metrics.counts.high} <span style="font-size:12px; font-weight:500;">ข้อ</span></div>
        <div style="font-size:11px; color:#7c2d12; margin-top:2px;">ต้องมีมาตรการลดความเสี่ยง</div>
      </div>

      <div style="background:#fef9c3; padding:14px 16px; border-radius:10px; border:1px solid #fde047;">
        <div style="font-size:11.5px; font-weight:700; color:#854d0e; text-transform:uppercase;">ความเสี่ยงปานกลาง (6-10)</div>
        <div style="font-size:24px; font-weight:800; color:#854d0e; margin-top:4px;">${metrics.counts.moderate} <span style="font-size:12px; font-weight:500;">ข้อ</span></div>
        <div style="font-size:11px; color:#713f12; margin-top:2px;">ติดตามและมีมาตรการป้องกัน</div>
      </div>

      <div style="background:#dcfce7; padding:14px 16px; border-radius:10px; border:1px solid #86efac;">
        <div style="font-size:11.5px; font-weight:700; color:#166534; text-transform:uppercase;">ความเสี่ยงต่ำ (1-5)</div>
        <div style="font-size:24px; font-weight:800; color:#166534; margin-top:4px;">${metrics.counts.low} <span style="font-size:12px; font-weight:500;">ข้อ</span></div>
        <div style="font-size:11px; color:#14532d; margin-top:2px;">ติดตามเป็นระยะ</div>
      </div>

      <div style="background:#eff6ff; padding:14px 16px; border-radius:10px; border:1px solid #bfdbfe;">
        <div style="font-size:11.5px; font-weight:700; color:#1e40af; text-transform:uppercase;">ความก้าวหน้าเฉลี่ย</div>
        <div style="font-size:24px; font-weight:800; color:#1d4ed8; margin-top:4px;">${metrics.avgProgress}%</div>
        <div style="font-size:11px; color:#1e3a8a; margin-top:2px;">ตามแผนการจัดการความเสี่ยง</div>
      </div>
    </div>

    <!-- Cluster Average Risk Summary Chips -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 16px; margin-bottom:20px;">
      <div style="font-size:12px; font-weight:800; color:#334155; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;">
        <span>📌 ค่าเฉลี่ยระดับความเสี่ยงของแต่ละ Cluster (ก่อนจัดการ ➔ หลังจัดการ)</span>
        <span style="font-size:11px; font-weight:normal; color:#64748b;">คลิกเพื่อกรองเฉพาะ Cluster นั้นๆ</span>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${THIRD_PARTY_CLUSTERS.map(c => {
          const cStat = metrics.clusterAverages[c.id] || { avgScore: '0.00', avgInfo: { label: '-', bg: '#f1f5f9', color: '#475569' }, residualAvgScore: '0.00', residualAvgInfo: { label: '-', bg: '#f1f5f9', color: '#475569' } }
          const isSelected = String(clusterFilter) === String(c.id)
          return `
            <div class="btn-cluster-tag" data-cluster="${c.id}" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:8px; font-size:12px; border:${isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1'}; background:${isSelected ? '#eff6ff' : '#ffffff'}; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
              <span style="font-weight:700; color:#1e293b;">C${c.id}</span>
              <span style="color:#64748b; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${c.name}">${c.name.split('(')[0]}</span>
              <span style="font-weight:800; padding:1px 6px; border-radius:4px; font-size:11px; background:${cStat.avgInfo.bg}; color:${cStat.avgInfo.color};">${cStat.avgScore}</span>
              <span style="color:#94a3b8;">➔</span>
              <span style="font-weight:800; padding:1px 6px; border-radius:4px; font-size:11px; background:${cStat.residualAvgInfo.bg}; color:${cStat.residualAvgInfo.color};">${cStat.residualAvgScore}</span>
            </div>
          `
        }).join('')}
      </div>
    </div>

    <!-- Controls Bar -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px; background:#fff; padding:12px 16px; border-radius:10px; border:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; flex:1; max-width:700px;">
        <input type="text" id="input-search-tpr" class="form-control form-control-sm" 
          placeholder="🔍 ค้นหา ข้อ No., ภัยคุกคาม, ช่องโหว่, แผนจัดการ, ผู้รับผิดชอบ..." 
          value="${searchQuery}" 
          style="width:260px; font-size:12.5px; padding:6px 12px; border-radius:6px;" />

        <select id="select-cluster-filter-tpr" class="form-select form-select-sm" style="width:220px; font-size:12px; padding:6px 10px; border-radius:6px;">
          <option value="all" ${clusterFilter === 'all' ? 'selected' : ''}>-- ทุก Cluster (10 หมวดหมู่) --</option>
          ${THIRD_PARTY_CLUSTERS.map(c => `
            <option value="${c.id}" ${String(clusterFilter) === String(c.id) ? 'selected' : ''}>
              ${c.id}. ${c.name}
            </option>
          `).join('')}
        </select>

        ${matrixFilter ? `
          <button id="btn-clear-matrix-filter-tpr" class="btn btn-sm btn-outline-warning" style="font-size:11.5px; padding:4px 8px; border-radius:6px;">
            ✕ ล้างตัวกรอง Matrix (${matrixFilter.likelihood}x${matrixFilter.impact})
          </button>
        ` : ''}

        <div style="font-size:12px; color:#64748b; margin-left:4px;">
          แสดง <strong>${filteredItems.length}</strong> จาก ${totalItemsCount} ข้อ
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:8px;">
        <!-- View mode switcher -->
        <div class="btn-group" role="group">
          <button class="btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'} btn-mode-tpr" data-mode="table" style="font-size:12px; font-weight:600; padding:6px 12px;">
            📊 ตาราง Matrix
          </button>
          <button class="btn btn-sm ${viewMode === 'card' ? 'btn-primary' : 'btn-outline-secondary'} btn-mode-tpr" data-mode="card" style="font-size:12px; font-weight:600; padding:6px 12px;">
            🃏 การ์ด View
          </button>
        </div>

        <button id="btn-add-tpr-item" class="btn btn-sm btn-primary" style="font-size:12.5px; font-weight:700; border-radius:6px; padding:6px 14px; background:#2563eb; border:none; display:inline-flex; align-items:center; gap:4px;">
          <span>+</span> เพิ่มความเสี่ยงใหม่
        </button>
        <button id="btn-export-tpr-word" class="btn btn-sm btn-outline-primary" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:4px;">
          <span>📄</span> ส่งออก Word
        </button>
        <button id="btn-export-tpr-csv" class="btn btn-sm btn-outline-success" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:4px;">
          <span>📊</span> ส่งออก CSV
        </button>
        <button id="btn-reset-tpr-default" class="btn btn-sm btn-outline-secondary" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 10px;" title="รีเซ็ตค่าเริ่มต้นของบริษัทนี้">
          รีเซ็ต
        </button>
        <button id="btn-print-tpr" class="btn btn-sm btn-outline-dark" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:4px;">
          <span>🖨️</span> พิมพ์
        </button>
      </div>
    </div>

    <!-- Items Display (Table or Card) -->
    ${viewMode === 'table' ? renderMatrixTableView(filteredItems, metrics) : renderCardView(filteredItems, metrics)}
  `
}

// 3. Matrix Table View (Full 35 columns)
function renderMatrixTableView(items, metrics) {
  if (items.length === 0) {
    return `
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:40px; text-align:center; color:#94a3b8;">
        <div style="font-size:32px; margin-bottom:8px;">🔍</div>
        <div style="font-size:15px; font-weight:600; color:#475569;">ไม่พบรายการประเมินความเสี่ยงที่ตรงกับเงื่อนไข</div>
        <div style="font-size:13px; margin-top:4px;">ลองเปลี่ยนคำค้นหาหรือตัวกรอง Cluster</div>
      </div>
    `
  }

  return `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="overflow-x:auto; max-height:850px;">
        <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left; min-width:2600px;">
          <thead>
            <!-- Top Header Group (PART 1 & PART 2) -->
            <tr style="color:#ffffff; font-weight:800; font-size:12.5px; position:sticky; top:0; z-index:20;">
              <th colspan="17" style="background:#1e40af; padding:8px 10px; text-align:center; border:1px solid #1d4ed8;">
                PART 1 : RISK ASSESSMENT & IDENTIFICATION (การระบุและประเมินความเสี่ยงรอบแรก)
              </th>
              <th colspan="18" style="background:#15803d; padding:8px 10px; text-align:center; border:1px solid #166534;">
                PART 2 : RISK TREATMENT PLAN & RESIDUAL (แผนการจัดการความเสี่ยงและระดับความเสี่ยงคงเหลือ)
              </th>
              <th rowspan="3" style="background:#334155; padding:8px 10px; text-align:center; border:1px solid #475569; width:80px; position:sticky; right:0; z-index:21;">
                จัดการ
              </th>
            </tr>

            <!-- Second Header Level -->
            <tr style="background:#f1f5f9; color:#1e293b; font-weight:700; text-align:center; position:sticky; top:35px; z-index:20; border-bottom:1px solid #cbd5e1;">
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:55px;">No.</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:220px; text-align:left;">หมวดหมู่ความเสี่ยง (Risk Cluster)</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:220px; text-align:left;">ภัยคุกคาม (Threat)</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:220px; text-align:left;">ช่องโหว่ (Vulnerability)</th>
              <th colspan="3" style="padding:4px; border:1px solid #cbd5e1; background:#eff6ff;">กระทบต่อ</th>
              <th colspan="6" style="padding:4px; border:1px solid #cbd5e1; background:#fef3c7;">ความรุนแรงแต่ละด้าน</th>
              <th colspan="3" style="padding:4px; border:1px solid #cbd5e1; background:#fee2e2;">Risk Analysis</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:95px;">ระดับความเสี่ยงโดยเฉลี่ย<br>(Average Risk Level)</th>

              <!-- Part 2 columns -->
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:130px;">ตัวเลือกการตอบสนอง<br>(Risk Treatment)</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:260px; text-align:left;">การจัดการความเสี่ยง<br>(Risk Treatment - Threat and Vulner.)</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:110px;">ผู้รับผิดชอบ</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:90px;">สถานะความคืบหน้า<br>(Progress Status)</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:110px;">คาดว่าดำเนินการแล้วเสร็จ<br>(Expected finish date)</th>
              <th colspan="3" style="padding:4px; border:1px solid #cbd5e1; background:#f0fdf4;">กระทบต่อ</th>
              <th colspan="6" style="padding:4px; border:1px solid #cbd5e1; background:#fef9c3;">ความรุนแรงแต่ละด้าน</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:70px;">โอกาสเกิด<br>(Likelihood)</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:70px;">ความรุนแรง<br>(Impact)</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:85px;">ระดับความเสี่ยงที่คงเหลือ<br>(Risk Residual Level)</th>
              <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:220px; text-align:left;">ดำเนินการเพิ่มเติมเพื่อลดความเสี่ยงให้น้อยลงอีก<br>(Further actions to be taken to further minimize risk)</th>
            </tr>

            <!-- Third Header Level (Sub-columns) -->
            <tr style="background:#f8fafc; font-size:11px; text-align:center; color:#475569; position:sticky; top:70px; z-index:20;">
              <!-- กระทบต่อ -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Confidentiality">C</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Integrity">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Availability">A</th>
              <!-- ความรุนแรงแต่ละด้าน -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:30px;" title="Financial (B/F)">B/F</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Safety & Service">S</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Reputation">R</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Image">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Legal">L</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Other CII / System">O</th>
              <!-- Risk Analysis -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:65px;">โอกาสเกิด<br>(Likelihood)</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:65px;">ความรุนแรง<br>(Impact)</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:75px;">ระดับความเสี่ยง<br>(Risk Level)</th>

              <!-- Residual กระทบต่อ -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Confidentiality">C</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Integrity">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Availability">A</th>
              <!-- Residual ความรุนแรงแต่ละด้าน -->
              <th style="padding:4px; border:1px solid #cbd5e1; width:30px;" title="Financial (B/F)">B/F</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Safety & Service">S</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Reputation">R</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Image">I</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Legal">L</th>
              <th style="padding:4px; border:1px solid #cbd5e1; width:28px;" title="Other CII / System">O</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, idx) => {
              const cia = item.cia || {}
              const fsr = item.severity_fsrilo || {}
              const resCia = item.residual_cia || {}
              const resFsr = item.residual_severity_fsrilo || {}

              const score1 = Number(item.risk_level) || (Number(item.likelihood || 1) * Number(item.impact || 1))
              const rInfo = getThirdPartyRiskLevelInfo(score1)

              const score2 = Number(item.residual_risk_level) || (Number(item.residual_likelihood || 1) * Number(item.residual_impact || 1))
              const resInfo = getThirdPartyRiskLevelInfo(score2)

              const cStat = metrics.clusterAverages[item.cluster_id] || { avgScore: '-', avgInfo: { bg: '#fff', color: '#000' } }

              return `
                <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;" class="hover-row-tpr">
                  <!-- PART 1 -->
                  <td style="padding:8px 6px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#2563eb;">${item.item_no || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#0f172a; font-weight:600;">
                    <div style="font-size:11px; color:#64748b;">Cluster ${item.cluster_id}</div>
                    ${item.title || '-'}
                  </td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#b91c1c;">${item.threat || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#b45309;">${item.vulnerability || '-'}</td>

                  <!-- CIA -->
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${cia.c ? '#ef4444' : '#cbd5e1'};">${cia.c ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${cia.i ? '#ef4444' : '#cbd5e1'};">${cia.i ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${cia.a ? '#ef4444' : '#cbd5e1'};">${cia.a ? 'x' : '-'}</td>

                  <!-- FSRILO -->
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${fsr.f ? '#f97316' : '#cbd5e1'};">${fsr.f ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${fsr.s ? '#f97316' : '#cbd5e1'};">${fsr.s ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${fsr.r ? '#f97316' : '#cbd5e1'};">${fsr.r ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${fsr.i ? '#f97316' : '#cbd5e1'};">${fsr.i ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${fsr.l ? '#f97316' : '#cbd5e1'};">${fsr.l ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${fsr.o ? '#f97316' : '#cbd5e1'};">${fsr.o ? 'x' : '-'}</td>

                  <!-- Analysis -->
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:600;">${item.likelihood || 1}</td>
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:600;">${item.impact || 1}</td>
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; background:${rInfo.bg}; color:${rInfo.color}; border-radius:4px;">
                    ${score1}
                  </td>
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; background:${cStat.avgInfo.bg}; color:${cStat.avgInfo.color};">
                    ${cStat.avgScore}
                  </td>

                  <!-- PART 2 -->
                  <td style="padding:8px 6px; border:1px solid #e2e8f0; font-weight:600; color:#15803d; text-align:center;">${item.treatment_option || 'Mitigate Risk'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#166534; font-size:11.5px; line-height:1.4;">${item.treatment_plan || '-'}</td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#475569; text-align:center;">${item.responsible_person || '-'}</td>
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:${(item.progress_percent || 0) >= 100 ? '#16a34a' : '#2563eb'};">
                    ${item.progress_percent || 0}%
                  </td>
                  <td style="padding:8px; border:1px solid #e2e8f0; text-align:center; color:#64748b; font-size:11px;">${item.expected_finish_date || '-'}</td>

                  <!-- Residual CIA -->
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resCia.c ? '#7c3aed' : '#cbd5e1'};">${resCia.c ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resCia.i ? '#7c3aed' : '#cbd5e1'};">${resCia.i ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resCia.a ? '#7c3aed' : '#cbd5e1'};">${resCia.a ? 'x' : '-'}</td>

                  <!-- Residual FSRILO -->
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resFsr.f ? '#7c3aed' : '#cbd5e1'};">${resFsr.f ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resFsr.s ? '#7c3aed' : '#cbd5e1'};">${resFsr.s ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resFsr.r ? '#7c3aed' : '#cbd5e1'};">${resFsr.r ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resFsr.i ? '#7c3aed' : '#cbd5e1'};">${resFsr.i ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resFsr.l ? '#7c3aed' : '#cbd5e1'};">${resFsr.l ? 'x' : '-'}</td>
                  <td style="padding:4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; color:${resFsr.o ? '#7c3aed' : '#cbd5e1'};">${resFsr.o ? 'x' : '-'}</td>

                  <!-- Residual Analysis -->
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:600;">${item.residual_likelihood || 1}</td>
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:600;">${item.residual_impact || 1}</td>
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:800; background:${resInfo.bg}; color:${resInfo.color}; border-radius:4px;">
                    ${score2}
                  </td>
                  <td style="padding:8px; border:1px solid #e2e8f0; color:#334155; font-size:11.5px;">${item.further_actions || '-'}</td>

                  <!-- Action -->
                  <td style="padding:8px 6px; border:1px solid #e2e8f0; text-align:center; position:sticky; right:0; background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; z-index:10;">
                    <div style="display:flex; gap:4px; justify-content:center;">
                      <button class="btn btn-xs btn-outline-primary btn-edit-tpr-item" data-id="${item.id}" style="padding:2px 6px; font-size:11px;" title="แก้ไข">
                        ✏️
                      </button>
                      <button class="btn btn-xs btn-outline-danger btn-del-tpr-item" data-id="${item.id}" style="padding:2px 6px; font-size:11px;" title="ลบ">
                        🗑️
                      </button>
                    </div>
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

// 4. Card View
function renderCardView(items, metrics) {
  if (items.length === 0) {
    return `
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:40px; text-align:center; color:#94a3b8;">
        <div style="font-size:32px; margin-bottom:8px;">🔍</div>
        <div style="font-size:15px; font-weight:600; color:#475569;">ไม่พบรายการประเมินความเสี่ยงที่ตรงกับเงื่อนไข</div>
      </div>
    `
  }

  return `
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(460px, 1fr)); gap:16px;">
      ${items.map(item => {
        const score1 = Number(item.risk_level) || (Number(item.likelihood || 1) * Number(item.impact || 1))
        const rInfo = getThirdPartyRiskLevelInfo(score1)
        const score2 = Number(item.residual_risk_level) || (Number(item.residual_likelihood || 1) * Number(item.residual_impact || 1))
        const resInfo = getThirdPartyRiskLevelInfo(score2)
        const cia = item.cia || {}
        const fsr = item.severity_fsrilo || {}

        return `
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; flex-direction:column; justify-content:space-between; position:relative;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:800; font-size:13.5px; background:#eff6ff; color:#1d4ed8; padding:3px 8px; border-radius:6px; border:1px solid #bfdbfe;">
                    ${item.item_no}
                  </span>
                  <span style="font-size:12px; color:#64748b; font-weight:600;">Cluster ${item.cluster_id}</span>
                </div>
                <div style="display:flex; gap:6px;">
                  <span style="font-size:11px; font-weight:800; padding:3px 8px; border-radius:6px; background:${rInfo.bg}; color:${rInfo.color};">
                    ก่อน: ${score1} (${rInfo.label})
                  </span>
                  <span style="font-size:11px; font-weight:800; padding:3px 8px; border-radius:6px; background:${resInfo.bg}; color:${resInfo.color};">
                    หลัง: ${score2} (${resInfo.label})
                  </span>
                </div>
              </div>

              <h3 style="font-size:13.5px; font-weight:700; color:#0f172a; margin:0 0 10px 0; line-height:1.4;">
                ${item.title}
              </h3>

              <div style="background:#fef2f2; border:1px solid #fee2e2; border-radius:8px; padding:8px 10px; margin-bottom:8px; font-size:12px;">
                <div style="font-weight:700; color:#991b1b; margin-bottom:2px;">⚠️ ภัยคุกคาม (Threat):</div>
                <div style="color:#7f1d1d;">${item.threat || '-'}</div>
              </div>

              <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:8px; padding:8px 10px; margin-bottom:10px; font-size:12px;">
                <div style="font-weight:700; color:#92400e; margin-bottom:2px;">🔓 ช่องโหว่ (Vulnerability):</div>
                <div style="color:#78350f;">${item.vulnerability || '-'}</div>
              </div>

              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:8px 10px; margin-bottom:10px; font-size:12px;">
                <div style="font-weight:700; color:#166534; margin-bottom:2px;">🛠️ แผนจัดการ (Treatment Plan):</div>
                <div style="color:#14532d; line-height:1.4;">${item.treatment_plan || '-'}</div>
              </div>

              <!-- Progress Bar -->
              <div style="margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:3px;">
                  <span style="color:#475569; font-weight:600;">ความก้าวหน้าตามแผน</span>
                  <span style="font-weight:800; color:${(item.progress_percent || 0) >= 100 ? '#16a34a' : '#2563eb'};">${item.progress_percent || 0}%</span>
                </div>
                <div style="height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden;">
                  <div style="height:100%; width:${item.progress_percent || 0}%; background:${(item.progress_percent || 0) >= 100 ? '#22c55e' : '#3b82f6'};"></div>
                </div>
              </div>

              <div style="display:flex; justify-content:space-between; font-size:11.5px; color:#64748b; margin-bottom:6px;">
                <span><strong>ผู้รับผิดชอบ:</strong> ${item.responsible_person || '-'}</span>
                <span><strong>กำหนดเสร็จ:</strong> ${item.expected_finish_date || '-'}</span>
              </div>
            </div>

            <div style="border-top:1px solid #f1f5f9; padding-top:10px; margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11.5px; color:#64748b;">
                <strong>ดำเนินการต่อ:</strong> ${item.further_actions || 'เฝ้าติดตาม'}
              </span>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-sm btn-outline-primary btn-edit-tpr-item" data-id="${item.id}" style="font-size:11.5px; padding:3px 10px;">
                  ✏️ แก้ไข
                </button>
                <button class="btn btn-sm btn-outline-danger btn-del-tpr-item" data-id="${item.id}" style="font-size:11.5px; padding:3px 8px;">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

// 5. Update Log Tab Content
function renderUpdateLogTabContent(logs) {
  return `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin:0 0 4px 0;">
            📝 ประวัติการปรับปรุงเอกสาร (Update Log)
          </h2>
          <p style="color:#64748b; font-size:13px; margin:0;">
            บันทึกประวัติการแก้ไขและเวอร์ชันเอกสารการประเมินความเสี่ยงบุคคลภายนอก สสจ.สระแก้ว
          </p>
        </div>
        <button id="btn-add-tpr-log" class="btn btn-sm btn-primary" style="font-size:12.5px; font-weight:700; border-radius:6px; padding:6px 14px;">
          + เพิ่มบันทึกประวัติ
        </button>
      </div>

      <div style="border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="background:#f8fafc; color:#334155; font-weight:700; border-bottom:1px solid #e2e8f0;">
              <th style="padding:10px 14px; width:70px; text-align:center;">ลำดับ</th>
              <th style="padding:10px 16px; width:180px;">วันที่ปรับปรุง</th>
              <th style="padding:10px 16px;">สิ่งที่ปรับปรุง/แก้ไข</th>
              <th style="padding:10px 14px; width:100px; text-align:center;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map((l, idx) => `
              <tr style="border-bottom:1px solid #f1f5f9; background:${idx % 2 === 0 ? '#fff' : '#fcfcfd'};">
                <td style="padding:10px; text-align:center; font-weight:700; color:#64748b;">${idx + 1}</td>
                <td style="padding:10px 16px; font-weight:600; color:#2563eb;">${l.date || '-'}</td>
                <td style="padding:10px 16px; color:#1e293b; line-height:1.5;">${l.detail || '-'}</td>
                <td style="padding:10px; text-align:center;">
                  <button class="btn btn-xs btn-outline-primary btn-edit-tpr-log" data-id="${l.id}" style="padding:2px 6px; font-size:11px;">✏️</button>
                  <button class="btn btn-xs btn-outline-danger btn-del-tpr-log" data-id="${l.id}" style="padding:2px 6px; font-size:11px;">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// 6. Criteria Tab Content
function renderCriteriaTabContent() {
  const cd = THIRD_PARTY_CRITERIA_DATA

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- 5x5 Matrix & Score Ranges Grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        
        <!-- 5x5 Matrix -->
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
            <span style="font-size:20px;">📊</span>
            <div>
              <h3 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0;">
                ตารางเมทริกซ์ระดับความเสี่ยง (5x5 Risk Matrix)
              </h3>
              <p style="font-size:12px; color:#64748b; margin:2px 0 0 0;">
                แกนตั้ง = ความรุนแรง (Impact 1-5) | แกนนอน = โอกาสเกิด (Likelihood 1-5)
              </p>
            </div>
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; text-align:center; font-size:12px;">
              <thead>
                <tr style="background:#f1f5f9; color:#475569; font-weight:700;">
                  <th style="padding:8px; border:1px solid #cbd5e1; width:150px; text-align:left;">ความรุนแรง (Impact)</th>
                  <th style="padding:8px; border:1px solid #cbd5e1;">1<br><span style="font-size:10px; font-weight:normal;">เกิดขึ้นได้ยาก</span></th>
                  <th style="padding:8px; border:1px solid #cbd5e1;">2<br><span style="font-size:10px; font-weight:normal;">มีโอกาสน้อย</span></th>
                  <th style="padding:8px; border:1px solid #cbd5e1;">3<br><span style="font-size:10px; font-weight:normal;">อาจเกิดขึ้น</span></th>
                  <th style="padding:8px; border:1px solid #cbd5e1;">4<br><span style="font-size:10px; font-weight:normal;">มีโอกาสเกิดขึ้น</span></th>
                  <th style="padding:8px; border:1px solid #cbd5e1;">5<br><span style="font-size:10px; font-weight:normal;">เกือบแน่นอน</span></th>
                </tr>
              </thead>
              <tbody>
                ${cd.matrix5x5.map(row => `
                  <tr>
                    <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:left; font-weight:700; background:#f8fafc; font-size:11.5px;">
                      ${row.label}
                    </td>
                    ${row.cells.map(c => `
                      <td class="btn-matrix-cell-tpr" data-lh="${c.likelihood}" data-imp="${row.impact}" 
                        style="padding:10px 4px; border:1px solid #cbd5e1; background:${c.bg}; color:${c.color}; font-weight:800; cursor:pointer;" 
                        title="โอกาส ${c.likelihood} × รุนแรง ${row.impact} = ${c.score} (${c.level}) [คลิกเพื่อกรอง]">
                        ${c.level} ${c.score}
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:8px; text-align:right;">
            * คลิกที่ช่องเมทริกซ์เพื่อกรองรายการที่มีค่าโอกาสและความรุนแรงนั้นๆ
          </div>
        </div>

        <!-- Risk Score Ranges & Cluster Avg Ranges -->
        <div style="display:flex; flex-direction:column; gap:16px;">
          
          <!-- Item Score Scale -->
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <h4 style="font-size:13px; font-weight:800; color:#0f172a; margin:0 0 10px 0;">
              1. เกณฑ์ระดับความเสี่ยงรายข้อ (Risk Score: A*B = 1 - 25)
            </h4>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${cd.riskScoreRanges.map(r => `
                <div style="display:flex; align-items:center; gap:10px; padding:6px 12px; border-radius:8px; background:${r.bg}; border:1px solid ${r.border};">
                  <span style="font-weight:800; color:${r.color}; min-width:65px; font-size:12px;">${r.range}</span>
                  <span style="font-weight:700; color:${r.color}; min-width:90px; font-size:12px;">${r.label}</span>
                  <span style="font-size:11.5px; color:#334155;">${r.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Cluster Avg Scale -->
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <h4 style="font-size:13px; font-weight:800; color:#0f172a; margin:0 0 10px 0;">
              2. เกณฑ์ค่าเฉลี่ยระดับความเสี่ยงของ Cluster (Average Risk Level: 1.0 - 25.0)
            </h4>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${cd.clusterAvgRanges.map(r => `
                <div style="display:flex; align-items:center; gap:10px; padding:6px 12px; border-radius:8px; background:${r.bg}; border:1px solid #e2e8f0;">
                  <span style="font-weight:800; color:${r.color}; min-width:85px; font-size:12px;">${r.range}</span>
                  <span style="font-weight:700; color:${r.color}; min-width:90px; font-size:12px;">${r.label}</span>
                  <span style="font-size:11.5px; color:#334155;">${r.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>

      <!-- Severity 6 Dimensions & Likelihood 5 Levels -->
      <div style="display:grid; grid-template-columns:2fr 1fr; gap:20px;">
        
        <!-- Severity 6 Dimensions Table -->
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <h3 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0 0 12px 0;">
            3. คำอธิบายเกณฑ์ความรุนแรงตามผลกระทบ 6 มิติ (Severity / Impact Levels)
          </h3>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
              <thead>
                <tr style="background:#f1f5f9; color:#334155; font-weight:700; border-bottom:1px solid #cbd5e1;">
                  <th style="padding:8px 10px; border:1px solid #cbd5e1; width:130px;">ระดับความรุนแรง</th>
                  <th style="padding:8px 10px; border:1px solid #cbd5e1;">Financial (B/F)</th>
                  <th style="padding:8px 10px; border:1px solid #cbd5e1;">Safety & Service (S)</th>
                  <th style="padding:8px 10px; border:1px solid #cbd5e1;">Reputation & Image (R/I)</th>
                  <th style="padding:8px 10px; border:1px solid #cbd5e1;">Legal (L)</th>
                  <th style="padding:8px 10px; border:1px solid #cbd5e1;">Other CII (O)</th>
                </tr>
              </thead>
              <tbody>
                ${cd.impactDimensions.map((dim, idx) => `
                  <tr style="background:${idx % 2 === 0 ? '#fff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
                    <td style="padding:8px 10px; border:1px solid #cbd5e1; font-weight:700; color:#0f172a;">${dim.title}</td>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-size:11.5px; color:#475569;">${dim.financial}</td>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-size:11.5px; color:#475569;">${dim.safety}</td>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-size:11.5px; color:#475569;">${dim.reputation}</td>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-size:11.5px; color:#475569;">${dim.legal}</td>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-size:11.5px; color:#475569;">${dim.other}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Likelihood 5 Levels -->
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <h3 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0 0 12px 0;">
            4. เกณฑ์โอกาสเกิด 5 ระดับ (Likelihood)
          </h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${cd.likelihoodLevels.map(l => `
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:3px;">
                  <span style="font-weight:800; font-size:12.5px; background:#2563eb; color:#fff; width:22px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
                    ${l.level}
                  </span>
                  <span style="font-weight:700; color:#0f172a; font-size:12.5px;">${l.title}</span>
                  <span style="font-size:11px; color:#64748b;">(${l.code})</span>
                </div>
                <div style="font-size:11.5px; color:#475569; margin-left:30px;">
                  ${l.desc}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>
  `
}

// 7. Word & CSV Exporters
export function exportThirdPartyRiskWord(profile = {}) {
  const header = profile.header || DEFAULT_THIRD_PARTY_HEADER
  const items = profile.items || DEFAULT_THIRD_PARTY_ITEMS
  const metrics = calculateThirdPartyMetrics(items)

  const rowsHtml = items.map((item, idx) => {
    const cia = item.cia || {}
    const fsr = item.severity_fsrilo || {}
    const resCia = item.residual_cia || {}
    const resFsr = item.residual_severity_fsrilo || {}

    const score1 = Number(item.risk_level) || (Number(item.likelihood || 1) * Number(item.impact || 1))
    const rInfo = getThirdPartyRiskLevelInfo(score1)
    const score2 = Number(item.residual_risk_level) || (Number(item.residual_likelihood || 1) * Number(item.residual_impact || 1))
    const resInfo = getThirdPartyRiskLevelInfo(score2)
    const cStat = metrics.clusterAverages[item.cluster_id] || { avgScore: '-' }

    return `
      <tr>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${item.item_no}</td>
        <td style="border:1px solid #999; padding:4px;">C${item.cluster_id}: ${item.title || '-'}</td>
        <td style="border:1px solid #999; padding:4px; color:#b91c1c;">${item.threat || '-'}</td>
        <td style="border:1px solid #999; padding:4px; color:#b45309;">${item.vulnerability || '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${cia.c ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${cia.i ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${cia.a ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${fsr.f ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${fsr.s ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${fsr.r ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${fsr.i ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${fsr.l ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${fsr.o ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${item.likelihood || 1}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${item.impact || 1}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center; font-weight:bold; background:${rInfo.bg}; color:${rInfo.color};">${score1}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center; font-weight:bold;">${cStat.avgScore}</td>
        <td style="border:1px solid #999; padding:4px;">${item.treatment_option || 'Mitigate Risk'}</td>
        <td style="border:1px solid #999; padding:4px;">${item.treatment_plan || '-'}</td>
        <td style="border:1px solid #999; padding:4px;">${item.responsible_person || '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${item.progress_percent || 0}%</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${item.expected_finish_date || '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resCia.c ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resCia.i ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resCia.a ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resFsr.f ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resFsr.s ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resFsr.r ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resFsr.i ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resFsr.l ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${resFsr.o ? 'x' : '-'}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${item.residual_likelihood || 1}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center;">${item.residual_impact || 1}</td>
        <td style="border:1px solid #999; padding:4px; text-align:center; font-weight:bold; background:${resInfo.bg}; color:${resInfo.color};">${score2}</td>
        <td style="border:1px solid #999; padding:4px;">${item.further_actions || '-'}</td>
      </tr>
    `
  }).join('')

  const docHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>4.5 3rd Party Risk Assessment - ${header.vendor_name}</title>
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
        <h2 style="margin:4px 0;">การประเมินความเสี่ยงของบุคคลภายนอก (3rd Party Risk Assessment - Zero Trust)</h2>
        <h3 style="margin:2px 0; color:#334155;">4.5 Risk Assessment for Services & Product Supply Chain - สสจ.สระแก้ว</h3>
      </div>

      <div style="margin-bottom:14px; font-size:9.5pt; border:1px solid #cbd5e1; padding:10px; background:#f8fafc;">
        <p style="margin:3px 0;"><strong>ชื่อบุคคล/องค์กรภายนอก :</strong> ${header.vendor_name || '-'}</p>
        <p style="margin:3px 0;"><strong>ระบบบริการที่สำคัญ :</strong> ${header.critical_service || '-'}</p>
        <p style="margin:3px 0;"><strong>ผู้พิจารณาประเมิน :</strong> ${header.evaluator || '-'} | <strong>ผู้บันทึก :</strong> ${header.recorder || '-'}</p>
        <p style="margin:3px 0;"><strong>วันที่ทำการประชุมความเสี่ยงพร้อมบันทึก :</strong> ${header.meeting_date || '-'}</p>
        <p style="margin:3px 0;"><strong>ผลการประเมินความเสี่ยง (เฉลี่ย) ก่อนจัดการ :</strong> ${metrics.overallAvg} (${metrics.overallAvgInfo.label}) | <strong>หลังจัดการความเสี่ยง :</strong> ${metrics.residualAvg} (${metrics.residualAvgInfo.label})</p>
      </div>

      <table>
        <thead>
          <tr style="background:#e2e8f0;">
            <th colspan="17" style="background:#dbeafe; color:#1e40af;">PART 1 : RISK ASSESSMENT & IDENTIFICATION</th>
            <th colspan="18" style="background:#dcfce7; color:#166534;">PART 2 : RISK TREATMENT PLAN & RESIDUAL</th>
          </tr>
          <tr>
            <th>No.</th>
            <th>หมวดหมู่ความเสี่ยง (Risk Cluster)</th>
            <th>ภัยคุกคาม (Threat)</th>
            <th>ช่องโหว่ (Vulnerability)</th>
            <th>C</th><th>I</th><th>A</th>
            <th>B/F</th><th>S</th><th>R</th><th>I</th><th>L</th><th>O</th>
            <th>โอกาสเกิด (Likelihood)</th><th>ความรุนแรง (Impact)</th><th>ระดับความเสี่ยง (Risk Level)</th>
            <th>ระดับความเสี่ยงโดยเฉลี่ย (Average Risk Level)</th>
            <th>ตัวเลือกการตอบสนอง (Risk Treatment)</th>
            <th>การจัดการความเสี่ยง (Risk Treatment - Threat and Vulner.)</th>
            <th>ผู้รับผิดชอบ</th>
            <th>สถานะความคืบหน้า (Progress Status)</th>
            <th>คาดว่าดำเนินการแล้วเสร็จ (Expected finish date)</th>
            <th>C</th><th>I</th><th>A</th>
            <th>B/F</th><th>S</th><th>R</th><th>I</th><th>L</th><th>O</th>
            <th>โอกาสเกิด (Likelihood)</th><th>ความรุนแรง (Impact)</th><th>ระดับความเสี่ยงที่คงเหลือ (Risk Residual Level)</th>
            <th>ดำเนินการเพิ่มเติมเพื่อลดความเสี่ยงให้น้อยลงอีก (Further actions to be taken to further minimize risk)</th>
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
  a.download = `4.5_3rd_Party_Risk_Assessment_${(header.vendor_name || 'Vendor').replace(/\s+/g, '_')}_${Date.now()}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportThirdPartyRiskCsv(profile = {}) {
  const items = profile.items || DEFAULT_THIRD_PARTY_ITEMS
  const metrics = calculateThirdPartyMetrics(items)

  const headers = [
    'No.', 'หมวดหมู่ความเสี่ยง (Risk Cluster)', 'Cluster ID',
    'ภัยคุกคาม (Threat)', 'ช่องโหว่ (Vulnerability)',
    'กระทบต่อ_C', 'กระทบต่อ_I', 'กระทบต่อ_A',
    'ความรุนแรง_BF', 'ความรุนแรง_S', 'ความรุนแรง_R', 'ความรุนแรง_I', 'ความรุนแรง_L', 'ความรุนแรง_O',
    'โอกาสเกิด (Likelihood)', 'ความรุนแรง (Impact)', 'ระดับความเสี่ยง (Risk Level)', 'ระดับความเสี่ยงโดยเฉลี่ย (Average Risk Level)',
    'ตัวเลือกการตอบสนอง (Risk Treatment)', 'การจัดการความเสี่ยง (Risk Treatment - Threat and Vulner.)', 'ผู้รับผิดชอบ',
    'สถานะความคืบหน้า (Progress Status)', 'คาดว่าดำเนินการแล้วเสร็จ (Expected finish date)',
    'Residual_กระทบต่อ_C', 'Residual_กระทบต่อ_I', 'Residual_กระทบต่อ_A',
    'Residual_ความรุนแรง_BF', 'Residual_ความรุนแรง_S', 'Residual_ความรุนแรง_R', 'Residual_ความรุนแรง_I', 'Residual_ความรุนแรง_L', 'Residual_ความรุนแรง_O',
    'Residual โอกาสเกิด (Likelihood)', 'Residual ความรุนแรง (Impact)', 'ระดับความเสี่ยงที่คงเหลือ (Risk Residual Level)',
    'ดำเนินการเพิ่มเติมเพื่อลดความเสี่ยงให้น้อยลงอีก (Further actions to be taken to further minimize risk)'
  ]

  const rows = items.map(item => {
    const cia = item.cia || {}
    const fsr = item.severity_fsrilo || {}
    const resCia = item.residual_cia || {}
    const resFsr = item.residual_severity_fsrilo || {}
    const cStat = metrics.clusterAverages[item.cluster_id] || { avgScore: '' }

    return [
      `"${(item.item_no || '').replace(/"/g, '""')}"`,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      item.cluster_id || '',
      `"${(item.threat || '').replace(/"/g, '""')}"`,
      `"${(item.vulnerability || '').replace(/"/g, '""')}"`,
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
      cStat.avgScore || '',
      `"${(item.treatment_option || '').replace(/"/g, '""')}"`,
      `"${(item.treatment_plan || '').replace(/"/g, '""')}"`,
      `"${(item.responsible_person || '').replace(/"/g, '""')}"`,
      item.progress_percent || 0,
      `"${(item.expected_finish_date || '').replace(/"/g, '""')}"`,
      resCia.c ? '1' : '0',
      resCia.i ? '1' : '0',
      resCia.a ? '1' : '0',
      resFsr.f ? '1' : '0',
      resFsr.s ? '1' : '0',
      resFsr.r ? '1' : '0',
      resFsr.i ? '1' : '0',
      resFsr.l ? '1' : '0',
      resFsr.o ? '1' : '0',
      item.residual_likelihood || 1,
      item.residual_impact || 1,
      item.residual_risk_level || 1,
      `"${(item.further_actions || '').replace(/"/g, '""')}"`
    ]
  })

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `4.5_3rd_Party_Risk_Assessment_${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 8. Supabase Sync Helpers
export async function syncThirdPartyRiskToSupabase(profiles) {
  try {
    if (!supabase || !profiles) return
    await supabase.from('cyber_module_states').upsert({
      module_key: 'third_party_risk_profiles',
      data: profiles,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.warn('Supabase sync deferred for Third Party Risk:', err.message)
  }
}

export async function fetchThirdPartyRiskFromSupabase() {
  try {
    if (!supabase) return null
    const { data: stateData, error: stateErr } = await supabase
      .from('cyber_module_states')
      .select('data')
      .eq('module_key', 'third_party_risk_profiles')
      .maybeSingle()

    if (!stateErr && Array.isArray(stateData?.data)) {
      return stateData.data
    }
  } catch (err) {
    console.warn('Fetch Third Party Risk from Supabase deferred:', err.message)
  }
  return null
}

// 9. Event Binder
export function bindThirdPartyRiskEvents(el, profiles, activeVendorId, onAction) {
  if (!el) return

  let currentProfile = profiles.find(p => p.id === activeVendorId) || profiles[0]

  // Sub-tab switching
  el.querySelectorAll('.tpr-subtab-btn').forEach(btn => {
    btn.onclick = () => {
      onAction({ type: 'change_subtab', subtab: btn.dataset.subtab })
    }
  })

  // Vendor selector
  const selVendor = el.querySelector('#select-tpr-vendor')
  if (selVendor) {
    selVendor.onchange = (e) => {
      onAction({ type: 'change_vendor', vendorId: e.target.value })
    }
  }

  // Add Vendor button
  const btnAddVendor = el.querySelector('#btn-add-tpr-vendor')
  if (btnAddVendor) {
    btnAddVendor.onclick = () => {
      openNewVendorModal(onAction)
    }
  }

  // Delete Vendor button
  const btnDelVendor = el.querySelector('#btn-del-tpr-vendor')
  if (btnDelVendor) {
    btnDelVendor.onclick = () => {
      if (confirm(`ยืนยันการลบชุดประเมินของบริษัท "${currentProfile.vendor_name || currentProfile.header?.vendor_name}" หรือไม่?`)) {
        onAction({ type: 'delete_vendor', vendorId: currentProfile.id })
      }
    }
  }

  // View Mode switcher
  el.querySelectorAll('.btn-mode-tpr').forEach(btn => {
    btn.onclick = () => {
      onAction({ type: 'change_view_mode', mode: btn.dataset.mode })
    }
  })

  // Cluster filter
  const selCluster = el.querySelector('#select-cluster-filter-tpr')
  if (selCluster) {
    selCluster.onchange = (e) => {
      onAction({ type: 'filter_cluster', cluster: e.target.value })
    }
  }

  // Cluster tag click
  el.querySelectorAll('.btn-cluster-tag').forEach(tag => {
    tag.onclick = () => {
      const cid = tag.dataset.cluster
      onAction({ type: 'filter_cluster', cluster: cid })
    }
  })

  // Search input
  const inputSearch = el.querySelector('#input-search-tpr')
  if (inputSearch) {
    inputSearch.oninput = (e) => {
      onAction({ type: 'search_query', query: e.target.value })
    }
  }

  // Clear Matrix filter
  const btnClearMatrix = el.querySelector('#btn-clear-matrix-filter-tpr')
  if (btnClearMatrix) {
    btnClearMatrix.onclick = () => {
      onAction({ type: 'filter_matrix', matrixFilter: null })
    }
  }

  // Matrix cell click
  el.querySelectorAll('.btn-matrix-cell-tpr').forEach(cell => {
    cell.onclick = () => {
      const lh = Number(cell.dataset.lh)
      const imp = Number(cell.dataset.imp)
      onAction({ type: 'filter_matrix', matrixFilter: { likelihood: lh, impact: imp } })
      onAction({ type: 'change_subtab', subtab: 'assess' })
    }
  })

  // Export Word
  const btnExportWord = el.querySelector('#btn-export-tpr-word')
  if (btnExportWord) {
    btnExportWord.onclick = () => exportThirdPartyRiskWord(currentProfile)
  }

  // Export CSV
  const btnExportCsv = el.querySelector('#btn-export-tpr-csv')
  if (btnExportCsv) {
    btnExportCsv.onclick = () => exportThirdPartyRiskCsv(currentProfile)
  }

  // Print
  const btnPrint = el.querySelector('#btn-print-tpr')
  if (btnPrint) {
    btnPrint.onclick = () => window.print()
  }

  // Reset default
  const btnReset = el.querySelector('#btn-reset-tpr-default')
  if (btnReset) {
    btnReset.onclick = () => {
      if (confirm(`ยืนยันการรีเซ็ตข้อมูลชุดประเมินของบริษัท "${currentProfile.vendor_name || 'นี้'}" เป็นค่าเริ่มต้นหรือไม่?`)) {
        onAction({ type: 'reset_default_vendor', vendorId: currentProfile.id })
      }
    }
  }

  // Edit Header
  const btnEditHeader = el.querySelector('#btn-edit-tpr-header')
  if (btnEditHeader) {
    btnEditHeader.onclick = () => {
      openHeaderModal(currentProfile.header || DEFAULT_THIRD_PARTY_HEADER, onAction)
    }
  }

  // Add Item
  const btnAddItem = el.querySelector('#btn-add-tpr-item')
  if (btnAddItem) {
    btnAddItem.onclick = () => {
      openItemModal(null, onAction)
    }
  }

  // Edit Item
  el.querySelectorAll('.btn-edit-tpr-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      const item = (currentProfile.items || []).find(i => i.id === id)
      if (item) openItemModal(item, onAction)
    }
  })

  // Delete Item
  el.querySelectorAll('.btn-del-tpr-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      if (confirm('ยืนยันการลบรายการประเมินความเสี่ยงนี้หรือไม่?')) {
        onAction({ type: 'delete_item', id })
      }
    }
  })

  // Add Log
  const btnAddLog = el.querySelector('#btn-add-tpr-log')
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
  el.querySelectorAll('.btn-edit-tpr-log').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      const log = (currentProfile.logs || []).find(l => l.id === id)
      if (log) {
        const newDetail = prompt('แก้ไขรายละเอียดสิ่งที่ปรับปรุง:', log.detail)
        if (newDetail && newDetail.trim()) {
          onAction({ type: 'edit_log', id, detail: newDetail.trim() })
        }
      }
    }
  })

  // Delete Log
  el.querySelectorAll('.btn-del-tpr-log').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id
      if (confirm('ยืนยันการลบบันทึกประวัตินี้หรือไม่?')) {
        onAction({ type: 'delete_log', id })
      }
    }
  })
}

// 10. Modal: แก้ไขส่วนหัว / ข้อมูลผู้ให้บริการ
function openHeaderModal(header, onAction) {
  let modalEl = document.getElementById('tpr-header-modal')
  if (!modalEl) {
    modalEl = document.createElement('div')
    modalEl.id = 'tpr-header-modal'
    document.body.appendChild(modalEl)
  }

  modalEl.innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;">
      <div style="background:#ffffff; border-radius:12px; width:100%; max-width:650px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); overflow:hidden; font-family:'Sarabun',sans-serif;">
        <div style="background:#2563eb; color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:800;">✏️ แก้ไขข้อมูลส่วนหัว / ผู้ให้บริการภายนอก</h3>
          <button id="close-tpr-header-modal" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">✕</button>
        </div>
        <div style="padding:20px; display:flex; flex-direction:column; gap:14px; max-height:80vh; overflow-y:auto;">
          <div>
            <label style="font-weight:700; font-size:13px; color:#1e293b;">🏢 ชื่อบุคคล/องค์กรภายนอก (Vendor Name) *</label>
            <input type="text" id="f-tpr-vendor-name" class="form-control" value="${header.vendor_name || ''}" style="margin-top:4px;" />
          </div>
          <div>
            <label style="font-weight:700; font-size:13px; color:#1e293b;">🛡️ ระบบบริการที่สำคัญ (Critical Service) *</label>
            <input type="text" id="f-tpr-critical-service" class="form-control" value="${header.critical_service || ''}" style="margin-top:4px;" />
          </div>
          <div>
            <label style="font-weight:700; font-size:13px; color:#1e293b;">ผู้พิจารณาประเมิน</label>
            <input type="text" id="f-tpr-evaluator" class="form-control" value="${header.evaluator || ''}" style="margin-top:4px;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="font-weight:700; font-size:13px; color:#1e293b;">ผู้บันทึก</label>
              <input type="text" id="f-tpr-recorder" class="form-control" value="${header.recorder || ''}" style="margin-top:4px;" />
            </div>
            <div>
              <label style="font-weight:700; font-size:13px; color:#1e293b;">วันที่ทำการประชุมพร้อมบันทึก</label>
              <input type="text" id="f-tpr-meeting-date" class="form-control" value="${header.meeting_date || ''}" style="margin-top:4px;" />
            </div>
          </div>
        </div>
        <div style="background:#f8fafc; padding:14px 20px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
          <button id="cancel-tpr-header-modal" class="btn btn-sm btn-secondary">ยกเลิก</button>
          <button id="save-tpr-header-modal" class="btn btn-sm btn-primary">💾 บันทึกข้อมูล</button>
        </div>
      </div>
    </div>
  `

  const close = () => { modalEl.innerHTML = '' }
  modalEl.querySelector('#close-tpr-header-modal').onclick = close
  modalEl.querySelector('#cancel-tpr-header-modal').onclick = close

  modalEl.querySelector('#save-tpr-header-modal').onclick = () => {
    const updatedHeader = {
      vendor_name: modalEl.querySelector('#f-tpr-vendor-name').value.trim() || 'ไม่ระบุชื่อ',
      critical_service: modalEl.querySelector('#f-tpr-critical-service').value.trim(),
      evaluator: modalEl.querySelector('#f-tpr-evaluator').value.trim(),
      recorder: modalEl.querySelector('#f-tpr-recorder').value.trim(),
      meeting_date: modalEl.querySelector('#f-tpr-meeting-date').value.trim()
    }
    onAction({ type: 'update_header', header: updatedHeader })
    close()
  }
}

// 11. Modal: สร้างชุดประเมินสำหรับบริษัทใหม่
function openNewVendorModal(onAction) {
  let modalEl = document.getElementById('tpr-new-vendor-modal')
  if (!modalEl) {
    modalEl = document.createElement('div')
    modalEl.id = 'tpr-new-vendor-modal'
    document.body.appendChild(modalEl)
  }

  modalEl.innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;">
      <div style="background:#ffffff; border-radius:12px; width:100%; max-width:550px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); overflow:hidden; font-family:'Sarabun',sans-serif;">
        <div style="background:#0284c7; color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:800;">🏢 สร้างชุดประเมินผู้ให้บริการภายนอกรายใหม่</h3>
          <button id="close-tpr-nv-modal" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">✕</button>
        </div>
        <div style="padding:20px; display:flex; flex-direction:column; gap:14px;">
          <div>
            <label style="font-weight:700; font-size:13px; color:#1e293b;">ชื่อบุคคล/องค์กรภายนอก (Company Name) *</label>
            <input type="text" id="f-nv-name" class="form-control" placeholder="เช่น บริษัท เอบีซี คลาวด์ ซิสเต็มส์ จำกัด" style="margin-top:4px;" />
          </div>
          <div>
            <label style="font-weight:700; font-size:13px; color:#1e293b;">ระบบบริการที่สำคัญที่เกี่ยวข้อง *</label>
            <input type="text" id="f-nv-service" class="form-control" placeholder="เช่น บริการระบบเครือข่ายความเร็วสูง หรือ Cloud Storage" style="margin-top:4px;" />
          </div>
          <div>
            <label style="font-weight:700; font-size:13px; color:#1e293b;">ตัวเลือกข้อมูลข้อประเมินเริ่มต้น</label>
            <div style="margin-top:6px; display:flex; flex-direction:column; gap:6px;">
              <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                <input type="radio" name="nv-template-opt" value="clone_std" checked />
                <span>คัดลอกข้อประเมินมาตรฐาน 80 ข้อ (พรบ. และ Zero Trust)</span>
              </label>
              <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                <input type="radio" name="nv-template-opt" value="empty" />
                <span>เริ่มต้นชุดเปล่า (เพิ่มข้อเองทีละข้อ)</span>
              </label>
            </div>
          </div>
        </div>
        <div style="background:#f8fafc; padding:14px 20px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
          <button id="cancel-tpr-nv-modal" class="btn btn-sm btn-secondary">ยกเลิก</button>
          <button id="save-tpr-nv-modal" class="btn btn-sm btn-primary" style="background:#0284c7; border:none;">+ สร้างชุดประเมิน</button>
        </div>
      </div>
    </div>
  `

  const close = () => { modalEl.innerHTML = '' }
  modalEl.querySelector('#close-tpr-nv-modal').onclick = close
  modalEl.querySelector('#cancel-tpr-nv-modal').onclick = close

  modalEl.querySelector('#save-tpr-nv-modal').onclick = () => {
    const name = modalEl.querySelector('#f-nv-name').value.trim()
    if (!name) {
      alert('กรุณากรอกชื่อบุคคล/องค์กรภายนอก')
      return
    }
    const service = modalEl.querySelector('#f-nv-service').value.trim() || 'บริการระบบสารสนเทศ'
    const isClone = modalEl.querySelector('input[name="nv-template-opt"]:checked').value === 'clone_std'

    const newProfile = {
      id: 'vendor_' + Date.now(),
      vendor_name: name,
      header: {
        ...DEFAULT_THIRD_PARTY_HEADER,
        vendor_name: name,
        critical_service: service,
        meeting_date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
      },
      logs: [
        {
          id: 'log_' + Date.now(),
          date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
          detail: `สร้างชุดประเมินความเสี่ยงสำหรับ ${name}`
        }
      ],
      items: isClone ? JSON.parse(JSON.stringify(DEFAULT_THIRD_PARTY_ITEMS)) : []
    }

    onAction({ type: 'create_vendor_profile', profile: newProfile })
    close()
  }
}

// 12. Modal: เพิ่ม/แก้ไข ข้อประเมินความเสี่ยง
function openItemModal(item = null, onAction) {
  const isEdit = !!item
  const it = item || {
    id: 'item_' + Date.now(),
    item_no: '1.9',
    cluster_id: 1,
    title: '',
    threat: '',
    vulnerability: '',
    cia: { c: false, i: false, a: false },
    severity_fsrilo: { f: false, s: false, r: false, i: false, l: false, o: false },
    likelihood: 3,
    impact: 3,
    risk_level: 9,
    treatment_option: 'Mitigate Risk',
    treatment_plan: '',
    responsible_person: 'คณะทำงานไซเบอร์',
    progress_percent: 0,
    expected_finish_date: '',
    residual_cia: { c: false, i: false, a: false },
    residual_severity_fsrilo: { f: false, s: false, r: false, i: false, l: false, o: false },
    residual_likelihood: 1,
    residual_impact: 3,
    residual_risk_level: 3,
    further_actions: 'เฝ้าติดตามเป็นระยะ'
  }

  let modalEl = document.getElementById('tpr-item-modal')
  if (!modalEl) {
    modalEl = document.createElement('div')
    modalEl.id = 'tpr-item-modal'
    document.body.appendChild(modalEl)
  }

  modalEl.innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;">
      <div style="background:#ffffff; border-radius:12px; width:100%; max-width:850px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); overflow:hidden; font-family:'Sarabun',sans-serif; max-height:90vh; display:flex; flex-direction:column;">
        <div style="background:#2563eb; color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:800;">
            ${isEdit ? `✏️ แก้ไขข้อประเมินความเสี่ยง [${it.item_no}]` : '➕ เพิ่มข้อประเมินความเสี่ยงใหม่'}
          </h3>
          <button id="close-tpr-item-modal" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">✕</button>
        </div>

        <div style="padding:20px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:16px;">
          <!-- Basic Info -->
          <div style="display:grid; grid-template-columns:1fr 2fr; gap:12px;">
            <div>
              <label style="font-weight:700; font-size:12.5px; color:#1e293b;">ข้อลำดับ (No.) *</label>
              <input type="text" id="f-tpr-no" class="form-control form-control-sm" value="${it.item_no || ''}" placeholder="เช่น 1.9, 2.9" />
            </div>
            <div>
              <label style="font-weight:700; font-size:12.5px; color:#1e293b;">หมวดหมู่ (Cluster) *</label>
              <select id="f-tpr-cid" class="form-select form-select-sm">
                ${THIRD_PARTY_CLUSTERS.map(c => `
                  <option value="${c.id}" ${c.id === it.cluster_id ? 'selected' : ''}>
                    ${c.id}. ${c.name}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div>
            <label style="font-weight:700; font-size:12.5px; color:#1e293b;">ประเด็นความเสี่ยง / ข้อกำหนด (Title) *</label>
            <input type="text" id="f-tpr-title" class="form-control form-control-sm" value="${it.title || ''}" />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="font-weight:700; font-size:12.5px; color:#991b1b;">⚠️ ภัยคุกคาม (Threat)</label>
              <textarea id="f-tpr-threat" class="form-control form-control-sm" rows="2">${it.threat || ''}</textarea>
            </div>
            <div>
              <label style="font-weight:700; font-size:12.5px; color:#92400e;">🔓 ช่องโหว่ (Vulnerability)</label>
              <textarea id="f-tpr-vulner" class="form-control form-control-sm" rows="2">${it.vulnerability || ''}</textarea>
            </div>
          </div>

          <!-- PART 1 Evaluation -->
          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:12px;">
            <div style="font-weight:800; font-size:13px; color:#1e40af; margin-bottom:8px;">
              PART 1: การประเมินความเสี่ยงรอบแรก
            </div>
            
            <div style="display:flex; flex-wrap:wrap; gap:16px; margin-bottom:10px;">
              <div>
                <span style="font-size:12px; font-weight:700; color:#334155; margin-right:6px;">กระทบต่อ CIA:</span>
                <label style="font-size:12px; margin-right:8px;"><input type="checkbox" id="f-tpr-c" ${it.cia?.c ? 'checked' : ''} /> C</label>
                <label style="font-size:12px; margin-right:8px;"><input type="checkbox" id="f-tpr-i" ${it.cia?.i ? 'checked' : ''} /> I</label>
                <label style="font-size:12px;"><input type="checkbox" id="f-tpr-a" ${it.cia?.a ? 'checked' : ''} /> A</label>
              </div>

              <div>
                <span style="font-size:12px; font-weight:700; color:#334155; margin-right:6px;">ความรุนแรง FSRILO:</span>
                <label style="font-size:12px; margin-right:6px;"><input type="checkbox" id="f-tpr-f" ${it.severity_fsrilo?.f ? 'checked' : ''} /> B/F</label>
                <label style="font-size:12px; margin-right:6px;"><input type="checkbox" id="f-tpr-s" ${it.severity_fsrilo?.s ? 'checked' : ''} /> S</label>
                <label style="font-size:12px; margin-right:6px;"><input type="checkbox" id="f-tpr-r" ${it.severity_fsrilo?.r ? 'checked' : ''} /> R</label>
                <label style="font-size:12px; margin-right:6px;"><input type="checkbox" id="f-tpr-i2" ${it.severity_fsrilo?.i ? 'checked' : ''} /> I</label>
                <label style="font-size:12px; margin-right:6px;"><input type="checkbox" id="f-tpr-l" ${it.severity_fsrilo?.l ? 'checked' : ''} /> L</label>
                <label style="font-size:12px;"><input type="checkbox" id="f-tpr-o" ${it.severity_fsrilo?.o ? 'checked' : ''} /> O</label>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">โอกาสเกิด (Likelihood 1-5)</label>
                <select id="f-tpr-lh" class="form-select form-select-sm">
                  <option value="1" ${it.likelihood == 1 ? 'selected' : ''}>1 - Rare (ยาก)</option>
                  <option value="2" ${it.likelihood == 2 ? 'selected' : ''}>2 - Unlikely (น้อย)</option>
                  <option value="3" ${it.likelihood == 3 ? 'selected' : ''}>3 - Moderate (อาจเกิด)</option>
                  <option value="4" ${it.likelihood == 4 ? 'selected' : ''}>4 - Likely (มีโอกาส)</option>
                  <option value="5" ${it.likelihood == 5 ? 'selected' : ''}>5 - Almost Certain (แน่นอน)</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">ความรุนแรง (Impact 1-5)</label>
                <select id="f-tpr-imp" class="form-select form-select-sm">
                  <option value="1" ${it.impact == 1 ? 'selected' : ''}>1 - Insignificant (เล็กน้อย)</option>
                  <option value="2" ${it.impact == 2 ? 'selected' : ''}>2 - Minor (ไม่ร้ายแรง)</option>
                  <option value="3" ${it.impact == 3 ? 'selected' : ''}>3 - Moderate (ร้ายแรง)</option>
                  <option value="4" ${it.impact == 4 ? 'selected' : ''}>4 - Significant (วิกฤต ก)</option>
                  <option value="5" ${it.impact == 5 ? 'selected' : ''}>5 - Severe (วิกฤต ข)</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">ระดับความเสี่ยง (Score = A*B)</label>
                <input type="text" id="f-tpr-score" class="form-control form-control-sm" value="${it.risk_level || 9}" readonly style="font-weight:800; background:#fff;" />
              </div>
            </div>
          </div>

          <!-- PART 2 Treatment & Residual -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px;">
            <div style="font-weight:800; font-size:13px; color:#166534; margin-bottom:8px;">
              PART 2: แผนการจัดการความเสี่ยงและการประเมินคงเหลือ (Treatment & Residual)
            </div>

            <div style="display:grid; grid-template-columns:1fr 2fr; gap:12px; margin-bottom:10px;">
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">ตัวเลือกการจัดการ (Risk Treatment)</label>
                <select id="f-tpr-t-opt" class="form-select form-select-sm">
                  <option value="Mitigate Risk" ${it.treatment_option === 'Mitigate Risk' ? 'selected' : ''}>Mitigate Risk (ลดความเสี่ยง)</option>
                  <option value="Avoid Risk" ${it.treatment_option === 'Avoid Risk' ? 'selected' : ''}>Avoid Risk (หลีกเลี่ยงความเสี่ยง)</option>
                  <option value="Transfer Risk" ${it.treatment_option === 'Transfer Risk' ? 'selected' : ''}>Transfer Risk (ถ่ายโอนความเสี่ยง)</option>
                  <option value="Accept Risk" ${it.treatment_option === 'Accept Risk' ? 'selected' : ''}>Accept Risk (ยอมรับความเสี่ยง)</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">การจัดการความเสี่ยง (Treatment Plan)</label>
                <input type="text" id="f-tpr-t-plan" class="form-control form-control-sm" value="${it.treatment_plan || ''}" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:10px;">
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">ผู้รับผิดชอบ</label>
                <input type="text" id="f-tpr-resp" class="form-control form-control-sm" value="${it.responsible_person || ''}" />
              </div>
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">% ก้าวหน้า (Progress)</label>
                <input type="number" id="f-tpr-prog" class="form-control form-control-sm" min="0" max="100" value="${it.progress_percent || 0}" />
              </div>
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">กำหนดแล้วเสร็จ</label>
                <input type="text" id="f-tpr-exp-date" class="form-control form-control-sm" value="${it.expected_finish_date || ''}" placeholder="เช่น 30 ก.ย. 68" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:10px;">
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">Residual โอกาสเกิด (1-5)</label>
                <select id="f-tpr-res-lh" class="form-select form-select-sm">
                  <option value="1" ${it.residual_likelihood == 1 ? 'selected' : ''}>1 - Rare</option>
                  <option value="2" ${it.residual_likelihood == 2 ? 'selected' : ''}>2 - Unlikely</option>
                  <option value="3" ${it.residual_likelihood == 3 ? 'selected' : ''}>3 - Moderate</option>
                  <option value="4" ${it.residual_likelihood == 4 ? 'selected' : ''}>4 - Likely</option>
                  <option value="5" ${it.residual_likelihood == 5 ? 'selected' : ''}>5 - Almost Certain</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">Residual ความรุนแรง (1-5)</label>
                <select id="f-tpr-res-imp" class="form-select form-select-sm">
                  <option value="1" ${it.residual_impact == 1 ? 'selected' : ''}>1 - Insignificant</option>
                  <option value="2" ${it.residual_impact == 2 ? 'selected' : ''}>2 - Minor</option>
                  <option value="3" ${it.residual_impact == 3 ? 'selected' : ''}>3 - Moderate</option>
                  <option value="4" ${it.residual_impact == 4 ? 'selected' : ''}>4 - Significant</option>
                  <option value="5" ${it.residual_impact == 5 ? 'selected' : ''}>5 - Severe</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; font-size:12px; color:#334155;">Residual Score</label>
                <input type="text" id="f-tpr-res-score" class="form-control form-control-sm" value="${it.residual_risk_level || 3}" readonly style="font-weight:800; background:#fff;" />
              </div>
            </div>

            <div>
              <label style="font-weight:700; font-size:12px; color:#334155;">ดำเนินการเพิ่มเติมเพื่อลดความเสี่ยงให้น้อยลงอีก (Further Actions)</label>
              <input type="text" id="f-tpr-further" class="form-control form-control-sm" value="${it.further_actions || ''}" placeholder="เช่น เฝ้าติดตามเป็นระยะ" />
            </div>
          </div>
        </div>

        <div style="background:#f8fafc; padding:14px 20px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px;">
          <button id="cancel-tpr-item-modal" class="btn btn-sm btn-secondary">ยกเลิก</button>
          <button id="save-tpr-item-modal" class="btn btn-sm btn-primary">💾 บันทึกรายการ</button>
        </div>
      </div>
    </div>
  `

  const close = () => { modalEl.innerHTML = '' }
  modalEl.querySelector('#close-tpr-item-modal').onclick = close
  modalEl.querySelector('#cancel-tpr-item-modal').onclick = close

  // Recalculate scores
  const recalcP1 = () => {
    const l = Number(modalEl.querySelector('#f-tpr-lh').value) || 1
    const i = Number(modalEl.querySelector('#f-tpr-imp').value) || 1
    modalEl.querySelector('#f-tpr-score').value = l * i
  }
  modalEl.querySelector('#f-tpr-lh').onchange = recalcP1
  modalEl.querySelector('#f-tpr-imp').onchange = recalcP1

  const recalcP2 = () => {
    const l = Number(modalEl.querySelector('#f-tpr-res-lh').value) || 1
    const i = Number(modalEl.querySelector('#f-tpr-res-imp').value) || 1
    modalEl.querySelector('#f-tpr-res-score').value = l * i
  }
  modalEl.querySelector('#f-tpr-res-lh').onchange = recalcP2
  modalEl.querySelector('#f-tpr-res-imp').onchange = recalcP2

  modalEl.querySelector('#save-tpr-item-modal').onclick = () => {
    const title = modalEl.querySelector('#f-tpr-title').value.trim()
    if (!title) {
      alert('กรุณากรอกประเด็นความเสี่ยง / ข้อกำหนด (Title)')
      return
    }

    const lh1 = Number(modalEl.querySelector('#f-tpr-lh').value) || 1
    const imp1 = Number(modalEl.querySelector('#f-tpr-imp').value) || 1
    const lh2 = Number(modalEl.querySelector('#f-tpr-res-lh').value) || 1
    const imp2 = Number(modalEl.querySelector('#f-tpr-res-imp').value) || 1

    const updatedItem = {
      ...it,
      item_no: modalEl.querySelector('#f-tpr-no').value.trim() || '1.1',
      cluster_id: Number(modalEl.querySelector('#f-tpr-cid').value) || 1,
      title: title,
      threat: modalEl.querySelector('#f-tpr-threat').value.trim(),
      vulnerability: modalEl.querySelector('#f-tpr-vulner').value.trim(),
      cia: {
        c: modalEl.querySelector('#f-tpr-c').checked,
        i: modalEl.querySelector('#f-tpr-i').checked,
        a: modalEl.querySelector('#f-tpr-a').checked
      },
      severity_fsrilo: {
        f: modalEl.querySelector('#f-tpr-f').checked,
        s: modalEl.querySelector('#f-tpr-s').checked,
        r: modalEl.querySelector('#f-tpr-r').checked,
        i: modalEl.querySelector('#f-tpr-i2').checked,
        l: modalEl.querySelector('#f-tpr-l').checked,
        o: modalEl.querySelector('#f-tpr-o').checked
      },
      likelihood: lh1,
      impact: imp1,
      risk_level: lh1 * imp1,
      treatment_option: modalEl.querySelector('#f-tpr-t-opt').value,
      treatment_plan: modalEl.querySelector('#f-tpr-t-plan').value.trim(),
      responsible_person: modalEl.querySelector('#f-tpr-resp').value.trim(),
      progress_percent: Number(modalEl.querySelector('#f-tpr-prog').value) || 0,
      expected_finish_date: modalEl.querySelector('#f-tpr-exp-date').value.trim(),
      residual_cia: {
        c: modalEl.querySelector('#f-tpr-c').checked,
        i: modalEl.querySelector('#f-tpr-i').checked,
        a: modalEl.querySelector('#f-tpr-a').checked
      },
      residual_severity_fsrilo: {
        f: modalEl.querySelector('#f-tpr-f').checked,
        s: modalEl.querySelector('#f-tpr-s').checked,
        r: modalEl.querySelector('#f-tpr-r').checked,
        i: modalEl.querySelector('#f-tpr-i2').checked,
        l: modalEl.querySelector('#f-tpr-l').checked,
        o: modalEl.querySelector('#f-tpr-o').checked
      },
      residual_likelihood: lh2,
      residual_impact: imp2,
      residual_risk_level: lh2 * imp2,
      further_actions: modalEl.querySelector('#f-tpr-further').value.trim()
    }

    if (isEdit) {
      onAction({ type: 'update_item', item: updatedItem })
    } else {
      onAction({ type: 'add_item', item: updatedItem })
    }
    close()
  }
}
