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
  'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
  'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
];

export const THAI_MONTHS_SHORT = [
  'ມ.ກ.', 'ກ.ພ.', 'ມ.ຄ.', 'ເມ.ສ.', 'ພ.ຄ.', 'ມິ.ຖ.',
  'ກ.ກ.', 'ສ.ຫ.', 'ກ.ຍ.', 'ຕ.ລ.', 'ພ.ຈ.', 'ທ.ວ.'
];

export const CATEGORY_OPTIONS = [
  'ກົດລະບຽບ',
  'ກົດໝາຍ',
  'ຂໍ້ຕົກລົງ',
  'ສະໂນດນຳສົ່ງ',
  'ສັນຍາ',
  'ບົດສະຫຼຸບ',
  'ບົດບັນທຶກ',
  'ບົດລາຍງານ',
  'ໜັງສືທາງລັດຖະການ',
  'ໜັງສືເຊີນ',
  'ເອກະສານນິຕິກຳ(ຄຳສັ່ງ, ດຳລັດ)',
  'ແຈ້ງການ',
  'ແຈ້ງຕອບ',
  'ແຜນການ',
  'ໃບຄຳຮ້ອງ',
  'ໜັງສືສະເໜີ',
  'ໃບສະເໜີລາຄາ',
  'ໃບແຈ້ງຫນີ້',
  'ໃບສັ່ງຊື້',
  'ໃບຮັບເງິນ',
  'ໃບຍົກຍ້າຍ',
  'ໃບຮັບຮອງ',
  'ໃບເບີກຈ່າຍ',
];

export const STATUS_IN = ['ລໍຖ້າດຳເນີນການ', 'ດຳເນີນການແລ້ວ', 'ປິດເລື່ອງ'];
export const STATUS_OUT = ['ຮ່າງ', 'ສົ່ງແລ້ວ', 'ປິດເລື່ອງ'];

export const URGENCY_LEVELS = [
  { id: 'normal', label: 'ປົກກະຕິ', color: 'slate' },
  { id: 'urgent', label: 'ດ່ວນ', color: 'gold' },
  { id: 'very_urgent', label: 'ດ່ວນຫຼາຍ', color: 'seal' },
  { id: 'top_urgent', label: 'ດ່ວນທີ່ສຸດ', color: 'seal' }
];

export const DEFAULT_SETTINGS = {
  orgName: 'ກົມສື່ສານ ປ້ອງກັນຄວາມສະຫງົບ',
  department: 'ກຸ່ມວຽກງານບໍລິຫານສານລະກາ ແລະ ສານสนເຫດ',
  prefixIn: 'ร',
  prefixOut: 'ส',
  digits: 3,
  yearFormat: 'be', // 'be' for พ.ศ.
  defaultUrgency: 'normal',
};

export const toBE = (y) => y; // Gregorian year — no longer adding 543 for Buddhist Era
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
    return `${dateStr} ເວລາ ${timeStr} ນ.`;
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
    case 'ລໍຖ້າດຳເນີນການ':
      return C.gold;
    case 'ດຳເນີນການແລ້ວ':
    case 'ສົ່ງແລ້ວ':
      return C.primary;
    case 'ປິດເລື່ອງ':
      return C.success;
    case 'ຮ່າງ':
      return C.slate;
    default:
      return C.slate;
  }
}

export function statusBadge(status) {
  switch (status) {
    case 'ລໍຖ້າດຳເນີນການ':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
        label: 'ລໍຖ້າດຳເນີນການ'
      };
    case 'ດຳເນີນການແລ້ວ':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500/30',
        dot: 'bg-blue-500',
        label: 'ດຳເນີນການແລ້ວ'
      };
    case 'ສົ່ງແລ້ວ':
      return {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-500',
        label: 'ສົ່ງແລ້ວ'
      };
    case 'ປິດເລື່ອງ':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
        label: 'ປິດເລື່ອງ'
      };
    case 'ຮ່າງ':
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
        label: 'ຮ່າງ'
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
  const header = ['ເລກທີ່ລົງທະບຽນ', 'ປະເພດ', 'ວັນທີ', 'ໜ່ວຍງານ/ຜູ້ຮັບ-ສົ່ງ', 'ເລື່ອງ', 'ໝວດໝູ່', 'ສະຖານະ', 'ກຳນົດຕອບກັບ', 'ໝາຍເຫດ'];
  const lines = [header.join(',')];
  rows.forEach((r) => {
    const cells = [
      r.docNumber,
      r.type === 'in' ? 'ຂາເຂົ້າ' : 'ຂາອອກ',
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
      docNumber: `ລ001/${be}`,
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
      docNumber: `ລ002/${be}`,
      type: 'in',
      date: offsetDays(-2),
      org: 'สำนักงบประมาณ สำนักนายกรัฐมนตรี',
      subject: 'แจ้งการจัดสรรงบประมาณรายจ่ายประจำปีงบประมาณ พ.ศ. 2569 งวดที่ 2',
      category: 'คำสั่ง/ประกาศ',
      status: 'รอดำเนินการ',
      urgency: 'very_urgent',
      dueDate: offsetDays(2),
      notes: 'ກະລຸນາຮີບດ່ວນກວດສອບແຜນການໃຊ້ຈ່າຍງົບປະມານ ໃຫ້ສອດຄ່ອງກັບແນວທາງຂອງສຳນັກງົບປະມານ',
      createdAt: Date.now() - 2 * 86400000,
    },
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
