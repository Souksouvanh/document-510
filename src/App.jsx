import React, { useState, useEffect, useCallback } from 'react';
import {
  Inbox,
  Send,
  BarChart3,
  Settings as SettingsIcon,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  Plus,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  DEFAULT_SETTINGS,
  toBE,
  daysUntil,
  todayISO,
  sGet,
  sSet,
  sDelete,
  sList,
  seedSampleData,
} from './documentData.js';
import { SealMark } from './components/ui.jsx';
import DocFormModal from './components/DocFormModal.jsx';
import DocViewModal from './components/DocViewModal.jsx';
import DocList from './components/DocList.jsx';
import Dashboard from './components/Dashboard.jsx';
import Reports from './components/Reports.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [view, setView] = useState('dashboard');
  const [formModal, setFormModal] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load settings & documents
  const loadAll = useCallback(async () => {
    setLoading(true);

    // 1. Load settings
    const settingsRaw = await sGet('meta:settings');
    if (settingsRaw) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(settingsRaw) }));
      } catch {
        // ignore invalid
      }
    }

    // 2. Load documents
    const keys = await sList('doc:');
    let docs = [];

    if (keys.length > 0) {
      const raws = await Promise.all(keys.map((k) => sGet(k)));
      docs = raws
        .filter(Boolean)
        .map((r) => {
          try {
            return JSON.parse(r);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } else {
      // First run: seed sample documents
      docs = await seedSampleData();
    }

    docs.sort(
      (a, b) =>
        (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0)
    );
    setDocuments(docs);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Generate official running document number
  async function generateDocNumber(type, dateISO, currentSettings) {
    const year = new Date(dateISO || todayISO()).getFullYear();
    const be = toBE(year);
    const counterKey = `meta:counter:${type}:${be}`;
    const raw = await sGet(counterKey);
    const n = raw ? parseInt(raw, 10) + 1 : 1;
    await sSet(counterKey, String(n));
    const prefix = type === 'in' ? currentSettings.prefixIn : currentSettings.prefixOut;
    return `${prefix}${String(n).padStart(currentSettings.digits, '0')}/${be}`;
  }

  // Save document (Create / Edit)
  async function handleSaveDoc(form) {
    const isNew = !form.id;
    const toSave = { ...form };

    if (isNew) {
      toSave.id = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      toSave.docNumber = await generateDocNumber(toSave.type, toSave.date, settings);
      toSave.createdAt = Date.now();
    }

    const ok = await sSet(`doc:${toSave.id}`, JSON.stringify(toSave));
    if (ok) {
      setDocuments((prev) => {
        const exists = prev.some((d) => d.id === toSave.id);
        const next = exists
          ? prev.map((d) => (d.id === toSave.id ? toSave : d))
          : [toSave, ...prev];
        next.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        return next;
      });
      showToast(
        isNew
          ? `ບັນທຶກລົງທະບຽນເລກທີ ${toSave.docNumber} ສຳເລັດ`
          : `ບັນທຶກການແກ້ໄຂ ${toSave.docNumber} ສຳເລັດ`,
        'success'
      );
      setFormModal(null);
      setViewDoc((v) => (v && v.id === toSave.id ? toSave : v));
    } else {
      showToast('ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ', 'error');
    }
  }

  // Quick inline status change
  async function handleStatusChange(doc, newStatus) {
    const updated = { ...doc, status: newStatus };
    const ok = await sSet(`doc:${doc.id}`, JSON.stringify(updated));
    if (ok) {
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
      setViewDoc(updated);
      showToast(`ປ່ຽນສະຖານະເປັນ "${newStatus}" ສຳເລັດ`, 'success');
    }
  }

  // Delete document
  async function handleDelete(id) {
    const ok = await sDelete(`doc:${id}`);
    if (ok) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setViewDoc(null);
      showToast('ລົບເອກະສານອອກຈາກລະບົບ ສຳເລັດ', 'success');
    }
  }

  // Save system settings
  async function handleSaveSettings(newSettings) {
    setSettings(newSettings);
    await sSet('meta:settings', JSON.stringify(newSettings));
    showToast('ບັນທຶກການຕັ້ງຄ່າລະບົບ ສຳເລັດ', 'success');
  }

  // Seed sample demo data
  async function handleSeedSample() {
    setLoading(true);
    const samples = await seedSampleData();
    setDocuments(samples);
    setLoading(false);
    showToast('ໂຫຼດຂໍ້ມູນຕົວຢ່າງສຳເລັດ', 'success');
  }

  // Export JSON backup
  function handleExportBackup() {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      documents,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_documents_${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('ດາວໂຫຼດໄຟລ໌ສຳຮອງສຳເລັດ', 'success');
  }

  // Import JSON backup
  async function handleImportBackup(data) {
    if (!data || !Array.isArray(data.documents)) {
      showToast('ຮູບແບບໄຟລ໌ສຳຮອງບໍ່ຖືກຕ້ອງ', 'error');
      return;
    }
    setLoading(true);
    if (data.settings) {
      setSettings(data.settings);
      await sSet('meta:settings', JSON.stringify(data.settings));
    }
    for (const doc of data.documents) {
      await sSet(`doc:${doc.id}`, JSON.stringify(doc));
    }
    setDocuments(data.documents);
    setLoading(false);
    showToast(`ກູ້ຄືນຂໍ້ມູນສຳເລັດ ${data.documents.length} ລາຍການ`, 'success');
  }

  // Wipe database
  async function handleWipe() {
    const keys = await sList('doc:');
    await Promise.all(keys.map((k) => sDelete(k)));
    setDocuments([]);
    showToast('ລົບເອກະສານທັງໝົດອອກຈາກລະບົບສຳເລັດ', 'success');
  }

  // Overdue count for alert
  const overdueDocs = documents.filter(
    (d) =>
      d.type === 'in' &&
      d.status === 'ລໍຖ້າດຳເນີນການ' &&
      d.dueDate &&
      daysUntil(d.dueDate) !== null &&
      daysUntil(d.dueDate) <= 3
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'in',
      label: 'ເອກະສານຂາເຂົ້າ',
      icon: Inbox,
      badge: overdueDocs.length > 0 ? overdueDocs.length : null,
    },
    { id: 'out', label: 'ເອກະສານຂາອອກ', icon: Send },
    { id: 'reports', label: 'ລາຍງານແລະສະຖິຕິ', icon: BarChart3 },
    { id: 'settings', label: 'ຕັ້ງຄ່າ', icon: SettingsIcon },
  ];

  const viewTitles = {
    dashboard: 'Dashboard',
    in: 'ເອກະສານຂາເຂົ້າ',
    out: 'ເອກະສານຂາອອກ',
    reports: 'ລາຍງານແລະສະຖິຕິ',
    settings: 'ຕັ້ງຄ່າ',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <SealMark size={56} className="animate-pulse mb-4" />
        <p className="text-sm font-medium tracking-wide">ກຳລັງກະກຽມຂໍ້ມູນ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* ==================================================================
          DESKTOP SIDEBAR NAVIGATION
          ================================================================== */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sticky top-0 h-screen z-30 justify-between">
        <div className="space-y-6">
          {/* Header & Logo */}
          <div className="flex items-center gap-3 px-1">
            <SealMark size={38} color={isDarkMode ? '#3B82F6' : '#1E3A8A'} />
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-thai leading-snug truncate">
                ລະບົບຈັດການເອກະສານ
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                {settings.orgName}
              </p>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={() => setFormModal({ defaultType: 'in' })}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus size={16} /> ບັນທຶກເອກະສານ
          </button>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = view === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          {/* Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
              <span>{isDarkMode ? 'ໂໝດມືດ (Dark)' : 'ໂໝດສະຫວ່າງ (Light)'}</span>
            </span>
            <span className="text-[11px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
              ສະຫຼັບ
            </span>
          </button>

          {/* Version badge */}
          <div className="text-[11px] text-slate-400 px-3 flex items-center justify-between">
            <span>Doc-510 v2.0</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ພ້ອມໃຊ້ງານ
            </span>
          </div>
        </div>
      </aside>

      {/* ==================================================================
          MOBILE TOP NAVBAR
          ================================================================== */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <SealMark size={32} color={isDarkMode ? '#3B82F6' : '#1E3A8A'} />
          <div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-thai leading-tight block">
              ລະບົບຈັດການເອກະສານ
            </span>
            <span className="text-[11px] text-slate-400 truncate max-w-[140px] block">
              {settings.orgName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileNav((o) => !o)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileNav && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 z-30 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 animate-in shadow-xl">
            <button
              type="button"
              onClick={() => {
                setFormModal({ defaultType: 'in' });
                setMobileNav(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 text-white font-semibold text-sm mb-3"
            >
              <Plus size={16} /> ບັນທຶກເອກະສານ
            </button>

            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setView(item.id);
                  setMobileNav(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${view === item.id
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          MAIN CONTENT AREA & TOP HEADER
          ================================================================== */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Header Bar (Desktop) */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-thai tracking-tight">
              {viewTitles[view]}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {settings.department || settings.orgName} • ປີ {toBE(new Date().getFullYear())}
            </p>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Urgent Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="ການແຈ້ງເຕືອນວຽກຕິດຕາມ"
              >
                <Bell size={18} />
                {overdueDocs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Notification Popover */}
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 z-50 animate-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      ເອກະສານທີ່ຕ້ອງຕິດຕາມດ່ວນ ({overdueDocs.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {overdueDocs.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      <CheckCircle2 size={24} className="mx-auto mb-1.5 text-emerald-500/80" />
                      ບໍ່ມີເອກະສານທີ່ເກີນຫຼືໃກ້ກຳນົດຕອບກັບ
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {overdueDocs.map((d) => {
                        const days = daysUntil(d.dueDate);
                        const isPast = days < 0;

                        return (
                          <div
                            key={d.id}
                            onClick={() => {
                              setViewDoc(d);
                              setNotifOpen(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono-num font-semibold text-blue-600 dark:text-blue-400">
                                {d.docNumber}
                              </span>
                              <span
                                className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-full ${isPast
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                  }`}
                              >
                                {isPast ? `ເກີນ ${-days} ວັນ` : `${days} ວັນ`}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate mt-1">
                              {d.subject}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Action: New Document */}
            <button
              type="button"
              onClick={() => setFormModal({ defaultType: 'in' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus size={14} /> ບັນທຶກເອກະສານ
            </button>
          </div>
        </header>

        {/* View Content Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {view === 'dashboard' && (
            <Dashboard
              documents={documents}
              onView={setViewDoc}
              onGo={setView}
              onAdd={setFormModal}
            />
          )}
          {view === 'in' && (
            <DocList
              type="in"
              documents={documents}
              onView={setViewDoc}
              onAdd={() => setFormModal({ defaultType: 'in' })}
            />
          )}
          {view === 'out' && (
            <DocList
              type="out"
              documents={documents}
              onView={setViewDoc}
              onAdd={() => setFormModal({ defaultType: 'out' })}
            />
          )}
          {view === 'reports' && <Reports documents={documents} />}
          {view === 'settings' && (
            <SettingsPanel
              settings={settings}
              onSave={handleSaveSettings}
              onWipe={handleWipe}
              onSeedSample={handleSeedSample}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
            />
          )}
        </div>
      </main>

      {/* ==================================================================
          MODALS & TOAST NOTIFICATIONS
          ================================================================== */}
      {formModal && (
        <DocFormModal
          initial={formModal.initial}
          defaultType={formModal.defaultType || 'in'}
          onClose={() => setFormModal(null)}
          onSave={handleSaveDoc}
        />
      )}

      {viewDoc && (
        <DocViewModal
          doc={viewDoc}
          onClose={() => setViewDoc(null)}
          onEdit={(d) => {
            setViewDoc(null);
            setFormModal({ initial: d, defaultType: d.type });
          }}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border animate-in ${toast.type === 'error'
            ? 'bg-red-600 text-white border-red-700'
            : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-800'
            }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle size={16} />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
