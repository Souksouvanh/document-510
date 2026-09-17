import React, { useState } from 'react';
import {
  FileText,
  X,
  Trash2,
  Pencil,
  Printer,
  Download,
} from 'lucide-react';
import {
  formatThaiDate,
  daysUntil,
  STATUS_IN,
  STATUS_OUT,
} from '../documentData.js';
import { Badge, Btn, SealMark } from './ui.jsx';

export default function DocViewModal({ doc, onClose, onEdit, onDelete, onStatusChange }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isIncoming = doc.type === 'in';
  const dleft = doc.dueDate ? daysUntil(doc.dueDate) : null;
  const isOverdue = isIncoming && doc.status === 'ລໍຖ້າດຳເນີນການ' && dleft !== null && dleft < 0;

  const handlePrint = () => {
    window.print();
  };

  const statuses = isIncoming ? STATUS_IN : STATUS_OUT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity no-print"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-10 animate-in flex flex-col max-h-[92vh]">
        {/* Modal Toolbar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 no-print">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isIncoming ? 'bg-blue-600' : 'bg-red-600'
                }`}
            />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {isIncoming ? 'เอกสารขาเข้า (หนังสือรับ)' : 'เอกสารขาออก (หนังสือส่ง)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Btn
              variant="secondary"
              size="xs"
              onClick={handlePrint}
              title="พิมพ์ใบรับรองการลงทะเบียน"
            >
              <Printer size={13} /> พิมพ์ใบทะเบียน
            </Btn>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Official Registration Slip Body */}
        <div className="px-6 py-6 overflow-y-auto space-y-5 print-slip-container flex-1">
          {/* Slip Official Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 dark:border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <SealMark size={48} color={isIncoming ? '#1E3A8A' : '#B91C1C'} />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-thai tracking-tight leading-snug">
                  ใบรับรองการลงทะเบียนหนังสือราชการ
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ระบบบริหารงานสารบรรณอิเล็กทรอนิกส์
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono-num font-bold text-lg text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 inline-block">
                {doc.docNumber}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ลงวันที่ {formatThaiDate(doc.date)}
              </p>
            </div>
          </div>

          {/* Subject & Core Meta */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                เรื่อง
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 leading-snug font-thai">
                {doc.subject}
              </h3>
            </div>

            {/* From/To & Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {isIncoming ? 'จาก (ผู้ส่ง):' : 'ถึง (ผู้รับ):'}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {doc.org}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  หมวดหมู่เอกสาร:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {doc.category || '-'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  วันที่ลงทะเบียน:
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {formatThaiDate(doc.date)}
                </span>
              </div>
              {doc.dueDate && (
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    กำหนดตอบกลับ / ปิดเรื่อง:
                  </span>
                  <span
                    className={`font-semibold ${isOverdue
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {formatThaiDate(doc.dueDate)}
                    {dleft !== null && (
                      <span className="text-xs font-normal ml-1.5 opacity-80">
                        ({dleft < 0 ? `เกิน ${-dleft} วัน` : `เหลือ ${dleft} วัน`})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status & Quick Status Switcher (no-print) */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">สถานะปัจจุบัน</span>
                <Badge status={doc.status} size="sm" dot />
              </div>

              {onStatusChange && (
                <div className="no-print">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                    เปลี่ยนสถานะอย่างรวดเร็ว:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {statuses.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onStatusChange(doc, st)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${doc.status === st
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {doc.notes && (
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                หมายเหตุ / ข้อสั่งการ
              </span>
              <div className="mt-1 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {doc.notes}
              </div>
            </div>
          )}

          {/* Attachment Preview */}
          {doc.fileData && (
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                เอกสารแนบ
              </span>
              <div className="mt-2">
                {doc.fileType && doc.fileType.startsWith('image/') ? (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 p-2 text-center">
                    <img
                      src={doc.fileData}
                      alt={doc.fileName}
                      className="max-h-72 max-w-full rounded-lg mx-auto object-contain"
                    />
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {doc.fileName}
                    </div>
                  </div>
                ) : (
                  <a
                    href={doc.fileData}
                    download={doc.fileName || 'attachment'}
                    className="inline-flex items-center gap-2 p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <FileText size={18} />
                    <span>ดาวน์โหลดไฟล์แนบ: {doc.fileName || 'เอกสารแนบ'}</span>
                    <Download size={14} className="ml-1 opacity-75" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Officer Certification Box (visible in print slip) */}
          <div className="pt-6 border-t border-dashed border-slate-300 dark:border-slate-700 grid grid-cols-2 gap-6 text-center text-xs text-slate-500">
            <div>
              <p className="mb-8">ลงชื่อ....................................................... ผู้รับ/ผู้ลงทะเบียน</p>
              <p>(..........................................................)</p>
              <p className="text-[11px] mt-1">ตำแหน่ง เจ้าหน้าที่งานสารบรรณ</p>
            </div>
            <div>
              <p className="mb-8">ลงชื่อ....................................................... ผู้รับมอบหมาย/ผู้ตรวจสอบ</p>
              <p>(..........................................................)</p>
              <p className="text-[11px] mt-1">วันที่ ......./......./...........</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 no-print">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                ยืนยันการลบเอกสารนี้?
              </span>
              <Btn
                variant="danger"
                size="xs"
                onClick={() => onDelete(doc.id)}
              >
                ยืนยันลบ
              </Btn>
              <Btn
                variant="ghost"
                size="xs"
                onClick={() => setConfirmDelete(false)}
              >
                ยกเลิก
              </Btn>
            </div>
          ) : (
            <Btn
              variant="danger"
              size="sm"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={14} /> ลบเอกสาร
            </Btn>
          )}

          <div className="flex items-center gap-2">
            <Btn variant="secondary" size="sm" onClick={onClose}>
              ปิด
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              onClick={() => onEdit(doc)}
            >
              <Pencil size={14} /> แก้ไขข้อมูล
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
