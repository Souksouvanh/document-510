import React, { useMemo } from 'react';
import {
  Download,
  Printer,
  Inbox,
  Send,
  CheckCircle2,
} from 'lucide-react';
import {
  THAI_MONTHS_SHORT,
  toBE,
  downloadCSV,
} from '../documentData.js';
import { Btn } from './ui.jsx';

export default function Reports({ documents }) {
  const selectedYear = new Date().getFullYear();
  const beYear = toBE(selectedYear);

  // Filter documents by year
  const yearDocs = useMemo(() => {
    return documents.filter((d) => {
      if (!d.date) return false;
      const dt = new Date(d.date + 'T00:00:00');
      return dt.getFullYear() === selectedYear;
    });
  }, [documents, selectedYear]);

  // Monthly stats
  const monthly = useMemo(() => {
    const arr = THAI_MONTHS_SHORT.map((m, i) => ({
      month: m,
      in: 0,
      out: 0,
      total: 0,
      idx: i,
    }));

    yearDocs.forEach((d) => {
      const dt = new Date(d.date + 'T00:00:00');
      const mIdx = dt.getMonth();
      if (arr[mIdx]) {
        if (d.type === 'in') arr[mIdx].in++;
        else arr[mIdx].out++;
        arr[mIdx].total++;
      }
    });

    return arr;
  }, [yearDocs]);

  const maxVal = Math.max(1, ...monthly.map((m) => Math.max(m.in, m.out)));

  // Category distribution
  const byCategory = useMemo(() => {
    const map = {};
    yearDocs.forEach((d) => {
      const cat = d.category || 'อื่นๆ';
      if (!map[cat]) map[cat] = { in: 0, out: 0, total: 0 };
      if (d.type === 'in') map[cat].in++;
      else map[cat].out++;
      map[cat].total++;
    });

    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [yearDocs]);

  // Overall metrics
  const totalIn = yearDocs.filter((d) => d.type === 'in').length;
  const totalOut = yearDocs.filter((d) => d.type === 'out').length;
  const totalCompleted = yearDocs.filter(
    (d) => d.status === 'ດຳເນີນການແລ້ວ' || d.status === 'ສົ່ງແລ້ວ' || d.status === 'ປິດເລື່ອງ'
  ).length;
  const completionRate =
    yearDocs.length > 0 ? Math.round((totalCompleted / yearDocs.length) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ==================================================================
          PAGE HEADER
          ================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-thai">
              ລາຍງານສະຖິຕິເອກະສານຂາເຂົ້າ-ຂາອອກ
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              ປີ {beYear}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ລາຍງານສະຖິຕິເອກະສານຂາເຂົ້າ-ຂາອອກ, ອັດຕາການເຮັດວຽກ ແລະ ຈຳແນກປະເພດເອກະສານຕາມໝວດໝູ່
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Btn variant="secondary" size="sm" onClick={handlePrint}>
            <Printer size={14} /> ພິມລາຍງານ
          </Btn>
          <Btn
            variant="primary"
            size="sm"
            onClick={() =>
              downloadCSV(
                yearDocs,
                `ລາຍງານສະຖິຕິເອກະສານຂາເຂົ້າ-ຂາອອກ_${beYear}_${new Date().toISOString().slice(0, 10)}.csv`
              )
            }
          >
            <Download size={14} /> ສົ່ງອອກ CSV ທັງໝົດ
          </Btn>
        </div>
      </div>

      {/* ==================================================================
          KPI SUMMARY TILES
          ================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">ເອກະສານທັງໝົດໃນປີ</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono-num">
            {yearDocs.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">ລວມທັງໝົດເອກະສານຂາເຂົ້າ-ຂາອອກ</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            <Inbox size={13} /> ເອກະສານຂາເຂົ້າ
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono-num">
            {totalIn}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {yearDocs.length > 0 ? Math.round((totalIn / yearDocs.length) * 100) : 0}% ຂອງທັງໝົດ
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs">
          <span className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
            <Send size={13} /> ເອກະສານຂາອອກ
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono-num">
            {totalOut}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {yearDocs.length > 0 ? Math.round((totalOut / yearDocs.length) * 100) : 0}% ຂອງທັງໝົດ
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 size={13} /> ອັດຕາການເຮັດວຽກ
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono-num">
            {completionRate}%
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            ດຳເນີນການແລ້ວ/ປິດເລື່ອງແລ້ວ {totalCompleted} ສະບັບ
          </span>
        </div>
      </div>

      {/* ==================================================================
          MONTHLY COMPARISON BAR CHART
          ================================================================== */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-thai">
              ສະຖະຕິເອກະສານແຕ່ລະເດືອນ ປະຈຳປີ {beYear}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ສະຖະຕິເອກະສານຂາເຂົ້າ-ຂາອອກແຕ່ລະເດືອນ
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
              ເອກະສານຂາເຂົ້າ
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded bg-red-700 inline-block" />
              ເອກະສານຂາອອກ
            </span>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="h-56 flex items-end gap-1 sm:gap-3 pt-6 border-b border-slate-200 dark:border-slate-800">
          {monthly.map((m) => {
            const inHeight = (m.in / maxVal) * 100;
            const outHeight = (m.out / maxVal) * 100;

            return (
              <div
                key={m.month}
                className="flex-1 flex flex-col items-center justify-end h-full gap-1 group relative"
              >
                {/* Floating tooltip on hover */}
                <div className="absolute -top-12 bg-slate-900 text-white text-[11px] py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  <p className="font-semibold">{m.month}</p>
                  <p>ເອກະສານຂາເຂົ້າ: {m.in} | ເອກະສານຂາອອກ: {m.out}</p>
                </div>

                {/* Bars */}
                <div className="flex items-end gap-1 h-44 w-full justify-center">
                  <div
                    style={{ height: `${Math.max(inHeight > 0 ? 6 : 0, inHeight)}%` }}
                    className="w-2.5 sm:w-4 rounded-t bg-blue-600 dark:bg-blue-500 transition-all duration-300 group-hover:brightness-110"
                    title={`ເອກະສານຂາເຂົ້າ ${m.in}`}
                  />
                  <div
                    style={{ height: `${Math.max(outHeight > 0 ? 6 : 0, outHeight)}%` }}
                    className="w-2.5 sm:w-4 rounded-t bg-red-700 dark:bg-red-600 transition-all duration-300 group-hover:brightness-110"
                    title={`ເອກະສານຂາອອກ ${m.out}`}
                  />
                </div>

                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================
          CATEGORY BREAKDOWN PROGRESS BARS
          ================================================================== */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-thai mb-1">
          ແບ່ງຕາມປະເພດເອກະສານ
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          ອັດຕາສ່ວນປະເພດຂອງເອກະສານໃນປີນີ້
        </p>

        {byCategory.length === 0 ? (
          <p className="text-sm py-8 text-center text-slate-400">ຍັງບໍ່ມີຂໍ້ມູນໃນປີນີ້</p>
        ) : (
          <div className="space-y-3.5">
            {byCategory.map(([cat, val]) => {
              const pct = yearDocs.length > 0 ? Math.round((val.total / yearDocs.length) * 100) : 0;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat}
                    </span>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                      <span>
                        ຮັບ <strong className="text-blue-600 dark:text-blue-400">{val.in}</strong>
                      </span>
                      <span>
                        ສົ່ງ <strong className="text-red-600 dark:text-red-400">{val.out}</strong>
                      </span>
                      <span className="font-mono-num font-semibold text-slate-700 dark:text-slate-300 w-10 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Multi-segment Progress bar */}
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                    <div
                      style={{
                        width: `${yearDocs.length > 0 ? (val.in / yearDocs.length) * 100 : 0}%`,
                      }}
                      className="bg-blue-600"
                      title={`ເອກະສານຂາເຂົ້າ: ${val.in}`}
                    />
                    <div
                      style={{
                        width: `${yearDocs.length > 0 ? (val.out / yearDocs.length) * 100 : 0}%`,
                      }}
                      className="bg-red-700"
                      title={`ເອກະສານຂາອອກ: ${val.out}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
