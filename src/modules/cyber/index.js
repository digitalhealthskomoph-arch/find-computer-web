import ciiData from './data/ciiData.json'
import policyFrameworkData from './data/policyFrameworkData.json'
import { showNotification, toThaiDate } from '../../lib/utils.js'

const LOCAL_STORAGE_ROUNDS_KEY = 'sko_cii_assessment_rounds'
const LOCAL_STORAGE_INCIDENTS_KEY = 'sko_cyber_incidents'
const LOCAL_STORAGE_DOCS_KEY = 'sko_cyber_docs_links'
const LOCAL_STORAGE_LOGS_KEY = 'sko_cii_update_logs'
const LOCAL_STORAGE_AUDIT_PROGRAMME_KEY = 'sko_cyber_audit_programmes'

const DEFAULT_AUDIT_PROGRAMME_2569 = [
  {
    id: 1,
    agency: 'โรงพยาบาลสมเด็จพระยุพราชสระแก้ว',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: true, q2: false, q3: false, q4: false },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 2,
    agency: 'โรงพยาบาลอรัญประเทศ',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: false, q2: true, q3: false, q4: false },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 3,
    agency: 'โรงพยาบาลวัฒนานคร',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: false, q2: false, q3: true, q4: false },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 4,
    agency: 'โรงพยาบาลเขาฉกรรจ์',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: false, q2: false, q3: false, q4: true },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 5,
    agency: 'โรงพยาบาลวังน้ำเย็น',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: false, q2: false, q3: false, q4: true },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 6,
    agency: 'โรงพยาบาลวังสมบูรณ์',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: false, q2: false, q3: true, q4: false },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 7,
    agency: 'โรงพยาบาลคลองหาด',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: false, q2: true, q3: false, q4: false },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 8,
    agency: 'โรงพยาบาลโคกสูง',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: true, q2: false, q3: false, q4: false },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 9,
    agency: 'โรงพยาบาลตาพระยา',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: false, q2: true, q3: false, q4: false },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  },
  {
    id: 10,
    agency: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
    quarters: { q1: false, q2: false, q3: true, q4: false },
    auditDate: '',
    note: 'สัมภาษณ์ผู้บริหาร'
  }
]

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
  auditProgrammes: {},
  selectedAuditYear: '2569',
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
    cyberState.rounds = [
      {
        id: 'round_1',
        date: '2026-02-23',
        scores: {}
      }
    ]
  }

  // Ensure Round 2 exists with date 2026-02-26 and score 3 for all 3 domains
  let round2 = cyberState.rounds.find(r => r.id === 'round_2' || r.date === '2026-02-26')
  if (!round2) {
    round2 = {
      id: 'round_2',
      date: '2026-02-26',
      scores: {}
    }
    cyberState.rounds.push(round2)
  }
  round2.date = '2026-02-26'
  // Populate score 3 for all questions across all 3 domains
  ciiData.forEach((d, dIdx) => {
    const dNum = dIdx + 1
    d.controls.forEach(c => {
      c.evidences.forEach(ev => {
        round2.scores[`D${dNum}-${c.controlId}-${ev.evidenceId}`] = 3
      })
    })
  })
  saveRounds()

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

  // 5. Audit Programmes
  try {
    const savedAudit = localStorage.getItem(LOCAL_STORAGE_AUDIT_PROGRAMME_KEY)
    if (savedAudit) {
      cyberState.auditProgrammes = JSON.parse(savedAudit)
    } else {
      cyberState.auditProgrammes = { '2569': JSON.parse(JSON.stringify(DEFAULT_AUDIT_PROGRAMME_2569)) }
    }
  } catch (e) {
    cyberState.auditProgrammes = { '2569': JSON.parse(JSON.stringify(DEFAULT_AUDIT_PROGRAMME_2569)) }
  }
  if (!cyberState.auditProgrammes['2569'] || cyberState.auditProgrammes['2569'].length === 0) {
    cyberState.auditProgrammes['2569'] = JSON.parse(JSON.stringify(DEFAULT_AUDIT_PROGRAMME_2569))
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

function saveAuditProgrammes() {
  try {
    localStorage.setItem(LOCAL_STORAGE_AUDIT_PROGRAMME_KEY, JSON.stringify(cyberState.auditProgrammes))
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
  // Preserve scroll positions before rendering
  const prevScrollEl = document.getElementById('cii-table-scroll-container')
  const prevScrollTop = prevScrollEl ? prevScrollEl.scrollTop : 0
  const prevScrollLeft = prevScrollEl ? prevScrollEl.scrollLeft : 0
  const prevWindowY = window.scrollY

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
        <td colspan="2" style="padding:10px 14px; border-right:1px solid #cbd5e1;">
          <div style="font-size:14px; color:#0f172a;">${control.controlName}</div>
          <div style="font-size:11px; color:#64748b; font-weight:500; margin-top:2px;">คะแนนเฉลี่ย Control:</div>
        </td>
        ${cyberState.rounds.map((r, i) => `
          <td style="padding:10px 8px; border-right:1px solid #cbd5e1; text-align:center; vertical-align:middle;">
            <span id="ctrl-avg-${control.controlId}-${r.id}" class="ctrl-avg-badge" style="display:inline-block; padding:3px 10px; border-radius:6px; font-size:13px; font-weight:800; min-width:48px; ${getScoreBadgeStyle(controlAverages[i])}">
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
          <td style="padding:10px 12px; border-right:1px solid #e2e8f0; vertical-align:top; width:180px;">
            ${evidence.component ? `
              <span style="display:inline-block; padding:3px 8px; border-radius:6px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:12px; font-weight:600; line-height:1.4;">
                ${evidence.component}
              </span>
            ` : '<span style="color:#94a3b8; font-size:12px;">-</span>'}
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
      <div id="cii-table-scroll-container" style="flex:1; overflow:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left; min-width:950px;">
          <thead style="position:sticky; top:0; z-index:20; background:#f1f5f9; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
            
            <!-- Sticky Domain Average Row -->
            <tr style="background:#e2e8f0; border-bottom:1px solid #cbd5e1;">
              <th colspan="3" style="padding:10px 14px; text-align:right; font-weight:800; font-size:13px; color:#1e293b; border-right:1px solid #cbd5e1;">
                คะแนนเฉลี่ยรวมของ Domain นี้:
              </th>
              ${cyberState.rounds.map((r, i) => `
                <th style="padding:10px 8px; text-align:center; border-right:1px solid #cbd5e1; width:120px;">
                  <span id="domain-avg-${r.id}" class="domain-avg-badge" style="display:inline-block; padding:4px 12px; border-radius:6px; font-size:14px; font-weight:800; ${getScoreBadgeStyle(domainAverages[i])}">
                    ${domainAverages[i] !== '0.00' ? domainAverages[i] : '-'}
                  </span>
                </th>
              `).join('')}
            </tr>

            <!-- Standard Table Header Row -->
            <tr style="border-bottom:1px solid #cbd5e1; font-size:13px; color:#475569;">
              <th style="padding:10px 12px; border-right:1px solid #cbd5e1; width:90px; text-align:center; font-weight:700;">Control</th>
              <th style="padding:10px 12px; border-right:1px solid #cbd5e1; width:180px; font-weight:700;">องค์ประกอบ</th>
              <th style="padding:10px 14px; border-right:1px solid #cbd5e1; font-weight:700;">รายละเอียด (Objective / Evident)</th>
              ${cyberState.rounds.map((r, i) => `
                <th style="padding:8px 8px; border-right:1px solid #cbd5e1; text-align:center; width:120px; background:#eff6ff;">
                  <div style="font-weight:700; color:#1e40af; margin-bottom:4px; font-size:12px;">รอบที่ ${i + 1}</div>
                  <input type="date" class="round-date-picker" data-round-id="${r.id}" value="${r.date}" 
                    style="width:100%; font-size:11px; padding:3px; border:1px solid #bfdbfe; border-radius:4px; text-align:center; background:#fff; outline:none; box-sizing:border-box;">
                  <button type="button" class="quick-fill-3-btn btn" data-round-id="${r.id}" title="ตั้งค่า 3 คะแนนให้ทุกข้อใน Domain นี้" 
                    style="margin-top:5px; width:100%; padding:2px 4px; font-size:10.5px; font-weight:700; background:#dcfce7; color:#15803d; border:1px solid #86efac; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:2px;">
                    ⚡ ให้ 3 ทุกข้อ
                  </button>
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

  // Restore scroll positions seamlessly
  const newScrollEl = document.getElementById('cii-table-scroll-container')
  if (newScrollEl && prevScrollEl) {
    newScrollEl.scrollTop = prevScrollTop
    newScrollEl.scrollLeft = prevScrollLeft
  }
  if (prevWindowY > 0) {
    window.scrollTo({ top: prevWindowY })
  }

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

  // Bind quick fill 3 button
  el.querySelectorAll('.quick-fill-3-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rId = btn.dataset.roundId
      const targetRound = cyberState.rounds.find(r => r.id === rId)
      if (!targetRound) return

      const dNum = cyberState.selectedDomainIndex + 1
      currentDomain.controls.forEach(c => {
        c.evidences.forEach(ev => {
          targetRound.scores[`D${dNum}-${c.controlId}-${ev.evidenceId}`] = 3
        })
      })
      saveRounds()
      showNotification(`ตั้งค่า 3 คะแนนครบทุกข้อใน ${currentDomain.domain.split(':')[0]} รอบที่ ${cyberState.rounds.findIndex(r => r.id === rId) + 1} เรียบร้อยแล้ว`, 'success')
      renderAssessmentTableSubTab(el, container)
    })
  })

  // Bind score select dropdowns with in-place DOM updates (0 scroll jump!)
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

        // 1. Update select styling in place immediately
        select.style.cssText = `width:100%; max-width:80px; height:38px; border-radius:6px; text-align:center; font-size:15px; cursor:pointer; outline:none; ${getSelectScoreStyle(val)}`

        // 2. Recalculate Control Average in place
        const ctrl = currentDomain.controls.find(c => String(c.controlId) === String(cId))
        if (ctrl) {
          const ctrlScores = ctrl.evidences.map(ev => targetRound.scores[`D${dIdx + 1}-${cId}-${ev.evidenceId}`] || 0)
          const newCtrlAvg = getAverage(ctrlScores)
          const ctrlAvgEl = document.getElementById(`ctrl-avg-${cId}-${roundId}`)
          if (ctrlAvgEl) {
            ctrlAvgEl.textContent = newCtrlAvg !== '0.00' ? newCtrlAvg : '-'
            ctrlAvgEl.style.cssText = `display:inline-block; padding:3px 10px; border-radius:6px; font-size:13px; font-weight:800; min-width:48px; ${getScoreBadgeStyle(newCtrlAvg)}`
          }
        }

        // 3. Recalculate Domain Average in place
        const controlAveragesList = []
        currentDomain.controls.forEach(c => {
          const scores = []
          c.evidences.forEach(ev => {
            const v = targetRound.scores[`D${dIdx + 1}-${c.controlId}-${ev.evidenceId}`]
            if (v > 0) scores.push(v)
          })
          const cAvg = Number(getAverage(scores))
          if (cAvg > 0) controlAveragesList.push(cAvg)
        })
        const newDomAvg = getAverage(controlAveragesList)
        const domAvgEl = document.getElementById(`domain-avg-${roundId}`)
        if (domAvgEl) {
          domAvgEl.textContent = newDomAvg !== '0.00' ? newDomAvg : '-'
          domAvgEl.style.cssText = `display:inline-block; padding:4px 12px; border-radius:6px; font-size:14px; font-weight:800; ${getScoreBadgeStyle(newDomAvg)}`
        }
      }
    })
  })
}

// =========================================================================
// 2. Policy & Standards Library Tab (Full Hierarchy from Excel / 80 Topics)
// =========================================================================
function formatEmbedUrl(url) {
  if (!url) return ''
  const cleaned = url.trim()

  // Google Drive File (drive.google.com/file/d/{id}/...)
  const driveFileMatch = cleaned.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i)
  if (driveFileMatch) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`
  }

  // Google Drive Open / UC link (drive.google.com/open?id={id} or drive.google.com/uc?id={id})
  const driveIdMatch = cleaned.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([a-zA-Z0-9_-]+)/i)
  if (driveIdMatch) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`
  }

  // Google Docs Document
  const docsDocMatch = cleaned.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i)
  if (docsDocMatch) {
    return `https://docs.google.com/document/d/${docsDocMatch[1]}/preview`
  }

  // Google Docs Spreadsheets
  const docsSheetMatch = cleaned.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/i)
  if (docsSheetMatch) {
    return `https://docs.google.com/spreadsheets/d/${docsSheetMatch[1]}/preview`
  }

  // Google Docs Presentation (Slides)
  const docsSlideMatch = cleaned.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/i)
  if (docsSlideMatch) {
    return `https://docs.google.com/presentation/d/${docsSlideMatch[1]}/preview`
  }

  // Dropbox
  if (cleaned.includes('dropbox.com')) {
    return cleaned.replace(/[?&]dl=0/, '?raw=1')
  }

  // Direct PDF without hash
  if (cleaned.toLowerCase().endsWith('.pdf') && !cleaned.includes('#')) {
    return `${cleaned}#view=FitH`
  }

  return cleaned
}

function isGoogleUrl(url) {
  return /drive\.google\.com|docs\.google\.com/i.test(url || '')
}

function ensureAuditPrintStyles() {
  if (!document.getElementById('audit-programme-print-style')) {
    const style = document.createElement('style')
    style.id = 'audit-programme-print-style'
    style.innerHTML = `
      table.audit-programme-table thead th {
        background-color: #1e3a8a !important;
        color: #ffffff !important;
        border: 1px solid #3b82f6 !important;
        font-weight: 700 !important;
      }
      table.audit-programme-table thead tr:nth-child(2) th {
        background-color: #2563eb !important;
        color: #ffffff !important;
        border: 1px solid #3b82f6 !important;
        font-weight: 600 !important;
      }
      @media print {
        body {
          background: #fff !important;
          color: #000 !important;
        }
        body * {
          visibility: hidden !important;
        }
        #audit-print-area, #audit-print-area * {
          visibility: visible !important;
        }
        #audit-print-area {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 100vw !important;
          margin: 0 !important;
          padding: 8mm 10mm !important;
          background: #fff !important;
          box-shadow: none !important;
          border: none !important;
          display: block !important;
        }
        .no-print {
          display: none !important;
        }
        .audit-print-agency, .audit-print-note, .audit-print-date {
          display: inline-block !important;
        }
        .audit-agency-input, .audit-note-input, .audit-date-input {
          display: none !important;
        }
        table.audit-programme-table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 10pt !important;
        }
        table.audit-programme-table th, table.audit-programme-table td {
          border: 1px solid #1e293b !important;
          color: #000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        table.audit-programme-table thead tr th {
          background-color: #f1f5f9 !important;
          color: #000 !important;
        }
        @page {
          size: landscape;
          margin: 8mm;
        }
      }
    `
    document.head.appendChild(style)
  }
}

function renderAuditProgrammeHtml() {
  ensureAuditPrintStyles()
  const years = Object.keys(cyberState.auditProgrammes).sort((a, b) => Number(b) - Number(a))
  if (!years.includes(cyberState.selectedAuditYear)) {
    cyberState.selectedAuditYear = years[0] || '2569'
  }
  const currentYear = cyberState.selectedAuditYear
  const list = cyberState.auditProgrammes[currentYear] || []

  const scopesList = [
    { key: 'guideline', label: 'ประมวลแนวทางฯ' },
    { key: 'govern', label: 'Govern' },
    { key: 'identify', label: 'Identify' },
    { key: 'protect', label: 'Protect' },
    { key: 'detect', label: 'Detect' },
    { key: 'respond', label: 'Respond' },
    { key: 'recover', label: 'Recover' }
  ]

  const quartersList = [
    { key: 'q1', label: 'Q1' },
    { key: 'q2', label: 'Q2' },
    { key: 'q3', label: 'Q3' },
    { key: 'q4', label: 'Q4' }
  ]

  return `
    <div class="card" style="border:1px solid #cbd5e1; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.06); background:#fff; overflow:hidden; margin-bottom:24px;">
      
      <!-- Top Action Toolbar (Hidden during print) -->
      <div class="no-print" style="padding:16px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <label style="font-weight:700; font-size:13.5px; color:#1e293b; display:flex; align-items:center; gap:6px; margin:0;">
            <span>📅 ปีงบประมาณ:</span>
            <select id="audit-year-select" style="font-weight:700; color:#1e40af; border:1px solid #93c5fd; padding:5px 12px; border-radius:6px; background:#eff6ff; font-size:13.5px; cursor:pointer;">
              ${years.map(y => `<option value="${y}" ${y === currentYear ? 'selected' : ''}>พ.ศ. ${y}</option>`).join('')}
            </select>
          </label>
          <button id="add-audit-year-btn" class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#2563eb; padding:5px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
            + เพิ่มปีงบประมาณ
          </button>
          <span style="display:inline-flex; align-items:center; gap:4px; font-size:11.5px; color:#16a34a; background:#f0fdf4; padding:4px 9px; border-radius:4px; border:1px solid #bbf7d0;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            บันทึกอัตโนมัติ
          </span>
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <button id="add-audit-agency-btn" class="btn" style="background:#2563eb; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 1px 2px rgba(37,99,235,0.2);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + เพิ่มหน่วยรับตรวจ
          </button>
          <button id="print-audit-programme-btn" class="btn" style="background:#0f172a; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            พิมพ์แผน / Export PDF
          </button>
        </div>
      </div>

      <!-- Printable Table Container -->
      <div id="audit-print-area" style="padding:24px;">
        
        <!-- Document Title Header -->
        <div class="audit-table-title" style="text-align:center; margin-bottom:20px;">
          <h2 style="font-size:1.65rem; font-weight:800; color:#0f172a; margin:0 0 6px 0; letter-spacing:-0.3px;">
            แผนการตรวจสอบภายใน ประจำปี ${currentYear}
          </h2>
          <p style="color:#64748b; font-size:13px; margin:0;">
            สำนักงานสาธารณสุขจังหวัดสระแก้ว และหน่วยบริการในสังกัด (${list.length} หน่วยงาน)
          </p>
        </div>

        <!-- Table -->
        <div style="overflow-x:auto; border:1px solid #cbd5e1; border-radius:8px;">
          <table class="audit-programme-table" style="width:100%; border-collapse:collapse; font-size:12px; background:#fff;">
            <thead>
              <tr style="background:#1e3a8a !important; color:#ffffff !important; font-weight:700; text-align:center;">
                <th rowspan="2" style="background:#1e3a8a !important; color:#ffffff !important; width:42px; padding:10px 4px; border:1px solid #3b82f6; text-align:center; vertical-align:middle;">#</th>
                <th rowspan="2" style="background:#1e3a8a !important; color:#ffffff !important; min-width:220px; padding:10px 12px; border:1px solid #3b82f6; text-align:left; vertical-align:middle;">หน่วยรับตรวจ</th>
                <th colspan="7" style="background:#1e3a8a !important; color:#ffffff !important; padding:8px 4px; border:1px solid #3b82f6; text-align:center; font-size:12.5px; vertical-align:middle;">ประเภทการตรวจ</th>
                <th colspan="4" style="background:#1e3a8a !important; color:#ffffff !important; padding:8px 4px; border:1px solid #3b82f6; text-align:center; font-size:12.5px; vertical-align:middle;">ระยะเวลาการตรวจสอบ</th>
                <th rowspan="2" style="background:#1e3a8a !important; color:#ffffff !important; min-width:135px; padding:10px 8px; border:1px solid #3b82f6; text-align:center; vertical-align:middle;">วันที่ออกตรวจ</th>
                <th rowspan="2" style="background:#1e3a8a !important; color:#ffffff !important; min-width:150px; padding:10px 12px; border:1px solid #3b82f6; text-align:left; vertical-align:middle;">หมายเหตุ</th>
                <th rowspan="2" class="no-print" style="background:#1e3a8a !important; color:#ffffff !important; width:48px; padding:10px 4px; border:1px solid #3b82f6; text-align:center; vertical-align:middle;">ลบ</th>
              </tr>
              <tr style="background:#2563eb !important; color:#ffffff !important; font-weight:600; text-align:center; font-size:11px;">
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 2px; border:1px solid #3b82f6; min-width:65px; text-align:center;">ประมวลแนวทางฯ</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 2px; border:1px solid #3b82f6; min-width:50px; text-align:center;">Govern</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 2px; border:1px solid #3b82f6; min-width:50px; text-align:center;">Identify</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 2px; border:1px solid #3b82f6; min-width:50px; text-align:center;">Protect</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 2px; border:1px solid #3b82f6; min-width:50px; text-align:center;">Detect</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 2px; border:1px solid #3b82f6; min-width:50px; text-align:center;">Respond</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 2px; border:1px solid #3b82f6; min-width:50px; text-align:center;">Recover</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 4px; border:1px solid #3b82f6; min-width:38px; text-align:center;">Q1</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 4px; border:1px solid #3b82f6; min-width:38px; text-align:center;">Q2</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 4px; border:1px solid #3b82f6; min-width:38px; text-align:center;">Q3</th>
                <th style="background:#2563eb !important; color:#ffffff !important; padding:6px 4px; border:1px solid #3b82f6; min-width:38px; text-align:center;">Q4</th>
              </tr>
            </thead>
            <tbody>
              ${list.length === 0 ? `
                <tr>
                  <td colspan="16" style="text-align:center; padding:36px; color:#94a3b8; font-size:13px;">
                    ยังไม่มีข้อมูลหน่วยรับตรวจในปี ${currentYear} สามารถกดปุ่ม "+ เพิ่มหน่วยรับตรวจ" ด้านบน
                  </td>
                </tr>
              ` : list.map((row, idx) => `
                <tr style="border-bottom:1px solid #e2e8f0; background:${idx % 2 === 0 ? '#fff' : '#f8fafc'};">
                  <!-- # -->
                  <td style="padding:8px 4px; border:1px solid #e2e8f0; text-align:center; font-weight:700; color:#334155;">
                    ${idx + 1}
                  </td>

                  <!-- หน่วยรับตรวจ -->
                  <td style="padding:6px 10px; border:1px solid #e2e8f0;">
                    <input type="text" class="audit-agency-input" data-id="${row.id}" value="${row.agency || ''}" 
                      style="width:100%; font-weight:600; font-size:12.5px; color:#1e293b; border:1px solid transparent; background:transparent; padding:4px 6px; border-radius:4px; outline:none;"
                      onfocus="this.style.borderColor='#93c5fd'; this.style.background='#fff';" 
                      onblur="this.style.borderColor='transparent'; this.style.background='transparent';">
                    <span class="audit-print-agency" style="display:none; font-weight:600; font-size:12px; color:#1e293b;">${row.agency || '-'}</span>
                  </td>

                  <!-- 7 Scopes -->
                  ${scopesList.map(s => {
                    const isChecked = !!row.scopes?.[s.key]
                    return `
                      <td class="audit-toggle-cell" data-id="${row.id}" data-type="scope" data-field="${s.key}" 
                        style="padding:6px 2px; border:1px solid #e2e8f0; text-align:center; cursor:pointer; background:${isChecked ? '#eff6ff' : 'transparent'}; user-select:none;"
                        title="คลิกเพื่อสลับ: ${s.label}">
                        ${isChecked ? '<span style="font-weight:800; color:#1e40af; font-size:14px;">X</span>' : '<span style="color:#cbd5e1; font-size:11px;">-</span>'}
                      </td>
                    `
                  }).join('')}

                  <!-- 4 Quarters -->
                  ${quartersList.map(q => {
                    const isChecked = !!row.quarters?.[q.key]
                    return `
                      <td class="audit-toggle-cell" data-id="${row.id}" data-type="quarter" data-field="${q.key}" 
                        style="padding:6px 2px; border:1px solid #e2e8f0; text-align:center; cursor:pointer; background:${isChecked ? '#fef3c7' : 'transparent'}; user-select:none;"
                        title="คลิกเพื่อสลับ: ${q.label}">
                        ${isChecked ? '<span style="font-weight:800; color:#b45309; font-size:14px;">X</span>' : '<span style="color:#cbd5e1; font-size:11px;">-</span>'}
                      </td>
                    `
                  }).join('')}

                  <!-- วันที่ออกตรวจ -->
                  <td style="padding:6px 8px; border:1px solid #e2e8f0; text-align:center;">
                    <input type="date" class="audit-date-input" data-id="${row.id}" value="${row.auditDate || ''}" 
                      style="width:100%; font-size:11.5px; border:1px solid #cbd5e1; border-radius:4px; padding:3px 6px; color:#1e293b; background:#fff;">
                    <span class="audit-print-date" style="display:none; font-size:11.5px;">${row.auditDate ? toThaiDate(row.auditDate) : '-'}</span>
                  </td>

                  <!-- หมายเหตุ -->
                  <td style="padding:6px 8px; border:1px solid #e2e8f0;">
                    <input type="text" class="audit-note-input" data-id="${row.id}" value="${row.note || ''}" placeholder="ระบุหมายเหตุ..." 
                      style="width:100%; font-size:12px; border:1px solid transparent; background:transparent; padding:4px 6px; border-radius:4px; color:#334155; outline:none;"
                      onfocus="this.style.borderColor='#93c5fd'; this.style.background='#fff';" 
                      onblur="this.style.borderColor='transparent'; this.style.background='transparent';">
                    <span class="audit-print-note" style="display:none; font-size:11.5px;">${row.note || '-'}</span>
                  </td>

                  <!-- Delete -->
                  <td class="no-print" style="padding:6px 2px; border:1px solid #e2e8f0; text-align:center;">
                    <button class="delete-audit-agency-btn" data-id="${row.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:13px; padding:3px; border-radius:4px; opacity:0.7;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7" title="ลบหน่วยงานนี้">
                      🗑️
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Legend & Instructions -->
        <div class="no-print" style="margin-top:16px; padding:12px 16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; font-size:12px; color:#64748b; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <strong>คำอธิบายสัญลักษณ์:</strong>
            <span style="margin-left:8px;"><strong style="color:#1e40af;">X</strong> ในประเภทการตรวจ = ขอบเขตการตรวจ</span>
            <span style="margin-left:12px;"><strong style="color:#b45309;">X</strong> ในระยะเวลา = ไตรมาสที่กำหนดเข้าตรวจ (Q1-Q4)</span>
            <span style="margin-left:12px;">💡 คลิกที่ช่องเพื่อเปิด/ปิดเครื่องหมาย หรือแก้ไขข้อความได้ทันที</span>
          </div>
          <div style="font-size:11.5px; color:#94a3b8;">
            * สามารถเลือก "วันที่ออกตรวจ" เพื่อระบุวันลงพื้นที่จริงของแต่ละหน่วยงาน
          </div>
        </div>

      </div>
    </div>
  `
}

function bindAuditProgrammeEvents(el) {
  const currentYear = cyberState.selectedAuditYear

  // 1. Year Change
  document.getElementById('audit-year-select')?.addEventListener('change', (e) => {
    cyberState.selectedAuditYear = e.target.value
    renderPolicyAndFrameworkTab(el)
  })

  // 2. Add New Fiscal Year
  document.getElementById('add-audit-year-btn')?.addEventListener('click', () => {
    const nextYear = String(Number(currentYear) + 1)
    const yearInput = prompt('ระบุปีงบประมาณ พ.ศ. ที่ต้องการสร้าง (เช่น ' + nextYear + '):', nextYear)
    if (!yearInput) return
    const trimmedYear = yearInput.trim()
    if (!/^\d{4}$/.test(trimmedYear)) {
      alert('กรุณาระบุปี พ.ศ. เป็นตัวเลข 4 หลัก (เช่น 2570)')
      return
    }

    if (cyberState.auditProgrammes[trimmedYear]) {
      cyberState.selectedAuditYear = trimmedYear
      renderPolicyAndFrameworkTab(el)
      showNotification(`สลับไปยังแผนการตรวจสอบภายใน ประจำปี ${trimmedYear} เรียบร้อยแล้ว`, 'info')
      return
    }

    // Clone 10 agencies from default template
    cyberState.auditProgrammes[trimmedYear] = DEFAULT_AUDIT_PROGRAMME_2569.map((item, idx) => ({
      ...item,
      id: Date.now() + idx,
      auditDate: '',
      quarters: { q1: false, q2: false, q3: false, q4: false }
    }))
    cyberState.selectedAuditYear = trimmedYear
    saveAuditProgrammes()
    renderPolicyAndFrameworkTab(el)
    showNotification(`สร้างแผนการตรวจสอบภายใน ประจำปี ${trimmedYear} เรียบร้อยแล้ว`, 'success')
  })

  // 3. Add Agency
  document.getElementById('add-audit-agency-btn')?.addEventListener('click', () => {
    const currentList = cyberState.auditProgrammes[cyberState.selectedAuditYear] || []
    const newAgency = {
      id: Date.now(),
      agency: `หน่วยรับตรวจที่ ${currentList.length + 1}`,
      scopes: { guideline: true, govern: true, identify: true, protect: true, detect: true, respond: true, recover: true },
      quarters: { q1: false, q2: false, q3: false, q4: false },
      auditDate: '',
      note: 'สัมภาษณ์ผู้บริหาร'
    }
    currentList.push(newAgency)
    cyberState.auditProgrammes[cyberState.selectedAuditYear] = currentList
    saveAuditProgrammes()
    renderPolicyAndFrameworkTab(el)
    showNotification('เพิ่มหน่วยรับตรวจใหม่เรียบร้อยแล้ว', 'success')
  })

  // 4. Print / Export PDF
  document.getElementById('print-audit-programme-btn')?.addEventListener('click', () => {
    window.print()
  })

  // 5. Toggle Cells (Scopes & Quarters)
  el.querySelectorAll('.audit-toggle-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const id = Number(cell.dataset.id)
      const type = cell.dataset.type
      const field = cell.dataset.field
      const currentList = cyberState.auditProgrammes[cyberState.selectedAuditYear] || []
      const row = currentList.find(r => r.id === id)
      if (row) {
        if (type === 'scope') {
          if (!row.scopes) row.scopes = {}
          row.scopes[field] = !row.scopes[field]
        } else if (type === 'quarter') {
          if (!row.quarters) row.quarters = {}
          row.quarters[field] = !row.quarters[field]
        }
        saveAuditProgrammes()
        renderPolicyAndFrameworkTab(el)
      }
    })
  })

  // 6. Text inputs change & blur (Agency, Date & Note)
  el.querySelectorAll('.audit-agency-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id)
      const currentList = cyberState.auditProgrammes[cyberState.selectedAuditYear] || []
      const row = currentList.find(r => r.id === id)
      if (row) {
        row.agency = e.target.value.trim()
        saveAuditProgrammes()
        const printSpan = e.target.parentElement?.querySelector('.audit-print-agency')
        if (printSpan) printSpan.textContent = row.agency || '-'
      }
    })
  })

  el.querySelectorAll('.audit-date-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id)
      const currentList = cyberState.auditProgrammes[cyberState.selectedAuditYear] || []
      const row = currentList.find(r => r.id === id)
      if (row) {
        row.auditDate = e.target.value
        saveAuditProgrammes()
        const printSpan = e.target.parentElement?.querySelector('.audit-print-date')
        if (printSpan) printSpan.textContent = row.auditDate ? toThaiDate(row.auditDate) : '-'
      }
    })
  })

  el.querySelectorAll('.audit-note-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id)
      const currentList = cyberState.auditProgrammes[cyberState.selectedAuditYear] || []
      const row = currentList.find(r => r.id === id)
      if (row) {
        row.note = e.target.value.trim()
        saveAuditProgrammes()
        const printSpan = e.target.parentElement?.querySelector('.audit-print-note')
        if (printSpan) printSpan.textContent = row.note || '-'
      }
    })
  })

  // 7. Delete Agency Row
  el.querySelectorAll('.delete-audit-agency-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const id = Number(btn.dataset.id)
      const currentList = cyberState.auditProgrammes[cyberState.selectedAuditYear] || []
      const target = currentList.find(r => r.id === id)
      if (confirm(`คุณต้องการลบ "${target?.agency || 'หน่วยงานนี้'}" ออกจากแผนใช่หรือไม่?`)) {
        cyberState.auditProgrammes[cyberState.selectedAuditYear] = currentList.filter(r => r.id !== id)
        saveAuditProgrammes()
        renderPolicyAndFrameworkTab(el)
        showNotification('ลบหน่วยรับตรวจเรียบร้อยแล้ว', 'success')
      }
    })
  })
}

function renderGenericDocLinksHtml(savedData) {
  return `
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
        <!-- Helper Note for Google Drive & PDF links -->
        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:12px 16px; margin-bottom:18px; font-size:12.5px; color:#0369a1; display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:18px; line-height:1;">💡</span>
          <div style="line-height:1.5;">
            <strong>ข้อแนะนำการแนบลิงก์จาก Google Drive:</strong>
            <div>• ระบบจะแปลงลิงก์ Google Drive เป็นโหมดพรีวิว (Preview) ให้อัตโนมัติเพื่อให้แสดงผลในหน้านี้ได้</div>
            <div>• ใน Google Drive โปรดตั้งค่าสิทธิ์แชร์เป็น <strong>"ทุกคนที่มีลิงก์มีสิทธิ์ดู (Anyone with the link can view)"</strong> เพื่อป้องกันปัญหาการบล็อกสิทธิ์ 403 Forbidden</div>
            <div>• หากแสดงผลไม่สมบูรณ์ สามารถกดปุ่ม <strong>"เปิดในแท็บใหม่"</strong> เพื่อเปิดอ่านเอกสารได้โดยตรง</div>
          </div>
        </div>

        <!-- Add PDF input -->
        <div style="display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap;">
          <input type="text" id="new-pdf-label" placeholder="ชื่อไฟล์ PDF (เช่น 1.1 Audit Plan Procedure ฉบับอนุมัติ)" class="form-control" style="flex:1; min-width:180px; font-size:13px;">
          <input type="text" id="new-pdf-url" placeholder="URL ของไฟล์ PDF หรือ ลิงก์แชร์จาก Google Drive" class="form-control" style="flex:2; min-width:260px; font-size:13px;">
          <button id="add-pdf-link-btn" class="btn" style="background:#ef4444; color:#fff; border:none; font-size:13px; font-weight:600; white-space:nowrap; padding:8px 16px; border-radius:6px; cursor:pointer;">
            + แนบ PDF
          </button>
        </div>

        ${savedData.pdfLinks.length === 0 ? `
          <div style="text-align:center; padding:32px; color:#94a3b8; font-size:13px; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
            ยังไม่มีเอกสาร PDF แนบในหัวข้อนี้ สามารถกรอก URL ของไฟล์ PDF หรือ Google Drive ด้านบนเพื่อแสดงผล
          </div>
        ` : savedData.pdfLinks.map(pdf => {
          const embedUrl = formatEmbedUrl(pdf.url)
          const isGoogle = isGoogleUrl(pdf.url)
          return `
            <div style="border:1px solid #e2e8f0; border-radius:8px; margin-bottom:20px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05); background:#fff;">
              <div style="padding:10px 16px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:28px; height:28px; background:#fee2e2; color:#ef4444; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <span style="font-weight:700; color:#1e293b; font-size:13.5px;">${pdf.label}</span>
                    ${isGoogle ? `<span style="margin-left:6px; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:600;">Google Drive</span>` : ''}
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <a href="${pdf.url}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#2563eb; text-decoration:none; background:#fff; border:1px solid #cbd5e1; padding:5px 12px; border-radius:6px; transition:all 0.15s ease;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    เปิดในแท็บใหม่
                  </a>
                  <button class="delete-pdf-btn" data-id="${pdf.id}" style="background:#fff; border:1px solid #fecaca; color:#ef4444; padding:5px 10px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
                    ลบ
                  </button>
                </div>
              </div>
              <div style="height:620px; width:100%; background:#f8fafc; position:relative;">
                <iframe src="${embedUrl}" style="width:100%; height:100%; border:none;" allow="autoplay" loading="lazy" title="${pdf.label}"></iframe>
              </div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `
}

function bindGenericDocEvents(el, currentKey) {
  // Add Google Doc link
  document.getElementById('add-doc-link-btn')?.addEventListener('click', () => {
    const labelInput = document.getElementById('new-doc-label')
    const urlInput = document.getElementById('new-doc-url')
    const label = labelInput?.value.trim()
    let url = urlInput?.value.trim()
    if (!label || !url) {
      alert('กรุณากรอกทั้งชื่อเอกสารและ URL ลิงก์')
      return
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

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
    const labelInput = document.getElementById('new-pdf-label')
    const urlInput = document.getElementById('new-pdf-url')
    const label = labelInput?.value.trim()
    let url = urlInput?.value.trim()
    if (!label || !url) {
      alert('กรุณากรอกทั้งชื่อไฟล์ PDF และ URL ลิงก์')
      return
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

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

function renderPolicyAndFrameworkTab(el) {
  const q = cyberState.docSearchKeyword.toLowerCase().trim()
  const filteredDocs = q ? allFlatDocs.filter(d => 
    d.title.toLowerCase().includes(q) ||
    d.category.toLowerCase().includes(q) ||
    d.domain.toLowerCase().includes(q) ||
    d.major.toLowerCase().includes(q)
  ) : null

  const currentKey = cyberState.selectedDoc.key || '1.1 Audit Plan Procedure'
  const isAuditProgramme = (currentKey === '1.3 Audit Programme' || cyberState.selectedDoc.title === '1.3 Audit Programme')

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
            ${isAuditProgramme 
              ? 'ระบบจัดทำแผนการตรวจสอบภายใน ประจำปี (Audit Programme) เพิ่ม แก้ไข และกำหนดระยะเวลาการตรวจ' 
              : 'จัดการลิงก์เอกสารต้นฉบับ (Word / Google Docs) และแนบไฟล์ PDF แสดงผลบนระบบ'}
          </p>
        </div>

        ${isAuditProgramme ? renderAuditProgrammeHtml() : renderGenericDocLinksHtml(savedData)}

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

  // Bind specific section events
  if (isAuditProgramme) {
    bindAuditProgrammeEvents(el)
  } else {
    bindGenericDocEvents(el, currentKey)
  }
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
  csv += `"Domain","องค์ประกอบ","Control ID","Control Name","Evidence ID","คำอธิบายเกณฑ์ (Objective / Evident)","กฎหมายอ้างอิง",${roundHeaders}\n`

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
        const cleanComp = (ev.component || '').replace(/"/g, '""')

        csv += `"${cleanDomain}","${cleanComp}","Control ${c.controlId}","${cleanCName}","${c.controlId}.${ev.evidenceId}","${cleanDesc}","${cleanReq}",${roundScores}\n`
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
