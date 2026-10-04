// =========================================================================
// 1.3 User Permission Matrix / Review Controller
// ระบบตารางกำหนดสิทธิ์ (Permission Matrix) และการทบทวนสิทธิ์ (Access Review) สำหรับ สสจ.สระแก้ว
// =========================================================================

import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import {
  DEFAULT_USER_PERMISSION_HEADER,
  DEFAULT_USER_PERMISSION_LOGS,
  SSK_SYSTEMS,
  SSK_ROLES,
  DEFAULT_PERMISSION_MATRIX,
  DEFAULT_USER_REVIEW_ACCOUNTS
} from './userPermissionData.js'
import { supabase } from '../../lib/supabase.js'
import { showNotification } from '../../lib/utils.js'

// Helper: Badge แสดงสถานะการทบทวนสิทธิ์
export function getReviewStatusBadge(status) {
  const str = String(status || '').trim()
  if (str === 'คงสิทธิ์ถูกต้อง') {
    return { bg: '#dcfce7', color: '#166534', border: '#86efac', icon: '✓' }
  } else if (str === 'รอเพิกถอนสิทธิ์') {
    return { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', icon: '✕' }
  } else if (str === 'รอปรับลดสิทธิ์' || str === 'สิทธิ์เกินความจำเป็น') {
    return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d', icon: '⚠' }
  } else {
    return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', icon: '•' }
  }
}

// Helper: Badge แสดงสัญลักษณ์สิทธิ์ใน Matrix
export function getMatrixPermissionBadge(val) {
  const v = String(val || '-').trim()
  if (v === 'X') {
    return { label: 'X (Full Admin)', bg: '#dbeafe', color: '#1e40af', border: '#93c5fd', title: 'จัดการได้ทั้งหมด (Create/Read/Update/Delete/Admin)' }
  } else if (v === 'O') {
    return { label: 'O (Operator)', bg: '#e0f2fe', color: '#0369a1', border: '#7dd3fc', title: 'ปฏิบัติงาน/แก้ไขได้ตามหน้าที่ (Read/Write/Operate)' }
  } else if (v === 'V') {
    return { label: 'V (View Only)', bg: '#fef9c3', color: '#854d0e', border: '#fde047', title: 'ดูข้อมูลได้อย่างเดียว ห้ามแก้ไข (Read Only)' }
  } else {
    return { label: '- (No Access)', bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0', title: 'ไม่มีสิทธิ์เข้าถึง (No Access)' }
  }
}

export function renderUserPermissionHtml(
  state,
  activeSubTab = 'matrix',
  statusFilter = 'all',
  searchQuery = '',
  selectedRoleForMatrix = 'all'
) {
  const header = state?.header || DEFAULT_USER_PERMISSION_HEADER
  const logs = state?.logs || DEFAULT_USER_PERMISSION_LOGS
  const roles = state?.roles || SSK_ROLES
  const systems = state?.systems || SSK_SYSTEMS
  const matrix = state?.matrix || DEFAULT_PERMISSION_MATRIX
  const accounts = state?.accounts || DEFAULT_USER_REVIEW_ACCOUNTS

  // กรองบัญชีผู้ใช้งาน
  const filteredAccounts = accounts.filter(acc => {
    if (statusFilter !== 'all' && acc.review_status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim()
      const matchName = (acc.name || '').toLowerCase().includes(q)
      const matchId = (acc.user_id || '').toLowerCase().includes(q)
      const matchAd = (acc.user_ad || '').toLowerCase().includes(q)
      const matchDept = (acc.department || '').toLowerCase().includes(q)
      const matchSys = (acc.target_system || '').toLowerCase().includes(q)
      const matchRole = (acc.system_role || '').toLowerCase().includes(q)
      if (!matchName && !matchId && !matchAd && !matchDept && !matchSys && !matchRole) return false
    }
    return true
  })

  // สรุปตัวเลขสถิติ
  const totalAccounts = accounts.length
  const passCount = accounts.filter(a => a.review_status === 'คงสิทธิ์ถูกต้อง').length
  const revokeCount = accounts.filter(a => a.review_status === 'รอเพิกถอนสิทธิ์').length
  const adjustCount = accounts.filter(a => a.review_status === 'รอปรับลดสิทธิ์' || a.review_status === 'สิทธิ์เกินความจำเป็น').length

  const subTabs = [
    { id: 'matrix', label: '1. เมทริกซ์กำหนดสิทธิ์ (Permission Matrix)', icon: '▦', count: `${roles.length} บทบาท` },
    { id: 'review', label: '2. ทะเบียนและการทบทวนสิทธิ์ (User Access Review)', icon: '👥', count: `${totalAccounts} บัญชี` },
    { id: 'log', label: '0. ประวัติการทบทวน (Update Log)', icon: '🕒', count: logs.length }
  ]

  return `
    <div class="user-permission-suite" style="font-family:'Sarabun',sans-serif; color:#1e293b;">
      
      <!-- Top Action Bar -->
      <div class="no-print" style="padding:16px 20px; background:#fff; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:11px; font-weight:700; color:#2563eb; text-transform:uppercase; letter-spacing:0.5px;">
            PROTECT DOMAIN: ACCESS CONTROL (ข้อ 22.1.1 & 22.1.3)
          </div>
          <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:2px 0 0 0;">
            1.3 User Permission Matrix / Review (สสจ.สระแก้ว)
          </h2>
          <div style="font-size:12px; color:#64748b; margin-top:3px;">
            ${header.agency} • รอบการทบทวน: <span style="font-weight:600; color:#0f172a;">${header.review_cycle}</span> • ทบทวนล่าสุด: <span style="font-weight:600; color:#0f172a;">${header.last_review_date}</span>
          </div>
        </div>

        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <button id="upm-btn-print" class="btn" style="background:#0f172a; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            พิมพ์รายงาน A4
          </button>
          <button id="upm-btn-export-word" class="btn" style="background:#2563eb; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            ส่งออก Word (.doc)
          </button>
          <button id="upm-btn-export-csv" class="btn" style="background:#059669; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ส่งออก CSV
          </button>
          <button id="upm-btn-save-sync" class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#0f172a; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            บันทึก & ซิงค์
          </button>
        </div>
      </div>

      <!-- Summary KPI Banner -->
      <div class="no-print" style="padding:14px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
        <div style="background:#fff; padding:12px 16px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
          <div style="font-size:11px; color:#64748b; font-weight:600;">บัญชีผู้มีสิทธิ์ระดับ Admin ทั้งหมด</div>
          <div style="font-size:1.4rem; font-weight:800; color:#0f172a; margin-top:2px;">${totalAccounts} <span style="font-size:12px; font-weight:500; color:#64748b;">บัญชี</span></div>
        </div>
        <div style="background:#f0fdf4; padding:12px 16px; border-radius:8px; border:1px solid #bbf7d0;">
          <div style="font-size:11px; color:#166534; font-weight:600;">คงสิทธิ์ถูกต้อง (สอดคล้อง)</div>
          <div style="font-size:1.4rem; font-weight:800; color:#15803d; margin-top:2px;">${passCount} <span style="font-size:12px; font-weight:500; color:#166534;">บัญชี</span></div>
        </div>
        <div style="background:#fef2f2; padding:12px 16px; border-radius:8px; border:1px solid #fecaca;">
          <div style="font-size:11px; color:#991b1b; font-weight:600;">รอเพิกถอนสิทธิ์ (ย้าย/ลาออก)</div>
          <div style="font-size:1.4rem; font-weight:800; color:#b91c1c; margin-top:2px;">${revokeCount} <span style="font-size:12px; font-weight:500; color:#991b1b;">บัญชี</span></div>
        </div>
        <div style="background:#fffbeb; padding:12px 16px; border-radius:8px; border:1px solid #fde68a;">
          <div style="font-size:11px; color:#92400e; font-weight:600;">รอปรับลดสิทธิ์ (Least Privilege)</div>
          <div style="font-size:1.4rem; font-weight:800; color:#b45309; margin-top:2px;">${adjustCount} <span style="font-size:12px; font-weight:500; color:#92400e;">บัญชี</span></div>
        </div>
      </div>

      <!-- Subtabs Navigation -->
      <div class="no-print" style="padding:12px 20px; background:#fff; border-bottom:1px solid #e2e8f0; display:flex; gap:6px; flex-wrap:wrap;">
        ${subTabs.map(tab => `
          <button class="upm-subtab-btn ${activeSubTab === tab.id ? 'active' : ''}" data-subtab="${tab.id}" style="border:none; padding:8px 16px; font-size:13px; font-weight:700; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; ${activeSubTab === tab.id ? 'background:#2563eb; color:#fff; box-shadow:0 1px 3px rgba(37,99,235,0.2);' : 'background:#f1f5f9; color:#475569;'}">
            <span>${tab.icon}</span>
            <span>${tab.label}</span>
            <span style="font-size:11px; padding:1px 6px; border-radius:10px; background:${activeSubTab === tab.id ? 'rgba(255,255,255,0.25)' : '#e2e8f0'}; color:${activeSubTab === tab.id ? '#fff' : '#64748b'};">
              ${tab.count}
            </span>
          </button>
        `).join('')}
      </div>

      <!-- Main Content by Subtab -->
      <div style="padding:20px;">
        ${activeSubTab === 'matrix' ? renderMatrixTabHtml(roles, systems, matrix) : ''}
        ${activeSubTab === 'review' ? renderReviewTabHtml(filteredAccounts, accounts, statusFilter, searchQuery, roles) : ''}
        ${activeSubTab === 'log' ? renderLogTabHtml(logs) : ''}
      </div>

      <!-- Printable Area (Formatted strictly for A4 Landscape) -->
      <div id="upm-print-area" class="print-only" style="display:none;">
        ${renderPrintTemplate(header, roles, systems, matrix, accounts)}
      </div>

    </div>
  `
}

// Helper: จัดระเบียบข้อความหัวตารางฟังก์ชันให้อ่านง่าย ไม่ซ้อนทับกัน
export function formatMatrixFnLabel(label) {
  if (!label) return ''
  let str = String(label).trim()
  if (str.includes(' (')) {
    const parts = str.split(' (')
    return `${parts[0]}<br><span style="font-size:10px; font-weight:normal; opacity:0.9;">(${parts[1]}</span>`
  }
  if (str.includes(' & ')) {
    const parts = str.split(' & ')
    return `${parts[0]}<br><span style="font-size:10px; font-weight:normal; opacity:0.9;">& ${parts[1]}</span>`
  }
  if (str.includes(' และ')) {
    const parts = str.split(' และ')
    return `${parts[0]}<br><span style="font-size:10px; font-weight:normal; opacity:0.9;">และ${parts[1]}</span>`
  }
  if (str.includes('/')) {
    const parts = str.split('/')
    return `${parts[0]}<br><span style="font-size:10px; font-weight:normal; opacity:0.9;">/ ${parts[1]}</span>`
  }
  return str
}

// 1. แท็บย่อย: Permission Matrix (ตารางสิทธิ์ RBAC 2D)
function renderMatrixTabHtml(roles, systems, matrix) {
  // รวบรวมฟังก์ชันทั้งหมดของทุกระบบ
  const allFunctions = []
  systems.forEach(sys => {
    sys.functions.forEach(fn => {
      allFunctions.push({
        systemId: sys.id,
        systemName: sys.name,
        functionId: fn.id,
        functionLabel: fn.label
      })
    })
  })

  return `
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
      
      <!-- Top info bar -->
      <div style="padding:14px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="margin:0; font-size:1.05rem; font-weight:700; color:#0f172a;">
            ตารางกำหนดสิทธิ์การเข้าถึงระบบสารสนเทศ (Role-Based Access Control Matrix)
          </h3>
          <p style="margin:3px 0 0 0; font-size:12px; color:#64748b;">
            กำหนดสิทธิ์ตามหลักการ Need-to-Know และ Least Privilege (คลิกที่ช่องในตารางเพื่อสลับสิทธิ์ได้ทันที • เลื่อนแนวนอนเพื่อดูระบบอื่น ๆ)
          </p>
        </div>

        <div style="display:flex; gap:12px; align-items:center; font-size:12px; background:#fff; padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1;">
          <span style="font-weight:700; color:#334155;">สัญลักษณ์สิทธิ์:</span>
          <span style="display:inline-flex; align-items:center; gap:4px;"><strong style="color:#1e40af; background:#dbeafe; padding:1px 6px; border-radius:4px;">X</strong> จัดการได้ทั้งหมด (Full Admin)</span>
          <span style="display:inline-flex; align-items:center; gap:4px;"><strong style="color:#0369a1; background:#e0f2fe; padding:1px 6px; border-radius:4px;">O</strong> ปฏิบัติงาน/แก้ไข (Operator)</span>
          <span style="display:inline-flex; align-items:center; gap:4px;"><strong style="color:#854d0e; background:#fef9c3; padding:1px 6px; border-radius:4px;">V</strong> ดูได้อย่างเดียว (View Only)</span>
          <span style="display:inline-flex; align-items:center; gap:4px;"><strong style="color:#94a3b8; background:#f1f5f9; padding:1px 6px; border-radius:4px;">-</strong> ไม่มีสิทธิ์ (No Access)</span>
        </div>
      </div>

      <!-- Matrix Table Scrollable with Sticky Role Columns -->
      <div style="overflow-x:auto; width:100%; border-top:1px solid #cbd5e1;">
        <table style="min-width:2450px; width:100%; border-collapse:separate; border-spacing:0; font-size:12px; text-align:left; table-layout:fixed; background:#fff;">
          <thead>
            <!-- Header Row 1: System Names -->
            <tr style="background:#1e3a8a; color:#fff;">
              <th rowspan="2" style="position:sticky; left:0; top:0; z-index:25; background:#1e3a8a; padding:12px 10px; border-bottom:1px solid #3b82f6; border-right:1px solid #3b82f6; width:110px; min-width:110px; max-width:110px; vertical-align:middle; text-align:center; box-sizing:border-box;">
                รหัสบทบาท (Role)
              </th>
              <th rowspan="2" style="position:sticky; left:110px; top:0; z-index:25; background:#1e3a8a; padding:12px 14px; border-bottom:1px solid #3b82f6; border-right:2px solid #2563eb; width:250px; min-width:250px; max-width:250px; vertical-align:middle; box-shadow:3px 0 6px rgba(0,0,0,0.15); box-sizing:border-box;">
                ชื่อบทบาท / ตำแหน่งหน้าที่
              </th>
              ${systems.map((sys, sIdx) => `
                <th colspan="${sys.functions.length}" style="padding:10px 8px; border-bottom:1px solid #3b82f6; border-right:2px solid #1d4ed8; text-align:center; font-weight:700; font-size:12.5px; background:${sIdx % 2 === 0 ? '#1e40af' : '#1d4ed8'}; color:#fff; box-sizing:border-box;">
                  ${sys.name}
                </th>
              `).join('')}
            </tr>
            <!-- Header Row 2: Functions -->
            <tr style="background:#2563eb; color:#fff;">
              ${systems.map(sys => sys.functions.map(fn => `
                <th style="padding:8px 6px; border-bottom:2px solid #cbd5e1; border-right:1px solid #3b82f6; text-align:center; width:115px; min-width:115px; max-width:115px; vertical-align:middle; line-height:1.35; font-size:11px; word-break:break-word; overflow-wrap:break-word; white-space:normal; box-sizing:border-box; background:#2563eb;" title="${fn.label}">
                  ${formatMatrixFnLabel(fn.label)}
                </th>
              `).join('')).join('')}
            </tr>
          </thead>
          <tbody>
            ${roles.map((role, rIdx) => {
              const roleMatrix = matrix[role.id] || {}
              const isEven = rIdx % 2 === 0
              const rowBg = isEven ? '#ffffff' : '#f8fafc'
              return `
                <tr style="background:${rowBg};">
                  <td style="position:sticky; left:0; z-index:10; background:${rowBg}; padding:10px 10px; border-bottom:1px solid #e2e8f0; border-right:1px solid #e2e8f0; font-weight:700; color:#1e40af; text-align:center; width:110px; min-width:110px; max-width:110px; box-sizing:border-box;">
                    ${role.code}
                  </td>
                  <td style="position:sticky; left:110px; z-index:10; background:${rowBg}; padding:10px 14px; border-bottom:1px solid #e2e8f0; border-right:2px solid #cbd5e1; width:250px; min-width:250px; max-width:250px; box-shadow:3px 0 6px rgba(0,0,0,0.06); box-sizing:border-box;">
                    <div style="font-weight:700; color:#0f172a; line-height:1.3;">${role.title}</div>
                    <div style="font-size:11px; color:#64748b; margin-top:3px; line-height:1.3;">${role.description}</div>
                  </td>
                  ${allFunctions.map(fn => {
                    const val = roleMatrix[fn.functionId] || '-'
                    const badge = getMatrixPermissionBadge(val)
                    return `
                      <td style="padding:8px 4px; border-bottom:1px solid #e2e8f0; border-right:1px solid #e2e8f0; text-align:center; vertical-align:middle; width:115px; min-width:115px; max-width:115px; box-sizing:border-box;">
                        <button class="upm-matrix-toggle-btn" 
                          data-role-id="${role.id}" 
                          data-fn-id="${fn.functionId}" 
                          data-val="${val}"
                          title="คลิกเพื่อสลับสิทธิ์: ${badge.title}"
                          style="border:1px solid ${badge.border}; background:${badge.bg}; color:${badge.color}; font-weight:800; font-size:12px; padding:4px 8px; border-radius:5px; cursor:pointer; width:36px; height:30px; line-height:1; display:inline-flex; align-items:center; justify-content:center; transition:all 0.15s ease;">
                          ${val}
                        </button>
                      </td>
                    `
                  }).join('')}
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>

      <div style="padding:12px 18px; background:#f8fafc; border-top:1px solid #e2e8f0; font-size:11.5px; color:#64748b; display:flex; justify-content:space-between; align-items:center;">
        <span>💡 คลิกที่ปุ่มในแต่ละช่องเพื่อสลับสิทธิ์ระหว่าง [ X ➔ O ➔ V ➔ - ] ได้อย่างสะดวก</span>
        <span>อัปเดตระบบเรียลไทม์ ซิงค์อัตโนมัติ</span>
      </div>

    </div>
  `
}

// 2. แท็บย่อย: User Access Review (ทะเบียนและการทบทวนสิทธิ์)
function renderReviewTabHtml(filteredAccounts, allAccounts, statusFilter, searchQuery, roles) {
  return `
    <div>
      
      <!-- Filter and Search Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <input type="text" id="upm-search-input" value="${searchQuery}" 
            placeholder="🔍 ค้นหาชื่อ, บัญชีผู้ใช้, ระบบ, หรือกลุ่มงาน..." 
            style="width:280px; padding:7px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; outline:none;">
          
          <div style="display:flex; align-items:center; gap:6px; font-size:13px;">
            <span style="font-weight:600; color:#475569;">สถานะทบทวน:</span>
            <select id="upm-status-filter" style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; background:#fff; cursor:pointer;">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>ทั้งหมด (${allAccounts.length})</option>
              <option value="คงสิทธิ์ถูกต้อง" ${statusFilter === 'คงสิทธิ์ถูกต้อง' ? 'selected' : ''}>คงสิทธิ์ถูกต้อง</option>
              <option value="รอเพิกถอนสิทธิ์" ${statusFilter === 'รอเพิกถอนสิทธิ์' ? 'selected' : ''}>รอเพิกถอนสิทธิ์ (ลาออก/ย้าย)</option>
              <option value="รอปรับลดสิทธิ์" ${statusFilter === 'รอปรับลดสิทธิ์' ? 'selected' : ''}>รอปรับลดสิทธิ์ (Least Privilege)</option>
            </select>
          </div>
        </div>

        <div>
          <button id="upm-btn-add-account" class="btn" style="background:#2563eb; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + เพิ่มบัญชีผู้ถือสิทธิ์
          </button>
        </div>
      </div>

      <!-- Accounts Table -->
      <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <div style="overflow-x:auto;">
          <table style="min-width:1100px; width:100%; border-collapse:collapse; font-size:12.5px; text-align:left;">
            <thead>
              <tr style="background:#f1f5f9; color:#334155; font-weight:700; border-bottom:2px solid #cbd5e1;">
                <th style="padding:10px 12px; width:45px; text-align:center;">#</th>
                <th style="padding:10px 14px; min-width:180px;">ชื่อ-นามสกุล / ตำแหน่ง</th>
                <th style="padding:10px 12px; min-width:140px;">บัญชีผู้ใช้ (User ID / AD)</th>
                <th style="padding:10px 12px; min-width:150px;">กลุ่มงาน / เจ้าของระบบ</th>
                <th style="padding:10px 12px; min-width:160px;">ระบบสำคัญ & บทบาทที่ได้รับ</th>
                <th style="padding:10px 10px; text-align:center; width:110px;">ระดับสิทธิ์</th>
                <th style="padding:10px 10px; text-align:center; width:130px;">สถานะการทบทวน</th>
                <th style="padding:10px 14px; min-width:180px;">หมายเหตุ / การดำเนินการ</th>
                <th style="padding:10px 10px; text-align:center; width:100px;">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAccounts.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align:center; padding:32px; color:#94a3b8; font-size:13px;">
                    ไม่พบข้อมูลบัญชีผู้ถือครองสิทธิ์ที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ` : filteredAccounts.map((acc, idx) => {
                const badge = getReviewStatusBadge(acc.review_status)
                return `
                  <tr style="border-bottom:1px solid #e2e8f0; hover:background:#f8fafc;">
                    <td style="padding:10px 12px; text-align:center; color:#64748b; font-weight:600;">${idx + 1}</td>
                    <td style="padding:10px 14px;">
                      <div style="font-weight:700; color:#0f172a;">${acc.name}</div>
                      <div style="font-size:11px; color:#64748b;">${acc.position || '-'}</div>
                    </td>
                    <td style="padding:10px 12px;">
                      <div style="font-family:monospace; font-weight:700; color:#1e40af;">${acc.user_id}</div>
                      <div style="font-size:11px; color:#64748b;">${acc.user_ad || '-'}</div>
                    </td>
                    <td style="padding:10px 12px;">
                      <div style="color:#334155; font-weight:600;">${acc.department}</div>
                      <div style="font-size:11px; color:#64748b;">ผู้อนุมัติ: ${acc.business_owner}</div>
                    </td>
                    <td style="padding:10px 12px;">
                      <div style="font-weight:700; color:#0369a1;">${acc.target_system}</div>
                      <div style="font-size:11px; color:#475569;">${acc.system_role}</div>
                    </td>
                    <td style="padding:10px 10px; text-align:center;">
                      <span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:700; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe;">
                        ${acc.privilege_level || 'Admin'}
                      </span>
                    </td>
                    <td style="padding:10px 10px; text-align:center;">
                      <span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:4px; font-size:11.5px; font-weight:700; background:${badge.bg}; color:${badge.color}; border:1px solid ${badge.border};">
                        <span>${badge.icon}</span>
                        <span>${acc.review_status}</span>
                      </span>
                    </td>
                    <td style="padding:10px 14px; font-size:11.5px; color:#475569; line-height:1.4;">
                      ${acc.review_remark || '-'}
                    </td>
                    <td style="padding:10px 10px; text-align:center; white-space:nowrap;">
                      <button class="upm-btn-edit-account" data-id="${acc.id}" style="border:none; background:#eff6ff; color:#2563eb; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer; margin-right:4px;">
                        แก้ไข
                      </button>
                      <button class="upm-btn-delete-account" data-id="${acc.id}" style="border:none; background:#fee2e2; color:#b91c1c; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">
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
          <span>แสดง ${filteredAccounts.length} จากทั้งหมด ${allAccounts.length} บัญชีผู้ถือสิทธิ์</span>
          <span>กำหนดทบทวนสิทธิ์อย่างน้อยปีละ 1 ครั้ง ตามเกณฑ์ สกมช.</span>
        </div>
      </div>

    </div>
  `
}

// 3. แท็บย่อย: Update Log
function renderLogTabHtml(logs) {
  return `
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="margin:0; font-size:1.1rem; font-weight:700; color:#0f172a;">
          ประวัติการปรับปรุงและการทบทวนสิทธิ์ (Update Log)
        </h3>
        <button id="upm-btn-add-log" class="btn" style="background:#2563eb; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
          + เพิ่มบันทึกประวัติ
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${logs.map(log => `
          <div style="padding:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span style="font-weight:700; font-size:13px; color:#1e40af;">📅 ${log.displayDate || log.date}</span>
                <span style="font-size:12px; color:#64748b;">• โดย: <strong>${log.author}</strong></span>
              </div>
              <p style="margin:0; font-size:13px; color:#334155; line-height:1.5;">${log.detail}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// ฟังก์ชันผูก Event ต่างๆ
export function bindUserPermissionEvents(el, onAction) {
  // สลับแท็บย่อย
  el.querySelectorAll('.upm-subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      onAction({ type: 'change_subtab', subtab: btn.dataset.subtab })
    })
  })

  // สลับสิทธิ์ในตาราง Matrix [ X -> O -> V -> - ]
  el.querySelectorAll('.upm-matrix-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const roleId = btn.dataset.roleId
      const fnId = btn.dataset.fnId
      const currentVal = btn.dataset.val
      let nextVal = 'O'
      if (currentVal === 'X') nextVal = 'O'
      else if (currentVal === 'O') nextVal = 'V'
      else if (currentVal === 'V') nextVal = '-'
      else nextVal = 'X'

      onAction({ type: 'update_matrix_cell', roleId, fnId, nextVal })
    })
  })

  // ค้นหาบัญชี
  const searchInput = el.querySelector('#upm-search-input')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      onAction({ type: 'search_accounts', query: e.target.value })
    })
  }

  // กรองสถานะ
  const statusSelect = el.querySelector('#upm-status-filter')
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      onAction({ type: 'filter_status', status: e.target.value })
    })
  }

  // ปุ่มพิมพ์ A4
  el.querySelector('#upm-btn-print')?.addEventListener('click', () => {
    window.print()
  })

  // ปุ่มส่งออก Word
  el.querySelector('#upm-btn-export-word')?.addEventListener('click', () => {
    onAction({ type: 'export_word' })
  })

  // ปุ่มส่งออก CSV
  el.querySelector('#upm-btn-export-csv')?.addEventListener('click', () => {
    onAction({ type: 'export_csv' })
  })

  // ปุ่มบันทึก & ซิงค์
  el.querySelector('#upm-btn-save-sync')?.addEventListener('click', () => {
    onAction({ type: 'save_sync' })
  })

  // ปุ่มแก้ไขบัญชี
  el.querySelectorAll('.upm-btn-edit-account').forEach(btn => {
    btn.addEventListener('click', () => {
      onAction({ type: 'open_edit_account_modal', id: btn.dataset.id })
    })
  })

  // ปุ่มลบบัญชี
  el.querySelectorAll('.upm-btn-delete-account').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ถือสิทธิ์นี้ออกจากทะเบียน?')) {
        onAction({ type: 'delete_account', id: btn.dataset.id })
      }
    })
  })

  // ปุ่มเพิ่มบัญชี
  el.querySelector('#upm-btn-add-account')?.addEventListener('click', () => {
    onAction({ type: 'open_add_account_modal' })
  })

  // ปุ่มเพิ่มบันทึกประวัติ
  el.querySelector('#upm-btn-add-log')?.addEventListener('click', () => {
    onAction({ type: 'open_add_log_modal' })
  })
}

// แม่แบบเอกสารพิมพ์ A4 แนวนอน
function renderPrintTemplate(header, roles, systems, matrix, accounts) {
  return `
    <div style="font-family:'TH Sarabun New',Sarabun,sans-serif; color:#000; padding:10mm; background:#fff;">
      <div style="text-align:center; margin-bottom:12px;">
        <h2 style="font-size:18pt; font-weight:bold; margin:0;">
          รายงานการทบทวนสิทธิ์การเข้าถึงระบบสารสนเทศ (User Permission Matrix & Access Review)
        </h2>
        <div style="font-size:14pt; margin-top:2px;">
          ${header.agency} • รอบการประเมิน: ${header.review_cycle}
        </div>
      </div>

      <h3 style="font-size:14pt; font-weight:bold; margin:10px 0 4px 0;">1. ตารางสิทธิ์ระบบสำคัญ (Permission Matrix)</h3>
      <table style="width:100%; border-collapse:collapse; font-size:10pt; margin-bottom:16px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #000; padding:4px;">รหัส</th>
            <th style="border:1px solid #000; padding:4px;">บทบาทหน้าที่</th>
            ${systems.map(s => `<th colspan="${s.functions.length}" style="border:1px solid #000; padding:4px; text-align:center;">${s.name}</th>`).join('')}
          </tr>
          <tr style="background:#f8fafc; font-size:8pt;">
            <th style="border:1px solid #000; padding:2px;"></th>
            <th style="border:1px solid #000; padding:2px;"></th>
            ${systems.map(s => s.functions.map(fn => `<th style="border:1px solid #000; padding:2px; text-align:center; font-size:7pt; line-height:1.2;">${formatMatrixFnLabel(fn.label)}</th>`).join('')).join('')}
          </tr>
        </thead>
        <tbody>
          ${roles.map(r => `
            <tr>
              <td style="border:1px solid #000; padding:4px; text-align:center; font-weight:bold;">${r.code}</td>
              <td style="border:1px solid #000; padding:4px;">${r.title}</td>
              ${systems.map(s => s.functions.map(fn => `
                <td style="border:1px solid #000; padding:4px; text-align:center; font-weight:bold;">
                  ${matrix[r.id]?.[fn.id] || '-'}
                </td>
              `).join('')).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3 style="font-size:14pt; font-weight:bold; margin:10px 0 4px 0;">2. ผลการทบทวนสิทธิ์ผู้ใช้งานระดับ Admin (User Access Review)</h3>
      <table style="width:100%; border-collapse:collapse; font-size:10pt;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #000; padding:4px; width:30px;">#</th>
            <th style="border:1px solid #000; padding:4px;">ชื่อ-สกุล</th>
            <th style="border:1px solid #000; padding:4px;">User AD</th>
            <th style="border:1px solid #000; padding:4px;">กลุ่มงาน</th>
            <th style="border:1px solid #000; padding:4px;">ระบบ / บทบาทที่ได้รับ</th>
            <th style="border:1px solid #000; padding:4px; text-align:center;">สถานะทบทวน</th>
            <th style="border:1px solid #000; padding:4px;">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          ${accounts.map((a, i) => `
            <tr>
              <td style="border:1px solid #000; padding:4px; text-align:center;">${i + 1}</td>
              <td style="border:1px solid #000; padding:4px;">${a.name}</td>
              <td style="border:1px solid #000; padding:4px;">${a.user_ad}</td>
              <td style="border:1px solid #000; padding:4px;">${a.department}</td>
              <td style="border:1px solid #000; padding:4px;">${a.target_system} (${a.system_role})</td>
              <td style="border:1px solid #000; padding:4px; text-align:center; font-weight:bold;">${a.review_status}</td>
              <td style="border:1px solid #000; padding:4px;">${a.review_remark || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top:24px; display:flex; justify-content:space-around; text-align:center; font-size:12pt;">
        <div>
          <div>ลงชื่อ......................................................ผู้จัดทำ/ผู้ประเมิน</div>
          <div style="margin-top:4px;">(${header.evaluator})</div>
          <div>ตำแหน่ง ${header.evaluator_position}</div>
        </div>
        <div>
          <div>ลงชื่อ......................................................ผู้ตรวจทาน/ผู้อนุมัติ</div>
          <div style="margin-top:4px;">(${header.reviewer})</div>
          <div>ตำแหน่ง ${header.reviewer_position}</div>
        </div>
      </div>
    </div>
  `
}

// ส่งออกไฟล์ Word (.doc)
export function exportUserPermissionWord(state) {
  const header = state?.header || DEFAULT_USER_PERMISSION_HEADER
  const roles = state?.roles || SSK_ROLES
  const systems = state?.systems || SSK_SYSTEMS
  const matrix = state?.matrix || DEFAULT_PERMISSION_MATRIX
  const accounts = state?.accounts || DEFAULT_USER_REVIEW_ACCOUNTS

  const printHtml = renderPrintTemplate(header, roles, systems, matrix, accounts)
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>User_Permission_Matrix_Review_${header.last_review_date}</title>
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
  a.download = `User_Permission_Matrix_Review_${header.agency}_2569.doc`
  a.click()
  URL.revokeObjectURL(url)
  showNotification('ส่งออกเอกสาร Word (.doc) สำเร็จ', 'success')
}

// ส่งออกไฟล์ CSV
export function exportUserPermissionCsv(state) {
  const accounts = state?.accounts || DEFAULT_USER_REVIEW_ACCOUNTS
  let csv = '\ufeffNo,Name,Position,UserID,UserAD,Department,BusinessOwner,TargetSystem,SystemRole,PrivilegeLevel,ReviewStatus,ReviewRemark\n'
  accounts.forEach((a, idx) => {
    csv += `"${idx + 1}","${a.name}","${a.position || ''}","${a.user_id}","${a.user_ad}","${a.department}","${a.business_owner}","${a.target_system}","${a.system_role}","${a.privilege_level}","${a.review_status}","${a.review_remark || ''}"\n`
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `User_Access_Review_Accounts_2569.csv`
  a.click()
  URL.revokeObjectURL(url)
  showNotification('ส่งออกไฟล์ CSV สำเร็จ', 'success')
}

// ซิงค์ขึ้น Supabase
export async function syncUserPermissionToSupabase(state) {
  try {
    if (!supabase || !state) return
    await supabase.from('cyber_module_states').upsert({
      module_key: 'user_permission_matrix',
      data: state,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.warn('Supabase sync deferred for user_permission_matrix:', err.message)
  }
}

// ดึงข้อมูลจาก Supabase
export async function fetchUserPermissionFromSupabase() {
  try {
    if (!supabase) return null
    const { data, error } = await supabase
      .from('cyber_module_states')
      .select('data')
      .eq('module_key', 'user_permission_matrix')
      .maybeSingle()
    if (!error && data?.data) {
      return data.data
    }
  } catch (err) {
    console.warn('Supabase fetch deferred for user_permission_matrix:', err.message)
  }
  return null
}
