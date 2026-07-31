import { formatCurrency } from './utils.js'
import { exportToWord } from './minutes.js'

export function buildSummaryHTML(meeting, records) {
  const grouped = {}
  records.forEach(r => {
    const d = r.district || 'ไม่ระบุ'
    const a = r.agency || 'ไม่ระบุ'
    if (!grouped[d]) grouped[d] = {}
    if (!grouped[d][a]) grouped[d][a] = []
    grouped[d][a].push(r)
  })

  let tableBody = ''
  
  if (records.length === 0) {
    tableBody = '<tr><td colspan="14" style="text-align:center; padding:20px;">ไม่มีรายการคำขอในรอบการประชุมนี้</td></tr>'
  }

  for (const district in grouped) {
    tableBody += `
      <tr>
        <td colspan="14" style="border:1px solid black; padding:4px; font-weight:bold; background:#f0f0f0;">อำเภอ${escHtml(district)}</td>
      </tr>
    `
    for (const agency in grouped[district]) {
      const items = grouped[district][agency]
      items.forEach((item, index) => {
        const isFirst = index === 0
        
        let charOk = '', charNotOk = '', charNone = ''
        const char = item.characteristics || ''
        if (char.includes('ไม่ตรงเกณฑ์') || char.includes('ไม่ตรงตามเกณฑ์')) charNotOk = '/'
        else if (char.includes('ตรงเกณฑ์') || char.includes('ตรงตามเกณฑ์')) charOk = '/'
        else charNone = '/'

        let method = escHtml(item.procurement_method || '')
        if (item.procurement_method === 'ทดแทน' && item.replacement_num) {
          method += '<br>(' + escHtml(item.replacement_num) + ')'
        }
        
        let res = escHtml(item.resolution_type || item.resolution || 'เห็นชอบ')
        if (res === 'อื่นๆ' && item.resolution_comment) res += '<br>' + escHtml(item.resolution_comment)

        tableBody += `
          <tr>
            ${isFirst ? `<td rowspan="${items.length}" style="border:1px solid black; padding:4px; vertical-align:top;">${escHtml(agency)}</td>` : ''}
            <td style="border:1px solid black; padding:4px; text-align:center;">${index + 1}</td>
            <td style="border:1px solid black; padding:4px;">${escHtml(item.item_name || '')}</td>
            <td style="border:1px solid black; padding:4px; text-align:center;">${item.quantity || ''}</td>
            <td style="border:1px solid black; padding:4px; text-align:center;">${escHtml(item.unit || '')}</td>
            <td style="border:1px solid black; padding:4px; text-align:right;">${item.standard_price ? formatCurrency(item.standard_price) : '-'}</td>
            <td style="border:1px solid black; padding:4px; text-align:right;">${formatCurrency(item.unit_price)}</td>
            <td style="border:1px solid black; padding:4px; text-align:right; font-weight:bold;">${formatCurrency(item.total_price)}</td>
            <td style="border:1px solid black; padding:4px; text-align:center;">${charOk}</td>
            <td style="border:1px solid black; padding:4px; text-align:center;">${charNotOk}</td>
            <td style="border:1px solid black; padding:4px; text-align:center;">${charNone}</td>
            <td style="border:1px solid black; padding:4px; text-align:center;">${escHtml(item.funding_source || '')}</td>
            <td style="border:1px solid black; padding:4px; text-align:center;">${method}</td>
            <td style="border:1px solid black; padding:4px; text-align:center;">${res}</td>
          </tr>
        `
      })
    }
  }

  return `
    <div id="print-summary-container" style="padding:20px;">
      <style>
        @media print {
          @page { size: A4 landscape; margin: 1cm 1cm 1cm 1cm; }
          #print-summary-container { font-family: 'TH Sarabun PSK', 'TH Sarabun New', Sarabun, sans-serif !important; }
          .no-print { display: none !important; }
        }
        table.summary-table th, table.summary-table td {
          border: 1px solid black;
          padding: 4px;
        }
        table.summary-table th {
          text-align: center;
          font-weight: bold;
          vertical-align: middle;
        }
      </style>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;" class="no-print">
        <h2 style="font-size:1.2rem; font-weight:bold;">ตัวอย่างรายงานแบบสรุปการจัดหา</h2>
        <div>
          <button class="btn btn-outline" onclick="window.print()">🖨 พิมพ์แบบสรุป (PDF)</button>
          <button class="btn btn-primary" onclick="exportSummaryWord()">📄 โหลดเป็น Word</button>
        </div>
      </div>
      <div style="text-align:center; font-weight:bold; font-size:16pt; margin-bottom:12px;" class="print-black">
        แบบสรุปการจัดหาระบบคอมพิวเตอร์ ประจำสำนักงานสาธารณสุขจังหวัดสระแก้ว<br>
        ${escHtml(meeting.name || '')}
      </div>
      <table class="summary-table print-black" style="width:100%; border-collapse:collapse; font-size:14pt;">
        <thead>
          <tr>
            <th rowspan="2" style="width:10%;">หน่วยงาน</th>
            <th rowspan="2" style="width:4%;">ลำดับ<br>รายการ</th>
            <th rowspan="2" style="width:16%;">รายการครุภัณฑ์</th>
            <th rowspan="2" style="width:4%;">จำนวน</th>
            <th rowspan="2" style="width:6%;">หน่วยนับ</th>
            <th rowspan="2" style="width:7%;">ราคากลาง</th>
            <th rowspan="2" style="width:7%;">ราคาต่อหน่วย<br>(บาท)</th>
            <th rowspan="2" style="width:8%;">วงเงินรวม<br>(บาท)</th>
            <th colspan="3">คุณลักษณะ</th>
            <th rowspan="2" style="width:7%;">แหล่งเงิน(ระบุ)</th>
            <th rowspan="2" style="width:8%;">วิธีการจัดหา<br>(จัดหาใหม่,ทดแทน<br>,เพิ่มประสิทธิภาพ)</th>
            <th rowspan="2" style="width:8%;">มติความ<br>เห็นชอบ<br>คณะกรรมการฯ</th>
          </tr>
          <tr>
            <th style="width:5%;">ตรง<br>เกณฑ์ฯ</th>
            <th style="width:5%;">ไม่ตรง<br>เกณฑ์ฯ</th>
            <th style="width:5%;">ไม่มีใน<br>เกณฑ์ฯ</th>
          </tr>
        </thead>
        <tbody>
          ${tableBody}
        </tbody>
      </table>
    </div>
  `
}

export function exportSummaryToWord(htmlContent, filename) {
  exportToWord(htmlContent, filename, true)
}

function escHtml(str) {
  if (str === null || str === undefined) return ''
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]))
}
