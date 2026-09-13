import { supabase } from '../../lib/supabase.js'
import { DEFAULT_ROPA_RECORDS } from './data/ropaConstants.js'

const LOCAL_STORAGE_KEY = 'sko_ropa_records'

export async function getRopaRecords() {
  try {
    const { data, error } = await supabase
      .from('ropa_records')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return data.map(mapFromSupabase)
    }
  } catch (e) {
    console.warn('Supabase ropa_records not available, using local storage fallback.')
  }

  // Fallback to localStorage or default
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {}

  return [...DEFAULT_ROPA_RECORDS]
}

export async function saveRopaRecord(record) {
  // 1. Update local storage
  let current = []
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    current = saved ? JSON.parse(saved) : [...DEFAULT_ROPA_RECORDS]
  } catch (e) {
    current = [...DEFAULT_ROPA_RECORDS]
  }

  const existingIdx = current.findIndex(r => r.id === record.id)
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...record }
  } else {
    current.unshift(record)
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current))
  } catch (e) {}

  // 2. Try saving to Supabase
  try {
    const sbData = mapToSupabase(record)
    await supabase.from('ropa_records').upsert(sbData, { onConflict: 'id' })
  } catch (e) {}

  return current
}

export async function deleteRopaRecord(id) {
  let current = []
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    current = saved ? JSON.parse(saved) : [...DEFAULT_ROPA_RECORDS]
  } catch (e) {
    current = [...DEFAULT_ROPA_RECORDS]
  }

  current = current.filter(r => r.id !== id)
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current))
  } catch (e) {}

  try {
    await supabase.from('ropa_records').delete().eq('id', id)
  } catch (e) {}

  return current
}

function mapToSupabase(r) {
  return {
    id: r.id,
    activity_name: r.activityName || r.dataType || '',
    department: r.department || '',
    data_type: r.dataType || r.activityName || '',
    classification: r.classification || 'ข้อมูลส่วนบุคคลทั่วไป',
    lawful_basis_24: r.lawfulBasis24 || 'Public Task (ภารกิจของรัฐ)',
    lawful_basis_26: r.lawfulBasis26 || 'None',
    purpose_collection: r.purposeCollection || '',
    data_owner: r.dataOwner || 'ผู้รับบริการ / ประชาชน / บุคลากร',
    import_method: r.importMethod || '',
    collection_source: r.collectionSource || '',
    physical_storage: r.physicalStorage || '',
    electronic_storage: r.electronicStorage || '',
    purpose_internal: r.purposeInternal || '',
    requesting_unit: r.requestingUnit || '',
    accessing_unit: r.accessingUnit || '',
    purpose_external: r.purposeExternal || '',
    external_org: r.externalOrg || '',
    transfer_method: r.transferMethod || '',
    retention_period: r.retentionPeriod || '10 ปี',
    disposal_method: r.disposalMethod || '',
    tech_measures: r.techMeasures || 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)',
    org_measures: r.orgMeasures || 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว',
    updated_year: r.updatedYear || '2568',
    updated_by: r.updatedBy || 'เจ้าหน้าที่ผู้รับผิดชอบ'
  }
}

function mapFromSupabase(sb) {
  return {
    id: sb.id,
    activityName: sb.activity_name,
    department: sb.department,
    dataType: sb.data_type,
    classification: sb.classification,
    lawfulBasis24: sb.lawful_basis_24,
    lawfulBasis26: sb.lawful_basis_26,
    purposeCollection: sb.purpose_collection,
    dataOwner: sb.data_owner,
    importMethod: sb.import_method || '',
    collectionSource: sb.collection_source || '',
    physicalStorage: sb.physical_storage || '',
    electronicStorage: sb.electronic_storage || '',
    purposeInternal: sb.purpose_internal || '',
    requestingUnit: sb.requesting_unit || '',
    accessingUnit: sb.accessing_unit || '',
    purposeExternal: sb.purpose_external || '',
    externalOrg: sb.external_org || '',
    transferMethod: sb.transfer_method || '',
    retentionPeriod: sb.retention_period,
    disposalMethod: sb.disposal_method || '',
    techMeasures: sb.tech_measures,
    orgMeasures: sb.org_measures,
    updatedYear: sb.updated_year || '2568',
    updatedBy: sb.updated_by || 'เจ้าหน้าที่ผู้รับผิดชอบ'
  }
}
