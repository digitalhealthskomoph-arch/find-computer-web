import { LOGO_MOPH_BASE64 } from './logoMophBase64.js'
import { showNotification } from '../../lib/utils.js'

export const AUDIT_AGENCIES = [
  'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  'โรงพยาบาลสมเด็จพระยุพราชสระแก้ว',
  'โรงพยาบาลอรัญประเทศ',
  'โรงพยาบาลวัฒนานคร',
  'โรงพยาบาลเขาฉกรรจ์',
  'โรงพยาบาลวังน้ำเย็น',
  'โรงพยาบาลวังสมบูรณ์',
  'โรงพยาบาลคลองหาด',
  'โรงพยาบาลโคกสูง',
  'โรงพยาบาลตาพระยา'
]

export const DEFAULT_AUDIT_REPORT_SKO = {
  agency: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  agencyType: 'CII | Regulator | Gov',
  auditDate: 'วันที่ 23 - 27 กุมภาพันธ์ 2569',
  auditors: [
    '1.  นายปิยะณัฐ วิเชียร',
    '2. นางสาวสุเนตร บัลลือพรมราชน์',
    '3. นายสมบัติ พึ่งเกษม',
    '4. นางธัญวรัตน์ เจริญจิตต์',
    '5. นายพิชิตชัย เชิดชู',
    '6. นางสาวสุธาทิพย์ ปริญญวัฒน์',
    '7. นายจิระเดช ช่างสาย'
  ],
  objective: 'เพื่อแน่ใจว่าสำนักงานสาธารณสุขจังหวัดสระแก้ว ได้ปฏิบัติตาม พรบ ไซเบอร์ 2562 และกฎหมายลำดับรอง 15 ฉบับ',
  scope: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  criteria: 'พรบ ไซเบอร์ 2562 และกฎหมายลำดับรอง 15 ฉบับ',
  prevAudit: 'ประเมินล่าสุดเมื่อเดือนธันวาคม 2566, อ้างอิงถึงเอกสาร ประเมิน-001 :  รายงานการตรวจสอบด้านความมั่นคงปลอดภัยไซเบอร์ (Audit Report) , ดูเอกสารแนบท้าย',
  summaryStatus: 'ผ่านการประเมินโดยรวม',
  tableRows: [
    { num: '1', title: 'พรบ ไซเบอร์ 2562', fullScore: 12, result: 'S', score: 12, isHeader: false, isSub: false },
    { num: '2', title: 'นโยบายฯ ไซเบอร์แห่งชาติ (2565-2570)', fullScore: 13, result: 'S', score: 13, isHeader: false, isSub: false },
    { num: '3', title: 'ประมวลแนวทางปฏิบัติและกรอบมาตรฐาน', fullScore: 73, result: '2 NC', score: 71, isHeader: false, isSub: false },
    { num: '3.1', title: 'ประมวลแนวทางปฏิบัติ', fullScore: '', result: '', score: '', isHeader: true, isSub: false },
    { num: '3.1.1', title: 'แผนการตรวจสอบ', fullScore: '', result: 'O (1)', score: '', isHeader: false, isSub: true },
    { num: '3.1.2', title: 'การประเมินความเสี่ยง', fullScore: '', result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.1.3', title: 'แผนการรับมือภัยคุกคามทางไซเบอร์', fullScore: '', result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2', title: 'กรอบมาตรฐาน', fullScore: '', result: '', score: '', isHeader: true, isSub: false },
    { num: '3.2.1', title: 'Govern', fullScore: '', result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.2', title: 'Identify', fullScore: '', result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.3', title: 'Protect', fullScore: '', result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.4', title: 'Detect', fullScore: '', result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.5', title: 'Respond', fullScore: '', result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.6', title: 'Recover', fullScore: '', result: 'O (1)', score: '', isHeader: false, isSub: true }
  ],
  strongPoints: '1. หน่วยงานดังกล่าวได้มีการจัดทำเอกสารต่างๆ โดยรวมได้เป็นอย่างดี ตรงตามที่ พรบ ไซเบอร์ ได้กำหนดไว้\n2. โดยส่วนมาก บุคลากรที่ได้รับการสัมภาษณ์มีความรู้ในส่วนที่เกี่ยวข้องได้ดี',
  weakPoints: [
    {
      id: 1,
      controlText: 'Domain 3 : ประมวลและกรอบฯ | แผนการตรวจสอบ | ข้อ 17.1',
      objective: 'ต้องมีการตรวจสอบด้านความมั่นคงปลอดภัยไซเบอร์ โดยผู้ตรวจสอบด้านความมั่นคงปลอดภัยสารสนเทศทั้งโดยผู้ตรวจสอบภายใน หรือผู้ตรวจสอบอิสระภายนอก อย่างน้อยปีละ 1 ครั้ง',
      methodInterview: 'สัมภาษณ์ผู้ตรวจสอบภายใน',
      methodReview: 'ร้องขอดูเอกสารรายงานการตรวจสอบ',
      methodObserve: '',
      auditorProcess: 'ทางผู้ตรวจสอบ ได้ดำเนินการตรวจสอบเอกสารและบันทึกการรายงานต่างๆ รวมถึงการสัมภาษณ์ผู้ที่เกี่ยวข้อง ตามหลักการณ์ ISO 19011 พบว่าไม่มีหลักฐานในการทำการตรวจสอบภายใน ภายในปี ตามที่ระบุไว้',
      evalResult: 'ไม่ผ่านการประเมิน (O) :  พบว่า ไม่มีการทำการตรวจสอบภายใน ภายในปี ตามที่ระบุไว้',
      auditorOpinion: 'เนื่องจากการตรวจสอบภายในมีความสำคัญเป็นอย่างยิ่ง ในการปรับปรุงพัฒนาอย่างต่อเนื่องของระบบ ดังนั้น จึงถือว่าข้อนี้ ไม่สอดคล้องตามเกณ์ของ พรบ ไซเบอร์',
      recommendation: 'ผู้รับการตรวจสอบ กระทำตามที่กำหนดไว้',
      rca: 'พบว่าทางเจ้าหน้าที่ที่เกี่ยวข้องละเลยไม่ได้จัดทำการตรวจสอบ เนื่องจากไม่มีเวลา',
      ca: 'ทางหน่วยงานได้มีการทบทวนแผนการตรวจสอบใหม่ทั้งหมด และมอบหมายให้ผู้บังคับบัญชาโดยตรง รับผิดชอบในการควบคุมหรือตรวจตรา ตามเวลาที่กำหนด โดยมี Timeline ดังต่อไปนี้',
      timeline: 'ทบทวนแผนการตรวจสอบใหม่ทั้งหมด  | วันที่ดำเนินการคือ 15 มีนาคม 2569, ผู้รับผิดชอบ คือ นาย A'
    },
    {
      id: 2,
      controlText: 'Domain 3 : ประมวลและกรอบฯ | Recover - Cybersecurity Resilience and Recovery | ข้อ 25.1.1',
      objective: 'ต้องมีการจัดทำแผนความต่อเนื่องทางธุรกิจ Business Continuity Plan : BCP) เพื่อให้หน่วยงานสามารถกลับมาดำเนินการได้อย่างต่อเนื่อง',
      methodInterview: 'สัมภาษณ์ผู้ดูแลระบบ (พรบ ไซเบอร์ 2562)',
      methodReview: 'ตรวจสอบเอกสารที่ได้จัดทำในส่วนที่เป็นกรอบมาตรฐาน (Recover > Cybersecurity Resilience and Recovery)',
      methodObserve: 'จากการสังเกตูการรื ไม่พบหลักฐานใดๆ ที่แสดงถึงการทำแผนความต่อเนื่องทางธุรกิจ',
      auditorProcess: 'ทางผู้ตรวจสอบ ได้ดำเนินการตรวจสอบเอกสารและบันทึกการรายงานต่างๆ รวมถึงการสัมภาษณ์ผู้ที่เกี่ยวข้อง และการสังเกตการณ์ ตามหลักการณ์ ISO 19011 พบว่าไม่มีหลักฐานในการทำจัดทำแผนความต่อเนื่องทางธุรกิจ Business Continuity Plan : BCP) ตามที่ระบุไว้',
      evalResult: 'ไม่ผ่านการประเมิน (O): พบว่าไม่ได้มีการจัดทำแผนความต่อเนื่องทางธุรกิจ Business Continuity Plan',
      auditorOpinion: 'ทางหน่วยงานดังกล่าวได้มีการจัดทำเอกสารที่เป็นขั้นตอนการปฏิบัติงาน (Procedure)ได้เป็นอย่างดี ตรงตามที่ พรบ ไซเบอร์ ได้กำหนด แต่จากการตรวจสอบเอกสารโดยละเอียดแล้ว รวมถึงหาหลักฐานประกอบ พบว่า ทางหน่วยงาน ไม่ได้มีการจัดทำแผนความต่อเนื่อง ซึ่งแผนดังกล่าว มีความสำคัญ ต่อผู้บริหารหรือหน่วยควบคุมการกำกับดูแล',
      recommendation: 'ควรต้องมีการจัดทำแผนความต่อเนื่อง รวมถึงมีการฝึกซ้อม BCP ด้วย',
      rca: 'พบว่าทางเจ้าหน้าที่ที่เกี่ยวข้องไม่ได้จัดทำแผนความต่อเนื่อง ในปีดังกล่าว เนื่องจากเป็นเจ้าหน้าที่ใหม่ ซึ่งไม่ทราบว่าจะต้องมีการจัดทำ',
      ca: 'ทางหน่วยงานได้มีการทบทวนแผนการอบรม พรบ ไซเบอร์ ให้กับพนักงานที่เกี่ยวข้องให้รับทราบ โดยมี Timeline ดังต่อไปนี้',
      timeline: '1.ทำการอบรมเจ้าหน้าที่ที่เกี่ยวข้อง ทั้งหมด พร้อม Post test หลังการอบรม โดยเน้นในส่วนของการจัดทำแผนความต่อเนื่องทางธุรกิจ  | วันที่ดำเนินการคือ 15 มีนาคม 2569, ผู้รับผิดชอบ คือ นาย A'
    }
  ]
}

export function ensureAuditReportStyles() {
  const progStyle = document.getElementById('audit-programme-print-style')
  if (progStyle) progStyle.disabled = true

  let style = document.getElementById('audit-report-custom-style')
  if (!style) {
    style = document.createElement('style')
    style.id = 'audit-report-custom-style'
    style.innerHTML = `
      .report-field-row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 8px;
        font-size: 13.5px;
        line-height: 1.6;
      }
      .report-field-label {
        font-weight: 700;
        color: #1e293b;
        min-width: 220px;
        flex-shrink: 0;
      }
      .report-field-val {
        flex: 1;
        color: #334155;
      }
      .report-table th {
        background-color: #f1f5f9 !important;
        color: #0f172a !important;
        font-weight: 700 !important;
        border: 1px solid #cbd5e1 !important;
        padding: 8px 10px !important;
        text-align: center !important;
      }
      .report-table td {
        border: 1px solid #cbd5e1 !important;
        padding: 6px 10px !important;
      }
      .finding-card {
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #fff;
        margin-bottom: 24px;
        overflow: hidden;
      }
      .finding-header {
        background: #eff6ff;
        padding: 10px 16px;
        border-bottom: 1px solid #bfdbfe;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      @media print {
        body {
          background: #fff !important;
          color: #000 !important;
        }
        body * {
          visibility: hidden !important;
        }
        #audit-report-print-area, #audit-report-print-area * {
          visibility: visible !important;
        }
        #audit-report-print-area {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 10mm 15mm !important;
          background: #fff !important;
          box-shadow: none !important;
          border: none !important;
        }
        .no-print {
          display: none !important;
        }
        .report-input-field, .finding-input, .table-full-score-input, .table-score-input, .table-result-input, textarea, input {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          outline: none !important;
          resize: none !important;
          color: #000 !important;
          font-family: 'TH Sarabun New', 'Sarabun', sans-serif !important;
        }
        .finding-card {
          border: 1px solid #cbd5e1 !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 18px !important;
        }
        .report-table th, .report-table td {
          border: 1px solid #333 !important;
          color: #000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .report-table th {
          background-color: #f1f5f9 !important;
        }
        @page {
          size: portrait;
          margin: 12mm 15mm;
        }
      }
    `
    document.head.appendChild(style)
  }
  style.disabled = false
}

export function renderAuditReportHtml(agency, reportData) {
  ensureAuditReportStyles()
  const data = reportData || DEFAULT_AUDIT_REPORT_SKO

  // Calculate totals
  let totalFull = 0
  let totalScore = 0
  data.tableRows.forEach(r => {
    if (r.isHeader || r.isSub) return
    if (r.fullScore) totalFull += Number(r.fullScore) || 0
    if (r.score) totalScore += Number(r.score) || 0
  })
  const percent = totalFull > 0 ? ((totalScore / totalFull) * 100).toFixed(2) : '0.00'
  const failedCount = data.weakPoints?.length || 0

  return `
    <div class="card" style="border:1px solid #cbd5e1; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.06); background:#fff; overflow:hidden; margin-bottom:24px;">
      
      <!-- Top Action Toolbar (No-Print) -->
      <div class="no-print" style="padding:16px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <label style="font-weight:700; font-size:13px; color:#1e293b; display:flex; align-items:center; gap:6px; margin:0;">
            <span>🏥 หน่วยรับตรวจ:</span>
            <select id="report-agency-select" style="font-weight:700; color:#1e40af; border:1px solid #93c5fd; padding:6px 12px; border-radius:6px; background:#eff6ff; font-size:13px; cursor:pointer;">
              ${AUDIT_AGENCIES.map(a => `<option value="${a}" ${a === agency ? 'selected' : ''}>${a}</option>`).join('')}
            </select>
          </label>
          <span style="display:inline-flex; align-items:center; gap:4px; font-size:11.5px; color:#16a34a; background:#f0fdf4; padding:4px 9px; border-radius:4px; border:1px solid #bbf7d0;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            บันทึกอัตโนมัติ
          </span>
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <!-- Export Word Button -->
          <button id="export-word-btn" class="btn" style="background:#2563eb; color:#fff; border:none; padding:7px 15px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 1px 2px rgba(37,99,235,0.2);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            📄 ส่งออกไฟล์ Word (.doc)
          </button>
          
          <!-- Print Button -->
          <button id="print-report-btn" class="btn" style="background:#0f172a; color:#fff; border:none; padding:7px 15px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            🖨️ พิมพ์รายงาน / Export PDF
          </button>
        </div>
      </div>

      <!-- Printable Report Document Area -->
      <div id="audit-report-print-area" style="padding:40px 48px; max-width:920px; margin:0 auto; background:#fff; font-family:'Sarabun', 'TH Sarabun New', sans-serif;">
        
        <!-- Header with Logo MOPH -->
        <div style="display:flex; align-items:center; gap:20px; margin-bottom:24px; padding-bottom:16px; border-bottom:2px solid #0f172a;">
          <img src="${LOGO_MOPH_BASE64}" alt="MOPH Logo" style="width:75px; height:75px; object-fit:contain; flex-shrink:0;">
          <div style="flex:1;">
            <div style="font-size:1.15rem; font-weight:700; color:#1e293b; margin-bottom:2px;">สำนักงานสาธารณสุขจังหวัดสระแก้ว</div>
            <h1 style="font-size:1.45rem; font-weight:800; color:#0f172a; margin:0; line-height:1.3;">
              รายงานการตรวจสอบด้านความมั่นคงปลอดภัยไซเบอร์ (Audit Report)
            </h1>
          </div>
        </div>

        <!-- Section 1: General Info -->
        <div style="margin-bottom:24px; background:#f8fafc; padding:18px 22px; border-radius:8px; border:1px solid #e2e8f0;">
          <div class="report-field-row">
            <span class="report-field-label">ชื่อหน่วยงานที่รับการตรวจประเมิน :</span>
            <input type="text" id="report-agency-input" class="report-input-field form-control form-control-sm" value="${data.agency || ''}" style="flex:1; font-weight:700; font-size:13.5px;">
          </div>
          <div class="report-field-row">
            <span class="report-field-label">ประเภทของหน่วยงาน :</span>
            <input type="text" id="report-agency-type-input" class="report-input-field form-control form-control-sm" value="${data.agencyType || ''}" style="flex:1; font-size:13.5px;">
          </div>
          <div class="report-field-row">
            <span class="report-field-label">วันที่ประเมิน :</span>
            <input type="text" id="report-date-input" class="report-input-field form-control form-control-sm" value="${data.auditDate || ''}" style="flex:1; font-size:13.5px;">
          </div>
          <div class="report-field-row" style="align-items:flex-start;">
            <span class="report-field-label">ชื่อผู้ตรวจสอบ :</span>
            <div style="flex:1;">
              <textarea id="report-auditors-input" rows="4" class="report-input-field form-control form-control-sm" style="font-size:13px; line-height:1.5;">${(data.auditors || []).join('\n')}</textarea>
            </div>
          </div>
          <div class="report-field-row">
            <span class="report-field-label">Audit Objective :</span>
            <input type="text" id="report-objective-input" class="report-input-field form-control form-control-sm" value="${data.objective || ''}" style="flex:1; font-size:13px;">
          </div>
          <div class="report-field-row">
            <span class="report-field-label">Audit Scope :</span>
            <input type="text" id="report-scope-input" class="report-input-field form-control form-control-sm" value="${data.scope || ''}" style="flex:1; font-size:13px;">
          </div>
          <div class="report-field-row">
            <span class="report-field-label">Audit Criteria :</span>
            <input type="text" id="report-criteria-input" class="report-input-field form-control form-control-sm" value="${data.criteria || ''}" style="flex:1; font-size:13px;">
          </div>
          <div class="report-field-row">
            <span class="report-field-label">ผลการประเมินก่อนหน้า :</span>
            <input type="text" id="report-prev-audit-input" class="report-input-field form-control form-control-sm" value="${data.prevAudit || ''}" style="flex:1; font-size:13px;">
          </div>
        </div>

        <div style="border-top:1px dashed #cbd5e1; margin:24px 0;"></div>

        <!-- Section 2: Executive Summary -->
        <div style="margin-bottom:28px;">
          <h2 style="font-size:1.25rem; font-weight:800; color:#1e293b; margin:0 0 12px 0;">
            สรุปผลการประเมินโดยภาพรวม (Executive Summary)
          </h2>
          
          <div style="background:#eff6ff; border-left:4px solid #2563eb; padding:12px 16px; margin-bottom:16px; border-radius:0 6px 6px 0;">
            <div style="font-weight:700; color:#1e40af; font-size:15px; margin-bottom:4px;">
              ${data.summaryStatus || 'ผ่านการประเมินโดยรวม'}
            </div>
            <div style="font-size:13px; color:#334155; line-height:1.5;">
              • คะแนนรวมที่ได้จากการประเมิน : <strong>${percent} %</strong> (สัดส่วน ${totalScore} / ${totalFull} ข้อ)<br>
              • จำนวนตัวควบคุมทั้งหมดที่ใช้ในการตรวจประเมิน = <strong>${totalFull} ตัวควบคุม</strong><br>
              • จำนวนตัวควบคุมที่ไม่ผ่านการประเมิน = <strong style="color:#b91c1c;">${failedCount} ตัวควบคุม</strong>
            </div>
          </div>

          <!-- Summary Table 1 -->
          <table class="report-table" style="width:100%; border-collapse:collapse; font-size:12.5px; margin-bottom:10px;">
            <thead>
              <tr>
                <th style="width:60px;">ลำดับ</th>
                <th style="text-align:left;">รายการการตรวจประเมิน</th>
                <th style="width:160px;">จำนวนตัวควบคุม/ คะแนนเต็ม</th>
                <th style="width:110px;">ผลการประเมิน</th>
                <th style="width:130px;">% Score ที่ได้รับ</th>
              </tr>
            </thead>
            <tbody>
              ${data.tableRows.map((r, idx) => {
                if (r.isHeader) {
                  return `
                    <tr style="background:#f8fafc; font-weight:700; color:#1e293b;">
                      <td style="text-align:center;">${r.num}</td>
                      <td colspan="4" style="text-align:left; padding-left:14px;">${r.title}</td>
                    </tr>
                  `
                }
                const isSubItem = r.isSub
                return `
                  <tr style="${r.num === '1' || r.num === '2' || r.num === '3' ? 'font-weight:700; background:#fff;' : 'background:#fff;'}">
                    <td style="text-align:center; color:#64748b;">${r.num}</td>
                    <td style="text-align:left; ${isSubItem ? 'padding-left:26px;' : ''}">${r.title}</td>
                    <td style="text-align:center;">
                      ${r.fullScore !== '' ? `
                        <input type="number" class="table-full-score-input" data-idx="${idx}" value="${r.fullScore}" style="width:60px; text-align:center; border:1px solid #cbd5e1; border-radius:4px; padding:2px 4px; font-weight:600;">
                      ` : '-'}
                    </td>
                    <td style="text-align:center;">
                      <input type="text" class="table-result-input" data-idx="${idx}" value="${r.result || ''}" style="width:75px; text-align:center; border:1px solid #cbd5e1; border-radius:4px; padding:2px 4px; font-weight:700; color:${r.result?.includes('O') || r.result?.includes('NC') ? '#b91c1c' : '#15803d'};">
                    </td>
                    <td style="text-align:center;">
                      ${r.score !== '' ? `
                        <input type="number" class="table-score-input" data-idx="${idx}" value="${r.score}" style="width:60px; text-align:center; border:1px solid #cbd5e1; border-radius:4px; padding:2px 4px; font-weight:700;">
                      ` : '-'}
                    </td>
                  </tr>
                `
              }).join('')}
              <tr style="background:#f1f5f9; font-weight:800; border-top:2px solid #0f172a;">
                <td style="text-align:center;"></td>
                <td style="text-align:left;">ผลรวม</td>
                <td style="text-align:center;" id="report-total-full">${totalFull}</td>
                <td style="text-align:center;">-</td>
                <td style="text-align:center;" id="report-total-score">${totalScore}</td>
              </tr>
            </tbody>
          </table>

          <div style="font-size:11.5px; color:#64748b; margin-top:6px; line-height:1.4;">
            <strong>คำอธิบายสัญลักษณ์:</strong> S – Satisfied = Conformity &nbsp;|&nbsp; O – Non Satisfied = NC (Non Conformity) &nbsp;|&nbsp; N/A - Not Applicable
          </div>
        </div>

        <div style="border-top:1px dashed #cbd5e1; margin:24px 0;"></div>

        <!-- Section 3: Detailed Findings -->
        <div>
          <h2 style="font-size:1.25rem; font-weight:800; color:#1e293b; margin:0 0 16px 0;">
            รายละเอียดการตรวจสอบ
          </h2>

          <!-- Strong Points -->
          <div style="margin-bottom:24px;">
            <div style="font-weight:700; font-size:14px; color:#15803d; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span>✅ ข้อดี (Strong Point) :</span>
            </div>
            <textarea id="report-strong-points" rows="3" class="report-input-field form-control" style="width:100%; font-size:13px; line-height:1.5;">${data.strongPoints || ''}</textarea>
          </div>

          <!-- Weak Points / NC items Header & Button -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div style="font-weight:700; font-size:14px; color:#b91c1c;">
              ⚠️ ข้อที่ควรทำการแก้ไข (Weak Point / Non-Conformity) :
            </div>
            <button id="add-finding-btn" class="btn no-print" style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; font-size:12px; font-weight:600; padding:4px 10px; border-radius:6px; cursor:pointer;">
              + เพิ่มข้อที่ควรแก้ไข
            </button>
          </div>

          <!-- Weak Points List -->
          <div id="findings-list-container">
            ${(data.weakPoints || []).map((wp, fIdx) => `
              <div class="finding-card" data-id="${wp.id}">
                <div class="finding-header">
                  <span style="font-weight:700; color:#1e3a8a; font-size:13.5px;">ข้อที่ ${fIdx + 1}</span>
                  <button class="delete-finding-btn no-print" data-id="${wp.id}" style="background:none; border:none; color:#ef4444; font-size:12px; cursor:pointer; font-weight:600;">
                    ลบข้อนี้
                  </button>
                </div>
                <div style="padding:16px;">
                  
                  <!-- ส่วนของผู้ประเมิน -->
                  <div style="margin-bottom:14px;">
                    <div style="font-size:13px; margin-bottom:6px;">
                      <strong>ตัวควบคุม:</strong>
                      <input type="text" class="finding-input" data-id="${wp.id}" data-field="controlText" value="${wp.controlText || ''}" class="form-control form-control-sm" style="width:100%; font-size:12.5px; font-weight:600; margin-top:2px;">
                    </div>
                    <div style="font-size:13px; margin-bottom:6px;">
                      <strong>วัตถุประสงค์:</strong>
                      <input type="text" class="finding-input" data-id="${wp.id}" data-field="objective" value="${wp.objective || ''}" style="width:100%; font-size:12.5px; margin-top:2px;">
                    </div>
                    
                    <div style="font-size:13px; margin-bottom:6px;">
                      <strong>วิธีการประเมิน:</strong>
                      <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                          <span style="font-size:12px; color:#475569; width:130px;">• Interview :</span>
                          <input type="text" class="finding-input" data-id="${wp.id}" data-field="methodInterview" value="${wp.methodInterview || ''}" placeholder="สัมภาษณ์..." style="flex:1; font-size:12px;">
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                          <span style="font-size:12px; color:#475569; width:130px;">• Review Document :</span>
                          <input type="text" class="finding-input" data-id="${wp.id}" data-field="methodReview" value="${wp.methodReview || ''}" placeholder="ตรวจสอบเอกสาร..." style="flex:1; font-size:12px;">
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                          <span style="font-size:12px; color:#475569; width:130px;">• Observation :</span>
                          <input type="text" class="finding-input" data-id="${wp.id}" data-field="methodObserve" value="${wp.methodObserve || ''}" placeholder="สังเกตการณ์..." style="flex:1; font-size:12px;">
                        </div>
                      </div>
                    </div>

                    <div style="font-size:13px; margin-bottom:6px;">
                      <strong>อธิบายการดำเนินการของผู้ตรวจ:</strong>
                      <textarea rows="2" class="finding-input form-control form-control-sm" data-id="${wp.id}" data-field="auditorProcess" style="width:100%; font-size:12.5px; line-height:1.4; margin-top:2px;">${wp.auditorProcess || ''}</textarea>
                    </div>

                    <div style="font-size:13px; margin-bottom:6px;">
                      <strong>ผลการประเมิน:</strong>
                      <input type="text" class="finding-input" data-id="${wp.id}" data-field="evalResult" value="${wp.evalResult || ''}" style="width:100%; font-size:12.5px; font-weight:700; color:#b91c1c; margin-top:2px;">
                    </div>

                    <div style="font-size:13px; margin-bottom:6px;">
                      <strong>ความคิดเห็นของผู้ประเมิน:</strong>
                      <textarea rows="2" class="finding-input form-control form-control-sm" data-id="${wp.id}" data-field="auditorOpinion" style="width:100%; font-size:12.5px; line-height:1.4; margin-top:2px;">${wp.auditorOpinion || ''}</textarea>
                    </div>

                    <div style="font-size:13px; margin-bottom:6px;">
                      <strong>คำแนะนำ:</strong>
                      <input type="text" class="finding-input" data-id="${wp.id}" data-field="recommendation" value="${wp.recommendation || ''}" style="width:100%; font-size:12.5px; margin-top:2px;">
                    </div>
                  </div>

                  <!-- เส้นคั่นส่วนผู้รับการตรวจ -->
                  <div style="border-top:1px dashed #cbd5e1; margin:14px 0 12px 0;"></div>

                  <!-- ส่วนของผู้รับการตรวจ -->
                  <div style="background:#fcfbf7; border:1px solid #fef3c7; border-radius:6px; padding:12px 14px;">
                    <div style="font-weight:700; color:#92400e; font-size:13px; margin-bottom:8px;">
                      ส่วนของผู้รับการตรวจ (โรงพยาบาล / หน่วยรับตรวจกรอกข้อมูล)
                    </div>

                    <div style="font-size:12.5px; margin-bottom:6px;">
                      <strong>ทำการวิเคราะห์หาสาเหตุ (Root Cause Analysis - RCA) :</strong>
                      <textarea rows="2" class="finding-input form-control form-control-sm" data-id="${wp.id}" data-field="rca" placeholder="ระบุการวิเคราะห์หาสาเหตุของปัญหา..." style="width:100%; font-size:12px; margin-top:2px;">${wp.rca || ''}</textarea>
                    </div>

                    <div style="font-size:12.5px; margin-bottom:6px;">
                      <strong>วิธีการแก้ไขเพื่อไม่ให้ปัญหาเกิดขึ้นอีก (Corrective Action - CA) :</strong>
                      <textarea rows="2" class="finding-input form-control form-control-sm" data-id="${wp.id}" data-field="ca" placeholder="ระบุวิธีการแก้ไขเพื่อไม่ให้เกิดปัญหาซ้ำ..." style="width:100%; font-size:12px; margin-top:2px;">${wp.ca || ''}</textarea>
                    </div>

                    <div style="font-size:12.5px;">
                      <strong>กำหนดการและผู้รับผิดชอบ (Timeline & PIC) :</strong>
                      <input type="text" class="finding-input" data-id="${wp.id}" data-field="timeline" value="${wp.timeline || ''}" placeholder="เช่น ทบทวนแผนใหม่ | วันที่ 15 มีนาคม 2569, ผู้รับผิดชอบ นาย A" style="width:100%; font-size:12px; margin-top:2px;">
                    </div>
                  </div>

                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `
}

export function exportAuditReportToWord(agency, reportData) {
  const data = reportData || DEFAULT_AUDIT_REPORT_SKO

  // Calculate totals
  let totalFull = 0
  let totalScore = 0
  data.tableRows.forEach(r => {
    if (r.isHeader || r.isSub) return
    if (r.fullScore) totalFull += Number(r.fullScore) || 0
    if (r.score) totalScore += Number(r.score) || 0
  })
  const percent = totalFull > 0 ? ((totalScore / totalFull) * 100).toFixed(2) : '0.00'
  const failedCount = data.weakPoints?.length || 0

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>รายงานการตรวจสอบด้านความมั่นคงปลอดภัยไซเบอร์ (Audit Report)</title>
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
          margin: 4pt 0 16pt 0;
        }
        h2 {
          font-size: 16pt;
          font-weight: bold;
          margin: 12pt 0 6pt 0;
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
          border: 1px solid #000;
          padding: 4pt 6pt;
          font-size: 15pt;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-align: center;
        }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        .divider {
          border-bottom: 1px solid #999;
          margin: 12pt 0;
        }
        .auditee-box {
          background-color: #fafafa;
          border: 1px solid #ccc;
          padding: 8pt;
          margin: 6pt 0;
        }
      </style>
    </head>
    <body>
      <div style="text-align:center; margin-bottom:12pt;">
        <img src="${LOGO_MOPH_BASE64}" width="70" height="70" alt="MOPH Logo"><br>
        <strong style="font-size:16pt;">สำนักงานสาธารณสุขจังหวัดสระแก้ว</strong>
      </div>
      <h1>รายงานการตรวจสอบด้านความมั่นคงปลอดภัยไซเบอร์ (Audit Report)</h1>

      <p><span class="bold">ชื่อหน่วยงานที่รับการตรวจประเมิน :</span> ${data.agency || ''}</p>
      <p><span class="bold">ประเภทของหน่วยงาน :</span> ${data.agencyType || ''}</p>
      <p><span class="bold">วันที่ประเมิน:</span> ${data.auditDate || ''}</p>
      <p><span class="bold">ชื่อผู้ตรวจสอบ:</span></p>
      <div style="margin-left:20pt;">
        ${(data.auditors || []).map(a => `<div>${a}</div>`).join('')}
      </div>
      <p><span class="bold">Audit Objective :</span> ${data.objective || ''}</p>
      <p><span class="bold">Audit Scope :</span> ${data.scope || ''}</p>
      <p><span class="bold">Audit Criteria :</span> ${data.criteria || ''}</p>
      <p><span class="bold">ผลการประเมินก่อนหน้า:</span> ${data.prevAudit || ''}</p>

      <div class="divider"></div>

      <h2>สรุปผลการประเมินโดยภาพรวม (Executive Summary)</h2>
      <p class="bold" style="font-size:16pt; color:#003399;">${data.summaryStatus || 'ผ่านการประเมินโดยรวม'}</p>
      <p>คะแนนรวมที่ได้จากการประเมิน : <span class="bold">${percent} %</span> (จำนวนข้อที่สอดคล้อง / จำนวนข้อทั้งหมด เช่น ${totalScore} / ${totalFull})</p>
      <p>จำนวนตัวควบคุมทั้งหมดที่ใช้ในการตรวจประเมิน = ${totalFull} ตัวควบคุม</p>
      <p>จำนวนตัวควบคุมที่ไม่ผ่านการประเมิน = ${failedCount} ตัวควบคุม</p>

      <table>
        <thead>
          <tr>
            <th style="width:40pt;">ลำดับ</th>
            <th class="text-left">รายการการตรวจประเมิน</th>
            <th style="width:110pt;">จำนวนตัวควบคุม/ คะแนนเต็ม</th>
            <th style="width:90pt;">ผลการประเมิน</th>
            <th style="width:100pt;">% Score ที่ได้รับ</th>
          </tr>
        </thead>
        <tbody>
          ${data.tableRows.map(r => {
            if (r.isHeader) {
              return `
                <tr style="background-color:#f9f9f9; font-weight:bold;">
                  <td class="text-center">${r.num}</td>
                  <td colspan="4" class="text-left">${r.title}</td>
                </tr>
              `
            }
            return `
              <tr style="${r.num === '1' || r.num === '2' || r.num === '3' ? 'font-weight:bold;' : ''}">
                <td class="text-center">${r.num}</td>
                <td class="text-left" style="${r.isSub ? 'padding-left:18pt;' : ''}">${r.title}</td>
                <td class="text-center">${r.fullScore || ''}</td>
                <td class="text-center" style="font-weight:bold;">${r.result || ''}</td>
                <td class="text-center">${r.score || ''}</td>
              </tr>
            `
          }).join('')}
          <tr style="font-weight:bold; background-color:#eeeeee;">
            <td class="text-center"></td>
            <td class="text-left">ผลรวม</td>
            <td class="text-center">${totalFull}</td>
            <td class="text-center"></td>
            <td class="text-center">${totalScore}</td>
          </tr>
        </tbody>
      </table>

      <p style="font-size:14pt; color:#555;">
        S – Satisfied = Conformity &nbsp;&nbsp;|&nbsp;&nbsp; O – Non Satisfied = NC (Non Conformity) &nbsp;&nbsp;|&nbsp;&nbsp; N/A - Not Applicable
      </p>

      <div class="divider"></div>

      <h2>รายละเอียดการตรวจสอบ</h2>
      <p class="bold" style="color:#006600;">ข้อดี (Strong Point) :</p>
      <div style="margin-left:15pt; white-space:pre-line;">
        ${data.strongPoints || ''}
      </div>

      <br>
      <p class="bold" style="color:#cc0000;">ข้อที่ควรทำการแก้ไข (Weak Point) :</p>

      ${(data.weakPoints || []).map((wp, fIdx) => `
        <div style="margin-bottom:18pt;">
          <p class="bold" style="font-size:16pt;">${fIdx + 1}. ตัวควบคุม: ${wp.controlText || ''}</p>
          <p><span class="bold">วัตถุประสงค์:</span> ${wp.objective || ''}</p>
          <p><span class="bold">วิธีการประเมิน:</span></p>
          <div style="margin-left:15pt;">
            ${wp.methodInterview ? `<div>Interview : ${wp.methodInterview}</div>` : ''}
            ${wp.methodReview ? `<div>Review Document : ${wp.methodReview}</div>` : ''}
            ${wp.methodObserve ? `<div>Observation : ${wp.methodObserve}</div>` : ''}
          </div>
          <p><span class="bold">อธิบายการดำเนินการของผู้ตรวจ :</span></p>
          <p style="margin-left:15pt;">${wp.auditorProcess || ''}</p>
          <p><span class="bold">ผลการประเมิน:</span> <span class="bold" style="color:#cc0000;">${wp.evalResult || ''}</span></p>
          <p><span class="bold">ความคิดเห็นของผู้ประเมิน:</span> ${wp.auditorOpinion || ''}</p>
          <p><span class="bold">คำแนะนำ:</span> ${wp.recommendation || ''}</p>

          <p style="text-align:center; color:#888;">………………………………………………………………………………………………………………..</p>
          
          <div class="auditee-box">
            <p class="bold" style="color:#993300;">ส่วนของผู้รับการตรวจ</p>
            <p><span class="bold">ทำการวิเคราะห์หาสาเหตุ (Root Cause Analysis) :</span> ${wp.rca || ''}</p>
            <p><span class="bold">วิธีการแก้ไขเพื่อไม่ให้ปัญหาเกิดขึ้นอีก (Corrective Action) :</span> ${wp.ca || ''}</p>
            <p><span class="bold">Timeline และผู้รับผิดชอบ:</span> ${wp.timeline || ''}</p>
          </div>
          <div class="divider"></div>
        </div>
      `).join('')}

    </body>
    </html>
  `

  const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const safeAgencyName = (data.agency || 'หน่วยงาน').replace(/[\s\/\\:*?"<>|]/g, '_')
  a.href = url
  a.download = `Audit_Report_${safeAgencyName}_2569.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showNotification('ส่งออกไฟล์ Word (.doc) เรียบร้อยแล้ว', 'success')
}

export function bindAuditReportEvents(el, agency, onUpdate) {
  // Agency Change
  document.getElementById('report-agency-select')?.addEventListener('change', (e) => {
    onUpdate({ type: 'changeAgency', agency: e.target.value })
  })

  // Export Word
  document.getElementById('export-word-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'exportWord' })
  })

  // Print Report
  document.getElementById('print-report-btn')?.addEventListener('click', () => {
    window.print()
  })

  // General info inputs
  const bindField = (id, field) => {
    document.getElementById(id)?.addEventListener('change', (e) => {
      onUpdate({ type: 'updateField', field, value: e.target.value.trim() })
    })
  }
  bindField('report-agency-input', 'agency')
  bindField('report-agency-type-input', 'agencyType')
  bindField('report-date-input', 'auditDate')
  bindField('report-objective-input', 'objective')
  bindField('report-scope-input', 'scope')
  bindField('report-criteria-input', 'criteria')
  bindField('report-prev-audit-input', 'prevAudit')
  bindField('report-strong-points', 'strongPoints')

  // Auditors textarea
  document.getElementById('report-auditors-input')?.addEventListener('change', (e) => {
    const list = e.target.value.split('\n').filter(s => s.trim())
    onUpdate({ type: 'updateField', field: 'auditors', value: list })
  })

  // Table summary row changes
  el.querySelectorAll('.table-full-score-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.idx)
      onUpdate({ type: 'updateTableRow', idx, field: 'fullScore', value: Number(e.target.value) || 0 })
    })
  })
  el.querySelectorAll('.table-score-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.idx)
      onUpdate({ type: 'updateTableRow', idx, field: 'score', value: Number(e.target.value) || 0 })
    })
  })
  el.querySelectorAll('.table-result-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.idx)
      onUpdate({ type: 'updateTableRow', idx, field: 'result', value: e.target.value.trim() })
    })
  })

  // Add Finding
  document.getElementById('add-finding-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'addFinding' })
  })

  // Delete Finding
  el.querySelectorAll('.delete-finding-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.dataset.id)
      if (confirm('คุณต้องการลบข้อที่ควรทำการแก้ไขข้อนี้ใช่หรือไม่?')) {
        onUpdate({ type: 'deleteFinding', id })
      }
    })
  })

  // Finding inputs
  el.querySelectorAll('.finding-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id)
      const field = e.target.dataset.field
      onUpdate({ type: 'updateFinding', id, field, value: e.target.value.trim() })
    })
  })
}
