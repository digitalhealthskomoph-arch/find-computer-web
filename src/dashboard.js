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

    let { data: records } = await supabase.from('records').select('*')
    records = (records || []).map(r => {
      if (r.standard_price > 0) r.characteristics = r.unit_price <= r.standard_price ? 'ตรงตามเกณฑ์' : 'ไม่ตรงตามเกณฑ์'
      else r.characteristics = 'ไม่มีในเกณฑ์ราคากลาง'
      return r
    })

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
    if (char.includes('ไม่ตรงเกณฑ์') || char.includes('ไม่ตรงตามเกณฑ์')) countNotMatch++
    else if (char.includes('ตรงเกณฑ์') || char.includes('ตรงตามเกณฑ์')) countMatch++
    else if (char.includes('ไม่มี')) countNoSpec++
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
            : renderMeetingTable(mRecs, m.id)}
        </div>
      </div>`
  }).join('')
}

function renderMeetingTable(recs, mId) {
  const grouped = {}
  recs.forEach(r => {
    const key = `${r.agency || 'ไม่ระบุ'} (${r.district || 'ไม่ระบุ'})`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(r)
  })

  return Object.entries(grouped).map(([agencyKey, items], idx) => {
    const total = items.reduce((s, r) => s + (parseFloat(r.total_price) || 0), 0)
    const agencyId = `agency-${mId}-${idx}`
    return `
      <div style="border:1px solid var(--border); border-radius:6px; margin-bottom:8px; overflow:hidden;">
        <div style="background:#f8fafc; padding:12px 16px; cursor:pointer; display:flex; align-items:center; gap:12px; flex-wrap:wrap;" onclick="toggleAgency('${agencyId}')">
          <span id="chev-${agencyId}" style="color:var(--text-muted); font-size:0.8rem; width:16px;">▼</span>
          <span style="font-weight:700; color:var(--text); font-size:1rem;">${escHtml(agencyKey)}</span>
          <span class="badge badge-blue">${items.length} รายการ</span>
          <span class="badge badge-green">รวม ${formatCurrency(total)} บาท</span>
        </div>
        <div id="detail-${agencyId}" class="table-wrap">
          <table style="margin:0; border-top:1px solid var(--border);">
            <thead>
              <tr>
                <th style="width:50px;text-align:center;">ลำดับ</th>
                <th>รายการครุภัณฑ์</th>
                <th>จำนวน/หน่วย</th>
                <th>ราคากลาง</th>
                <th>ราคาต่อหน่วย</th>
                <th>วงเงินรวม</th>
                <th>คุณลักษณะ</th>
                <th>แหล่งเงิน</th>
                <th>วิธีจัดหา</th>
                <th>มติความเห็นชอบ</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((r, i) => `
                <tr>
                  <td style="color:var(--text-muted); text-align:center;">
                    <span style="display:inline-block; border-left:1px solid #cbd5e1; border-bottom:1px solid #cbd5e1; width:8px; height:8px; margin-right:4px; margin-bottom:4px;"></span>
                    ${i + 1}
                  </td>
                  <td>${escHtml(r.item_name || '')}</td>
                  <td>${r.quantity || ''} ${escHtml(r.unit || '')}</td>
                  <td>${formatCurrency(r.standard_price)}</td>
                  <td>${formatCurrency(r.unit_price)}</td>
                  <td style="font-weight:600;">${formatCurrency(r.total_price)}</td>
                  <td>${charBadge(r.characteristics || '')}</td>
                  <td>${escHtml(r.funding_source || '')}</td>
                  <td>${escHtml(r.procurement_method || '')}</td>
                  <td>${resolutionBadge(r.resolution_type || r.resolution || 'เห็นชอบ', r.resolution_comment)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  }).join('')
}

function resolutionBadge(val, comment) {
  if (!val) return ''
  let out = ''
  if (val.includes('เห็นชอบ') && !val.includes('ไม่')) out = '<span class="badge badge-green">เห็นชอบ</span>'
  else if (val.includes('ไม่เห็นชอบ')) out = '<span class="badge badge-red">ไม่เห็นชอบ</span>'
  else out = '<span class="badge badge-orange">' + escHtml(val) + '</span>'
  
  if (val === 'อื่นๆ' && comment) {
    out += '<div style="font-size:0.8rem;color:#f57c00;margin-top:4px;">เหตุผล: ' + escHtml(comment) + '</div>'
  }
  return out
}

function charBadge(c) {
  if (!c) return '-'
  if (c.includes('ตรงเกณฑ์') || c.includes('ตรงตามเกณฑ์')) return '<span class="badge badge-green">ตรงตามเกณฑ์</span>'
  if (c.includes('ไม่ตรงเกณฑ์') || c.includes('ไม่ตรงตามเกณฑ์')) return '<span class="badge badge-red">ไม่ตรงตามเกณฑ์</span>'
  return '<span class="badge badge-orange">' + escHtml(c) + '</span>'
}

window.toggleMeeting = function(id) {
  const body = document.getElementById('meeting-detail-' + id)
  const chev = document.getElementById('chevron-' + id)
  if (body) {
    body.classList.toggle('hidden')
    if (chev) chev.textContent = body.classList.contains('hidden') ? '▼' : '▲'
  }
}

window.toggleAgency = function(id) {
  const detail = document.getElementById('detail-' + id)
  const chev = document.getElementById('chev-' + id)
  if (detail) {
    detail.classList.toggle('hidden')
    if (chev) chev.textContent = detail.classList.contains('hidden') ? '▶' : '▼'
  }
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

init()
