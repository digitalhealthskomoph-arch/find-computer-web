// =========================================================================
// 1.2 Logs of all access Controller
// ระบบจัดเก็บบันทึกประวัติการเข้าถึง (Access Logs) และการตรวจทาน Log รายสัปดาห์/เดือน (Log Review)
// อ้างอิง: พรบ.ไซเบอร์ 2562 (ม.43), ประกาศ สกมช. [ข้อ 22.1.2]
// =========================================================================

import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import {
  DEFAULT_ACCESS_LOGS_HEADER,
  DEFAULT_ACCESS_LOGS_UPDATE_LOGS,
  DEFAULT_ACCESS_LOG_ITEMS,
  DEFAULT_LOG_REVIEW_ROUNDS
} from './accessLogsData.js'
import { supabase } from '../../lib/supabase.js'
import { showNotification } from '../../lib/utils.js'

// Helper: Badge แสดงสถานะ Log
export function getLogStatusBadge(status) {
  const str = String(status || '').trim()
  if (str === 'Success' || str === 'สำเร็จ') {
    return { bg: '#dcfce7', color: '#166534', border: '#86efac', text: 'สำเร็จ (Success)' }
  } else {
    return { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', text: 'ล้มเหลว (Failed)' }
  }
}

// Helper: Badge แสดงระดับความรุนแรง
export function getLogSeverityBadge(sev) {
  const s = String(sev || 'Normal').trim()
  if (s === 'Critical' || s === 'วิกฤต') {
    return { bg: '#fee2e2', color: '#991b1b', border: '#f87171', label: 'วิกฤต (Critical)' }
  } else if (s === 'Warning' || s === 'เฝ้าระวัง') {
    return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d', label: 'เตือน (Warning)' }
  } else {
    return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', label: 'ปกติ (Normal)' }
  }
}

export function renderAccessLogsHtml(
  state,
  activeSubTab = 'logs',
  statusFilter = 'all',
  systemFilter = 'all',
  searchQuery = '',
  selectedReviewRoundId = 'review_w4'
) {
  const header = state?.header || DEFAULT_ACCESS_LOGS_HEADER
  const updateLogs = state?.update_logs || DEFAULT_ACCESS_LOGS_UPDATE_LOGS
  const logItems = state?.log_items || DEFAULT_ACCESS_LOG_ITEMS
  const reviewRounds = state?.review_rounds || DEFAULT_LOG_REVIEW_ROUNDS

  // กรองรายการ Logs
  const filteredLogs = logItems.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    if (systemFilter !== 'all' && !item.target_system.includes(systemFilter)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim()
      const matchUser = (item.user_name || '').toLowerCase().includes(q)
      const matchId = (item.user_id || '').toLowerCase().includes(q)
      const matchSys = (item.target_system || '').toLowerCase().includes(q)
      const matchIp = (item.source_ip || '').toLowerCase().includes(q)
      const matchAct = (item.action_type || '').toLowerCase().includes(q)
      const matchDet = (item.event_detail || '').toLowerCase().includes(q)
      if (!matchUser && !matchId && !matchSys && !matchIp && !matchAct && !matchDet) return false
    }
    return true
  })

  // รอบการตรวจทานปัจจุบัน
  let activeReview = reviewRounds.find(r => r.id === selectedReviewRoundId) || reviewRounds[0]

  // ตัวเลขสถิติ
  const totalLogs = logItems.length
  const successCount = logItems.filter(l => l.status === 'Success' || l.status === 'สำเร็จ').length
  const failedCount = logItems.filter(l => l.status === 'Failed' || l.status === 'ล้มเหลว').length
  const warningCount = logItems.filter(l => l.severity === 'Warning' || l.severity === 'Critical').length

  const subTabs = [
    { id: 'logs', label: '1. บันทึกประวัติการเข้าถึง (Access Audit Logs)', icon: '📋', count: `${totalLogs} รายการ` },
    { id: 'weekly-review', label: '2. แบบตรวจทาน Log รายสัปดาห์/เดือน (Log Review Report)', icon: '🛡️', count: `${reviewRounds.length} รอบตรวจ` },
    { id: 'update-log', label: '0. ประวัติการปรับปรุง (Update Log)', icon: '🕒', count: updateLogs.length }
  ]

  // รายการระบบสำหรับ Dropdown
  const systemOptions = [
    'all',
    'Active Directory',
    'Firewall',
    'Web Portal',
    'สารบรรณ',
    'Database'
  ]

  return `
    <div class="access-logs-suite" style="font-family:'Sarabun',sans-serif; color:#1e293b;">
      
      <!-- Top Action Bar -->
      <div class="no-print" style="padding:16px 20px; background:#fff; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:11px; font-weight:700; color:#2563eb; text-transform:uppercase; letter-spacing:0.5px;">
            PROTECT DOMAIN: ACCESS CONTROL (ข้อ 22.1.2)
          </div>
          <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:2px 0 0 0;">
            1.2 Logs of all access (สสจ.สระแก้ว)
          </h2>
          <div style="font-size:12px; color:#64748b; margin-top:3px;">
            ${header.agency} • นโยบายจัดเก็บ: <span style="font-weight:600; color:#0f172a;">ไม่น้อยกว่า 90 วัน</span> • เซิร์ฟเวอร์: <span style="font-weight:600; color:#0f172a;">Central Syslog NAS</span>
          </div>
        </div>

        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <button id="al-btn-print" class="btn" style="background:#0f172a; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            พิมพ์รายงาน A4
          </button>
          <button id="al-btn-export-word" class="btn" style="background:#2563eb; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            ส่งออก Word (.doc)
          </button>
          <button id="al-btn-export-csv" class="btn" style="background:#059669; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ส่งออก CSV
          </button>
          <button id="al-btn-save-sync" class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#0f172a; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            บันทึก & ซิงค์
          </button>
        </div>
      </div>

      <!-- KPI Summary Banner -->
      <div class="no-print" style="padding:14px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
        <div style="background:#fff; padding:12px 16px; border-radius:8px; border:1px solid #e2e8f0;">
          <div style="font-size:11px; color:#64748b; font-weight:600;">บันทึกการเข้าถึงทั้งหมด</div>
          <div style="font-size:1.4rem; font-weight:800; color:#0f172a; margin-top:2px;">${totalLogs} <span style="font-size:12px; font-weight:500; color:#64748b;">รายการ</span></div>
        </div>
        <div style="background:#f0fdf4; padding:12px 16px; border-radius:8px; border:1px solid #bbf7d0;">
          <div style="font-size:11px; color:#166534; font-weight:600;">เข้าถึงสำเร็จ (Success)</div>
          <div style="font-size:1.4rem; font-weight:800; color:#15803d; margin-top:2px;">${successCount} <span style="font-size:12px; font-weight:500; color:#166534;">รายการ</span></div>
        </div>
        <div style="background:#fef2f2; padding:12px 16px; border-radius:8px; border:1px solid #fecaca;">
          <div style="font-size:11px; color:#991b1b; font-weight:600;">การเข้าถึงล้มเหลว (Failed)</div>
          <div style="font-size:1.4rem; font-weight:800; color:#b91c1c; margin-top:2px;">${failedCount} <span style="font-size:12px; font-weight:500; color:#991b1b;">รายการ</span></div>
        </div>
        <div style="background:#fffbeb; padding:12px 16px; border-radius:8px; border:1px solid #fde68a;">
          <div style="font-size:11px; color:#92400e; font-weight:600;">เหตุการณ์ต้องเฝ้าระวัง (Alerts)</div>
          <div style="font-size:1.4rem; font-weight:800; color:#b45309; margin-top:2px;">${warningCount} <span style="font-size:12px; font-weight:500; color:#92400e;">รายการ</span></div>
        </div>
      </div>

      <!-- Subtabs Navigation -->
      <div class="no-print" style="padding:12px 20px; background:#fff; border-bottom:1px solid #e2e8f0; display:flex; gap:6px; flex-wrap:wrap;">
        ${subTabs.map(tab => `
          <button class="al-subtab-btn ${activeSubTab === tab.id ? 'active' : ''}" data-subtab="${tab.id}" style="border:none; padding:8px 16px; font-size:13px; font-weight:700; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; ${activeSubTab === tab.id ? 'background:#2563eb; color:#fff; box-shadow:0 1px 3px rgba(37,99,235,0.2);' : 'background:#f1f5f9; color:#475569;'}">
            <span>${tab.icon}</span>
            <span>${tab.label}</span>
            <span style="font-size:11px; padding:1px 6px; border-radius:10px; background:${activeSubTab === tab.id ? 'rgba(255,255,255,0.25)' : '#e2e8f0'}; color:${activeSubTab === tab.id ? '#fff' : '#64748b'};">
              ${tab.count}
            </span>
          </button>
        `).join('')}
      </div>

      <!-- Main Subtab Content -->
      <div style="padding:20px;">
        ${activeSubTab === 'logs' ? renderLogsTabHtml(filteredLogs, logItems, statusFilter, systemFilter, searchQuery, systemOptions) : ''}
        ${activeSubTab === 'weekly-review' ? renderWeeklyReviewTabHtml(activeReview, reviewRounds, selectedReviewRoundId) : ''}
        ${activeSubTab === 'update-log' ? renderUpdateLogTabHtml(updateLogs) : ''}
      </div>

      <!-- Printable Area -->
      <div id="al-print-area" class="print-only" style="display:none;">
        ${renderPrintTemplate(header, logItems, activeReview)}
      </div>

    </div>
  `
}

// 1. แท็บย่อย: ตารางบันทึกประวัติการเข้าถึง (Access Audit Logs)
function renderLogsTabHtml(filteredLogs, allLogs, statusFilter, systemFilter, searchQuery, systemOptions) {
  return `
    <div>
      
      <!-- Filter and Action Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <input type="text" id="al-search-input" value="${searchQuery}" 
            placeholder="🔍 ค้นหาวันเวลา, ผู้ใช้งาน, IP, หรือกิจกรรม..." 
            style="width:260px; padding:7px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; outline:none;">

          <div style="display:flex; align-items:center; gap:6px; font-size:13px;">
            <span style="font-weight:600; color:#475569;">ระบบเป้าหมาย:</span>
            <select id="al-system-filter" style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; background:#fff; cursor:pointer;">
              <option value="all" ${systemFilter === 'all' ? 'selected' : ''}>ทุกระบบ</option>
              <option value="Active Directory" ${systemFilter === 'Active Directory' ? 'selected' : ''}>Active Directory</option>
              <option value="Firewall" ${systemFilter === 'Firewall' ? 'selected' : ''}>Firewall & VPN</option>
              <option value="Web Portal" ${systemFilter === 'Web Portal' ? 'selected' : ''}>Web Portal & Platform</option>
              <option value="สารบรรณ" ${systemFilter === 'สารบรรณ' ? 'selected' : ''}>สารบรรณอิเล็กทรอนิกส์</option>
              <option value="Database" ${systemFilter === 'Database' ? 'selected' : ''}>HDC Database Server</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:6px; font-size:13px;">
            <span style="font-weight:600; color:#475569;">สถานะ:</span>
            <select id="al-status-filter" style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; background:#fff; cursor:pointer;">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>ทั้งหมด (${allLogs.length})</option>
              <option value="Success" ${statusFilter === 'Success' ? 'selected' : ''}>สำเร็จ (Success)</option>
              <option value="Failed" ${statusFilter === 'Failed' ? 'selected' : ''}>ล้มเหลว (Failed)</option>
            </select>
          </div>
        </div>

        <div>
          <button id="al-btn-add-log-item" class="btn" style="background:#2563eb; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + บันทึกประวัติการเข้าถึง
          </button>
        </div>
      </div>

      <!-- Logs Table -->
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:12.5px; text-align:left;">
            <thead>
              <tr style="background:#f1f5f9; color:#334155; font-weight:700; border-bottom:2px solid #cbd5e1;">
                <th style="padding:10px 12px; width:135px;">วันเวลา (Timestamp)</th>
                <th style="padding:10px 12px; min-width:160px;">ผู้ใช้งาน (User / AD)</th>
                <th style="padding:10px 12px; min-width:160px;">ระบบเป้าหมาย (Target)</th>
                <th style="padding:10px 10px; width:130px;">IP ที่เข้าถึง (Source IP)</th>
                <th style="padding:10px 10px; min-width:130px;">ประเภทกิจกรรม</th>
                <th style="padding:10px 10px; text-align:center; width:95px;">สถานะ</th>
                <th style="padding:10px 10px; text-align:center; width:95px;">ความรุนแรง</th>
                <th style="padding:10px 14px; min-width:220px;">รายละเอียดกิจกรรม (Event Detail)</th>
                <th style="padding:10px 8px; text-align:center; width:65px;">ลบ</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLogs.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align:center; padding:32px; color:#94a3b8; font-size:13px;">
                    ไม่พบรายการบันทึกการเข้าถึงที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ` : filteredLogs.map((log, idx) => {
                const statusBadge = getLogStatusBadge(log.status)
                const sevBadge = getLogSeverityBadge(log.severity)
                return `
                  <tr style="border-bottom:1px solid #e2e8f0; hover:background:#f8fafc;">
                    <td style="padding:10px 12px; font-family:monospace; font-size:11.5px; color:#1e40af; white-space:nowrap;">
                      ${log.timestamp}
                    </td>
                    <td style="padding:10px 12px;">
                      <div style="font-weight:700; color:#0f172a;">${log.user_name}</div>
                      <div style="font-size:11px; color:#64748b; font-family:monospace;">${log.user_id}</div>
                    </td>
                    <td style="padding:10px 12px;">
                      <div style="font-weight:600; color:#0369a1;">${log.target_system}</div>
                      <div style="font-size:11px; color:#64748b;">สิทธิ์: ${log.privilege_used || '-'}</div>
                    </td>
                    <td style="padding:10px 10px; font-family:monospace; font-size:11px; color:#475569;">
                      ${log.source_ip}
                    </td>
                    <td style="padding:10px 10px; font-weight:600; color:#334155;">
                      ${log.action_type}
                    </td>
                    <td style="padding:10px 10px; text-align:center;">
                      <span style="display:inline-block; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700; background:${statusBadge.bg}; color:${statusBadge.color}; border:1px solid ${statusBadge.border};">
                        ${log.status}
                      </span>
                    </td>
                    <td style="padding:10px 10px; text-align:center;">
                      <span style="display:inline-block; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700; background:${sevBadge.bg}; color:${sevBadge.color}; border:1px solid ${sevBadge.border};">
                        ${log.severity}
                      </span>
                    </td>
                    <td style="padding:10px 14px; font-size:11.5px; color:#334155; line-height:1.4;">
                      ${log.event_detail}
                    </td>
                    <td style="padding:10px 8px; text-align:center;">
                      <button class="al-btn-delete-log-item" data-id="${log.id}" style="border:none; background:#fee2e2; color:#b91c1c; padding:3px 7px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">
                        ลบ
                      </button>
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>

        <div style="padding:12px 18px; background:#f8fafc; border-top:1px solid #e2e8f0; font-size:12px; color:#64748b; display:flex; justify-content:space-between; align-items:center;">
          <span>แสดง ${filteredLogs.length} จากทั้งหมด ${allLogs.length} รายการบันทึก</span>
          <span>จัดเก็บบันทึกจากเซิร์ฟเวอร์หลักและอุปกรณ์เครือข่ายความมั่นคงปลอดภัย</span>
        </div>
      </div>

    </div>
  `
}

// 2. แท็บย่อย: แบบตรวจทาน Log รายสัปดาห์/เดือน (Weekly Log Review Checklist)
function renderWeeklyReviewTabHtml(activeReview, reviewRounds, selectedReviewRoundId) {
  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- Round selector bar -->
      <div style="padding:14px 18px; background:#fff; border:1px solid #e2e8f0; border-radius:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-weight:700; color:#0f172a; font-size:13.5px;">รอบการตรวจทาน Log:</span>
          <select id="al-review-round-select" style="padding:6px 12px; border:1px solid #93c5fd; border-radius:6px; font-size:13.5px; background:#eff6ff; font-weight:700; color:#1e40af; cursor:pointer;">
            ${reviewRounds.map(r => `
              <option value="${r.id}" ${r.id === selectedReviewRoundId ? 'selected' : ''}>${r.title}</option>
            `).join('')}
          </select>
        </div>

        <div style="display:flex; gap:8px; align-items:center;">
          <button id="al-btn-add-review-round" class="btn" style="background:#2563eb; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer;">
            + สร้างรอบตรวจทานสัปดาห์ใหม่
          </button>
        </div>
      </div>

      <!-- Checklist Report Container -->
      <div style="background:#fff; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
        
        <!-- Document Title -->
        <div style="padding:18px 24px; background:#f8fafc; border-bottom:1px solid #e2e8f0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
            <div>
              <span style="font-size:11px; font-weight:700; color:#16a34a; background:#f0fdf4; padding:3px 8px; border-radius:4px; border:1px solid #bbf7d0;">
                ตรวจทานตามเกณฑ์ สกมช. ข้อ 22.1.2 (อย่างน้อยรายสัปดาห์)
              </span>
              <h3 style="margin:8px 0 2px 0; font-size:1.25rem; font-weight:800; color:#0f172a;">
                ${activeReview.title}
              </h3>
              <div style="font-size:12.5px; color:#64748b; margin-top:2px;">
                วันที่ตรวจทาน: <strong style="color:#0f172a;">${activeReview.review_date}</strong> • ผู้ตรวจทาน: <strong style="color:#0f172a;">${activeReview.auditor_name}</strong> (${activeReview.auditor_position})
              </div>
            </div>

            <div style="text-align:right;">
              <div style="font-size:11px; color:#64748b; font-weight:600;">ผลการตรวจทานภาพรวม</div>
              <div style="font-size:1.1rem; font-weight:800; color:${activeReview.overall_result.includes('ปกติ') ? '#15803d' : '#b45309'}; margin-top:2px;">
                ${activeReview.overall_result}
              </div>
            </div>
          </div>
        </div>

        <!-- 5 Checklist Items Table -->
        <div style="padding:20px;">
          <h4 style="margin:0 0 12px 0; font-size:1rem; font-weight:700; color:#1e293b;">
            รายการตรวจสอบความผิดปกติของระบบ (Access Logging Checklist)
          </h4>

          <div style="border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
            <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
              <thead>
                <tr style="background:#f1f5f9; color:#334155; font-weight:700; border-bottom:2px solid #cbd5e1;">
                  <th style="padding:10px 12px; width:45px; text-align:center;">ข้อ</th>
                  <th style="padding:10px 14px; min-width:240px;">หัวข้อการตรวจสอบ (Audit Checklist)</th>
                  <th style="padding:10px 10px; width:130px; text-align:center;">ผลการตรวจ</th>
                  <th style="padding:10px 16px; min-width:280px;">ข้อค้นพบจากการตรวจทาน (Findings & Evidence)</th>
                </tr>
              </thead>
              <tbody>
                ${activeReview.items.map((chk, cIdx) => `
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:12px; text-align:center; font-weight:700; color:#64748b;">${cIdx + 1}</td>
                    <td style="padding:12px 14px;">
                      <div style="font-weight:700; color:#0f172a;">${chk.title}</div>
                      <div style="font-size:11.5px; color:#64748b; margin-top:2px;">${chk.detail}</div>
                    </td>
                    <td style="padding:12px 10px; text-align:center;">
                      <select class="al-chk-result-select" data-round-id="${activeReview.id}" data-chk-id="${chk.check_id}" style="padding:5px 8px; border-radius:4px; font-size:12px; font-weight:700; cursor:pointer; ${chk.result.includes('ผ่าน') ? 'background:#dcfce7; color:#166534; border:1px solid #86efac;' : 'background:#fef3c7; color:#92400e; border:1px solid #fde047;'}">
                        <option value="ผ่าน (Pass)" ${chk.result.includes('ผ่าน') ? 'selected' : ''}>ผ่าน (Pass)</option>
                        <option value="ข้อสังเกต (Observation)" ${chk.result.includes('ข้อสังเกต') ? 'selected' : ''}>ข้อสังเกต (Observation)</option>
                        <option value="ไม่ผ่าน (Fail)" ${chk.result.includes('ไม่ผ่าน') ? 'selected' : ''}>ไม่ผ่าน (Fail)</option>
                      </select>
                    </td>
                    <td style="padding:12px 16px;">
                      <input type="text" class="al-chk-finding-input" data-round-id="${activeReview.id}" data-chk-id="${chk.check_id}" value="${chk.finding}" 
                        style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:4px; font-size:12.5px; color:#1e293b;">
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Action Taken Section -->
          <div style="margin-top:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <label style="display:block; font-weight:700; font-size:13px; color:#1e293b; margin-bottom:6px;">
              มาตรการแก้ไขและการดำเนินการ (Corrective Action & Follow-up):
            </label>
            <textarea id="al-action-taken-input" data-round-id="${activeReview.id}" rows="3" 
              style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; font-family:'Sarabun',sans-serif; color:#1e293b; outline:none;">${activeReview.action_taken}</textarea>

            <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; font-size:12.5px;">
              <div>
                ผู้ตรวจทาน: <strong>${activeReview.auditor_name}</strong> วันที่: <strong>${activeReview.review_date}</strong>
              </div>
              <div>
                ผู้อนุมัติผลตรวจ: <strong>${activeReview.approver_name}</strong> วันที่: <strong>${activeReview.approved_date}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  `
}

// 3. แท็บย่อย: Update Log
function renderUpdateLogTabHtml(updateLogs) {
  return `
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="margin:0; font-size:1.1rem; font-weight:700; color:#0f172a;">
          ประวัติการปรับปรุงและการตรวจทานบันทึก (Update Log)
        </h3>
        <button id="al-btn-add-update-log" class="btn" style="background:#2563eb; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
          + เพิ่มบันทึกประวัติ
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${updateLogs.map(log => `
          <div style="padding:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span style="font-weight:700; font-size:13px; color:#1e40af;">📅 ${log.displayDate || log.date}</span>
              <span style="font-size:12px; color:#64748b;">• โดย: <strong>${log.author}</strong></span>
            </div>
            <p style="margin:0; font-size:13px; color:#334155; line-height:1.5;">${log.detail}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// ฟังก์ชันผูก Event ต่างๆ
export function bindAccessLogsEvents(el, onAction) {
  // สลับแท็บย่อย
  el.querySelectorAll('.al-subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      onAction({ type: 'change_subtab', subtab: btn.dataset.subtab })
    })
  })

  // ค้นหา
  const searchInput = el.querySelector('#al-search-input')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      onAction({ type: 'search_logs', query: e.target.value })
    })
  }

  // กรองระบบ
  const sysFilter = el.querySelector('#al-system-filter')
  if (sysFilter) {
    sysFilter.addEventListener('change', (e) => {
      onAction({ type: 'filter_system', system: e.target.value })
    })
  }

  // กรองสถานะ
  const statusFilter = el.querySelector('#al-status-filter')
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      onAction({ type: 'filter_status', status: e.target.value })
    })
  }

  // เปลี่ยนรอบสัปดาห์
  const roundSelect = el.querySelector('#al-review-round-select')
  if (roundSelect) {
    roundSelect.addEventListener('change', (e) => {
      onAction({ type: 'change_review_round', roundId: e.target.value })
    })
  }

  // แก้ไขผลตรวจ checklist
  el.querySelectorAll('.al-chk-result-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      onAction({
        type: 'update_checklist_result',
        roundId: sel.dataset.roundId,
        chkId: sel.dataset.chkId,
        result: e.target.value
      })
    })
  })

  // แก้ไขข้อค้นพบ checklist
  el.querySelectorAll('.al-chk-finding-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      onAction({
        type: 'update_checklist_finding',
        roundId: inp.dataset.roundId,
        chkId: inp.dataset.chkId,
        finding: e.target.value
      })
    })
  })

  // แก้ไขมาตรการแก้ไข
  const actionTextarea = el.querySelector('#al-action-taken-input')
  if (actionTextarea) {
    actionTextarea.addEventListener('change', (e) => {
      onAction({
        type: 'update_action_taken',
        roundId: actionTextarea.dataset.roundId,
        actionTaken: e.target.value
      })
    })
  }

  // ปุ่มพิมพ์
  el.querySelector('#al-btn-print')?.addEventListener('click', () => {
    window.print()
  })

  // ปุ่มส่งออก Word
  el.querySelector('#al-btn-export-word')?.addEventListener('click', () => {
    onAction({ type: 'export_word' })
  })

  // ปุ่มส่งออก CSV
  el.querySelector('#al-btn-export-csv')?.addEventListener('click', () => {
    onAction({ type: 'export_csv' })
  })

  // ปุ่มบันทึก & ซิงค์
  el.querySelector('#al-btn-save-sync')?.addEventListener('click', () => {
    onAction({ type: 'save_sync' })
  })

  // ปุ่มลบรายการ Log
  el.querySelectorAll('.al-btn-delete-log-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการบันทึกนี้?')) {
        onAction({ type: 'delete_log_item', id: btn.dataset.id })
      }
    })
  })

  // ปุ่มเพิ่ม Log
  el.querySelector('#al-btn-add-log-item')?.addEventListener('click', () => {
    onAction({ type: 'open_add_log_modal' })
  })

  // ปุ่มเพิ่มรอบตรวจทาน
  el.querySelector('#al-btn-add-review-round')?.addEventListener('click', () => {
    onAction({ type: 'open_add_review_round_modal' })
  })

  // ปุ่มเพิ่ม Update log
  el.querySelector('#al-btn-add-update-log')?.addEventListener('click', () => {
    onAction({ type: 'open_add_update_log_modal' })
  })
}

// แม่แบบพิมพ์รายงาน A4
function renderPrintTemplate(header, logItems, activeReview) {
  return `
    <div style="font-family:'TH Sarabun New',Sarabun,sans-serif; color:#000; padding:10mm; background:#fff;">
      <div style="text-align:center; margin-bottom:12px;">
        <h2 style="font-size:18pt; font-weight:bold; margin:0;">
          รายงานการจัดเก็บบันทึกและตรวจทานการเข้าถึงบริการสำคัญ (Logs of All Access & Review Report)
        </h2>
        <div style="font-size:14pt; margin-top:2px;">
          ${header.agency} • รอบการตรวจทาน: ${activeReview.title}
        </div>
      </div>

      <h3 style="font-size:14pt; font-weight:bold; margin:10px 0 4px 0;">1. ผลการตรวจทานบันทึกการเข้าถึงประจำสัปดาห์ (Log Review Checklist)</h3>
      <table style="width:100%; border-collapse:collapse; font-size:10.5pt; margin-bottom:16px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #000; padding:4px; width:35px; text-align:center;">ข้อ</th>
            <th style="border:1px solid #000; padding:4px; width:260px;">หัวข้อตรวจสอบ</th>
            <th style="border:1px solid #000; padding:4px; width:110px; text-align:center;">ผลการตรวจ</th>
            <th style="border:1px solid #000; padding:4px;">ข้อค้นพบและหลักฐาน</th>
          </tr>
        </thead>
        <tbody>
          ${activeReview.items.map((it, idx) => `
            <tr>
              <td style="border:1px solid #000; padding:4px; text-align:center;">${idx + 1}</td>
              <td style="border:1px solid #000; padding:4px; font-weight:bold;">${it.title}</td>
              <td style="border:1px solid #000; padding:4px; text-align:center; font-weight:bold;">${it.result}</td>
              <td style="border:1px solid #000; padding:4px;">${it.finding}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="border:1px solid #000; padding:8px; font-size:11pt; margin-bottom:16px;">
        <strong>มาตรการแก้ไขและการดำเนินการ:</strong> ${activeReview.action_taken}
      </div>

      <h3 style="font-size:14pt; font-weight:bold; margin:10px 0 4px 0;">2. ตัวอย่างบันทึกประวัติการเข้าถึงระบบสำคัญ (Sample Access Audit Logs)</h3>
      <table style="width:100%; border-collapse:collapse; font-size:9.5pt;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #000; padding:4px; width:120px;">วันเวลา</th>
            <th style="border:1px solid #000; padding:4px;">ผู้ใช้งาน (User ID)</th>
            <th style="border:1px solid #000; padding:4px;">ระบบเป้าหมาย</th>
            <th style="border:1px solid #000; padding:4px;">IP</th>
            <th style="border:1px solid #000; padding:4px;">กิจกรรม</th>
            <th style="border:1px solid #000; padding:4px; text-align:center;">สถานะ</th>
            <th style="border:1px solid #000; padding:4px;">รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          ${logItems.slice(0, 10).map(l => `
            <tr>
              <td style="border:1px solid #000; padding:4px;">${l.timestamp}</td>
              <td style="border:1px solid #000; padding:4px;">${l.user_name} (${l.user_id})</td>
              <td style="border:1px solid #000; padding:4px;">${l.target_system}</td>
              <td style="border:1px solid #000; padding:4px;">${l.source_ip}</td>
              <td style="border:1px solid #000; padding:4px;">${l.action_type}</td>
              <td style="border:1px solid #000; padding:4px; text-align:center; font-weight:bold;">${l.status}</td>
              <td style="border:1px solid #000; padding:4px;">${l.event_detail}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top:24px; display:flex; justify-content:space-around; text-align:center; font-size:12pt;">
        <div>
          <div>ลงชื่อ......................................................ผู้ตรวจทานบันทึก</div>
          <div style="margin-top:4px;">(${activeReview.auditor_name})</div>
          <div>ตำแหน่ง ${activeReview.auditor_position}</div>
        </div>
        <div>
          <div>ลงชื่อ......................................................ผู้อนุมัติผลการตรวจ</div>
          <div style="margin-top:4px;">(${activeReview.approver_name})</div>
          <div>ตำแหน่ง ผู้บริหารเทคโนโลยีสารสนเทศ (ISM)</div>
        </div>
      </div>
    </div>
  `
}

// ส่งออกไฟล์ Word (.doc)
export function exportAccessLogsWord(state) {
  const header = state?.header || DEFAULT_ACCESS_LOGS_HEADER
  const logItems = state?.log_items || DEFAULT_ACCESS_LOG_ITEMS
  const reviewRounds = state?.review_rounds || DEFAULT_LOG_REVIEW_ROUNDS
  const activeReview = reviewRounds[0]

  const printHtml = renderPrintTemplate(header, logItems, activeReview)
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Logs_of_All_Access_${header.review_cycle}</title>
        <style>
          @page { size: A4 landscape; margin: 15mm 15mm; }
          body { font-family: 'TH Sarabun New', sans-serif; font-size: 14pt; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          th, td { border: 1px solid #000; padding: 5px; }
        </style>
      </head>
      <body>
        ${printHtml}
      </body>
    </html>
  `

  const blob = new Blob(['\ufeff' + fullHtml], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Logs_of_All_Access_${header.agency}_2569.doc`
  a.click()
  URL.revokeObjectURL(url)
  showNotification('ส่งออกเอกสาร Word (.doc) สำเร็จ', 'success')
}

// ส่งออกไฟล์ CSV
export function exportAccessLogsCsv(state) {
  const logItems = state?.log_items || DEFAULT_ACCESS_LOG_ITEMS
  let csv = '\ufeffTimestamp,UserID,UserName,TargetSystem,SourceIP,ActionType,Privilege,Status,Severity,Detail\n'
  logItems.forEach(l => {
    csv += `"${l.timestamp}","${l.user_id}","${l.user_name}","${l.target_system}","${l.source_ip}","${l.action_type}","${l.privilege_used || ''}","${l.status}","${l.severity}","${l.event_detail}"\n`
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Access_Audit_Logs_2569.csv`
  a.click()
  URL.revokeObjectURL(url)
  showNotification('ส่งออกไฟล์ CSV สำเร็จ', 'success')
}

// ซิงค์ขึ้น Supabase
export async function syncAccessLogsToSupabase(state) {
  try {
    if (!supabase || !state) return
    await supabase.from('cyber_module_states').upsert({
      module_key: 'access_logs',
      data: state,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.warn('Supabase sync deferred for access_logs:', err.message)
  }
}

// ดึงข้อมูลจาก Supabase
export async function fetchAccessLogsFromSupabase() {
  try {
    if (!supabase) return null
    const { data, error } = await supabase
      .from('cyber_module_states')
      .select('data')
      .eq('module_key', 'access_logs')
      .maybeSingle()
    if (!error && data?.data) {
      return data.data
    }
  } catch (err) {
    console.warn('Supabase fetch deferred for access_logs:', err.message)
  }
  return null
}
