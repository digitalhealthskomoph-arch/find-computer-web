import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import { DEFAULT_BIA_REPORT_DATA, mergeBiaEvidentToReportRows } from './biaReportData.js'
import { supabase } from '../../lib/supabase.js'
import { showNotification } from '../../lib/utils.js'

export function ensureBiaReportPrintStyles() {
  let style = document.getElementById('bia-report-print-style')
  if (!style) {
    style = document.createElement('style')
    style.id = 'bia-report-print-style'
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #bia-report-print-sheet, #bia-report-print-sheet * {
          visibility: visible !important;
        }
        #bia-report-print-sheet {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 10mm 15mm !important;
          box-shadow: none !important;
          border: none !important;
          background: #fff !important;
        }
        .no-print {
          display: none !important;
        }
        .bia-report-input, .bia-report-textarea {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          resize: none !important;
        }
      }
    `
    document.head.appendChild(style)
  }
}

// Helper: Format embed url for Google Drive or direct PDF
function formatPdfEmbedUrl(url) {
  if (!url) return ''
  if (url.includes('drive.google.com/file/d/')) {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`
    }
  }
  return url
}

// 1. Main HTML Renderer
export function renderBiaReportHtml(
  reports = [DEFAULT_BIA_REPORT_DATA],
  activeReportId = 'bia_report_2569',
  activeSubTab = 'report',
  docPdfLinks = []
) {
  ensureBiaReportPrintStyles()

  const currentReport = reports.find(r => r.id === activeReportId) || reports[0] || DEFAULT_BIA_REPORT_DATA
  const { header, objective, scope, tableRows, budgetRequests, reEvaluationDate, participants, signatories } = currentReport

  // Calculate table metrics
  const totalFinancial = (tableRows || []).reduce((acc, r) => acc + (Number(r.financialImpact) || 0), 0)
  const totalRows = (tableRows || []).length

  return `
    <div style="font-family:'Sarabun',-apple-system,sans-serif; color:#1e293b; max-width:1200px; margin:0 auto; padding-bottom:60px;">
      
      <!-- Top Navigation Tabs -->
      <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #e2e8f0; padding-bottom:12px; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; gap:8px;">
          <button class="btn bia-main-tab-btn ${activeSubTab === 'report' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="report" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>📝</span> รายงาน BIA Report แบบ Interactive
          </button>
          <button class="btn bia-main-tab-btn ${activeSubTab === 'pdf' ? 'btn-primary' : 'btn-outline-secondary'}" 
            data-subtab="pdf" 
            style="font-weight:700; font-size:13.5px; padding:8px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            <span>📎</span> เอกสารแนบ PDF (หนังสือส่งรายงาน)
            ${docPdfLinks.length > 0 ? `<span class="badge" style="background:#ef4444; color:#fff; border-radius:999px; padding:2px 7px; font-size:11px; margin-left:4px;">${docPdfLinks.length}</span>` : ''}
          </button>
        </div>

        ${activeSubTab === 'report' ? `
          <!-- Version Selector & Actions -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <select id="select-bia-report-version" class="form-select form-select-sm" style="width:auto; font-weight:600; font-size:13px; border-radius:6px; padding:6px 12px; background:#fff;">
              ${reports.map(r => `
                <option value="${r.id}" ${r.id === activeReportId ? 'selected' : ''}>
                  📄 ${r.versionTitle || r.header?.reportDate || r.id}
                </option>
              `).join('')}
            </select>
            <button id="btn-add-bia-report-version" class="btn btn-sm btn-outline-primary" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px;" title="สร้างฉบับใหม่">
              + สร้างฉบับใหม่
            </button>
            <button id="btn-sync-from-1-6" class="btn btn-sm btn-outline-success" style="font-size:12px; font-weight:700; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:5px;" title="ดึงตัวเลขและผลกระทบล่าสุดจาก 1.6 BIA Evident">
              <span>🔄</span> ดึงข้อมูลจาก 1.6
            </button>
            <button id="btn-export-bia-report-word" class="btn btn-sm btn-primary" style="font-size:12px; font-weight:700; border-radius:6px; padding:6px 14px; background:#2563eb; border:none; display:inline-flex; align-items:center; gap:5px;">
              <span>📄</span> ส่งออก Word (.doc)
            </button>
            <button id="btn-print-bia-report" class="btn btn-sm btn-outline-dark" style="font-size:12px; font-weight:600; border-radius:6px; padding:6px 12px; display:inline-flex; align-items:center; gap:5px;">
              <span>🖨️</span> พิมพ์ / PDF
            </button>
          </div>
        ` : ''}
      </div>

      ${activeSubTab === 'pdf' ? renderBiaPdfAttachmentsTab(docPdfLinks) : renderBiaReportFormTab(currentReport, totalFinancial, totalRows)}

    </div>
  `
}

// 2. Tab: PDF Attachments
function renderBiaPdfAttachmentsTab(docPdfLinks = []) {
  return `
    <div style="background:#fff; border-radius:12px; padding:28px; box-shadow:0 1px 4px rgba(0,0,0,0.06); border:1px solid #e2e8f0;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; border-bottom:1px solid #e2e8f0; padding-bottom:16px;">
        <div>
          <h3 style="font-size:1.15rem; font-weight:800; color:#1e293b; margin:0 0 6px 0; display:flex; align-items:center; gap:8px;">
            <span>📎</span> เอกสารแนบ PDF (หนังสือราชการขอส่งรายงานการวิเคราะห์ผลกระทบทางธุรกิจ)
          </h3>
          <p style="font-size:13px; color:#64748b; margin:0;">
            แนบไฟล์ PDF หนังสือขอส่งรายงานฯ ฉบับลงนามแล้ว หรือเอกสารประกอบการประชุมพิจารณา สามารถวาง URL ไฟล์ตรงหรือลิงก์แชร์จาก Google Drive
          </p>
        </div>
      </div>

      <!-- Add PDF Box -->
      <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:10px; padding:18px; margin-bottom:24px;">
        <div style="font-weight:700; font-size:13px; color:#334155; margin-bottom:10px;">+ แนบเอกสาร PDF ใหม่</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <input type="text" id="input-bia-pdf-label" placeholder="ชื่อเอกสาร (เช่น หนังสือขอส่งรายงาน BIA Report สสจ.สระแก้ว ฉบับลงนาม)" class="form-control" style="flex:1; min-width:220px; font-size:13px; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
          <input type="text" id="input-bia-pdf-url" placeholder="URL ของไฟล์ PDF หรือ ลิงก์ Google Drive" class="form-control" style="flex:2; min-width:280px; font-size:13px; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
          <button id="btn-add-bia-pdf-link" class="btn btn-danger" style="font-weight:700; font-size:13px; padding:8px 20px; border-radius:6px; white-space:nowrap; background:#ef4444; border:none; color:#fff;">
            + แนบเอกสาร
          </button>
        </div>
      </div>

      <!-- PDF List & Previews -->
      ${docPdfLinks.length === 0 ? `
        <div style="text-align:center; padding:48px 20px; color:#94a3b8; background:#f8fafc; border-radius:8px; border:1px dashed #e2e8f0;">
          <div style="font-size:36px; margin-bottom:8px;">📄</div>
          <div style="font-weight:600; font-size:14px; margin-bottom:4px;">ยังไม่มีเอกสารแนบในหัวข้อนี้</div>
          <div style="font-size:12.5px;">กรอกชื่อเอกสารและ URL หรือลิงก์ Google Drive ด้านบนเพื่อแนบเอกสารหนังสือส่งรายงาน</div>
        </div>
      ` : docPdfLinks.map(pdf => {
        const embedUrl = formatPdfEmbedUrl(pdf.url)
        const isGoogle = (pdf.url || '').includes('drive.google.com')
        return `
          <div style="border:1px solid #e2e8f0; border-radius:10px; margin-bottom:24px; overflow:hidden; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="padding:12px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:32px; height:32px; background:#fee2e2; color:#ef4444; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <div style="font-weight:700; color:#1e293b; font-size:14px;">${pdf.label}</div>
                  <div style="font-size:11.5px; color:#64748b; display:flex; align-items:center; gap:6px;">
                    ${isGoogle ? `<span style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; padding:1px 6px; border-radius:4px; font-weight:600;">Google Drive</span>` : ''}
                    <span style="max-width:350px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${pdf.url}</span>
                  </div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <a href="${pdf.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary" style="font-size:12px; font-weight:600; padding:5px 12px; border-radius:6px; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  เปิดในแท็บใหม่
                </a>
                <button class="btn btn-sm btn-outline-danger btn-del-bia-pdf" data-id="${pdf.id}" style="font-size:12px; font-weight:600; padding:5px 10px; border-radius:6px;">
                  ลบ
                </button>
              </div>
            </div>
            <div style="height:650px; width:100%; background:#f1f5f9;">
              <iframe src="${embedUrl}" style="width:100%; height:100%; border:none;" allow="autoplay" loading="lazy" title="${pdf.label}"></iframe>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

// 3. Tab: Interactive Report Form
function renderBiaReportFormTab(report, totalFinancial, totalRows) {
  const { header, objective, scope, tableRows, budgetRequests, reEvaluationDate, participants, signatories } = report

  return `
    <div id="bia-report-print-sheet" style="background:#fff; border-radius:12px; padding:40px 48px; box-shadow:0 2px 8px rgba(0,0,0,0.06); border:1px solid #e2e8f0; font-family:'Sarabun',-apple-system,sans-serif; line-height:1.65;">
      
      <!-- Report Header -->
      <div style="text-align:center; margin-bottom:28px;">
        <img src="${LOGO_MOPH_BASE64}" alt="ตรากระทรวงสาธารณสุข" style="width:85px; height:auto; margin-bottom:12px;">
        <h1 style="font-size:1.6rem; font-weight:800; color:#0f172a; margin:0 0 4px 0; line-height:1.35;">
          รายงานการวิเคราะห์ผลกระทบทางธุรกิจ
        </h1>
        <h2 style="font-size:1.25rem; font-weight:700; color:#334155; margin:0 0 16px 0;">
          (Business Impact Analysis : BIA Report)
        </h2>
        <div style="height:2px; background:#0284c7; width:90px; margin:0 auto 20px auto;"></div>
      </div>

      <!-- Section 1: ข้อมูลทั่วไป -->
      <div style="margin-bottom:28px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:20px;">
        <h3 style="font-size:1.1rem; font-weight:800; color:#0369a1; margin:0 0 14px 0; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
          1. ข้อมูลทั่วไป
        </h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; font-size:13.5px;">
          <div>
            <label style="font-weight:700; color:#475569; display:block; margin-bottom:3px;">ชื่อองค์กร:</label>
            <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="header.orgName" value="${header?.orgName || ''}" style="font-size:13.5px; font-weight:600;">
          </div>
          <div>
            <label style="font-weight:700; color:#475569; display:block; margin-bottom:3px;">วันที่รายงาน:</label>
            <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="header.reportDate" value="${header?.reportDate || ''}" style="font-size:13.5px; font-weight:600;">
          </div>
          <div>
            <label style="font-weight:700; color:#475569; display:block; margin-bottom:3px;">ชื่อผู้จัดทำรายงาน:</label>
            <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="header.author" value="${header?.author || ''}" style="font-size:13.5px; font-weight:600;">
          </div>
          <div style="grid-column:1 / -1;">
            <label style="font-weight:700; color:#475569; display:block; margin-bottom:3px;">ทีมวิเคราะห์ที่เกี่ยวข้อง:</label>
            <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="header.involvedTeams" value="${header?.involvedTeams || ''}" style="font-size:13.5px;">
          </div>
        </div>
      </div>

      <!-- Section 2: วัตถุประสงค์ -->
      <div style="margin-bottom:28px;">
        <h3 style="font-size:1.1rem; font-weight:800; color:#0369a1; margin:0 0 10px 0;">
          2. วัตถุประสงค์ของการวิเคราะห์ (Objective)
        </h3>
        <textarea class="form-control bia-report-textarea bia-field-edit" data-field="objective" rows="2" style="font-size:14px; line-height:1.6; border-radius:6px;">${objective || ''}</textarea>
      </div>

      <!-- Section 3: ขอบเขตของการวิเคราะห์ -->
      <div style="margin-bottom:32px;">
        <h3 style="font-size:1.1rem; font-weight:800; color:#0369a1; margin:0 0 12px 0;">
          3. ขอบเขตของการวิเคราะห์ (Scope)
        </h3>
        
        <!-- 3.1 กระบวนการที่ครอบคลุม -->
        <div style="margin-bottom:16px; padding-left:12px; border-left:3px solid #0284c7;">
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0 0 8px 0;">
            3.1 กระบวนการที่ครอบคลุม (Core Processes)
          </h4>
          <p style="font-size:13px; color:#475569; margin:0 0 8px 0;">
            การวิเคราะห์นี้ครอบคลุมกระบวนการสนับสนุนการดำเนินงานหลักของสำนักงานสาธารณสุขจังหวัดสระแก้ว โดยมุ่งเน้นที่ความต่อเนื่องของงานบริหารจัดการและบริการดิจิทัล ดังนี้:
          </p>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${(scope?.coreProcesses || []).map((p, idx) => `
              <div style="font-size:13.5px; display:flex; gap:6px; align-items:flex-start;">
                <span style="font-weight:700; color:#0284c7; min-width:18px;">•</span>
                <div style="flex:1;">
                  <strong style="color:#0f172a;">${p.title}:</strong> 
                  <span style="color:#334155;">${p.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3.2 การให้บริการบุคลากร -->
        <div style="margin-bottom:16px; padding-left:12px; border-left:3px solid #0284c7;">
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0 0 8px 0;">
            3.2 การให้บริการบุคลากร (Staff Services)
          </h4>
          <div style="display:flex; flex-direction:column; gap:4px; font-size:13.5px; color:#334155;">
            ${(scope?.staffServices || []).map(s => `
              <div style="display:flex; gap:6px; align-items:flex-start;">
                <span style="color:#0284c7;">-</span> <span>${s}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3.3 ระบบการบริการจัดการบุคลากรและข้อมูลภายในองค์กร -->
        <div style="margin-bottom:16px; padding-left:12px; border-left:3px solid #0284c7;">
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0 0 8px 0;">
            3.3 ระบบการบริการจัดการบุคลากรและข้อมูลภายในองค์กร (Internal Management Systems)
          </h4>
          <div style="display:flex; flex-direction:column; gap:4px; font-size:13.5px; color:#334155;">
            ${(scope?.internalManagement || []).map(m => `
              <div style="display:flex; gap:6px; align-items:flex-start;">
                <span style="color:#0284c7;">-</span> <span>${m}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3.4 ระบบและทรัพยากรที่เกี่ยวข้อง -->
        <div style="padding-left:12px; border-left:3px solid #0284c7;">
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0 0 8px 0;">
            3.4 ระบบและทรัพยากรที่เกี่ยวข้อง (Involved Systems & Resources)
          </h4>
          <p style="font-size:13px; color:#475569; margin:0 0 8px 0;">
            เพื่อให้การวิเคราะห์ความเสี่ยงครอบคลุมทุกมิติ จึงกำหนดทรัพยากรวิกฤตที่เกี่ยวข้องดังนี้:
          </p>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:13.5px;">
            ${(scope?.criticalResources || []).map(r => `
              <div style="display:flex; gap:6px; align-items:flex-start;">
                <span style="font-weight:700; color:#0284c7;">•</span>
                <div>
                  <strong style="color:#0f172a;">${r.category}:</strong> 
                  <span style="color:#334155;">${r.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Section 4: รายการกระบวนการที่สำคัญและผลการวิเคราะห์ -->
      <div style="margin-bottom:32px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <h3 style="font-size:1.1rem; font-weight:800; color:#0369a1; margin:0;">
            4. รายการกระบวนการที่สำคัญและผลการวิเคราะห์ (Key Processes and Impact Analysis)
          </h3>
          <div class="no-print" style="font-size:12.5px; color:#64748b; background:#f1f5f9; padding:4px 10px; border-radius:6px; font-weight:600;">
            รวมผลกระทบทางการเงิน: <span style="color:#dc2626; font-weight:800;">฿${totalFinancial.toLocaleString()}</span> / วัน (${totalRows} ระบบ)
          </div>
        </div>

        <!-- Table 4 -->
        <div style="overflow-x:auto; border:1px solid #cbd5e1; border-radius:8px; margin-bottom:18px;">
          <table style="width:100%; border-collapse:collapse; font-size:12.5px; min-width:850px;">
            <thead>
              <tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1; text-align:center; color:#1e293b; font-weight:700;">
                <th style="padding:10px 8px; border:1px solid #cbd5e1; width:22%;">กระบวนการทางธุรกิจ (Asset Name)</th>
                <th style="padding:10px 8px; border:1px solid #cbd5e1; width:12%;">ผลกระทบทางการเงิน (บาท/วัน)</th>
                <th style="padding:10px 8px; border:1px solid #cbd5e1; width:15%;">ผลกระทบด้านชื่อเสียง</th>
                <th style="padding:10px 8px; border:1px solid #cbd5e1; width:14%;">ผลกระทบด้านกฎหมาย</th>
                <th style="padding:10px 6px; border:1px solid #cbd5e1; width:7%;">MTPD</th>
                <th style="padding:10px 6px; border:1px solid #cbd5e1; width:7%;">RTO</th>
                <th style="padding:10px 6px; border:1px solid #cbd5e1; width:7%;">RPO</th>
                <th style="padding:10px 8px; border:1px solid #cbd5e1; width:16%;">ข้อเสนอแนะ (กิจกรรมสำคัญ)</th>
              </tr>
            </thead>
            <tbody>
              ${(tableRows || []).map((row, idx) => `
                <tr style="background:${idx % 2 === 0 ? '#fff' : '#f8fafc'};">
                  <td style="padding:8px 10px; border:1px solid #cbd5e1; font-weight:700; color:#0f172a;">
                    <input type="text" class="form-control form-control-sm bia-report-input bia-row-input" data-idx="${idx}" data-field="processName" value="${row.processName || ''}" style="font-weight:700; font-size:12.5px;">
                  </td>
                  <td style="padding:8px; border:1px solid #cbd5e1; text-align:right;">
                    <input type="number" class="form-control form-control-sm bia-report-input bia-row-input" data-idx="${idx}" data-field="financialImpact" value="${row.financialImpact || 0}" style="text-align:right; font-size:12.5px; font-weight:700; color:#dc2626;">
                  </td>
                  <td style="padding:8px; border:1px solid #cbd5e1;">
                    <textarea class="form-control form-control-sm bia-report-textarea bia-row-input" data-idx="${idx}" data-field="reputationImpact" rows="2" style="font-size:12px; line-height:1.4;">${row.reputationImpact || ''}</textarea>
                  </td>
                  <td style="padding:8px; border:1px solid #cbd5e1;">
                    <textarea class="form-control form-control-sm bia-report-textarea bia-row-input" data-idx="${idx}" data-field="legalImpact" rows="2" style="font-size:12px; line-height:1.4;">${row.legalImpact || ''}</textarea>
                  </td>
                  <td style="padding:8px; border:1px solid #cbd5e1; text-align:center;">
                    <input type="text" class="form-control form-control-sm bia-report-input bia-row-input" data-idx="${idx}" data-field="mtpd" value="${row.mtpd || ''}" style="text-align:center; font-size:12px; font-weight:600;">
                  </td>
                  <td style="padding:8px; border:1px solid #cbd5e1; text-align:center;">
                    <input type="text" class="form-control form-control-sm bia-report-input bia-row-input" data-idx="${idx}" data-field="rto" value="${row.rto || ''}" style="text-align:center; font-size:12px; font-weight:700; color:#0284c7;">
                  </td>
                  <td style="padding:8px; border:1px solid #cbd5e1; text-align:center;">
                    <input type="text" class="form-control form-control-sm bia-report-input bia-row-input" data-idx="${idx}" data-field="rpo" value="${row.rpo || ''}" style="text-align:center; font-size:12px; font-weight:600;">
                  </td>
                  <td style="padding:8px; border:1px solid #cbd5e1;">
                    <textarea class="form-control form-control-sm bia-report-textarea bia-row-input" data-idx="${idx}" data-field="recommendation" rows="2" style="font-size:12px; line-height:1.4; color:#166534; font-weight:600;">${row.recommendation || ''}</textarea>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- คำอธิบายเพิ่มเติม -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px 20px; margin-bottom:20px; font-size:13px; line-height:1.6; color:#334155;">
          <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin:0 0 8px 0;">คำอธิบายเพิ่มเติม</h4>
          <p style="margin:0 0 4px 0;"><strong>ผลกระทบทางการเงิน:</strong> มูลค่าความเสียหายทางการเงินที่อาจเกิดขึ้น หากกระบวนการหยุดชะงัก</p>
          <p style="margin:0 0 4px 0;"><strong>ผลกระทบด้านชื่อเสียง:</strong> ระดับความเสียหายต่อความเชื่อมั่นของลูกค้า (สูง, ปานกลาง, ต่ำ)</p>
          <p style="margin:0 0 4px 0;"><strong>ผลกระทบด้านกฎหมาย:</strong> การละเมิดกฎหมายหรือข้อบังคับที่อาจเกิดขึ้น รวมถึงค่าปรับ</p>
          <p style="margin:0 0 4px 0;"><strong>MTPD (Maximum Tolerable Period of Disruption):</strong> ระยะเวลาสูงสุดที่ยอมให้ธุรกิจหยุดชะงัก</p>
          <p style="margin:0 0 4px 0;"><strong>RTO (Recovery Time Objective):</strong> ระยะเวลาในการกู้คืนระบบ</p>
          <p style="margin:0;"><strong>RPO (Recovery Point Objective):</strong> ระยะเวลาสูงสุดที่ยอมให้ข้อมูลสูญหาย</p>
        </div>

        <!-- ข้อเสนอแนะงบประมาณ (Budget Requests) -->
        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:18px 20px; margin-bottom:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h4 style="font-size:0.95rem; font-weight:800; color:#991b1b; margin:0; display:flex; align-items:center; gap:6px;">
              <span>💡</span> ข้อเสนอแนะ: ต้องการงบประมาณในการปรับปรุงเพื่อลดความเสี่ยงภัยคุกคามไซเบอร์ ดังต่อไปนี้
            </h4>
            <button id="btn-add-budget-row" class="btn btn-sm btn-outline-danger no-print" style="font-size:11.5px; font-weight:700; padding:2px 8px; border-radius:4px;">
              + เพิ่มงบประมาณ
            </button>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${(budgetRequests || []).map((b, bIdx) => `
              <div style="display:flex; align-items:center; gap:10px; font-size:13.5px;">
                <span style="font-weight:700; color:#b91c1c; min-width:18px;">•</span>
                <input type="text" class="form-control form-control-sm bia-report-input bia-budget-amount" data-idx="${bIdx}" value="${b.amount || ''}" style="width:130px; font-weight:700; color:#b91c1c; font-size:13.5px;">
                <input type="text" class="form-control form-control-sm bia-report-input bia-budget-purpose" data-idx="${bIdx}" value="${b.purpose || ''}" style="flex:1; font-size:13.5px;">
                <button class="btn btn-sm text-danger no-print btn-del-budget-row" data-idx="${bIdx}" style="padding:0 6px; font-size:14px; border:none; background:transparent;">×</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Section 5: วันที่ประเมินซ้ำ -->
      <div style="margin-bottom:28px;">
        <h3 style="font-size:1.1rem; font-weight:800; color:#0369a1; margin:0 0 8px 0;">
          5. วันที่ประเมินซ้ำ
        </h3>
        <div style="display:flex; align-items:center; gap:10px; font-size:14px;">
          <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="reEvaluationDate" value="${reEvaluationDate || ''}" style="max-width:350px; font-weight:600; font-size:14px;">
        </div>
      </div>

      <!-- Section 6: รายชื่อผู้เข้าร่วมการวิเคราะห์ -->
      <div style="margin-bottom:36px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h3 style="font-size:1.1rem; font-weight:800; color:#0369a1; margin:0;">
            6. รายชื่อผู้เข้าร่วมการวิเคราะห์
          </h3>
          <button id="btn-add-participant-row" class="btn btn-sm btn-outline-primary no-print" style="font-size:11.5px; font-weight:700; padding:2px 8px; border-radius:4px;">
            + เพิ่มผู้เข้าร่วม
          </button>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(participants || []).map((p, pIdx) => `
            <div style="display:flex; align-items:center; gap:12px; font-size:13.5px;">
              <span style="font-weight:700; color:#0284c7; min-width:18px;">•</span>
              <input type="text" class="form-control form-control-sm bia-report-input bia-part-name" data-idx="${pIdx}" value="${p.name || ''}" style="width:260px; font-weight:600; font-size:13.5px;">
              <span style="color:#64748b;">(</span>
              <input type="text" class="form-control form-control-sm bia-report-input bia-part-role" data-idx="${pIdx}" value="${p.role || ''}" style="width:160px; font-size:13px; color:#475569;">
              <span style="color:#64748b;">)</span>
              <button class="btn btn-sm text-danger no-print btn-del-part-row" data-idx="${pIdx}" style="padding:0 6px; font-size:14px; border:none; background:transparent;">×</button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Signatures -->
      <div style="margin-top:40px; padding-top:24px; border-top:1px solid #cbd5e1; display:flex; justify-content:space-between; text-align:center; flex-wrap:wrap; gap:24px; font-size:13.5px;">
        <div style="flex:1; min-width:240px;">
          <p style="margin-bottom:48px; color:#64748b;">ผู้จัดทำรายงาน</p>
          <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="signatories.preparedBy.name" value="${signatories?.preparedBy?.name || ''}" style="text-align:center; font-weight:700; font-size:13.5px; margin-bottom:4px;">
          <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="signatories.preparedBy.position" value="${signatories?.preparedBy?.position || ''}" style="text-align:center; color:#64748b; font-size:12.5px;">
        </div>
        <div style="flex:1; min-width:240px;">
          <p style="margin-bottom:48px; color:#64748b;">ผู้รับทราบรายงาน (CISO)</p>
          <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="signatories.acknowledgedBy.name" value="${signatories?.acknowledgedBy?.name || ''}" style="text-align:center; font-weight:700; font-size:13.5px; margin-bottom:4px;">
          <input type="text" class="form-control form-control-sm bia-report-input bia-field-edit" data-field="signatories.acknowledgedBy.position" value="${signatories?.acknowledgedBy?.position || ''}" style="text-align:center; color:#64748b; font-size:12.5px;">
        </div>
      </div>

    </div>
  `
}

// 4. Export to Word (.doc)
export function exportBiaReportToWord(report) {
  if (!report) return
  const { header, objective, scope, tableRows, budgetRequests, reEvaluationDate, participants, signatories } = report

  const totalFinancial = (tableRows || []).reduce((acc, r) => acc + (Number(r.financialImpact) || 0), 0)

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>BIA Report - ${header?.orgName || 'สสจ.สระแก้ว'}</title>
      <style>
        body { font-family: 'TH Sarabun PSK', 'TH Sarabun New', 'Cordia New', Arial, sans-serif; font-size: 16pt; line-height: 1.35; margin: 20mm; }
        h1 { font-size: 22pt; text-align: center; font-weight: bold; margin: 4px 0; }
        h2 { font-size: 18pt; text-align: center; font-weight: bold; margin: 2px 0 16px 0; }
        h3 { font-size: 17pt; font-weight: bold; color: #0369a1; margin: 16px 0 6px 0; }
        h4 { font-size: 16pt; font-weight: bold; margin: 8px 0 4px 0; }
        p { margin: 4px 0; text-align: justify; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14pt; }
        th, td { border: 1px solid #333; padding: 6px 8px; vertical-align: top; }
        th { background-color: #f1f5f9; text-align: center; font-weight: bold; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .fw-bold { font-weight: bold; }
        .info-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; margin: 10px 0; }
        .budget-box { background: #fef2f2; border: 1px solid #fecaca; padding: 10px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div style="text-align: center; margin-bottom: 12px;">
        <img src="${LOGO_MOPH_BASE64}" width="80" height="80" alt="Logo" /><br/>
        <h1>รายงานการวิเคราะห์ผลกระทบทางธุรกิจ</h1>
        <h2>(Business Impact Analysis : BIA Report)</h2>
      </div>

      <div class="info-box">
        <p><strong>ชื่อองค์กร:</strong> ${header?.orgName || ''}</p>
        <p><strong>วันที่รายงาน:</strong> ${header?.reportDate || ''}</p>
        <p><strong>ชื่อผู้จัดทำรายงาน:</strong> ${header?.author || ''}</p>
        <p><strong>ทีมวิเคราะห์ที่เกี่ยวข้อง:</strong> ${header?.involvedTeams || ''}</p>
      </div>

      <h3>2. วัตถุประสงค์ของการวิเคราะห์ (Objective)</h3>
      <p>${objective || ''}</p>

      <h3>3. ขอบเขตของการวิเคราะห์ (Scope)</h3>
      <h4>3.1 กระบวนการที่ครอบคลุม (Core Processes)</h4>
      <p>การวิเคราะห์นี้ครอบคลุมกระบวนการสนับสนุนการดำเนินงานหลักของสำนักงานสาธารณสุขจังหวัดสระแก้ว โดยมุ่งเน้นที่ความต่อเนื่องของงานบริหารจัดการและบริการดิจิทัล ดังนี้:</p>
      ${(scope?.coreProcesses || []).map(p => `
        <p style="margin-left: 20px;">• <strong>${p.title}:</strong> ${p.desc}</p>
      `).join('')}

      <h4>3.2 การให้บริการบุคลากร (Staff Services)</h4>
      ${(scope?.staffServices || []).map(s => `
        <p style="margin-left: 20px;">- ${s}</p>
      `).join('')}

      <h4>3.3 ระบบการบริการจัดการบุคลากรและข้อมูลภายในองค์กร (Internal Management Systems)</h4>
      ${(scope?.internalManagement || []).map(m => `
        <p style="margin-left: 20px;">- ${m}</p>
      `).join('')}

      <h4>3.4 ระบบและทรัพยากรที่เกี่ยวข้อง (Involved Systems & Resources)</h4>
      ${(scope?.criticalResources || []).map(r => `
        <p style="margin-left: 20px;">• <strong>${r.category}:</strong> ${r.desc}</p>
      `).join('')}

      <h3>4. รายการกระบวนการที่สำคัญและผลการวิเคราะห์ (Key Processes and Impact Analysis)</h3>
      <p><strong>รวมผลกระทบทางการเงิน:</strong> ฿${totalFinancial.toLocaleString()} บาท/วัน</p>

      <table>
        <thead>
          <tr>
            <th style="width: 20%;">กระบวนการทางธุรกิจ (Asset Name)</th>
            <th style="width: 12%;">ผลกระทบทางการเงิน (บาท/วัน)</th>
            <th style="width: 15%;">ผลกระทบด้านชื่อเสียง</th>
            <th style="width: 15%;">ผลกระทบด้านกฎหมาย</th>
            <th style="width: 7%;">MTPD</th>
            <th style="width: 7%;">RTO</th>
            <th style="width: 7%;">RPO</th>
            <th style="width: 17%;">ข้อเสนอแนะ (กิจกรรมสำคัญ)</th>
          </tr>
        </thead>
        <tbody>
          ${(tableRows || []).map(r => `
            <tr>
              <td class="fw-bold">${r.processName || ''}</td>
              <td class="text-right" style="color: #dc2626;">${(Number(r.financialImpact) || 0).toLocaleString()}</td>
              <td>${r.reputationImpact || ''}</td>
              <td>${r.legalImpact || ''}</td>
              <td class="text-center">${r.mtpd || ''}</td>
              <td class="text-center fw-bold">${r.rto || ''}</td>
              <td class="text-center">${r.rpo || ''}</td>
              <td>${r.recommendation || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="info-box">
        <p class="fw-bold">คำอธิบายเพิ่มเติม</p>
        <p><strong>ผลกระทบทางการเงิน:</strong> มูลค่าความเสียหายทางการเงินที่อาจเกิดขึ้น หากกระบวนการหยุดชะงัก</p>
        <p><strong>ผลกระทบด้านชื่อเสียง:</strong> ระดับความเสียหายต่อความเชื่อมั่นของลูกค้า (สูง, ปานกลาง, ต่ำ)</p>
        <p><strong>ผลกระทบด้านกฎหมาย:</strong> การละเมิดกฎหมายหรือข้อบังคับที่อาจเกิดขึ้น รวมถึงค่าปรับ</p>
        <p><strong>MTPD:</strong> ระยะเวลาสูงสุดที่ยอมให้ธุรกิจหยุดชะงัก</p>
        <p><strong>RTO:</strong> ระยะเวลาในการกู้คืนระบบ</p>
        <p><strong>RPO:</strong> ระยะเวลาสูงสุดที่ยอมให้ข้อมูลสูญหาย</p>
      </div>

      <div class="budget-box">
        <p class="fw-bold" style="color: #991b1b;">ข้อเสนอแนะ: ต้องการงบประมาณในการปรับปรุงเพื่อลดความเสี่ยงภัยคุกคามไซเบอร์ ดังต่อไปนี้</p>
        ${(budgetRequests || []).map(b => `
          <p style="margin-left: 20px;">• <strong>${b.amount}</strong> ${b.purpose}</p>
        `).join('')}
      </div>

      <h3>5. วันที่ประเมินซ้ำ</h3>
      <p style="margin-left: 20px;">${reEvaluationDate || 'ตามรอบปีงบประมาณ 2570'}</p>

      <h3>6. รายชื่อผู้เข้าร่วมการวิเคราะห์</h3>
      ${(participants || []).map(p => `
        <p style="margin-left: 20px;">• ${p.name} (${p.role})</p>
      `).join('')}

      <br/><br/>
      <table style="border: none; width: 100%; margin-top: 30px;">
        <tr style="border: none;">
          <td style="border: none; width: 50%; text-align: center;">
            <p>ผู้จัดทำรายงาน</p><br/><br/><br/>
            <p>(${signatories?.preparedBy?.name || ''})</p>
            <p>${signatories?.preparedBy?.position || ''}</p>
          </td>
          <td style="border: none; width: 50%; text-align: center;">
            <p>ผู้รับทราบรายงาน (CISO)</p><br/><br/><br/>
            <p>(${signatories?.acknowledgedBy?.name || ''})</p>
            <p>${signatories?.acknowledgedBy?.position || ''}</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `BIA_Report_${header?.reportDate || '2569'}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 5. Supabase Sync Helpers
export async function syncBiaReportsToSupabase(reports) {
  try {
    if (!supabase || !Array.isArray(reports)) return

    // 1. Module state cache
    await supabase.from('cyber_module_states').upsert({
      module_key: 'bia_reports',
      data: reports,
      updated_at: new Date().toISOString()
    })

    // 2. Relational table cyber_bia_reports if available
    const rows = reports.map(r => ({
      id: r.id,
      report_code: r.id,
      report_data: r,
      updated_at: new Date().toISOString()
    }))
    await supabase.from('cyber_bia_reports').upsert(rows)
  } catch (err) {
    console.warn('Supabase sync deferred for BIA Reports:', err.message)
  }
}

export async function fetchBiaReportsFromSupabase() {
  try {
    if (!supabase) return null

    // Check module state first
    const { data: stateData, error: stateErr } = await supabase
      .from('cyber_module_states')
      .select('data')
      .eq('module_key', 'bia_reports')
      .maybeSingle()

    if (!stateErr && Array.isArray(stateData?.data) && stateData.data.length > 0) {
      return stateData.data
    }

    // Otherwise check cyber_bia_reports
    const { data: repData, error: repErr } = await supabase
      .from('cyber_bia_reports')
      .select('*')
      .order('updated_at', { ascending: false })

    if (!repErr && repData && repData.length > 0) {
      return repData.map(r => r.report_data)
    }
  } catch (err) {
    console.warn('Fetch BIA Reports from Supabase deferred:', err.message)
  }
  return null
}

// 6. Event Binder
export function bindBiaReportEvents(el, reports, activeReportId, activeSubTab, biaEvidentItems, onAction) {
  if (!el) return

  const currentReport = reports.find(r => r.id === activeReportId) || reports[0] || DEFAULT_BIA_REPORT_DATA

  // Tab buttons
  el.querySelectorAll('.bia-main-tab-btn').forEach(btn => {
    btn.onclick = () => {
      onAction({ type: 'change_subtab', subtab: btn.dataset.subtab })
    }
  })

  // Version Select
  const selVersion = el.querySelector('#select-bia-report-version')
  if (selVersion) {
    selVersion.onchange = (e) => {
      onAction({ type: 'change_version', reportId: e.target.value })
    }
  }

  // Add Version
  const btnAddVersion = el.querySelector('#btn-add-bia-report-version')
  if (btnAddVersion) {
    btnAddVersion.onclick = () => {
      const year = prompt('กรอกปี พ.ศ. หรือชื่อรอบรายงาน (เช่น 2570 หรือ ฉบับปรับปรุงครั้งที่ 2):')
      if (year && year.trim()) {
        onAction({ type: 'add_version', title: year.trim() })
      }
    }
  }

  // Sync from 1.6
  const btnSyncFrom16 = el.querySelector('#btn-sync-from-1-6')
  if (btnSyncFrom16) {
    btnSyncFrom16.onclick = () => {
      if (confirm('ยืนยันการดึงข้อมูลล่าสุด (Financial Impact, MTPD, RTO, RPO, ผลกระทบชื่อเสียงและกฎหมาย) จาก 1.6 BIA Evident เข้าสู่ตารางรายงานฉบับนี้หรือไม่?')) {
        onAction({ type: 'sync_from_1_6' })
      }
    }
  }

  // Export Word
  const btnWord = el.querySelector('#btn-export-bia-report-word')
  if (btnWord) {
    btnWord.onclick = () => {
      exportBiaReportToWord(currentReport)
      showNotification('ส่งออกไฟล์ Word (.doc) สำเร็จ', 'success')
    }
  }

  // Print
  const btnPrint = el.querySelector('#btn-print-bia-report')
  if (btnPrint) {
    btnPrint.onclick = () => window.print()
  }

  // Header / Field Edits
  el.querySelectorAll('.bia-field-edit').forEach(input => {
    input.onchange = () => {
      const field = input.dataset.field
      const value = input.value
      onAction({ type: 'update_field', field, value })
    }
  })

  // Table Row Edits
  el.querySelectorAll('.bia-row-input').forEach(input => {
    input.onchange = () => {
      const idx = Number(input.dataset.idx)
      const field = input.dataset.field
      const value = input.value
      onAction({ type: 'update_row', idx, field, value })
    }
  })

  // Budget Edits
  el.querySelectorAll('.bia-budget-amount').forEach(input => {
    input.onchange = () => {
      const idx = Number(input.dataset.idx)
      onAction({ type: 'update_budget', idx, field: 'amount', value: input.value })
    }
  })
  el.querySelectorAll('.bia-budget-purpose').forEach(input => {
    input.onchange = () => {
      const idx = Number(input.dataset.idx)
      onAction({ type: 'update_budget', idx, field: 'purpose', value: input.value })
    }
  })
  el.querySelectorAll('.btn-del-budget-row').forEach(btn => {
    btn.onclick = () => {
      const idx = Number(btn.dataset.idx)
      onAction({ type: 'delete_budget', idx })
    }
  })
  const btnAddBudget = el.querySelector('#btn-add-budget-row')
  if (btnAddBudget) {
    btnAddBudget.onclick = () => {
      onAction({ type: 'add_budget' })
    }
  }

  // Participant Edits
  el.querySelectorAll('.bia-part-name').forEach(input => {
    input.onchange = () => {
      const idx = Number(input.dataset.idx)
      onAction({ type: 'update_participant', idx, field: 'name', value: input.value })
    }
  })
  el.querySelectorAll('.bia-part-role').forEach(input => {
    input.onchange = () => {
      const idx = Number(input.dataset.idx)
      onAction({ type: 'update_participant', idx, field: 'role', value: input.value })
    }
  })
  el.querySelectorAll('.btn-del-part-row').forEach(btn => {
    btn.onclick = () => {
      const idx = Number(btn.dataset.idx)
      onAction({ type: 'delete_participant', idx })
    }
  })
  const btnAddPart = el.querySelector('#btn-add-participant-row')
  if (btnAddPart) {
    btnAddPart.onclick = () => {
      onAction({ type: 'add_participant' })
    }
  }

  // PDF Tab: Add Link
  const btnAddPdf = el.querySelector('#btn-add-bia-pdf-link')
  if (btnAddPdf) {
    btnAddPdf.onclick = () => {
      const labelInput = el.querySelector('#input-bia-pdf-label')
      const urlInput = el.querySelector('#input-bia-pdf-url')
      const label = labelInput?.value.trim()
      let url = urlInput?.value.trim()

      if (!label || !url) {
        alert('กรุณากรอกทั้งชื่อเอกสารและ URL / ลิงก์ Google Drive')
        return
      }
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      onAction({ type: 'add_pdf_link', label, url })
    }
  }

  // PDF Tab: Del Link
  el.querySelectorAll('.btn-del-bia-pdf').forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id)
      if (confirm('ยืนยันการลบเอกสารแนบ PDF นี้หรือไม่?')) {
        onAction({ type: 'delete_pdf_link', id })
      }
    }
  })
}
