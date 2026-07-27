import fs from 'fs'

const sheetId = "1vRM9CNL_2mnfXiZLXM-U_De1Per98Cdl2G60-luNxTw"
const sheets = ["Meetings", "Units", "Items", "Records", "Committees"]

async function run() {
  for (const s of sheets) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${s}`
    const res = await fetch(url)
    const text = await res.text()
    console.log("SHEET:", s)
    console.log(text.split("\n").slice(0, 2).join("\n"))
    console.log("-----------------------")
  }
}

run()
