import {
  LAWFUL_BASIS_24,
  LAWFUL_BASIS_26,
  DEPARTMENTS,
  PHYSICAL_STORAGE_OPTIONS,
  ELECTRONIC_STORAGE_OPTIONS,
  TRANSFER_METHODS,
  DISPOSAL_METHODS
} from './data/ropaConstants.js'
import { getRopaRecords, saveRopaRecord, deleteRopaRecord } from './ropaManager.js'
import { showNotification } from '../../lib/utils.js'

let pdpaState = {
  activeTab: 'ropa',
  records: [],
  editingRecord: null,
  breaches: []
}

// Load breaches from localStorage if available (no mockups)
try {
  const savedBreaches = localStorage.getItem('sko_pdpa_breaches')
  if (savedBreaches) {
    pdpaState.breaches = JSON.parse(savedBreaches)
  }
} catch (e) {}

export async function renderPdpaModule(container) {
  pdpaState.records = await getRopaRecords()

  container.innerHTML = `
    <div class="module-wrapper">
      <!-- PDPA Module Header -->
      <div class="module-header" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span class="badge" style="background:#818cf8; color:#1e1b4b; font-size:12px; font-weight:700; padding:4px 8px; border-radius:4px;">PDPA Compliance</span>
              <span style="color:#c7d2fe; font-size:13px;">พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</span>
            </div>
            <h1 style="font-size:1.5rem; font-weight:700; margin:0; line-height:1.3;">
              ระบบธรรมาภิบาลข้อมูลและทะเบียนกิจกรรมประมวลผล (ROPA & PDPA)
            </h1>
            <p style="color:#e0e7ff; font-size:0.9rem; margin-top:4px; margin-bottom:0;">
              บันทึกรายการประมวลผลข้อมูลส่วนบุคคล (ROPA) และการกำกับดูแล Data Governance สสจ.สระแก้ว
            </p>
          </div>
          <div id="ropa-quick-stat" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); padding:12px 20px; border-radius:8px; text-align:center;">
            <div style="font-size:12px; color:#c7d2fe;">กิจกรรมในทะเบียน ROPA</div>
            <div id="ropa-count-badge" style="font-size:1.6rem; font-weight:800; color:#a5b4fc;">${pdpaState.records.length} รายการ</div>
          </div>
        </div>
      </div>

      <!-- PDPA Tabs Nav -->
      <div class="tab-nav" style="display:flex; border-bottom:2px solid #e2e8f0; margin-bottom:24px; gap:8px; overflow-x:auto;">
        <button class="pdpa-tab-btn ${pdpaState.activeTab === 'ropa' ? 'active' : ''}" data-tab="ropa" style="padding:10px 18px; border:none; background:none; font-weight:600; font-size:15px; cursor:pointer; display:flex; align-items:center; gap:8px; border-bottom:3px solid ${pdpaState.activeTab === 'ropa' ? '#4f46e5' : 'transparent'}; color:${pdpaState.activeTab === 'ropa' ? '#4f46e5' : '#64748b'};">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          ทะเบียนกิจกรรมประมวลผล (ROPA Dashboard)
        </button>
        <button class="pdpa-tab-btn ${pdpaState.activeTab === 'form' ? 'active' : ''}" data-tab="form" style="padding:10px 18px; border:none; background:none; font-weight:600; font-size:15px; cursor:pointer; display:flex; align-items:center; gap:8px; border-bottom:3px solid ${pdpaState.activeTab === 'form' ? '#4f46e5' : 'transparent'}; color:${pdpaState.activeTab === 'form' ? '#4f46e5' : '#64748b'};">
          ${pdpaState.editingRecord ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            แก้ไขกิจกรรม ROPA (${pdpaState.editingRecord.id})
          ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            บันทึกกิจกรรม ROPA ใหม่
          `}
        </button>
        <button class="pdpa-tab-btn ${pdpaState.activeTab === 'breach' ? 'active' : ''}" data-tab="breach" style="padding:10px 18px; border:none; background:none; font-weight:600; font-size:15px; cursor:pointer; display:flex; align-items:center; gap:8px; border-bottom:3px solid ${pdpaState.activeTab === 'breach' ? '#4f46e5' : 'transparent'}; color:${pdpaState.activeTab === 'breach' ? '#4f46e5' : '#64748b'};">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          รายงานการละเมิดข้อมูล (Data Breach)
        </button>
      </div>

      <!-- Tab Contents -->
      <div id="pdpa-tab-content"></div>

      <!-- Details Modal for Admin -->
      <div id="admin-ropa-modal-container"></div>
    </div>
  `

  bindPdpaTabEvents(container)
  renderActivePdpaTab(container)
}

function bindPdpaTabEvents(container) {
  container.querySelectorAll('.pdpa-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab
      if (targetTab === 'ropa') {
        pdpaState.editingRecord = null
      }
      pdpaState.activeTab = targetTab
      renderPdpaModule(container)
    })
  })
}

function renderActivePdpaTab(container) {
  const contentEl = document.getElementById('pdpa-tab-content')
  if (!contentEl) return

  if (pdpaState.activeTab === 'ropa') {
    renderRopaList(contentEl, container)
  } else if (pdpaState.activeTab === 'form') {
    renderRopaForm(contentEl, container)
  } else if (pdpaState.activeTab === 'breach') {
    renderBreachList(contentEl)
  }
}

// ==========================================
// 1. ROPA List Tab
// ==========================================
function renderRopaList(el, container) {
  const sensitiveCount = pdpaState.records.filter(r => (r.classification || '').includes('Sensitive') || (r.classification || '').includes('อ่อนไหว')).length
  const currentYearUpdated = pdpaState.records.filter(r => r.updatedYear === '2568' || r.updatedYear === '2569').length

  const rowsHtml = pdpaState.records.map(r => {
    const isSensitive = (r.classification || '').includes('Sensitive') || (r.classification || '').includes('อ่อนไหว')
    const displayClass = isSensitive ? 'ข้อมูลอ่อนไหว (Sensitive)' : 'ข้อมูลทั่วไป (Personal)'
    const ownerName = r.dataOwner || r.department || '-'

    return `
      <tr style="border-bottom:1px solid #e2e8f0; font-size:14px;">
        <td style="padding:12px; font-weight:700; color:#4338ca; white-space:nowrap;">${r.id}</td>
        <td style="padding:12px; font-weight:600; color:#1e293b; max-width:220px;">${r.dataType || r.activityName || '-'}</td>
        <td style="padding:12px; color:#475569; font-size:13px; max-width:180px;">${ownerName}</td>
        <td style="padding:12px; color:#334155; font-size:13px; max-width:220px; line-height:1.4;">${r.purposeCollection || '-'}</td>
        <td style="padding:12px;">
          <span class="badge" style="background:${isSensitive ? '#fce7f3' : '#e0e7ff'}; color:${isSensitive ? '#9d174d' : '#3730a3'}; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px; white-space:nowrap;">
            ${displayClass}
          </span>
        </td>
        <td style="padding:12px; font-size:12px; color:#0f766e; font-weight:600; max-width:180px;">
          <div>${r.lawfulBasis24 || '-'}</div>
          ${r.lawfulBasis26 && r.lawfulBasis26 !== 'None' && r.lawfulBasis26 !== 'N/A (ไม่ใช่ข้อมูลอ่อนไหว)' ? `<div style="color:#b45309; font-size:11px;">+ ${r.lawfulBasis26}</div>` : ''}
        </td>
        <td style="padding:12px; font-size:12px; color:#64748b; white-space:nowrap;">
          <div style="font-weight:600; color:#1e293b;">ปี ${r.updatedYear || '2568'}</div>
          <div style="font-size:11px; color:#94a3b8;">${r.updatedBy ? r.updatedBy.substring(0, 18) : 'เจ้าหน้าที่'}</div>
        </td>
        <td style="padding:12px; text-align:center; white-space:nowrap;">
          <button class="btn view-ropa-btn" data-id="${r.id}" style="background:#f8fafc; border:1px solid #cbd5e1; color:#334155; padding:4px 8px; font-size:12px; font-weight:600; border-radius:4px; cursor:pointer; margin-right:4px;">
            👁️ ดู
          </button>
          <button class="btn edit-ropa-btn" data-id="${r.id}" style="background:#eef2ff; border:1px solid #c7d2fe; color:#4338ca; padding:4px 8px; font-size:12px; font-weight:600; border-radius:4px; cursor:pointer; margin-right:4px;">
            ✏️ แก้ไข
          </button>
          <button class="btn delete-ropa-btn" data-id="${r.id}" style="background:#fff; border:1px solid #fca5a5; color:#ef4444; padding:4px 8px; font-size:12px; border-radius:4px; cursor:pointer;">
            ลบ
          </button>
        </td>
      </tr>
    `
  }).join('')

  el.innerHTML = `
    <div>
      <!-- Stats Cards -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:24px;">
        <div class="card" style="padding:18px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
          <div style="font-size:12px; color:#64748b; font-weight:600;">กิจกรรมในทะเบียนทั้งหมด</div>
          <div style="font-size:1.8rem; font-weight:800; color:#1e1b4b; margin-top:4px;">${pdpaState.records.length} รายการ</div>
        </div>
        <div class="card" style="padding:18px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
          <div style="font-size:12px; color:#64748b; font-weight:600;">ข้อมูลส่วนบุคคลอ่อนไหว (ม.26)</div>
          <div style="font-size:1.8rem; font-weight:800; color:#db2777; margin-top:4px;">${sensitiveCount} รายการ</div>
        </div>
        <div class="card" style="padding:18px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
          <div style="font-size:12px; color:#64748b; font-weight:600;">ทบทวนแล้วรอบปี (2568-2569)</div>
          <div style="font-size:1.8rem; font-weight:800; color:#059669; margin-top:4px;">${currentYearUpdated} รายการ</div>
        </div>
      </div>

      <!-- Action Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h2 style="font-size:1.15rem; font-weight:700; color:#1e293b; margin:0;">
          รายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล (ROPA Records)
        </h2>
        <button id="add-ropa-shortcut-btn" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca; font-size:13px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          + เพิ่มกิจกรรมใหม่
        </button>
      </div>

      <!-- Records Table -->
      <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0; font-size:13px; color:#475569;">
            <tr>
              <th style="padding:12px;">รหัส</th>
              <th style="padding:12px;">ประเภทข้อมูลที่จัดเก็บ</th>
              <th style="padding:12px;">ผู้ใช้ข้อมูล (Data Owner)</th>
              <th style="padding:12px;">วัตถุประสงค์การจัดเก็บ</th>
              <th style="padding:12px;">การจัดประเภท</th>
              <th style="padding:12px;">ฐานกฎหมาย</th>
              <th style="padding:12px;">ทบทวนล่าสุด</th>
              <th style="padding:12px; text-align:center; min-width:160px;">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="8" style="padding:32px; text-align:center; color:#94a3b8;">ยังไม่มีข้อมูลในทะเบียน ROPA</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `

  const shortcutBtn = document.getElementById('add-ropa-shortcut-btn')
  if (shortcutBtn) {
    shortcutBtn.addEventListener('click', () => {
      pdpaState.editingRecord = null
      pdpaState.activeTab = 'form'
      renderPdpaModule(container)
    })
  }

  // View Details (Read-only modal)
  el.querySelectorAll('.view-ropa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const record = pdpaState.records.find(r => r.id === id)
      if (record) {
        openAdminViewModal(record, container)
      }
    })
  })

  // Edit record
  el.querySelectorAll('.edit-ropa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const record = pdpaState.records.find(r => r.id === id)
      if (record) {
        pdpaState.editingRecord = record
        pdpaState.activeTab = 'form'
        renderPdpaModule(container)
      }
    })
  })

  // Delete record
  el.querySelectorAll('.delete-ropa-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id
      if (confirm(`ยืนยันการลบรายการ ROPA รหัส ${id} ออกจากระบบหรือไม่?`)) {
        await deleteRopaRecord(id)
        showNotification('ลบรายการเรียบร้อยแล้ว', 'info')
        renderPdpaModule(container)
      }
    })
  })
}

/**
 * View Details Modal in Admin Mode
 */
function openAdminViewModal(record, container) {
  const modalContainer = document.getElementById('admin-ropa-modal-container')
  if (!modalContainer) return

  const isSensitive = (record?.classification || '').includes('Sensitive') || (record?.classification || '').includes('อ่อนไหว')

  modalContainer.innerHTML = `
    <div class="modal-overlay" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px;">
      <div class="modal" style="background:#fff; border-radius:12px; width:100%; max-width:820px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 20px 25px -5px rgba(0,0,0,0.3); overflow:hidden;">
        <div class="modal-header" style="background:#f1f5f9; color:#1e293b; border-bottom:1px solid #cbd5e1; padding:16px 24px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:700;">
            📄 รายละเอียดข้อมูล ROPA (${record.id})
          </h3>
          <button id="admin-close-view-btn" style="background:none; border:none; font-size:24px; color:#64748b; cursor:pointer;">&times;</button>
        </div>
        <div style="padding:24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:16px; font-size:14px;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="font-weight:700; color:#4338ca; margin-bottom:8px;">ส่วนที่ 1: ข้อมูลทั่วไป</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>ประเภทข้อมูล:</strong> ${record.dataType || record.activityName || '-'}</div>
              <div><strong>Data Classification:</strong> ${isSensitive ? 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)' : 'ข้อมูลส่วนบุคคลทั่วไป (Personal Data)'}</div>
              <div><strong>ฐานกฎหมาย (ม.24):</strong> ${record.lawfulBasis24 || '-'}</div>
              <div><strong>ฐานกฎหมาย (ม.26):</strong> ${record.lawfulBasis26 || '-'}</div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="font-weight:700; color:#0284c7; margin-bottom:8px;">ส่วนที่ 2: การเก็บรวบรวม</div>
            <p style="margin:0 0 8px 0;"><strong>วัตถุประสงค์การจัดเก็บ:</strong> ${record.purposeCollection || '-'}</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>ผู้ใช้ข้อมูล (Data Owner):</strong> ${record.dataOwner || record.department || '-'}</div>
              <div><strong>รูปแบบการนำเข้า:</strong> ${record.importMethod || '-'}</div>
              <div><strong>ส่วนที่ใช้ในการจัดเก็บ:</strong> ${record.collectionSource || '-'}</div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="font-weight:700; color:#0d9488; margin-bottom:8px;">ส่วนที่ 3: การเก็บรักษา</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>จัดเก็บทางกายภาพ:</strong> ${record.physicalStorage || '-'}</div>
              <div><strong>เก็บทางอิเล็กทรอนิกส์:</strong> ${record.electronicStorage || '-'}</div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="font-weight:700; color:#ca8a04; margin-bottom:8px;">ส่วนที่ 4: การใช้ในองค์กร</div>
            <p style="margin:0 0 8px 0;"><strong>วัตถุประสงค์การใช้/เข้าถึง:</strong> ${record.purposeInternal || '-'}</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>กลุ่มงานผู้ขอใช้:</strong> ${record.requestingUnit || '-'}</div>
              <div><strong>กลุ่มงานผู้ขอเข้าถึง:</strong> ${record.accessingUnit || '-'}</div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="font-weight:700; color:#ea580c; margin-bottom:8px;">ส่วนที่ 5: การเปิดเผยภายนอก</div>
            <p style="margin:0 0 8px 0;"><strong>วัตถุประสงค์การเปิดเผย:</strong> ${record.purposeExternal || '-'}</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>องค์กรที่เปิดเผยให้:</strong> ${record.externalOrg || '-'}</div>
              <div><strong>รูปแบบการโอนข้อมูล:</strong> ${record.transferMethod || '-'}</div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="font-weight:700; color:#dc2626; margin-bottom:8px;">ส่วนที่ 6: ระยะเวลาและการทำลาย</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>ระยะเวลาการจัดเก็บ:</strong> ${record.retentionPeriod || '-'}</div>
              <div><strong>วิธีการทำลาย:</strong> ${record.disposalMethod || '-'}</div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="font-weight:700; color:#7c3aed; margin-bottom:8px;">Data Security</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>มาตรการเชิงเทคนิค:</strong> ${record.techMeasures || '-'}</div>
              <div><strong>มาตรการเชิงองค์กร:</strong> ${record.orgMeasures || '-'}</div>
            </div>
          </div>

          <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; padding:14px;">
            <div style="font-weight:700; color:#334155; margin-bottom:8px;">การทบทวนประจำปี</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div><strong>ปีงบประมาณ:</strong> ${record.updatedYear || '2568'}</div>
              <div><strong>ผู้บันทึก/ทบทวน:</strong> ${record.updatedBy || '-'}</div>
            </div>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; padding:14px 24px; border-top:1px solid #e2e8f0; background:#fff;">
          <button id="admin-close-btn2" class="btn" style="background:#f1f5f9; color:#475569;">ปิด</button>
          <button id="admin-switch-edit-btn" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca;">
            ✏️ แก้ไขรายการนี้
          </button>
        </div>
      </div>
    </div>
  `

  const close = () => { modalContainer.innerHTML = '' }
  document.getElementById('admin-close-view-btn')?.addEventListener('click', close)
  document.getElementById('admin-close-btn2')?.addEventListener('click', close)
  document.getElementById('admin-switch-edit-btn')?.addEventListener('click', () => {
    close()
    pdpaState.editingRecord = record
    pdpaState.activeTab = 'form'
    renderPdpaModule(container)
  })
}

// ==========================================
// 2. Add / Edit ROPA Form Tab (6 Sections + Data Security)
// ==========================================
function renderRopaForm(el, container) {
  const rec = pdpaState.editingRecord
  const isEdit = !!rec

  const basis24Options = LAWFUL_BASIS_24.map(b => 
    `<option value="${b.value}" ${rec?.lawfulBasis24 === b.value ? 'selected' : ''}>${b.label}</option>`
  ).join('')

  const basis26Options = LAWFUL_BASIS_26.map(b => 
    `<option value="${b.value}" ${rec?.lawfulBasis26 === b.value ? 'selected' : ''}>${b.label}</option>`
  ).join('')

  const deptOwnerOptions = DEPARTMENTS.map(d => 
    `<option value="${d}" ${(rec?.dataOwner === d || rec?.department === d) ? 'selected' : ''}>${d}</option>`
  ).join('')

  const physStorageOpts = PHYSICAL_STORAGE_OPTIONS.map(p => 
    `<option value="${p}" ${rec?.physicalStorage === p ? 'selected' : ''}>${p}</option>`
  ).join('')

  const eleStorageOpts = ELECTRONIC_STORAGE_OPTIONS.map(e => 
    `<option value="${e}" ${rec?.electronicStorage === e ? 'selected' : ''}>${e}</option>`
  ).join('')

  const transferOpts = TRANSFER_METHODS.map(t => 
    `<option value="${t}" ${rec?.transferMethod === t ? 'selected' : ''}>${t}</option>`
  ).join('')

  const disposalOpts = DISPOSAL_METHODS.map(d => 
    `<option value="${d}" ${rec?.disposalMethod === d ? 'selected' : ''}>${d}</option>`
  ).join('')

  const isSensitive = (rec?.classification || '').includes('Sensitive') || (rec?.classification || '').includes('อ่อนไหว')

  el.innerHTML = `
    <div style="max-width:860px; margin:0 auto;">
      <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:flex-end;">
        <div>
          <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:4px;">
            ${isEdit ? `✏️ แก้ไข / ทบทวนกิจกรรม ROPA (${rec.id})` : 'แบบบันทึกกิจกรรมการประมวลผลข้อมูลส่วนบุคคล (ROPA)'}
          </h2>
          <p style="color:#64748b; font-size:0.9rem; margin:0;">
            บันทึกรายละเอียดตามมาตรา 39 แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
          </p>
        </div>
        <button id="cancel-form-top-btn" class="btn" style="background:#f1f5f9; color:#475569; font-size:13px;">
          ← กลับหน้ารายการ
        </button>
      </div>

      <form id="ropa-entry-form" class="card" style="border:1px solid #cbd5e1; border-radius:12px; padding:24px; background:#fff; display:flex; flex-direction:column; gap:20px;">
        <input type="hidden" id="admin-f-id" value="${rec?.id || ''}">

        <!-- Section 1 -->
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
          <div style="font-weight:700; font-size:14px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #6366f1; padding-bottom:4px;">
            ส่วนที่ 1: ข้อมูลทั่วไป
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">ประเภทของข้อมูลที่จัดเก็บ <span style="color:red">*</span></label>
              <input type="text" id="admin-f-dataType" class="form-control" value="${rec?.dataType || rec?.activityName || ''}" placeholder="เช่น ชื่อ-สกุล, เบอร์โทร, ข้อมูลประวัติการรักษา" required style="width:100%;">
            </div>
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">Data Classification <span style="color:red">*</span></label>
              <select id="admin-f-classification" class="form-control" style="width:100%;">
                <option value="Personal Data" ${!isSensitive ? 'selected' : ''}>ข้อมูลส่วนบุคคลทั่วไป (Personal Data)</option>
                <option value="Sensitive Personal Data" ${isSensitive ? 'selected' : ''}>ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Personal Data)</option>
              </select>
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:12px;">
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">ฐานการประมวลผล (มาตรา 24) <span style="color:red">*</span></label>
              <select id="admin-f-basis24" class="form-control" style="width:100%;">
                ${basis24Options}
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">ฐานการประมวลผล (มาตรา 26) <span style="color:red">*</span></label>
              <select id="admin-f-basis26" class="form-control" style="width:100%;">
                ${basis26Options}
              </select>
            </div>
          </div>
        </div>

        <!-- Section 2 -->
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
          <div style="font-weight:700; font-size:14px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #0284c7; padding-bottom:4px;">
            ส่วนที่ 2: การเก็บรวบรวม
          </div>
          <div style="margin-bottom:12px;">
            <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">วัตถุประสงค์การจัดเก็บ <span style="color:red">*</span></label>
            <textarea id="admin-f-purposeCollection" class="form-control" rows="2" placeholder="ระบุวัตถุประสงค์การจัดเก็บตามหน้าที่..." required style="width:100%;">${rec?.purposeCollection || ''}</textarea>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">ผู้ใช้ข้อมูล (Data Owner) / กลุ่มงาน <span style="color:red">*</span></label>
              <select id="admin-f-dataOwner" class="form-control" style="width:100%;">
                ${deptOwnerOptions}
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">รูปแบบการนำเข้าข้อมูล</label>
              <input type="text" id="admin-f-importMethod" class="form-control" value="${rec?.importMethod || ''}" placeholder="เช่น จากระบบงานภายใน, จากเจ้าของข้อมูลโดยตรง" style="width:100%;">
            </div>
          </div>
          <div style="margin-top:12px;">
            <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">ส่วนที่ใช้ในการจัดเก็บ / แหล่งที่มา</label>
            <input type="text" id="admin-f-collectionSource" class="form-control" value="${rec?.collectionSource || ''}" placeholder="เช่น เอกสารใบสมัคร, Google Form, เวชระเบียน" style="width:100%;">
          </div>
        </div>

        <!-- Section 3 -->
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
          <div style="font-weight:700; font-size:14px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #0d9488; padding-bottom:4px;">
            ส่วนที่ 3: การเก็บรักษา
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">สถานที่จัดเก็บทางกายภาพ</label>
              <select id="admin-f-physicalStorage" class="form-control" style="width:100%;">
                <option value="">-- เลือก --</option>
                ${physStorageOpts}
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">สถานที่เก็บทางอิเล็กทรอนิกส์</label>
              <select id="admin-f-electronicStorage" class="form-control" style="width:100%;">
                <option value="">-- เลือก --</option>
                ${eleStorageOpts}
              </select>
            </div>
          </div>
        </div>

        <!-- Section 4 -->
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
          <div style="font-weight:700; font-size:14px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #eab308; padding-bottom:4px;">
            ส่วนที่ 4: การใช้ในองค์กร
          </div>
          <div style="margin-bottom:12px;">
            <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">วัตถุประสงค์การใช้ / การเข้าถึง</label>
            <textarea id="admin-f-purposeInternal" class="form-control" rows="2" placeholder="ระบุวัตถุประสงค์การใช้งานภายใน" style="width:100%;">${rec?.purposeInternal || ''}</textarea>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">กลุ่มงานผู้ขอใช้ข้อมูล</label>
              <input type="text" id="admin-f-requestingUnit" class="form-control" value="${rec?.requestingUnit || ''}" placeholder="ระบุกลุ่มงานอื่นที่ขอใช้ เช่น ทุกกลุ่มงาน" style="width:100%;">
            </div>
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">กลุ่มงานผู้ขอเข้าถึงข้อมูล (เช่น IT)</label>
              <input type="text" id="admin-f-accessingUnit" class="form-control" value="${rec?.accessingUnit || ''}" placeholder="ระบุกลุ่มงานที่เข้าถึงระบบได้ เช่น IT" style="width:100%;">
            </div>
          </div>
        </div>

        <!-- Section 5 -->
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
          <div style="font-weight:700; font-size:14px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #f97316; padding-bottom:4px;">
            ส่วนที่ 5: การเปิดเผยภายนอก
          </div>
          <div style="margin-bottom:12px;">
            <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">วัตถุประสงค์การเปิดเผย</label>
            <textarea id="admin-f-purposeExternal" class="form-control" rows="2" placeholder="ระบุวัตถุประสงค์กรณีเปิดเผยภายนอก" style="width:100%;">${rec?.purposeExternal || ''}</textarea>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">องค์กรที่เปิดเผยข้อมูลให้</label>
              <input type="text" id="admin-f-externalOrg" class="form-control" value="${rec?.externalOrg || ''}" placeholder="เช่น สป.สธ., กรมบัญชีกลาง" style="width:100%;">
            </div>
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">รูปแบบการโอนข้อมูล</label>
              <select id="admin-f-transferMethod" class="form-control" style="width:100%;">
                <option value="">-- เลือก --</option>
                ${transferOpts}
              </select>
            </div>
          </div>
        </div>

        <!-- Section 6 -->
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
          <div style="font-weight:700; font-size:14px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #ef4444; padding-bottom:4px;">
            ส่วนที่ 6: ระยะเวลาและการทำลาย
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">ระยะเวลาการจัดเก็บ</label>
              <input type="text" id="admin-f-retentionPeriod" class="form-control" value="${rec?.retentionPeriod || ''}" placeholder="เช่น 5 ปี, 10 ปี" style="width:100%;">
            </div>
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">วิธีการทำลายข้อมูล</label>
              <select id="admin-f-disposalMethod" class="form-control" style="width:100%;">
                <option value="">-- เลือก --</option>
                ${disposalOpts}
              </select>
            </div>
          </div>
        </div>

        <!-- Data Security -->
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fbfcfe;">
          <div style="font-weight:700; font-size:14px; color:#1e293b; margin-bottom:12px; border-bottom:2px solid #8b5cf6; padding-bottom:4px;">
            Data Security (มาตรการรักษาความมั่นคงปลอดภัย)
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">มาตรการเชิงเทคนิค</label>
              <input type="text" id="admin-f-techMeasures" class="form-control" value="${rec?.techMeasures || ''}" placeholder="เช่น Encryption, Access Control, RBAC" style="width:100%;">
            </div>
            <div>
              <label class="form-label" style="font-weight:600; color:#1e293b; margin-bottom:4px; display:block; font-size:13px;">มาตรการเชิงองค์กร</label>
              <input type="text" id="admin-f-orgMeasures" class="form-control" value="${rec?.orgMeasures || ''}" placeholder="เช่น นโยบาย PDPA, NDA, การอบรมบุคลากร" style="width:100%;">
            </div>
          </div>
        </div>

        <!-- Annual Review Section -->
        <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; padding:16px;">
          <div style="font-size:13px; font-weight:700; color:#334155; margin-bottom:10px;">
            🗓️ ข้อมูลการทบทวนและปรับปรุงข้อมูลประจำปี
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b; margin-bottom:4px; display:block;">ปีงบประมาณที่อัปเดต *</label>
              <select id="admin-f-updatedYear" class="form-control" style="width:100%;">
                <option value="2569" ${rec?.updatedYear === '2569' ? 'selected' : ''}>2569</option>
                <option value="2568" ${rec?.updatedYear === '2568' ? 'selected' : (!rec ? 'selected' : '')}>2568 (ปัจจุบัน)</option>
                <option value="2567" ${rec?.updatedYear === '2567' ? 'selected' : ''}>2567</option>
                <option value="2566" ${rec?.updatedYear === '2566' ? 'selected' : ''}>2566</option>
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b; margin-bottom:4px; display:block;">ผู้บันทึก / ทบทวนข้อมูล *</label>
              <input type="text" id="admin-f-updatedBy" class="form-control" value="${rec?.updatedBy || 'ผู้ดูแลระบบ PDPA สสจ.สระแก้ว'}" required style="width:100%;">
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid #e2e8f0; padding-top:16px;">
          <button type="button" id="cancel-ropa-btn" class="btn" style="background:#f1f5f9; color:#475569;">ยกเลิก</button>
          <button type="submit" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca; font-weight:700;">
            💾 ${isEdit ? 'บันทึกการแก้ไข' : 'บันทึกลงทะเบียน ROPA'}
          </button>
        </div>
      </form>
    </div>
  `

  const goBack = () => {
    pdpaState.editingRecord = null
    pdpaState.activeTab = 'ropa'
    renderPdpaModule(container)
  }

  document.getElementById('cancel-form-top-btn')?.addEventListener('click', goBack)
  document.getElementById('cancel-ropa-btn')?.addEventListener('click', goBack)

  document.getElementById('ropa-entry-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const now = new Date()
    const yearMonth = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0')
    const randNum = Math.floor(1000 + Math.random() * 9000)
    const recordId = rec?.id || `${yearMonth}-${randNum}`

    const newRecord = {
      id: recordId,
      dataType: document.getElementById('admin-f-dataType').value.trim(),
      activityName: document.getElementById('admin-f-dataType').value.trim(),
      classification: document.getElementById('admin-f-classification').value,
      lawfulBasis24: document.getElementById('admin-f-basis24').value,
      lawfulBasis26: document.getElementById('admin-f-basis26').value,
      purposeCollection: document.getElementById('admin-f-purposeCollection').value.trim(),
      dataOwner: document.getElementById('admin-f-dataOwner').value,
      department: document.getElementById('admin-f-dataOwner').value,
      importMethod: document.getElementById('admin-f-importMethod').value.trim(),
      collectionSource: document.getElementById('admin-f-collectionSource').value.trim(),
      physicalStorage: document.getElementById('admin-f-physicalStorage').value,
      electronicStorage: document.getElementById('admin-f-electronicStorage').value,
      purposeInternal: document.getElementById('admin-f-purposeInternal').value.trim(),
      requestingUnit: document.getElementById('admin-f-requestingUnit').value.trim(),
      accessingUnit: document.getElementById('admin-f-accessingUnit').value.trim(),
      purposeExternal: document.getElementById('admin-f-purposeExternal').value.trim(),
      externalOrg: document.getElementById('admin-f-externalOrg').value.trim(),
      transferMethod: document.getElementById('admin-f-transferMethod').value,
      retentionPeriod: document.getElementById('admin-f-retentionPeriod').value.trim(),
      disposalMethod: document.getElementById('admin-f-disposalMethod').value,
      techMeasures: document.getElementById('admin-f-techMeasures').value.trim(),
      orgMeasures: document.getElementById('admin-f-orgMeasures').value.trim(),
      updatedYear: document.getElementById('admin-f-updatedYear').value,
      updatedBy: document.getElementById('admin-f-updatedBy').value.trim(),
      createdAt: rec?.createdAt || now.toISOString()
    }

    await saveRopaRecord(newRecord)
    pdpaState.editingRecord = null
    pdpaState.activeTab = 'ropa'
    showNotification(isEdit ? 'อัปเดตกิจกรรม ROPA เรียบร้อยแล้ว' : 'บันทึกกิจกรรม ROPA เรียบร้อยแล้ว', 'success')
    renderPdpaModule(container)
  })
}

// ==========================================
// 3. Breach Reports Tab (Real Data / No Mockups)
// ==========================================
function renderBreachList(el) {
  const breachesHtml = pdpaState.breaches.map(b => `
    <tr style="border-bottom:1px solid #e2e8f0; font-size:14px;">
      <td style="padding:12px; font-weight:700; color:#6366f1;">${b.id}</td>
      <td style="padding:12px; color:#64748b;">${b.reportedAt}</td>
      <td style="padding:12px; font-weight:600; color:#1e293b;">${b.agency}</td>
      <td style="padding:12px; color:#334155;">${b.breachDetail}</td>
      <td style="padding:12px; text-align:center; font-weight:700; color:#b91c1c;">${b.affectedCount} คน</td>
      <td style="padding:12px;">
        <span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700; padding:2px 8px; border-radius:4px;">
          ${b.severity}
        </span>
      </td>
      <td style="padding:12px; font-size:12px; color:#475569;">${b.actionTaken}</td>
    </tr>
  `).join('')

  el.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:4px;">ทะเบียนรายงานการละเมิดข้อมูลส่วนบุคคล (Data Breach)</h2>
          <p style="color:#64748b; font-size:0.9rem; margin:0;">
            การแจ้งเหตุละเมิดข้อมูลส่วนบุคคลตามมาตรา 37(4) ต้องรายงานเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ภายใน 72 ชั่วโมง
          </p>
        </div>
        <button id="add-breach-btn" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca; display:inline-flex; align-items:center; gap:6px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
          รายงานการละเมิดข้อมูลใหม่
        </button>
      </div>

      <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0; font-size:13px; color:#475569;">
            <tr>
              <th style="padding:12px;">รหัสเหตุการณ์</th>
              <th style="padding:12px;">วันเวลาที่แจ้ง</th>
              <th style="padding:12px;">หน่วยงาน</th>
              <th style="padding:12px;">ลักษณะการละเมิด</th>
              <th style="padding:12px; text-align:center;">ผู้ได้รับผลกระทบ</th>
              <th style="padding:12px;">ความรุนแรง</th>
              <th style="padding:12px;">การแก้ไขเบื้องต้น</th>
            </tr>
          </thead>
          <tbody>
            ${breachesHtml || '<tr><td colspan="7" style="padding:32px; text-align:center; color:#94a3b8;">ยังไม่มีประวัติการแจ้งเหตุละเมิดข้อมูลส่วนบุคคล (Data Breach)</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `

  const addBtn = document.getElementById('add-breach-btn')
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const agency = prompt('ระบุหน่วยงานที่พบการละเมิดข้อมูล:')
      if (!agency) return
      const detail = prompt('ระบุลักษณะการละเมิดข้อมูล (เช่น ส่งอีเมลผิดคน, บัญชีถูกแฮก):')
      if (!detail) return
      const count = prompt('ประมาณการจำนวนเจ้าของข้อมูลที่ได้รับผลกระทบ (คน):') || '1'

      const newBreach = {
        id: `DB-${new Date().getFullYear() + 543}-${String(pdpaState.breaches.length + 1).padStart(3, '0')}`,
        reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        agency: agency,
        breachDetail: detail,
        affectedCount: parseInt(count) || 1,
        severity: 'Medium',
        notifiedDPO: true,
        actionTaken: 'รับแจ้งเหตุแล้ว แจ้งเตือนเจ้าของข้อมูลและดำเนินการควบคุมความเสียหาย'
      }

      pdpaState.breaches.unshift(newBreach)
      try {
        localStorage.setItem('sko_pdpa_breaches', JSON.stringify(pdpaState.breaches))
      } catch (e) {}
      showNotification('บันทึกรายงานการละเมิดข้อมูลเรียบร้อยแล้ว', 'success')
      renderBreachList(el)
    })
  }
}
