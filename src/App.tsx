import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import {
  ActivityLogEntry,
  DesignerInput,
  DesignerRecord,
  RecordStatus,
  User,
  UserRole,
} from './types/venture';
import {
  DEFAULT_DESIGNER_INPUT,
  appendActivity,
  getActivityLog,
  getRecords,
  getSavedInput,
  getSession,
  getStallFee,
  getUsers,
  initializeStorage,
  resetDemoRecords,
  saveInputForUser,
  saveRecords,
  saveSession,
  saveStallFee,
  saveUsers,
} from './utils/storage';
import { calculateAssessment } from './utils/calculations';
import { exportRecordsToCSV, formatINR } from './utils/format';
import { downloadDesignerPDF } from './utils/pdfExport';
import { AuthScreen } from './components/AuthScreen';
import { AppView, Header } from './components/Header';
import { StepOnboarding } from './components/StepOnboarding';
import { StepInputs } from './components/StepInputs';
import { StepResults } from './components/StepResults';
import { StepReserveExport } from './components/StepReserveExport';
import { AdminDashboard } from './components/AdminDashboard';
import { RecordsView } from './components/RecordsView';
import { ProfileView } from './components/ProfileView';
import { ActivityLogPanel } from './components/ActivityLogPanel';

type StudioStep = 1 | 2 | 3 | 4;

const STUDIO_STEPS: { step: StudioStep; label: string }[] = [
  { step: 1, label: '01. Framing' },
  { step: 2, label: '02. Commercial Inputs' },
  { step: 3, label: '03. ROI & Readiness' },
  { step: 4, label: '04. Reserve & Export' },
];

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [records, setRecords] = useState<DesignerRecord[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [stallFee, setStallFee] = useState<number>(85000);

  const [activeView, setActiveView] = useState<AppView>('studio');
  const [studioStep, setStudioStep] = useState<StudioStep>(1);
  const [designerInput, setDesignerInput] = useState<DesignerInput>(DEFAULT_DESIGNER_INPUT);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    initializeStorage();
    const loadedUsers = getUsers();
    const loadedRecords = getRecords();
    const loadedActivity = getActivityLog();
    const loadedFee = getStallFee();
    const session = getSession();

    setUsers(loadedUsers);
    setRecords(loadedRecords);
    setActivityLog(loadedActivity);
    setStallFee(loadedFee);

    if (session) {
      const matched = loadedUsers.find(
        (u) => u.id === session.userId || u.email.toLowerCase() === session.email.toLowerCase()
      );
      if (matched) {
        setCurrentUser(matched);
        const savedInput = getSavedInput(matched.email);
        if (savedInput) setDesignerInput(savedInput);
        if (matched.role === 'Admin') {
          setActiveView('admin');
        }
      } else {
        saveSession(null);
      }
    }
    setInitialized(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const runAsync = async <T,>(fn: () => T | Promise<T>, delayMs = 260): Promise<T> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
      return await fn();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string): Promise<string | null> => {
    return runAsync(() => {
      const latestUsers = getUsers();
      const found = latestUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!found || found.password !== password) {
        return 'Invalid email or password. Please verify your credentials or use Demo access.';
      }
      saveSession({
        userId: found.id,
        email: found.email,
        loggedInAt: new Date().toISOString(),
      });
      const nextLog = appendActivity(found.email, 'login', `signed in (${found.role})`);
      setUsers(latestUsers);
      setCurrentUser(found);
      setActivityLog(nextLog);

      const saved = getSavedInput(found.email);
      setDesignerInput(saved ?? DEFAULT_DESIGNER_INPUT);
      setActiveRecordId(null);
      setStudioStep(1);
      setActiveView(found.role === 'Admin' ? 'admin' : 'studio');
      showToast(`Signed in as ${found.name} (${found.email})`);
      return null;
    });
  };

  const handleSignUp = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<string | null> => {
    return runAsync(() => {
      const latestUsers = getUsers();
      const normalized = email.trim().toLowerCase();
      const duplicate = latestUsers.some((u) => u.email.toLowerCase() === normalized);
      if (duplicate) {
        return `An account with ${normalized} already exists. Please sign in instead.`;
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: normalized,
        password,
        role,
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...latestUsers, newUser];
      saveUsers(updatedUsers);
      saveSession({
        userId: newUser.id,
        email: newUser.email,
        loggedInAt: new Date().toISOString(),
      });
      const nextLog = appendActivity(newUser.email, 'signup', `created a ${role} account`);
      setUsers(updatedUsers);
      setCurrentUser(newUser);
      setActivityLog(nextLog);
      setDesignerInput(DEFAULT_DESIGNER_INPUT);
      setActiveRecordId(null);
      setStudioStep(1);
      setActiveView(newUser.role === 'Admin' ? 'admin' : 'studio');
      showToast(`Account created for ${newUser.email}`);
      return null;
    });
  };

  const handleLogout = async () => {
    if (!currentUser) return;
    await runAsync(() => {
      const nextLog = appendActivity(currentUser.email, 'logout', 'logged out of Studio');
      saveSession(null);
      setActivityLog(nextLog);
      setCurrentUser(null);
      setActiveRecordId(null);
      setStudioStep(1);
    }, 180);
  };

  const handleInputChange = (next: DesignerInput) => {
    setDesignerInput(next);
    if (currentUser) {
      saveInputForUser(currentUser.email, next);
    }
  };

  const handleUpdateStallFee = async (nextFee: number) => {
    if (!currentUser || currentUser.role !== 'Admin') return;
    await runAsync(() => {
      saveStallFee(nextFee);
      setStallFee(nextFee);
      const recalculated = records.map((rec) => ({
        ...rec,
        metrics: calculateAssessment(rec.input, nextFee),
      }));
      saveRecords(recalculated);
      setRecords(recalculated);
      const nextLog = appendActivity(
        currentUser.email,
        'fee_update',
        `updated turnkey stall fee to ${formatINR(nextFee)}`
      );
      setActivityLog(nextLog);
      showToast(`Stall fee updated to ${formatINR(nextFee)}`);
    });
  };

  const handleRunAssessment = async () => {
    if (!currentUser) return;
    await runAsync(() => {
      const metrics = calculateAssessment(designerInput, stallFee);
      const now = new Date().toISOString();
      const newRecord: DesignerRecord = {
        id: `rec-${Date.now()}`,
        designerName: currentUser.name,
        email: currentUser.email,
        input: { ...designerInput, brandName: designerInput.brandName.trim() },
        metrics,
        status: 'Assessed',
        createdAt: now,
        updatedAt: now,
      };
      const nextRecords = [newRecord, ...records];
      saveRecords(nextRecords);
      setRecords(nextRecords);
      setActiveRecordId(newRecord.id);

      const nextLog = appendActivity(
        currentUser.email,
        'assessment',
        `ran an assessment for "${newRecord.input.brandName}" (Score ${metrics.readinessScore}/100)`
      );
      setActivityLog(nextLog);
      setStudioStep(3);
      showToast(`Assessment saved for ${currentUser.email}`);
    });
  };

  const handleUpdateRecordStatus = async (recordId: string, nextStatus: RecordStatus) => {
    if (!currentUser) return;
    await runAsync(() => {
      const now = new Date().toISOString();
      let targetBrand = '';
      const nextRecords = records.map((rec) => {
        if (rec.id === recordId) {
          targetBrand = rec.input.brandName;
          return { ...rec, status: nextStatus, updatedAt: now };
        }
        return rec;
      });
      saveRecords(nextRecords);
      setRecords(nextRecords);
      const nextLog = appendActivity(
        currentUser.email,
        'status_change',
        `changed status for "${targetBrand}" to ${nextStatus}`
      );
      setActivityLog(nextLog);
      showToast(`Confirmation recorded for ${currentUser.email} (${nextStatus})`);
    });
  };

  const handleDownloadPDF = async (record: DesignerRecord) => {
    if (!currentUser) return;
    await runAsync(() => {
      downloadDesignerPDF(record);
      const nextLog = appendActivity(
        currentUser.email,
        'export',
        `downloaded PDF report for "${record.input.brandName}"`
      );
      setActivityLog(nextLog);
      showToast(`PDF dossier downloaded for ${record.input.brandName}`);
    });
  };

  const userScopedRecords = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'Admin') return records;
    return records.filter((r) => r.email.toLowerCase() === currentUser.email.toLowerCase());
  }, [currentUser, records]);

  const handleExportCSV = async (allRecords = false) => {
    if (!currentUser) return;
    await runAsync(() => {
      const dataset = allRecords && currentUser.role === 'Admin' ? records : userScopedRecords;
      const filename = allRecords
        ? 'vibe_and_vogue_all_designers_validation.csv'
        : 'vibe_and_vogue_my_assessments.csv';
      exportRecordsToCSV(dataset, filename);
      const nextLog = appendActivity(
        currentUser.email,
        'export',
        `exported ${dataset.length} assessment records to CSV`
      );
      setActivityLog(nextLog);
      showToast(`Exported ${dataset.length} records to CSV`);
    });
  };

  const handleResetDemoData = async () => {
    if (!currentUser || currentUser.role !== 'Admin') return;
    await runAsync(() => {
      const result = resetDemoRecords(currentUser.email);
      setRecords(result.records);
      setActivityLog(result.activity);
      setStallFee(85000);
      setActiveRecordId(null);
      showToast('Restored 8 sample designer records & ₹85,000 stall fee');
    });
  };

  const handleOpenRecordInStudio = (record: DesignerRecord) => {
    setDesignerInput(record.input);
    setActiveRecordId(record.id);
    setActiveView('studio');
    setStudioStep(3);
  };

  const activeRecord = useMemo(() => {
    if (!activeRecordId) return null;
    return records.find((r) => r.id === activeRecordId) ?? null;
  }, [activeRecordId, records]);

  const currentMetrics = useMemo(() => {
    if (activeRecord) return activeRecord.metrics;
    return calculateAssessment(designerInput, stallFee);
  }, [activeRecord, designerInput, stallFee]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] text-[#4A102A]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} isLoading={isLoading} />
    );
  }

  const effectiveView: AppView =
    activeView === 'admin' && currentUser.role !== 'Admin' ? 'studio' : activeView;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F171A]">
      <Header
        user={currentUser}
        activeView={effectiveView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
        isLoading={isLoading}
      />

      {/* Persistent Async Loading & Toast Feedback */}
      {(isLoading || toastMessage) && (
        <div className="fixed bottom-5 right-5 z-40 max-w-sm no-print">
          {isLoading ? (
            <div className="px-4 py-2.5 rounded-xl bg-[#4A102A] text-[#FAF7F2] shadow-lg flex items-center gap-2.5 text-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-[#E8D9B8]" />
              <span>Updating studio workspace...</span>
            </div>
          ) : (
            toastMessage && (
              <div
                role="status"
                className="px-4 py-2.5 rounded-xl bg-[#1F171A] text-[#FAF7F2] shadow-lg flex items-center gap-2.5 text-xs font-medium border border-[#C59B48]/40"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E8D9B8] shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )
          )}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {effectiveView === 'studio' && (
          <div className="space-y-6">
            {/* Stepper Bar */}
            <div className="p-2 rounded-xl bg-[#F3EDE3] border border-[#E2D9CE] flex flex-wrap items-center gap-2">
              {STUDIO_STEPS.map((item) => {
                const canClick =
                  item.step <= 2 || (item.step >= 3 && activeRecord !== null);
                const isActive = studioStep === item.step;
                return (
                  <button
                    key={item.step}
                    type="button"
                    disabled={!canClick}
                    onClick={() => canClick && setStudioStep(item.step)}
                    className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-center ${
                      isActive
                        ? 'bg-[#4A102A] text-white'
                        : canClick
                          ? 'text-[#1F171A] hover:bg-white/70'
                          : 'text-[#9A8D91] cursor-not-allowed'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {studioStep === 1 && (
              <StepOnboarding
                user={currentUser}
                stallFee={stallFee}
                onStartAssessment={() => setStudioStep(2)}
              />
            )}

            {studioStep === 2 && (
              <StepInputs
                user={currentUser}
                input={designerInput}
                stallFee={stallFee}
                isLoading={isLoading}
                onChangeInput={handleInputChange}
                onUpdateStallFee={handleUpdateStallFee}
                onBack={() => setStudioStep(1)}
                onRunAssessment={handleRunAssessment}
              />
            )}

            {studioStep === 3 && (
              <StepResults
                input={activeRecord ? activeRecord.input : designerInput}
                metrics={currentMetrics}
                onEditInputs={() => setStudioStep(2)}
                onProceedToReserve={() => {
                  if (activeRecord) {
                    setStudioStep(4);
                  } else {
                    handleRunAssessment().then(() => setStudioStep(4));
                  }
                }}
              />
            )}

            {studioStep === 4 && activeRecord && (
              <StepReserveExport
                user={currentUser}
                record={activeRecord}
                isLoading={isLoading}
                onUpdateStatus={handleUpdateRecordStatus}
                onDownloadPDF={handleDownloadPDF}
                onDownloadCSV={() => handleExportCSV(false)}
                onBackToResults={() => setStudioStep(3)}
                onViewRecords={() => setActiveView('records')}
              />
            )}
          </div>
        )}

        {effectiveView === 'records' && (
          <RecordsView
            user={currentUser}
            records={userScopedRecords}
            isLoading={isLoading}
            onLoadRecord={handleOpenRecordInStudio}
            onDownloadPDF={handleDownloadPDF}
            onExportCSV={() => handleExportCSV(currentUser.role === 'Admin')}
            onStartNew={() => {
              setActiveRecordId(null);
              setActiveView('studio');
              setStudioStep(2);
            }}
          />
        )}

        {effectiveView === 'admin' && currentUser.role === 'Admin' && (
          <AdminDashboard
            users={users}
            records={records}
            stallFee={stallFee}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateRecordStatus}
            onUpdateStallFee={handleUpdateStallFee}
            onExportAllCSV={() => handleExportCSV(true)}
            onResetDemoData={handleResetDemoData}
            onOpenRecordInStudio={handleOpenRecordInStudio}
          />
        )}

        {effectiveView === 'activity' && (
          <ActivityLogPanel user={currentUser} entries={activityLog} />
        )}

        {effectiveView === 'profile' && (
          <ProfileView
            user={currentUser}
            userRecords={records.filter(
              (r) => r.email.toLowerCase() === currentUser.email.toLowerCase()
            )}
            onLogout={handleLogout}
            onGoToStudio={() => setActiveView('studio')}
          />
        )}
      </main>

      <footer className="border-t border-[#E2D9CE] bg-[#F3EDE3] px-6 py-5 text-center text-xs text-[#6B5D62] no-print">
        Venture by Nishita Singh | nishita.0251mba514@dgu.ac.in | DBS Global University, Venture Quest
      </footer>
    </div>
  );
}
