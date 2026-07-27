import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { parse } from 'csv-parse/sync'
import fs from 'fs'

dotenv.config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for migration!

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sheetId = "1vRM9CNL_2mnfXiZLXM-U_De1Per98Cdl2G60-luNxTw"
const sheets = ["Meetings", "Units", "Items", "Records", "Committees"]

async function fetchCsv(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
  const res = await fetch(url)
  const text = await res.text()
  return parse(text, { columns: true, skip_empty_lines: true })
}

function parseNum(str) {
  if (!str) return 0
  return parseFloat(str.replace(/,/g, '')) || 0
}

async function migrate() {
  console.log("🚀 เริ่มการย้ายข้อมูล...")

  // 1. Meetings
  console.log("📦 กำลังโหลด Meetings...")
  const meetingsData = await fetchCsv("Meetings")
  const meetingMap = {} // old string id => new UUID
  for (const row of meetingsData) {
    const meetingDateRaw = row[''] || row['Created Date'] || ''
    let mDate = null
    if (meetingDateRaw.match(/^\d{4}-\d{2}-\d{2}$/)) {
      mDate = meetingDateRaw
    }
    const { data, error } = await supabase.from('meetings').insert({
      name: row['Meeting Name'],
      meeting_date: mDate,
      status: row['Status'] || 'active'
    }).select().single()
    
    if (error) { console.error("Meeting Error:", error.message); continue }
    meetingMap[row['Meeting ID']] = data.id
  }

  // 2. Units (Districts & Agencies)
  console.log("📦 กำลังโหลด Units...")
  const unitsData = await fetchCsv("Units")
  const districts = [...new Set(unitsData.map(u => u['อำเภอ']).filter(Boolean))]
  const districtMap = {} // name => uuid
  
  for (const d of districts) {
    const { data } = await supabase.from('districts').upsert({ name: d }, { onConflict: 'name' }).select().single()
    if (data) districtMap[d] = data.id
  }

  for (const row of unitsData) {
    const dName = row['อำเภอ']
    const aName = row['หน่วยงาน']
    if (dName && aName && districtMap[dName]) {
      await supabase.from('agencies').insert({
        district_id: districtMap[dName],
        name: aName
      })
    }
  }

  // 3. Items
  console.log("📦 กำลังโหลด Items...")
  const itemsData = await fetchCsv("Items")
  for (const row of itemsData) {
    const name = row['รายการครุภัณฑ์']
    if (!name) continue
    await supabase.from('items').upsert({
      name: name,
      unit: row['หน่วยนับ'] || 'เครื่อง',
      standard_price: parseNum(row['ราคากลาง'])
    }, { onConflict: 'name' })
  }

  // 4. Committees
  console.log("📦 กำลังโหลด Committees...")
  const commData = await fetchCsv("Committees")
  for (const row of commData) {
    if (!row['ชื่อ-สกุล']) continue
    await supabase.from('committees').insert({
      order_num: parseInt(row['ลำดับ']) || 0,
      prefix: row['คำนำหน้า'] || '',
      full_name: row['ชื่อ-สกุล'],
      position: row['ตำแหน่ง'] || ''
    })
  }

  // 5. Records
  console.log("📦 กำลังโหลด Records...")
  const recordsData = await fetchCsv("Records")
  const recordsToInsert = []
  
  for (const row of recordsData) {
    const mId = meetingMap[row['Meeting ID']]
    if (!mId) {
      console.warn(`ข้าม Record ของ Meeting ID ที่ไม่พบ: ${row['Meeting ID']}`)
      continue
    }
    
    recordsToInsert.push({
      meeting_id: mId,
      district: row['District'],
      agency: row['Agency'],
      item_name: row['Item Name'],
      quantity: parseInt(row['Quantity']) || 1,
      unit: row['Unit'],
      standard_price: parseNum(row['Standard Price']),
      unit_price: parseNum(row['Unit Price']),
      total_price: parseNum(row['Total Price']),
      characteristics: row['Characteristics'],
      funding_source: row['Funding Source'],
      procurement_method: row['Procurement Method'],
      resolution: row['Resolution'] || 'เห็นชอบ',
      resolution_type: row['Resolution'] || 'เห็นชอบ',
      resolution_comment: row['Resolution Comment'],
      replacement_num: row['Replacement Number']
    })
  }
  
  if (recordsToInsert.length > 0) {
    const { error } = await supabase.from('records').insert(recordsToInsert)
    if (error) console.error("Records Error:", error.message)
  }

  console.log("✅ ย้ายข้อมูลเสร็จสมบูรณ์!")
}

migrate()
