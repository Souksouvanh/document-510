import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Send,
  X,
  Check,
  Upload,
  Trash2,
  FileText,
} from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  STATUS_IN,
  STATUS_OUT,
  URGENCY_LEVELS,
  todayISO,
  daysUntil,
} from '../documentData.js';
import { Btn, Field, inputClass } from './ui.jsx';

export default function DocFormModal({ initial, defaultType = 'in', onClose, onSave }) {
  const isEdit = !!initial;

  const [form, setForm] = useState(
    initial || {
      type: defaultType,
      date: todayISO(),
      org: '',
      subject: '',
      category: CATEGORY_OPTIONS[0],
      urgency: 'normal',
      status: defaultType === 'in' ? STATUS_IN[0] : STATUS_OUT[0],
      dueDate: '',
      notes: '',
      fileName: '',
      fileType: '',
      fileData: '',
    }
  );

  const [fileError, setFileError] = useState('');
  const [validated, setValidated] = useState(false);
  const statuses = form.type === 'in' ? STATUS_IN : STATUS_OUT;

  const setField = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleTypeChange = (newType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      status: newType === 'in' ? STATUS_IN[0] : STATUS_OUT[0],
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileError('');
    if (file.size > 5 * 1024 * 1024) {
      setFileError('ຂະໜາດໄຟລ໌ເກີນ 5MB ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        fileName: file.name,
        fileType: file.type,
        fileData: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setForm((prev) => ({
      ...prev,
      fileName: '',
      fileType: '',
      fileData: '',
    }));
  };

  const handleSubmit = React.useCallback(
    (e) => {
      if (e) e.preventDefault();
      setValidated(true);
      if (!form.org.trim() || !form.subject.trim() || !form.date) {
        return;
      }
      onSave(form);
    },
    [form, onSave]
  );

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit, Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, onClose]);

  const dleft = form.dueDate ? daysUntil(form.dueDate) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-10 animate-in flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${form.type === 'in' ? 'bg-blue-600' : 'bg-red-700'
                }`}
            >
              {form.type === 'in' ? <Inbox size={18} /> : <Send size={18} />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 font-thai leading-tight">
                {isEdit
                  ? `ແກ້ໄຂເອກະສານ ${form.docNumber || ''}`
                  : form.type === 'in'
                    ? 'ລົງທະບຽນຮັບເອກະສານຂາເຂົ້າ'
                    : 'ອອກເລກທີເອກະສານຂາອອກ'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEdit
                  ? 'ແກ້ໄຂລາຍລະອຽດຂໍ້ມູນເອກະສານ'
                  : 'ກະລຸນາໃສ່ຂໍ້ມູນເອກະສານເພື່ອບັນທຶກເຂົ້າໃນເອກະສານ'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-4 flex-1">
          {/* Document Type Switcher (only for new docs) */}
          {!isEdit && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('in')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${form.type === 'in'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                <Inbox size={16} /> เอกสารขาเข้า (รับ)
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('out')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${form.type === 'out'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                <Send size={16} /> เอกสารขาออก (ส่ง)
              </button>
            </div>
          )}

          {/* Row 1: Date & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="ວັນທີລົງທະບຽນ / ວັນທີໃນເອກະສານ"
              required
              error={validated && !form.date ? 'ກະລຸນາລະບຸວັນທີ' : null}
            >
              <div className="relative">
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setField('date', e.target.value)}
                  className={inputClass}
                />
              </div>
            </Field>

            <Field label="ລະດັບຄວາມຮີບດ່ວນ">
              <select
                value={form.urgency || 'normal'}
                onChange={(e) => setField('urgency', e.target.value)}
                className={inputClass}
              >
                {URGENCY_LEVELS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Row 2: Organization/Sender/Recipient */}
          <Field
            label={
              form.type === 'in'
                ? 'ຈາກ (ໜ່ວຍງານ / ບຸກຄົນພາຍນອກ / ສ່ວນລັດຖະກອນຜູ້ສົ່ງ)'
                : 'ເຖິງ (ໜ່ວຍງານ / ບຸກຄົນ / ຜູ້ຮັບປາຍທາງ)'
            }
            required
            error={validated && !form.org.trim() ? 'ກະລຸນາລະບຸໜ່ວຍງານຫຼືບຸກຄົນ' : null}
          >
            <input
              type="text"
              required
              value={form.org}
              onChange={(e) => setField('org', e.target.value)}
              placeholder={
                form.type === 'in'
                  ? 'ເຊັ່ນ: ກະຊວງການເງິນ, ບໍລິສັດ ເອັນຊີຈຳກັດ'
                  : 'ເຊັ່ນ: ກະຊວງແຮງງານ, ທຸກກຸ່ມວຽກໃນສັງກັດ'
              }
              className={inputClass}
            />
          </Field>

          {/* Row 3: Subject */}
          <Field
            label="ຫົວຂໍ້ເອກະສານ"
            required
            error={validated && !form.subject.trim() ? 'ກະລຸນາລະບຸຫົວຂໍ້ເອກະສານ' : null}
          >
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setField('subject', e.target.value)}
              placeholder="ເຊັ່ນ: ເຊີນເຂົ້າຮ່ວມກອງປະຊຸມ, ລາຍງານຜົນການດຳເນີນງານງວດທີ 1"
              className={inputClass}
            />
          </Field>

          {/* Row 4: Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="ປະເພດເອກະສານ">
              <select
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="ສະຖານະການດຳເນີນການ">
              <select
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
                className={inputClass}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Row 5: Due Date (for incoming) */}
          {form.type === 'in' && (
            <Field
              label="ກຳນົດວັນຕອບກັບ / ດຳເນີນການ (ຖ້າມີ)"
              hint={
                dleft !== null
                  ? dleft < 0
                    ? `⚠️ ເກີນກຳນົດແລ້ວ ${-dleft} ວັນ`
                    : dleft === 0
                      ? '⚠️ ຄົບກຳນົດມື້ນີ້'
                      : `ເຫຼືອເວລາອີກ ${dleft} ວັນ`
                  : 'ລະບຸວັນຄົບກຳນົດເພື່ອການແຈ້ງເຕືອນຕິດຕາມວຽກ'
              }
            >
              <input
                type="date"
                value={form.dueDate || ''}
                onChange={(e) => setField('dueDate', e.target.value)}
                className={inputClass}
              />
            </Field>
          )}

          {/* Row 6: Attachment upload */}
          <Field label="ໄຟລ໌ແນບ (ຮູບຖ່າຍເອກະສານ ຫຼື ເອກະສານ PDF ບໍ່ເກີນ 5MB)">
            {form.fileName ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {form.fileName}
                    </p>
                    <p className="text-[11px] text-slate-400">ແນບໄຟລ໌ແລ້ວ</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                  title="ລົບໄຟລ໌ແນບ"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div>
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 transition-colors group">
                  <Upload size={22} className="text-slate-400 group-hover:text-blue-500 mb-1" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    ຄລິກເພື່ອເລືອກໄຟລ໌ ຫຼື ລາກໄຟລ໌ມາໃສ່ນີ້
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    ຮອງຮັບຮູບພາບ (PNG, JPG) ຫຼື ເອກະສານ PDF
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
                {fileError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fileError}</p>
                )}
              </div>
            )}
          </Field>

          {/* Row 7: Notes */}
          <Field label="ໝາຍເຫດ / ລາຍລະອຽດການມອບໝາຍວຽກເພີ່ມເຕີມ">
            <textarea
              rows={2}
              value={form.notes || ''}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder="ລະບຸຂໍ້ຄວາມເພີ່ມເຕີມ ຜູ້ຮັບຜິດຊອບ ຫຼື ການສົ່ງຕໍ່ເອກະສານ..."
              className={inputClass}
            />
          </Field>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <span className="text-xs text-slate-400 hidden sm:inline">
            ກົດ <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-mono">Enter</kbd> ເພື່ອບັນທຶກ
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Btn variant="ghost" size="sm" onClick={onClose}>
              ຍົກເລີກ
            </Btn>
            <Btn
              variant={form.type === 'in' ? 'primary' : 'seal'}
              size="sm"
              onClick={handleSubmit}
            >
              <Check size={14} /> {isEdit ? 'ບັນທຶກການແກ້ໄຂ' : 'ບັນທຶກລົງທະບຽນ'}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
