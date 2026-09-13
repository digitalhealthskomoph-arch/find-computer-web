import {
  LAWFUL_BASIS_24,
  LAWFUL_BASIS_26,
  DEPARTMENTS,
  PHYSICAL_STORAGE_OPTIONS,
  ELECTRONIC_STORAGE_OPTIONS,
  TRANSFER_METHODS,
  DISPOSAL_METHODS
} from './data/ropaConstants.js'
import { getRopaRecords, saveRopaRecord } from './ropaManager.js'
import { showNotification } from '../../lib/utils.js'

let publicRopaState = {
  records: [],
  filteredRecords: [],
  searchKeyword: '',
  selectedDept: '',
  selectedYear: ''
}

export async function renderPublicRopa(container) {
  publicRopaState.records = await getRopaRecords()
  applyFilters()

  container.innerHTML = `
    <div class="public-ropa-wrapper" style="max-width:1200px; margin:0 auto; padding:0 12px;">
      <!-- Hero Banner for ROPA -->
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%); color:white; padding:32px 24px; border-radius:12px; margin-bottom:24px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span class="badge" style="background:#818cf8; color:#1e1b4b; font-size:12px; font-weight:700; padding:4px 8px; border-radius:4px;">PDPA Self-Service</span>
              <span style="color:#c7d2fe; font-size:13px;">สำหรับบุคลากรสาธารณสุขจังหวัดสระแก้ว</span>
            </div>
            <h1 style="font-size:1.6rem; font-weight:800; margin:0; line-height:1.3;">
              ทะเบียนกิจกรรมการประมวลผลข้อมูลส่วนบุคคล (ROPA)
            </h1>
            <p style="color:#e0e7ff; font-size:0.95rem; margin-top:6px; margin-bottom:0;">
              ตามมาตรา 39 แห่ง พรบ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 — บุคลากรทุกกลุ่มงานสามารถตรวจสอบ เพิ่มเติม และทบทวนกิจกรรมประจำปีได้ที่นี่
            </p>
          </div>
          <button id="public-add-ropa-btn" class="btn" style="background:#4f46e5; color:#fff; border:1px solid #818cf8; font-weight:700; padding:10px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.2);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            + บันทึกกิจกรรม ROPA ใหม่
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div id="public-ropa-stats" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:24px;"></div>

      <!-- Search & Filters -->
      <div class="card" style="padding:18px; border:1px solid #e2e8f0; border-radius:10px; background:#fff; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <div style="flex:2; min-width:240px;">
            <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">ค้นหากิจกรรม / ประเภทข้อมูล / ID</label>
            <input type="text" id="ropa-search-input" class="form-control" placeholder="พิมพ์คำค้นหา..." value="${publicRopaState.searchKeyword}" style="width:100%; font-size:14px;">
          </div>
          <div style="flex:1.5; min-width:200px;">
            <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">กรองตามกลุ่มงาน / ผู้ใช้ข้อมูล</label>
            <select id="ropa-dept-filter" class="form-control" style="width:100%; font-size:14px;">
              <option value="">-- ทุกกลุ่มงาน --</option>
              ${getDepartmentOptionsHtml()}
            </select>
          </div>
          <div style="flex:1; min-width:140px;">
            <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">ปีงบประมาณ</label>
            <select id="ropa-year-filter" class="form-control" style="width:100%; font-size:14px;">
              <option value="">-- ทุกปี --</option>
              <option value="2569" ${publicRopaState.selectedYear==='2569'?'selected':''}>ปี 2569</option>
              <option value="2568" ${publicRopaState.selectedYear==='2568'?'selected':''}>ปี 2568</option>
              <option value="2567" ${publicRopaState.selectedYear==='2567'?'selected':''}>ปี 2567</option>
              <option value="2566" ${publicRopaState.selectedYear==='2566'?'selected':''}>ปี 2566</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.05); margin-bottom:40px;">
        <div style="padding:16px 20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <h2 style="font-size:1.1rem; font-weight:700; color:#1e293b; margin:0;">
            รายการกิจกรรมในทะเบียน ROPA (${publicRopaState.filteredRecords.length} รายการ)
          </h2>
          <span style="font-size:12px; color:#64748b;">กดปุ่ม "ดูรายละเอียด" หรือ "แก้ไข / ทบทวน" เพื่อจัดการข้อมูล</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0; font-size:13px; color:#475569;">
              <tr>
                <th style="padding:12px 16px;">รหัส</th>
                <th style="padding:12px 16px;">ประเภทข้อมูลที่จัดเก็บ</th>
                <th style="padding:12px 16px;">ผู้ใช้ข้อมูล (Data Owner)</th>
                <th style="padding:12px 16px;">วัตถุประสงค์การจัดเก็บ</th>
                <th style="padding:12px 16px;">การจัดประเภท</th>
                <th style="padding:12px 16px;">ฐานกฎหมาย</th>
                <th style="padding:12px 16px;">ทบทวนล่าสุด</th>
                <th style="padding:12px 16px; text-align:center; min-width:180px;">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody id="public-ropa-tbody">
              ${renderTableRowsHtml()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Container -->
      <div id="public-ropa-modal-container"></div>
    </div>
  `

  renderStatsHtml()
  bindEvents(container)
}

function getDepartmentOptionsHtml() {
  const depts = DEPARTMENTS
  return depts.map(d => `<option value="${d}" ${publicRopaState.selectedDept === d ? 'selected' : ''}>${d}</option>`).join('')
}

function renderStatsHtml() {
  const statsEl = document.getElementById('public-ropa-stats')
  if (!statsEl) return

  const total = publicRopaState.records.length
  const sensitive = publicRopaState.records.filter(r => (r.classification || '').includes('Sensitive') || (r.classification || '').includes('อ่อนไหว')).length
  const currentYearUpdated = publicRopaState.records.filter(r => r.updatedYear === '2568' || r.updatedYear === '2569').length

  statsEl.innerHTML = `
    <div class="card" style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
      <div style="font-size:12px; color:#64748b; font-weight:600;">กิจกรรมในทะเบียนทั้งหมด</div>
      <div style="font-size:1.8rem; font-weight:800; color:#1e1b4b; margin-top:4px;">${total} รายการ</div>
    </div>
    <div class="card" style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
      <div style="font-size:12px; color:#64748b; font-weight:600;">ทบทวนแล้วในปีนี้ (2568-2569)</div>
      <div style="font-size:1.8rem; font-weight:800; color:#10b981; margin-top:4px;">${currentYearUpdated} รายการ</div>
    </div>
    <div class="card" style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
      <div style="font-size:12px; color:#64748b; font-weight:600;">ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive)</div>
      <div style="font-size:1.8rem; font-weight:800; color:#db2777; margin-top:4px;">${sensitive} รายการ</div>
    </div>
  `
}

function renderTableRowsHtml() {
  if (publicRopaState.filteredRecords.length === 0) {
    return '<tr><td colspan="8" style="padding:32px; text-align:center; color:#94a3b8;">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</td></tr>'
  }

  return publicRopaState.filteredRecords.map(r => {
    const isSensitive = (r.classification || '').includes('Sensitive') || (r.classification || '').includes('อ่อนไหว')
    const displayClass = isSensitive ? 'ข้อมูลอ่อนไหว (Sensitive)' : 'ข้อมูลทั่วไป (Personal)'
    const ownerName = r.dataOwner || r.department || '-'

    return `
      <tr style="border-bottom:1px solid #e2e8f0; font-size:14px;">
        <td style="padding:12px 16px; font-weight:700; color:#4338ca; white-space:nowrap;">${r.id}</td>
        <td style="padding:12px 16px; font-weight:600; color:#1e293b; max-width:220px;">
          ${r.dataType || r.activityName || '-'}
        </td>
        <td style="padding:12px 16px; color:#475569; font-size:13px; max-width:180px;">${ownerName}</td>
        <td style="padding:12px 16px; color:#334155; font-size:13px; max-width:220px; line-height:1.4;">
          ${r.purposeCollection || '-'}
        </td>
        <td style="padding:12px 16px;">
          <span class="badge" style="background:${isSensitive ? '#fce7f3' : '#e0e7ff'}; color:${isSensitive ? '#9d174d' : '#3730a3'}; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px; white-space:nowrap;">
            ${displayClass}
          </span>
        </td>
        <td style="padding:12px 16px; font-size:12px; color:#0f766e; font-weight:600; max-width:180px;">
          <div>${r.lawfulBasis24 || '-'}</div>
          ${r.lawfulBasis26 && r.lawfulBasis26 !== 'None' && r.lawfulBasis26 !== 'N/A (ไม่ใช่ข้อมูลอ่อนไหว)' ? `<div style="color:#b45309; font-size:11px;">+ ${r.lawfulBasis26}</div>` : ''}
        </td>
        <td style="padding:12px 16px; font-size:12px; color:#64748b; white-space:nowrap;">
          <span style="display:block; font-weight:600; color:#1e293b;">ปี ${r.updatedYear || '2568'}</span>
          <span style="font-size:11px; color:#94a3b8;">${r.updatedBy ? r.updatedBy.substring(0, 18) : 'เจ้าหน้าที่'}</span>
        </td>
        <td style="padding:12px 16px; text-align:center; white-space:nowrap;">
          <button class="btn view-ropa-btn" data-id="${r.id}" style="background:#f8fafc; border:1px solid #cbd5e1; color:#334155; padding:5px 10px; font-size:12px; font-weight:600; border-radius:6px; cursor:pointer; margin-right:6px; display:inline-flex; align-items:center; gap:4px;">
            👁️ ดูรายละเอียด
          </button>
          <button class="btn edit-ropa-btn" data-id="${r.id}" style="background:#eef2ff; border:1px solid #c7d2fe; color:#4338ca; padding:5px 10px; font-size:12px; font-weight:600; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
            ✏️ แก้ไข
          </button>
        </td>
      </tr>
    `
  }).join('')
}

function applyFilters() {
  publicRopaState.filteredRecords = publicRopaState.records.filter(r => {
    const q = publicRopaState.searchKeyword.toLowerCase()
    const matchKeyword = !q || 
      (r.dataType && r.dataType.toLowerCase().includes(q)) ||
      (r.activityName && r.activityName.toLowerCase().includes(q)) ||
      (r.purposeCollection && r.purposeCollection.toLowerCase().includes(q)) ||
      (r.id && r.id.toLowerCase().includes(q))

    const dept = r.dataOwner || r.department || ''
    const matchDept = !publicRopaState.selectedDept || dept === publicRopaState.selectedDept
    const matchYear = !publicRopaState.selectedYear || r.updatedYear === publicRopaState.selectedYear

    return matchKeyword && matchDept && matchYear
  })
}

function bindEvents(container) {
  // Search input
  const searchInput = document.getElementById('ropa-search-input')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      publicRopaState.searchKeyword = e.target.value.trim()
      applyFilters()
      const tbody = document.getElementById('public-ropa-tbody')
      if (tbody) tbody.innerHTML = renderTableRowsHtml()
      bindTableButtons(container)
    })
  }

  // Dept filter
  const deptFilter = document.getElementById('ropa-dept-filter')
  if (deptFilter) {
    deptFilter.addEventListener('change', (e) => {
      publicRopaState.selectedDept = e.target.value
      applyFilters()
      const tbody = document.getElementById('public-ropa-tbody')
      if (tbody) tbody.innerHTML = renderTableRowsHtml()
      bindTableButtons(container)
    })
  }

  // Year filter
  const yearFilter = document.getElementById('ropa-year-filter')
  if (yearFilter) {
    yearFilter.addEventListener('change', (e) => {
      publicRopaState.selectedYear = e.target.value
      applyFilters()
      const tbody = document.getElementById('public-ropa-tbody')
      if (tbody) tbody.innerHTML = renderTableRowsHtml()
      bindTableButtons(container)
    })
  }

  // Add button
  const addBtn = document.getElementById('public-add-ropa-btn')
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openRopaModal(null, container, false)
    })
  }

  bindTableButtons(container)
}

function bindTableButtons(container) {
  // View Details (Read-only)
  container.querySelectorAll('.view-ropa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const record = publicRopaState.records.find(r => r.id === id)
      if (record) {
        openRopaModal(record, container, true)
      }
    })
  })

  // Edit / Review
  container.querySelectorAll('.edit-ropa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const record = publicRopaState.records.find(r => r.id === id)
      if (record) {
        openRopaModal(record, container, false)
      }
    })
  })
}

/**
 * ROPA Modal Form directly replicating ropa_system/form.html
 * 6 Sections + Data Security + Annual Review
 */
function openRopaModal(record, container, isReadOnly = false) {
  const isEdit = !!record
  const modalContainer = document.getElementById('public-ropa-modal-container')
  if (!modalContainer) return

  const disabledAttr = isReadOnly ? 'disabled' : ''
  const disabledBg = isReadOnly ? 'background:#f8fafc; color:#1e293b;' : ''

  // Options
  const basis24Opts = LAWFUL_BASIS_24.map(b => 
    `<option value="${b.value}" ${record?.lawfulBasis24 === b.value ? 'selected' : ''}>${b.label}</option>`
  ).join('')

  const basis26Opts = LAWFUL_BASIS_26.map(b => 
    `<option value="${b.value}" ${record?.lawfulBasis26 === b.value ? 'selected' : ''}>${b.label}</option>`
  ).join('')

  const deptOwnerOpts = DEPARTMENTS.map(d => 
    `<option value="${d}" ${(record?.dataOwner === d || record?.department === d) ? 'selected' : ''}>${d}</option>`
  ).join('')

  const physStorageOpts = PHYSICAL_STORAGE_OPTIONS.map(p => 
    `<option value="${p}" ${record?.physicalStorage === p ? 'selected' : ''}>${p}</option>`
  ).join('')

  const elecStorageOpts = ELECTRONIC_STORAGE_OPTIONS.map(e => 
    `<option value="${e}" ${record?.electronicStorage === e ? 'selected' : ''}>${e}</option>`
  ).join('')

  const transferOpts = TRANSFER_METHODS.map(t => 
    `<option value="${t}" ${record?.transferMethod === t ? 'selected' : ''}>${t}</option>`
  ).join('')

  const disposalOpts = DISPOSAL_METHODS.map(d => 
    `<option value="${d}" ${record?.disposalMethod === d ? 'selected' : ''}>${d}</option>`
  ).join('')

  const isSensitive = (record?.classification || '').includes('Sensitive') || (record?.classification || '').includes('อ่อนไหว')

  modalContainer.innerHTML = `
    <div class="modal-overlay" id="ropa-modal-overlay" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px;">
      <div class="modal" style="background:#fff; border-radius:12px; width:100%; max-width:860px; max-height:92vh; display:flex; flex-direction:column; box-shadow:0 20px 25px -5px rgba(0,0,0,0.3); overflow:hidden;">
        
        <!-- Header -->
        <div class="modal-header" style="background:${isReadOnly ? '#f1f5f9' : '#1e1b4b'}; color:${isReadOnly ? '#1e293b' : '#fff'}; border-bottom:1px solid #cbd5e1; padding:18px 24px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="margin:0; font-size:1.2rem; font-weight:700;">
              ${isReadOnly ? `📄 รายละเอียดข้อมูล ROPA (${record.id})` : (isEdit ? `✏️ แก้ไข / ทบทวนรายการ ROPA (${record.id})` : '+ บันทึกรายการ ROPA ใหม่')}
            </h3>
            <p style="margin:4px 0 0 0; font-size:0.85rem; color:${isReadOnly ? '#64748b' : '#c7d2fe'};">
              ตามแบบบันทึกกิจกรรมการประมวลผลข้อมูลส่วนบุคคล สำนักงานสาธารณสุขจังหวัดสระแก้ว
            </p>
          </div>
          <button id="close-ropa-modal-btn" style="background:none; border:none; font-size:24px; color:${isReadOnly ? '#64748b' : '#fff'}; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <!-- Scrollable Form Body -->
        <form id="ropa-full-form" style="padding:24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:24px;">
          <input type="hidden" id="f-id" value="${record?.id || ''}">

          <!-- Section 1: General Info -->
          <div class="form-section-card" style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
            <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:14px; border-bottom:2px solid #6366f1; padding-bottom:6px; display:flex; justify-content:space-between;">
              <span>ส่วนที่ 1: ข้อมูลทั่วไป</span>
              ${record?.id ? `<span style="font-size:12px; color:#6366f1; font-weight:600;">ID: ${record.id}</span>` : ''}
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  ประเภทของข้อมูลที่จัดเก็บ <span style="color:red">*</span>
                </label>
                <input type="text" id="f-dataType" class="form-control" ${disabledAttr} required 
                  placeholder="เช่น ชื่อ-สกุล, เบอร์โทร, ที่อยู่, ผลตรวจทางห้องปฏิบัติการ" 
                  value="${record?.dataType || record?.activityName || ''}" style="${disabledBg}">
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  Data Classification <span style="color:red">*</span>
                </label>
                <select id="f-classification" class="form-control" ${disabledAttr} required style="${disabledBg}">
                  <option value="Personal Data" ${!isSensitive ? 'selected' : ''}>ข้อมูลส่วนบุคคลทั่วไป (Personal Data)</option>
                  <option value="Sensitive Personal Data" ${isSensitive ? 'selected' : ''}>ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Personal Data)</option>
                </select>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:14px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  ฐานการประมวลผล (มาตรา 24) <span style="color:red">*</span>
                </label>
                <select id="f-basis24" class="form-control" ${disabledAttr} required style="${disabledBg}">
                  ${basis24Opts}
                </select>
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  ฐานการประมวลผล (มาตรา 26) <span style="color:red">*</span>
                </label>
                <select id="f-basis26" class="form-control" ${disabledAttr} required style="${disabledBg}">
                  ${basis26Opts}
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Collection -->
          <div class="form-section-card" style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
            <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:14px; border-bottom:2px solid #0284c7; padding-bottom:6px;">
              ส่วนที่ 2: การเก็บรวบรวม
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                วัตถุประสงค์การจัดเก็บ <span style="color:red">*</span>
              </label>
              <textarea id="f-purposeCollection" class="form-control" rows="2" ${disabledAttr} required 
                placeholder="เช่น เพื่อการเบิกจ่ายสวัสดิการ, เพื่อการวินิจฉัยและรักษาพยาบาล" style="${disabledBg}">${record?.purposeCollection || ''}</textarea>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  ผู้ใช้ข้อมูล (Data Owner) / กลุ่มงาน <span style="color:red">*</span>
                </label>
                <select id="f-dataOwner" class="form-control" ${disabledAttr} required style="${disabledBg}">
                  ${deptOwnerOpts}
                </select>
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  รูปแบบการนำเข้าข้อมูล
                </label>
                <input type="text" id="f-importMethod" class="form-control" ${disabledAttr}
                  placeholder="เช่น จากระบบงานภายใน, จากเจ้าของข้อมูลโดยตรง" 
                  value="${record?.importMethod || ''}" style="${disabledBg}">
              </div>
            </div>
            <div style="margin-top:14px;">
              <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                ส่วนที่ใช้ในการจัดเก็บ / แหล่งที่มา
              </label>
              <input type="text" id="f-collectionSource" class="form-control" ${disabledAttr}
                placeholder="เช่น เอกสารใบสมัคร, Google Form, เวชระเบียน" 
                value="${record?.collectionSource || ''}" style="${disabledBg}">
            </div>
          </div>

          <!-- Section 3: Storage -->
          <div class="form-section-card" style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
            <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:14px; border-bottom:2px solid #0d9488; padding-bottom:6px;">
              ส่วนที่ 3: การเก็บรักษา
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  สถานที่จัดเก็บทางกายภาพ
                </label>
                <select id="f-physicalStorage" class="form-control" ${disabledAttr} style="${disabledBg}">
                  <option value="">-- เลือก --</option>
                  ${physStorageOpts}
                </select>
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  สถานที่เก็บทางอิเล็กทรอนิกส์
                </label>
                <select id="f-electronicStorage" class="form-control" ${disabledAttr} style="${disabledBg}">
                  <option value="">-- เลือก --</option>
                  ${eleStorageOpts}
                </select>
              </div>
            </div>
          </div>

          <!-- Section 4: Internal Use -->
          <div class="form-section-card" style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
            <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:14px; border-bottom:2px solid #eab308; padding-bottom:6px;">
              ส่วนที่ 4: การใช้ในองค์กร
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                วัตถุประสงค์การใช้ / การเข้าถึง
              </label>
              <textarea id="f-purposeInternal" class="form-control" rows="2" ${disabledAttr} 
                placeholder="ระบุวัตถุประสงค์การใช้งานภายในกลุ่มงานหรือข้ามกลุ่มงาน" style="${disabledBg}">${record?.purposeInternal || ''}</textarea>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  กลุ่มงานผู้ขอใช้ข้อมูล
                </label>
                <input type="text" id="f-requestingUnit" class="form-control" ${disabledAttr}
                  placeholder="ระบุกลุ่มงานอื่นที่ขอใช้ เช่น ทุกกลุ่มงาน" 
                  value="${record?.requestingUnit || ''}" style="${disabledBg}">
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  กลุ่มงานผู้ขอเข้าถึงข้อมูล (เช่น IT)
                </label>
                <input type="text" id="f-accessingUnit" class="form-control" ${disabledAttr}
                  placeholder="ระบุกลุ่มงานที่เข้าถึงระบบได้ เช่น IT / ผู้ดูแลระบบ" 
                  value="${record?.accessingUnit || ''}" style="${disabledBg}">
              </div>
            </div>
          </div>

          <!-- Section 5: External Disclosure -->
          <div class="form-section-card" style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
            <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:14px; border-bottom:2px solid #f97316; padding-bottom:6px;">
              ส่วนที่ 5: การเปิดเผยภายนอก
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                วัตถุประสงค์การเปิดเผย
              </label>
              <textarea id="f-purposeExternal" class="form-control" rows="2" ${disabledAttr} 
                placeholder="ระบุวัตถุประสงค์กรณีมีการเปิดเผยข้อมูลให้บุคคลหรือหน่วยงานภายนอก" style="${disabledBg}">${record?.purposeExternal || ''}</textarea>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  องค์กรที่เปิดเผยข้อมูลให้
                </label>
                <input type="text" id="f-externalOrg" class="form-control" ${disabledAttr}
                  placeholder="เช่น สป.สธ., กรมบัญชีกลาง, สปสช." 
                  value="${record?.externalOrg || ''}" style="${disabledBg}">
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  รูปแบบการโอนข้อมูล
                </label>
                <select id="f-transferMethod" class="form-control" ${disabledAttr} style="${disabledBg}">
                  <option value="">-- เลือก --</option>
                  ${transferOpts}
                </select>
              </div>
            </div>
          </div>

          <!-- Section 6: Retention & Disposal -->
          <div class="form-section-card" style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
            <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:14px; border-bottom:2px solid #ef4444; padding-bottom:6px;">
              ส่วนที่ 6: ระยะเวลาและการทำลาย
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  ระยะเวลาการจัดเก็บ
                </label>
                <input type="text" id="f-retentionPeriod" class="form-control" ${disabledAttr}
                  placeholder="เช่น 5 ปี, 10 ปี นับจากพ้นสภาพ" 
                  value="${record?.retentionPeriod || ''}" style="${disabledBg}">
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  วิธีการทำลายข้อมูล
                </label>
                <select id="f-disposalMethod" class="form-control" ${disabledAttr} style="${disabledBg}">
                  <option value="">-- เลือก --</option>
                  ${disposalOpts}
                </select>
              </div>
            </div>
          </div>

          <!-- Data Security -->
          <div class="form-section-card" style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
            <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:14px; border-bottom:2px solid #8b5cf6; padding-bottom:6px;">
              Data Security (มาตรการรักษาความมั่นคงปลอดภัย)
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  มาตรการเชิงเทคนิค (Technical Measures)
                </label>
                <input type="text" id="f-techMeasures" class="form-control" ${disabledAttr}
                  placeholder="เช่น Encryption, Access Control, 2FA, Backup" 
                  value="${record?.techMeasures || ''}" style="${disabledBg}">
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  มาตรการเชิงองค์กร (Organizational Measures)
                </label>
                <input type="text" id="f-orgMeasures" class="form-control" ${disabledAttr}
                  placeholder="เช่น นโยบายคุ้มครองข้อมูล, การอบรมบุคลากร, ข้อตกลง NDA" 
                  value="${record?.orgMeasures || ''}" style="${disabledBg}">
              </div>
            </div>
          </div>

          <!-- Annual Review -->
          <div class="form-section-card" style="border:1px solid #cbd5e1; border-radius:8px; padding:16px; background:#f1f5f9;">
            <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:14px; border-bottom:2px solid #475569; padding-bottom:6px;">
              🗓️ ข้อมูลการทบทวนและปรับปรุงข้อมูลประจำปี
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  ปีงบประมาณที่ทบทวน <span style="color:red">*</span>
                </label>
                <select id="f-updatedYear" class="form-control" ${disabledAttr} required style="${disabledBg}">
                  <option value="2569" ${record?.updatedYear === '2569' ? 'selected' : ''}>2569</option>
                  <option value="2568" ${record?.updatedYear === '2568' ? 'selected' : (!record ? 'selected' : '')}>2568 (ปัจจุบัน)</option>
                  <option value="2567" ${record?.updatedYear === '2567' ? 'selected' : ''}>2567</option>
                  <option value="2566" ${record?.updatedYear === '2566' ? 'selected' : ''}>2566</option>
                </select>
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:4px;">
                  ผู้บันทึก / ปรับปรุงข้อมูล <span style="color:red">*</span>
                </label>
                <input type="text" id="f-updatedBy" class="form-control" ${disabledAttr} required 
                  placeholder="เช่น นายสมชาย ใจดี (นักวิชาการสาธารณสุข)" 
                  value="${record?.updatedBy || ''}" style="${disabledBg}">
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px; padding-top:16px; border-top:1px solid #e2e8f0;">
            ${isReadOnly ? `
              <button type="button" id="m-close-btn" class="btn" style="background:#f1f5f9; color:#475569; font-weight:600; padding:9px 18px; border-radius:6px; min-width:100px;">
                ปิด
              </button>
              <button type="button" id="m-switch-edit-btn" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca; font-weight:700; padding:9px 18px; border-radius:6px; display:inline-flex; align-items:center; gap:6px;">
                ✏️ เข้าสู่โหมดแก้ไข
              </button>
            ` : `
              <button type="button" id="m-cancel-btn" class="btn" style="background:#f1f5f9; color:#475569; font-weight:600; padding:9px 18px; border-radius:6px; min-width:100px;">
                ยกเลิก
              </button>
              <button type="submit" id="m-submit-btn" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca; font-weight:700; padding:9px 22px; border-radius:6px; display:inline-flex; align-items:center; gap:6px;">
                💾 บันทึกข้อมูล
              </button>
            `}
          </div>
        </form>
      </div>
    </div>
  `

  const closeModal = () => { modalContainer.innerHTML = '' }

  // Header Close
  const closeHeaderBtn = document.getElementById('close-ropa-modal-btn')
  if (closeHeaderBtn) closeHeaderBtn.addEventListener('click', closeModal)

  if (isReadOnly) {
    const closeBtn = document.getElementById('m-close-btn')
    const switchEditBtn = document.getElementById('m-switch-edit-btn')
    if (closeBtn) closeBtn.addEventListener('click', closeModal)
    if (switchEditBtn) {
      switchEditBtn.addEventListener('click', () => {
        openRopaModal(record, container, false)
      })
    }
  } else {
    const cancelBtn = document.getElementById('m-cancel-btn')
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal)

    const form = document.getElementById('ropa-full-form')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const submitBtn = document.getElementById('m-submit-btn')
      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = 'กำลังบันทึก...'
      }

      const now = new Date()
      const yearMonth = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0')
      const randNum = Math.floor(1000 + Math.random() * 9000)
      const recordId = record?.id || `${yearMonth}-${randNum}`

      const updatedRecord = {
        id: recordId,
        dataType: document.getElementById('f-dataType').value.trim(),
        activityName: document.getElementById('f-dataType').value.trim(),
        classification: document.getElementById('f-classification').value,
        lawfulBasis24: document.getElementById('f-basis24').value,
        lawfulBasis26: document.getElementById('f-basis26').value,
        purposeCollection: document.getElementById('f-purposeCollection').value.trim(),
        dataOwner: document.getElementById('f-dataOwner').value,
        department: document.getElementById('f-dataOwner').value,
        importMethod: document.getElementById('f-importMethod').value.trim(),
        collectionSource: document.getElementById('f-collectionSource').value.trim(),
        physicalStorage: document.getElementById('f-physicalStorage').value,
        electronicStorage: document.getElementById('f-electronicStorage').value,
        purposeInternal: document.getElementById('f-purposeInternal').value.trim(),
        requestingUnit: document.getElementById('f-requestingUnit').value.trim(),
        accessingUnit: document.getElementById('f-accessingUnit').value.trim(),
        purposeExternal: document.getElementById('f-purposeExternal').value.trim(),
        externalOrg: document.getElementById('f-externalOrg').value.trim(),
        transferMethod: document.getElementById('f-transferMethod').value,
        retentionPeriod: document.getElementById('f-retentionPeriod').value.trim(),
        disposalMethod: document.getElementById('f-disposalMethod').value,
        techMeasures: document.getElementById('f-techMeasures').value.trim(),
        orgMeasures: document.getElementById('f-orgMeasures').value.trim(),
        updatedYear: document.getElementById('f-updatedYear').value,
        updatedBy: document.getElementById('f-updatedBy').value.trim(),
        createdAt: record?.createdAt || now.toISOString()
      }

      await saveRopaRecord(updatedRecord)
      closeModal()
      showNotification(isEdit ? 'อัปเดตข้อมูล ROPA เรียบร้อยแล้ว' : 'บันทึกรายการ ROPA ใหม่เรียบร้อยแล้ว', 'success')
      await renderPublicRopa(container)
    })
  }
}
