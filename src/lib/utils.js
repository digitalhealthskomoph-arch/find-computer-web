// ==========================================
// Thai Utilities
// ==========================================

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                     'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']

const THAI_NUMERALS = ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙']

export function toThaiDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const day = d.getDate()
    const month = THAI_MONTHS[d.getMonth()]
    const year = d.getFullYear() + 543
    return `${day} ${month} ${year}`
  } catch { return dateStr }
}

export function toThaiNumeral(n) {
  return String(n).replace(/\d/g, d => THAI_NUMERALS[parseInt(d)])
}

export function thaiCurrency(num) {
  const n = parseFloat(num) || 0
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatCurrency(num) {
  const n = parseFloat(num) || 0
  return n.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function showNotification(message, type = 'success') {
  const existing = document.getElementById('notification-toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.id = 'notification-toast'
  const bg = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'
  toast.style.cssText = `position:fixed;top:20px;right:20px;z-index:9999;padding:12px 20px;
    border-radius:8px;background:${bg};color:#fff;font-size:14px;font-weight:500;
    box-shadow:0 4px 12px rgba(0,0,0,0.2);transition:opacity 0.3s;max-width:320px;`
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300) }, 3000)
}

export function generateId() {
  return 'M-' + Date.now()
}
