import './style.css'
import { supabase, GEMINI_KEY } from './lib/supabase.js'
import { toThaiDate, toThaiNumeral, thaiCurrency, formatCurrency, showNotification } from './lib/utils.js'
import { buildMinutesHTML, exportToWord } from './lib/minutes.js'
import QRCode from 'qrcode'

// ==========================================
// State
// ==========================================
let state = {
  user: null,
  meetings: [],
  currentMeeting: null,
  records: [],
  districts: {},
  items: [],
  committees: [],
  agenda3Items: [],
  activeTab: 'meetings',
  dtRowId: 0,
}

const app = document.getElementById('app')

// ==========================================
// Bootstrap
// ==========================================
async function init() {
  const { data: { session } } = await supabase.auth.getSession()
  state.user = session?.user || null

  supabase.auth.onAuthStateChange((_e, sess) => {
    state.user = sess?.user || null
    renderApp()
  })

  renderApp()
}

function renderApp() {
  if (!state.user) { renderLogin(); return }
  renderAdmin()
  loadData()
}

// ==========================================
// Auth
// ==========================================
function renderLogin() {
  app.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e3a8a,#1e40af);">
      <div class="card" style="width:100%;max-width:380px;margin:20px;">
        <div style="padding:32px;">
          <div style="text-align:center;margin-bottom:28px;">
            <svg style="width:48px;height:48px;color:var(--primary);margin:0 auto 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            <h1 style="font-size:1.3rem;font-weight:700;margin-bottom:4px;">เข้าสู่ระบบ Admin</h1>
            <p style="color:var(--text-muted);font-size:0.875rem;">ระบบจัดหาคอมพิวเตอร์ สสจ.สระแก้ว</p>
          </div>
          <form id="login-form">
            <div class="form-group">
              <label class="form-label">อีเมล</label>
              <input id="login-email" type="email" class="form-control" placeholder="admin@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">รหัสผ่าน</label>
              <input id="login-password" type="password" class="form-control" placeholder="••••••••" required>
            </div>
            <div id="login-error" class="alert alert-danger hidden"></div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px;" id="login-btn">
              เข้าสู่ระบบ
            </button>
          </form>
          <div style="text-align:center;margin-top:16px;">
            <a href="/" style="font-size:0.85rem;color:var(--text-muted);">← กลับหน้าหลัก</a>
          </div>
        </div>
      </div>
    </div>`

  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault()
    const btn = document.getElementById('login-btn')
    const errEl = document.getElementById('login-error')
    btn.disabled = true; btn.textContent = 'กำลังเข้าสู่ระบบ...'
    errEl.classList.add('hidden')
    const { error } = await supabase.auth.signInWithPassword({
      email: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value
    })
    if (error) {
      errEl.textContent = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      errEl.classList.remove('hidden')
      btn.disabled = false; btn.textContent = 'เข้าสู่ระบบ'
    }
  })
}

// ==========================================
// Admin Shell
// ==========================================
function renderAdmin() {
  app.innerHTML = `
    <nav class="navbar no-print">
      <div class="navbar-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
        Admin | ระบบจัดหาคอมพิวเตอร์
      </div>
      <div class="navbar-links">
        <span style="color:rgba(255,255,255,0.7);font-size:0.8rem;">${state.user?.email || ''}</span>
        <button onclick="logout()">ออกจากระบบ</button>
        <a href="/">ดู Dashboard</a>
      </div>
    </nav>
    <div class="admin-layout">
      <aside class="sidebar no-print">
        <div class="sidebar-section">การประชุม</div>
        <button class="sidebar-item ${state.activeTab==='meetings'?'active':''}" onclick="switchTab('meetings')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          รอบประชุม
        </button>
        ${state.currentMeeting ? `
        <button class="sidebar-item ${state.activeTab==='records'?'active':''}" onclick="switchTab('records')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          กรอกข้อมูล
        </button>
        <button class="sidebar-item ${state.activeTab==='resolution'?'active':''}" onclick="switchTab('resolution')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
          บันทึกมติ
        </button>
        <button class="sidebar-item ${state.activeTab==='minutes'?'active':''}" onclick="switchTab('minutes')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          รายงานการประชุม
        </button>` : ''}
        <div class="sidebar-section">ข้อมูลหลัก</div>
        <button class="sidebar-item ${state.activeTab==='units'?'active':''}" onclick="switchTab('units')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          หน่วยงาน
        </button>
        <button class="sidebar-item ${state.activeTab==='items'?'active':''}" onclick="switchTab('items')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8l-2 4h12z"/></svg>
          รายการครุภัณฑ์
        </button>
        <button class="sidebar-item ${state.activeTab==='committees'?'active':''}" onclick="switchTab('committees')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          คณะกรรมการ
        </button>
      </aside>
      <main class="main-content" id="main-content">
        <div class="loading-spinner"><div class="spinner"></div></div>
      </main>
    </div>
    <div id="modal-container"></div>
    <div id="print-area" class="hidden"></div>`
}

window.logout = async () => { await supabase.auth.signOut() }
window.switchTab = (tab) => { state.activeTab = tab; renderTab() }

// ==========================================
// Load All Data
// ==========================================
async function loadData() {
  const [mRes, dRes, iRes, cRes] = await Promise.all([
    supabase.from('meetings').select('*').order('meeting_date', { ascending: false }),
    supabase.from('districts').select('*, agencies(*)').order('name'),
    supabase.from('items').select('*').order('name'),
    supabase.from('committees').select('*').order('order_num'),
  ])
  state.meetings = mRes.data || []
  state.items = iRes.data || []
  state.committees = cRes.data || []
  state.districts = {}
  ;(dRes.data || []).forEach(d => {
    state.districts[d.name] = (d.agencies || []).map(a => a.name)
  })
  renderTab()
}

function renderTab() {
  const el = document.getElementById('main-content')
  if (!el) return
  // Re-render sidebar to update active + meeting-specific items
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) {
    // Update active class
    sidebar.querySelectorAll('.sidebar-item').forEach(btn => {
      const tab = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
      btn.classList.toggle('active', tab === state.activeTab)
    })
  }
  switch (state.activeTab) {
    case 'meetings': renderMeetings(el); break
    case 'records': renderRecords(el); break
    case 'resolution': renderResolution(el); break
    case 'minutes': renderMinutes(el); break
    case 'units': renderUnits(el); break
    case 'items': renderItems(el); break
    case 'committees': renderCommittees(el); break
    default: renderMeetings(el)
  }
}

// ==========================================
// MEETINGS TAB
// ==========================================
function renderMeetings(el) {
  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
      <div>
        <h2 style="font-size:1.2rem;font-weight:700;">รอบประชุมทั้งหมด</h2>
        <p class="text-muted text-sm">เลือกรอบประชุมเพื่อกรอกข้อมูลหรือสร้างรายงาน</p>
      </div>
      <button class="btn btn-primary" onclick="showCreateMeeting()">+ สร้างรอบประชุมใหม่</button>
    </div>
    ${state.meetings.length === 0
      ? '<div class="alert alert-info">ยังไม่มีรอบประชุม กดปุ่ม "สร้างรอบประชุมใหม่" เพื่อเริ่มต้น</div>'
      : state.meetings.map(m => meetingRowHTML(m)).join('')}
  `
}

function meetingRowHTML(m) {
  const isActive = state.currentMeeting?.id === m.id
  return `
    <div class="card" style="margin-bottom:12px;${isActive ? 'border-color:var(--primary);' : ''}">
      <div class="card-body" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-weight:700;font-size:1rem;">${escHtml(m.name)}</div>
          <div class="text-muted text-sm">📅 วันประชุม: ${m.meeting_date ? toThaiDate(m.meeting_date) : '<span style="color:var(--danger);">ยังไม่ระบุ</span>'}
          &nbsp;|&nbsp; สร้างเมื่อ: ${toThaiDate(m.created_at)}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="editMeetingDate('${m.id}', '${m.meeting_date || ''}')">✏️ แก้ไขวันที่</button>
          <button class="btn btn-primary btn-sm" onclick="selectMeeting('${m.id}')">
            ${isActive ? '✓ กำลังใช้งาน' : '📋 เลือกรอบนี้'}
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteMeeting('${m.id}')">🗑 ลบ</button>
        </div>
      </div>
    </div>`
}

window.showCreateMeeting = () => {
  showModal(`
    <div class="modal-header"><span>สร้างรอบประชุมใหม่</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">ชื่อรอบประชุม</label>
        <input id="m-name" class="form-control" placeholder="เช่น การประชุมครั้งที่ 1/2568" required>
      </div>
      <div class="form-group">
        <label class="form-label">วันที่ประชุม</label>
        <input id="m-date" type="date" class="form-control">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">ยกเลิก</button>
      <button class="btn btn-primary" onclick="createMeeting()">สร้าง</button>
    </div>`)
}

window.createMeeting = async () => {
  const name = document.getElementById('m-name').value.trim()
  const date = document.getElementById('m-date').value
  if (!name) { showNotification('กรุณาระบุชื่อรอบประชุม', 'error'); return }
  const { error } = await supabase.from('meetings').insert({ name, meeting_date: date || null })
  if (error) { showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error'); return }
  showNotification('สร้างรอบประชุมเรียบร้อยแล้ว')
  closeModal()
  await loadData()
}

window.editMeetingDate = (id, currentDate) => {
  showModal(`
    <div class="modal-header"><span>แก้ไขวันที่ประชุม</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">วันที่ประชุม</label>
        <input id="edit-date" type="date" class="form-control" value="${currentDate}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">ยกเลิก</button>
      <button class="btn btn-primary" onclick="saveMeetingDate('${id}')">บันทึก</button>
    </div>`)
}

window.saveMeetingDate = async (id) => {
  const date = document.getElementById('edit-date').value
  const { error } = await supabase.from('meetings').update({ meeting_date: date || null }).eq('id', id)
  if (error) { showNotification('เกิดข้อผิดพลาด', 'error'); return }
  showNotification('บันทึกวันที่ประชุมเรียบร้อยแล้ว')
  closeModal()
  await loadData()
}

window.selectMeeting = async (id) => {
  state.currentMeeting = state.meetings.find(m => m.id === id) || null
  state.activeTab = 'records'
  if (state.currentMeeting) {
    const { data } = await supabase.from('records').select('*').eq('meeting_id', id).order('created_at')
    state.records = data || []
    const { data: a3 } = await supabase.from('agenda3_items').select('*').eq('meeting_id', id).order('order_num')
    state.agenda3Items = a3 || []
  }
  renderAdmin()
  renderTab()
}

window.deleteMeeting = async (id) => {
  if (!confirm('ลบรอบประชุมนี้และข้อมูลทั้งหมดที่เกี่ยวข้อง?')) return
  await supabase.from('records').delete().eq('meeting_id', id)
  await supabase.from('agenda3_items').delete().eq('meeting_id', id)
  await supabase.from('meetings').delete().eq('id', id)
  if (state.currentMeeting?.id === id) state.currentMeeting = null
  showNotification('ลบรอบประชุมเรียบร้อยแล้ว')
  await loadData()
}

// ==========================================
// RECORDS TAB
// ==========================================
function renderRecords(el) {
  if (!state.currentMeeting) { el.innerHTML = '<div class="alert alert-warning">กรุณาเลือกรอบประชุมก่อน</div>'; return }
  const districtNames = Object.keys(state.districts)
  const itemsOpts = state.items.map(i => `<option value="${escHtml(i.name)}">${escHtml(i.name)}</option>`).join('')
  const districtOpts = districtNames.map(d => `<option value="${escHtml(d)}">${escHtml(d)}</option>`).join('')

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
      <div>
        <h2 style="font-size:1.1rem;font-weight:700;">กรอกข้อมูล: ${escHtml(state.currentMeeting.name)}</h2>
        <p class="text-muted text-sm">📅 ${state.currentMeeting.meeting_date ? toThaiDate(state.currentMeeting.meeting_date) : 'ยังไม่ระบุวันประชุม'}</p>
      </div>
    </div>

    <!-- Entry Form -->
    <div class="card mb-4">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <span>เพิ่มรายการครุภัณฑ์</span>
        <button class="btn btn-accent btn-sm" onclick="showPdfUpload()" style="font-weight:600;">✨ สแกนไฟล์ PDF อัตโนมัติด้วย AI</button>
      </div>
      <div class="card-body">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">อำเภอ</label>
            <select id="rec-district" class="form-control" onchange="onDistrictChange()">
              <option value="">-- เลือกอำเภอ --</option>
              ${districtOpts}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">หน่วยงาน</label>
            <select id="rec-agency" class="form-control">
              <option value="">-- เลือกหน่วยงาน --</option>
            </select>
          </div>
        </div>

        <div class="table-wrap" style="margin-bottom:12px;">
          <table id="dt-table">
            <thead>
              <tr>
                <th>#</th>
                <th style="min-width:200px;">รายการครุภัณฑ์</th>
                <th style="min-width:70px;">จำนวน</th>
                <th style="min-width:80px;">หน่วย</th>
                <th style="min-width:110px;">ราคากลาง</th>
                <th style="min-width:110px;">ราคา/หน่วย</th>
                <th style="min-width:110px;">รวม</th>
                <th style="min-width:90px;">ลักษณะ</th>
                <th style="min-width:120px;">แหล่งเงิน</th>
                <th style="min-width:120px;">วิธีจัดหา</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="dt-tbody"></tbody>
          </table>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" onclick="addDtRow()">+ เพิ่มรายการ</button>
          <button class="btn btn-primary" onclick="saveRecords()">💾 บันทึกรายการทั้งหมด</button>
        </div>
      </div>
    </div>

    <!-- Existing Records -->
    <div class="card">
      <div class="card-header">
        <span>รายการที่บันทึกแล้ว (${state.records.length} รายการ)</span>
        <button class="btn btn-ghost btn-sm" onclick="refreshRecords()">🔄 รีเฟรช</button>
      </div>
      <div class="card-body" id="records-list">
        ${renderExistingRecords()}
      </div>
    </div>`

  state.dtRowId = 0
  addDtRow()

  window.onDistrictChange = () => {
    const d = document.getElementById('rec-district').value
    const agencies = state.districts[d] || []
    const sel = document.getElementById('rec-agency')
    sel.innerHTML = '<option value="">-- เลือกหน่วยงาน --</option>'
      + agencies.map(a => `<option value="${escHtml(a)}">${escHtml(a)}</option>`).join('')
  }
}

function renderExistingRecords() {
  if (state.records.length === 0) return '<p class="text-muted text-center">ยังไม่มีรายการ</p>'
  return `<div class="table-wrap"><table>
    <thead><tr><th>#</th><th>อำเภอ</th><th>หน่วยงาน</th><th>รายการ</th><th>จำนวน</th><th>รวม (บาท)</th><th>แหล่งเงิน</th><th>มติ</th><th></th></tr></thead>
    <tbody>
      ${state.records.map((r, i) => `<tr>
        <td>${i + 1}</td>
        <td>${escHtml(r.district || '')}</td>
        <td>${escHtml(r.agency || '')}</td>
        <td>${escHtml(r.item_name || '')}</td>
        <td>${r.quantity || ''} ${escHtml(r.unit || '')}</td>
        <td>${formatCurrency(r.total_price)}</td>
        <td>${escHtml(r.funding_source || '')}</td>
        <td>${resBadge(r.resolution_type || r.resolution)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteRecord('${r.id}')">🗑</button></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`
}

function resBadge(val) {
  if (!val || val === 'เห็นชอบ') return '<span class="badge badge-green">เห็นชอบ</span>'
  if (val.includes('ไม่เห็นชอบ')) return '<span class="badge badge-red">ไม่เห็นชอบ</span>'
  return '<span class="badge badge-orange">' + escHtml(val) + '</span>'
}

function charBadge(val) {
  if (!val) return ''
  const c = val.trim()
  if (c.includes('ไม่ตรงเกณฑ์') || c.includes('ไม่ตรงตามเกณฑ์')) return '<span class="badge badge-red">ไม่ตรงตามเกณฑ์</span>'
  if (c.includes('ตรงเกณฑ์') || c.includes('ตรงตามเกณฑ์')) return '<span class="badge badge-green">ตรงตามเกณฑ์</span>'
  if (c.includes('ไม่มี')) return '<span class="badge badge-orange">ไม่มีในเกณฑ์</span>'
  return '<span class="badge badge-blue">' + escHtml(c) + '</span>'
}

window.addDtRow = () => {
  state.dtRowId++
  const id = state.dtRowId
  const tbody = document.getElementById('dt-tbody')
  if (!tbody) return
  const itemsOpts = '<option value="">-- เลือก --</option>' + state.items.map(i =>
    `<option value="${escHtml(i.name)}" data-unit="${escHtml(i.unit || '')}" data-price="${i.standard_price || 0}">${escHtml(i.name)}</option>`
  ).join('')
  const tr = document.createElement('tr')
  tr.id = 'dtr-' + id
  tr.innerHTML = `
    <td style="text-align:center;color:var(--text-muted);">${id}</td>
    <td>
      <select class="form-control" id="sel-${id}" style="font-size:0.8rem;" onchange="onItemSelect(${id})">${itemsOpts}</select>
      <input type="text" id="name-${id}" class="form-control hidden" style="font-size:0.8rem;margin-top:4px;" placeholder="ระบุชื่อครุภัณฑ์...">
    </td>
    <td><input type="number" id="qty-${id}" min="1" value="1" class="form-control" style="font-size:0.8rem;" oninput="calcTotal(${id})"></td>
    <td><input type="text" id="unit-${id}" class="form-control" style="font-size:0.8rem;"></td>
    <td><input type="number" id="stdprice-${id}" readonly class="form-control" style="font-size:0.8rem;background:#f8fafc;"></td>
    <td><input type="number" id="price-${id}" class="form-control" style="font-size:0.8rem;" oninput="calcTotal(${id})"></td>
    <td><input type="text" id="total-${id}" readonly class="form-control" style="font-size:0.8rem;background:#f8fafc;font-weight:600;"></td>
    <td><input type="text" id="char-${id}" readonly class="form-control" style="font-size:0.8rem;background:#f8fafc;"></td>
    <td>
      <select id="fund-${id}" class="form-control" style="font-size:0.8rem;" onchange="checkFund(${id})">
        <option value="งบเงินบำรุง">งบเงินบำรุง</option>
        <option value="งบค่าเสื่อม">งบค่าเสื่อม</option>
        <option value="อื่นๆ">อื่นๆ</option>
      </select>
      <input type="text" id="fund-other-${id}" class="form-control hidden" style="font-size:0.8rem;margin-top:4px;" placeholder="ระบุแหล่งเงิน...">
    </td>
    <td>
      <select id="method-${id}" class="form-control" style="font-size:0.8rem;" onchange="checkMethod(${id})">
        <option value="จัดหาใหม่">จัดหาใหม่</option>
        <option value="ทดแทน">ทดแทน</option>
        <option value="เพิ่มประสิทธิภาพ">เพิ่มประสิทธิภาพ</option>
      </select>
      <input type="text" id="replace-${id}" class="form-control hidden" style="font-size:0.8rem;margin-top:4px;" placeholder="เลขครุภัณฑ์เดิม...">
    </td>
    <td><button class="btn btn-danger btn-sm" onclick="removeDtRow(${id})">✕</button></td>`
  tbody.appendChild(tr)
}

window.onItemSelect = (id) => {
  const sel = document.getElementById('sel-' + id)
  const opt = sel.options[sel.selectedIndex]
  const nameInput = document.getElementById('name-' + id)
  if (sel.value === '__custom__') {
    nameInput.classList.remove('hidden')
    return
  }
  nameInput.classList.add('hidden')
  if (sel.value) {
    const unit = opt.getAttribute('data-unit') || ''
    const price = parseFloat(opt.getAttribute('data-price')) || 0
    const qty = parseFloat(document.getElementById('qty-' + id).value) || 1
    document.getElementById('unit-' + id).value = unit
    document.getElementById('stdprice-' + id).value = price
    document.getElementById('price-' + id).value = price
    document.getElementById('total-' + id).value = formatCurrency(price * qty)
    // Determine characteristics
    const char = price > 0 ? 'ตรงตามเกณฑ์' : 'ไม่มีในเกณฑ์'
    document.getElementById('char-' + id).value = char
  }
}

window.calcTotal = (id) => {
  const qty = parseFloat(document.getElementById('qty-' + id).value) || 0
  const price = parseFloat(document.getElementById('price-' + id).value) || 0
  const stdPrice = parseFloat(document.getElementById('stdprice-' + id).value) || 0
  document.getElementById('total-' + id).value = formatCurrency(qty * price)
  if (stdPrice > 0) {
    document.getElementById('char-' + id).value = price <= stdPrice ? 'ตรงตามเกณฑ์' : 'ไม่ตรงตามเกณฑ์'
  }
}

window.checkFund = (id) => {
  const val = document.getElementById('fund-' + id).value
  const other = document.getElementById('fund-other-' + id)
  other.classList.toggle('hidden', val !== 'อื่นๆ')
}

window.checkMethod = (id) => {
  const val = document.getElementById('method-' + id).value
  const rep = document.getElementById('replace-' + id)
  rep.classList.toggle('hidden', val !== 'ทดแทน')
}

window.removeDtRow = (id) => {
  document.getElementById('dtr-' + id)?.remove()
}

window.saveRecords = async () => {
  const district = document.getElementById('rec-district').value
  const agency = document.getElementById('rec-agency').value
  if (!district || !agency) { showNotification('กรุณาเลือกอำเภอและหน่วยงาน', 'error'); return }

  const rows = []
  document.querySelectorAll('#dt-tbody tr').forEach(tr => {
    const id = tr.id.replace('dtr-', '')
    const sel = document.getElementById('sel-' + id)
    const nameInput = document.getElementById('name-' + id)
    const itemName = (sel?.value && sel.value !== '__custom__') ? sel.value : (nameInput?.value?.trim() || '')
    if (!itemName) return

    let fund = document.getElementById('fund-' + id)?.value || ''
    if (fund === 'อื่นๆ') fund = document.getElementById('fund-other-' + id)?.value || 'อื่นๆ'

    rows.push({
      meeting_id: state.currentMeeting.id,
      district,
      agency,
      item_name: itemName,
      quantity: parseInt(document.getElementById('qty-' + id)?.value) || 1,
      unit: document.getElementById('unit-' + id)?.value || '',
      standard_price: parseFloat(document.getElementById('stdprice-' + id)?.value) || 0,
      unit_price: parseFloat(document.getElementById('price-' + id)?.value) || 0,
      total_price: parseFloat(String(document.getElementById('total-' + id)?.value || '0').replace(/,/g, '')) || 0,
      characteristics: document.getElementById('char-' + id)?.value || '',
      funding_source: fund,
      procurement_method: document.getElementById('method-' + id)?.value || 'จัดหาใหม่',
      replacement_num: document.getElementById('replace-' + id)?.value || '',
      resolution: 'เห็นชอบ',
      resolution_type: 'เห็นชอบ',
    })
  })

  if (rows.length === 0) { showNotification('ไม่มีรายการที่จะบันทึก', 'error'); return }

  const { error } = await supabase.from('records').insert(rows)
  if (error) { showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error'); return }
  showNotification(`บันทึก ${rows.length} รายการเรียบร้อยแล้ว`)
  await refreshRecords()
}

window.refreshRecords = async () => {
  if (!state.currentMeeting) return
  const { data } = await supabase.from('records').select('*').eq('meeting_id', state.currentMeeting.id).order('created_at')
  state.records = data || []
  const listEl = document.getElementById('records-list')
  if (listEl) listEl.innerHTML = renderExistingRecords()
  const header = document.querySelector('.card-header span')
  if (header && header.textContent.includes('รายการที่บันทึกแล้ว'))
    header.textContent = `รายการที่บันทึกแล้ว (${state.records.length} รายการ)`
}

window.deleteRecord = async (id) => {
  if (!confirm('ลบรายการนี้?')) return
  await supabase.from('records').delete().eq('id', id)
  showNotification('ลบรายการเรียบร้อยแล้ว')
  await refreshRecords()
}

// ==========================================
// PDF Upload + AI Extract
// ==========================================
window.showPdfUpload = () => {
  showModal(`
    <div class="modal-header"><span>อ่าน PDF ด้วย AI</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="alert alert-info">AI จะวิเคราะห์ไฟล์ PDF และดึงรายการครุภัณฑ์มาให้อัตโนมัติ</div>
      <div class="form-group">
        <label class="form-label">เลือกไฟล์ PDF</label>
        <input type="file" id="pdf-file" class="form-control" accept="application/pdf,image/*">
      </div>
      <div id="pdf-result"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">ปิด</button>
      <button class="btn btn-primary" onclick="extractPdf()">🤖 วิเคราะห์ด้วย AI</button>
    </div>`)
}

window.extractPdf = async () => {
  const file = document.getElementById('pdf-file')?.files[0]
  if (!file) { showNotification('กรุณาเลือกไฟล์', 'error'); return }
  const resultEl = document.getElementById('pdf-result')
  resultEl.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><span>กำลังวิเคราะห์...</span></div>'

  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64 = e.target.result.split(',')[1]
    try {
      const itemNames = state.items.map(i => i.name)
      const prompt = `จงดึงข้อมูลจากเอกสารคำขอจัดหาคอมพิวเตอร์นี้และส่งกลับมาในรูปแบบ JSON Array เท่านั้น ไม่ต้องมีข้อความอื่น:\n[{"itemName":"ชื่อรายการ","quantity":1,"unit":"เครื่อง","unitPrice":20000,"fundingSource":"งบเงินบำรุง","procurementMethod":"จัดหาใหม่","replacementNum":""}]\nถ้ามีหลายรายการสร้าง object เพิ่ม รายชื่อครุภัณฑ์ในระบบ:\n- ${itemNames.join('\n- ')}`

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: file.type, data: base64 } }] }] })
      })
      const json = await res.json()
      let text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      const extracted = JSON.parse(text)

      resultEl.innerHTML = `<div class="alert alert-success">พบ ${extracted.length} รายการ กดปุ่มด้านล่างเพื่อเพิ่มเข้าตาราง</div>
        <div class="table-wrap"><table><thead><tr><th>รายการ</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>แหล่งเงิน</th></tr></thead>
        <tbody>${extracted.map(r => `<tr><td>${escHtml(r.itemName||'')}</td><td>${r.quantity||1} ${escHtml(r.unit||'')}</td><td>${formatCurrency(r.unitPrice)}</td><td>${escHtml(r.fundingSource||'')}</td></tr>`).join('')}
        </tbody></table></div>`
      resultEl.dataset.extracted = JSON.stringify(extracted)

      const footer = document.querySelector('.modal-footer')
      footer.innerHTML = `<button class="btn btn-ghost" onclick="closeModal()">ปิด</button>
        <button class="btn btn-primary" onclick="applyExtracted()">✅ เพิ่มรายการเข้าตาราง</button>`
    } catch (err) {
      resultEl.innerHTML = `<div class="alert alert-danger">วิเคราะห์ไม่สำเร็จ: ${err.message}</div>`
    }
  }
  reader.readAsDataURL(file)
}

window.applyExtracted = () => {
  const resultEl = document.getElementById('pdf-result')
  const extracted = JSON.parse(resultEl.dataset.extracted || '[]')
  // Remove existing empty rows first
  document.querySelectorAll('#dt-tbody tr').forEach(tr => tr.remove())
  state.dtRowId = 0
  extracted.forEach(r => {
    addDtRow()
    const id = state.dtRowId
    // Try to match with existing items
    const found = state.items.find(i => i.name === r.itemName)
    const sel = document.getElementById('sel-' + id)
    if (found && sel) {
      sel.value = found.name
      onItemSelect(id)
    } else {
      const nameInput = document.getElementById('name-' + id)
      if (nameInput) { nameInput.value = r.itemName || ''; nameInput.classList.remove('hidden') }
      if (sel) sel.value = '__custom__'
    }
    if (r.quantity) { const q = document.getElementById('qty-' + id); if (q) { q.value = r.quantity; calcTotal(id) } }
    if (r.unit) { const u = document.getElementById('unit-' + id); if (u) u.value = r.unit }
    if (r.unitPrice) { const p = document.getElementById('price-' + id); if (p) { p.value = r.unitPrice; calcTotal(id) } }
    if (r.fundingSource) {
      const f = document.getElementById('fund-' + id)
      if (f) {
        const opts = ['งบเงินบำรุง', 'งบค่าเสื่อม']
        if (opts.includes(r.fundingSource)) f.value = r.fundingSource
        else { f.value = 'อื่นๆ'; const fo = document.getElementById('fund-other-' + id); if (fo) { fo.value = r.fundingSource; fo.classList.remove('hidden') } }
      }
    }
    if (r.procurementMethod) { const m = document.getElementById('method-' + id); if (m) m.value = r.procurementMethod }
    if (r.replacementNum) { const rep = document.getElementById('replace-' + id); if (rep) { rep.value = r.replacementNum; rep.classList.remove('hidden') } }
  })
  closeModal()
  showNotification(`เพิ่ม ${extracted.length} รายการจาก AI เรียบร้อยแล้ว`)
}

// ==========================================
// RESOLUTION TAB
// ==========================================
function renderResolution(el) {
  if (!state.currentMeeting) { el.innerHTML = '<div class="alert alert-warning">กรุณาเลือกรอบประชุมก่อน</div>'; return }

  const grouped = {}
  state.records.forEach(r => {
    const key = `${r.agency || 'ไม่ระบุ'} (${r.district || 'ไม่ระบุ'})`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(r)
  })

  // Calculate Agenda 1 stats
  const totalAgencies = new Set(state.records.map(r => r.agency)).size
  let countMatch = 0, countNotMatch = 0, countNoSpec = 0
  state.records.forEach(r => {
    const char = (r.characteristics || '').trim()
    if (char.includes('ไม่ตรงเกณฑ์') || char.includes('ไม่ตรงตามเกณฑ์')) countNotMatch++
    else if (char.includes('ตรงเกณฑ์') || char.includes('ตรงตามเกณฑ์')) countMatch++
    else if (char.includes('ไม่มี')) countNoSpec++
    else if (char) countNotMatch++
  })

  const agenda1Text = `การประชุมครั้งนี้เพื่อพิจารณารายงานการบริหารและจัดหาระบบคอมพิวเตอร์ภาครัฐของหน่วยงานในสังกัดทั้งหมด ${totalAgencies} แห่ง ` +
    `รวมเป็นรายการที่ตรงตามเกณฑ์คุณลักษณะราคากลาง ${countMatch} รายการ, ` +
    `ไม่ตรงตามเกณฑ์คุณลักษณะราคากลาง ${countNotMatch} รายการ ` +
    `และไม่มีในเกณฑ์ราคากลาง ${countNoSpec} รายการ ` +
    `รวมทั้งสิ้น ${state.records.length} รายการ`

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h2 style="font-size:1.1rem;font-weight:700;">บันทึกมติ: ${escHtml(state.currentMeeting.name)}</h2>
      <button class="btn btn-primary" onclick="saveAllResolutions()">💾 บันทึกมติทั้งหมด</button>
    </div>

    <!-- Attendance -->
    <div class="card mb-4">
      <div class="card-header">รายชื่อผู้เข้าร่วมประชุม (ติ๊กออกหากไม่มาประชุม)</div>
      <div class="card-body">
        <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:0.9rem;">
          ${state.committees.map(c => {
             const isAbsent = state.currentMeeting?.absent_ids?.includes(c.id)
             return `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" onchange="toggleAttendance('${c.id}', this.checked)" ${!isAbsent ? 'checked' : ''}> ${escHtml(c.full_name || '')}</label>`
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Agenda 1 & 2 -->
    <div class="card mb-4">
      <div class="card-header">ระเบียบวาระที่ ๑ และ ๒</div>
      <div class="card-body">
        <div class="alert alert-info" style="margin-bottom:0;">
          <strong>วาระที่ ๑ เรื่องที่ประธานแจ้งให้ที่ประชุมทราบ</strong><br>
          <div style="margin-top:4px; margin-bottom:12px; font-size:0.9rem; padding:8px; background:rgba(255,255,255,0.5); border-radius:4px;">
            ${escHtml(agenda1Text)}
          </div>
          <strong>วาระที่ ๒ เรื่องรับรองรายงานการประชุม</strong><br>
          <textarea id="res-agenda2" class="form-control" style="margin-top:8px;font-size:0.85rem;" rows="2" placeholder="พิมพ์ข้อความวาระที่ 2 รับรองรายงานการประชุมที่นี่..." onchange="if(state.currentMeeting) state.currentMeeting.agenda2_text = this.value; const m = document.getElementById('min-agenda2'); if(m) m.value = this.value;">${escHtml(state.currentMeeting?.agenda2_text || '')}</textarea>
        </div>
      </div>
    </div>

    <!-- Agenda 3 -->
    <div class="card mb-4">
      <div class="card-header">
        ระเบียบวาระที่ ๓ เรื่องเสนอเพื่อทราบ
        <button class="btn btn-ghost btn-sm" onclick="addAgenda3()">+ เพิ่ม</button>
      </div>
      <div class="card-body" id="agenda3-list">
        ${renderAgenda3List()}
      </div>
    </div>

    <!-- Agenda 4 -->
    <div class="card mb-4">
      <div class="card-header">ระเบียบวาระที่ ๔ เรื่องที่เสนอให้ที่ประชุมพิจารณา</div>
      <div class="card-body">
        ${Object.keys(grouped).length === 0
          ? '<p class="text-muted text-center">ยังไม่มีรายการ กรอกข้อมูลในแท็บ "กรอกข้อมูล" ก่อน</p>'
          : Object.entries(grouped).map(([agencyKey, recs], idx) => {
              const total = recs.reduce((s, r) => s + (parseFloat(r.total_price) || 0), 0)
              const agencyId = 'res-agency-' + idx
              return `
                <div style="border:1px solid var(--border); border-radius:6px; margin-bottom:12px; overflow:hidden;">
                  <div style="background:#f8fafc; padding:12px 16px; cursor:pointer; display:flex; align-items:center; gap:12px; flex-wrap:wrap;" onclick="toggleAgency('${agencyId}')">
                    <span id="chev-${agencyId}" style="color:var(--text-muted); font-size:0.8rem; width:16px;">▼</span>
                    <span style="font-weight:700; color:var(--text); font-size:1rem;">${escHtml(agencyKey)}</span>
                    <span class="badge badge-blue">${recs.length} รายการ</span>
                    <span class="badge badge-green">รวม ${formatCurrency(total)} บาท</span>
                  </div>
                  <div id="detail-${agencyId}" class="table-wrap">
                    <table style="margin:0; border-top:1px solid var(--border);">
                      <thead>
                        <tr>
                          <th style="width:50px;text-align:center;">ลำดับ</th>
                          <th>รายการครุภัณฑ์</th>
                          <th>จำนวน/หน่วย</th>
                          <th>ราคา/หน่วย</th>
                          <th>ราคากลาง</th>
                          <th>วงเงินรวม</th>
                          <th>เกณฑ์</th>
                          <th style="min-width:280px;">มติความเห็นชอบ</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${recs.map((r, i) => `
                          <tr>
                            <td style="color:var(--text-muted); text-align:center;">
                              <span style="display:inline-block; border-left:1px solid #cbd5e1; border-bottom:1px solid #cbd5e1; width:8px; height:8px; margin-right:4px; margin-bottom:4px;"></span>
                              ${i + 1}
                            </td>
                            <td>${escHtml(r.item_name || '')}</td>
                            <td>${r.quantity || ''} ${escHtml(r.unit || '')}</td>
                            <td>${formatCurrency(r.unit_price)}</td>
                            <td>${formatCurrency(r.standard_price)}</td>
                            <td style="font-weight:600;">${formatCurrency(r.total_price)}</td>
                            <td>${charBadge(r.characteristics)}</td>
                            <td>
                              <div style="display:flex;gap:8px;flex-direction:column;">
                                <select id="res-type-${r.id}" class="form-control" style="font-size:0.85rem;" onchange="toggleResComment('${r.id}')">
                                  <option value="เห็นชอบ" ${r.resolution_type==='เห็นชอบ'?'selected':''}>เห็นชอบ</option>
                                  <option value="ไม่เห็นชอบ" ${r.resolution_type==='ไม่เห็นชอบ'?'selected':''}>ไม่เห็นชอบ</option>
                                  <option value="อื่นๆ" ${r.resolution_type==='อื่นๆ'?'selected':''}>อื่นๆ</option>
                                </select>
                                <input id="res-comment-${r.id}" type="text" class="form-control ${r.resolution_type==='เห็นชอบ'?'hidden':''}" style="font-size:0.85rem;" placeholder="เหตุผล..." value="${escHtml(r.resolution_comment||'')}">
                              </div>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              `
            }).join('')
        }
      </div>
    </div>

    <!-- Agenda 5 & Extra -->
    <div class="card mb-4">
      <div class="card-header">ระเบียบวาระที่ ๕ และ ข้อมูลเพิ่มเติม</div>
      <div class="card-body">
        <div class="alert alert-info" style="margin-bottom:12px;">
          <strong>วาระที่ ๕ เรื่องเสนออื่น ๆ</strong><br>
          <textarea id="res-agenda5" class="form-control" style="margin-top:8px;font-size:0.85rem;" rows="2" placeholder="(ไม่มี)" onchange="if(state.currentMeeting) state.currentMeeting.agenda5_text = this.value">${escHtml(state.currentMeeting?.agenda5_text || '')}</textarea>
        </div>
        <div class="alert alert-secondary" style="margin-bottom:0;">
          <strong>ลิงก์เอกสารประกอบการประชุม (สำหรับสร้าง QR Code คู่)</strong><br>
          <input type="text" id="res-doc-link" class="form-control" style="margin-top:8px;font-size:0.85rem;" placeholder="https://..." value="${escHtml(state.currentMeeting?.doc_link || '')}" onchange="if(state.currentMeeting) state.currentMeeting.doc_link = this.value">
        </div>
      </div>
    </div>
  `
}

window.toggleAttendance = (id, isChecked) => {
  if (!state.currentMeeting) return
  if (!state.currentMeeting.absent_ids) state.currentMeeting.absent_ids = []
  if (isChecked) {
    state.currentMeeting.absent_ids = state.currentMeeting.absent_ids.filter(x => String(x) !== String(id))
  } else {
    if (!state.currentMeeting.absent_ids.includes(id)) state.currentMeeting.absent_ids.push(id)
  }
}

window.toggleResComment = (id) => {
  const type = document.getElementById('res-type-' + id)?.value
  const comment = document.getElementById('res-comment-' + id)
  if (comment) comment.classList.toggle('hidden', type === 'เห็นชอบ')
}

window.saveAllResolutions = async () => {
  // Save resolutions
  const updates = state.records.map(r => {
    const type = document.getElementById('res-type-' + r.id)?.value || 'เห็นชอบ'
    const comment = document.getElementById('res-comment-' + r.id)?.value || ''
    return { id: r.id, resolution_type: type, resolution: type, resolution_comment: comment }
  })
  for (const u of updates) {
    await supabase.from('records').update({ resolution_type: u.resolution_type, resolution: u.resolution, resolution_comment: u.resolution_comment }).eq('id', u.id)
  }

  // Save meeting details
  if (state.currentMeeting) {
    const a2 = document.getElementById('res-agenda2')
    const a5 = document.getElementById('res-agenda5')
    const dL = document.getElementById('res-doc-link')
    if (a2) state.currentMeeting.agenda2_text = a2.value
    if (a5) state.currentMeeting.agenda5_text = a5.value
    if (dL) state.currentMeeting.doc_link = dL.value

    await supabase.from('meetings').update({
      agenda2_text: state.currentMeeting.agenda2_text || null,
      agenda5_text: state.currentMeeting.agenda5_text || null,
      doc_link: state.currentMeeting.doc_link || null,
      absent_ids: state.currentMeeting.absent_ids || []
    }).eq('id', state.currentMeeting.id)
  }

  showNotification('บันทึกมติและข้อมูลวาระเรียบร้อยแล้ว')
  
  // Reload records
  const { data } = await supabase.from('records').select('*').eq('meeting_id', state.currentMeeting.id)
  state.records = data || []
}

function renderAgenda3List() {
  if (state.agenda3Items.length === 0) return '<p class="text-muted text-sm">ยังไม่มีวาระ</p>'
  return state.agenda3Items.map((item, i) => `
    <div style="display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">
      <span style="color:var(--text-muted);min-width:24px;">${i+1}.</span>
      <input class="form-control" id="a3-title-${item.id}" value="${escHtml(item.title||'')}" placeholder="หัวข้อวาระ" style="font-size:0.85rem;">
      <input class="form-control" id="a3-res-${item.id}" value="${escHtml(item.resolution||'รับทราบ')}" placeholder="มติ" style="width:150px;font-size:0.85rem;">
      <button class="btn btn-danger btn-sm" onclick="deleteAgenda3('${item.id}')">✕</button>
    </div>`).join('')
}

window.addAgenda3 = async () => {
  const { data, error } = await supabase.from('agenda3_items').insert({
    meeting_id: state.currentMeeting.id, title: '', resolution: 'รับทราบ', order_num: state.agenda3Items.length + 1
  }).select().single()
  if (error) { showNotification('เกิดข้อผิดพลาด', 'error'); return }
  state.agenda3Items.push(data)
  document.getElementById('agenda3-list').innerHTML = renderAgenda3List()
  // Re-bind save events
  state.agenda3Items.forEach(item => {
    document.getElementById('a3-title-' + item.id)?.addEventListener('blur', () => saveAgenda3(item.id))
    document.getElementById('a3-res-' + item.id)?.addEventListener('blur', () => saveAgenda3(item.id))
  })
}

window.saveAgenda3 = async (id) => {
  const title = document.getElementById('a3-title-' + id)?.value || ''
  const resolution = document.getElementById('a3-res-' + id)?.value || 'รับทราบ'
  await supabase.from('agenda3_items').update({ title, resolution }).eq('id', id)
  const idx = state.agenda3Items.findIndex(i => i.id === id)
  if (idx >= 0) { state.agenda3Items[idx].title = title; state.agenda3Items[idx].resolution = resolution }
}

window.deleteAgenda3 = async (id) => {
  await supabase.from('agenda3_items').delete().eq('id', id)
  state.agenda3Items = state.agenda3Items.filter(i => i.id !== id)
  document.getElementById('agenda3-list').innerHTML = renderAgenda3List()
}

// ==========================================
// MINUTES TAB
// ==========================================
function renderMinutes(el) {
  if (!state.currentMeeting) { el.innerHTML = '<div class="alert alert-warning">กรุณาเลือกรอบประชุมก่อน</div>'; return }

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
      <h2 style="font-size:1.1rem;font-weight:700;">รายงานการประชุม: ${escHtml(state.currentMeeting.name)}</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm no-print" onclick="previewMinutes()">👁 สร้าง / รีเฟรช ตัวอย่าง</button>
        <button class="btn btn-ghost btn-sm no-print" onclick="window.print()">🖨 พิมพ์</button>
        <button class="btn btn-secondary btn-sm no-print" onclick="exportMinutesWord()">📄 ส่งออก Word</button>
      </div>
    </div>

    <div class="alert alert-info no-print mb-4">
      รายชื่อผู้เข้าร่วมประชุม, วาระที่ 2, และวาระที่ 5 สามารถตั้งค่าได้ในแท็บ <strong>"บันทึกมติ"</strong><br>
      ส่วนผู้บันทึกรายงานจะถูกดึงมาจาก "ผู้ช่วยเลขานุการ" และผู้ตรวจรายงานจะดึงมาจาก "กรรมการ/เลขานุการ" โดยอัตโนมัติ
    </div>

    <div id="minutes-preview" class="card">
      <div class="card-body text-center text-muted" style="padding:40px;">
        กดปุ่ม "สร้าง / รีเฟรช ตัวอย่าง" ด้านบนเพื่อดูรายงานการประชุม
      </div>
    </div>`
}

window.previewMinutes = async () => {
  const preview = document.getElementById('minutes-preview')
  if (!preview) return
  preview.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>'

  if (state.currentMeeting) {
    const a2 = document.getElementById('res-agenda2')
    const a5 = document.getElementById('res-agenda5')
    const dL = document.getElementById('res-doc-link')
    if (a2) state.currentMeeting.agenda2_text = a2.value
    if (a5) state.currentMeeting.agenda5_text = a5.value
    if (dL) state.currentMeeting.doc_link = dL.value
  }

  // Generate QR
  let qrBase64 = ''
  let docQrBase64 = ''
  try { 
    qrBase64 = await QRCode.toDataURL(window.location.origin + '/', { width: 120, margin: 1 }) 
    if (state.currentMeeting.doc_link) {
      docQrBase64 = await QRCode.toDataURL(state.currentMeeting.doc_link, { width: 120, margin: 1 })
    }
  } catch {}

  // Build report data
  const reportData = {}
  state.records.forEach(r => {
    if (!reportData[r.district]) reportData[r.district] = {}
    if (!reportData[r.district][r.agency]) reportData[r.district][r.agency] = []
    reportData[r.district][r.agency].push(r)
  })

  const totalAgencies = new Set(state.records.map(r => r.agency)).size
  let countMatch = 0, countNotMatch = 0, countNoSpec = 0
  state.records.forEach(r => {
    const c = (r.characteristics || '').trim()
    if (c === 'ตรงตามเกณฑ์') countMatch++
    else if (c === 'ไม่ตรงตามเกณฑ์') countNotMatch++
    else countNoSpec++
  })

  // Split committees into attended/absent
  const absentIds = state.currentMeeting.absent_ids || []
  const attended = state.committees.filter(c => c.full_name && !absentIds.includes(String(c.id)))
  const absent = state.committees.filter(c => c.full_name && absentIds.includes(String(c.id)))

  // Find Recorder and Checker based on position
  const recorderComm = state.committees.find(c => c.position && c.position.includes('ผู้ช่วยเลขานุการ'))
  const checkerComm = state.committees.find(c => c.position && (c.position.includes('กรรมการ/เลขานุการ') || c.position.includes('กรรมการและเลขานุการ')))
  const recorder = recorderComm ? (recorderComm.prefix || '') + recorderComm.full_name : ''
  const checker = checkerComm ? (checkerComm.prefix || '') + checkerComm.full_name : ''

  const html = buildMinutesHTML({
    meetingName: state.currentMeeting.name,
    dateDisplay: toThaiDate(state.currentMeeting.meeting_date),
    attended,
    absent,
    recorder,
    checker,
    qrBase64,
    docQrBase64,
    agenda3Items: state.agenda3Items,
    agenda2Text: state.currentMeeting.agenda2_text || '',
    agenda5Text: state.currentMeeting.agenda5_text || '',
    allMeetings: state.meetings,
    currentMeetingId: state.currentMeeting.id,
    reportData,
    totalAgencies,
    countMatch, countNotMatch, countNoSpec,
    totalRecords: state.records.length
  })

  preview.innerHTML = `
    <div id="print-minutes-container" style="padding:20px;">
      <style>@media print{@page{size:A4 portrait;margin:2.5cm 2cm 2cm 3cm;} #print-minutes-container{font-family:'TH Sarabun PSK','TH Sarabun New',Sarabun,sans-serif !important;} .no-print{display:none !important;} .print-black{color:#000!important;}}</style>
      ${html}
    </div>`
}

window.exportMinutesWord = async () => {
  await previewMinutes()
  setTimeout(() => {
    const content = document.getElementById('print-minutes-container')?.innerHTML || ''
    exportToWord(content, 'รายงานการประชุม', false)
  }, 500)
}

// ==========================================
// UNITS TAB
// ==========================================
function renderUnits(el) {
  const districtNames = Object.keys(state.districts).sort()
  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h2 style="font-size:1.1rem;font-weight:700;">จัดการหน่วยงาน</h2>
      <button class="btn btn-primary" onclick="showAddUnit()">+ เพิ่มหน่วยงาน</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>อำเภอ</th><th>หน่วยงาน</th><th></th></tr></thead>
          <tbody>
            ${districtNames.length === 0 ? '<tr><td colspan="4" class="text-center text-muted">ยังไม่มีข้อมูล</td></tr>' : ''}
            ${districtNames.flatMap((d, di) =>
              state.districts[d].map((a, ai) => `
                <tr>
                  <td class="text-muted">${di+1}.${ai+1}</td>
                  <td>${escHtml(d)}</td>
                  <td>${escHtml(a)}</td>
                  <td><button class="btn btn-danger btn-sm" onclick="deleteAgency('${escHtml(d)}','${escHtml(a)}')">🗑 ลบ</button></td>
                </tr>`)
            ).join('')}
          </tbody>
        </table>
      </div>
    </div>`
}

window.showAddUnit = () => {
  const districtNames = Object.keys(state.districts).sort()
  showModal(`
    <div class="modal-header"><span>เพิ่มหน่วยงาน</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">อำเภอ (เพิ่มใหม่หรือเลือกที่มีอยู่)</label>
        <input id="u-district" list="district-list" class="form-control" placeholder="ชื่ออำเภอ">
        <datalist id="district-list">${districtNames.map(d => `<option value="${escHtml(d)}">`).join('')}</datalist>
      </div>
      <div class="form-group">
        <label class="form-label">ชื่อหน่วยงาน</label>
        <input id="u-agency" class="form-control" placeholder="ชื่อหน่วยงาน">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">ยกเลิก</button>
      <button class="btn btn-primary" onclick="addUnit()">เพิ่ม</button>
    </div>`)
}

window.addUnit = async () => {
  const district = document.getElementById('u-district').value.trim()
  const agency = document.getElementById('u-agency').value.trim()
  if (!district || !agency) { showNotification('กรุณากรอกข้อมูลให้ครบ', 'error'); return }

  // Upsert district
  const { data: dData } = await supabase.from('districts').upsert({ name: district }, { onConflict: 'name' }).select().single()
  const districtId = dData?.id
  if (!districtId) { showNotification('เกิดข้อผิดพลาด', 'error'); return }

  const { error } = await supabase.from('agencies').insert({ district_id: districtId, name: agency })
  if (error) { showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error'); return }
  showNotification('เพิ่มหน่วยงานเรียบร้อยแล้ว')
  closeModal()
  await loadData()
}

window.deleteAgency = async (district, agency) => {
  if (!confirm(`ลบหน่วยงาน "${agency}"?`)) return
  const { data: d } = await supabase.from('districts').select('id').eq('name', district).single()
  if (!d) return
  await supabase.from('agencies').delete().eq('district_id', d.id).eq('name', agency)
  showNotification('ลบหน่วยงานเรียบร้อยแล้ว')
  await loadData()
}

// ==========================================
// ITEMS TAB
// ==========================================
function renderItems(el) {
  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h2 style="font-size:1.1rem;font-weight:700;">รายการครุภัณฑ์ (${state.items.length} รายการ)</h2>
      <button class="btn btn-primary" onclick="showAddItem()">+ เพิ่มครุภัณฑ์</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>ชื่อรายการ</th><th>หน่วย</th><th>ราคากลาง (บาท)</th><th></th></tr></thead>
          <tbody>
            ${state.items.length === 0 ? '<tr><td colspan="5" class="text-center text-muted">ยังไม่มีข้อมูล</td></tr>' : ''}
            ${state.items.map((item, i) => `
              <tr>
                <td class="text-muted">${i+1}</td>
                <td>${escHtml(item.name)}</td>
                <td>${escHtml(item.unit || '')}</td>
                <td>${formatCurrency(item.standard_price)}</td>
                <td style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editItem('${item.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteItem('${item.id}')">🗑</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`
}

window.showAddItem = (item = null) => {
  showModal(`
    <div class="modal-header"><span>${item ? 'แก้ไข' : 'เพิ่ม'}ครุภัณฑ์</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">ชื่อรายการครุภัณฑ์</label>
        <input id="item-name" class="form-control" value="${escHtml(item?.name||'')}" placeholder="เช่น คอมพิวเตอร์โน้ตบุ๊ก">
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">หน่วยนับ</label>
          <input id="item-unit" class="form-control" value="${escHtml(item?.unit||'เครื่อง')}" placeholder="เครื่อง">
        </div>
        <div class="form-group">
          <label class="form-label">ราคากลาง (บาท)</label>
          <input id="item-price" type="number" class="form-control" value="${item?.standard_price||0}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">ยกเลิก</button>
      <button class="btn btn-primary" onclick="saveItem('${item?.id||''}')">บันทึก</button>
    </div>`)
}

window.editItem = (id) => {
  const item = state.items.find(i => i.id === id)
  if (item) showAddItem(item)
}

window.saveItem = async (id) => {
  const name = document.getElementById('item-name').value.trim()
  const unit = document.getElementById('item-unit').value.trim()
  const standard_price = parseFloat(document.getElementById('item-price').value) || 0
  if (!name) { showNotification('กรุณาระบุชื่อรายการ', 'error'); return }
  const payload = { name, unit, standard_price }
  const { error } = id
    ? await supabase.from('items').update(payload).eq('id', id)
    : await supabase.from('items').insert(payload)
  if (error) { showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error'); return }
  showNotification('บันทึกรายการครุภัณฑ์เรียบร้อยแล้ว')
  closeModal()
  await loadData()
}

window.deleteItem = async (id) => {
  if (!confirm('ลบรายการนี้?')) return
  await supabase.from('items').delete().eq('id', id)
  showNotification('ลบรายการเรียบร้อยแล้ว')
  await loadData()
}

// ==========================================
// COMMITTEES TAB
// ==========================================
function renderCommittees(el) {
  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h2 style="font-size:1.1rem;font-weight:700;">คณะกรรมการ (${state.committees.length} คน)</h2>
      <button class="btn btn-primary" onclick="showAddCommittee()">+ เพิ่มกรรมการ</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>ลำดับ</th><th>คำนำหน้า</th><th>ชื่อ-สกุล</th><th>ตำแหน่ง</th><th></th></tr></thead>
          <tbody>
            ${state.committees.length === 0 ? '<tr><td colspan="5" class="text-center text-muted">ยังไม่มีข้อมูล</td></tr>' : ''}
            ${state.committees.map((c, i) => `
              <tr>
                <td>${i+1}</td>
                <td>${escHtml(c.prefix||'')}</td>
                <td style="font-weight:500;">${escHtml(c.full_name)}</td>
                <td class="text-muted text-sm">${escHtml(c.position||'')}</td>
                <td style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editCommittee('${c.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteCommittee('${c.id}')">🗑</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`
}

window.showAddCommittee = (c = null) => {
  showModal(`
    <div class="modal-header"><span>${c ? 'แก้ไข' : 'เพิ่ม'}กรรมการ</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">คำนำหน้า</label>
          <select id="c-prefix" class="form-control">
            ${['นาย','นาง','นางสาว','ดร.','นพ.','พญ.','ทพ.','ทพญ.'].map(p => `<option ${c?.prefix===p?'selected':''}>${p}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">ชื่อ-สกุล</label>
          <input id="c-name" class="form-control" value="${escHtml(c?.full_name||'')}" placeholder="ชื่อ-สกุล">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">ตำแหน่ง</label>
        <input id="c-position" class="form-control" value="${escHtml(c?.position||'')}" placeholder="ตำแหน่ง เช่น ประธานกรรมการ">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">ยกเลิก</button>
      <button class="btn btn-primary" onclick="saveCommittee('${c?.id||''}')">บันทึก</button>
    </div>`)
}

window.editCommittee = (id) => {
  const c = state.committees.find(x => x.id === id)
  if (c) showAddCommittee(c)
}

window.saveCommittee = async (id) => {
  const prefix = document.getElementById('c-prefix').value
  const full_name = document.getElementById('c-name').value.trim()
  const position = document.getElementById('c-position').value.trim()
  if (!full_name) { showNotification('กรุณาระบุชื่อ', 'error'); return }
  const order_num = id ? (state.committees.find(c => c.id === id)?.order_num || state.committees.length + 1) : state.committees.length + 1
  const payload = { prefix, full_name, position, order_num }
  const { error } = id
    ? await supabase.from('committees').update(payload).eq('id', id)
    : await supabase.from('committees').insert(payload)
  if (error) { showNotification('เกิดข้อผิดพลาด', 'error'); return }
  showNotification('บันทึกกรรมการเรียบร้อยแล้ว')
  closeModal()
  await loadData()
}

window.deleteCommittee = async (id) => {
  if (!confirm('ลบกรรมการคนนี้?')) return
  await supabase.from('committees').delete().eq('id', id)
  showNotification('ลบกรรมการเรียบร้อยแล้ว')
  await loadData()
}

// ==========================================
// Modal Helpers
// ==========================================
function showModal(html) {
  const container = document.getElementById('modal-container')
  container.innerHTML = `<div class="modal-overlay" onclick="handleOverlayClick(event)"><div class="modal">${html}</div></div>`
}

window.closeModal = () => { document.getElementById('modal-container').innerHTML = '' }
window.handleOverlayClick = (e) => { if (e.target.classList.contains('modal-overlay')) closeModal() }

// ==========================================
// Helpers
// ==========================================
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

init()
