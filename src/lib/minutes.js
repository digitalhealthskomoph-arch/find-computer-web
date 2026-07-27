import { toThaiDate, toThaiNumeral, thaiCurrency } from './utils.js'

// ==========================================
// Build Meeting Minutes HTML
// ==========================================
export function buildMinutesHTML(opts) {
  const {
    meetingName, dateDisplay, attended, absent,
    recorder, checker, qrBase64,
    agenda3Items, agenda2Text, agenda5Text,
    allMeetings, currentMeetingId,
    reportData, totalAgencies,
    countMatch, countNotMatch, countNoSpec, totalRecords
  } = opts

  // Prev meeting for agenda 2
  const sortedMeetings = [...(allMeetings || [])].sort((a, b) => {
    const dA = a.meeting_date || a.created_at || 0
    const dB = b.meeting_date || b.created_at || 0
    return new Date(dA) - new Date(dB)
  })
  const curIdx = sortedMeetings.findIndex(m => String(m.id) === String(currentMeetingId))
  const prevMeeting = curIdx > 0 ? sortedMeetings[curIdx - 1] : null
  const prevName = prevMeeting ? prevMeeting.name || '' : ''
  const prevDateDisplay = prevMeeting ? toThaiDate(prevMeeting.meeting_date || prevMeeting.created_at) : ''

  // Agenda 2 display
  const agenda2Display = agenda2Text
    ? agenda2Text.replace(/\n/g, '<br>')
    : 'รับรองรายงานการประชุม' + (prevName ? '(' + prevName + ')' : '') + (prevDateDisplay ? ' วันที่ ' + prevDateDisplay : '')

  // Attendee list HTML
  function attendeeListHTML(list) {
    if (!list || list.length === 0) return '<div style="padding-left:2cm;">(ไม่มี)</div>'
    return list.map((p, i) => {
      const num = toThaiNumeral(i + 1)
      return '<div style="text-indent:2cm;margin-bottom:2px;">'
        + num + '. ' + (p.prefix || '') + (p.full_name || p.name || '') + ' '
        + '<span style="font-size:14pt;color:#444;">' + (p.position || '') + '</span></div>'
    }).join('')
  }

  // Agenda 3 HTML
  let agenda3HTML = ''
  if (!agenda3Items || agenda3Items.length === 0) {
    agenda3HTML = '<div style="font-weight:bold;margin-bottom:12px;">ระเบียบวาระที่ ๓ เรื่องเสนอเพื่อทราบ (ไม่มี)</div>'
  } else {
    agenda3HTML = '<div style="font-weight:bold;margin-bottom:4px;">ระเบียบวาระที่ ๓ เรื่องเสนอเพื่อทราบ</div>'
    agenda3Items.forEach((item, i) => {
      const thaiNum = toThaiNumeral(i + 1)
      const titleHtml = item.title ? item.title.replace(/\n/g, '<br>') : ''
      agenda3HTML += '<div style="text-indent:2cm;margin-bottom:2px;word-wrap:break-word;">๓.' + thaiNum + ' ' + titleHtml + '</div>'
        + '<div style="text-indent:2cm;font-weight:bold;margin-bottom:8px;">มติ ' + (item.resolution || 'รับทราบ') + '</div>'
    })
  }

  // Agenda 4 HTML
  let agenda4Body = ''
  if (reportData && Object.keys(reportData).length > 0) {
    let districtNum = 0
    Object.keys(reportData).forEach(district => {
      districtNum++
      const districtThai = toThaiNumeral(districtNum)
      const agencies = reportData[district]
      let agencyNum = 0
      Object.keys(agencies).forEach(agency => {
        agencyNum++
        const agThai = toThaiNumeral(agencyNum)
        const agRecs = agencies[agency]
        let agTotal = 0
        let appCount = 0, condCount = 0, rejCount = 0

        agRecs.forEach(r => {
          agTotal += parseFloat(r.total_price || r.totalPrice) || 0
          const rType = (r.resolution_type || r.resolutionType || r.resolution || 'เห็นชอบ').trim()
          if (rType === 'อื่นๆ') condCount++
          else if (rType === 'เห็นชอบ' || rType.indexOf('เห็นชอบ') === 0) appCount++
          else if (rType === 'ไม่เห็นชอบ' || rType.indexOf('ไม่เห็นชอบ') === 0) rejCount++
        })

        let resTextHTML = ''
        if (appCount === agRecs.length) {
          resTextHTML = '<div style="text-indent:4cm;font-weight:bold;margin-bottom:6px;">มติ เห็นชอบให้ดำเนินการทั้ง ' + toThaiNumeral(appCount) + ' รายการ</div>'
        } else {
          resTextHTML = '<div style="text-indent:4cm;font-weight:bold;margin-bottom:2px;">มติ ที่ประชุมพิจารณาแล้วมีมติดังนี้:</div>'
          if (appCount > 0) {
            const appItems = agRecs.map((r, idx) => {
              const rT = (r.resolution_type || r.resolutionType || r.resolution || 'เห็นชอบ').trim()
              return (rT === 'เห็นชอบ' || (rT.indexOf('เห็นชอบ') === 0 && rT !== 'อื่นๆ')) ? 'รายการที่ ' + toThaiNumeral(idx + 1) : null
            }).filter(Boolean).join(', ')
            resTextHTML += '<div style="text-indent:4.5cm;margin-bottom:4px;">- <span style="font-weight:bold;">เห็นชอบให้ดำเนินการ</span> จำนวน ' + toThaiNumeral(appCount) + ' รายการ (' + appItems + ')</div>'
          }
          if (condCount > 0) {
            const condDetails = agRecs.map((r, idx) => {
              const rT = (r.resolution_type || r.resolutionType || r.resolution || 'เห็นชอบ').trim()
              if (rT === 'อื่นๆ') {
                const comm = r.resolution_comment || r.resolutionComment || ''
                return 'รายการที่ ' + toThaiNumeral(idx + 1) + ' (' + (r.item_name || r.itemName || 'ไม่ระบุ') + ')' + (comm ? ' เหตุผล: ' + comm : '')
              }
              return null
            }).filter(Boolean).join('; ')
            resTextHTML += '<div style="text-indent:4.5cm;margin-bottom:4px;color:#f57c00;" class="print-black">- <span style="font-weight:bold;">อื่นๆ</span> จำนวน ' + toThaiNumeral(condCount) + ' รายการ ได้แก่ ' + condDetails + '</div>'
          }
          if (rejCount > 0) {
            const rejDetails = agRecs.map((r, idx) => {
              const rT = (r.resolution_type || r.resolutionType || r.resolution || 'เห็นชอบ').trim()
              if (rT === 'ไม่เห็นชอบ' || rT.indexOf('ไม่เห็นชอบ') === 0) {
                const comm = r.resolution_comment || r.resolutionComment || ''
                return 'รายการที่ ' + toThaiNumeral(idx + 1) + ' (' + (r.item_name || r.itemName || 'ไม่ระบุ') + ')' + (comm ? ' เหตุผล: ' + comm : '')
              }
              return null
            }).filter(Boolean).join('; ')
            resTextHTML += '<div style="text-indent:4.5cm;margin-bottom:4px;color:#d32f2f;" class="print-black">- <span style="font-weight:bold;">ไม่เห็นชอบ</span> จำนวน ' + toThaiNumeral(rejCount) + ' รายการ ได้แก่ ' + rejDetails + '</div>'
          }
        }

        agenda4Body += '<div style="text-indent:3cm;margin-bottom:2px;">'
          + '๔.' + districtThai + '.' + agThai + ' ' + agency + ' จำนวน ' + toThaiNumeral(agRecs.length) + ' รายการ รวมเป็นเงิน ' + thaiCurrency(agTotal) + ' บาท'
          + '</div>' + resTextHTML
      })
    })
  } else {
    agenda4Body = '<div style="text-indent:2cm;">(ไม่มีรายการ)</div>'
  }

  // Signature & QR
  let recorderSig = ''
  if (recorder) {
    recorderSig = '<div style="display:inline-block;width:45%;text-align:center;margin:0 2%;">'
      + '<div style="margin-bottom:40px;">&nbsp;</div>'
      + '<div>....................................................................</div>'
      + '<div>(' + recorder + ')</div>'
      + '<div>ผู้บันทึกรายงานการประชุม</div></div>'
  }
  let checkerSig = ''
  if (checker) {
    checkerSig = '<div style="display:inline-block;width:45%;text-align:center;margin:0 2%;">'
      + '<div style="margin-bottom:40px;">&nbsp;</div>'
      + '<div>....................................................................</div>'
      + '<div>(' + checker + ')</div>'
      + '<div>ผู้ตรวจรายงานการประชุม</div></div>'
  }
  let qrHtml = ''
  if (qrBase64) {
    qrHtml = '<div style="display:inline-block;text-align:center;">'
      + '<img src="' + qrBase64 + '" style="width:100px;height:100px;object-fit:contain;display:block;margin:0 auto;" alt="QR Code">'
      + '<div style="font-size:14pt;text-align:center;margin-top:6px;font-weight:bold;">QRcode เอกสารประชุม</div></div>'
  }
  const sigHtml = (recorderSig || checkerSig) ? recorderSig + checkerSig : ''
  const bottomTable = '<table style="width:100%;margin-top:40px;border-collapse:collapse;border:none;page-break-inside:avoid;"><tr>'
    + '<td style="width:35%;vertical-align:bottom;text-align:left;border:none;padding:0;">' + qrHtml + '</td>'
    + '<td style="vertical-align:bottom;text-align:center;border:none;padding:0;">' + sigHtml + '</td>'
    + '</tr></table>'

  // Agenda 5 HTML
  const agenda5Display = agenda5Text
    ? agenda5Text.replace(/\n/g, '<br>')
    : '(ไม่มี)'

  return `
  <div style="font-family:'TH Sarabun PSK','TH Sarabun New','Sarabun',sans-serif;font-size:16pt;line-height:1.5;color:#000;">
    <div style="text-align:center;font-weight:bold;font-size:18pt;line-height:1.5;">
      รายงานการประชุม<br>
      คณะกรรมการบริหารและจัดหาระบบคอมพิวเตอร์ภาครัฐประจำสำนักงานสาธารณสุขจังหวัดสระแก้ว<br>
      ${meetingName}<br>
      <span style="font-size:16pt;">${dateDisplay} เวลา ๑๐.๐๐ น. ผ่านระบบ Video Conference</span>
    </div>
    <div style="text-align:center;font-size:16pt;letter-spacing:4px;margin:8px 0 16px;">***************************</div>

    <div style="font-weight:bold;margin-bottom:4px;">ผู้มาประชุม</div>
    ${attendeeListHTML(attended)}

    <div style="font-weight:bold;margin-top:12px;margin-bottom:4px;">ผู้ไม่มาประชุม</div>
    ${absent && absent.length > 0 ? attendeeListHTML(absent) : '<div style="padding-left:2cm;">(ไม่มี)</div>'}

    <div style="font-weight:bold;margin-top:16px;margin-bottom:4px;">เริ่มประชุมเวลา ๑๐.๐๐ น.</div>
    <div style="text-indent:2cm;margin-bottom:12px;">ประธานกล่าวเปิดการประชุม และดำเนินการตามระเบียบวาระการประชุมดังต่อไปนี้</div>

    <div style="font-weight:bold;margin-bottom:4px;">ระเบียบวาระที่ ๑ เรื่องที่ประธานแจ้งให้ประชุมทราบ</div>
    <div style="text-indent:2cm;margin-bottom:12px;">
      การประชุมครั้งนี้เพื่อพิจารณารายงานการบริหารและจัดหาระบบคอมพิวเตอร์ภาครัฐของหน่วยงานในสังกัดทั้งหมด ${toThaiNumeral(totalAgencies || 0)} แห่ง
      รวมเป็นรายการที่ตรงตามเกณฑ์คุณลักษณะราคากลาง ${toThaiNumeral(countMatch || 0)} รายการ,
      ไม่ตรงตามเกณฑ์คุณลักษณะราคากลาง ${toThaiNumeral(countNotMatch || 0)} รายการ
      และไม่มีในเกณฑ์ราคากลาง ${toThaiNumeral(countNoSpec || 0)} รายการ
      รวมทั้งสิ้น ${toThaiNumeral(totalRecords || 0)} รายการ
    </div>

    <div style="font-weight:bold;margin-bottom:4px;">ระเบียบวาระที่ ๒ รับรองรายงานการประชุม</div>
    <div style="text-indent:2cm;margin-bottom:4px;">${agenda2Display}</div>
    <div style="text-indent:2cm;font-weight:bold;margin-bottom:12px;">มติ ที่ประชุมรับทราบ</div>

    ${agenda3HTML}

    <div style="font-weight:bold;margin-bottom:4px;">ระเบียบวาระที่ ๔ เรื่องที่เสนอให้ที่ประชุมพิจารณา</div>
    ${agenda4Body}

    <div style="font-weight:bold;margin-top:10px;margin-bottom:4px;">ระเบียบวาระที่ ๕ เรื่องเสนออื่น ๆ</div>
    <div style="text-indent:2cm;margin-bottom:16px;">${agenda5Display}</div>

    ${bottomTable}
  </div>`
}

// ==========================================
// Export to Word
// ==========================================
export function exportToWord(htmlContent, filename, landscape = false) {
  const pageSize = landscape
    ? 'size: 841.9pt 595.3pt;'
    : 'size: 595.3pt 841.9pt;'
  const margin = landscape
    ? 'margin: 1.5cm 1.5cm 1.5cm 2cm;'
    : 'margin: 2.5cm 2cm 2cm 3cm;'

  const h1 = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
  const h2 = '<head><meta charset="utf-8"><title>' + filename + '</title>'
  const h3 = '<style>@page Section1 { ' + pageSize + ' ' + margin + ' mso-header-margin:35.4pt;mso-footer-margin:35.4pt;mso-paper-source:0; } div.Section1 { page:Section1; } body { font-family:"TH Sarabun PSK","TH Sarabun New","Sarabun",sans-serif;font-size:16pt;line-height:1.5;color:#000; } table { width:100%;border-collapse:collapse; } th,td { border:1pt solid black;padding:4pt 6pt;vertical-align:top; } .print-black { color: #000 !important; }</style></head><body><div class="Section1">'
  const footer = '</div></body></html>'
  const sourceHTML = h1 + h2 + h3 + htmlContent + footer

  const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = filename + '.doc'
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
