-- =======================================================
-- ตารางทะเบียนกิจกรรมการประมวลผลข้อมูลส่วนบุคคล (ROPA)
-- สำหรับระบบบูรณาการดิจิทัล สสจ.สระแก้ว
-- โครงสร้างฐานข้อมูลรองรับข้อมูลตามมาตรฐาน ROPA สสจ.สระแก้ว (22 คอลัมน์)
-- =======================================================

CREATE TABLE IF NOT EXISTS public.ropa_records (
    id TEXT PRIMARY KEY,
    activity_name TEXT NOT NULL,
    department TEXT NOT NULL,
    data_type TEXT NOT NULL,
    classification TEXT DEFAULT 'ข้อมูลส่วนบุคคลทั่วไป',
    lawful_basis_24 TEXT NOT NULL,
    lawful_basis_26 TEXT DEFAULT 'N/A (ไม่ใช่ข้อมูลอ่อนไหว)',
    purpose_collection TEXT NOT NULL,
    data_owner TEXT DEFAULT 'ผู้รับบริการ / ประชาชน / บุคลากร',
    import_method TEXT DEFAULT '',
    collection_source TEXT DEFAULT '',
    physical_storage TEXT DEFAULT '',
    electronic_storage TEXT DEFAULT 'Share Drive / ฐานข้อมูลระบบ',
    purpose_internal TEXT DEFAULT '',
    requesting_unit TEXT DEFAULT '',
    accessing_unit TEXT DEFAULT '',
    purpose_external TEXT DEFAULT '',
    external_org TEXT DEFAULT '',
    transfer_method TEXT DEFAULT '',
    retention_period TEXT DEFAULT '10 ปี',
    disposal_method TEXT DEFAULT 'ลบจากฐานข้อมูลถาวร',
    tech_measures TEXT DEFAULT 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)',
    org_measures TEXT DEFAULT 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว',
    updated_year TEXT DEFAULT '2568',
    updated_by TEXT DEFAULT 'เจ้าหน้าที่ผู้รับผิดชอบ',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE public.ropa_records ENABLE ROW LEVEL SECURITY;

-- นโยบาย RLS (Row Level Security)
DROP POLICY IF EXISTS "Allow public read on ropa_records" ON public.ropa_records;
CREATE POLICY "Allow public read on ropa_records" ON public.ropa_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert and update on ropa_records" ON public.ropa_records;
CREATE POLICY "Allow public insert and update on ropa_records" ON public.ropa_records FOR ALL USING (true) WITH CHECK (true);

-- =======================================================
-- ข้อมูลตั้งต้นที่ Migrate มาจาก ROPA System.xlsx (26 รายการ)
-- =======================================================
INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202511-7539', 'ทำเนียบผู้บริหารสาธารณสุขสระแก้ว (ชื่อ-สกุล,ที่อยู่,อีเมลล์,เบอร์โทร)', 'กลุ่มงานยุทธศาสตร์และสาธารณสุข', 'ทำเนียบผู้บริหารสาธารณสุขสระแก้ว (ชื่อ-สกุล,ที่อยู่,อีเมลล์,เบอร์โทร)', 'ข้อมูลส่วนบุคคลทั่วไป', 'Public Task (ภารกิจของรัฐ)', 'N/A (ไม่ใช่ข้อมูลอ่อนไหว)', 'เพื่อใช้ติดต่อสื่อสารภารกิจที่สำคัญทางด้านสาธารณสุข', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากเจ้าของข้อมูลโดยตรง', 'google sheets', '', 'Share Drive', 'เพื่อให้กลุ่มงานที่ต้องการใช้ติดต่อสื่อสารภารกิจที่สำคัญทางด้านสาธารณสุข', 'ทุกกลุ่มงานในสำนักงานสาธารณสุขจังหวัดสระแก้ว', 'IT', '-', '-', '', '-', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', '-', '-', '2568', 'เจ้าหน้าที่กลุ่มงานยุทธศาสตร์และสาธารณสุข')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202512-1632', 'ข้อมูลรายงานกรณีมารดาเสียชีวิต', 'กลุ่มงานส่งเสริมสุขภาพ', 'ข้อมูลรายงานกรณีมารดาเสียชีวิต', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อเก็บรายงาน สถิติ ในด้านระบบบริการ', 'ผู้รับบริการ / บุคลากรสาธารณสุข', '', 'Google drive ,โฟล์เอกสาร', 'อื่นๆ', 'Share Drive', '', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2568', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202512-2732', 'ทะเบียนติดตามหญิงตั้งครรภ์เสี่ยงสูงรายบุคคล', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนติดตามหญิงตั้งครรภ์เสี่ยงสูงรายบุคคล', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อติดตามสถานะสุขภาพ เก็บสถิติ และเก็บรายงานระบบบริการสุขภาพ', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google drive ,โฟล์เอกสาร ,Web App.', 'อื่นๆ', 'Share Drive', 'ผู้ร่วมพัฒนาระบบ Web App.', 'กลุ่มงานสุขภาพดิจิทัล', 'กลุ่มงานสุขภาพดิจิทัล', '', '', '', 'ตลอดอายุใช้งาน', 'ลบจากฐานข้อมูลถาวร', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2568', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202512-8166', 'ทะเบียนเจ้าหน้าที่ผู้รับผิดชอบงานอนามัยแม่และเด็ก', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนเจ้าหน้าที่ผู้รับผิดชอบงานอนามัยแม่และเด็ก', 'ข้อมูลส่วนบุคคลทั่วไป', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อเป็นรายงานผู้ประสานระดับจังหวัด', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google drive ,โฟล์เอกสาร', 'อื่นๆ', 'Share Drive', '', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2568', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202512-7248', 'ทะเบียนผู้รับอนุญาตสถานประกอบการด้านสุขภาพ', 'กลุ่มงานคุ้มครองผู้บริโภค', 'ทะเบียนผู้รับอนุญาตสถานประกอบการด้านสุขภาพ', 'ข้อมูลส่วนบุคคลทั่วไป', 'Legitimate Interest (ประโยชน์โดยชอบด้วยกฎหมาย)', 'N/A (ไม่ใช่ข้อมูลอ่อนไหว)', 'เพื่อประกอบการขออนุญาตต่างๆ ตาม พรบ. อาหาร ยา เครื่องสำอาง เครื่องมือแพทย์ ประมวลกฎหมายยาเสพติด สมุนไพร สถานพยาบาล สถานบริการ และอื่นๆ ที่เกี่ยวกับผลิตภัณฑ์สุขภาพและบริการสุขภาพ', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากเจ้าของข้อมูลโดยตรง', 'จัดเก็บข้อมูลในระบบ e-Submission ของ อย. / ระบบ Bizportal ของกรม สบส. / เอกสารและ', 'อื่นๆ', 'ระบบฐานข้อมูล', 'ตรวจสอบความถูกต้องในการอนุญาต', 'n/a', 'n/a', 'ตรวจสอบความถูกต้องในการอนุญาต', 'สำนักงานคณะกรรมการอาหารและยา/กรมสนับสนุนบริการสุขภาพ', 'อิเล็กทรอนิกส์', 'ตลอดอายุสัญญา', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2568', 'เจ้าหน้าที่กลุ่มงานคุ้มครองผู้บริโภค')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-4644', 'ทะเบียนโรคเบาหวาน โรคความดันโลหิตสูง โรคไต', 'กลุ่มงานควบคุมโรคไม่ติดต่อ', 'ทะเบียนโรคเบาหวาน โรคความดันโลหิตสูง โรคไต', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'ใช้เพื่อเป็นฐานข้อมูลในการวิเคราะห์ทางสถิติ การคัดกรอง วินิจฉัย รักษาโรคไม่ติดต่อเรื้อรัง และใช้ประกอบการเบิกจ่ายงบประมาณโครงการที่เกี่ยวข้อง (สปสช.)', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'รับต่อมาจาก รพ./สสอ', '', '', 'Share Drive / ฐานข้อมูลระบบ', '', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานควบคุมโรคไม่ติดต่อ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-2011', 'ทะเบียนหญิงตั้งครรภ์ที่เข้าโครงการงบ PPA', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนหญิงตั้งครรภ์ที่เข้าโครงการงบ PPA', 'ข้อมูลส่วนบุคคลทั่วไป', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อวิเคราะห์ผลสุขภาพ กระบวนการ และการเบิกจ่ายงบ PPA', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google drive ,โฟล์เอกสาร', 'อื่นๆ', 'Share Drive', '-', '', '', 'เพื่อวิเคราะห์ข้อมูลสุขภาพ และการเบิกจ่ายงบประมาณ', 'สปสช. เขต 6 ระยอง', 'อิเล็กทรอนิกส์', '10 ปี', 'ลบจากฐานข้อมูลถาวร', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-9631', 'ข้อมูลการคัดเลือกบุคคลการดีเด่นระดับจังหวัด ผ่านคณะกรรมการฯ', 'กลุ่มงานพัฒนาทรัพยากรบุคคล', 'ข้อมูลการคัดเลือกบุคคลการดีเด่นระดับจังหวัด ผ่านคณะกรรมการฯ', 'ข้อมูลส่วนบุคคลทั่วไป', 'Public Task (ภารกิจของรัฐ)', 'N/A (ไม่ใช่ข้อมูลอ่อนไหว)', 'ใช้เพื่อเป็นเอกสารประกอบการพิจารณาบุคคลากรดีเด่นระดับจังหวัด', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากเจ้าตัวโดยตรง', 'เอกสารใบสมัคร, google drive', 'เข้าแฟ้ม', 'เครื่องคอมพิวเตอร์', 'ใช้เพื่อเป็นเอกสารประกอบการพิจารณาบุคคลากรดีเด่นระดับจังหวัด', '', 'IT', 'เพื่อประกาศผลการคัดเลือก', 'สำนักงานปลัดกระทรวงมหาดไทย', 'ทั้งสองรูปแบบ', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', '-', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานพัฒนาทรัพยากรบุคคล')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-2336', 'ทะเบียนควบคุมกำกับการเผยแพร่งานวิจัย/งานวิชาการผ่านเว็บไซต์', 'กลุ่มงานพัฒนาทรัพยากรบุคคล', 'ทะเบียนควบคุมกำกับการเผยแพร่งานวิจัย/งานวิชาการผ่านเว็บไซต์', 'ข้อมูลส่วนบุคคลทั่วไป', 'Public Task (ภารกิจของรัฐ)', 'N/A (ไม่ใช่ข้อมูลอ่อนไหว)', 'เพื่อเป็นฐานข้อมูลกลาง (Central Database) ที่รวบรวมองค์ความรู้ด้านสุขภาพในเขตพื้นที่จังหวัดสระแก้ว', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากเจ้าของข้อมูลโดยตรง', 'google sheets', 'เข้าแฟ้ม', 'Share Drive', 'เป็นฐานข้อมูลกลาง (Central Database) ที่รวบรวมองค์ความรู้ด้านสุขภาพในเขตพื้นที่จังหวัดสระแก้ว', 'ทุกกลุ่มงานในสำนักงานสาธารณสุขจังหวัดสระแก้ว', 'IT', 'เพื่อให้บุคลากรสาธารณสุขในพื้นที่อื่น นักวิชาการ และประชาชนทั่วไปสามารถเข้าถึงผลงานวิจัยที่เป็นประโยชน์ด้านสุขภาพ', '', 'อิเล็กทรอนิกส์', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานพัฒนาทรัพยากรบุคคล')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-4878', 'ทะเบียนติดตามหญิงตั้งครรภ์วัยรุ่น', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนติดตามหญิงตั้งครรภ์วัยรุ่น', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อติดตามสถานการณ์ เก็บสถิติและเก็บรายงานระบบบริการสุขภาพ', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google drive ไฟล์เอกสาร', 'อื่นๆ', 'อื่นๆ', 'ผู้ร่วมพัฒนาระบบ', 'กลุ่มงานสุขภาพดิจิทัล', 'กลุ่มงานสุขภาพดิจิทัล', '-', 'กรมอนามัย', 'ทั้งสองรูปแบบ', 'ตลอดการทำงาน', 'ลบจากฐานข้อมูลถาวร', '-', '-', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-9946', 'ข้อมูลสาเหตุการตายของทารกแรกเกิด อายุน้อยกว่าหรือเท่ากับ 28 วัน', 'กลุ่มงานส่งเสริมสุขภาพ', 'ข้อมูลสาเหตุการตายของทารกแรกเกิด อายุน้อยกว่าหรือเท่ากับ 28 วัน', 'ข้อมูลส่วนบุคคลทั่วไป', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'หาสาเหตุการตาย', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google', 'อื่นๆ', 'เครื่องคอมพิวเตอร์', 'เพื่อเก็บสถิติและสาเหตุการตาย', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-3329', 'ทะเบียนเด็ก 0-5 ปี', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนเด็ก 0-5 ปี', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อวิเคราะห์งาน', 'ผู้รับบริการ / บุคลากรสาธารณสุข', '', 'Google form', '', 'Share Drive / ฐานข้อมูลระบบ', '', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-9113', 'ข้อมูลรายงานศูนย์ช่วยเหลือวัยรุ่น', 'กลุ่มงานส่งเสริมสุขภาพ', 'ข้อมูลรายงานศูนย์ช่วยเหลือวัยรุ่น', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อจัดเก็บข้อมูลการช่วยเหลือวัยรุ่น', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google drive Google from ไฟล์เอกสาร', 'อื่นๆ', 'เครื่องคอมพิวเตอร์', 'เพื่อให้ผู้รับผิดชอบสามารถเข้าถึง ส่งต่อ ข้อมูลได้ทันเวลา', 'กลุ่มงานสุขภาพดิจิทัล', 'กลุ่มงานสุขภาพดิจิทัล', 'เพื่อการช่วยเหลือตามสิทธิต่างๆ', 'โรงพยาบาล รพ.สต กรมอนามัย สำนักอนามัยการเจริญพันธุ์', 'ทั้งสองรูปแบบ', 'ตลอดการทำงาน', 'ลบจากฐานข้อมูลถาวร', '-', '-', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-6334', 'ทะเบียนนักเรียนที่เข้ารับการอบรมในโครงการงบพัฒนาจังหวัด', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนนักเรียนที่เข้ารับการอบรมในโครงการงบพัฒนาจังหวัด', 'ข้อมูลส่วนบุคคลทั่วไป', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อการจัดเตรียมเอกสารเบิกจ่ายตามงบ', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google drive Google from ไฟล์เอกสาร', 'อื่นๆ', 'อื่นๆ', 'เพื่อจัดเก็บข้อมูลตามแบบสอบถาม', 'กลุ่มงานสุขภาพดิจิทัล', 'กลุ่มงานสุขภาพดิจิทัล', 'เพื่อทราบถึงสถานการณ์วัยรุ่น', 'โรงพยาบาล รพ.สต', 'ทั้งสองรูปแบบ', 'ตลอดการทำงาน', 'เครื่องหั่นทำลายเอกสาร', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-7730', 'ข้อมูลส่งต่อการตั้งครรภ์ไม่พร้อม และยุติการตั้งครรภ์ที่ปลอดภัย', 'กลุ่มงานส่งเสริมสุขภาพ', 'ข้อมูลส่งต่อการตั้งครรภ์ไม่พร้อม และยุติการตั้งครรภ์ที่ปลอดภัย', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อการจัดเก็บข้อมูล และรายงานข้อมูลบริการสุขภาพ', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google drive Google from ไฟล์เอกสาร', 'อื่นๆ', 'เครื่องคอมพิวเตอร์', 'เพื่อใช้ข้อมูลนำเสนอสถานการณ์ในภาพจังหวัด', 'กลุ่มงานสุขภาพดิจิทัล', 'กลุ่มงานสุขภาพดิจิทัล', 'เพื่อทราบถึงสภาพปัญหา', 'โรงพยาบาล รพ.สต กรมอนามัย สำนักอนามัยการเจริญพันธุ์', 'ทั้งสองรูปแบบ', 'ตลอดการทำงาน', 'ลบจากฐานข้อมูลถาวร', '-', '-', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-1202', 'ทะเบียนคนไข้ยากไร้', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนคนไข้ยากไร้', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อใช้เป็นข้อมูลในการช่วยเหลือผู้ป่วยยากไร้', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'google form', 'อื่นๆ', 'เครื่องคอมพิวเตอร์', 'เพื่อใช้เป็นข้อมูลในการช่วยเหลือคนไข้ยากไร้ และรวบรวมเป็นสถิติ', 'กลุ่มงานส่งเสริมสุขภาพ', 'กลุ่มงานดิจิตอล', '-', 'รพ.และสสอ.', 'อิเล็กทรอนิกส์', 'ตลอดการทำงาน', 'ลบจากฐานข้อมูลถาวร', '-', '-', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-1449', 'ทะเบียนผู้ป่วยในพระราชานุเคราห์ (พอ.สว)', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนผู้ป่วยในพระราชานุเคราห์ (พอ.สว)', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อการบริหารจัดการด้านการรักษาพยาบาลการติดตามสิทธิ์/การส่งต่อและประสานงาน', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'ระบบภายใน', 'ไฟร์ Excel /Google Drive', 'อื่นๆ', 'อื่นๆ', 'เพื่อการรักษาพยาบาลของผู้ป่วย/การควบคุมการกำกับดูแลผู้ป่วย/การประสานงานกับผู้ป่วย', 'ส่งเสริมสุขภาพ', 'ส่งเสริมสุขภาพ', '1.เพื่อการขอสนับสนุนงบประมาณค่ารักษาพยาบาล
2.การส่งต่อระหว่างสถานพยาบาล', 'มูลนิธิ พอ.สว.', 'ทั้งสองรูปแบบ', 'ตลอดการทำงาน', 'ลบจากฐานข้อมูลถาวร', '-', '-', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-4981', 'ทะเบียนข้อมูลนักเรียน', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนข้อมูลนักเรียน', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อวิเคราะห์งาน', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากระบบภายใน', 'Google drive Google from ไฟล์เอกสาร', 'อื่นๆ', 'อื่นๆ', 'เพื่อจัดเก็บข้อมูลตามแบบสอบถาม', 'กลุ่มงานสุขภาพดิจิทัล', 'กลุ่มงานสุขภาพดิจิทัล', '-', '', 'ทั้งสองรูปแบบ', 'ตลอดระยะเวลาการทำงาน', 'ลบจากฐานข้อมูลถาวร', '-', '-', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-6336', 'ทะเบียนผู้ป่วยในพระบรมราชนุเคราะห์', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนผู้ป่วยในพระบรมราชนุเคราะห์', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อการบริหารจัดการด้านการรักษาพยาบาลและการส่งต่อและประสานงาน', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'ระบบภายใน', 'ไฟร์ Excel /Google Drive', 'อื่นๆ', 'อื่นๆ', 'เพื่อการรักษาพยาบาลของผู้ป่วย/การควบคุมการกำกับดูแลผู้ป่วย/การประสานงานกับผู้ป่วย', 'ส่งเสริมสุขภาพ', 'ส่งเสริมสุขภาพ', 'การส่งต่อข้อมูลคนไข้', 'สำนักงานพระราชวัง', 'ทั้งสองรูปแบบ', 'ตลอดระยะ', 'ลบจากฐานข้อมูลถาวร', '-', '-', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-2071', 'ทะเบียนผู้สมัครกิจกรรมก้าวท้าใจ', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนผู้สมัครกิจกรรมก้าวท้าใจ', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'วิจัยและพัฒนาด้านสาธารณสุข', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'ระบบภายใน', 'ไฟร์ Excel /Google Drive', 'อื่นๆ', 'ระบบฐานข้อมูล', '1.เพื่อการบริหารจัดการสมาชิกและระบุตัวตน
2. เพื่อสะสมแต้มและมอบรางวัล', 'กลุ่มงาน IT/ส่งเสริมสุขภาพ', 'กลุ่มงาน IT/ส่งเสริมสุขภาพ', 'วิจัยและพัฒนาด้านสาธารณสุข', 'ก้าวท้าใจ กรมอนามัย กระทรวงสาธารณสุข', 'อิเล็กทรอนิกส์', 'ตลอดการทำงาน', 'ลบจากฐานข้อมูลถาวร', '-', '-', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-5009', 'ทะเบียนผู้ป่วยที่มีภาวะพึ่งพิง', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนผู้ป่วยที่มีภาวะพึ่งพิง', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อใช้เป็นข้อมูลวิเคราะห์', 'ผู้รับบริการ / บุคลากรสาธารณสุข', '', '', '', 'Share Drive / ฐานข้อมูลระบบ', '', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-8134', 'รายงานบุคลากรด้านการดูแลระยะยาว (Long Term Care)', 'กลุ่มงานส่งเสริมสุขภาพ', 'รายงานบุคลากรด้านการดูแลระยะยาว (Long Term Care)', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อใช้ประกอบการทำงาน', 'ผู้รับบริการ / บุคลากรสาธารณสุข', '', '', '', 'Share Drive / ฐานข้อมูลระบบ', '', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-7462', 'ทะเบียนผู้สูงอายุ', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนผู้สูงอายุ', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อขับเคลื่อนการดำเนินงาน', 'ผู้รับบริการ / บุคลากรสาธารณสุข', '', '', '', 'Share Drive / ฐานข้อมูลระบบ', '', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-6022', 'ทะเบียนผู้ป่วยที่มีภาวะพึ่งพิง', 'กลุ่มงานส่งเสริมสุขภาพ', 'ทะเบียนผู้ป่วยที่มีภาวะพึ่งพิง', 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)', 'Public Task (ภารกิจของรัฐ)', 'Public Health (การสาธารณสุข)', 'เพื่อขับเคลื่อนการดำเนินงาน', 'ผู้รับบริการ / บุคลากรสาธารณสุข', '', '', '', 'Share Drive / ฐานข้อมูลระบบ', '', '', '', '', '', '', '10 ปี', 'ลบจากฐานข้อมูลถาวร / ทำลายตามระเบียบ', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานส่งเสริมสุขภาพ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-4132', 'ข้อมูลผู้รับการส่งต่อรักษาโรคมะเร็ง', 'กลุ่มงานควบคุมโรคไม่ติดต่อ', 'ข้อมูลผู้รับการส่งต่อรักษาโรคมะเร็ง', 'ข้อมูลส่วนบุคคลทั่วไป', 'Consent (ความยินยอม)', 'Public Health (การสาธารณสุข)', 'เพื่อเป็นข้อมูลกลาง ในการติดตามผู้ป่วยที่ได้รับการส่งต่อรักษา', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากเจ้าของข้อมูล', 'Google from', 'โต๊ะทำงาน', 'เครื่องคอมพิวเตอร์', 'เพื่อเป็นฐานข้อมูลกลาง ใช้ในติดตามคนไข้ส่งต่อกรณีข้อมูลจากพื้นที่หายหรือเปลี่ยนผู้รับผิดชอบงาน', '', '', 'เพื่อติดตาม', 'สป.สธ.', 'อิเล็กทรอนิกส์', '1ปี', 'ลบจากฐานข้อมูลถาวร', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานควบคุมโรคไม่ติดต่อ')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

INSERT INTO public.ropa_records (id, activity_name, department, data_type, classification, lawful_basis_24, lawful_basis_26, purpose_collection, data_owner, import_method, collection_source, physical_storage, electronic_storage, purpose_internal, requesting_unit, accessing_unit, purpose_external, external_org, transfer_method, retention_period, disposal_method, tech_measures, org_measures, updated_year, updated_by)
VALUES ('202601-7122', 'ทะเบียนควบคุมกำกับจริยธรรมวิจัยในมนุษย์', 'กลุ่มงานพัฒนาทรัพยากรบุคคล', 'ทะเบียนควบคุมกำกับจริยธรรมวิจัยในมนุษย์', 'ข้อมูลส่วนบุคคลทั่วไป', 'Public Task (ภารกิจของรัฐ)', 'Research (การวิจัย)', 'เพื่อติดตามสถานะและระยะเวลาในการส่งจริยธรรมวิจัยในมนุษย์', 'ผู้รับบริการ / บุคลากรสาธารณสุข', 'จากเจ้าของข้อมูลโดยตรง', 'Google Sheets', 'เข้าแฟ้ม', 'เครื่องคอมพิวเตอร์', '', '', 'IT', 'เพื่อเป็นองค์ความรู้ใหม่ๆ ที่ช่วยแก้ไขปัญหาสังคม วางแผนนโยบายสาธารณสุข และพัฒนาคุณภาพชีวิตของประชาชนโดยรวม', '', 'ทั้งสองรูปแบบ', 'ตลอดอายุสัญญา', 'ลบจากฐานข้อมูลถาวร', 'การควบคุมสิทธิ์เข้าถึงตามบทบาท (RBAC)', 'ประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคล สสจ.สระแก้ว', '2569', 'เจ้าหน้าที่กลุ่มงานพัฒนาทรัพยากรบุคคล')
ON CONFLICT (id) DO UPDATE SET
  activity_name = EXCLUDED.activity_name,
  department = EXCLUDED.department,
  data_type = EXCLUDED.data_type,
  classification = EXCLUDED.classification,
  lawful_basis_24 = EXCLUDED.lawful_basis_24,
  lawful_basis_26 = EXCLUDED.lawful_basis_26,
  purpose_collection = EXCLUDED.purpose_collection,
  retention_period = EXCLUDED.retention_period,
  updated_year = EXCLUDED.updated_year,
  updated_by = EXCLUDED.updated_by,
  updated_at = NOW();

