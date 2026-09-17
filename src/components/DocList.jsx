import React, { useMemo, useState } from 'react';
import {
  Search,
  Download,
  FileText,
  AlertTriangle,
  ChevronRight,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Calendar,
  Building,
  Clock,
  Send,
  Inbox,
  Paperclip,
} from 'lucide-react';
import {
  STATUS_IN,
  STATUS_OUT,
  CATEGORY_OPTIONS,
  daysUntil,
  formatThaiDate,
  formatThaiDateShort,
  downloadCSV,
} from '../documentData.js';
import { Badge, Btn, EmptyState } from './ui.jsx';

export default function DocList({ type, documents, onView, onAdd }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const statuses = type === 'in' ? STATUS_IN : STATUS_OUT;
  const isIncoming = type === 'in';

  // Filter and sort documents
  const filtered = useMemo(() => {
    return documents
      .filter((d) => d.type === type)
      .filter((d) => statusFilter === 'all' || d.status === statusFilter)
      .filter((d) => categoryFilter === 'all' || d.category === categoryFilter)
      .filter((d) => {
        if (urgencyFilter === 'all') return true;
        if (urgencyFilter === 'overdue') {
          return d.dueDate && daysUntil(d.dueDate) < 0;
        }
        if (urgencyFilter === 'due_soon') {
          const days = daysUntil(d.dueDate);
          return days !== null && days >= 0 && days <= 3;
        }
        return true;
      })
      .filter((d) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return [d.docNumber, d.org, d.subject, d.category, d.notes]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return (b.date || '').localeCompare(a.date || '');
        if (sortBy === 'date_asc') return (a.date || '').localeCompare(b.date || '');
        if (sortBy === 'number_desc') return (b.docNumber || '').localeCompare(a.docNumber || '');
        if (sortBy === 'number_asc') return (a.docNumber || '').localeCompare(b.docNumber || '');
        if (sortBy === 'due_asc') return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        return 0;
      });
  }, [documents, type, search, statusFilter, categoryFilter, urgencyFilter, sortBy]);

  // Bulk selection handlers
  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((d) => d.id)));
    }
  };

  const handleExportCSV = () => {
    const toExport =
      selectedIds.size > 0
        ? filtered.filter((d) => selectedIds.has(d.id))
        : filtered;
    const filename = `${isIncoming ? 'ເອກະສານຂາເຂົ້າ' : 'ເອກະສານຂາອອກ'}_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(toExport, filename);
  };

  return (
    <div className="space-y-4">
      {/* ==================================================================
          PAGE TITLE BAR
          ================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isIncoming
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-red-700 text-white dark:bg-red-600'
              }`}
          >
            {isIncoming ? <Inbox size={20} /> : <Send size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-thai">
                {isIncoming ? 'ເອກະສານເຂົ້າ (ໜັງສືຮັບ)' : 'ເອກະສານອອກ (ໜັງສືສົ່ງ)'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono-num">
                {filtered.length} ฉบับ
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isIncoming
                ? 'ບັນທຶກຮັບໜັງສືລາຊະການ ຈົດໝາຍເຂົ້າ ແລະຕິດຕາມການມອບໝາຍວຽກ'
                : 'ອອກເລກທະບຽນໜັງສືສົ່ງໜັງສືແຈ້ງວຽນ ແລະຄຳສັ່ງໜ່ວຍງານ'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Btn
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            title="ສົ່ງອອກລາຍການເອກະສານເປັນໄຟລ໌ CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">ສົ່ງອອກ</span> CSV
            {selectedIds.size > 0 && ` (${selectedIds.size})`}
          </Btn>
          <Btn
            variant={isIncoming ? 'primary' : 'seal'}
            size="sm"
            onClick={onAdd}
          >
            <Plus size={15} /> ບັນທຶກເອກະສານໃໝ່
          </Btn>
        </div>
      </div>

      {/* ==================================================================
          FILTER & SEARCH BAR
          ================================================================== */}
      <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ຄົ້ນຫາເລກທີ / ໜ່ວຍງານ / ເລື່ອງ / ໝາຍເຫດ..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ລ້າງ
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">ທຸກປະເພດເອກະສານ</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="date_desc">ວັນທີ: ລ່າສຸດກ່ອນ</option>
              <option value="date_asc">ວັນທີ: ເກົ່າສຸດກ່ອນ</option>
              <option value="number_desc">ເລກທີ: ຫຼາຍໄປນ້ອຍ</option>
              <option value="number_asc">ເລກທີ: ນ້ອຍໄປຫຼາຍ</option>
              {isIncoming && <option value="due_asc">ກຳນົດຕອບກັບ: ເລື້ອຍທີ່ສຸດ</option>}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="ມຸມມອງຕາຕະລາງ"
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                <ListIcon size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="มุมมองการ์ด"
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${statusFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
          >
            ທຸກສະຖານະ ({documents.filter((d) => d.type === type).length})
          </button>
          {statuses.map((st) => {
            const count = documents.filter((d) => d.type === type && d.status === st).length;
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${isSelected
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
              >
                {st} ({count})
              </button>
            );
          })}

          {/* Quick Urgency Filter for incoming */}
          {isIncoming && (
            <div className="ml-auto flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() =>
                  setUrgencyFilter(urgencyFilter === 'overdue' ? 'all' : 'overdue')
                }
                className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer border ${urgencyFilter === 'overdue'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                  }`}
              >
                ເກີນກຳນົດ
              </button>
              <button
                type="button"
                onClick={() =>
                  setUrgencyFilter(urgencyFilter === 'due_soon' ? 'all' : 'due_soon')
                }
                className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer border ${urgencyFilter === 'due_soon'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
              >
                ໃກ້ກຳນົດ (3 ວັນ)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================
          EMPTY STATE
          ================================================================== */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={`ບໍ່ພົບເອກະສານ${isIncoming ? 'ຂາເຂົ້າ' : 'ຂາອອກ'}`}
          description={
            search || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'ລອງປັບປ່ຽນຄຳຄົ້ນຫາ ຫຼືຕົວເລືອກສະຖານະ'
              : `ເລີ່ມຕົ້ນບັນທຶກເອກະສານ${isIncoming ? 'ຂາເຂົ້າ' : 'ຂາອອກ'}ສະບັບທຳອິດໃນລະບົບ`
          }
          actionText="+ ບັນທຶກເອກະສານ"
          onAction={onAdd}
        />
      ) : viewMode === 'table' ? (
        /* ==================================================================
            TABLE VIEW
            ================================================================== */
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <th className="w-10 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={selectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5">ເລກທີລົງທະບຽນ</th>
                  <th className="px-4 py-3.5">ວັນທີ</th>
                  <th className="px-4 py-3.5">{isIncoming ? 'ຈາກ (ໜ່ວຍງານ)' : 'ເຖິງ (ໜ່ວຍງານ)'}</th>
                  <th className="px-4 py-3.5 min-w-[240px]">ເລື່ອງ / ລາຍລະອຽດ</th>
                  <th className="px-4 py-3.5">ໝວດໝູ່</th>
                  <th className="px-4 py-3.5">ສະຖານະ</th>
                  {isIncoming && <th className="px-4 py-3.5">ກຳນົດຕອບກັບ</th>}
                  <th className="w-16 px-4 py-3.5 text-right">ການຈັດການ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map((doc) => {
                  const isSelected = selectedIds.has(doc.id);
                  const isOverdue =
                    isIncoming &&
                    doc.status === 'ລໍຖ້າດຳເນີນການ' &&
                    doc.dueDate &&
                    daysUntil(doc.dueDate) < 0;
                  const dleft = doc.dueDate ? daysUntil(doc.dueDate) : null;

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => onView(doc)}
                      className={`group transition-colors cursor-pointer ${isSelected
                        ? 'bg-blue-50/60 dark:bg-blue-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                      <td className="px-4 py-3 text-center" onClick={(e) => toggleSelect(doc.id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleSelect(doc.id, e)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono-num font-semibold text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/60">
                          {doc.docNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatThaiDate(doc.date)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-[180px] truncate">
                        {doc.org}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {doc.subject}
                          </span>
                          {doc.fileName && (
                            <Paperclip size={13} className="text-slate-400 shrink-0" />
                          )}
                        </div>
                        {doc.notes && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                            {doc.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge status={doc.status} size="xs" dot />
                      </td>
                      {isIncoming && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          {doc.dueDate ? (
                            <span
                              className={`text-xs font-medium inline-flex items-center gap-1 ${isOverdue
                                ? 'text-red-600 dark:text-red-400 font-semibold'
                                : dleft <= 3
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-600 dark:text-slate-400'
                                }`}
                            >
                              {isOverdue && <AlertTriangle size={12} />}
                              {formatThaiDateShort(doc.dueDate)}
                              {dleft !== null && (
                                <span className="text-[11px] opacity-75">
                                  ({dleft < 0 ? `ເກີນ ${-dleft} ວັນ` : `${dleft} ວັນ`})
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="ລາຍລະອຽດ"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(doc);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ==================================================================
            GRID CARD VIEW
            ================================================================== */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const isOverdue =
              isIncoming &&
              doc.status === 'ລໍຖ້າດຳເນີນການ' &&
              doc.dueDate &&
              daysUntil(doc.dueDate) < 0;

            return (
              <div
                key={doc.id}
                onClick={() => onView(doc)}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono-num font-semibold text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/60">
                      {doc.docNumber}
                    </span>
                    <Badge status={doc.status} size="xs" dot />
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    {doc.subject}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building size={13} className="shrink-0 text-slate-400" />
                      <span className="truncate">{doc.org}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="shrink-0 text-slate-400" />
                      <span>{formatThaiDate(doc.date)}</span>
                    </div>
                    {doc.dueDate && (
                      <div
                        className={`flex items-center gap-1.5 font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : ''
                          }`}
                      >
                        <Clock size={13} className="shrink-0" />
                        <span>ກຳນົດສົ່ງ: {formatThaiDate(doc.dueDate)}</span>
                        {isOverdue && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-semibold">
                            ເກີນ
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{doc.category}</span>
                  <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    ລາຍລະອຽດ <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
