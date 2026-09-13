import {
  LAWFUL_BASIS_24,
  LAWFUL_BASIS_26,
  DATA_CATEGORIES,
  DATA_OWNERS
} from './data/ropaConstants.js'
import { getRopaRecords, saveRopaRecord, deleteRopaRecord } from './ropaManager.js'
import { showNotification } from '../../lib/utils.js'

let pdpaState = {
  activeTab: 'ropa',
  records: [],
  editingRecord: null,
  breaches: [
    {
      id: 'DB-2567-001',
      reportedAt: '2024-01-20 14:30',
      agency: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
      breachDetail: 'เจ้าหน้าที่ส่งไฟล์รายชื่อผู้ป่วยโรคเรื้อรังไปยังกลุ่มไลน์ผิดกลุ่ม',
      affectedCount: 15,
      severity: 'Low',
      notifiedDPO: true,
      actionTaken: 'ขอยกเลิกข้อความทันที และประสานผู้รับแจ้งลบไฟล์ พร้อมตักเตือนและทบทวนแนวปฏิบัติ'
    }
  ]
}

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
  const sensitiveCount = pdpaState.records.filter(r => (r.classification || '').includes('อ่อนไหว')).length
  const currentYearUpdated = pdpaState.records.filter(r => r.updatedYear === '2567' || r.updatedYear === '2568').length

  const rowsHtml = pdpaState.records.map((r, i) => `
    <tr style="border-bottom:1px solid #e2e8f0; font-size:14px;">
      <td style="padding:12px; font-weight:700; color:#4338ca;">${r.id || `ROPA-00${i+1}`}</td>
      <td style="padding:12px; font-weight:600; color:#1e293b; max-width:240px;">${r.activityName}</td>
      <td style="padding:12px; color:#475569; font-size:13px;">${r.department || 'ไม่ระบุ'}</td>
      <td style="padding:12px; color:#334155; font-size:13px; max-width:180px;">${r.dataType}</td>
      <td style="padding:12px;">
        <span class="badge" style="background:${(r.classification || '').includes('อ่อนไหว') ? '#fce7f3' : '#e0e7ff'}; color:${(r.classification || '').includes('อ่อนไหว') ? '#9d174d' : '#3730a3'}; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px;">
          ${r.classification || 'ข้อมูลทั่วไป'}
        </span>
      </td>
      <td style="padding:12px; font-size:12px; color:#0f766e; font-weight:600;">
        ${r.lawfulBasis24} ${r.lawfulBasis26 && r.lawfulBasis26 !== 'None' ? `+ ${r.lawfulBasis26}` : ''}
      </td>
      <td style="padding:12px; font-size:12px; color:#64748b;">${r.retentionPeriod}</td>
      <td style="padding:12px; font-size:12px; color:#64748b;">
        <div style="font-weight:600; color:#1e293b;">ปี ${r.updatedYear || '2567'}</div>
        <div style="font-size:11px; color:#94a3b8;">${r.updatedBy || 'เจ้าหน้าที่'}</div>
      </td>
      <td style="padding:12px; text-align:center; white-space:nowrap;">
        <button class="btn edit-ropa-btn" data-id="${r.id}" style="background:#eef2ff; border:1px solid #c7d2fe; color:#4338ca; padding:4px 8px; font-size:12px; font-weight:600; border-radius:4px; cursor:pointer; margin-right:4px;">
          ✏️ แก้ไข
        </button>
        <button class="btn delete-ropa-btn" data-id="${r.id}" style="background:#fff; border:1px solid #fca5a5; color:#ef4444; padding:4px 8px; font-size:12px; border-radius:4px; cursor:pointer;">
          ลบ
        </button>
      </td>
    </tr>
  `).join('')

  el.innerHTML = `
    <div>
      <!-- Stats Cards -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:24px;">
        <div class="card" style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
          <div style="font-size:12px; color:#64748b; font-weight:600;">กิจกรรมในทะเบียนทั้งหมด</div>
          <div style="font-size:1.8rem; font-weight:800; color:#1e1b4b; margin-top:4px;">${pdpaState.records.length}</div>
        </div>
        <div class="card" style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
          <div style="font-size:12px; color:#64748b; font-weight:600;">ทบทวนแล้วในปีนี้ (2567-2568)</div>
          <div style="font-size:1.8rem; font-weight:800; color:#10b981; margin-top:4px;">${currentYearUpdated}</div>
        </div>
        <div class="card" style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fff;">
          <div style="font-size:12px; color:#64748b; font-weight:600;">ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive)</div>
          <div style="font-size:1.8rem; font-weight:800; color:#db2777; margin-top:4px;">${sensitiveCount}</div>
        </div>
      </div>

      <!-- Controls -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
        <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0;">รายการกิจกรรมประมวลผลข้อมูลส่วนบุคคล</h2>
        <button id="add-ropa-shortcut-btn" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca; display:inline-flex; align-items:center; gap:6px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          เพิ่มกิจกรรม ROPA ใหม่
        </button>
      </div>

      <!-- Table -->
      <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0; font-size:13px; color:#475569;">
            <tr>
              <th style="padding:12px;">รหัส</th>
              <th style="padding:12px;">ชื่อกิจกรรมประมวลผล</th>
              <th style="padding:12px;">กลุ่มงานที่รับผิดชอบ</th>
              <th style="padding:12px;">ประเภทข้อมูล</th>
              <th style="padding:12px;">การจัดประเภท</th>
              <th style="padding:12px;">ฐานความชอบธรรมฯ</th>
              <th style="padding:12px;">ระยะเวลาจัดเก็บ</th>
              <th style="padding:12px;">อัปเดตล่าสุด</th>
              <th style="padding:12px; text-align:center;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="9" style="padding:24px; text-align:center; color:#94a3b8;">ยังไม่มีรายการในทะเบียน ROPA</td></tr>'}
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

// ==========================================
// 2. Add / Edit ROPA Form Tab
// ==========================================
function renderRopaForm(el, container) {
  const rec = pdpaState.editingRecord
  const isEdit = !!rec

  const basis24Options = LAWFUL_BASIS_24.map(b => `<option value="${b.value}" ${rec?.lawfulBasis24 === b.value ? 'selected' : ''}>${b.label}</option>`).join('')
  const basis26Options = LAWFUL_BASIS_26.map(b => `<option value="${b.value}" ${rec?.lawfulBasis26 === b.value ? 'selected' : ''}>${b.label}</option>`).join('')
  const catOptions = DATA_CATEGORIES.map(c => `<option value="${c}" ${rec?.dataType === c ? 'selected' : ''}>${c}</option>`).join('')
  const ownerOptions = DATA_OWNERS.map(o => `<option value="${o}" ${rec?.dataOwner === o ? 'selected' : ''}>${o}</option>`).join('')

  el.innerHTML = `
    <div style="max-width:860px; margin:0 auto;">
      <div style="margin-bottom:20px;">
        <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:4px;">
          ${isEdit ? `✏️ แก้ไข / ทบทวนกิจกรรม ROPA (${rec.id})` : 'แบบบันทึกกิจกรรมการประมวลผลข้อมูลส่วนบุคคล (ROPA)'}
        </h2>
        <p style="color:#64748b; font-size:0.9rem; margin:0;">
          บันทึกรายละเอียดตามมาตรา 39 แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
        </p>
      </div>

      <form id="ropa-entry-form" class="card" style="border:1px solid #cbd5e1; border-radius:12px; padding:28px; background:#fff;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">ชื่อกิจกรรมการประมวลผล *</label>
            <input type="text" id="ropa-activity" class="form-control" value="${rec?.activityName || ''}" placeholder="เช่น การให้บริการตรวจรักษาผู้ป่วยนอก (OPD)" required style="width:100%;">
          </div>
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">กลุ่มงาน/ฝ่ายที่รับผิดชอบ *</label>
            <input type="text" id="ropa-dept" class="form-control" value="${rec?.department || ''}" placeholder="เช่น กลุ่มงานการแพทย์ / กลุ่มงานประกันสุขภาพ" required style="width:100%;">
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">ประเภทข้อมูลส่วนบุคคล *</label>
            <select id="ropa-category" class="form-control" style="width:100%;">
              ${catOptions}
            </select>
          </div>
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">การจัดประเภทข้อมูล *</label>
            <select id="ropa-classification" class="form-control" style="width:100%;">
              <option value="ข้อมูลส่วนบุคคลทั่วไป" ${rec?.classification === 'ข้อมูลส่วนบุคคลทั่วไป' ? 'selected' : ''}>ข้อมูลส่วนบุคคลทั่วไป</option>
              <option value="ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)" ${rec?.classification?.includes('อ่อนไหว') ? 'selected' : ''}>ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data - ข้อมูลสุขภาพ/ชีวภาพ)</option>
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">ฐานความชอบธรรมด้วยกฎหมาย (มาตรา 24) *</label>
            <select id="ropa-basis24" class="form-control" style="width:100%;">
              ${basis24Options}
            </select>
          </div>
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">ข้อยกเว้นกรณีข้อมูลอ่อนไหว (มาตรา 26)</label>
            <select id="ropa-basis26" class="form-control" style="width:100%;">
              ${basis26Options}
            </select>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">วัตถุประสงค์ในการเก็บรวบรวมและใช้ *</label>
          <textarea id="ropa-purpose" class="form-control" rows="2" placeholder="ระบุวัตถุประสงค์ที่ชัดเจน เช่น เพื่อวินิจฉัยและดูแลรักษาผู้ป่วยตามมาตรฐานวิชาชีพ..." required style="width:100%;">${rec?.purposeCollection || ''}</textarea>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">กลุ่มเจ้าของข้อมูลส่วนบุคคล</label>
            <select id="ropa-owner" class="form-control" style="width:100%;">
              ${ownerOptions}
            </select>
          </div>
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">ระยะเวลาในการจัดเก็บ *</label>
            <input type="text" id="ropa-retention" class="form-control" value="${rec?.retentionPeriod || '10 ปี นับแต่เข้ารับการตรวจครั้งสุดท้าย'}" placeholder="เช่น 10 ปี นับแต่เข้ารับการตรวจครั้งสุดท้าย" required style="width:100%;">
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">มาตรการความมั่นคงปลอดภัยทางเทคนิค (Technical)</label>
            <input type="text" id="ropa-tech" class="form-control" value="${rec?.techMeasures || 'การกำหนดสิทธิ์เข้าถึงตามบทบาท (RBAC)'}" placeholder="เช่น เข้ารหัสฐานข้อมูล, จำกัดสิทธิ์ตามบทบาท (RBAC)" style="width:100%;">
          </div>
          <div>
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:6px; display:block;">มาตรการเชิงบริหารจัดการ (Organizational)</label>
            <input type="text" id="ropa-org" class="form-control" value="${rec?.orgMeasures || 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว'}" placeholder="เช่น สัญญาไม่เปิดเผยข้อมูล (NDA), นโยบาย PDPA" style="width:100%;">
          </div>
        </div>

        <!-- Annual Review Section -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:16px; margin-bottom:24px;">
          <div style="font-size:13px; font-weight:700; color:#334155; margin-bottom:10px;">
            🗓️ ข้อมูลการทบทวนและปรับปรุงข้อมูลประจำปี
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b; margin-bottom:4px; display:block;">ปีงบประมาณที่อัปเดต *</label>
              <select id="ropa-year" class="form-control" style="width:100%;">
                <option value="2569" ${rec?.updatedYear === '2569' ? 'selected' : ''}>2569</option>
                <option value="2568" ${rec?.updatedYear === '2568' ? 'selected' : (!rec ? 'selected' : '')}>2568 (ปัจจุบัน)</option>
                <option value="2567" ${rec?.updatedYear === '2567' ? 'selected' : ''}>2567</option>
                <option value="2566" ${rec?.updatedYear === '2566' ? 'selected' : ''}>2566</option>
              </select>
            </div>
            <div>
              <label class="form-label" style="font-weight:700; font-size:13px; color:#1e293b; margin-bottom:4px; display:block;">ผู้บันทึก / ทบทวนข้อมูล *</label>
              <input type="text" id="ropa-updater" class="form-control" value="${rec?.updatedBy || 'ผู้ดูแลระบบ PDPA สสจ.สระแก้ว'}" required style="width:100%;">
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid #e2e8f0; padding-top:20px;">
          <button type="button" id="cancel-ropa-btn" class="btn" style="background:#f1f5f9; color:#475569;">ยกเลิก</button>
          <button type="submit" class="btn btn-primary" style="background:#4338ca; border-color:#4338ca;">
            💾 ${isEdit ? 'บันทึกการแก้ไข' : 'บันทึกลงทะเบียน ROPA'}
          </button>
        </div>
      </form>
    </div>
  `

  document.getElementById('ropa-entry-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const newRecord = {
      id: rec?.id || `ROPA-00${pdpaState.records.length + 1}`,
      activityName: document.getElementById('ropa-activity').value.trim(),
      department: document.getElementById('ropa-dept').value.trim(),
      dataType: document.getElementById('ropa-category').value,
      classification: document.getElementById('ropa-classification').value,
      lawfulBasis24: document.getElementById('ropa-basis24').value,
      lawfulBasis26: document.getElementById('ropa-basis26').value,
      purposeCollection: document.getElementById('ropa-purpose').value.trim(),
      dataOwner: document.getElementById('ropa-owner').value,
      retentionPeriod: document.getElementById('ropa-retention').value.trim(),
      techMeasures: document.getElementById('ropa-tech').value.trim() || 'การกำหนดสิทธิ์เข้าถึงตามบทบาท (RBAC)',
      orgMeasures: document.getElementById('ropa-org').value.trim() || 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล',
      updatedYear: document.getElementById('ropa-year').value,
      updatedBy: document.getElementById('ropa-updater').value.trim()
    }

    await saveRopaRecord(newRecord)
    pdpaState.editingRecord = null
    pdpaState.activeTab = 'ropa'
    showNotification(isEdit ? 'อัปเดตกิจกรรม ROPA เรียบร้อยแล้ว' : 'บันทึกกิจกรรม ROPA เรียบร้อยแล้ว', 'success')
    renderPdpaModule(container)
  })

  document.getElementById('cancel-ropa-btn').addEventListener('click', () => {
    pdpaState.editingRecord = null
    pdpaState.activeTab = 'ropa'
    renderPdpaModule(container)
  })
}

// ==========================================
// 3. Breach Reports Tab
// ==========================================
function renderBreachList(el) {
  const breachesHtml = pdpaState.breaches.map((b, i) => `
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
            ${breachesHtml}
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
        id: `DB-2567-00${pdpaState.breaches.length + 1}`,
        reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        agency: agency,
        breachDetail: detail,
        affectedCount: parseInt(count) || 1,
        severity: 'Medium',
        notifiedDPO: true,
        actionTaken: 'รับแจ้งเหตุแล้ว แจ้งเตือนเจ้าของข้อมูลและดำเนินการควบคุมความเสียหาย'
      }

      pdpaState.breaches.unshift(newBreach)
      showNotification('บันทึกรายงานการละเมิดข้อมูลเรียบร้อยแล้ว', 'success')
      renderBreachList(el)
    })
  }
}

