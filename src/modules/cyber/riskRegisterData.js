// ข้อมูลเริ่มต้นสำหรับ 2.2 Risk Register - ทะเบียนความเสี่ยง
// สกัดจากไฟล์ 2.2 Risk Register.xlsx สำหรับสำนักงานสาธารณสุขจังหวัดสระแก้ว

export const DEFAULT_RISK_REGISTER_HEADER = {
  recorder: "นายธนกฤต นิธิตันติปัญญา, สมาชิกคณะกรรมการพิจารณาความเสี่ยง",
  record_month: "25 ก.พ. 69",
  meeting_date: "25 ก.พ. 69",
  location: "Data Center, กลุ่มงานสุขภาพดิจิทัล",
  address: "609 สำนักงานสาธารณสุขจังหวัดสระแก้ว ต.ท่าเกษม อ.เมืองสระแก้ว จ.สระแก้ว 27000",
  critical_service: "All critical application",
  note: "ทะเบียนความเสี่ยง (Risk Register) ของบริการที่สำคัญของหน่วยงาน"
};

export const DEFAULT_RISK_REGISTER_LOGS = [
  {
    id: "rr_log_1",
    date: "2 ก.ย. 2567",
    detail: "เริ่มดำเนินการสร้าง Template จนแล้วเสร็จและทำการระบุวัตถุประสงค์ (Objective) และกำหนดเกณฑ์ที่ใช้ในการประเมิน ( Criteria)"
  },
  {
    id: "rr_log_2",
    date: "9 ก.ย. 2567",
    detail: "ดำเนินการจัดการประเมินความเสี่ยงและทำการอัพเดทสถานะ"
  },
  {
    id: "rr_log_3",
    date: "23 ก.ย. 2567",
    detail: "ทำการประเมินสถานภาพอีกครั้งอีกครั้ง เพื่อประเมินความพร้อมในการตรวจสอบ"
  }
];

export const RISK_REGISTER_CLUSTERS = [
  'Operational',
  'Strategic',
  'Compliance',
  'Others'
];

export const DEFAULT_RISK_REGISTER_ITEMS = [
  {
    id: "rr_item_1",
    no: 1,
    date_identified: "4 ก.ย. 67",
    category: "Operational",
    system: "โปรแกรมระบบงานบุคคลเก่า",
    threat: "ถูกแฮกเกอร์โจมตี",
    vulnerability: "ระบบเก่ามีข้อมูลส่วนบุคคลจำนวนมากและมีการเชื่อมต่อกับอินเทอร์เน็ต",
    existing_controls: "- มีระบบบุคลากรใหม่ที่ถูกใช้งานทดแทนระบบเก่านี้",
    impact_cia: {
      c: true,
      i: true,
      a: true
    },
    severity_fsrilo: {
      f: false,
      s: false,
      r: true,
      i: true,
      l: true,
      o: true
    },
    likelihood: 1,
    impact: 4,
    risk_level: 4,
    risk_owner: "ผู้อำนวยการฝ่ายบำรุงรักษาระบบเทคโนโลยีสารสนเทศ",
    treatment_option: "Mitigate Risk",
    treatment_plan: "ยกเลิกการใช้งานระบบงานบุคคลเก่า ภายใน 30 ก.ย. 67",
    sub_actions: [
      {
        id: "sub_1_1",
        name: "ยกเลิกการใช้งานระบบงานบุคคลเก่า ภายใน 30 ก.ย. 67",
        progress_percent: 90,
        expected_date: "30 ก.ย. 67"
      }
    ],
    progress_percent: 90,
    expected_finish_date: "30 ก.ย. 67",
    residual_cia: {
      c: false,
      i: false,
      a: false
    },
    residual_fsrilo: {
      f: false,
      s: false,
      r: false,
      i: false,
      l: false,
      o: false
    },
    residual_likelihood: 1,
    residual_impact: 1,
    residual_risk_level: 1,
    status: "Open",
    follow_up_progress: "ยังไม่ได้ดำเนินการ"
  },
  {
    id: "rr_item_2",
    no: 2,
    date_identified: "4 ก.ย. 67",
    category: "Operational",
    system: "ระบบสารบรรณกระทรวง",
    threat: "ถูกแฮกเกอร์โจมตี",
    vulnerability: "เป็นระบบที่พัฒนาด้วยเทคโนโลยีแบบเก่า ไม่ปลอดภัย มีช่องโหว่",
    existing_controls: "- มีระบบทดแทน",
    impact_cia: {
      c: false,
      i: true,
      a: true
    },
    severity_fsrilo: {
      f: true,
      s: true,
      r: true,
      i: true,
      l: false,
      o: true
    },
    likelihood: 5,
    impact: 4,
    risk_level: 20,
    risk_owner: "ผู้อำนวยการฝ่ายบำรุงรักษาระบบเทคโนโลยีสารสนเทศ",
    treatment_option: "Continue Monitoring",
    treatment_plan: "ทำแผนความต่อเนื่องทางธุรกิจให้มีสถานที่ (Site) สำรองที่สามารถให้บริการทดแทนได้",
    sub_actions: [
      {
        id: "sub_2_1",
        name: "ทำแผนความต่อเนื่องทางธุรกิจให้มีสถานที่ (Site) สำรองที่สามารถให้บริการทดแทนได้",
        progress_percent: 0,
        expected_date: ""
      }
    ],
    progress_percent: 0,
    expected_finish_date: "",
    residual_cia: {
      c: false,
      i: false,
      a: false
    },
    residual_fsrilo: {
      f: false,
      s: false,
      r: false,
      i: false,
      l: false,
      o: false
    },
    residual_likelihood: 1,
    residual_impact: 1,
    residual_risk_level: 1,
    status: "Open",
    follow_up_progress: "ยังไม่ได้ดำเนินการ"
  },
  {
    id: "rr_item_3",
    no: 3,
    date_identified: "5 ก.ย. 67",
    category: "Operational",
    system: "โปรแกรมระบบการให้บริการลูกค้า กลุ่ม B",
    threat: "ถูกแฮกเกอร์โจมตี",
    vulnerability: "ระบบมีข้อมูลของลูกค้าจำนวนมาก และไม่มีการตรวจสอบสิทธิและทำการป้องกันที่เพียงพอ",
    existing_controls: "-  มีการป้องกันอย่างแน่นหนา                                  -  ตรวจสอบสิทธิผู้ที่มีสิทธิเข้าถึงอย่างสม่ำเสมอ",
    impact_cia: {
      c: true,
      i: true,
      a: true
    },
    severity_fsrilo: {
      f: true,
      s: true,
      r: false,
      i: true,
      l: true,
      o: true
    },
    likelihood: 2,
    impact: 2,
    risk_level: 4,
    risk_owner: "ผู้อำนวยการฝ่ายบำรุงรักษาระบบเทคโนโลยีสารสนเทศ",
    treatment_option: "Mitigate Risk",
    treatment_plan: "ซื้อประกันภัยไซเบอร์",
    sub_actions: [
      {
        id: "sub_3_1",
        name: "ซื้อประกันภัยไซเบอร์",
        progress_percent: 0,
        expected_date: ""
      }
    ],
    progress_percent: 0,
    expected_finish_date: "",
    residual_cia: {
      c: false,
      i: false,
      a: false
    },
    residual_fsrilo: {
      f: false,
      s: false,
      r: false,
      i: false,
      l: false,
      o: false
    },
    residual_likelihood: 1,
    residual_impact: 1,
    residual_risk_level: 1,
    status: "Open",
    follow_up_progress: "เริ่มดำเนินการคาดว่าจะแล้วเสร็จ 30 ก.ย. 67"
  },
  {
    id: "rr_item_4",
    no: 4,
    date_identified: "6 ก.ย. 67",
    category: "Operational",
    system: "โปรแกรมสำนักงาน เพื่อให้บริการ",
    threat: "ข้อผิดพลาดของโปรแกรม",
    vulnerability: "เกิดข้อผิดพลาด (Error) ทำให้มีการรีสตาร์ตหรือเปิดโปรแกรมใหม่ (Restart Program) ส่งผลให้ไม่สามารถบันทึกข้อมูลที่พิมพ์ไปได้ ต้องเริ่มพิมพ์ข้อมูลใหม่",
    existing_controls: "- พนักงานมีการบันทึกข้อมูลอย่างสม่ำเสมอ                                                         - มีการกำหนดการบันทึกอัตโนมัติ (Auto Save)",
    impact_cia: {
      c: false,
      i: true,
      a: true
    },
    severity_fsrilo: {
      f: true,
      s: true,
      r: true,
      i: false,
      l: true,
      o: false
    },
    likelihood: 3,
    impact: 3,
    risk_level: 9,
    risk_owner: "ผู้อำนวยการฝ่ายบำรุงรักษาระบบเทคโนโลยีสารสนเทศ",
    treatment_option: "Mitigate Risk",
    treatment_plan: "อบรมเพื่อทบทวนการทำงานอีกครั้ง -",
    sub_actions: [
      {
        id: "sub_4_1",
        name: "อบรมเพื่อทบทวนการทำงานอีกครั้ง -",
        progress_percent: 0,
        expected_date: ""
      }
    ],
    progress_percent: 0,
    expected_finish_date: "",
    residual_cia: {
      c: false,
      i: false,
      a: false
    },
    residual_fsrilo: {
      f: false,
      s: false,
      r: false,
      i: false,
      l: false,
      o: false
    },
    residual_likelihood: 1,
    residual_impact: 1,
    residual_risk_level: 1,
    status: "Open",
    follow_up_progress: "เริ่มดำเนินการคาดว่าจะแล้วเสร็จ 30 ก.ย. 67"
  }
];

export const RISK_REGISTER_COMPARE_DATA = [
  { no: 1, code: "Risk ID", name: "ความเสี่ยงลำดับที่ (Risk ID)", category: "Risk Identification", rr: true, ra: true, rp: true },
  { no: 2, code: "Risk Category", name: "กลุ่มความเสี่ยง", category: "Risk Identification", rr: true, ra: false, rp: true },
  { no: 3, code: "Date Added", name: "วันที่ระบุความเสี่ยง (Date identified) / วันที่ทบทวน", category: "Risk Identification", rr: true, ra: false, rp: false },
  { no: 4, code: "Risk Title", name: "การระบุความเสี่ยง (Risk Identification)", category: "Risk Identification", rr: true, ra: true, rp: true },
  { no: 5, code: "Risk Description", name: "คำอธิบายของความเสี่ยง (Description of the risk)", category: "Risk Identification", rr: true, ra: true, rp: true },
  { no: 6, code: "Likelihood / Probability", name: "ความน่าจะเป็นหรือโอกาสเกิดเหตุการณ์", category: "Risk Assessment / Analysis", rr: true, ra: true, rp: true },
  { no: 7, code: "Consequence / Impact", name: "ผลกระทบที่ตามมา (Severity)", category: "Risk Assessment / Analysis", rr: true, ra: true, rp: true },
  { no: 8, code: "Risk Grade / Level", name: "ระดับความเสี่ยง (Risk Level)", category: "Risk Assessment / Analysis", rr: true, ra: true, rp: true },
  { no: 9, code: "Prevention", name: "มาตรการป้องกัน", category: "Plan Forward", rr: true, ra: false, rp: true },
  { no: 10, code: "Monitoring & Control", name: "เฝ้าระวังและควบคุม", category: "Plan Forward", rr: true, ra: false, rp: true },
  { no: 11, code: "Mitigation", name: "การจัดการความเสี่ยง (Risk Treatment)", category: "Plan Forward", rr: true, ra: true, rp: true },
  { no: 12, code: "Risk Owner", name: "เจ้าของความเสี่ยง (Risk Owner)", category: "Review", rr: true, ra: true, rp: false },
  { no: 13, code: "Date Last Review", name: "วันที่ทบทวนล่าสุด", category: "Review", rr: true, ra: false, rp: false },
  { no: 14, code: "Risk Status", name: "สถานะของการจัดการความเสี่ยง (Status)", category: "Review", rr: true, ra: false, rp: false },
  { no: 15, code: "Data Quantitative", name: "แสดงข้อมูลเชิงปริมาณ (จำนวนครั้งที่เกิดเหตุการณ์)", category: "Review", rr: false, ra: false, rp: true }
];

export const CRITERIA_IMPACT_LEVELS = [
  { level: 5, name: "Severe (ระดับวิกฤต ข)", desc: "ภัยคุกคามมีผลกระทบต่อระบบงานและข้อมูลสำคัญมาก ส่งผลให้ระบบล่มหรือหยุดชะงักรุนแรง", fin: "ความเสียหายทางการเงินสูงมาก", rep: "ภาพลักษณ์องค์กรเสียหายรุนแรงระดับประเทศ", law: "ละเมิดกฎหมายขั้นรุนแรง มีโทษปรับ/อาญา" },
  { level: 4, name: "Significant (ระดับวิกฤต ก)", desc: "ภัยคุกคามมีผลกระทบต่อระบบบริการหลัก ต้องใช้ทรัพยากรฉุกเฉินในการกู้คืน", fin: "ความเสียหายทางการเงินสูง", rep: "กระทบต่อชื่อเสียงและความเชื่อมั่นระยะยาว", law: "ละเมิดกฎหมายหรือเกณฑ์กำกับดูแลสำคัญ" },
  { level: 3, name: "Moderate (ระดับร้ายแรง)", desc: "ภัยคุกคามมีผลกระทบสำคัญต่อระบบหลายระบบ ทำให้บริการหลักสะดุดบางส่วน", fin: "มีผลกระทบต่อการขยายธุรกิจ/งบประมาณ", rep: "กระทบต่อชื่อเสียงระยะสั้น", law: "ส่งผลต่อการปฏิบัติตามข้อบังคับบางประการ" },
  { level: 2, name: "Minor (ระดับไม่ร้ายแรง)", desc: "ภัยคุกคามมีผลกระทบเพียงเล็กน้อย ผู้ใช้บริการได้รับผลกระทบในวงจำกัด กู้คืนได้เร็ว", fin: "ค่าใช้จ่ายในการจัดการต่ำ", rep: "ไม่กระทบต่อชื่อเสียงภายนอก", law: "ไม่ละเมิดกฎหมาย" },
  { level: 1, name: "Insignificant (ไม่มีผลกระทบ/เล็กน้อย)", desc: "ภัยคุกคามไม่มีผลกระทบต่อระบบ ข้อมูล หรือการดำเนินงานขององค์กร", fin: "ไม่มีความเสียหายทางการเงิน", rep: "ไม่มีผลกระทบต่อภาพลักษณ์", law: "ไม่มีผลต่อข้อกำหนดกฎหมาย" }
];

export const CRITERIA_LIKELIHOOD_LEVELS = [
  { level: 5, name: "Almost certain (เกือบเกิดขึ้นแน่นอน)", desc: "มีแนวโน้มที่จะเกิดขึ้นเป็นประจำ หรือเกิดขึ้นบ่อยครั้งในรอบปี" },
  { level: 4, name: "Likely (มีโอกาสเกิดขึ้น)", desc: "เหตุการณ์ที่น่าจะเกิดขึ้น หรือเคยเกิดขึ้นมาแล้วในรอบปี" },
  { level: 3, name: "Moderate (อาจเกิดขึ้น)", desc: "เหตุการณ์ที่น่าจะเป็นไปได้ หรืออาจเกิดขึ้นได้บางครั้ง" },
  { level: 2, name: "Unlikely (มีโอกาสเกิดขึ้นน้อย)", desc: "เหตุการณ์ที่อาจเกิดขึ้นน้อยมาก หรือมีโอกาสเกิดขึ้นได้น้อย" },
  { level: 1, name: "Rare (เกิดขึ้นได้ยาก)", desc: "เหตุการณ์ที่ไม่น่ามีโอกาสเกิดขึ้นได้ หรือแทบไม่เคยเกิดขึ้น" }
];

export const CRITERIA_RISK_SCORE_RANGES = [
  { level: "Very High / Extreme", min: 15, max: 25, color: "#dc2626", bg: "#fee2e2", desc: "เป็นความเสี่ยงขั้นวิกฤติ ต้องมีการดำเนินการโดยทันทีและมีแผนจัดการความเสี่ยงเร่งด่วน" },
  { level: "High", min: 10, max: 12, color: "#ea580c", bg: "#ffedd5", desc: "เป็นความเสี่ยงสูง ต้องมีการดำเนินการบางอย่างเพื่อลดความเสี่ยงให้อยู่ในเกณฑ์ที่ยอมรับได้" },
  { level: "Moderate", min: 4, max: 9, color: "#ca8a04", bg: "#fef9c3", desc: "เป็นความเสี่ยงปานกลาง ต้องมีการติดตามและอาจมีมาตรการป้องกันเพิ่มเติม" },
  { level: "Low", min: 1, max: 3, color: "#16a34a", bg: "#dcfce7", desc: "เป็นความเสี่ยงต่ำ ต้องมีการติดตามเป็นระยะ แต่ยังไม่ต้องมีการดำเนินการใดๆ เพิ่มเติม" }
];

export const CRITERIA_CLUSTER_AVG_RANGES = [
  { level: "Very High", min: 12.5, max: 25, color: "#dc2626", bg: "#fee2e2", desc: "ค่าเฉลี่ยความเสี่ยงขั้นวิกฤติ ต้องมีการจัดการทันที" },
  { level: "High", min: 9.5, max: 12.4, color: "#ea580c", bg: "#ffedd5", desc: "ค่าเฉลี่ยความเสี่ยงสูง ต้องดำเนินการลดความเสี่ยง" },
  { level: "Moderate", min: 3.5, max: 9.4, color: "#ca8a04", bg: "#fef9c3", desc: "ค่าเฉลี่ยความเสี่ยงปานกลาง ติดตามและเฝ้าระวัง" },
  { level: "Low", min: 1.0, max: 3.4, color: "#16a34a", bg: "#dcfce7", desc: "ค่าเฉลี่ยความเสี่ยงต่ำ ติดตามตามรอบปกติ" }
];

// Helper: คำนวณระดับความเสี่ยง (Risk Level) จาก Likelihood * Impact
export function getRiskLevelInfo(score) {
  const num = Number(score) || 0;
  if (num >= 15) return { text: "Very High", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" };
  if (num >= 10) return { text: "High", color: "#ea580c", bg: "#ffedd5", border: "#fdba74" };
  if (num >= 4) return { text: "Moderate", color: "#ca8a04", bg: "#fef9c3", border: "#fde047" };
  return { text: "Low", color: "#16a34a", bg: "#dcfce7", border: "#86efac" };
}

// Helper: คำนวณเกณฑ์จากค่าเฉลี่ย (Cluster Average)
export function getClusterAvgInfo(avgScore) {
  const num = Number(avgScore) || 0;
  if (num >= 12.5) return { text: "Very High", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" };
  if (num >= 9.5) return { text: "High", color: "#ea580c", bg: "#ffedd5", border: "#fdba74" };
  if (num >= 3.5) return { text: "Moderate", color: "#ca8a04", bg: "#fef9c3", border: "#fde047" };
  return { text: "Low", color: "#16a34a", bg: "#dcfce7", border: "#86efac" };
}

// Helper: คำนวณค่าเฉลี่ยระดับความเสี่ยงของแต่ละ Cluster
export function calculateClusterAverages(items = []) {
  const stats = {};
  items.forEach(it => {
    const cluster = it.category || 'Operational';
    if (!stats[cluster]) {
      stats[cluster] = { sum: 0, count: 0 };
    }
    stats[cluster].sum += Number(it.risk_level) || (Number(it.likelihood) * Number(it.impact)) || 0;
    stats[cluster].count += 1;
  });

  const averages = {};
  Object.keys(stats).forEach(c => {
    averages[c] = stats[c].count > 0 ? (stats[c].sum / stats[c].count).toFixed(2) : "0.00";
  });
  return averages;
}
