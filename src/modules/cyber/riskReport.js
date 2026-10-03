import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import { showNotification } from '../../lib/utils.js'

export const DEFAULT_RISK_REPORT_DATA = {
  id: 'report_default_2569',
  versionTitle: 'รายงานประจำปี พ.ศ. 2569 (24 ก.พ. 2569)',
  createdAt: '2569-02-24',
  header: {
    agencyName: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
    reportTitle: 'รายงานการประเมินความเสี่ยงไซเบอร์ (Cybersecurity Risk Assessment Report)',
    evalDate: '24 กุมภาพันธ์ 2569',
    author: 'นายธนกฤต นิธิตันติปัญญา',
    systemName: 'Critical Core Application เช่น Website, ERP'
  },
  summary: {
    evalDate: '24 กุมภาพันธ์ 2569',
    objective: 'การประเมินความเสี่ยงของระบบบริหารจัดการทรัพยากรภายในองค์กร (ERP) และเว็บไซต์',
    evalType: 'การประเมินความเสี่ยงครั้งแรก',
    overallRiskLevel: 'สูง',
    totalRisks: 16,
    lowRisks: 9,
    moderateRisks: 3,
    highRisks: 2
  },
  body: {
    objectives: [
      'ประเมินความเสี่ยงของระบบการประเมินความเสี่ยงของระบบบริหารจัดการทรัพยากรภายในองค์กร (ERP) และเว็บไซต์ ที่เกี่ยวข้องกับความลับ (Confidentiality), ความถูกต้อง (Integrity), และความพร้อมใช้งาน (Availability) ของบุคลากร',
      'ระบุความเสี่ยงที่อาจก่อให้เกิดปัญหากับระบบการประเมินความเสี่ยงของระบบบริหารจัดการทรัพยากรภายในองค์กร (ERP) และเว็บไซต์',
      'ตรวจสอบการใช้มาตรการควบคุมเพื่อปกป้องระบบจากภัยคุกคามไซเบอร์'
    ],
    methodology: {
      modelName: 'ใช้โมเดลความเสี่ยงตาม NIST SP 800-30 Rev. 1 ซึ่งประเมินตามความรุนแรงและโอกาสของความเสี่ยง',
      scoringDesc: 'โดยใช้คะแนนจาก 1 ถึง 5 (1 = ต่ำสุด, 5 = สูงสุด) และคำนวณคะแนนรวมเพื่อประเมินระดับความเสี่ยง',
      detailIntro: 'รายละเอียดความเสี่ยง (Detailed Risk Assessment) ในแต่ละ Cluster (เน้นเฉพาะ Cluster ที่มีระดับความเสี่ยงสูง เป็นหลัก)'
    },
    tableRows: [
      {
        id: 'r_1',
        no: 1,
        riskTitle: 'การโจมตีด้วยมัลแวร์ (Malware Attacks)',
        riskLevel: 'สูง',
        potentialImpact: 'เสี่ยงการโจรกรรมข้อมูลการเงินหรือการเรียกค่าไถ่ (Ransomware) ระบบล่มทำให้สูญเสียรายได้ ข้อมูลลูกค้าหรือผู้ใช้บริการถูกขโมยทำให้สูญเสียความเชื่อมั่น ความน่าเชื่อถือขององค์กรลดลง',
        existingControls: 'ติดตั้ง Firewall เพื่อบล็อกการเข้าถึงเว็บไซต์ที่มีความเสี่ยงสูงและโฆษณาแฝงมัลแวร์ (Malvertising) และอัปเดตฐานข้อมูลเว็บไซต์อันตราย (Blacklist)',
        recommendations: '- ควบคุมการดาวน์โหลดและติดตั้งซอฟต์แวร์ในองค์กร\n- ควบคุมอุปกรณ์สื่อบันทึกข้อมูลภายนอก\n- คัดกรองและเฝ้าระวังไฟล์แนบในอีเมล\n- ส่งเสริมการใช้ซอฟต์แวร์ที่ถูกต้องและสร้างความตระหนัก',
        targetDate: '15 กันยายน 2569'
      },
      {
        id: 'r_2',
        no: 2,
        riskTitle: 'การโจมตีด้วยแรนซัมแวร์ (Ransomware Attacks)',
        riskLevel: 'สูง',
        potentialImpact: 'เสี่ยงการโจรกรรมข้อมูลการเงินหรือการเรียกค่าไถ่ (Ransomware) ระบบล่มทำให้สูญเสียรายได้ ข้อมูลลูกค้าหรือผู้ใช้บริการถูกขโมยทำให้สูญเสียความเชื่อมั่น ความน่าเชื่อถือขององค์กรลดลง',
        existingControls: '- ตรวจสอบและประเมินช่องโหว่ (VA Scan) ของระบบ ก่อนใช้งานจริง\n- สำรองข้อมูลแบบ 3-2-1\n- ติด EDR ในเครื่องที่มีความสำคัญสูง\n- แยกส่วนเครือข่าย (Network Segmentation)',
        recommendations: '- ปรับเปลี่ยนพฤติกรรมเจ้าหน้าที่ลดโอกาสการนำเข้าแรนซัมแวร์ผ่านช่องทางสื่อสารหลัก\n- ทำให้ระบบปฏิบัติการและแอปพลิเคชันเป็นปัจจุบันเสมอ\n- เตรียมเครื่องสำรองข้อมูล (NAS) ที่มีการแยกสิทธิ์การเข้าถึงอย่างเด็ดขาดจากระบบเครือข่ายหลัก',
        targetDate: '15 กันยายน 2569'
      }
    ]
  },
  closing: {
    closingText: 'จึงเรียนมาเพื่อทราบ',
    preparedBy: {
      name: 'นายธนกฤต นิธิตันติปัญญา',
      position: 'Lead Implementer'
    },
    acknowledgedBy: {
      name: 'นายแพทย์อิทธิพล อุดตมะปัญญา',
      position: 'นายแพทย์เชี่ยวชาญ (ด้านเวชกรรมป้องกัน) (CISO)'
    }
  }
}

export function ensureRiskReportPrintStyles() {
  let style = document.getElementById('risk-report-print-style')
  if (!style) {
    style = document.createElement('style')
    style.id = 'risk-report-print-style'
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #risk-report-print-sheet, #risk-report-print-sheet * {
          visibility: visible;
        }
        #risk-report-print-sheet {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 10mm 12mm !important;
          box-shadow: none !important;
          border: none !important;
          background: #fff !important;
        }
        .no-print {
          display: none !important;
        }
        .risk-report-input, .risk-report-textarea {
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          outline: none !important;
          color: #000 !important;
          resize: none !important;
          width: 100% !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
        .table-risk-report {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 12px 0 !important;
          font-size: 13px !important;
        }
        .table-risk-report th, .table-risk-report td {
          border: 1px solid #1e293b !important;
          padding: 8px 10px !important;
          color: #000 !important;
          page-break-inside: avoid !important;
        }
        .table-risk-report th {
          background-color: #f1f5f9 !important;
          font-weight: 700 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-risk-badge {
          border: 1px solid #dc2626 !important;
          color: #dc2626 !important;
          font-weight: 700 !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
        }
        @page {
          size: portrait;
          margin: 12mm 15mm 15mm 15mm;
        }
      }
    `
    document.head.appendChild(style)
  }
}

export function renderRiskReportHtml(activeReport, reportsList = []) {
  ensureRiskReportPrintStyles()
  const data = activeReport || DEFAULT_RISK_REPORT_DATA
  const rows = data.body?.tableRows || []
  const objectives = data.body?.objectives || []

  // Determine badge color for overall risk level
  const riskLvl = (data.summary?.overallRiskLevel || '').trim()
  let badgeStyle = 'background:#fef2f2; color:#dc2626; border:1px solid #fca5a5;'
  if (riskLvl.includes('ปานกลาง') || riskLvl.toLowerCase().includes('medium')) {
    badgeStyle = 'background:#fffbeb; color:#d97706; border:1px solid #fcd34d;'
  } else if (riskLvl.includes('ต่ำ') || riskLvl.toLowerCase().includes('low')) {
    badgeStyle = 'background:#f0fdf4; color:#16a34a; border:1px solid #86efac;'
  } else if (riskLvl.includes('สูงมาก') || riskLvl.toLowerCase().includes('extreme') || riskLvl.toLowerCase().includes('critical')) {
    badgeStyle = 'background:#450a0a; color:#fecaca; border:1px solid #991b1b;'
  }

  return `
    <div style="background:#f1f5f9; min-height:100%; padding:20px 10px;">
      
      <!-- Top Action Toolbar (Hidden during print) -->
      <div class="no-print" style="max-width:960px; margin:0 auto 20px auto; background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:16px 20px; box-shadow:0 2px 8px rgba(0,0,0,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <label style="font-weight:700; font-size:13.5px; color:#1e293b; display:flex; align-items:center; gap:6px; margin:0;">
            <span>📄 ฉบับรายงาน:</span>
            <select id="risk-report-select" style="font-weight:600; color:#1e40af; border:1px solid #93c5fd; padding:6px 12px; border-radius:6px; background:#eff6ff; font-size:13px; cursor:pointer; max-width:280px;">
              ${reportsList.map(r => `
                <option value="${r.id}" ${r.id === data.id ? 'selected' : ''}>
                  ${r.versionTitle || r.header?.evalDate || r.id}
                </option>
              `).join('')}
            </select>
          </label>

          <button id="create-risk-report-btn" class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#2563eb; padding:6px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 2px rgba(0,0,0,0.04);">
            + สร้างรายงานฉบับใหม่
          </button>

          ${reportsList.length > 1 ? `
            <button id="delete-risk-report-btn" class="btn" style="background:#fff; border:1px solid #fecaca; color:#ef4444; padding:6px 10px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
              🗑️ ลบรายงานนี้
            </button>
          ` : ''}

          <span style="display:inline-flex; align-items:center; gap:4px; font-size:11.5px; color:#16a34a; background:#f0fdf4; padding:4px 9px; border-radius:4px; border:1px solid #bbf7d0;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            บันทึกอัตโนมัติ
          </span>
        </div>

        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button id="sync-from-23-stats-btn" class="btn" title="ดึงตัวเลขสถิติความเสี่ยงรวมจากข้อ 2.3 มาใส่ในบทสรุปผู้บริหารอัตโนมัติ" style="background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; padding:7px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            คำนวณสรุปจาก 2.3
          </button>

          <button id="sync-from-23-high-risks-btn" class="btn" title="ดึงรายการความเสี่ยงสูงจากข้อ 2.3 มาลงในตารางรายงานฉบับนี้อัตโนมัติ" style="background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; padding:7px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ซิงค์ข้อเสี่ยงสูงจาก 2.3
          </button>

          <button id="export-risk-report-word-btn" class="btn" style="background:#1d4ed8; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 1px 2px rgba(29,78,216,0.25);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            ส่งออก Word (.doc)
          </button>

          <button id="print-risk-report-btn" class="btn" style="background:#0f172a; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            พิมพ์รายงาน / PDF
          </button>
        </div>
      </div>

      <!-- Printable Report Paper Sheet -->
      <div id="risk-report-print-sheet" style="max-width:960px; margin:0 auto; background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:45px 50px; box-shadow:0 4px 16px rgba(0,0,0,0.06); font-family:'Sarabun', 'TH Sarabun New', -apple-system, sans-serif; color:#1e293b; line-height:1.6;">
        
        <!-- Header Section: Logo & Document Meta -->
        <div style="text-align:center; margin-bottom:28px;">
          <img src="${LOGO_MOPH_BASE64}" alt="ตรากระทรวงสาธารณสุข" style="width:78px; height:78px; object-fit:contain; margin-bottom:12px; display:inline-block;" />
          
          <div style="margin-bottom:6px;">
            <input type="text" class="risk-report-input" data-path="header.agencyName" value="${data.header?.agencyName || ''}" placeholder="ชื่อหน่วยงาน (เช่น สำนักงานสาธารณสุขจังหวัดสระแก้ว)" style="text-align:center; font-size:18px; font-weight:700; color:#0f172a; width:100%; border:1px dashed #cbd5e1; border-radius:6px; padding:4px 8px;">
          </div>

          <div style="margin-bottom:16px;">
            <textarea rows="2" class="risk-report-textarea" data-path="header.reportTitle" placeholder="ชื่อรายงานการประเมินความเสี่ยงไซเบอร์" style="text-align:center; font-size:20px; font-weight:800; color:#1e3a8a; width:100%; border:1px dashed #cbd5e1; border-radius:6px; padding:6px 8px; resize:none;">${data.header?.reportTitle || ''}</textarea>
          </div>

          <!-- Metadata Box -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px 18px; text-align:left; font-size:14px; max-width:680px; margin:0 auto; display:grid; grid-template-columns:130px 1fr; gap:8px 12px; align-items:center;">
            <strong style="color:#475569;">วันที่ทำประเมิน :</strong>
            <input type="text" class="risk-report-input" data-path="header.evalDate" value="${data.header?.evalDate || ''}" placeholder="เช่น 24 กุมภาพันธ์ 2569" style="font-size:14px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px;">

            <strong style="color:#475569;">ผู้จัดทำรายงาน :</strong>
            <input type="text" class="risk-report-input" data-path="header.author" value="${data.header?.author || ''}" placeholder="เช่น นายธนกฤต นิธิตันติปัญญา" style="font-size:14px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px;">

            <strong style="color:#475569;">ชื่อระบบ :</strong>
            <input type="text" class="risk-report-input" data-path="header.systemName" value="${data.header?.systemName || ''}" placeholder="เช่น Critical Core Application เช่น Website, ERP" style="font-size:14px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px;">
          </div>
        </div>

        <div style="border-top:2px solid #e2e8f0; margin:24px 0;"></div>

        <!-- Section 1: Executive Summary -->
        <div style="margin-bottom:30px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h2 style="font-size:17.5px; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:8px;">
              <span style="width:10px; height:10px; background:#2563eb; border-radius:50%; display:inline-block;"></span>
              1. สรุปสำหรับผู้บริหาร (Executive Summary)
            </h2>
            <button id="inner-sync-stats-btn" class="no-print btn" style="font-size:12px; padding:4px 9px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; border-radius:5px; cursor:pointer;">
              🔄 ดึงตัวเลขจาก 2.3
            </button>
          </div>

          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:16px 20px; font-size:14px;">
            <div style="margin-bottom:8px; display:flex; align-items:center; gap:10px;">
              <strong style="width:160px; flex-shrink:0; color:#475569;">วันที่ทำการประเมิน :</strong>
              <input type="text" class="risk-report-input" data-path="summary.evalDate" value="${data.summary?.evalDate || ''}" placeholder="เช่น 24 กุมภาพันธ์ 2569" style="flex:1; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px;">
            </div>

            <div style="margin-bottom:8px; display:flex; align-items:flex-start; gap:10px;">
              <strong style="width:160px; flex-shrink:0; color:#475569; margin-top:4px;">วัตถุประสงค์ :</strong>
              <textarea rows="2" class="risk-report-textarea" data-path="summary.objective" placeholder="ระบุวัตถุประสงค์ของรายงานสรุป" style="flex:1; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px; resize:none;">${data.summary?.objective || ''}</textarea>
            </div>

            <div style="margin-bottom:8px; display:flex; align-items:center; gap:10px;">
              <strong style="width:160px; flex-shrink:0; color:#475569;">ประเภทของการประเมิน :</strong>
              <input type="text" class="risk-report-input" data-path="summary.evalType" value="${data.summary?.evalType || ''}" placeholder="เช่น การประเมินความเสี่ยงครั้งแรก หรือ ประจำปี 2569" style="flex:1; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px;">
            </div>

            <div style="margin-bottom:12px; display:flex; align-items:center; gap:10px;">
              <strong style="width:160px; flex-shrink:0; color:#475569;">ระดับความเสี่ยงโดยรวม :</strong>
              <div style="display:flex; align-items:center; gap:10px; flex:1;">
                <input type="text" class="risk-report-input" data-path="summary.overallRiskLevel" value="${data.summary?.overallRiskLevel || ''}" placeholder="เช่น สูง, ปานกลาง, ต่ำ" style="width:140px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px; font-weight:700;">
                <span class="print-risk-badge" style="${badgeStyle} font-size:12.5px; font-weight:700; padding:3px 10px; border-radius:12px;">
                  ระดับ: ${data.summary?.overallRiskLevel || 'สูง'}
                </span>
              </div>
            </div>

            <!-- Risk counts pills -->
            <div style="margin-top:14px; padding-top:14px; border-top:1px dashed #e2e8f0; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px 14px; text-align:center;">
                <div style="color:#64748b; font-size:12px; font-weight:600;">ความเสี่ยงที่ระบุทั้งหมด</div>
                <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:4px;">
                  <input type="number" class="risk-report-input" data-path="summary.totalRisks" value="${data.summary?.totalRisks ?? 0}" style="font-size:18px; font-weight:800; color:#1e293b; width:65px; text-align:center; border:1px dashed #cbd5e1; border-radius:4px; padding:2px;">
                  <span style="font-size:13px; color:#64748b;">รายการ</span>
                </div>
              </div>

              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:10px 14px; text-align:center;">
                <div style="color:#16a34a; font-size:12px; font-weight:600;">ความเสี่ยงต่ำ (ยอมรับได้)</div>
                <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:4px;">
                  <input type="number" class="risk-report-input" data-path="summary.lowRisks" value="${data.summary?.lowRisks ?? 0}" style="font-size:18px; font-weight:800; color:#16a34a; width:65px; text-align:center; border:1px dashed #86efac; border-radius:4px; padding:2px;">
                  <span style="font-size:13px; color:#16a34a;">รายการ</span>
                </div>
              </div>

              <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:10px 14px; text-align:center;">
                <div style="color:#d97706; font-size:12px; font-weight:600;">ความเสี่ยงปานกลาง</div>
                <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:4px;">
                  <input type="number" class="risk-report-input" data-path="summary.moderateRisks" value="${data.summary?.moderateRisks ?? 0}" style="font-size:18px; font-weight:800; color:#d97706; width:65px; text-align:center; border:1px dashed #fcd34d; border-radius:4px; padding:2px;">
                  <span style="font-size:13px; color:#d97706;">รายการ</span>
                </div>
              </div>

              <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:10px 14px; text-align:center;">
                <div style="color:#dc2626; font-size:12px; font-weight:600;">ความเสี่ยงสูง / สูงมาก</div>
                <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:4px;">
                  <input type="number" class="risk-report-input" data-path="summary.highRisks" value="${data.summary?.highRisks ?? 0}" style="font-size:18px; font-weight:800; color:#dc2626; width:65px; text-align:center; border:1px dashed #fca5a5; border-radius:4px; padding:2px;">
                  <span style="font-size:13px; color:#dc2626;">รายการ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0; margin:24px 0;"></div>

        <!-- Section 2: Body of the Report -->
        <div style="margin-bottom:30px;">
          <h2 style="font-size:17.5px; font-weight:800; color:#0f172a; margin:0 0 16px 0; display:flex; align-items:center; gap:8px;">
            <span style="width:10px; height:10px; background:#2563eb; border-radius:50%; display:inline-block;"></span>
            2. รายละเอียดของรายงาน (Body of the Report)
          </h2>

          <!-- 2.1 Objectives -->
          <div style="margin-bottom:20px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:16px 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h3 style="font-size:15px; font-weight:700; color:#1e293b; margin:0;">
                2.1 วัตถุประสงค์ของการประเมินความเสี่ยง
              </h3>
              <button id="add-objective-item-btn" class="no-print btn" style="font-size:11.5px; padding:3px 8px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px; color:#2563eb; cursor:pointer;">
                + เพิ่มวัตถุประสงค์
              </button>
            </div>

            <div id="objectives-list-container" style="display:flex; flex-direction:column; gap:8px;">
              ${objectives.map((objText, oIdx) => `
                <div style="display:flex; align-items:flex-start; gap:8px;">
                  <span style="font-weight:700; font-size:14px; margin-top:4px; width:22px; color:#475569;">${oIdx + 1}.</span>
                  <textarea rows="2" class="risk-report-textarea objective-input" data-index="${oIdx}" placeholder="ระบุข้อความวัตถุประสงค์..." style="flex:1; font-size:13.5px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px; resize:none;">${objText}</textarea>
                  ${objectives.length > 1 ? `
                    <button class="delete-objective-btn no-print" data-index="${oIdx}" title="ลบข้อนี้" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:14px; margin-top:4px; padding:0 4px;">✕</button>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 2.2 Methodology -->
          <div style="margin-bottom:20px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:16px 20px;">
            <h3 style="font-size:15px; font-weight:700; color:#1e293b; margin:0 0 10px 0;">
              2.2 โมเดลความเสี่ยงและวิธีการประเมิน
            </h3>

            <div style="margin-bottom:8px;">
              <textarea rows="2" class="risk-report-textarea" data-path="body.methodology.modelName" placeholder="ระบุโมเดลมาตรฐานที่ใช้อ้างอิง (เช่น NIST SP 800-30 Rev. 1)" style="font-size:13.5px; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px; resize:none;">${data.body?.methodology?.modelName || ''}</textarea>
            </div>

            <div style="margin-bottom:8px;">
              <textarea rows="2" class="risk-report-textarea" data-path="body.methodology.scoringDesc" placeholder="ระบุเกณฑ์การคำนวณคะแนนระดับความเสี่ยง" style="font-size:13.5px; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px; resize:none;">${data.body?.methodology?.scoringDesc || ''}</textarea>
            </div>

            <div>
              <textarea rows="2" class="risk-report-textarea" data-path="body.methodology.detailIntro" placeholder="ข้อความแนะนำตารางความเสี่ยง (เน้นเฉพาะ Cluster ที่มีความเสี่ยงสูง)" style="font-size:13.5px; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px; resize:none; font-weight:600; color:#b91c1c;">${data.body?.methodology?.detailIntro || ''}</textarea>
            </div>
          </div>

          <!-- 2.3 Detailed Risk Assessment Table -->
          <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h3 style="font-size:15px; font-weight:700; color:#1e293b; margin:0;">
                ตารางรายละเอียดความเสี่ยง (Detailed Risk Assessment)
              </h3>
              
              <div class="no-print" style="display:flex; gap:8px;">
                <button id="add-risk-table-row-btn" class="btn" style="font-size:12px; padding:4px 10px; background:#f0fdf4; border:1px solid #bbf7d0; color:#16a34a; border-radius:5px; font-weight:600; cursor:pointer;">
                  + เพิ่มแถวความเสี่ยง
                </button>
                <button id="sync-table-high-btn" class="btn" style="font-size:12px; padding:4px 10px; background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; border-radius:5px; font-weight:600; cursor:pointer;">
                  🔄 นำเข้าข้อเสี่ยงสูงจาก 2.3
                </button>
              </div>
            </div>

            <!-- Responsive Table Wrapper -->
            <div style="overflow-x:auto;">
              <table class="table-risk-report" style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border:1px solid #cbd5e1;">
                <thead>
                  <tr style="background:#f8fafc; color:#1e293b; border-bottom:2px solid #cbd5e1;">
                    <th style="width:40px; text-align:center; padding:10px 6px; border:1px solid #cbd5e1;">#</th>
                    <th style="width:180px; text-align:left; padding:10px 8px; border:1px solid #cbd5e1;">ความเสี่ยง</th>
                    <th style="width:85px; text-align:center; padding:10px 6px; border:1px solid #cbd5e1;">ระดับความเสี่ยง</th>
                    <th style="width:200px; text-align:left; padding:10px 8px; border:1px solid #cbd5e1;">ผลกระทบที่อาจเกิดขึ้น</th>
                    <th style="width:200px; text-align:left; padding:10px 8px; border:1px solid #cbd5e1;">การควบคุมที่มีอยู่ปัจจุบัน</th>
                    <th style="width:210px; text-align:left; padding:10px 8px; border:1px solid #cbd5e1;">คำแนะนำเพิ่มเติม</th>
                    <th style="width:110px; text-align:center; padding:10px 6px; border:1px solid #cbd5e1;">คาดว่าจะเสร็จสิ้น</th>
                    <th class="no-print" style="width:40px; text-align:center; padding:10px 4px; border:1px solid #cbd5e1;">จัดการ</th>
                  </tr>
                </thead>
                <tbody id="risk-table-body">
                  ${rows.length === 0 ? `
                    <tr>
                      <td colspan="8" style="text-align:center; padding:24px; color:#94a3b8; font-size:13px;">
                        ยังไม่มีรายการความเสี่ยงในตารางนี้ สามารถกด <strong>+ เพิ่มแถวความเสี่ยง</strong> หรือ <strong>ซิงค์ข้อเสี่ยงสูงจาก 2.3</strong>
                      </td>
                    </tr>
                  ` : rows.map((r, idx) => `
                    <tr style="border-bottom:1px solid #e2e8f0; vertical-align:top;">
                      <td style="text-align:center; padding:8px 6px; border:1px solid #e2e8f0; font-weight:700;">
                        ${idx + 1}
                      </td>

                      <td style="padding:6px; border:1px solid #e2e8f0;">
                        <textarea rows="3" class="risk-report-textarea risk-row-input" data-index="${idx}" data-field="riskTitle" placeholder="ระบุความเสี่ยง / Cluster" style="width:100%; font-size:12.5px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 6px; resize:vertical; font-weight:600; color:#0f172a;">${r.riskTitle || ''}</textarea>
                      </td>

                      <td style="text-align:center; padding:6px; border:1px solid #e2e8f0;">
                        <input type="text" class="risk-report-input risk-row-input" data-index="${idx}" data-field="riskLevel" value="${r.riskLevel || 'สูง'}" placeholder="สูง / ปานกลาง" style="width:100%; text-align:center; font-size:12.5px; font-weight:700; color:#dc2626; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 2px;">
                      </td>

                      <td style="padding:6px; border:1px solid #e2e8f0;">
                        <textarea rows="4" class="risk-report-textarea risk-row-input" data-index="${idx}" data-field="potentialImpact" placeholder="ระบุผลกระทบที่อาจเกิดขึ้น..." style="width:100%; font-size:12px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 6px; resize:vertical;">${r.potentialImpact || ''}</textarea>
                      </td>

                      <td style="padding:6px; border:1px solid #e2e8f0;">
                        <textarea rows="4" class="risk-report-textarea risk-row-input" data-index="${idx}" data-field="existingControls" placeholder="ระบุการควบคุมปัจจุบัน..." style="width:100%; font-size:12px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 6px; resize:vertical;">${r.existingControls || ''}</textarea>
                      </td>

                      <td style="padding:6px; border:1px solid #e2e8f0;">
                        <textarea rows="4" class="risk-report-textarea risk-row-input" data-index="${idx}" data-field="recommendations" placeholder="ระบุคำแนะนำ / มาตรการจัดการ..." style="width:100%; font-size:12px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 6px; resize:vertical;">${r.recommendations || ''}</textarea>
                      </td>

                      <td style="text-align:center; padding:6px; border:1px solid #e2e8f0;">
                        <input type="text" class="risk-report-input risk-row-input" data-index="${idx}" data-field="targetDate" value="${r.targetDate || ''}" placeholder="เช่น 15 ก.ย. 69" style="width:100%; text-align:center; font-size:12px; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 2px;">
                      </td>

                      <td class="no-print" style="text-align:center; padding:6px; border:1px solid #e2e8f0; vertical-align:middle;">
                        <button class="delete-risk-row-btn" data-index="${idx}" title="ลบแถวนี้" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:14px; padding:4px;">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0; margin:30px 0 20px 0;"></div>

        <!-- Section 3: Closing & Signatures -->
        <div style="margin-top:20px;">
          <div style="margin-bottom:24px;">
            <input type="text" class="risk-report-input" data-path="closing.closingText" value="${data.closing?.closingText || 'จึงเรียนมาเพื่อทราบ'}" placeholder="ข้อความปิดท้าย เช่น จึงเรียนมาเพื่อทราบ" style="font-size:15px; font-weight:600; color:#1e293b; border:1px dashed #cbd5e1; border-radius:4px; padding:4px 8px; width:100%;">
          </div>

          <!-- Sign-off Grid -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:28px;">
            
            <!-- Prepared By -->
            <div style="text-align:center;">
              <div style="margin-bottom:12px; color:#475569; font-size:13.5px; font-weight:600;">
                ลงชื่อ ผู้จัดทำ :
              </div>
              <div style="border-bottom:1px dotted #94a3b8; width:220px; margin:40px auto 10px auto;"></div>
              
              <div style="margin-bottom:4px;">
                <input type="text" class="risk-report-input" data-path="closing.preparedBy.name" value="${data.closing?.preparedBy?.name || ''}" placeholder="ชื่อ-สกุล ผู้จัดทำ" style="text-align:center; font-size:14px; font-weight:600; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:2px 4px;">
              </div>

              <div>
                <input type="text" class="risk-report-input" data-path="closing.preparedBy.position" value="${data.closing?.preparedBy?.position || ''}" placeholder="ตำแหน่ง (เช่น Lead Implementer)" style="text-align:center; font-size:13px; color:#64748b; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:2px 4px;">
              </div>
            </div>

            <!-- Acknowledged By -->
            <div style="text-align:center;">
              <div style="margin-bottom:12px; color:#475569; font-size:13.5px; font-weight:600;">
                รับทราบ :
              </div>
              <div style="border-bottom:1px dotted #94a3b8; width:220px; margin:40px auto 10px auto;"></div>
              
              <div style="margin-bottom:4px;">
                <input type="text" class="risk-report-input" data-path="closing.acknowledgedBy.name" value="${data.closing?.acknowledgedBy?.name || ''}" placeholder="ชื่อ-สกุล ผู้บริหาร / CISO" style="text-align:center; font-size:14px; font-weight:600; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:2px 4px;">
              </div>

              <div>
                <input type="text" class="risk-report-input" data-path="closing.acknowledgedBy.position" value="${data.closing?.acknowledgedBy?.position || ''}" placeholder="ตำแหน่ง (เช่น นายแพทย์เชี่ยวชาญ CISO)" style="text-align:center; font-size:13px; color:#64748b; width:100%; border:1px dashed #cbd5e1; border-radius:4px; padding:2px 4px;">
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
}

export function exportRiskReportToWord(reportData) {
  const data = reportData || DEFAULT_RISK_REPORT_DATA
  const rows = data.body?.tableRows || []
  const objectives = data.body?.objectives || []

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${data.header?.reportTitle || 'Cybersecurity Risk Assessment Report'}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 21.0cm 29.7cm; /* A4 */
          margin: 2.5cm 2.0cm 2.0cm 2.0cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'TH Sarabun New', 'Sarabun', 'Angsana New', sans-serif;
          font-size: 16pt;
          line-height: 1.25;
          color: #000;
        }
        h1 {
          font-size: 18pt;
          font-weight: bold;
          text-align: center;
          margin: 4pt 0 10pt 0;
        }
        h2 {
          font-size: 16pt;
          font-weight: bold;
          margin: 12pt 0 4pt 0;
        }
        h3 {
          font-size: 16pt;
          font-weight: bold;
          margin: 8pt 0 4pt 0;
        }
        p, div {
          margin: 2pt 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 10pt 0;
        }
        th, td {
          border: 1pt solid #000;
          padding: 5pt 7pt;
          vertical-align: top;
          font-size: 14pt;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-align: center;
        }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        .header-logo {
          text-align: center;
          margin-bottom: 8pt;
        }
        .header-meta {
          margin: 8pt 0 16pt 0;
          font-size: 16pt;
        }
        .divider {
          border-bottom: 1pt solid #000;
          margin: 12pt 0;
        }
      </style>
    </head>
    <body>
      <div class="header-logo">
        <img src="${LOGO_MOPH_BASE64}" width="75" height="75" alt="ตรากระทรวงสาธารณสุข" />
      </div>

      <div class="text-center bold" style="font-size:18pt; margin-bottom:4pt;">
        ${data.header?.agencyName || 'สำนักงานสาธารณสุขจังหวัดสระแก้ว'}
      </div>

      <h1>${data.header?.reportTitle || 'รายงานการประเมินความเสี่ยงไซเบอร์ (Cybersecurity Risk Assessment Report)'}</h1>

      <div class="header-meta">
        <div><span class="bold">วันที่ทำประเมิน :</span> ${data.header?.evalDate || ''}</div>
        <div><span class="bold">ผู้จัดทำรายงาน :</span> ${data.header?.author || ''}</div>
        <div><span class="bold">ชื่อระบบ :</span> ${data.header?.systemName || ''}</div>
      </div>

      <div class="divider"></div>

      <h2>1. สรุปสำหรับผู้บริหาร (Executive Summary)</h2>
      <div><span class="bold">วันที่ทำการประเมิน :</span> ${data.summary?.evalDate || ''}</div>
      <div><span class="bold">วัตถุประสงค์ :</span> ${data.summary?.objective || ''}</div>
      <div><span class="bold">ประเภทของการประเมิน :</span> ${data.summary?.evalType || ''}</div>
      <div><span class="bold">ระดับความเสี่ยงโดยรวม :</span> ระดับความเสี่ยงโดยรวมถูกประเมินว่าอยู่ในระดับ <span class="bold" style="color:#cc0000;">${data.summary?.overallRiskLevel || 'สูง'}</span></div>
      <div><span class="bold">จำนวนความเสี่ยงที่ระบุทั้งหมด :</span> ${data.summary?.totalRisks ?? 0} รายการ</div>
      <div><span class="bold">ความเสี่ยงที่ยอมรับได้ (ความเสี่ยงต่ำ) :</span> ${data.summary?.lowRisks ?? 0} รายการ</div>
      <div><span class="bold">ความเสี่ยงปานกลาง:</span> ${data.summary?.moderateRisks ?? 0} รายการ</div>
      <div><span class="bold">ความเสี่ยงสูง:</span> ${data.summary?.highRisks ?? 0} รายการ</div>

      <div class="divider"></div>

      <h2>2. รายละเอียดของรายงาน (Body of the Report)</h2>
      <h3>2.1 วัตถุประสงค์ของการประเมินความเสี่ยง</h3>
      ${objectives.map((obj, idx) => `
        <div style="margin-left:15pt;">${idx + 1}. ${obj}</div>
      `).join('')}

      <h3>2.2 โมเดลความเสี่ยงและวิธีการประเมิน</h3>
      <p>${data.body?.methodology?.modelName || ''}</p>
      <p>${data.body?.methodology?.scoringDesc || ''}</p>
      <p class="bold" style="margin-top:6pt;">${data.body?.methodology?.detailIntro || ''}</p>

      <table>
        <thead>
          <tr>
            <th style="width:30pt;"></th>
            <th style="width:110pt;">ความเสี่ยง</th>
            <th style="width:55pt;">ระดับความ เสี่ยง</th>
            <th style="width:130pt;">ผลกระทบที่อาจ เกิดขึ้น</th>
            <th style="width:130pt;">การควบคุมที่มีอยู่ปัจจุบัน</th>
            <th style="width:140pt;">คำแนะนำเพิ่มเติม</th>
            <th style="width:75pt;">คาดว่าจะ เสร็จสิ้น</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, idx) => `
            <tr>
              <td class="text-center bold">${idx + 1}</td>
              <td class="bold">${(r.riskTitle || '').replace(/\n/g, '<br/>')}</td>
              <td class="text-center bold" style="color:#cc0000;">${r.riskLevel || 'สูง'}</td>
              <td>${(r.potentialImpact || '').replace(/\n/g, '<br/>')}</td>
              <td>${(r.existingControls || '').replace(/\n/g, '<br/>')}</td>
              <td>${(r.recommendations || '').replace(/\n/g, '<br/>')}</td>
              <td class="text-center">${r.targetDate || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top:20pt;">
        <p>${data.closing?.closingText || 'จึงเรียนมาเพื่อทราบ'}</p>
      </div>

      <table style="border:none; margin-top:30pt; width:100%;">
        <tr style="border:none;">
          <td style="border:none; width:50%; text-align:left; vertical-align:top; font-size:16pt;">
            <p>ลงชื่อ ผู้จัดทำ : &nbsp;&nbsp;&nbsp;&nbsp; ${data.closing?.preparedBy?.name || ''} ${data.closing?.preparedBy?.position || ''}</p>
          </td>
          <td style="border:none; width:50%; text-align:left; vertical-align:top; font-size:16pt;">
            <p>รับทราบ :</p>
            <p style="margin-left:45pt;">${data.closing?.acknowledgedBy?.name || ''}</p>
            <p style="margin-left:45pt;">ตำแหน่ง ${data.closing?.acknowledgedBy?.position || ''}</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const safeAgencyName = (data.header?.agencyName || 'หน่วยงาน').replace(/[\s\/\:*?"<>|]/g, '_')
  a.href = url
  a.download = `Risk_Report_${safeAgencyName}_2569.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showNotification('ส่งออกไฟล์ Word (.doc) เรียบร้อยแล้ว', 'success')
}

// Bind events and state management
export function bindRiskReportEvents(containerEl, activeReport, riskAssessmentState, onUpdate) {
  // 1. Report Selector
  document.getElementById('risk-report-select')?.addEventListener('change', (e) => {
    onUpdate({ type: 'select_report', reportId: e.target.value })
  })

  // 2. Create New Report
  document.getElementById('create-risk-report-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'create_report' })
  })

  // 3. Delete Current Report
  document.getElementById('delete-risk-report-btn')?.addEventListener('click', () => {
    if (confirm('คุณต้องการลบรายงานการประเมินความเสี่ยงฉบับนี้ใช่หรือไม่?')) {
      onUpdate({ type: 'delete_report', reportId: activeReport.id })
    }
  })

  // 4. Print / PDF
  document.getElementById('print-risk-report-btn')?.addEventListener('click', () => {
    window.print()
  })

  // 5. Export Word
  document.getElementById('export-risk-report-word-btn')?.addEventListener('click', () => {
    exportRiskReportToWord(activeReport)
  })

  // 6. Sync from 2.3 Stats (Toolbar & Inner button)
  const triggerSyncStats = () => {
    onUpdate({ type: 'sync_from_23_stats' })
  }
  document.getElementById('sync-from-23-stats-btn')?.addEventListener('click', triggerSyncStats)
  document.getElementById('inner-sync-stats-btn')?.addEventListener('click', triggerSyncStats)

  // 7. Sync from 2.3 High Risks (Toolbar & Table button)
  const triggerSyncHighRisks = () => {
    if (confirm('ระบบจะดึงรายการที่มีระดับความเสี่ยงสูง (High / Very High) จากข้อ 2.3 เข้ามาใส่ในตารางรายงานฉบับนี้ คุณต้องการดำเนินการต่อหรือไม่?')) {
      onUpdate({ type: 'sync_from_23_high_risks' })
    }
  }
  document.getElementById('sync-from-23-high-risks-btn')?.addEventListener('click', triggerSyncHighRisks)
  document.getElementById('sync-table-high-btn')?.addEventListener('click', triggerSyncHighRisks)

  // 8. General Field Inputs (Path-based binding)
  containerEl.querySelectorAll('.risk-report-input[data-path], .risk-report-textarea[data-path]').forEach(input => {
    input.addEventListener('change', (e) => {
      const path = e.target.dataset.path
      let val = e.target.value
      if (e.target.type === 'number') {
        val = Number(val) || 0
      }
      onUpdate({ type: 'update_field', path, value: val })
    })
  })

  // 9. Objectives Manipulation
  containerEl.querySelectorAll('.objective-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.index)
      onUpdate({ type: 'update_objective', index: idx, value: e.target.value })
    })
  })

  containerEl.querySelectorAll('.delete-objective-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.index)
      onUpdate({ type: 'delete_objective', index: idx })
    })
  })

  document.getElementById('add-objective-item-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'add_objective' })
  })

  // 10. Table Rows Manipulation
  document.getElementById('add-risk-table-row-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'add_table_row' })
  })

  containerEl.querySelectorAll('.risk-row-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.index)
      const field = e.target.dataset.field
      onUpdate({ type: 'update_table_row', index: idx, field, value: e.target.value })
    })
  })

  containerEl.querySelectorAll('.delete-risk-row-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.index)
      if (confirm(`คุณต้องการลบรายการความเสี่ยงลำดับที่ ${idx + 1} ใช่หรือไม่?`)) {
        onUpdate({ type: 'delete_table_row', index: idx })
      }
    })
  })
}
