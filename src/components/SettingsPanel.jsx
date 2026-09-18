import React, { useState, useRef } from 'react';
import {
  Check,
  Trash2,
  Building,
  Download,
  Upload,
  Database,
  RefreshCw,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { toBE } from '../documentData.js';
import { Btn, Field, inputClass } from './ui.jsx';

export default function SettingsPanel({
  settings,
  onSave,
  onWipe,
  onSeedSample,
  onExportBackup,
  onImportBackup,
}) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const fileInputRef = useRef(null);

  const beYear = toBE(new Date().getFullYear());

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (onImportBackup) {
          onImportBackup(parsed);
        }
      } catch {
        alert('ບໍ່ສາມາດອ່ານໄຟຣ໌ສຳຮອງໄດ້ ກະລຸນາກວດສອບໄຟຣ໌ໃຫ້ຖືກຕ້ອງ');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Page Title */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-thai">
          ການຕັ້ງຄ່າລະບົບ
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          ກຳນົດຊື່ຂອງໜ່ວຍງານ, ພະແນກ ແລະ ຮູບແບບເລກທີ່ໃນເອກະສານ
        </p>
      </div>

      {/* Section 1: Organization & Format */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-thai flex items-center gap-2">
          <Building size={18} className="text-blue-600 dark:text-blue-400" />
          ຂໍ້ມູນຂອງໜ່ວຍງານ ແລະ ຮູບແບບເລກທີ່ເອກະສານ
        </h3>

        <div className="space-y-4">
          <Field label="ກົມກອງ / ປກສ ແຂວງ">
            <input
              type="text"
              className={inputClass}
              value={form.orgName}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              placeholder="ກົມສື່ສານ ປ້ອງກັນຄວາມສະຫງົບ"
            />
          </Field>

          <Field label="ພະແນກ">
            <input
              type="text"
              className={inputClass}
              value={form.department || ''}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="ພະແນກຄຸ້ມຄອງລະບົບຄອມພິວເຕີ"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="อักษรนำหน้าเลขที่ขาเข้า (หนังสือรับ)">
              <input
                type="text"
                className={inputClass}
                value={form.prefixIn}
                onChange={(e) => setForm({ ...form, prefixIn: e.target.value })}
                placeholder="เช่น ร"
              />
            </Field>

            <Field label="อักษรนำหน้าเลขที่ขาออก (หนังสือส่ง)">
              <input
                type="text"
                className={inputClass}
                value={form.prefixOut}
                onChange={(e) => setForm({ ...form, prefixOut: e.target.value })}
                placeholder="เช่น ส"
              />
            </Field>
          </div>

          <Field label="จำนวนหลักตัวเลข (เช่น 3 หลัก = 001, 4 หลัก = 0001)">
            <input
              type="number"
              min={1}
              max={6}
              className={inputClass}
              value={form.digits}
              onChange={(e) =>
                setForm({ ...form, digits: parseInt(e.target.value, 10) || 1 })
              }
            />
          </Field>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              ตัวอย่างเลขที่ลงทะเบียนที่จะถูกสร้างขึ้นอัตโนมัติ:
            </span>
            <div className="flex flex-wrap items-center gap-4 text-sm font-mono-num font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-thai">ขาเข้า:</span>
                <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  {form.prefixIn}
                  {String(1).padStart(form.digits, '0')}/{beYear}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-thai">ขาออก:</span>
                <span className="px-3 py-1 rounded-lg bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900">
                  {form.prefixOut}
                  {String(1).padStart(form.digits, '0')}/{beYear}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Btn variant="primary" onClick={handleSave}>
              <Check size={14} /> บันทึกการตั้งค่า
            </Btn>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ บันทึกการตั้งค่าเรียบร้อย
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Backup, Restore & Sample Demo Data */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-thai flex items-center gap-2">
          <Database size={18} className="text-blue-600 dark:text-blue-400" />
          การสำรองข้อมูลและการทดสอบระบบ
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              สำรองข้อมูล (Backup JSON)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              ดาวน์โหลดข้อมูลเอกสารและการตั้งค่าทั้งหมดเก็บไว้ในคอมพิวเตอร์
            </p>
            <Btn
              variant="secondary"
              size="sm"
              onClick={onExportBackup}
            >
              <Download size={14} /> ดาวน์โหลดไฟล์สำรอง
            </Btn>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              กู้คืนข้อมูล (Restore JSON)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              นำเข้าไฟล์สำรองเพื่อกู้คืนประวัติและข้อมูลเอกสารทั้งหมด
            </p>
            <Btn
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <Upload size={14} /> นำเข้าไฟล์สำรอง
            </Btn>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Load Sample Demo Data */}
        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Sparkles size={16} className="text-blue-600" />
              โหลดข้อมูลตัวอย่าง (Sample Demo Data)
            </h4>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-0.5">
              สร้างชุดเอกสารตัวอย่างราชการที่สมบูรณ์ เพื่อทดสอบการทำงานของแดชบอร์ดและรายงาน
            </p>
          </div>
          <Btn
            variant="primary"
            size="sm"
            onClick={onSeedSample}
          >
            <RefreshCw size={14} /> โหลดข้อมูลตัวอย่าง
          </Btn>
        </div>
      </div>

      {/* Section 3: Danger Zone */}
      <div className="p-5 sm:p-6 rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10 shadow-2xs space-y-3">
        <h3 className="font-bold text-base text-red-700 dark:text-red-400 font-thai flex items-center gap-2">
          <AlertTriangle size={18} />
          พื้นที่อันตราย (Danger Zone)
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          การล้างข้อมูลจะลบเอกสารและสถิติทะเบียนทั้งหมดออกจากเบราว์เซอร์ การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>

        {confirmWipe ? (
          <div className="flex items-center gap-2.5 pt-2">
            <span className="text-xs font-semibold text-red-700 dark:text-red-300">
              ยืนยันการล้างข้อมูลทั้งหมด?
            </span>
            <Btn
              variant="danger"
              size="sm"
              onClick={() => {
                onWipe();
                setConfirmWipe(false);
              }}
            >
              ยืนยันล้างข้อมูลทั้งหมด
            </Btn>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => setConfirmWipe(false)}
            >
              ยกเลิก
            </Btn>
          </div>
        ) : (
          <Btn
            variant="danger"
            size="sm"
            onClick={() => setConfirmWipe(true)}
          >
            <Trash2 size={14} /> ล้างข้อมูลเอกสารทั้งหมดในระบบ
          </Btn>
        )}
      </div>
    </div>
  );
}
