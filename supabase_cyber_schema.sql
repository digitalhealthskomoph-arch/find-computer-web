-- ====================================================================================================
-- สคริปต์สร้างฐานข้อมูล Supabase สำหรับระบบ Cybersecurity & CII (สสจ.สระแก้ว)
-- ครอบคลุม: 1.2 Asset Inventory, 1.3 Asset Register, 1.4 Asset Risk Assessment,
--         2.3 Risk Matrix, 2.4 Risk Report, 2.5 KRI Document, 3.2 Incidents, Audit & Docs
-- ====================================================================================================

-- 1. [1.2] ทะเบียนอุปกรณ์/ครุภัณฑ์คอมพิวเตอร์และซอฟต์แวร์ (Asset Inventory List)
CREATE TABLE IF NOT EXISTS public.cyber_asset_inventory (
    id TEXT PRIMARY KEY,
    asset_type TEXT NOT NULL, -- 'hardware' หรือ 'software'
    asset_id TEXT,            -- เช่น PT01, SW01, PC01
    item_no INT,
    item_type TEXT,
    brand_model TEXT,
    serial_no TEXT,
    hardware_spec TEXT,
    prop_tag TEXT,
    location TEXT,
    responsible_person TEXT,
    asset_status TEXT,
    ip_address TEXT,
    mac_address TEXT,
    os_firmware TEXT,
    purchase_date TEXT,
    warranty_expire TEXT,
    supplier TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. [1.3] ทะเบียนทรัพย์สินระบบบริการสำคัญ (Asset Register)
CREATE TABLE IF NOT EXISTS public.cyber_asset_register (
    id TEXT PRIMARY KEY,
    item_no INT,
    asset_type TEXT NOT NULL, -- เช่น HW-Switch, Application-Major
    asset_name TEXT NOT NULL,
    description TEXT,
    concerned_app TEXT,
    critical_service TEXT,
    criticality TEXT DEFAULT 'สูง', -- 'สูง', 'กลาง', 'ต่ำ'
    responsible_person TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_asset_register_header (
    id TEXT PRIMARY KEY DEFAULT 'default',
    recorder TEXT,
    record_date TEXT,
    location TEXT,
    address TEXT,
    critical_service TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. [1.4] การประเมินและการจัดการความเสี่ยงทรัพย์สินสำคัญ (Asset Risk Assessment & Treatment)
CREATE TABLE IF NOT EXISTS public.cyber_asset_risk_items (
    id TEXT PRIMARY KEY,
    item_no INT,
    cluster TEXT NOT NULL, -- ชนิดของทรัพย์สิน / Cluster
    asset_name TEXT NOT NULL,
    description TEXT,
    concerned_app TEXT,
    critical_service TEXT,
    threat TEXT,
    vulnerability TEXT,
    existing_controls TEXT,
    impact_c BOOLEAN DEFAULT false,
    impact_i BOOLEAN DEFAULT false,
    impact_a BOOLEAN DEFAULT false,
    severity_f BOOLEAN DEFAULT false,
    severity_s BOOLEAN DEFAULT false,
    severity_r BOOLEAN DEFAULT false,
    severity_i BOOLEAN DEFAULT false,
    severity_l BOOLEAN DEFAULT false,
    severity_o BOOLEAN DEFAULT false,
    likelihood NUMERIC DEFAULT 1,
    impact NUMERIC DEFAULT 1,
    risk_level NUMERIC DEFAULT 1,
    asset_owner TEXT,
    treatment TEXT,
    treatment_plan_main TEXT,
    sub_actions JSONB DEFAULT '[]'::jsonb, -- มาตรการย่อย + Progress + Residual Risk
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_asset_risk_header (
    id TEXT PRIMARY KEY DEFAULT 'default',
    evaluator TEXT,
    recorder TEXT,
    meeting_date TEXT,
    location TEXT,
    address TEXT,
    critical_service TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_asset_risk_logs (
    id TEXT PRIMARY KEY,
    log_date TEXT,
    detail TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. [2.3] การประเมินความเสี่ยงและมาตรการจัดการความเสี่ยงองค์กร (Risk Assessment and Treatment - Risk Matrix)
CREATE TABLE IF NOT EXISTS public.cyber_risk_matrix_items (
    id TEXT PRIMARY KEY,
    item_no INT,
    cluster TEXT NOT NULL,
    risk_code TEXT,
    threat TEXT,
    vulnerability TEXT,
    existing_controls TEXT,
    impact_c BOOLEAN DEFAULT false,
    impact_i BOOLEAN DEFAULT false,
    impact_a BOOLEAN DEFAULT false,
    severity_f BOOLEAN DEFAULT false,
    severity_s BOOLEAN DEFAULT false,
    severity_r BOOLEAN DEFAULT false,
    severity_i BOOLEAN DEFAULT false,
    severity_l BOOLEAN DEFAULT false,
    severity_o BOOLEAN DEFAULT false,
    likelihood NUMERIC DEFAULT 1,
    impact NUMERIC DEFAULT 1,
    risk_level NUMERIC DEFAULT 1,
    risk_owner TEXT,
    treatment TEXT,
    treatment_plan_main TEXT,
    sub_actions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_risk_matrix_header (
    id TEXT PRIMARY KEY DEFAULT 'default',
    evaluator TEXT,
    recorder TEXT,
    meeting_date TEXT,
    location TEXT,
    address TEXT,
    critical_service TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_risk_matrix_logs (
    id TEXT PRIMARY KEY,
    log_date TEXT,
    detail TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. [2.4] รายงานความเสี่ยงด้านไซเบอร์ (Risk Report)
CREATE TABLE IF NOT EXISTS public.cyber_risk_reports (
    id TEXT PRIMARY KEY,
    report_title TEXT NOT NULL,
    report_date TEXT,
    prepared_by TEXT,
    report_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. [2.5] ดัชนีชี้วัดความเสี่ยงสำคัญ (KRI Document)
CREATE TABLE IF NOT EXISTS public.cyber_kri_items (
    id TEXT PRIMARY KEY,
    category TEXT,
    kri_code TEXT,
    kri_name TEXT NOT NULL,
    objective TEXT,
    formula TEXT,
    data_source TEXT,
    frequency TEXT,
    responsible_person TEXT,
    threshold_green TEXT,
    threshold_yellow TEXT,
    threshold_red TEXT,
    current_value TEXT,
    status TEXT,
    action_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_kri_header (
    id TEXT PRIMARY KEY DEFAULT 'default',
    recorder TEXT,
    record_date TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. [3.2] บันทึกเหตุการณ์ด้านไซเบอร์ (Cyber Incident Management)
CREATE TABLE IF NOT EXISTS public.cyber_incidents (
    id TEXT PRIMARY KEY,
    incident_date TEXT,
    reporter TEXT,
    incident_type TEXT,
    severity TEXT,
    description TEXT,
    status TEXT,
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. [1.1/1.3 Audit] แผนการตรวจสอบและรายงานการตรวจสอบ
CREATE TABLE IF NOT EXISTS public.cyber_audit_programmes (
    id TEXT PRIMARY KEY,
    year TEXT,
    programme_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_audit_reports (
    id TEXT PRIMARY KEY,
    report_code TEXT,
    report_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ตารางสถานะรวมศูนย์ (Universal Module State)
-- ใช้สำหรับซิงค์ข้อมูลก้อนใหญ่หรือแคชสำรอง
CREATE TABLE IF NOT EXISTS public.cyber_module_states (
    module_key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. [1.6] การวิเคราะห์ผลกระทบทางธุรกิจ (Business Impact Analysis - BIA Evident)
CREATE TABLE IF NOT EXISTS public.cyber_bia_evident_items (
    id TEXT PRIMARY KEY,
    item_no INT,
    cluster TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    description TEXT,
    critical_service TEXT,
    likelihood NUMERIC DEFAULT 1,
    impact NUMERIC DEFAULT 1,
    risk_level NUMERIC DEFAULT 1,
    impact_c TEXT DEFAULT 'ต่ำ', -- 'สูง', 'กลาง', 'ต่ำ'
    impact_i TEXT DEFAULT 'ต่ำ',
    impact_a TEXT DEFAULT 'ต่ำ',
    financial_impact NUMERIC DEFAULT 0,
    operational_impact TEXT,
    law_regulatory_impact TEXT,
    reputational_impact TEXT,
    mtpd TEXT,
    rto TEXT,
    rpo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_bia_header (
    id TEXT PRIMARY KEY DEFAULT 'default',
    recorder TEXT,
    record_date TEXT,
    location TEXT,
    address TEXT,
    critical_service TEXT,
    overall_score NUMERIC DEFAULT 8.44,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_bia_logs (
    id TEXT PRIMARY KEY,
    log_date TEXT,
    detail TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. [1.7] รายงานการวิเคราะห์ผลกระทบทางธุรกิจ (Business Impact Analysis : BIA Report)
CREATE TABLE IF NOT EXISTS public.cyber_bia_reports (
    id TEXT PRIMARY KEY,
    report_code TEXT,
    report_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. [2.2] ทะเบียนความเสี่ยง (Risk Register)
CREATE TABLE IF NOT EXISTS public.cyber_risk_register_items (
    id TEXT PRIMARY KEY,
    date_identified TEXT,
    category TEXT NOT NULL,
    system TEXT NOT NULL,
    threat TEXT,
    vulnerability TEXT,
    existing_controls TEXT,
    impact_cia JSONB DEFAULT '{"c": false, "i": false, "a": false}'::jsonb,
    severity_fsrilo JSONB DEFAULT '{"f": false, "s": false, "r": false, "i": false, "l": false, "o": false}'::jsonb,
    likelihood NUMERIC DEFAULT 1,
    impact NUMERIC DEFAULT 1,
    risk_level NUMERIC DEFAULT 1,
    risk_owner TEXT,
    treatment_option TEXT,
    treatment_plan TEXT,
    progress_percent NUMERIC DEFAULT 0,
    expected_finish_date TEXT,
    residual_likelihood NUMERIC DEFAULT 1,
    residual_impact NUMERIC DEFAULT 1,
    residual_risk_level NUMERIC DEFAULT 1,
    status TEXT DEFAULT 'Open',
    follow_up_progress TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_risk_register_header (
    id TEXT PRIMARY KEY DEFAULT 'default',
    evaluator TEXT,
    recorder TEXT,
    period_month TEXT,
    meeting_date TEXT,
    location TEXT,
    address TEXT,
    critical_service TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cyber_risk_register_logs (
    id TEXT PRIMARY KEY,
    date TEXT,
    detail TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. [4.5] การประเมินความเสี่ยงที่เกี่ยวข้องกับบริการและห่วงโซ่อุปทานผลิตภัณฑ์ (Third Party Risk Assessment)
CREATE TABLE IF NOT EXISTS public.cyber_third_party_risk_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    service_type TEXT,
    header JSONB DEFAULT '{}'::jsonb,
    logs JSONB DEFAULT '[]'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. [1.2 Protect] การจัดเก็บบันทึกประวัติการเข้าถึงและการตรวจทาน Log (Access Logs & Review)
-- หมายเหตุ: ซิงค์ผ่าน cyber_module_states (module_key: 'access_logs') หรือใช้ตารางแยก:
CREATE TABLE IF NOT EXISTS public.cyber_access_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    target_system TEXT NOT NULL,
    source_ip TEXT NOT NULL,
    action_type TEXT NOT NULL,
    privilege_used TEXT,
    status TEXT NOT NULL, -- 'Success', 'Failed'
    severity TEXT NOT NULL, -- 'Normal', 'Warning', 'Critical'
    event_detail TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. [1.3 Protect] การทบทวนสิทธิ์และการกำหนดเมทริกซ์การเข้าถึง (User Permission Matrix & Review)
-- หมายเหตุ: ซิงค์ผ่าน cyber_module_states (module_key: 'user_permission_matrix') หรือใช้ตารางแยก:
CREATE TABLE IF NOT EXISTS public.cyber_user_permission_review (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    user_ad TEXT NOT NULL,
    position TEXT,
    department TEXT,
    target_system TEXT NOT NULL,
    system_role TEXT NOT NULL,
    auth_method TEXT,
    last_reviewed TEXT,
    review_status TEXT NOT NULL, -- 'คงสิทธิ์ถูกต้อง', 'รอเพิกถอนสิทธิ์', 'รอปรับลดสิทธิ์'
    review_remark TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================================================
-- กำหนดสิทธิ์และความปลอดภัย (Row Level Security & Permissions)
-- เพื่อให้ผู้ใช้งานทั้ง authenticated และ anon สามารถอ่าน/เขียน/อัปเดตข้อมูลได้จากทุกเครื่อง
-- ====================================================================================================

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'cyber_asset_inventory',
        'cyber_asset_register',
        'cyber_asset_register_header',
        'cyber_asset_risk_items',
        'cyber_asset_risk_header',
        'cyber_asset_risk_logs',
        'cyber_bia_evident_items',
        'cyber_bia_header',
        'cyber_bia_logs',
        'cyber_bia_reports',
        'cyber_risk_register_items',
        'cyber_risk_register_header',
        'cyber_risk_register_logs',
        'cyber_third_party_risk_profiles',
        'cyber_risk_matrix_items',
        'cyber_risk_matrix_header',
        'cyber_risk_matrix_logs',
        'cyber_risk_reports',
        'cyber_kri_items',
        'cyber_kri_header',
        'cyber_incidents',
        'cyber_audit_programmes',
        'cyber_audit_reports',
        'cyber_access_logs',
        'cyber_user_permission_review',
        'cyber_module_states'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Public select %s" ON public.%I;', t, t);
        EXECUTE format('CREATE POLICY "Public select %s" ON public.%I FOR SELECT TO anon, authenticated USING (true);', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Public insert %s" ON public.%I;', t, t);
        EXECUTE format('CREATE POLICY "Public insert %s" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true);', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Public update %s" ON public.%I;', t, t);
        EXECUTE format('CREATE POLICY "Public update %s" ON public.%I FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Public delete %s" ON public.%I;', t, t);
        EXECUTE format('CREATE POLICY "Public delete %s" ON public.%I FOR DELETE TO anon, authenticated USING (true);', t, t);
    END LOOP;
END $$;
