import ciiData from './data/ciiData.json'
import sidebarData from './data/sidebarData.json'
import { showNotification } from '../../lib/utils.js'

let cyberState = {
  activeTab: 'cii',
  currentDomainIndex: 0,
  ciiResponses: {}, // key: controlId_evidenceId => score (0..3)
  incidents: [
    {
      id: 'INC-2567-001',
      date: '2024-02-15',
      agency: 'โรงพยาบาลสมเด็จพระยุพราชสระแก้ว',
      incidentType: 'Phishing Email หลอกถามรหัสผ่านเจ้าหน้าที่',
      severity: 'Medium',
      status: 'Resolved',
      actionTaken: 'ระงับบัญชีชั่วคราว บังคับเปลี่ยนรหัสผ่าน 2FA และแจ้งเตือนบุคลากรทั่วจังหวัด'
    },
    {
      id: 'INC-2567-002',
      date: '2024-03-01',
      agency: 'รพ.สต.บ้านเขาสารภี',
      incidentType: 'พบคอมพิวเตอร์ติดมัลแวร์เรียกค่าไถ่ (Ransomware) ในเครือข่าย',
      severity: 'High',
      status: 'Resolved',
      actionTaken: 'ตัดการเชื่อมต่อเครือข่าย LAN ทันที กู้คืนข้อมูลจากระบบสำรองข้อมูลภายนอก (Offline Backup)'
    }
  ]
}

// Load saved CII responses from localStorage if exists
try {
  const saved = localStorage.getItem('sko_cii_responses')
  if (saved) cyberState.ciiResponses = JSON.parse(saved)
} catch (e) {}

export function renderCyberModule(container) {
  container.innerHTML = `
    <div class="module-wrapper">
      <!-- Cyber Module Header -->
      <div class="module-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span class="badge" style="background:#3b82f6; color:#fff; font-size:12px; font-weight:600; padding:4px 8px; border-radius:4px;">CII Compliance</span>
              <span style="color:#94a3b8; font-size:13px;">สำนักงานคณะกรรมการการรักษาความมั่นคงปลอดภัยไซเบอร์แห่งชาติ (สกมช.)</span>
            </div>
            <h1 style="font-size:1.5rem; font-weight:700; margin:0; line-height:1.3;">
              ระบบบริหารจัดการความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity)
            </h1>
            <p style="color:#cbd5e1; font-size:0.9rem; margin-top:4px; margin-bottom:0;">
              หน่วยงานโครงสร้างพื้นฐานสำคัญทางสารสนเทศ (CII) ด้านสาธารณสุข สำนักงานสาธารณสุขจังหวัดสระแก้ว
            </p>
          </div>
          <div id="cii-quick-stat" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); padding:12px 20px; border-radius:8px; text-align:center;">
            <div style="font-size:12px; color:#94a3b8;">คะแนนความสอดคล้อง CII</div>
            <div id="cii-score-badge" style="font-size:1.6rem; font-weight:800; color:#60a5fa;">0%</div>
          </div>
        </div>
      </div>

      <!-- Cyber Tabs Nav -->
      <div class="tab-nav" style="display:flex; border-bottom:2px solid #e2e8f0; margin-bottom:24px; gap:8px; overflow-x:auto;">
        <button class="cyber-tab-btn ${cyberState.activeTab === 'cii' ? 'active' : ''}" data-tab="cii" style="padding:10px 18px; border:none; background:none; font-weight:600; font-size:15px; cursor:pointer; display:flex; align-items:center; gap:8px; border-bottom:3px solid ${cyberState.activeTab === 'cii' ? '#2563eb' : 'transparent'}; color:${cyberState.activeTab === 'cii' ? '#2563eb' : '#64748b'};">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          แบบประเมิน CII Self Assessment
        </button>
        <button class="cyber-tab-btn ${cyberState.activeTab === 'docs' ? 'active' : ''}" data-tab="docs" style="padding:10px 18px; border:none; background:none; font-weight:600; font-size:15px; cursor:pointer; display:flex; align-items:center; gap:8px; border-bottom:3px solid ${cyberState.activeTab === 'docs' ? '#2563eb' : 'transparent'}; color:${cyberState.activeTab === 'docs' ? '#2563eb' : '#64748b'};">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ประมวลแนวทางปฏิบัติและเอกสารนโยบาย
        </button>
        <button class="cyber-tab-btn ${cyberState.activeTab === 'incidents' ? 'active' : ''}" data-tab="incidents" style="padding:10px 18px; border:none; background:none; font-weight:600; font-size:15px; cursor:pointer; display:flex; align-items:center; gap:8px; border-bottom:3px solid ${cyberState.activeTab === 'incidents' ? '#2563eb' : 'transparent'}; color:${cyberState.activeTab === 'incidents' ? '#2563eb' : '#64748b'};">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          รายงานแจ้งเหตุภัยคุกคามไซเบอร์
        </button>
      </div>

      <!-- Tab Contents -->
      <div id="cyber-tab-content"></div>
    </div>
  `

  bindCyberTabEvents(container)
  renderActiveCyberTab()
  updateOverallScoreBadge()
}

function bindCyberTabEvents(container) {
  container.querySelectorAll('.cyber-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cyberState.activeTab = btn.dataset.tab
      renderCyberModule(container)
    })
  })
}

function renderActiveCyberTab() {
  const contentEl = document.getElementById('cyber-tab-content')
  if (!contentEl) return

  if (cyberState.activeTab === 'cii') {
    renderCiiAssessment(contentEl)
  } else if (cyberState.activeTab === 'docs') {
    renderCyberDocs(contentEl)
  } else if (cyberState.activeTab === 'incidents') {
    renderIncidents(contentEl)
  }
}

// ==========================================
// 1. CII Assessment Tab
// ==========================================
function renderCiiAssessment(el) {
  const currentDomain = ciiData[cyberState.currentDomainIndex] || ciiData[0]
  
  // Domain selection buttons
  const domainTabsHtml = ciiData.map((d, idx) => {
    const isActive = idx === cyberState.currentDomainIndex
    const domainShort = d.domain.split(':')[0].trim()
    const domainTitle = d.domain.split(':')[1] ? d.domain.split(':')[1].trim() : d.domain
    return `
      <button class="domain-btn ${isActive ? 'active-domain' : ''}" data-idx="${idx}" style="
        text-align:left; padding:12px 16px; border-radius:8px; border:1px solid ${isActive ? '#2563eb' : '#e2e8f0'};
        background:${isActive ? '#eff6ff' : '#fff'}; cursor:pointer; width:100%; margin-bottom:8px; transition:all 0.15s;
      ">
        <div style="font-weight:700; font-size:13px; color:${isActive ? '#1d4ed8' : '#475569'};">${domainShort}</div>
        <div style="font-size:13px; color:${isActive ? '#1e40af' : '#64748b'}; line-height:1.3; margin-top:2px;">${domainTitle}</div>
      </button>
    `
  }).join('')

  // Render controls & evidences for selected domain
  let controlsHtml = ''
  currentDomain.controls.forEach(ctrl => {
    let evidencesHtml = ''
    ctrl.evidences.forEach(ev => {
      const key = `${currentDomain.domain}_${ctrl.controlId}_${ev.evidenceId}`
      const currentScore = cyberState.ciiResponses[key] !== undefined ? cyberState.ciiResponses[key] : null

      evidencesHtml += `
        <div class="evidence-row" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:8px;">
            <div style="flex:1;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span class="badge" style="background:#e0e7ff; color:#3730a3; font-size:11px; font-weight:700; padding:2px 6px; border-radius:4px;">
                  ข้อกำหนด ${ev.requirement || 'ม.43'}
                </span>
                <span style="font-size:12px; color:#64748b;">ลำดับที่ ${ev.evidenceId}</span>
              </div>
              <div style="font-size:14px; font-weight:600; color:#1e293b; line-height:1.4;">${ev.description}</div>
            </div>
          </div>
          
          <!-- Rating scale buttons -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:10px; padding-top:10px; border-top:1px dashed #cbd5e1;">
            <span style="font-size:12px; color:#64748b; margin-right:4px;">ระดับความพร้อม:</span>
            ${[
              { score: 0, label: 'ยังไม่ดำเนินการ (0)', color: '#94a3b8' },
              { score: 1, label: 'กำลังดำเนินการ (1)', color: '#f59e0b' },
              { score: 2, label: 'ปฏิบัติเป็นประจำ (2)', color: '#10b981' },
              { score: 3, label: 'พัฒนาต่อเนื่อง (3)', color: '#2563eb' }
            ].map(opt => {
              const isSelected = currentScore === opt.score
              return `
                <button class="score-btn" data-key="${key}" data-score="${opt.score}" style="
                  font-size:12px; font-weight:600; padding:4px 10px; border-radius:6px; cursor:pointer;
                  border: 1px solid ${isSelected ? opt.color : '#cbd5e1'};
                  background: ${isSelected ? opt.color : '#fff'};
                  color: ${isSelected ? '#fff' : '#475569'};
                  transition: all 0.15s;
                ">
                  ${opt.label}
                </button>
              `
            }).join('')}
          </div>
        </div>
      `
    })

    controlsHtml += `
      <div class="card" style="margin-bottom:20px; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden;">
        <div style="background:#f1f5f9; padding:12px 18px; border-bottom:1px solid #e2e8f0; font-weight:700; color:#1e293b; font-size:15px; display:flex; align-items:center; gap:8px;">
          <span style="background:#0284c7; color:#fff; border-radius:50%; width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; font-size:12px;">${ctrl.controlId}</span>
          <span>${ctrl.controlName.replace(/\n/g, ' ')}</span>
        </div>
        <div style="padding:16px;">
          ${evidencesHtml}
        </div>
      </div>
    `
  })

  el.innerHTML = `
    <div style="display:grid; grid-template-columns: 280px 1fr; gap:24px; align-items:start;">
      <!-- Left sidebar: Domains -->
      <div style="position:sticky; top:20px;">
        <h3 style="font-size:14px; font-weight:700; color:#475569; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">
          หมวดหมู่การประเมิน (Domains)
        </h3>
        ${domainTabsHtml}
        
        <div style="margin-top:20px; padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
          <div style="font-size:12px; font-weight:700; color:#334155; margin-bottom:8px;">การจัดการข้อมูล</div>
          <button id="save-cii-btn" class="btn btn-primary" style="width:100%; font-size:13px; margin-bottom:8px;">
            บันทึกผลการประเมิน
          </button>
          <button id="reset-cii-btn" class="btn" style="width:100%; font-size:13px; background:#fff; border:1px solid #cbd5e1; color:#ef4444;">
            ล้างผลการประเมิน
          </button>
        </div>
      </div>

      <!-- Right area: Controls for active domain -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #e2e8f0;">
          <div>
            <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0;">
              ${currentDomain.domain}
            </h2>
            <div style="font-size:13px; color:#64748b; margin-top:2px;">
              ทั้งหมด ${currentDomain.controls.length} มาตรการควบคุม
            </div>
          </div>
        </div>

        ${controlsHtml}
      </div>
    </div>
  `

  // Bind domain buttons
  el.querySelectorAll('.domain-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cyberState.currentDomainIndex = parseInt(btn.dataset.idx)
      renderCiiAssessment(el)
    })
  })

  // Bind rating buttons
  el.querySelectorAll('.score-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key
      const score = parseInt(btn.dataset.score)
      cyberState.ciiResponses[key] = score
      saveCiiToStorage()
      renderCiiAssessment(el)
      updateOverallScoreBadge()
    })
  })

  // Bind save button
  const saveBtn = document.getElementById('save-cii-btn')
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveCiiToStorage()
      showNotification('บันทึกผลการประเมิน CII เรียบร้อยแล้ว', 'success')
    })
  }

  // Bind reset button
  const resetBtn = document.getElementById('reset-cii-btn')
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('ยืนยันการล้างผลการประเมินทั้งหมดหรือไม่?')) {
        cyberState.ciiResponses = {}
        saveCiiToStorage()
        renderCiiAssessment(el)
        updateOverallScoreBadge()
        showNotification('ล้างผลการประเมินเรียบร้อยแล้ว', 'info')
      }
    })
  }
}

function saveCiiToStorage() {
  try {
    localStorage.setItem('sko_cii_responses', JSON.stringify(cyberState.ciiResponses))
  } catch (e) {}
}

function updateOverallScoreBadge() {
  const badge = document.getElementById('cii-score-badge')
  if (!badge) return

  let totalPossible = 0
  let totalScore = 0

  ciiData.forEach(d => {
    d.controls.forEach(c => {
      c.evidences.forEach(e => {
        totalPossible += 3
        const key = `${d.domain}_${c.controlId}_${e.evidenceId}`
        if (cyberState.ciiResponses[key] !== undefined) {
          totalScore += cyberState.ciiResponses[key]
        }
      })
    })
  })

  const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0
  badge.textContent = `${percentage}%`
  if (percentage >= 80) badge.style.color = '#10b981'
  else if (percentage >= 50) badge.style.color = '#f59e0b'
  else badge.style.color = '#60a5fa'
}

// ==========================================
// 2. Cyber Policies & Guidelines Docs Tab
// ==========================================
function renderCyberDocs(el) {
  let docCardsHtml = ''

  // Flatten sidebarData items
  sidebarData.forEach(group => {
    if (!group.children) return
    group.children.forEach(sub => {
      let itemsList = ''
      if (sub.children) {
        itemsList = sub.children.map(item => `
          <li style="margin-bottom:6px; font-size:13px; color:#334155; display:flex; align-items:center; gap:6px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#3b82f6; display:inline-block;"></span>
            <span>${item.title}</span>
          </li>
        `).join('')
      }

      docCardsHtml += `
        <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; padding:20px; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
            <div style="background:#eff6ff; color:#2563eb; padding:8px; border-radius:8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style="font-size:15px; font-weight:700; color:#1e293b; margin:0; line-height:1.4;">${sub.title}</h3>
          </div>
          <ul style="list-style:none; padding:0; margin:0 0 16px 0;">
            ${itemsList || '<li style="color:#94a3b8; font-size:13px;">เอกสารหลักประจำหมวด</li>'}
          </ul>
          <div style="border-top:1px solid #f1f5f9; padding-top:12px; display:flex; justify-content:flex-end;">
            <button class="btn" style="font-size:12px; padding:6px 12px; background:#f8fafc; border:1px solid #cbd5e1; color:#2563eb; font-weight:600; display:inline-flex; align-items:center; gap:4px;" onclick="alert('เอกสารนโยบายไซเบอร์ สสจ.สระแก้ว อยู่ระหว่างปรับปรุงตามกรอบ สกมช. ล่าสุด')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ดาวน์โหลดแนวทาง
            </button>
          </div>
        </div>
      `
    })
  })

  el.innerHTML = `
    <div>
      <div style="margin-bottom:20px;">
        <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:4px;">คลังประมวลแนวทางปฏิบัติและเอกสารนโยบายไซเบอร์</h2>
        <p style="color:#64748b; font-size:0.9rem; margin:0;">
          มาตรฐานและกรอบการดำเนินงานตามพระราชบัญญัติการรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562
        </p>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:20px;">
        ${docCardsHtml}
      </div>
    </div>
  `
}

// ==========================================
// 3. Incident Reporting Tab
// ==========================================
function renderIncidents(el) {
  const rowsHtml = cyberState.incidents.map((inc, i) => `
    <tr style="border-bottom:1px solid #e2e8f0; font-size:14px;">
      <td style="padding:12px; font-weight:700; color:#0284c7;">${inc.id}</td>
      <td style="padding:12px; color:#64748b;">${inc.date}</td>
      <td style="padding:12px; font-weight:600; color:#1e293b;">${inc.agency}</td>
      <td style="padding:12px; color:#334155;">${inc.incidentType}</td>
      <td style="padding:12px;">
        <span class="badge" style="background:${inc.severity === 'High' ? '#fee2e2' : '#fef3c7'}; color:${inc.severity === 'High' ? '#b91c1c' : '#b45309'}; font-weight:700; padding:2px 8px; border-radius:4px;">
          ${inc.severity}
        </span>
      </td>
      <td style="padding:12px; color:#16a34a; font-weight:600;">✓ ${inc.status}</td>
      <td style="padding:12px; font-size:12px; color:#475569; max-width:280px;">${inc.actionTaken}</td>
    </tr>
  `).join('')

  el.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:4px;">ทะเบียนรายงานการแจ้งเหตุภัยคุกคามทางไซเบอร์</h2>
          <p style="color:#64748b; font-size:0.9rem; margin:0;">
            บันทึกการรับแจ้งและมาตรการตอบสนองต่อเหตุการณ์ละเมิดความมั่นคงปลอดภัย (CSIRT สสจ.สระแก้ว)
          </p>
        </div>
        <button id="add-incident-btn" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          รายงานเหตุการณ์ใหม่
        </button>
      </div>

      <div class="card" style="border:1px solid #e2e8f0; border-radius:10px; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0; font-size:13px; color:#475569;">
            <tr>
              <th style="padding:12px;">รหัสเหตุการณ์</th>
              <th style="padding:12px;">วันที่เกิดเหตุ</th>
              <th style="padding:12px;">หน่วยงานที่พบเหตุ</th>
              <th style="padding:12px;">ลักษณะภัยคุกคาม</th>
              <th style="padding:12px;">ระดับความรุนแรง</th>
              <th style="padding:12px;">สถานะ</th>
              <th style="padding:12px;">การดำเนินการแก้ไข</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `

  const addBtn = document.getElementById('add-incident-btn')
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      promptAddIncident(el)
    })
  }
}

function promptAddIncident(el) {
  const agency = prompt('ระบุหน่วยงานที่พบเหตุ:')
  if (!agency) return
  const type = prompt('ระบุลักษณะภัยคุกคาม (เช่น Phishing, มัลแวร์, ระบบขัดข้อง):')
  if (!type) return

  const newInc = {
    id: `INC-2567-00${cyberState.incidents.length + 1}`,
    date: new Date().toISOString().split('T')[0],
    agency: agency,
    incidentType: type,
    severity: 'Medium',
    status: 'In Progress',
    actionTaken: 'รับแจ้งเหตุแล้ว ทีม CSIRT กำลังเข้าตรวจสอบและควบคุมสถานการณ์'
  }

  cyberState.incidents.unshift(newInc)
  showNotification('บันทึกรายงานแจ้งเหตุเรียบร้อยแล้ว', 'success')
  renderIncidents(el)
}
