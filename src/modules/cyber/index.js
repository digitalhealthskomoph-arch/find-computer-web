import ciiData from './data/ciiData.json'
import policyFrameworkData from './data/policyFrameworkData.json'
import { showNotification, toThaiDate } from '../../lib/utils.js'

const LOCAL_STORAGE_ROUNDS_KEY = 'sko_cii_assessment_rounds'
const LOCAL_STORAGE_INCIDENTS_KEY = 'sko_cyber_incidents'
const LOCAL_STORAGE_DOCS_KEY = 'sko_cyber_docs_links'
const LOCAL_STORAGE_LOGS_KEY = 'sko_cii_update_logs'

let cyberState = {
  activeTab: 'assessment', // 'assessment' | 'docs' | 'incidents'
  assessmentSubTab: 'assessment', // 'log' | 'instructions' | 'assessment'
  selectedDomainIndex: 0,
  rounds: [],
  updateLogs: [],
  selectedDoc: {
    category: 'ประมวลแนวทางปฏิบัติ',
    domain: 'แผนการตรวจสอบ (Cybersecurity Audit Plan) ด้านการรักษาความมั่นคงปลอดภัยไซเบอร์',
    major: '',
    title: '1.1 Audit Plan Procedure',
    key: '1.1 Audit Plan Procedure'
  },
  docSearchKeyword: '',
  docLinks: {},
  incidents: [],
  expandedNodes: {
    'ประมวลแนวทางปฏิบัติ': true,
    'กรอบมาตรฐาน': true,
    'แผนการตรวจสอบ (Cybersecurity Audit Plan) ด้านการรักษาความมั่นคงปลอดภัยไซเบอร์': true,
    'Govern': true,
    'Identify': true,
    '1.Asset Management': true
  }
}

// Flatten all selectable documents for search and selection
const allFlatDocs = []
function extractDocs(items, cat = '', domain = '', major = '') {
  items.forEach(item => {
    if (item.children && item.children.length > 0) {
      if (!cat) {
        extractDocs(item.children, item.title, '', '')
      } else if (!domain) {
        extractDocs(item.children, cat, item.title, '')
      } else {
        extractDocs(item.children, cat, domain, item.title)
      }
    } else {
      allFlatDocs.push({
        category: cat,
        domain: domain,
        major: major,
        title: item.title,
        key: item.title,
        href: item.href || ''
      })
    }
  })
}
extractDocs(policyFrameworkData)

// Initialize data
function initData() {
  // 1. Assessment rounds
  try {
    const savedRounds = localStorage.getItem(LOCAL_STORAGE_ROUNDS_KEY)
    if (savedRounds) {
      cyberState.rounds = JSON.parse(savedRounds)
    }
  } catch (e) {}

  if (!cyberState.rounds || cyberState.rounds.length === 0) {
    const today = new Date().toISOString().split('T')[0]
    cyberState.rounds = [
      {
        id: 'round_1',
        date: today,
        scores: {}
      }
    ]
  }

  // 2. Incidents (Real data only, no mockups)
  try {
    const savedIncidents = localStorage.getItem(LOCAL_STORAGE_INCIDENTS_KEY)
    if (savedIncidents) {
      cyberState.incidents = JSON.parse(savedIncidents)
    } else {
      cyberState.incidents = []
    }
  } catch (e) {
    cyberState.incidents = []
  }

  // 3. Document links
  try {
    const savedDocs = localStorage.getItem(LOCAL_STORAGE_DOCS_KEY)
    if (savedDocs) {
      cyberState.docLinks = JSON.parse(savedDocs)
    } else {
      cyberState.docLinks = {}
    }
  } catch (e) {
    cyberState.docLinks = {}
  }

  // 4. Update Logs
  try {
    const savedLogs = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY)
    if (savedLogs) {
      cyberState.updateLogs = JSON.parse(savedLogs)
    } else {
      cyberState.updateLogs = [
        {
          id: 'log_1',
          date: '2026-02-26',
          displayDate: '26 กุมภาพันธ์ 2569',
          content: 'ทำการประเมินสถานภาพอีกครั้ง เพื่อประเมินความพร้อมก่อนการ Audit (ครั้งล่าสุด)',
          author: 'นายธนกฤต นิธิตันติปัญญา'
        },
        {
          id: 'log_2',
          date: '2026-02-23',
          displayDate: '23 กุมภาพันธ์ 2569',
          content: 'เริ่มดำเนินการสร้าง Template จนแล้วเสร็จและทำการประเมิน (ครั้งที่ 1)',
          author: 'นายธนกฤต นิธิตันติปัญญา'
        }
      ]
    }
  } catch (e) {
    cyberState.updateLogs = []
  }
}

initData()

function saveRounds() {
  try {
    localStorage.setItem(LOCAL_STORAGE_ROUNDS_KEY, JSON.stringify(cyberState.rounds))
  } catch (e) {}
}

function saveUpdateLogs() {
  try {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(cyberState.updateLogs))
  } catch (e) {}
}

function saveIncidents() {
  try {
    localStorage.setItem(LOCAL_STORAGE_INCIDENTS_KEY, JSON.stringify(cyberState.incidents))
  } catch (e) {}
}

function saveDocs() {
  try {
    localStorage.setItem(LOCAL_STORAGE_DOCS_KEY, JSON.stringify(cyberState.docLinks))
  } catch (e) {}
}

// Calculations
function getAverage(scoresArray) {
  const validScores = scoresArray.filter(s => s > 0)
  if (validScores.length === 0) return '0.00'
  return (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2)
}

function getScoreBadgeStyle(scoreStr) {
  const score = Number(scoreStr)
  if (!score || score === 0) {
    return 'background:#f1f5f9; color:#64748b; border:1px solid #cbd5e1;'
  }
  if (score >= 2.6) {
    return 'background:#dcfce7; color:#15803d; border:1px solid #86efac;'
  }
  if (score >= 2.1) {
    return 'background:#fef9c3; color:#a16207; border:1px solid #fde047;'
  }
  return 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;'
}

function getSelectScoreStyle(val) {
  const score = Number(val)
  if (score === 3) return 'background:#dcfce7; color:#15803d; font-weight:700; border:1px solid #86efac;'
  if (score === 2) return 'background:#fef9c3; color:#a16207; font-weight:700; border:1px solid #fde047;'
  if (score === 1) return 'background:#fee2e2; color:#b91c1c; font-weight:700; border:1px solid #fca5a5;'
  return 'background:#ffffff; color:#64748b; border:1px solid #cbd5e1;'
}

export function renderCyberModule(container) {
  container.innerHTML = `
    <div class="module-wrapper" style="max-width:100%; margin:0 auto; padding:0 4px;">
      
      <!-- Top Header -->
      <div style="border-bottom:1px solid #e2e8f0; padding-bottom:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="badge" style="background:#2563eb; color:#fff; font-size:12px; font-weight:700; padding:3px 8px; border-radius:4px;">CII Compliance</span>
            <span style="color:#64748b; font-size:13px;">สำนักงานสาธารณสุขจังหวัดสระแก้ว ตาม พ.ร.บ. ไซเบอร์ 2562</span>
          </div>
          <h1 style="font-size:1.6rem; font-weight:800; color:#1e293b; margin:0; line-height:1.3;">
            ระบบบริหารจัดการความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity System)
          </h1>
          <p style="color:#64748b; font-size:0.9rem; margin-top:4px; margin-bottom:0;">
            การประเมินสถานภาพ CII, ประมวลแนวทางปฏิบัติ, กรอบมาตรฐาน และการรับมือภัยคุกคามสารสนเทศ
          </p>
        </div>

        <div style="display:flex; gap:10px; align-items:center;">
          <button id="cyber-export-excel-btn" class="btn" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; font-weight:600; font-size:13px; padding:8px 14px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export (Excel)
          </button>
          <button id="cyber-save-data-btn" class="btn btn-primary" style="background:#2563eb; border-color:#2563eb; font-weight:700; font-size:13px; padding:8px 16px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            บันทึกข้อมูล
          </button>
        </div>
      </div>

      <!-- 3 Primary Tabs (Merged as requested: 1. CII Assessment [Log, Criteria, Assessment], 2. Policy & Standards, 3. Incident Report) -->
      <div style="background:#f1f5f9; padding:4px; border-radius:8px; display:inline-flex; gap:4px; margin-bottom:20px; flex-wrap:wrap; max-width:100%;">
        <button class="cyber-main-tab-btn ${cyberState.activeTab === 'assessment' ? 'active' : ''}" data-tab="assessment" style="border:none; padding:9px 18px; font-size:14px; font-weight:700; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; ${cyberState.activeTab === 'assessment' ? 'background:#2563eb; color:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.15);' : 'background:transparent; color:#64748b;'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          1. แบบประเมิน CII Self Assessment
        </button>
        <button class="cyber-main-tab-btn ${cyberState.activeTab === 'docs' ? 'active' : ''}" data-tab="docs" style="border:none; padding:9px 18px; font-size:14px; font-weight:700; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; ${cyberState.activeTab === 'docs' ? 'background:#2563eb; color:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.15);' : 'background:transparent; color:#64748b;'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          2. ประมวลแนวทางปฏิบัติ และกรอบมาตรฐาน
          <span style="background:rgba(255,255,255,0.25); color:${cyberState.activeTab === 'docs' ? '#fff' : '#64748b'}; font-size:11px; padding:1px 6px; border-radius:10px;">80 หัวข้อ</span>
        </button>
        <button class="cyber-main-tab-btn ${cyberState.activeTab === 'incidents' ? 'active' : ''}" data-tab="incidents" style="border:none; padding:9px 18px; font-size:14px; font-weight:700; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; ${cyberState.activeTab === 'incidents' ? 'background:#2563eb; color:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.15);' : 'background:transparent; color:#64748b;'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          3. รายงานเหตุภัยคุกคามไซเบอร์
        </button>
      </div>

      <!-- Main Content Area -->
      <div id="cyber-content-container" class="card" style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; min-height:650px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.04);"></div>

      <!-- Incident Modal Container -->
      <div id="cyber-modal-container"></div>
    </div>
  `

  bindNavEvents(container)
  renderActiveTab(container)
}

function bindNavEvents(container) {
  container.querySelectorAll('.cyber-main-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cyberState.activeTab = btn.dataset.tab
      renderCyberModule(container)
    })
  })

  // Export Excel
  document.getElementById('cyber-export-excel-btn')?.addEventListener('click', exportCiiToExcel)

  // Save Data
  document.getElementById('cyber-save-data-btn')?.addEventListener('click', () => {
    saveRounds()
    saveUpdateLogs()
    saveDocs()
    saveIncidents()
    showNotification('บันทึกข้อมูลการประเมิน CII และประวัติการปรับปรุงเรียบร้อยแล้ว', 'success')
  })
}

function renderActiveTab(container) {
  const contentEl = document.getElementById('cyber-content-container')
  if (!contentEl) return

  switch (cyberState.activeTab) {
    case 'assessment':
      renderCiiAssessmentMainTab(contentEl, container)
      break
    case 'docs':
      renderPolicyAndFrameworkTab(contentEl)
      break
    case 'incidents':
      renderIncidentsTab(contentEl)
      break
  }
}

// =========================================================================
// 1. CII Assessment Main Tab (Contains 3 Sub-tabs: Update Log, Criteria, Assessment)
// =========================================================================
function renderCiiAssessmentMainTab(el, container) {
  el.innerHTML = `
    <div style="display:flex; flex-direction:column; height:100%;">
      <!-- Sub-tabs navigation directly matching Cyber_sec_sko_moph/frontend/src/app/cii-assessment/page.tsx -->
      <div style="padding:16px 20px; border-bottom:1px solid #e2e8f0; background:#f8fafc; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="background:#e2e8f0; padding:3px; border-radius:8px; display:inline-flex; gap:3px;">
          <button class="cii-subtab-btn ${cyberState.assessmentSubTab === 'log' ? 'active' : ''}" data-subtab="log" style="border:none; padding:6px 14px; font-size:13px; font-weight:600; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; ${cyberState.assessmentSubTab === 'log' ? 'background:#fff; color:#1d4ed8; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'background:transparent; color:#64748b;'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Update Log
          </button>
          <button class="cii-subtab-btn ${cyberState.assessmentSubTab === 'instructions' ? 'active' : ''}" data-subtab="instructions" style="border:none; padding:6px 14px; font-size:13px; font-weight:600; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; ${cyberState.assessmentSubTab === 'instructions' ? 'background:#fff; color:#1d4ed8; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'background:transparent; color:#64748b;'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            คำอธิบายและเกณฑ์
          </button>
          <button class="cii-subtab-btn ${cyberState.assessmentSubTab === 'assessment' ? 'active' : ''}" data-subtab="assessment" style="border:none; padding:6px 14px; font-size:13px; font-weight:600; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; ${cyberState.assessmentSubTab === 'assessment' ? 'background:#fff; color:#1d4ed8; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'background:transparent; color:#64748b;'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            แบบประเมิน (Self Assessment)
          </button>
        </div>

        <div style="font-size:12px; color:#64748b;">
          อ้างอิงเกณฑ์ตามประกาศ สกมช. ด้านสาธารณสุข
        </div>
      </div>

      <!-- Subtab Container -->
      <div id="cii-subtab-container" style="flex:1;"></div>
    </div>
  `

  // Bind subtab buttons
  el.querySelectorAll('.cii-subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cyberState.assessmentSubTab = btn.dataset.subtab
      renderCiiAssessmentMainTab(el, container)
    })
  })

  const subContainer = document.getElementById('cii-subtab-container')
  if (!subContainer) return

  if (cyberState.assessmentSubTab === 'log') {
    renderUpdateLogSubTab(subContainer)
  } else if (cyberState.assessmentSubTab === 'instructions') {
    renderInstructionsSubTab(subContainer)
  } else {
    renderAssessmentTableSubTab(subContainer, container)
  }
}

// Subtab 1: Update Log
function renderUpdateLogSubTab(el) {
  const logs = cyberState.updateLogs || []
  const rowsHtml = logs.map((log, idx) => {
    const displayDate = log.displayDate || (log.date ? toThaiDate(log.date) : '-')
    const author = log.author || 'เจ้าหน้าที่ผู้รับผิดชอบ'
    const content = log.content || ''
    return `
      <tr style="border-bottom:1px solid #f1f5f9; transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
        <td style="padding:14px 16px; font-weight:700; color:#1e293b; white-space:nowrap; vertical-align:middle; width:220px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; background:#eff6ff; color:#2563eb; font-size:12px; font-weight:800; border:1px solid #bfdbfe;">
              ${idx + 1}
            </span>
            <span>${displayDate}</span>
          </div>
        </td>
        <td style="padding:14px 16px; color:#334155; line-height:1.6; vertical-align:middle;">
          ${content}
        </td>
        <td style="padding:14px 16px; color:#64748b; font-size:13px; white-space:nowrap; vertical-align:middle; width:180px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>${author}</span>
          </div>
        </td>
        <td style="padding:14px 16px; white-space:nowrap; vertical-align:middle; text-align:right; width:210px;">
          <div style="display:inline-flex; gap:6px; justify-content:flex-end; align-items:center;">
            <button class="move-up-cii-log-btn btn" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} style="padding:5px 8px; font-size:12px; font-weight:600; background:#f8fafc; color:${idx === 0 ? '#cbd5e1' : '#334155'}; border:1px solid #cbd5e1; border-radius:6px; cursor:${idx === 0 ? 'not-allowed' : 'pointer'}; display:inline-flex; align-items:center;" title="เลื่อนขึ้น">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="move-down-cii-log-btn btn" data-idx="${idx}" ${idx === logs.length - 1 ? 'disabled' : ''} style="padding:5px 8px; font-size:12px; font-weight:600; background:#f8fafc; color:${idx === logs.length - 1 ? '#cbd5e1' : '#334155'}; border:1px solid #cbd5e1; border-radius:6px; cursor:${idx === logs.length - 1 ? 'not-allowed' : 'pointer'}; display:inline-flex; align-items:center;" title="เลื่อนลง">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="edit-cii-log-btn btn" data-id="${log.id}" style="padding:5px 10px; font-size:12.5px; font-weight:600; background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              แก้ไข
            </button>
            <button class="delete-cii-log-btn btn" data-id="${log.id}" style="padding:5px 10px; font-size:12.5px; font-weight:600; background:#fef2f2; color:#dc2626; border:1px solid #fecaca; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              ลบ
            </button>
          </div>
        </td>
      </tr>
    `
  }).join('')

  el.innerHTML = `
    <div style="padding:28px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:1.25rem; font-weight:800; color:#1e293b; margin:0 0 4px 0; display:flex; align-items:center; gap:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ประวัติการปรับปรุง (Update Log)
          </h2>
          <p style="color:#64748b; font-size:0.875rem; margin:0;">
            บันทึกประวัติการทบทวน แก้ไข และประเมินสถานภาพความมั่นคงปลอดภัยไซเบอร์
          </p>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <button id="add-cii-log-btn" class="btn btn-primary" style="background:#2563eb; border-color:#2563eb; font-weight:700; font-size:13px; padding:8px 16px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + เพิ่มประวัติการปรับปรุง
          </button>
        </div>
      </div>

      <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:14px;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0; color:#475569;">
            <tr>
              <th style="padding:12px 16px; font-weight:700; width:220px;">วันที่ปรับปรุง</th>
              <th style="padding:12px 16px; font-weight:700;">สิ่งที่ปรับปรุง / แก้ไข</th>
              <th style="padding:12px 16px; font-weight:700; width:180px;">ผู้บันทึก</th>
              <th style="padding:12px 16px; font-weight:700; width:210px; text-align:right;">จัดการ</th>
            </tr>
          </thead>
          <tbody style="color:#334155;">
            ${rowsHtml || `
              <tr>
                <td colspan="4" style="padding:36px; text-align:center; color:#94a3b8;">
                  <p style="margin:0 0 8px 0; font-weight:600; font-size:15px;">ยังไม่มีประวัติการปรับปรุง</p>
                  <p style="margin:0; font-size:13px;">กดปุ่ม <strong>+ เพิ่มประวัติการปรับปรุง</strong> ด้านบน เพื่อเริ่มบันทึกรายการแรก</p>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `

  // Event listener: Add
  document.getElementById('add-cii-log-btn')?.addEventListener('click', () => {
    openUpdateLogModal(null, () => renderUpdateLogSubTab(el))
  })

  // Event listener: Move Up
  el.querySelectorAll('.move-up-cii-log-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10)
      if (idx > 0 && idx < cyberState.updateLogs.length) {
        const temp = cyberState.updateLogs[idx]
        cyberState.updateLogs[idx] = cyberState.updateLogs[idx - 1]
        cyberState.updateLogs[idx - 1] = temp
        saveUpdateLogs()
        renderUpdateLogSubTab(el)
      }
    })
  })

  // Event listener: Move Down
  el.querySelectorAll('.move-down-cii-log-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10)
      if (idx >= 0 && idx < cyberState.updateLogs.length - 1) {
        const temp = cyberState.updateLogs[idx]
        cyberState.updateLogs[idx] = cyberState.updateLogs[idx + 1]
        cyberState.updateLogs[idx + 1] = temp
        saveUpdateLogs()
        renderUpdateLogSubTab(el)
      }
    })
  })

  // Event listener: Edit
  el.querySelectorAll('.edit-cii-log-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const targetLog = cyberState.updateLogs.find(l => l.id === id)
      if (targetLog) {
        openUpdateLogModal(targetLog, () => renderUpdateLogSubTab(el))
      }
    })
  })

  // Event listener: Delete
  el.querySelectorAll('.delete-cii-log-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const targetLog = cyberState.updateLogs.find(l => l.id === id)
      if (!targetLog) return
      const targetName = targetLog.displayDate || targetLog.date || 'รายการนี้'
      if (confirm(`ยืนยันการลบประวัติการปรับปรุง "${targetName}" ใช่หรือไม่?`)) {
        cyberState.updateLogs = cyberState.updateLogs.filter(l => l.id !== id)
        saveUpdateLogs()
        showNotification('ลบประวัติการปรับปรุงเรียบร้อยแล้ว', 'success')
        renderUpdateLogSubTab(el)
      }
    })
  })
}

function openUpdateLogModal(logToEdit = null, onSaved = null) {
  const modalContainer = document.getElementById('cyber-modal-container')
  if (!modalContainer) return

  const isEditing = !!logToEdit
  const todayISO = new Date().toISOString().split('T')[0]
  const defaultDate = isEditing ? (logToEdit.date || todayISO) : todayISO
  const defaultDisplayDate = isEditing 
    ? (logToEdit.displayDate || toThaiDate(defaultDate))
    : toThaiDate(defaultDate)
  const defaultAuthor = isEditing ? (logToEdit.author || '') : 'นายธนกฤต นิธิตันติปัญญา'
  const defaultContent = isEditing ? (logToEdit.content || '') : ''

  modalContainer.innerHTML = `
    <div class="modal-overlay" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px;">
      <div class="modal" style="background:#fff; border-radius:12px; width:100%; max-width:580px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.3); overflow:hidden;">
        <div class="modal-header" style="background:#1e293b; color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:700; display:flex; align-items:center; gap:8px;">
            ${isEditing ? '✏️ แก้ไขประวัติการปรับปรุง (Update Log)' : '➕ เพิ่มประวัติการปรับปรุงใหม่ (Update Log)'}
          </h3>
          <button id="close-log-modal" style="background:none; border:none; font-size:24px; color:#fff; cursor:pointer; line-height:1;">&times;</button>
        </div>
        <form id="cii-log-form" style="padding:22px; display:flex; flex-direction:column; gap:16px; font-size:14px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div>
              <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">เลือกวันที่ (ค.ศ.) *</label>
              <input type="date" id="log-date" class="form-control" value="${defaultDate}" required style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; box-sizing:border-box;">
            </div>
            <div>
              <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">วันที่แสดงผล (พ.ศ.) *</label>
              <input type="text" id="log-display-date" class="form-control" value="${defaultDisplayDate}" required placeholder="เช่น 26 กุมภาพันธ์ 2569" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; box-sizing:border-box;">
            </div>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">ผู้ทำการปรับปรุง / ผู้บันทึก</label>
            <input type="text" id="log-author" class="form-control" value="${defaultAuthor}" placeholder="เช่น นายธนกฤต นิธิตันติปัญญา" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; box-sizing:border-box;">
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">สิ่งที่ปรับปรุง / แก้ไข *</label>
            <textarea id="log-content" class="form-control" rows="4" required placeholder="ระบุรายละเอียด เช่น ทำการประเมินสถานภาพอีกครั้ง เพื่อประเมินความพร้อมก่อนการ Audit..." style="width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; line-height:1.5; resize:vertical; box-sizing:border-box;">${defaultContent}</textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px; border-top:1px solid #e2e8f0; padding-top:16px;">
            <button type="button" id="cancel-log-btn" class="btn" style="background:#f1f5f9; color:#475569; font-weight:600; padding:8px 16px; border-radius:6px; cursor:pointer; border:1px solid #cbd5e1;">ยกเลิก</button>
            <button type="submit" class="btn btn-primary" style="background:#2563eb; border-color:#2563eb; font-weight:700; padding:8px 18px; border-radius:6px; display:inline-flex; align-items:center; gap:6px; cursor:pointer; color:#fff;">
              💾 บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  `

  const close = () => { modalContainer.innerHTML = '' }
  document.getElementById('close-log-modal')?.addEventListener('click', close)
  document.getElementById('cancel-log-btn')?.addEventListener('click', close)

  // Auto update display date when picking date
  const dateInput = document.getElementById('log-date')
  const displayDateInput = document.getElementById('log-display-date')
  dateInput?.addEventListener('change', (e) => {
    if (e.target.value) {
      displayDateInput.value = toThaiDate(e.target.value)
    }
  })

  document.getElementById('cii-log-form')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const dateVal = dateInput.value
    const displayDateVal = displayDateInput.value.trim()
    const authorVal = document.getElementById('log-author')?.value.trim() || 'เจ้าหน้าที่ผู้รับผิดชอบ'
    const contentVal = document.getElementById('log-content')?.value.trim()

    if (!contentVal) return

    if (isEditing) {
      const idx = cyberState.updateLogs.findIndex(l => l.id === logToEdit.id)
      if (idx !== -1) {
        cyberState.updateLogs[idx] = {
          ...cyberState.updateLogs[idx],
          date: dateVal,
          displayDate: displayDateVal || toThaiDate(dateVal),
          author: authorVal,
          content: contentVal
        }
      }
    } else {
      const newLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        date: dateVal,
        displayDate: displayDateVal || toThaiDate(dateVal),
        author: authorVal,
        content: contentVal
      }
      cyberState.updateLogs.unshift(newLog)
    }

    saveUpdateLogs()
    close()
    showNotification(isEditing ? 'แก้ไขประวัติการปรับปรุงเรียบร้อยแล้ว' : 'เพิ่มประวัติการปรับปรุงเรียบร้อยแล้ว', 'success')
    if (typeof onSaved === 'function') {
      onSaved()
    }
  })
}

// Subtab 2: Instructions & Criteria
function renderInstructionsSubTab(el) {
  const latestDate = (cyberState.updateLogs && cyberState.updateLogs.length > 0 && cyberState.updateLogs[0].displayDate)
    ? cyberState.updateLogs[0].displayDate
    : (cyberState.rounds.length > 0 ? toThaiDate(cyberState.rounds[cyberState.rounds.length - 1].date) : '26 กุมภาพันธ์ 2569')

  const latestAuthor = (cyberState.updateLogs && cyberState.updateLogs.length > 0 && cyberState.updateLogs[0].author)
    ? cyberState.updateLogs[0].author
    : 'นายธนกฤต นิธิตันติปัญญา'

  el.innerHTML = `
    <div style="padding:28px; display:flex; flex-direction:column; gap:28px; font-size:14px; color:#334155;">
      
      <!-- Agency Header Card -->
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div>
          <p style="margin:0 0 8px 0;"><strong style="color:#1e293b;">ชื่อหน่วยงาน:</strong> สำนักงานสาธารณสุขจังหวัดสระแก้ว</p>
          <p style="margin:0;"><strong style="color:#1e293b;">สถานะของหน่วยงาน:</strong> หน่วยงาน CII (โครงสร้างพื้นฐานสำคัญทางสารสนเทศ)</p>
        </div>
        <div>
          <p style="margin:0 0 8px 0;"><strong style="color:#1e293b;">ชื่อผู้ทำการประเมิน:</strong> ${latestAuthor}</p>
          <p style="margin:0;"><strong style="color:#1e293b;">วันที่ทำการประเมินล่าสุด:</strong> ${latestDate}</p>
        </div>
      </div>

      <!-- Objectives & Criteria -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:28px;">
        <div>
          <h3 style="font-size:1.1rem; font-weight:700; color:#1e293b; margin:0 0 14px 0; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            วัตถุประสงค์
          </h3>
          <ol style="margin:0; padding-left:20px; line-height:1.8; color:#475569;">
            <li>เป็นการตรวจสอบว่าเราได้ปฏิบัติตามที่กฎหมายกำหนดไว้ หรือไม่</li>
            <li>เพื่อดูว่าตัวเราเองมีความสอดคล้องกับ พรบ. ไซเบอร์ หรือไม่</li>
            <li>เพื่อดูว่าเราเอง มีเอกสารอะไรที่ยังขาดอยู่บ้างในตอนนี้</li>
            <li>สามารถนำไปเป็นส่วนหนึ่งของการตรวจสอบได้ เช่น Audit Compliance Checklist</li>
          </ol>
        </div>

        <div>
          <h3 style="font-size:1.1rem; font-weight:700; color:#1e293b; margin:0 0 14px 0; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            วิธีการทำแบบประเมิน
          </h3>
          <ul style="margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:10px;">
            <li style="display:flex; align-items:center; gap:10px;">
              <span style="background:#dcfce7; color:#15803d; font-weight:800; padding:3px 10px; border-radius:6px; font-size:14px; min-width:28px; text-align:center;">3</span>
              <span>หากมีเอกสารหรือหลักฐานครบถ้วน</span>
            </li>
            <li style="display:flex; align-items:center; gap:10px;">
              <span style="background:#fef9c3; color:#a16207; font-weight:800; padding:3px 10px; border-radius:6px; font-size:14px; min-width:28px; text-align:center;">2</span>
              <span>หากมีเอกสารหรือหลักฐานเป็นบางส่วน</span>
            </li>
            <li style="display:flex; align-items:center; gap:10px;">
              <span style="background:#fee2e2; color:#b91c1c; font-weight:800; padding:3px 10px; border-radius:6px; font-size:14px; min-width:28px; text-align:center;">1</span>
              <span>หากไม่มีเอกสารหรือหลักฐานดังกล่าว</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Scoring Brackets -->
      <div style="border-top:1px solid #e2e8f0; padding-top:24px;">
        <h3 style="font-size:1.1rem; font-weight:700; color:#1e293b; margin:0 0 16px 0;">
          เกณฑ์การแปลผลการประเมินเฉลี่ย
        </h3>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px; text-align:center;">
            <div style="width:100%; height:6px; background:#22c55e; border-radius:999px; margin-bottom:12px;"></div>
            <div style="font-size:1.4rem; font-weight:800; color:#15803d; margin-bottom:4px;">2.6 - 3.0</div>
            <div style="font-size:12px; color:#166534; font-weight:600;">มีความสอดคล้องกับ พรบ. ไซเบอร์ โดยส่วนมาก</div>
          </div>
          <div style="background:#fefce8; border:1px solid #fef08a; border-radius:10px; padding:16px; text-align:center;">
            <div style="width:100%; height:6px; background:#eab308; border-radius:999px; margin-bottom:12px;"></div>
            <div style="font-size:1.4rem; font-weight:800; color:#a16207; margin-bottom:4px;">2.1 - 2.5</div>
            <div style="font-size:12px; color:#854d0e; font-weight:600;">อยู่ระหว่างการทำให้มีความสอดคล้อง</div>
          </div>
          <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:16px; text-align:center;">
            <div style="width:100%; height:6px; background:#ef4444; border-radius:999px; margin-bottom:12px;"></div>
            <div style="font-size:1.4rem; font-weight:800; color:#b91c1c; margin-bottom:4px;">0.0 - 2.0</div>
            <div style="font-size:12px; color:#991b1b; font-weight:600;">ยังไม่มีความสอดคล้องกับ พรบ. ไซเบอร์ โดยส่วนมาก</div>
          </div>
        </div>
      </div>

    </div>
  `
}

// Subtab 3: Assessment Table with Dynamic Rounds & Average Calculations
function renderAssessmentTableSubTab(el, container) {
  const currentDomain = ciiData[cyberState.selectedDomainIndex] || ciiData[0]

  // Calculate Domain Averages for each round
  const domainAverages = cyberState.rounds.map(round => {
    const controlAveragesList = []
    currentDomain.controls.forEach(c => {
      const scores = []
      c.evidences.forEach(ev => {
        const val = round.scores[`D${cyberState.selectedDomainIndex + 1}-${c.controlId}-${ev.evidenceId}`]
        if (val > 0) scores.push(val)
      })
      const cAvg = Number(getAverage(scores))
      if (cAvg > 0) controlAveragesList.push(cAvg)
    })
    return getAverage(controlAveragesList)
  })

  // Build Table HTML
  let tableRowsHtml = ''

  currentDomain.controls.forEach(control => {
    // Control Average per round
    const controlAverages = cyberState.rounds.map(r => {
      const scores = control.evidences.map(ev => r.scores[`D${cyberState.selectedDomainIndex + 1}-${control.controlId}-${ev.evidenceId}`] || 0)
      return getAverage(scores)
    })

    // Control Group Header Row
    tableRowsHtml += `
      <tr style="background:#e2e8f0; color:#1e293b; font-weight:700; border-top:2px solid #94a3b8;">
        <td style="padding:10px 12px; border-right:1px solid #cbd5e1; text-align:center; white-space:nowrap; vertical-align:middle;">
          Control ${control.controlId}
        </td>
        <td style="padding:10px 14px; border-right:1px solid #cbd5e1;">
          <div style="font-size:14px; color:#0f172a;">${control.controlName}</div>
          <div style="font-size:11px; color:#64748b; font-weight:500; margin-top:2px;">คะแนนเฉลี่ย Control:</div>
        </td>
        ${cyberState.rounds.map((r, i) => `
          <td style="padding:10px 8px; border-right:1px solid #cbd5e1; text-align:center; vertical-align:middle;">
            <span style="display:inline-block; padding:3px 10px; border-radius:6px; font-size:13px; font-weight:800; min-width:48px; ${getScoreBadgeStyle(controlAverages[i])}">
              ${controlAverages[i] !== '0.00' ? controlAverages[i] : '-'}
            </span>
          </td>
        `).join('')}
      </tr>
    `

    // Evidence Rows
    control.evidences.forEach(evidence => {
      tableRowsHtml += `
        <tr class="evidence-row" style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:12px; border-right:1px solid #e2e8f0; text-align:center; color:#64748b; font-weight:600; font-size:13px; vertical-align:top;">
            ${control.controlId}.${evidence.evidenceId}
          </td>
          <td style="padding:12px 14px; border-right:1px solid #e2e8f0; vertical-align:top;">
            <p style="margin:0; font-size:13.5px; color:#1e293b; line-height:1.5;">${evidence.description}</p>
            ${evidence.requirement && evidence.requirement !== 'nan' ? `
              <p style="margin:6px 0 0 0; font-size:12px; color:#2563eb; font-weight:600;">
                อ้างอิง: ${evidence.requirement}
              </p>
            ` : ''}
          </td>
          ${cyberState.rounds.map(round => {
            const key = `D${cyberState.selectedDomainIndex + 1}-${control.controlId}-${evidence.evidenceId}`
            const val = round.scores[key] || 0

            return `
              <td style="padding:10px 8px; border-right:1px solid #e2e8f0; text-align:center; vertical-align:top; background:#fafafa;">
                <select class="cii-score-select" 
                  data-round-id="${round.id}" 
                  data-domain-idx="${cyberState.selectedDomainIndex}" 
                  data-control-id="${control.controlId}" 
                  data-evidence-id="${evidence.evidenceId}"
                  style="width:100%; max-width:80px; height:38px; border-radius:6px; text-align:center; font-size:15px; cursor:pointer; outline:none; ${getSelectScoreStyle(val)}">
                  <option value="" ${!val ? 'selected' : ''}>-</option>
                  <option value="3" ${val === 3 ? 'selected' : ''}>3</option>
                  <option value="2" ${val === 2 ? 'selected' : ''}>2</option>
                  <option value="1" ${val === 1 ? 'selected' : ''}>1</option>
                </select>
              </td>
            `
          }).join('')}
        </tr>
      `
    })
  })

  el.innerHTML = `
    <div style="display:flex; flex-direction:column; height:750px;">
      <!-- Header Controls: Domain Selector & Add Round Button -->
      <div style="padding:14px 20px; border-bottom:1px solid #e2e8f0; background:#f8fafc; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:280px;">
          <span style="font-size:13px; font-weight:700; color:#334155; white-space:nowrap;">เลือก Domain:</span>
          <select id="cyber-domain-select" class="form-control" style="width:100%; max-width:620px; font-size:13.5px; font-weight:600; background:#fff;">
            ${ciiData.map((d, i) => `
              <option value="${i}" ${cyberState.selectedDomainIndex === i ? 'selected' : ''}>${d.domain}</option>
            `).join('')}
          </select>
        </div>

        <button id="cyber-add-round-btn" class="btn" style="background:#059669; color:#fff; font-weight:700; font-size:13px; padding:8px 16px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.1);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          สร้างรอบประเมินใหม่
        </button>
      </div>

      <!-- Table Container with Sticky Domain Averages -->
      <div style="flex:1; overflow:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left; min-width:850px;">
          <thead style="position:sticky; top:0; z-index:20; background:#f1f5f9; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
            
            <!-- Sticky Domain Average Row -->
            <tr style="background:#e2e8f0; border-bottom:1px solid #cbd5e1;">
              <th colspan="2" style="padding:10px 14px; text-align:right; font-weight:800; font-size:13px; color:#1e293b; border-right:1px solid #cbd5e1;">
                คะแนนเฉลี่ยรวมของ Domain นี้:
              </th>
              ${cyberState.rounds.map((r, i) => `
                <th style="padding:10px 8px; text-align:center; border-right:1px solid #cbd5e1; width:120px;">
                  <span style="display:inline-block; padding:4px 12px; border-radius:6px; font-size:14px; font-weight:800; ${getScoreBadgeStyle(domainAverages[i])}">
                    ${domainAverages[i] !== '0.00' ? domainAverages[i] : '-'}
                  </span>
                </th>
              `).join('')}
            </tr>

            <!-- Standard Table Header Row -->
            <tr style="border-bottom:1px solid #cbd5e1; font-size:13px; color:#475569;">
              <th style="padding:10px 12px; border-right:1px solid #cbd5e1; width:90px; text-align:center; font-weight:700;">Control</th>
              <th style="padding:10px 14px; border-right:1px solid #cbd5e1; font-weight:700;">รายละเอียด (Objective / Evident)</th>
              ${cyberState.rounds.map((r, i) => `
                <th style="padding:8px 8px; border-right:1px solid #cbd5e1; text-align:center; width:120px; background:#eff6ff;">
                  <div style="font-weight:700; color:#1e40af; margin-bottom:4px; font-size:12px;">รอบที่ ${i + 1}</div>
                  <input type="date" class="round-date-picker" data-round-id="${r.id}" value="${r.date}" 
                    style="width:100%; font-size:11px; padding:3px; border:1px solid #bfdbfe; border-radius:4px; text-align:center; background:#fff; outline:none;">
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `

  // Bind Domain dropdown
  document.getElementById('cyber-domain-select')?.addEventListener('change', (e) => {
    cyberState.selectedDomainIndex = Number(e.target.value)
    renderAssessmentTableSubTab(el, container)
  })

  // Bind Add Round button
  document.getElementById('cyber-add-round-btn')?.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0]
    const newRound = {
      id: `round_${Date.now()}`,
      date: today,
      scores: {}
    }
    if (cyberState.rounds.length > 0) {
      newRound.scores = { ...cyberState.rounds[cyberState.rounds.length - 1].scores }
    }
    cyberState.rounds.push(newRound)
    saveRounds()
    showNotification(`สร้างรอบประเมินที่ ${cyberState.rounds.length} เรียบร้อยแล้ว`, 'success')
    renderAssessmentTableSubTab(el, container)
  })

  // Bind date pickers
  el.querySelectorAll('.round-date-picker').forEach(input => {
    input.addEventListener('change', (e) => {
      const rId = input.dataset.roundId
      const r = cyberState.rounds.find(round => round.id === rId)
      if (r) {
        r.date = e.target.value
        saveRounds()
      }
    })
  })

  // Bind score select dropdowns
  el.querySelectorAll('.cii-score-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const roundId = select.dataset.roundId
      const dIdx = Number(select.dataset.domainIdx)
      const cId = select.dataset.controlId
      const evId = select.dataset.evidenceId
      const val = parseInt(e.target.value, 10) || 0

      const key = `D${dIdx + 1}-${cId}-${evId}`
      const targetRound = cyberState.rounds.find(r => r.id === roundId)
      if (targetRound) {
        if (val > 0) {
          targetRound.scores[key] = val
        } else {
          delete targetRound.scores[key]
        }
        saveRounds()
        renderAssessmentTableSubTab(el, container)
      }
    })
  })
}

// =========================================================================
// 2. Policy & Standards Library Tab (Full Hierarchy from Excel / 80 Topics)
// =========================================================================
function renderPolicyAndFrameworkTab(el) {
  const q = cyberState.docSearchKeyword.toLowerCase().trim()
  const filteredDocs = q ? allFlatDocs.filter(d => 
    d.title.toLowerCase().includes(q) ||
    d.category.toLowerCase().includes(q) ||
    d.domain.toLowerCase().includes(q) ||
    d.major.toLowerCase().includes(q)
  ) : null

  const currentKey = cyberState.selectedDoc.key || '1.1 Audit Plan Procedure'
  const savedData = cyberState.docLinks[currentKey] || {
    editLinks: [{ id: 1, label: 'ต้นฉบับเอกสาร Word / Google Docs', url: 'https://docs.google.com/document/d/example/edit' }],
    pdfLinks: []
  }

  el.innerHTML = `
    <div style="display:flex; height:800px; overflow:hidden;">
      
      <!-- Left Sidebar: Complete Hierarchy Tree with Search -->
      <div style="width:360px; border-right:1px solid #e2e8f0; background:#f8fafc; display:flex; flex-direction:column; flex-shrink:0;">
        
        <!-- Search Input -->
        <div style="padding:14px; border-bottom:1px solid #e2e8f0; background:#fff;">
          <input type="text" id="doc-tree-search-input" class="form-control" 
            placeholder="🔍 ค้นหาหัวข้อเอกสาร (80 หัวข้อ)..." 
            value="${cyberState.docSearchKeyword}" 
            style="width:100%; font-size:13px; padding:7px 12px;">
        </div>

        <!-- Tree View Scrollable -->
        <div id="doc-tree-scroll-container" style="flex:1; overflow-y:auto; padding:12px 10px;">
          ${filteredDocs ? renderFlatSearchResults(filteredDocs) : renderCompleteTreeHtml()}
        </div>
      </div>

      <!-- Right Main Content: Document Details & Viewer -->
      <div style="flex:1; overflow-y:auto; padding:28px;">
        
        <!-- Breadcrumb & Header -->
        <div style="border-bottom:1px solid #e2e8f0; padding-bottom:16px; margin-bottom:24px;">
          <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:#64748b; margin-bottom:6px; flex-wrap:wrap;">
            <span style="font-weight:700; color:#2563eb;">${cyberState.selectedDoc.category || 'ประมวลแนวทางปฏิบัติ'}</span>
            <span>&gt;</span>
            <span style="font-weight:600;">${cyberState.selectedDoc.domain || ''}</span>
            ${cyberState.selectedDoc.major ? `<span>&gt;</span><span>${cyberState.selectedDoc.major}</span>` : ''}
          </div>
          <h2 style="font-size:1.35rem; font-weight:800; color:#1e293b; margin:0 0 6px 0; line-height:1.35;">
            ${cyberState.selectedDoc.title}
          </h2>
          <p style="color:#64748b; font-size:13px; margin:0;">
            จัดการลิงก์เอกสารต้นฉบับ (Word / Google Docs) และแนบไฟล์ PDF แสดงผลบนระบบ
          </p>
        </div>

        <!-- Section 1: Google Docs / Edit Links -->
        <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; margin-bottom:24px; overflow:hidden;">
          <div style="background:#f8fafc; padding:12px 20px; border-bottom:1px solid #e2e8f0; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            ลิงก์สำหรับแก้ไขเอกสาร (Google Docs / Sheets / Word)
          </div>
          <div style="padding:20px;">
            <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
              ${savedData.editLinks.map(link => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
                  <div style="display:flex; align-items:center; gap:10px; min-width:0;">
                    <div style="width:34px; height:34px; background:#dbeafe; color:#2563eb; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </div>
                    <div style="min-width:0;">
                      <div style="font-weight:600; color:#1e293b; font-size:13.5px;">${link.label}</div>
                      <a href="${link.url}" target="_blank" style="font-size:12px; color:#2563eb; text-decoration:none; display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${link.url}</a>
                    </div>
                  </div>
                  <button class="delete-doc-link-btn" data-id="${link.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:12px; padding:4px 8px; flex-shrink:0;">ลบ</button>
                </div>
              `).join('')}
            </div>

            <!-- Add link input -->
            <div style="display:flex; gap:10px; border-top:1px dashed #e2e8f0; padding-top:14px; flex-wrap:wrap;">
              <input type="text" id="new-doc-label" placeholder="ชื่อเอกสาร (เช่น ร่างแบบฟอร์มการขอเปลี่ยนแปลง)" class="form-control" style="flex:1; min-width:180px; font-size:13px;">
              <input type="text" id="new-doc-url" placeholder="URL ลิงก์ (https://docs.google.com/...)" class="form-control" style="flex:2; min-width:240px; font-size:13px;">
              <button id="add-doc-link-btn" class="btn btn-primary" style="background:#1e293b; border-color:#1e293b; font-size:13px; font-weight:600; white-space:nowrap;">
                + เพิ่มลิงก์
              </button>
            </div>
          </div>
        </div>

        <!-- Section 2: PDF Viewer -->
        <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden;">
          <div style="background:#f8fafc; padding:12px 20px; border-bottom:1px solid #e2e8f0; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            เอกสาร PDF อ้างอิง (แสดงผลบนระบบ)
          </div>
          <div style="padding:20px;">
            <!-- Add PDF input -->
            <div style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
              <input type="text" id="new-pdf-label" placeholder="ชื่อไฟล์ PDF (เช่น นโยบายฉบับอนุมัติลงนาม)" class="form-control" style="flex:1; min-width:180px; font-size:13px;">
              <input type="text" id="new-pdf-url" placeholder="URL ของไฟล์ PDF" class="form-control" style="flex:2; min-width:240px; font-size:13px;">
              <button id="add-pdf-link-btn" class="btn" style="background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; font-size:13px; font-weight:600; white-space:nowrap;">
                + แนบ PDF
              </button>
            </div>

            ${savedData.pdfLinks.length === 0 ? `
              <div style="text-align:center; padding:32px; color:#94a3b8; font-size:13px; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
                ยังไม่มีเอกสาร PDF แนบในหัวข้อนี้ สามารถกรอก URL ของไฟล์ PDF ด้านบนเพื่อแสดงผล
              </div>
            ` : savedData.pdfLinks.map(pdf => `
              <div style="border:1px solid #e2e8f0; border-radius:8px; margin-bottom:16px; overflow:hidden;">
                <div style="padding:10px 16px; background:#f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:600; color:#1e293b; font-size:13px;">${pdf.label}</span>
                  <button class="delete-pdf-btn" data-id="${pdf.id}" style="background:#fff; border:1px solid #cbd5e1; color:#ef4444; padding:2px 8px; border-radius:4px; font-size:11px; cursor:pointer;">ลบ</button>
                </div>
                <div style="height:520px; width:100%;">
                  <iframe src="${pdf.url}#view=FitH" style="width:100%; height:100%; border:none;" title="${pdf.label}"></iframe>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `

  // Bind Search input
  document.getElementById('doc-tree-search-input')?.addEventListener('input', (e) => {
    cyberState.docSearchKeyword = e.target.value
    renderPolicyAndFrameworkTab(el)
  })

  // Bind tree item clicks & toggle clicks
  bindTreeEvents(el)

  // Add Google Doc link
  document.getElementById('add-doc-link-btn')?.addEventListener('click', () => {
    const label = document.getElementById('new-doc-label')?.value.trim()
    const url = document.getElementById('new-doc-url')?.value.trim()
    if (!label || !url) return

    if (!cyberState.docLinks[currentKey]) {
      cyberState.docLinks[currentKey] = { editLinks: [], pdfLinks: [] }
    }
    cyberState.docLinks[currentKey].editLinks.push({ id: Date.now(), label, url })
    saveDocs()
    renderPolicyAndFrameworkTab(el)
  })

  // Delete Doc Link
  el.querySelectorAll('.delete-doc-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id)
      if (cyberState.docLinks[currentKey]) {
        cyberState.docLinks[currentKey].editLinks = cyberState.docLinks[currentKey].editLinks.filter(l => l.id !== id)
        saveDocs()
        renderPolicyAndFrameworkTab(el)
      }
    })
  })

  // Add PDF Link
  document.getElementById('add-pdf-link-btn')?.addEventListener('click', () => {
    const label = document.getElementById('new-pdf-label')?.value.trim()
    const url = document.getElementById('new-pdf-url')?.value.trim()
    if (!label || !url) return

    if (!cyberState.docLinks[currentKey]) {
      cyberState.docLinks[currentKey] = { editLinks: [], pdfLinks: [] }
    }
    cyberState.docLinks[currentKey].pdfLinks.push({ id: Date.now(), label, url })
    saveDocs()
    renderPolicyAndFrameworkTab(el)
  })

  // Delete PDF Link
  el.querySelectorAll('.delete-pdf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id)
      if (cyberState.docLinks[currentKey]) {
        cyberState.docLinks[currentKey].pdfLinks = cyberState.docLinks[currentKey].pdfLinks.filter(p => p.id !== id)
        saveDocs()
        renderPolicyAndFrameworkTab(el)
      }
    })
  })
}

function renderFlatSearchResults(docs) {
  if (docs.length === 0) {
    return `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:13px;">ไม่พบหัวข้อที่ค้นหา</div>`
  }

  return `
    <div style="font-size:11px; font-weight:700; color:#64748b; margin-bottom:8px;">
      ผลการค้นหา (${docs.length} รายการ):
    </div>
    <div style="display:flex; flex-direction:column; gap:4px;">
      ${docs.map(d => {
        const isSelected = (cyberState.selectedDoc.key === d.key)
        return `
          <button class="doc-leaf-btn" data-key="${d.key}" style="text-align:left; padding:8px 10px; border-radius:6px; font-size:12.5px; border:none; cursor:pointer; line-height:1.35; ${isSelected ? 'background:#2563eb; color:#fff; font-weight:600;' : 'background:#fff; border:1px solid #e2e8f0; color:#334155;'}">
            <div style="font-size:10px; opacity:0.8; margin-bottom:2px;">${d.category} &gt; ${d.domain}</div>
            <div>${d.title}</div>
          </button>
        `
      }).join('')}
    </div>
  `
}

function renderCompleteTreeHtml() {
  return policyFrameworkData.map(category => {
    const isCatExpanded = cyberState.expandedNodes[category.title] !== false

    return `
      <div style="margin-bottom:14px;">
        <!-- Category Header -->
        <div class="tree-toggle-header" data-node-key="${category.title}" style="display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:#e2e8f0; border-radius:6px; cursor:pointer; font-size:13px; font-weight:700; color:#1e293b;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span>${isCatExpanded ? '▼' : '▶'}</span>
            <span>${category.title}</span>
          </div>
          <span style="font-size:11px; background:#cbd5e1; padding:1px 6px; border-radius:10px; color:#334155;">
            ${category.children?.length || 0} Domains
          </span>
        </div>

        ${isCatExpanded ? `
          <div style="padding-left:10px; margin-top:6px; display:flex; flex-direction:column; gap:6px;">
            ${(category.children || []).map(domain => {
              const isDomainExpanded = cyberState.expandedNodes[domain.title] !== false

              return `
                <div style="border-left:2px solid #cbd5e1; padding-left:8px;">
                  <!-- Domain Header -->
                  <div class="tree-toggle-header" data-node-key="${domain.title}" style="display:flex; align-items:center; gap:6px; padding:5px 8px; font-size:12.5px; font-weight:600; color:#2563eb; cursor:pointer; border-radius:4px; hover:background:#f1f5f9;">
                    <span style="font-size:10px;">${isDomainExpanded ? '▼' : '▶'}</span>
                    <span>${domain.title}</span>
                  </div>

                  ${isDomainExpanded ? `
                    <div style="padding-left:10px; margin-top:4px; display:flex; flex-direction:column; gap:4px;">
                      ${(domain.children || []).map(major => {
                        // If major has children (minors)
                        if (major.children && major.children.length > 0) {
                          const isMajorExpanded = cyberState.expandedNodes[major.title] !== false
                          return `
                            <div style="margin-top:2px;">
                              <div class="tree-toggle-header" data-node-key="${major.title}" style="display:flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#334155; cursor:pointer; padding:3px 6px;">
                                <span style="font-size:9px;">${isMajorExpanded ? '▼' : '▶'}</span>
                                <span>${major.title}</span>
                              </div>
                              ${isMajorExpanded ? `
                                <div style="padding-left:14px; margin-top:2px; display:flex; flex-direction:column; gap:2px;">
                                  ${major.children.map(minor => {
                                    const isSel = (cyberState.selectedDoc.key === minor.title)
                                    return `
                                      <button class="doc-leaf-btn" data-key="${minor.title}" style="text-align:left; padding:5px 8px; border-radius:4px; font-size:11.5px; border:none; cursor:pointer; line-height:1.3; ${isSel ? 'background:#2563eb; color:#fff; font-weight:600;' : 'background:transparent; color:#475569;'}">
                                        • ${minor.title}
                                      </button>
                                    `
                                  }).join('')}
                                </div>
                              ` : ''}
                            </div>
                          `
                        } else {
                          // Major is directly a leaf document
                          const isSel = (cyberState.selectedDoc.key === major.title)
                          return `
                            <button class="doc-leaf-btn" data-key="${major.title}" style="text-align:left; padding:5px 8px; border-radius:4px; font-size:12px; border:none; cursor:pointer; line-height:1.3; ${isSel ? 'background:#2563eb; color:#fff; font-weight:600;' : 'background:transparent; color:#334155;'}">
                              • ${major.title}
                            </button>
                          `
                        }
                      }).join('')}
                    </div>
                  ` : ''}
                </div>
              `
            }).join('')}
          </div>
        ` : ''}
      </div>
    `
  }).join('')
}

function bindTreeEvents(el) {
  // Toggle tree node expand/collapse
  el.querySelectorAll('.tree-toggle-header').forEach(header => {
    header.addEventListener('click', (e) => {
      e.stopPropagation()
      const key = header.dataset.nodeKey
      cyberState.expandedNodes[key] = !cyberState.expandedNodes[key]
      renderPolicyAndFrameworkTab(el)
    })
  })

  // Select document leaf
  el.querySelectorAll('.doc-leaf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key
      const targetDoc = allFlatDocs.find(d => d.key === key)
      if (targetDoc) {
        cyberState.selectedDoc = targetDoc
        renderPolicyAndFrameworkTab(el)
      }
    })
  })
}

// =========================================================================
// 3. Incident Reporting Tab (Real Data / No Mockups)
// =========================================================================
function renderIncidentsTab(el) {
  const incidentsHtml = cyberState.incidents.map(inc => `
    <tr style="border-bottom:1px solid #e2e8f0; font-size:14px;">
      <td style="padding:12px 16px; font-weight:700; color:#2563eb; white-space:nowrap;">${inc.id}</td>
      <td style="padding:12px 16px; color:#64748b; white-space:nowrap;">${inc.date}</td>
      <td style="padding:12px 16px; font-weight:600; color:#1e293b;">${inc.agency}</td>
      <td style="padding:12px 16px; color:#334155; font-weight:500;">${inc.incidentType}</td>
      <td style="padding:12px 16px;">
        <span class="badge" style="background:${getSeverityBadgeBg(inc.severity)}; color:${getSeverityBadgeColor(inc.severity)}; font-weight:700; padding:3px 8px; border-radius:4px; font-size:12px;">
          ${inc.severity}
        </span>
      </td>
      <td style="padding:12px 16px;">
        <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:600; padding:2px 8px; border-radius:4px; font-size:12px;">
          ${inc.status || 'กำลังดำเนินการ'}
        </span>
      </td>
      <td style="padding:12px 16px; font-size:13px; color:#475569; max-width:280px; line-height:1.4;">${inc.actionTaken || '-'}</td>
    </tr>
  `).join('')

  el.innerHTML = `
    <div style="padding:28px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:1.25rem; font-weight:800; color:#1e293b; margin:0 0 4px 0;">
            ทะเบียนรายงานเหตุภัยคุกคามไซเบอร์ (Incident Report)
          </h2>
          <p style="color:#64748b; font-size:0.9rem; margin:0;">
            การแจ้งเหตุและมาตรการตอบสนองภัยคุกคามสารสนเทศ ตาม พ.ร.บ.ไซเบอร์ พ.ศ. 2562 สสจ.สระแก้ว
          </p>
        </div>
        <button id="add-cyber-incident-btn" class="btn btn-primary" style="background:#dc2626; border-color:#dc2626; font-weight:700; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          + รายงานเหตุการณ์ภัยคุกคามใหม่
        </button>
      </div>

      <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0; font-size:13px; color:#475569;">
            <tr>
              <th style="padding:12px 16px;">รหัสเหตุการณ์</th>
              <th style="padding:12px 16px;">วันที่เกิดเหตุ</th>
              <th style="padding:12px 16px;">หน่วยงาน</th>
              <th style="padding:12px 16px;">ประเภทภัยคุกคาม</th>
              <th style="padding:12px 16px;">ความรุนแรง</th>
              <th style="padding:12px 16px;">สถานะ</th>
              <th style="padding:12px 16px;">การรับมือเบื้องต้น</th>
            </tr>
          </thead>
          <tbody>
            ${incidentsHtml || '<tr><td colspan="7" style="padding:36px; text-align:center; color:#94a3b8; font-size:14px;">ยังไม่มีรายงานเหตุภัยคุกคามไซเบอร์</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `

  document.getElementById('add-cyber-incident-btn')?.addEventListener('click', () => {
    openIncidentModal(el)
  })
}

function getSeverityBadgeBg(sev) {
  if (sev === 'Critical' || sev === 'วิกฤต') return '#fee2e2'
  if (sev === 'High' || sev === 'สูง') return '#ffedd5'
  if (sev === 'Medium' || sev === 'ปานกลาง') return '#fef9c3'
  return '#f1f5f9'
}

function getSeverityBadgeColor(sev) {
  if (sev === 'Critical' || sev === 'วิกฤต') return '#991b1b'
  if (sev === 'High' || sev === 'สูง') return '#c2410c'
  if (sev === 'Medium' || sev === 'ปานกลาง') return '#a16207'
  return '#475569'
}

function openIncidentModal(tabEl) {
  const modalContainer = document.getElementById('cyber-modal-container')
  if (!modalContainer) return

  modalContainer.innerHTML = `
    <div class="modal-overlay" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px;">
      <div class="modal" style="background:#fff; border-radius:12px; width:100%; max-width:640px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.3); overflow:hidden;">
        <div class="modal-header" style="background:#1e293b; color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:700;">+ รายงานเหตุภัยคุกคามไซเบอร์ใหม่</h3>
          <button id="close-inc-modal" style="background:none; border:none; font-size:24px; color:#fff; cursor:pointer;">&times;</button>
        </div>
        <form id="new-incident-form" style="padding:20px; display:flex; flex-direction:column; gap:14px; font-size:13.5px;">
          <div>
            <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">หน่วยงานที่เกิดเหตุ *</label>
            <input type="text" id="inc-agency" class="form-control" required placeholder="เช่น โรงพยาบาลสมเด็จพระยุพราชสระแก้ว หรือ สสจ.สระแก้ว">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div>
              <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">ประเภทภัยคุกคาม *</label>
              <select id="inc-type" class="form-control" required>
                <option value="Phishing Email (หลอกถามรหัสผ่าน/ข้อมูล)">Phishing Email (หลอกถามรหัสผ่าน/ข้อมูล)</option>
                <option value="Malware / Ransomware (มัลแวร์เรียกค่าไถ่)">Malware / Ransomware (มัลแวร์เรียกค่าไถ่)</option>
                <option value="Web Defacement (หน้าเว็บถูกเปลี่ยนแปลง)">Web Defacement (หน้าเว็บถูกเปลี่ยนแปลง)</option>
                <option value="Data Leak (ข้อมูลรั่วไหลสู่ภายนอก)">Data Leak (ข้อมูลรั่วไหลสู่ภายนอก)</option>
                <option value="DDoS Attack (การโจมตีระบบจนไม่สามารถให้บริการได้)">DDoS Attack (การโจมตีระบบให้ขัดข้อง)</option>
                <option value="Unauthorized Access (การเข้าถึงระบบโดยไม่ได้รับอนุญาต)">Unauthorized Access (การเข้าถึงโดยไม่ได้รับอนุญาต)</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div>
              <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">ระดับความรุนแรง *</label>
              <select id="inc-severity" class="form-control" required>
                <option value="ต่ำ">ต่ำ (Low)</option>
                <option value="ปานกลาง" selected>ปานกลาง (Medium)</option>
                <option value="สูง">สูง (High)</option>
                <option value="วิกฤต">วิกฤต (Critical)</option>
              </select>
            </div>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">รายละเอียดเหตุการณ์ *</label>
            <textarea id="inc-detail" class="form-control" rows="3" required placeholder="ระบุรายละเอียด เช่น ตรวจพบเมื่อใด เครื่องคอมพิวเตอร์กี่เครื่อง ระบบใดที่ได้รับผลกระทบ..."></textarea>
          </div>
          <div>
            <label style="display:block; font-weight:600; color:#1e293b; margin-bottom:4px;">การดำเนินการรับมือเบื้องต้น *</label>
            <textarea id="inc-action" class="form-control" rows="2" required placeholder="เช่น ตัดการเชื่อมต่อระบบเครือข่าย LAN, เปลี่ยนรหัสผ่านเจ้าหน้าที่, แจ้ง CSIRT..."></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px; border-top:1px solid #e2e8f0; padding-top:14px;">
            <button type="button" id="cancel-inc-btn" class="btn" style="background:#f1f5f9; color:#475569;">ยกเลิก</button>
            <button type="submit" class="btn btn-primary" style="background:#dc2626; border-color:#dc2626; font-weight:700;">
              💾 บันทึกรายงานเหตุการณ์
            </button>
          </div>
        </form>
      </div>
    </div>
  `

  const close = () => { modalContainer.innerHTML = '' }
  document.getElementById('close-inc-modal')?.addEventListener('click', close)
  document.getElementById('cancel-inc-btn')?.addEventListener('click', close)

  document.getElementById('new-incident-form')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const agency = document.getElementById('inc-agency')?.value.trim()
    const incType = document.getElementById('inc-type')?.value
    const severity = document.getElementById('inc-severity')?.value
    const detail = document.getElementById('inc-detail')?.value.trim()
    const action = document.getElementById('inc-action')?.value.trim()

    const newInc = {
      id: `INC-${new Date().getFullYear() + 543}-${String(cyberState.incidents.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      agency,
      incidentType: incType,
      severity,
      status: 'รับแจ้งเหตุแล้ว',
      actionTaken: action,
      detail
    }

    cyberState.incidents.unshift(newInc)
    saveIncidents()
    close()
    showNotification('บันทึกรายงานเหตุภัยคุกคามเรียบร้อยแล้ว', 'success')
    renderIncidentsTab(tabEl)
  })
}

// Export to Excel / CSV
function exportCiiToExcel() {
  let csv = '\uFEFF' // BOM for UTF-8 Excel support
  const roundHeaders = cyberState.rounds.map((r, i) => `"รอบที่ ${i + 1} (${r.date})"`).join(',')
  csv += `"Domain","Control ID","Control Name","Evidence ID","คำอธิบายเกณฑ์ (Objective / Evident)","กฎหมายอ้างอิง",${roundHeaders}\n`

  ciiData.forEach((d, dIdx) => {
    d.controls.forEach(c => {
      c.evidences.forEach(ev => {
        const roundScores = cyberState.rounds.map(r => {
          const key = `D${dIdx + 1}-${c.controlId}-${ev.evidenceId}`
          return r.scores[key] || '-'
        }).join(',')

        const cleanDesc = (ev.description || '').replace(/"/g, '""').replace(/\n/g, ' ')
        const cleanReq = (ev.requirement || '').replace(/"/g, '""')
        const cleanDomain = (d.domain || '').replace(/"/g, '""')
        const cleanCName = (c.controlName || '').replace(/"/g, '""').replace(/\n/g, ' ')

        csv += `"${cleanDomain}","Control ${c.controlId}","${cleanCName}","${c.controlId}.${ev.evidenceId}","${cleanDesc}","${cleanReq}",${roundScores}\n`
      })
    })
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `CII_Self_Assessment_SKO_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showNotification('ส่งออกไฟล์ Excel/CSV เรียบร้อยแล้ว', 'success')
}
