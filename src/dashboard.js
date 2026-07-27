import './style.css'
import { supabase } from './lib/supabase.js'
import { toThaiDate, formatCurrency } from './lib/utils.js'

const app = document.getElementById('app')

async function init() {
  renderLayout()
  await loadDashboard()
}

function renderLayout() {
  app.innerHTML = `
    <nav class="navbar no-print">
      <div class="navbar-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
        ระบบจัดหาคอมพิวเตอร์ภาครัฐ | สสจ.สระแก้ว
      </div>
      <div class="navbar-links">
        <a href="/admin.html">เข้าสู่ระบบ Admin</a>
      </div>
    </nav>

    <div class="hero">
      <h1>ระบบบริหารและจัดหาระบบคอมพิวเตอร์ภาครัฐ</h1>
      <p>สำนักงานสาธารณสุขจังหวัดสระแก้ว</p>
    </div>

    <div class="container" style="padding-top:24px; padding-bottom:40px;">
      <div id="stats-section"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h2 style="font-size:1.1rem;font-weight:700;">รายการประชุมทั้งหมด</h2>
        <span id="meeting-count" class="badge badge-blue"></span>
      </div>
      <div id="meetings-list">
        <div class="loading-spinner"><div class="spinner"></div><span>กำลังโหลดข้อมูล...</span></div>
      </div>
    </div>
  `
}

async function loadDashboard() {
  try {
    const { data: meetings, error: mErr } = await supabase
      .from('meetings')
      .select('*')
      .order('meeting_date', { ascending: false, nullsFirst: false })

    if (mErr) throw mErr

    const { data: records } = await supabase.from('records').select('meeting_id, total_price, characteristics, standard_price, unit_price')

    renderStats(meetings, records)
    renderMeetings(meetings, records)
  } catch (e) {
    document.getElementById('meetings-list').innerHTML = `<div class="alert alert-danger">เกิดข้อผิดพลาด: ${e.message}</div>`
  }
}

function renderStats(meetings, records) {
  const totalBudget = (records || []).reduce((s, r) => s + (parseFloat(r.total_price) || 0), 0)
  const totalAgencies = new Set((records || []).map(r => r.agency)).size
  let countMatch = 0, countNoSpec = 0, countNotMatch = 0
  ;(records || []).forEach(r => {
    const char = (r.characteristics || '').trim()
    if (char === 'ตรงตามเกณฑ์') countMatch++
    else if (char === 'ไม่มีในเกณฑ์') countNoSpec++
    else if (char) countNotMatch++
  })

  document.getElementById('stats-section').innerHTML = `
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-value">${meetings.length}</div>
        <div class="stat-label">รอบประชุมทั้งหมด</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${(records || []).length}</div>
        <div class="stat-label">รายการครุภัณฑ์</div>
      </div>
      <div class="stat-card green">
        <div class="stat-value">${countMatch}</div>
        <div class="stat-label">ตรงตามเกณฑ์ราคากลาง</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-value">${countNoSpec}</div>
        <div class="stat-label">ไม่มีในเกณฑ์ราคากลาง</div>
      </div>
      <div class="stat-card red">
        <div class="stat-value">${countNotMatch}</div>
        <div class="stat-label">ไม่ตรงตามเกณฑ์</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="font-size:1.3rem;">${formatCurrency(totalBudget)}</div>
        <div class="stat-label">งบประมาณรวม (บาท)</div>
      </div>
    </div>
  `
}

function renderMeetings(meetings, records) {
  const countEl = document.getElementById('meeting-count')
  const listEl = document.getElementById('meetings-list')
  countEl.textContent = `${meetings.length} รอบ`

  if (meetings.length === 0) {
    listEl.innerHTML = '<div class="card"><div class="card-body text-center text-muted">ยังไม่มีรอบประชุม</div></div>'
    return
  }

  listEl.innerHTML = meetings.map(m => {
    const mRecs = (records || []).filter(r => r.meeting_id === m.id)
    const total = mRecs.reduce((s, r) => s + (parseFloat(r.total_price) || 0), 0)
    const agencies = new Set(mRecs.map(r => r.agency)).size
    return `
      <div class="meeting-card">
        <div class="meeting-card-header" onclick="toggleMeeting('${m.id}')">
          <div>
            <div style="font-weight:700;font-size:1rem;">${escHtml(m.name)}</div>
            <div class="text-sm text-muted" style="margin-top:2px;">
              📅 วันประชุม: ${m.meeting_date ? toThaiDate(m.meeting_date) : 'ยังไม่ระบุ'}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
            <div class="text-center">
              <div style="font-weight:700;font-size:1.1rem;color:var(--primary);">${mRecs.length}</div>
              <div class="text-sm text-muted">รายการ</div>
            </div>
            <div class="text-center">
              <div style="font-weight:700;font-size:1rem;color:var(--secondary);">${formatCurrency(total)}</div>
              <div class="text-sm text-muted">บาท</div>
            </div>
            <span style="color:var(--text-muted);" id="chevron-${m.id}">▼</span>
          </div>
        </div>
        <div class="meeting-card-body hidden" id="meeting-detail-${m.id}">
          ${mRecs.length === 0
            ? '<p class="text-muted text-center">ยังไม่มีรายการในรอบนี้</p>'
            : renderMeetingTable(mRecs)}
        </div>
      </div>`
  }).join('')
}

function renderMeetingTable(recs) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>อำเภอ</th>
            <th>หน่วยงาน</th>
            <th>รายการ</th>
            <th>จำนวน</th>
            <th>ราคา/หน่วย</th>
            <th>รวม (บาท)</th>
            <th>แหล่งเงิน</th>
            <th>มติ</th>
          </tr>
        </thead>
        <tbody>
          ${recs.map((r, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${escHtml(r.district || '')}</td>
              <td>${escHtml(r.agency || '')}</td>
              <td>${escHtml(r.item_name || '')}</td>
              <td>${r.quantity || ''} ${escHtml(r.unit || '')}</td>
              <td>${formatCurrency(r.unit_price)}</td>
              <td style="font-weight:600;">${formatCurrency(r.total_price)}</td>
              <td>${escHtml(r.funding_source || '')}</td>
              <td>${resolutionBadge(r.resolution_type || r.resolution || 'เห็นชอบ')}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`
}

function resolutionBadge(val) {
  if (!val) return ''
  if (val.includes('เห็นชอบ') && !val.includes('ไม่')) return '<span class="badge badge-green">เห็นชอบ</span>'
  if (val.includes('ไม่เห็นชอบ')) return '<span class="badge badge-red">ไม่เห็นชอบ</span>'
  return '<span class="badge badge-orange">' + escHtml(val) + '</span>'
}

window.toggleMeeting = function(id) {
  const body = document.getElementById('meeting-detail-' + id)
  const chev = document.getElementById('chevron-' + id)
  if (body) {
    body.classList.toggle('hidden')
    if (chev) chev.textContent = body.classList.contains('hidden') ? '▼' : '▲'
  }
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

init()
