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

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

export function formatThaiDateRange(startDateStr, endDateStr) {
  if (!startDateStr && !endDateStr) return ''
  if (startDateStr && !endDateStr) {
    const parts = startDateStr.split('-')
    if (parts.length === 3) {
      const d = Number(parts[2])
      const m = THAI_MONTHS[Number(parts[1]) - 1]
      const y = Number(parts[0]) + 543
      return `วันที่ ${d} ${m} ${y}`
    }
    return startDateStr
  }
  if (!startDateStr && endDateStr) {
    const parts = endDateStr.split('-')
    if (parts.length === 3) {
      const d = Number(parts[2])
      const m = THAI_MONTHS[Number(parts[1]) - 1]
      const y = Number(parts[0]) + 543
      return `วันที่ ${d} ${m} ${y}`
    }
    return endDateStr
  }

  const p1 = startDateStr.split('-')
  const p2 = endDateStr.split('-')
  if (p1.length === 3 && p2.length === 3) {
    const y1 = Number(p1[0]) + 543
    const y2 = Number(p2[0]) + 543
    const m1Idx = Number(p1[1]) - 1
    const m2Idx = Number(p2[1]) - 1
    const d1 = Number(p1[2])
    const d2 = Number(p2[2])

    if (y1 === y2 && m1Idx === m2Idx && d1 === d2) {
      return `วันที่ ${d1} ${THAI_MONTHS[m1Idx]} ${y1}`
    }
    if (y1 === y2 && m1Idx === m2Idx) {
      return `วันที่ ${d1} - ${d2} ${THAI_MONTHS[m1Idx]} ${y1}`
    }
    if (y1 === y2) {
      return `วันที่ ${d1} ${THAI_MONTHS[m1Idx]} - ${d2} ${THAI_MONTHS[m2Idx]} ${y1}`
    }
    return `วันที่ ${d1} ${THAI_MONTHS[m1Idx]} ${y1} - ${d2} ${THAI_MONTHS[m2Idx]} ${y2}`
  }

  return `${startDateStr} - ${endDateStr}`
}

export function calculateAuditScores(data) {
  if (!data || !data.tableRows) {
    return { totalFull: 98, totalScore: 96, percent: '97.96', totalFailed: 2, status: 'ผ่านการประเมินโดยมีข้อสังเกต/ข้อแก้ไข (Pass with NC)' }
  }

  // 1. Calculate sum of O in sub-items 3.1.1 to 3.2.6
  let totalOInItem3 = 0
  data.tableRows.forEach(r => {
    if (r.isSub) {
      if (r.resultType === 'O' || (r.result && r.result.startsWith('O'))) {
        r.resultType = 'O'
        const count = r.ncCount !== undefined ? Number(r.ncCount) : parseInt(r.result?.match(/\d+/)?.[0] || '1', 10)
        r.ncCount = isNaN(count) || count <= 0 ? 1 : count
        r.result = `O (${r.ncCount})`
        totalOInItem3 += r.ncCount
      } else {
        r.resultType = 'S'
        r.ncCount = 0
        r.result = 'S'
      }
    }
  })

  // 2. Update Item 3 (Auto calculated from 3.1.1 - 3.2.6)
  const row3 = data.tableRows.find(r => r.num === '3')
  if (row3) {
    row3.fullScore = 73
    row3.ncCount = totalOInItem3
    if (totalOInItem3 === 0) {
      row3.resultType = 'S'
      row3.result = 'S'
      row3.score = 73
    } else {
      row3.resultType = 'NC'
      row3.result = `${totalOInItem3} NC`
      row3.score = Math.max(0, 73 - totalOInItem3)
    }
  }

  // 3. Update Item 1 (fullScore = 12)
  const row1 = data.tableRows.find(r => r.num === '1')
  if (row1) {
    row1.fullScore = 12
    if (row1.resultType === 'NC' || (row1.result && row1.result.includes('NC'))) {
      row1.resultType = 'NC'
      const count = row1.ncCount !== undefined ? Number(row1.ncCount) : parseInt(row1.result?.match(/\d+/)?.[0] || '1', 10)
      row1.ncCount = isNaN(count) || count <= 0 ? 1 : count
      row1.result = `${row1.ncCount} NC`
      row1.score = Math.max(0, 12 - row1.ncCount)
    } else {
      row1.resultType = 'S'
      row1.ncCount = 0
      row1.result = 'S'
      row1.score = 12
    }
  }

  // 4. Update Item 2 (fullScore = 13)
  const row2 = data.tableRows.find(r => r.num === '2')
  if (row2) {
    row2.fullScore = 13
    if (row2.resultType === 'NC' || (row2.result && row2.result.includes('NC'))) {
      row2.resultType = 'NC'
      const count = row2.ncCount !== undefined ? Number(row2.ncCount) : parseInt(row2.result?.match(/\d+/)?.[0] || '1', 10)
      row2.ncCount = isNaN(count) || count <= 0 ? 1 : count
      row2.result = `${row2.ncCount} NC`
      row2.score = Math.max(0, 13 - row2.ncCount)
    } else {
      row2.resultType = 'S'
      row2.ncCount = 0
      row2.result = 'S'
      row2.score = 13
    }
  }

  // 5. Total Full Score and Total Score
  const s1 = Number(row1?.score) || 0
  const s2 = Number(row2?.score) || 0
  const s3 = Number(row3?.score) || 0
  const totalFull = 98
  const totalScore = s1 + s2 + s3
  const totalFailed = (Number(row1?.ncCount) || 0) + (Number(row2?.ncCount) || 0) + (Number(row3?.ncCount) || 0)
  const percent = ((totalScore / totalFull) * 100).toFixed(2)

  // 6. Overall Status
  let status = 'ผ่านการประเมินโดยรวม'
  if (Number(percent) < 80) {
    status = 'ไม่ผ่านการประเมิน'
  } else if (totalFailed > 0) {
    status = 'ผ่านการประเมินโดยมีข้อสังเกต/ข้อแก้ไข (Pass with NC)'
  } else {
    status = 'ผ่านการประเมินโดยรวม'
  }
  data.summaryStatus = status

  return { totalFull, totalScore, percent, totalFailed, status }
}

export const DEFAULT_AUDIT_REPORT_SKO = {
  id: 'report_default_2569',
  agency: 'สำนักงานสาธารณสุขจังหวัดสระแก้ว',
  agencyType: 'CII | Regulator | Gov',
  startDate: '2026-02-23',
  endDate: '2026-02-27',
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
  summaryStatus: 'ผ่านการประเมินโดยมีข้อสังเกต/ข้อแก้ไข (Pass with NC)',
  tableRows: [
    { num: '1', title: 'พรบ ไซเบอร์ 2562', fullScore: 12, resultType: 'S', ncCount: 0, result: 'S', score: 12, isHeader: false, isSub: false },
    { num: '2', title: 'นโยบายฯ ไซเบอร์แห่งชาติ (2565-2570)', fullScore: 13, resultType: 'S', ncCount: 0, result: 'S', score: 13, isHeader: false, isSub: false },
    { num: '3', title: 'ประมวลแนวทางปฏิบัติและกรอบมาตรฐาน', fullScore: 73, resultType: 'NC', ncCount: 2, result: '2 NC', score: 71, isHeader: false, isSub: false },
    { num: '3.1', title: 'ประมวลแนวทางปฏิบัติ', fullScore: '', result: '', score: '', isHeader: true, isSub: false },
    { num: '3.1.1', title: 'แผนการตรวจสอบ', fullScore: '', resultType: 'O', ncCount: 1, result: 'O (1)', score: '', isHeader: false, isSub: true },
    { num: '3.1.2', title: 'การประเมินความเสี่ยง', fullScore: '', resultType: 'S', ncCount: 0, result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.1.3', title: 'แผนการรับมือภัยคุกคามทางไซเบอร์', fullScore: '', resultType: 'S', ncCount: 0, result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2', title: 'กรอบมาตรฐาน', fullScore: '', result: '', score: '', isHeader: true, isSub: false },
    { num: '3.2.1', title: 'Govern', fullScore: '', resultType: 'S', ncCount: 0, result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.2', title: 'Identify', fullScore: '', resultType: 'S', ncCount: 0, result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.3', title: 'Protect', fullScore: '', resultType: 'S', ncCount: 0, result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.4', title: 'Detect', fullScore: '', resultType: 'S', ncCount: 0, result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.5', title: 'Respond', fullScore: '', resultType: 'S', ncCount: 0, result: 'S', score: '', isHeader: false, isSub: true },
    { num: '3.2.6', title: 'Recover', fullScore: '', resultType: 'O', ncCount: 1, result: 'O (1)', score: '', isHeader: false, isSub: true }
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
      .print-only {
        display: none !important;
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
        .print-only {
          display: inline-block !important;
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

export function renderAuditReportHtml(agency, reportList, activeReportId) {
  ensureAuditReportStyles()
  const list = Array.isArray(reportList) && reportList.length > 0 ? reportList : [DEFAULT_AUDIT_REPORT_SKO]
  const data = list.find(r => r.id === activeReportId) || list[0]
  const calc = calculateAuditScores(data)

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

          <label style="font-weight:700; font-size:13px; color:#1e293b; display:flex; align-items:center; gap:6px; margin:0;">
            <span>📅 รอบประเมิน:</span>
            <select id="report-version-select" style="font-weight:600; color:#0f172a; border:1px solid #cbd5e1; padding:6px 10px; border-radius:6px; background:#fff; font-size:12.5px; cursor:pointer; max-width:260px;">
              ${list.map(r => `<option value="${r.id}" ${r.id === data.id ? 'selected' : ''}>${r.auditDate || 'รอบไม่มีระบุวันที่'}</option>`).join('')}
            </select>
          </label>

          <button id="create-report-btn" class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#2563eb; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
            + สร้างรายงานรอบใหม่
          </button>

          ${list.length > 1 ? `
            <button id="delete-report-btn" class="btn" data-id="${data.id}" style="background:#fff; border:1px solid #fca5a5; color:#ef4444; padding:6px 10px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" title="ลบรายงานรอบนี้">
              🗑️ ลบรอบนี้
            </button>
          ` : ''}

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

          <!-- Date range & text input -->
          <div class="report-field-row" style="align-items:flex-start;">
            <span class="report-field-label" style="padding-top:4px;">วันที่ประเมิน :</span>
            <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
              <div class="no-print" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:12px; color:#475569; background:#fff; padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1;">
                <span>จากวันที่:</span>
                <input type="date" id="report-start-date" value="${data.startDate || ''}" style="border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px; font-size:12px;">
                <span>ถึงวันที่:</span>
                <input type="date" id="report-end-date" value="${data.endDate || ''}" style="border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px; font-size:12px;">
                <span style="color:#64748b; font-size:11px;">(ระบบแปลงเป็นช่วงวันที่ภาษาไทยให้อัตโนมัติ)</span>
              </div>
              <input type="text" id="report-date-input" class="report-input-field form-control form-control-sm" value="${data.auditDate || ''}" placeholder="เช่น วันที่ 23 - 27 กุมภาพันธ์ 2569" style="font-size:13.5px; font-weight:600;">
            </div>
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
          
          <div id="executive-summary-box" style="background:${calc.percent < 80 ? '#fef2f2' : calc.totalFailed > 0 ? '#eff6ff' : '#f0fdf4'}; border-left:4px solid ${calc.percent < 80 ? '#dc2626' : calc.totalFailed > 0 ? '#2563eb' : '#16a34a'}; padding:12px 16px; margin-bottom:16px; border-radius:0 6px 6px 0;">
            <div id="exec-status-title" style="font-weight:700; color:${calc.percent < 80 ? '#b91c1c' : calc.totalFailed > 0 ? '#1e40af' : '#15803d'}; font-size:15px; margin-bottom:4px;">
              ${calc.status}
            </div>
            <div id="exec-summary-details" style="font-size:13px; color:#334155; line-height:1.5;">
              • คะแนนรวมที่ได้จากการประเมิน : <strong>${calc.percent} %</strong> (สัดส่วน ${calc.totalScore} / ${calc.totalFull} ข้อ)<br>
              • จำนวนตัวควบคุมทั้งหมดที่ใช้ในการตรวจประเมิน = <strong>${calc.totalFull} ตัวควบคุม</strong><br>
              • จำนวนตัวควบคุมที่ไม่ผ่านการประเมิน = <strong style="color:${calc.totalFailed > 0 ? '#b91c1c' : '#15803d'};">${calc.totalFailed} ตัวควบคุม</strong>
            </div>
          </div>

          <!-- Summary Table 1 -->
          <table class="report-table" style="width:100%; border-collapse:collapse; font-size:12.5px; margin-bottom:10px;">
            <thead>
              <tr>
                <th style="width:60px;">ลำดับ</th>
                <th style="text-align:left;">รายการการตรวจประเมิน</th>
                <th style="width:160px;">จำนวนตัวควบคุม/ คะแนนเต็ม</th>
                <th style="width:150px;">ผลการประเมิน</th>
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

                // Major Items 1 & 2
                if (r.num === '1' || r.num === '2') {
                  const isNC = r.resultType === 'NC'
                  return `
                    <tr style="background:#fff; font-weight:700;">
                      <td style="text-align:center; color:#64748b;">${r.num}</td>
                      <td style="text-align:left;">${r.title}</td>
                      <td style="text-align:center;">${r.fullScore}</td>
                      <td style="text-align:center;">
                        <div style="display:inline-flex; align-items:center; justify-content:center; gap:4px;">
                          <select class="table-major-select no-print" data-idx="${idx}" style="font-weight:700; border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px; font-size:12px; cursor:pointer; color:${isNC ? '#b91c1c' : '#15803d'};">
                            <option value="S" ${!isNC ? 'selected' : ''}>S (ผ่าน)</option>
                            <option value="NC" ${isNC ? 'selected' : ''}>NC (ไม่ผ่าน)</option>
                          </select>
                          ${isNC ? `
                            <span class="no-print" style="font-size:11px; color:#64748b;">จำนวน:</span>
                            <input type="number" min="1" max="${r.fullScore}" class="table-major-nc-count no-print" data-idx="${idx}" value="${r.ncCount || 1}" style="width:45px; text-align:center; border:1px solid #f87171; border-radius:4px; padding:2px; font-weight:700; color:#b91c1c;">
                          ` : ''}
                          <span class="print-only" style="display:none; font-weight:700; color:${isNC ? '#b91c1c' : '#15803d'};">${r.result}</span>
                        </div>
                      </td>
                      <td style="text-align:center; font-weight:700; color:#1e293b;">${r.score}</td>
                    </tr>
                  `
                }

                // Major Item 3 (Auto calculated from 3.1.1 - 3.2.6)
                if (r.num === '3') {
                  const isNC = r.resultType === 'NC' || (r.ncCount > 0)
                  return `
                    <tr style="background:#fff; font-weight:700;">
                      <td style="text-align:center; color:#64748b;">${r.num}</td>
                      <td style="text-align:left;">
                        ${r.title}
                        <span class="no-print" style="font-size:11px; font-weight:normal; color:#64748b; margin-left:6px;">(คำนวณอัตโนมัติจากข้อ 3.1 และ 3.2)</span>
                      </td>
                      <td style="text-align:center;">${r.fullScore}</td>
                      <td style="text-align:center; font-weight:700; color:${isNC ? '#b91c1c' : '#15803d'};">
                        <span id="row-3-result-badge">${r.result}</span>
                      </td>
                      <td style="text-align:center; font-weight:700; color:#1e293b;" id="row-3-score-cell">${r.score}</td>
                    </tr>
                  `
                }

                // Sub items 3.1.1 to 3.2.6
                const isO = r.resultType === 'O' || (r.result && r.result.startsWith('O'))
                return `
                  <tr style="background:#fff;">
                    <td style="text-align:center; color:#64748b;">${r.num}</td>
                    <td style="text-align:left; padding-left:26px;">${r.title}</td>
                    <td style="text-align:center;">-</td>
                    <td style="text-align:center;">
                      <div style="display:inline-flex; align-items:center; justify-content:center; gap:4px;">
                        <select class="table-sub-select no-print" data-idx="${idx}" style="font-weight:700; border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px; font-size:12px; cursor:pointer; color:${isO ? '#b91c1c' : '#15803d'};">
                          <option value="S" ${!isO ? 'selected' : ''}>S</option>
                          <option value="O" ${isO ? 'selected' : ''}>O</option>
                        </select>
                        ${isO ? `
                          <span class="no-print" style="font-size:11px; color:#64748b;">จำนวน:</span>
                          <input type="number" min="1" max="20" class="table-sub-nc-count no-print" data-idx="${idx}" value="${r.ncCount || 1}" style="width:45px; text-align:center; border:1px solid #f87171; border-radius:4px; padding:2px; font-weight:700; color:#b91c1c;">
                        ` : ''}
                        <span class="print-only" style="display:none; font-weight:700; color:${isO ? '#b91c1c' : '#15803d'};">${r.result}</span>
                      </div>
                    </td>
                    <td style="text-align:center;">-</td>
                  </tr>
                `
              }).join('')}
              <tr style="background:#f1f5f9; font-weight:800; border-top:2px solid #0f172a;">
                <td style="text-align:center;"></td>
                <td style="text-align:left;">ผลรวม</td>
                <td style="text-align:center;" id="report-total-full">${calc.totalFull}</td>
                <td style="text-align:center;">-</td>
                <td style="text-align:center;" id="report-total-score">${calc.totalScore}</td>
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
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
            <div style="font-weight:700; font-size:14px; color:#b91c1c; display:flex; align-items:center; gap:8px;">
              <span>⚠️ ข้อที่ควรทำการแก้ไข (Weak Point / Non-Conformity) :</span>
              <span style="font-size:12px; font-weight:600; padding:2px 8px; border-radius:4px; ${(data.weakPoints?.length || 0) === calc.totalFailed ? 'background:#dcfce7; color:#15803d; border:1px solid #86efac;' : 'background:#fef3c7; color:#b45309; border:1px solid #fde68a;'}">
                บันทึกรายละเอียดแล้ว ${(data.weakPoints?.length || 0)} / ${calc.totalFailed} ข้อ NC
              </span>
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
  const calc = calculateAuditScores(data)

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
      <p class="bold" style="font-size:16pt; color:${calc.percent < 80 ? '#cc0000' : calc.totalFailed > 0 ? '#003399' : '#006600'};">${calc.status}</p>
      <p>คะแนนรวมที่ได้จากการประเมิน : <span class="bold">${calc.percent} %</span> (สัดส่วน ${calc.totalScore} / ${calc.totalFull} ข้อ)</p>
      <p>จำนวนตัวควบคุมทั้งหมดที่ใช้ในการตรวจประเมิน = ${calc.totalFull} ตัวควบคุม</p>
      <p>จำนวนตัวควบคุมที่ไม่ผ่านการประเมิน = ${calc.totalFailed} ตัวควบคุม</p>

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
                <td class="text-center">${r.fullScore || '-'}</td>
                <td class="text-center" style="font-weight:bold; color:${r.result?.includes('NC') || r.result?.startsWith('O') ? '#cc0000' : '#006600'};">${r.result || ''}</td>
                <td class="text-center">${r.score !== '' ? r.score : '-'}</td>
              </tr>
            `
          }).join('')}
          <tr style="font-weight:bold; background-color:#eeeeee;">
            <td class="text-center"></td>
            <td class="text-left">ผลรวม</td>
            <td class="text-center">${calc.totalFull}</td>
            <td class="text-center">-</td>
            <td class="text-center">${calc.totalScore}</td>
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
      <p class="bold" style="color:#cc0000;">ข้อที่ควรทำการแก้ไข (Weak Point / Non-Conformity) :</p>

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
  const safeAgencyName = (data.agency || 'หน่วยงาน').replace(/[\s\/\:*?"<>|]/g, '_')
  a.href = url
  a.download = `Audit_Report_${safeAgencyName}_2569.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showNotification('ส่งออกไฟล์ Word (.doc) เรียบร้อยแล้ว', 'success')
}

export function bindAuditReportEvents(el, agency, activeReportId, onUpdate) {
  // Agency Change
  document.getElementById('report-agency-select')?.addEventListener('change', (e) => {
    onUpdate({ type: 'changeAgency', agency: e.target.value })
  })

  // Version / Date Change
  document.getElementById('report-version-select')?.addEventListener('change', (e) => {
    onUpdate({ type: 'changeReport', reportId: e.target.value })
  })

  // Create New Report
  document.getElementById('create-report-btn')?.addEventListener('click', () => {
    onUpdate({ type: 'createReport' })
  })

  // Delete Current Report
  document.getElementById('delete-report-btn')?.addEventListener('click', (e) => {
    const rId = e.currentTarget.dataset.id
    if (confirm('คุณต้องการลบรายงานรอบนี้ใช่หรือไม่?')) {
      onUpdate({ type: 'deleteReport', reportId: rId })
    }
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

  // Date pickers range
  const handleDateRangeChange = () => {
    const start = document.getElementById('report-start-date')?.value || ''
    const end = document.getElementById('report-end-date')?.value || ''
    const formatted = formatThaiDateRange(start, end)
    const dateInput = document.getElementById('report-date-input')
    if (dateInput) dateInput.value = formatted
    onUpdate({ type: 'updateDateRange', startDate: start, endDate: end, auditDate: formatted })
  }
  document.getElementById('report-start-date')?.addEventListener('change', handleDateRangeChange)
  document.getElementById('report-end-date')?.addEventListener('change', handleDateRangeChange)

  // Auditors textarea
  document.getElementById('report-auditors-input')?.addEventListener('change', (e) => {
    const list = e.target.value.split('\n').filter(s => s.trim())
    onUpdate({ type: 'updateField', field: 'auditors', value: list })
  })

  // Major Items 1 and 2 select (S or NC)
  el.querySelectorAll('.table-major-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.idx)
      onUpdate({ type: 'updateMajorResult', idx, resultType: e.target.value })
    })
  })

  // Major Items 1 and 2 ncCount input
  el.querySelectorAll('.table-major-nc-count').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.idx)
      const count = Number(e.target.value) || 1
      onUpdate({ type: 'updateMajorNcCount', idx, ncCount: count })
    })
  })

  // Sub Items 3.1.1 to 3.2.6 select (S or O)
  el.querySelectorAll('.table-sub-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.idx)
      onUpdate({ type: 'updateSubResult', idx, resultType: e.target.value })
    })
  })

  // Sub Items 3.1.1 to 3.2.6 ncCount input
  el.querySelectorAll('.table-sub-nc-count').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.idx)
      const count = Number(e.target.value) || 1
      onUpdate({ type: 'updateSubNcCount', idx, ncCount: count })
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
