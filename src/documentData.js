// ==========================================================================
// THAI DOCUMENT REGISTRY & TRACKING SYSTEM DATA LAYER
// ==========================================================================

export const C = {
  primary: '#1E3A8A',
  primaryHover: '#1D4ED8',
  primaryLight: '#EFF6FF',
  seal: '#B91C1C',
  sealHover: '#991B1B',
  sealLight: '#FEF2F2',
  gold: '#D97706',
  goldLight: '#FEF3C7',
  success: '#059669',
  successLight: '#ECFDF5',
  slate: '#64748B',
  slateLight: '#F1F5F9',
  paper: '#F8FAFC',
  panel: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
};

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const CATEGORY_OPTIONS = [
  'หนังสือราชการทั่วไป',
  'จดหมายเชิญ/ขอความอนุเคราะห์',
  'คำสั่ง/ประกาศ',
  'รายงานการประชุม',
  'ใบวางบิล/ใบแจ้งหนี้',
  'ใบเสนอราคา',
  'ใบสั่งซื้อ/สัญญา',
  'คำร้อง/ข้อเสนอ',
  'อื่นๆ'
];

export const STATUS_IN = ['รอดำเนินการ', 'ดำเนินการแล้ว', 'ปิดเรื่อง'];
export const STATUS_OUT = ['ร่าง', 'ส่งแล้ว', 'ปิดเรื่อง'];

export const URGENCY_LEVELS = [
  { id: 'normal', label: 'ปกติ', color: 'slate' },
  { id: 'urgent', label: 'ด่วน', color: 'gold' },
  { id: 'very_urgent', label: 'ด่วนมาก', color: 'seal' },
  { id: 'top_urgent', label: 'ด่วนที่สุด', color: 'seal' }
];

export const DEFAULT_SETTINGS = {
  orgName: 'สำนักงานสารบรรณกลางและพัฒนาระบบราชการ',
  department: 'กลุ่มงานบริหารสารบรรณและสารสนเทศ',
  prefixIn: 'ร',
  prefixOut: 'ส',
  digits: 3,
  yearFormat: 'be', // 'be' for พ.ศ.
  defaultUrgency: 'normal',
};

export const toBE = (y) => y + 543;
export const pad = (n, d) => String(n).padStart(d, '0');
export const todayISO = () => new Date().toISOString().slice(0, 10);

export function formatThaiDate(iso, withTime = false) {
  if (!iso) return '-';
  const parts = iso.split('T');
  const d = new Date(parts[0] + 'T00:00:00');
  if (isNaN(d.getTime())) return '-';
  const dateStr = `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${toBE(d.getFullYear())}`;
  if (withTime && parts[1]) {
    const timeStr = parts[1].slice(0, 5);
    return `${dateStr} เวลา ${timeStr} น.`;
  }
  return dateStr;
}

export function formatThaiDateShort(iso) {
  if (!iso) return '-';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return '-';
  return `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]} ${String(toBE(d.getFullYear())).slice(-2)}`;
}

export function daysUntil(iso) {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

export function statusColor(status) {
  switch (status) {
    case 'รอดำเนินการ':
      return C.gold;
    case 'ดำเนินการแล้ว':
    case 'ส่งแล้ว':
      return C.primary;
    case 'ปิดเรื่อง':
      return C.success;
    case 'ร่าง':
      return C.slate;
    default:
      return C.slate;
  }
}

export function statusBadge(status) {
  switch (status) {
    case 'รอดำเนินการ':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
        label: 'รอดำเนินการ'
      };
    case 'ดำเนินการแล้ว':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500/30',
        dot: 'bg-blue-500',
        label: 'ดำเนินการแล้ว'
      };
    case 'ส่งแล้ว':
      return {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-500',
        label: 'ส่งแล้ว'
      };
    case 'ปิดเรื่อง':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
        label: 'ปิดเรื่อง'
      };
    case 'ร่าง':
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
        label: 'ร่าง'
      };
    default:
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
        label: status || '-'
      };
  }
}

export function downloadCSV(rows, filename) {
  const header = ['เลขที่ลงทะเบียน', 'ประเภท', 'วันที่', 'หน่วยงาน/ผู้รับ-ส่ง', 'เรื่อง', 'หมวดหมู่', 'สถานะ', 'กำหนดตอบกลับ', 'หมายเหตุ'];
  const lines = [header.join(',')];
  rows.forEach((r) => {
    const cells = [
      r.docNumber,
      r.type === 'in' ? 'ขาเข้า' : 'ขาออก',
      formatThaiDate(r.date),
      r.org,
      r.subject,
      r.category,
      r.status,
      formatThaiDate(r.dueDate),
      r.notes || ''
    ];
    lines.push(cells.map((c) => `"${String(c || '').replace(/"/g, '""')}"`).join(','));
  });
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `document_registry_${todayISO()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --------------------------------------------------------------------------
// STORAGE ABSTRACTION LAYER (window.storage with localStorage fallback)
// --------------------------------------------------------------------------

export async function sGet(key) {
  try {
    if (typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function') {
      const r = await window.storage.get(key, true);
      return r ? r.value : null;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch (e) {
    console.error('Storage sGet error:', e);
  }
  return null;
}

export async function sSet(key, value) {
  try {
    if (typeof window !== 'undefined' && window.storage && typeof window.storage.set === 'function') {
      const r = await window.storage.set(key, value, true);
      return !!r;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return true;
    }
  } catch (e) {
    console.error('Storage sSet error:', e);
  }
  return false;
}

export async function sDelete(key) {
  try {
    if (typeof window !== 'undefined' && window.storage && typeof window.storage.delete === 'function') {
      await window.storage.delete(key, true);
      return true;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return true;
    }
  } catch (e) {
    console.error('Storage sDelete error:', e);
  }
  return false;
}

export async function sList(prefix) {
  try {
    if (typeof window !== 'undefined' && window.storage && typeof window.storage.list === 'function') {
      const r = await window.storage.list(prefix, true);
      return r && r.keys ? r.keys : [];
    }
    if (typeof localStorage !== 'undefined') {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          keys.push(k);
        }
      }
      return keys;
    }
  } catch (e) {
    console.error('Storage sList error:', e);
  }
  return [];
}

// --------------------------------------------------------------------------
// SAMPLE SEED DATA GENERATOR
// --------------------------------------------------------------------------

export function getSampleSeedDocuments() {
  const year = new Date().getFullYear();
  const be = toBE(year);
  const now = new Date();

  // Helper date offset
  const offsetDays = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  return [
    {
      id: 'doc_sample_in_01',
      docNumber: `ร001/${be}`,
      type: 'in',
      date: offsetDays(-5),
      org: 'สำนักงาน ก.พ.',
      subject: 'ขอเชิญร่วมการประชุมสัมมนาวิชาการการพัฒนาระบบบริหารจัดการภาครัฐ 4.0',
      category: 'จดหมายเชิญ/ขอความอนุเคราะห์',
      status: 'ดำเนินการแล้ว',
      urgency: 'urgent',
      dueDate: offsetDays(10),
      notes: 'มอบหมายกลุ่มงานยุทธศาสตร์จัดส่งผู้แทนเข้าร่วมประชุมจำนวน 2 ท่าน',
      createdAt: Date.now() - 5 * 86400000,
    },
    {
      id: 'doc_sample_in_02',
      docNumber: `ร002/${be}`,
      type: 'in',
      date: offsetDays(-2),
      org: 'สำนักงบประมาณ สำนักนายกรัฐมนตรี',
      subject: 'แจ้งการจัดสรรงบประมาณรายจ่ายประจำปีงบประมาณ พ.ศ. 2569 งวดที่ 2',
      category: 'คำสั่ง/ประกาศ',
      status: 'รอดำเนินการ',
      urgency: 'very_urgent',
      dueDate: offsetDays(2),
      notes: 'โปรดเร่งรัดตรวจสอบแผนการใช้จ่ายงบประมาณให้สอดคล้องกับแนวทางสำนักงบประมาณ',
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'doc_sample_in_03',
      docNumber: `ร003/${be}`,
      type: 'in',
      date: offsetDays(-1),
      org: 'บริษัท ดิจิทัล ซอฟต์แวร์ โซลูชั่นส์ จำกัด',
      subject: 'ส่งมอบงานงวดที่ 2 โครงการพัฒนาระบบสารบรรณและฐานข้อมูลดิจิทัล',
      category: 'ใบสั่งซื้อ/สัญญา',
      status: 'รอดำเนินการ',
      urgency: 'normal',
      dueDate: offsetDays(5),
      notes: 'ส่งต่อคณะกรรมการตรวจรับพัสดุเพื่อดำเนินการตรวจรับตามระเบียบ',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'doc_sample_in_04',
      docNumber: `ร004/${be}`,
      type: 'in',
      date: offsetDays(-6),
      org: 'กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม',
      subject: 'ขอความอนุเคราะห์สำรวจความพร้อมด้านความมั่นคงปลอดภัยไซเบอร์ ประจำปี 2569',
      category: 'หนังสือราชการทั่วไป',
      status: 'รอดำเนินการ',
      urgency: 'urgent',
      dueDate: offsetDays(-1), // overdue!
      notes: 'เร่งด่วน เกินกำหนดตอบกลับ 1 วัน ให้ศูนย์เทคโนโลยีสารสนเทศเร่งสรุปข้อมูล',
      createdAt: Date.now() - 6 * 86400000,
    },
    {
      id: 'doc_sample_in_05',
      docNumber: `ร005/${be}`,
      type: 'in',
      date: offsetDays(-12),
      org: 'กรมบัญชีกลาง',
      subject: 'ซักซ้อมความเข้าใจการปฏิบัติตาม พ.ร.บ. จัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ',
      category: 'หนังสือราชการทั่วไป',
      status: 'ปิดเรื่อง',
      urgency: 'normal',
      dueDate: offsetDays(-3),
      notes: 'เวียนแจ้งทุกกลุ่มงานเพื่อทราบและถือปฏิบัติต่อไปเรียบร้อยแล้ว',
      createdAt: Date.now() - 12 * 86400000,
    },
    {
      id: 'doc_sample_out_01',
      docNumber: `ส001/${be}`,
      type: 'out',
      date: offsetDays(-4),
      org: 'สำนักงาน ก.พ.',
      subject: 'หนังสือตอบรับการเข้าร่วมประชุมและแจ้งรายชื่อผู้แทนหน่วยงาน',
      category: 'หนังสือราชการทั่วไป',
      status: 'ส่งแล้ว',
      urgency: 'normal',
      notes: 'จัดส่งทางระบบ e-Document และไปรษณีย์ตอบรับด่วนพิเศษ (EMS) เรียบร้อย',
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      id: 'doc_sample_out_02',
      docNumber: `ส002/${be}`,
      type: 'out',
      date: offsetDays(-2),
      org: 'ประชาชนและหน่วยงานภายนอก',
      subject: 'ประกาศมาตรการอำนวยความสะดวกและลดขั้นตอนการให้บริการประชาชน ประจำปี 2569',
      category: 'คำสั่ง/ประกาศ',
      status: 'ส่งแล้ว',
      urgency: 'normal',
      notes: 'เผยแพร่บนเว็บไซต์หลักของหน่วยงานและบอร์ดประชาสัมพันธ์',
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'doc_sample_out_03',
      docNumber: `ส003/${be}`,
      type: 'out',
      date: offsetDays(0),
      org: 'คณะกรรมการตรวจรับพัสดุ',
      subject: 'คำสั่งแต่งตั้งคณะกรรมการตรวจรับพัสดุงานจ้างพัฒนาระบบคลาวด์',
      category: 'คำสั่ง/ประกาศ',
      status: 'ร่าง',
      urgency: 'urgent',
      notes: 'อยู่ระหว่างตรวจสอบรายชื่อกรรมการและเสนอผู้บริหารลงนาม',
      createdAt: Date.now(),
    }
  ];
}

export async function seedSampleData() {
  const samples = getSampleSeedDocuments();
  for (const doc of samples) {
    await sSet(`doc:${doc.id}`, JSON.stringify(doc));
  }
  const year = new Date().getFullYear();
  const be = toBE(year);
  await sSet(`meta:counter:in:${be}`, '5');
  await sSet(`meta:counter:out:${be}`, '3');
  return samples;
}
