import {
  LAWFUL_BASIS_24,
  LAWFUL_BASIS_26,
  DATA_CATEGORIES,
  DATA_OWNERS
} from './data/ropaConstants.js'
import { getRopaRecords, saveRopaRecord } from './ropaManager.js'
import { showNotification } from '../../lib/utils.js'

let publicRopaState = {
  records: [],
  filteredRecords: [],
  searchKeyword: '',
  selectedDept: '',
  selectedYear: '',
  editingRecord: null // null for add, object for edit
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
            <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">ค้นหากิจกรรม / ประเภทข้อมูล</label>
            <input type="text" id="ropa-search-input" class="form-control" placeholder="พิมพ์คำค้นหา..." value="${publicRopaState.searchKeyword}" style="width:100%; font-size:14px;">
          </div>
          <div style="flex:1.5; min-width:200px;">
            <label style="font-size:12px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">กรองตามกลุ่มงาน / ฝ่าย</label>
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
          <span style="font-size:12px; color:#64748b;">กดปุ่ม "แก้ไข / ทบทวน" เพื่ออัปเดตข้อมูลประจำปี</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0; font-size:13px; color:#475569;">
              <tr>
                <th style="padding:12px 16px;">รหัส</th>
                <th style="padding:12px 16px;">ชื่อกิจกรรมประมวลผล</th>
                <th style="padding:12px 16px;">กลุ่มงาน/ฝ่าย</th>
                <th style="padding:12px 16px;">ประเภทข้อมูล</th>
                <th style="padding:12px 16px;">การจัดประเภท</th>
                <th style="padding:12px 16px;">ฐานกฎหมาย</th>
                <th style="padding:12px 16px;">อัปเดตล่าสุด</th>
                <th style="padding:12px 16px; text-align:center;">การดำเนินการ</th>
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
  const depts = [...new Set(publicRopaState.records.map(r => r.department).filter(Boolean))].sort()
  return depts.map(d => `<option value="${d}" ${publicRopaState.selectedDept === d ? 'selected' : ''}>${d}</option>`).join('')
}

function renderStatsHtml() {
  const statsEl = document.getElementById('public-ropa-stats')
  if (!statsEl) return

  const total = publicRopaState.records.length
  const sensitive = publicRopaState.records.filter(r => (r.classification || '').includes('อ่อนไหว')).length
  const currentYearUpdated = publicRopaState.records.filter(r => r.updatedYear === '2567' || r.updatedYear === '2568').length

  statsEl.innerHTML = `
    <div class="card" style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
      <div style="font-size:12px; color:#64748b; font-weight:600;">กิจกรรมในทะเบียนทั้งหมด</div>
      <div style="font-size:1.8rem; font-weight:800; color:#1e1b4b; margin-top:4px;">${total} รายการ</div>
    </div>
    <div class="card" style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
      <div style="font-size:12px; color:#64748b; font-weight:600;">ทบทวนแล้วในปีนี้ (2567-2568)</div>
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

  return publicRopaState.filteredRecords.map((r, idx) => `
    <tr style="border-bottom:1px solid #e2e8f0; font-size:14px;">
      <td style="padding:12px 16px; font-weight:700; color:#4338ca;">${r.id}</td>
      <td style="padding:12px 16px; font-weight:600; color:#1e293b; max-width:240px;">${r.activityName}</td>
      <td style="padding:12px 16px; color:#475569; font-size:13px;">${r.department}</td>
      <td style="padding:12px 16px; color:#334155; font-size:13px; max-width:200px;">${r.dataType}</td>
      <td style="padding:12px 16px;">
        <span class="badge" style="background:${(r.classification || '').includes('อ่อนไหว') ? '#fce7f3' : '#e0e7ff'}; color:${(r.classification || '').includes('อ่อนไหว') ? '#9d174d' : '#3730a3'}; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px;">
          ${r.classification}
        </span>
      </td>
      <td style="padding:12px 16px; font-size:12px; color:#0f766e; font-weight:600;">
        ${r.lawfulBasis24} ${r.lawfulBasis26 && r.lawfulBasis26 !== 'None' ? `+ ${r.lawfulBasis26}` : ''}
      </td>
      <td style="padding:12px 16px; font-size:12px; color:#64748b;">
        <span style="display:block; font-weight:600; color:#1e293b;">ปี ${r.updatedYear || '2567'}</span>
        <span style="font-size:11px; color:#94a3b8;">โดย: ${r.updatedBy || 'เจ้าหน้าที่'}</span>
      </td>
      <td style="padding:12px 16px; text-align:center;">
        <button class="btn edit-ropa-btn" data-id="${r.id}" style="background:#eef2ff; border:1px solid #c7d2fe; color:#4338ca; padding:6px 12px; font-size:12px; font-weight:600; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          แก้ไข / ทบทวน
        </button>
      </td>
    </tr>
  `).join('')
}

function applyFilters() {
  publicRopaState.filteredRecords = publicRopaState.records.filter(r => {
    const matchKeyword = !publicRopaState.searchKeyword || 
      (r.activityName && r.activityName.toLowerCase().includes(publicRopaState.searchKeyword.toLowerCase())) ||
      (r.dataType && r.dataType.toLowerCase().includes(publicRopaState.searchKeyword.toLowerCase())) ||
      (r.id && r.id.toLowerCase().includes(publicRopaState.searchKeyword.toLowerCase()))

    const matchDept = !publicRopaState.selectedDept || r.department === publicRopaState.selectedDept
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
      openRopaModal(null, container)
    })
  }

  bindTableButtons(container)
}

function bindTableButtons(container) {
  container.querySelectorAll('.edit-ropa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const record = publicRopaState.records.find(r => r.id === id)
      if (record) {
        openRopaModal(record, container)
      }
    })
  })
}

function openRopaModal(record, container) {
  const isEdit = !!record
  const modalContainer = document.getElementById('public-ropa-modal-container')
  if (!modalContainer) return

  const basis24Opts = LAWFUL_BASIS_24.map(b => `<option value="${b.value}" ${record?.lawfulBasis24 === b.value ? 'selected' : ''}>${b.label}</option>`).join('')
  const basis26Opts = LAWFUL_BASIS_26.map(b => `<option value="${b.value}" ${record?.lawfulBasis26 === b.value ? 'selected' : ''}>${b.label}</option>`).join('')
  const catOpts = DATA_CATEGORIES.map(c => `<option value="${c}" ${record?.dataType === c ? 'selected' : ''}>${c}</option>`).join('')
  const ownerOpts = DATA_OWNERS.map(o => `<option value="${o}" ${record?.dataOwner === o ? 'selected' : ''}>${o}</option>`).join('')

  modalContainer.innerHTML = `
    <div class="modal-overlay" id="ropa-modal-overlay">
      <div class="modal" style="max-width:760px; width:100%; border-radius:12px; overflow:hidden;">
        <div class="modal-header" style="background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:16px 24px;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:700; color:#1e1b4b;">
            ${isEdit ? `✏️ แก้ไข / ทบทวนกิจกรรม ROPA (${record.id})` : '+ บันทึกกิจกรรมประมวลผลข้อมูลใหม่'}
          </h3>
          <button id="close-ropa-modal-btn" class="modal-close">&times;</button>
        </div>

        <form id="public-ropa-modal-form" style="padding:24px; max-height:calc(85vh - 120px); overflow-y:auto;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">ชื่อกิจกรรมการประมวลผล *</label>
              <input type="text" id="m-ropa-activity" class="form-control" value="${record?.activityName || ''}" required placeholder="เช่น การบันทึกประวัติผู้ป่วยนอก">
            </div>
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">กลุ่มงาน / ฝ่ายที่รับผิดชอบ *</label>
              <input type="text" id="m-ropa-dept" class="form-control" value="${record?.department || ''}" required placeholder="เช่น กลุ่มงานประกันสุขภาพ">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">ประเภทข้อมูลส่วนบุคคล *</label>
              <select id="m-ropa-cat" class="form-control">
                ${catOpts}
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">การจัดประเภทข้อมูล *</label>
              <select id="m-ropa-class" class="form-control">
                <option value="ข้อมูลส่วนบุคคลทั่วไป" ${record?.classification === 'ข้อมูลส่วนบุคคลทั่วไป' ? 'selected' : ''}>ข้อมูลส่วนบุคคลทั่วไป</option>
                <option value="ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)" ${record?.classification?.includes('อ่อนไหว') ? 'selected' : ''}>ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">ฐานความชอบธรรมฯ (ม.24) *</label>
              <select id="m-ropa-basis24" class="form-control">
                ${basis24Opts}
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">ข้อยกเว้นข้อมูลอ่อนไหว (ม.26)</label>
              <select id="m-ropa-basis26" class="form-control">
                ${basis26Opts}
              </select>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">วัตถุประสงค์ในการเก็บรวบรวมและใช้ *</label>
            <textarea id="m-ropa-purpose" class="form-control" rows="2" required placeholder="ระบุวัตถุประสงค์ตามกฎหมาย...">${record?.purposeCollection || ''}</textarea>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">กลุ่มเจ้าของข้อมูลส่วนบุคคล</label>
              <select id="m-ropa-owner" class="form-control">
                ${ownerOpts}
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">ระยะเวลาจัดเก็บ *</label>
              <input type="text" id="m-ropa-retention" class="form-control" value="${record?.retentionPeriod || '10 ปี นับแต่เข้ารับบริการครั้งสุดท้าย'}" required>
            </div>
          </div>

          <!-- Annual tracking section -->
          <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; padding:16px; margin-bottom:20px;">
            <div style="font-size:13px; font-weight:700; color:#334155; margin-bottom:10px;">
              🗓️ ข้อมูลการทบทวนและปรับปรุงข้อมูลประจำปี
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">ปีงบประมาณที่อัปเดต *</label>
                <select id="m-ropa-year" class="form-control">
                  <option value="2569" ${record?.updatedYear === '2569' ? 'selected' : ''}>2569</option>
                  <option value="2568" ${record?.updatedYear === '2568' ? 'selected' : (!record ? 'selected' : '')}>2568 (ปัจจุบัน)</option>
                  <option value="2567" ${record?.updatedYear === '2567' ? 'selected' : ''}>2567</option>
                  <option value="2566" ${record?.updatedYear === '2566' ? 'selected' : ''}>2566</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b;">ชื่อ-สกุล ผู้บันทึก/ปรับปรุงข้อมูล *</label>
                <input type="text" id="m-ropa-updater" class="form-control" value="${record?.updatedBy || ''}" required placeholder="เช่น นายสมชาย ใจดี (นักวิชาการสาธารณสุข)">
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #e2e8f0; padding-top:16px;">
            <button type="button" id="m-cancel-btn" class="btn" style="background:#f1f5f9; color:#475569;">ยกเลิก</button>
            <button type="submit" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca;">
              💾 บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  `

  const closeBtn = document.getElementById('close-ropa-modal-btn')
  const cancelBtn = document.getElementById('m-cancel-btn')
  const form = document.getElementById('public-ropa-modal-form')

  const closeModal = () => { modalContainer.innerHTML = '' }
  if (closeBtn) closeBtn.addEventListener('click', closeModal)
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const newOrUpdated = {
      id: record?.id || `ROPA-00${publicRopaState.records.length + 1}`,
      activityName: document.getElementById('m-ropa-activity').value.trim(),
      department: document.getElementById('m-ropa-dept').value.trim(),
      dataType: document.getElementById('m-ropa-cat').value,
      classification: document.getElementById('m-ropa-class').value,
      lawfulBasis24: document.getElementById('m-ropa-basis24').value,
      lawfulBasis26: document.getElementById('m-ropa-basis26').value,
      purposeCollection: document.getElementById('m-ropa-purpose').value.trim(),
      dataOwner: document.getElementById('m-ropa-owner').value,
      retentionPeriod: document.getElementById('m-ropa-retention').value.trim(),
      techMeasures: record?.techMeasures || 'การควบคุมสิทธิ์ตามบทบาท (RBAC)',
      orgMeasures: record?.orgMeasures || 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว',
      updatedYear: document.getElementById('m-ropa-year').value,
      updatedBy: document.getElementById('m-ropa-updater').value.trim()
    }

    await saveRopaRecord(newOrUpdated)
    closeModal()
    showNotification(isEdit ? 'อัปเดตข้อมูล ROPA เรียบร้อยแล้ว' : 'เพิ่มกิจกรรม ROPA ใหม่เรียบร้อยแล้ว', 'success')
    renderPublicRopa(container)
  })
}
