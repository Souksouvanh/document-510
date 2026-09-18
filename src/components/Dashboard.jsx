import React, { useState } from 'react';
import {
  Inbox,
  Send,
  Clock,
  AlertTriangle,
  FilePlus,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  FileText,
  ChevronRight,
} from 'lucide-react';
import {
  formatThaiDate,
  formatThaiDateShort,
  daysUntil,
  toBE,
  pad,
} from '../documentData.js';
import { StatCard, Badge, Btn } from './ui.jsx';

export default function Dashboard({ documents, onView, onGo, onAdd }) {
  const [filterType, setFilterType] = useState('all');

  const now = new Date();
  const currentYear = now.getFullYear();
  const beYear = toBE(currentYear);
  const currentMonthKey = `${currentYear}-${pad(now.getMonth() + 1, 2)}`;

  // Monthly stats
  const inThisMonth = documents.filter(
    (d) => d.type === 'in' && (d.date || '').startsWith(currentMonthKey)
  ).length;

  const outThisMonth = documents.filter(
    (d) => d.type === 'out' && (d.date || '').startsWith(currentMonthKey)
  ).length;

  const pendingDocs = documents.filter(
    (d) => d.type === 'in' && d.status === 'ລໍຖ້າດຳເນີນການ'
  );

  const overdueList = documents
    .filter((d) => d.type === 'in' && d.status === 'ລໍຖ້າດຳເນີນການ' && d.dueDate)
    .map((d) => ({ ...d, dleft: daysUntil(d.dueDate) }))
    .filter((d) => d.dleft !== null && d.dleft <= 3)
    .sort((a, b) => a.dleft - b.dleft);

  const completedCount = documents.filter(
    (d) => d.status === 'ດຳເນີນການແລ້ວ' || d.status === 'ສົ່ງແລ້ວ' || d.status === 'ປິດເລື່ອງ'
  ).length;

  const completionRate =
    documents.length > 0 ? Math.round((completedCount / documents.length) * 100) : 0;

  // Recent documents
  const recentDocs = documents
    .filter((d) => filterType === 'all' || d.type === filterType)
    .slice(0, 7);

  return (
    <div className="space-y-6">
      {/* ==================================================================
          TOP BANNER & QUICK ACTIONS
          ================================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 p-6 sm:p-7 text-white shadow-lg">
        {/* Background glow effects */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-medium mb-3">
              <Calendar size={13} />
              {/* <span>ປີງົບປະມານ พ.ศ. {beYear}</span> */}
              <span className="w-1 h-1 rounded-full bg-blue-300" />
              <span>ວັນທີ {formatThaiDate(now.toISOString().slice(0, 10))}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-thai">
              ລະບົບຮັບ-ສົ່ງເອກະສານ ຂາເຂົ້າ-ຂາອອກ
            </h2>
            <p className="text-sm text-blue-200/80 mt-1 max-w-xl">
              ຈັດການເອກະສານເຂົ້າອອກ ພ້ອມທັງຕິດຕາມກຳນົດເວລາ ແລະພິມໃບຮັບຮອງ ໄດ້ຢ່າງສະດວກ ແລະວ່ອງໄວ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => onAdd({ defaultType: 'in' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-medium text-sm shadow-sm transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <FilePlus size={16} /> ບັນທຶກເອກະສານຂາເຂົ້າ
            </button>
            <button
              type="button"
              onClick={() => onAdd({ defaultType: 'out' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm backdrop-blur-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Send size={15} /> ບັນທຶກເອກະສານຂາອອກ
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================
          KPI STATS CARDS
          ================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="ເອກະສານເຂົ້າເດືອນນີ້"
          value={inThisMonth}
          icon={Inbox}
          color="blue"
          subtitle={`ທັງໝົດ ${documents.filter((d) => d.type === 'in').length} ສະບັບ`}
          onClick={() => onGo('in')}
        />
        <StatCard
          label="ເອກະສານອອກເດືອນນີ້"
          value={outThisMonth}
          icon={Send}
          color="blue"
          subtitle={`ທັງໝົດ ${documents.filter((d) => d.type === 'out').length} ສະບັບ`}
          onClick={() => onGo('out')}
        />
        <StatCard
          label="ເອກະສານລໍຖ້າດຳເນີນການ"
          value={pendingDocs.length}
          icon={Clock}
          color="amber"
          subtitle={`ອັດຕາສຳເລັດ ${completionRate}%`}
          badge={
            pendingDocs.length > 0 ? (
              <Badge variant="gold" size="xs" dot>
                ຕ້ອງຕິດຕາມ
              </Badge>
            ) : null
          }
          onClick={() => onGo('in')}
        />
        <StatCard
          label="ເລັ່ງດ່ວນ / ເກີນກຳນົດ"
          value={overdueList.length}
          icon={AlertTriangle}
          color={overdueList.length > 0 ? 'red' : 'emerald'}
          subtitle={
            overdueList.length > 0 ? 'ຄວນເລັ່ງປະສານງານ' : 'ບໍ່ມີລາຍການຄ້າງສົ່ງ'
          }
          badge={
            overdueList.length > 0 ? (
              <Badge variant="seal" size="xs" dot>
                ສຳຄັນ
              </Badge>
            ) : (
              <Badge variant="success" size="xs">
                ສຳເລັດ
              </Badge>
            )
          }
          onClick={() => onGo('in')}
        />
      </div>

      {/* ==================================================================
          MAIN CONTENT GRIDS: RECENT & ATTENTION
          ================================================================== */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Documents Table (2 columns on lg) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 font-thai">
                ລາຍການເອກະສານລ່າສຸດ
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                ທັງໝົດ
              </button>
              <button
                type="button"
                onClick={() => setFilterType('in')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${filterType === 'in'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                ຂາເຂົ້າ
              </button>
              <button
                type="button"
                onClick={() => setFilterType('out')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${filterType === 'out'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                ເຂົ້າອອກ
              </button>
            </div>
          </div>

          {recentDocs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">ຍັງບໍ່ມີເອກະສານໃນລະບົບ</p>
              <Btn
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => onAdd({ defaultType: 'in' })}
              >
                + ເພີ່ມເອກະສານສະບັບທຳອິດ
              </Btn>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 overflow-x-auto">
              {recentDocs.map((doc) => {
                const isOverdue =
                  doc.type === 'in' &&
                  doc.status === 'ລໍຖ້າດຳເນີນການ' &&
                  doc.dueDate &&
                  daysUntil(doc.dueDate) < 0;

                return (
                  <div
                    key={doc.id}
                    onClick={() => onView(doc)}
                    className="flex items-center gap-3.5 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    {/* Icon indicator */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${doc.type === 'in'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                        }`}
                    >
                      {doc.type === 'in' ? <Inbox size={15} /> : <Send size={15} />}
                    </div>

                    {/* Document Number & Subject */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-num text-xs font-semibold text-blue-700 dark:text-blue-400">
                          {doc.docNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                          • {formatThaiDateShort(doc.date)}
                        </span>
                        {isOverdue && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
                            <AlertTriangle size={11} /> ເກີນກຳນົດ
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {doc.subject}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {doc.type === 'in' ? 'ຈາກ' : 'ເຖິງ'}: {doc.org}
                      </p>
                    </div>

                    {/* Status badge & Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge status={doc.status} size="xs" dot />
                      <ChevronRight
                        size={16}
                        className="text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors hidden sm:block"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer link to list */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              ສະແດງເອກະສານລ່າສຸດ {recentDocs.length} ສະບັບ
            </span>
            <button
              type="button"
              onClick={() => onGo(filterType === 'out' ? 'out' : 'in')}
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
            >
              ເບິ່ງທັງໝົດ <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        {/* Attention / Urgent Tracker Widget (1 column on lg) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 font-thai">
                ເອກະສານທີ່ຕ້ອງຕິດຕາມ
              </h3>
            </div>
            {overdueList.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                {overdueList.length}
              </span>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto max-h-[420px]">
            {overdueList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-500/80" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  ຍັງບໍ່ມີເອກະສານຄ້າງຕິດຕາມ
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  ເອກະສານທັງໝົດໄດ້ຮັບການດຳເນີນການຕາມກຳນົດ
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {overdueList.map((doc) => {
                  const dleft = doc.dleft;
                  const isPast = dleft < 0;
                  const isToday = dleft === 0;

                  return (
                    <div
                      key={doc.id}
                      onClick={() => onView(doc)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-sm ${isPast
                        ? 'border-red-200/90 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20'
                        : isToday
                          ? 'border-amber-200/90 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'
                          : 'border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono-num text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {doc.docNumber}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isPast
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
                            : isToday
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                            }`}
                        >
                          {isPast
                            ? `ເກີນ ${-dleft} ວັນ`
                            : isToday
                              ? 'ຄົບກຳນົດມື້ນີ້'
                              : `ເຫຼືອອີກ ${dleft} ວັນ`}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1.5 line-clamp-2">
                        {doc.subject}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                        <span className="truncate max-w-[150px]">{doc.org}</span>
                        <span>ຄົບ: {formatThaiDateShort(doc.dueDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <Btn
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => onGo('in')}
            >
              ເບິ່ງເອກະສານເຂົ້າທັງໝົດ
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
