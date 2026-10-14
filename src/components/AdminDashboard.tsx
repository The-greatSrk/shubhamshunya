import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  CreditCard, 
  Users, 
  ShoppingBag, 
  Building2, 
  Sliders, 
  ExternalLink,
  Search,
  Filter,
  Plus,
  Award
} from 'lucide-react';
import { 
  getPaymentConfig, 
  savePaymentConfig, 
  FirestorePaymentConfig,
  getTestimonials,
  saveTestimonial,
  FirestoreTestimonial 
} from '../lib/firebase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'upi_settings' | 'orders' | 'admissions' | 'student_stories'>('upi_settings');

  // UPI Settings State
  const [upiId, setUpiId] = useState('shubhamkasar@upi');
  const [payeeName, setPayeeName] = useState('Shubham Kasar');
  const [savingUpi, setSavingUpi] = useState(false);
  const [upiSaveSuccess, setUpiSaveSuccess] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');

  // Submissions State
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<FirestoreTestimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newCohortTrack, setNewCohortTrack] = useState('Full Stack & Distributed Systems');
  const [newCurrentRole, setNewCurrentRole] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectMetrics, setNewProjectMetrics] = useState('');
  const [newSkillsInput, setNewSkillsInput] = useState('TypeScript, Go, Distributed Systems');
  const [savingStory, setSavingStory] = useState(false);
  const [storySuccess, setStorySuccess] = useState(false);

  // Load config and data
  const loadData = async () => {
    // 1. UPI settings
    try {
      const cfg = await getPaymentConfig();
      if (cfg?.upiId) {
        setUpiId(cfg.upiId);
        setPayeeName(cfg.payeeName || 'Shubham Kasar');
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Orders
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }

    // 3. Submissions
    setLoadingSubs(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSubs(false);
    }

    // 4. Testimonials
    setLoadingTestimonials(true);
    try {
      const items = await getTestimonials();
      setTestimonials(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'shubham2026' || passcode === 'codagram' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSaveUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) return;
    setSavingUpi(true);
    setUpiSaveSuccess(false);

    try {
      await savePaymentConfig({
        upiId: upiId.trim(),
        payeeName: payeeName.trim(),
        currency: 'INR',
      });
      setUpiSaveSuccess(true);
      setTimeout(() => setUpiSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save UPI config:', err);
    } finally {
      setSavingUpi(false);
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newQuote.trim() || !newProjectTitle.trim()) return;
    setSavingStory(true);

    try {
      const skillsArray = newSkillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await saveTestimonial({
        studentName: newStudentName.trim(),
        cohortTrack: newCohortTrack.trim(),
        currentRole: newCurrentRole.trim() || 'Software Engineer',
        quote: newQuote.trim(),
        projectTitle: newProjectTitle.trim(),
        projectMetrics: newProjectMetrics.trim() || 'Production capstone verified',
        skills: skillsArray.length > 0 ? skillsArray : ['TypeScript', 'Systems Engineering'],
      });

      setTestimonials((prev) => [created, ...prev]);
      setStorySuccess(true);
      setNewStudentName('');
      setNewCurrentRole('');
      setNewQuote('');
      setNewProjectTitle('');
      setNewProjectMetrics('');
      setTimeout(() => setStorySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save testimonial:', err);
    } finally {
      setSavingStory(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSubmissionStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0c0c10] border border-white/[0.1] rounded-2xl flex flex-col overflow-hidden shadow-2xl text-neutral-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#08080a] flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-bold text-white flex items-center gap-2">
                <span>FOUNDER & OPERATIONS ADMIN DESK</span>
                <span className="text-[10px] font-mono-code text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded">
                  Cloud Firestore Live
                </span>
              </h3>
              <p className="text-[11px] font-mono-code text-neutral-400">
                Manage Recipient UPI ID, Course Orders, Admissions, and Testimonials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={loadData}
                className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono-code text-neutral-300 flex items-center gap-1.5"
                title="Refresh Cloud Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Passcode Lock Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#09090c]">
            <form onSubmit={handleLogin} className="max-w-sm w-full p-8 rounded-2xl glass-panel space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto text-[#d4af37]">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-heading font-bold text-white">
                  Founder Verification
                </h4>
                <p className="text-xs text-neutral-400 font-mono-code">
                  Enter master passcode to unlock configuration & orders
                </p>
              </div>

              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Enter passcode (e.g. shubham2026)..."
                className="w-full px-4 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.1] rounded-xl text-white text-center focus:outline-none focus:border-[#d4af37]"
              />

              {authError && (
                <p className="text-xs font-mono-code text-rose-400">
                  Invalid passcode. Try: shubham2026 or codagram
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-full text-xs font-mono-code uppercase font-semibold text-black bg-white hover:bg-neutral-200 transition-colors"
              >
                Unlock Operations
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col min-h-0 bg-[#09090c]">
            {/* Tab navigation */}
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2 bg-[#0c0c10] overflow-x-auto">
              <button
                onClick={() => setActiveTab('upi_settings')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'upi_settings'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Recipient UPI Setup</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'orders'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('student_stories')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'student_stories'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Student Stories ({testimonials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('admissions')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'admissions'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Admissions ({submissions.length})</span>
              </button>
            </div>

            {/* TAB 1: UPI SETTINGS DECK */}
            {activeTab === 'upi_settings' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#d4af37] uppercase">
                    <Sliders className="w-4 h-4" />
                    <span>Dynamic Payment Destination</span>
                  </div>
                  <h4 className="text-xl font-heading font-bold text-white">
                    Update Your UPI ID For Receiving Payments
                  </h4>
                  <p className="text-xs text-neutral-400 font-light max-w-2xl">
                    When you update this UPI ID, every customer buying *Shunya* or registering for Codagram courses will immediately see this updated VPA and scannable QR code without needing any code redeployments.
                  </p>
                </div>

                <form onSubmit={handleSaveUpi} className="max-w-xl p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-code text-neutral-300 flex items-center justify-between">
                      <span>Recipient UPI VPA (ID):</span>
                      <span className="text-[10px] text-neutral-500">e.g. yourname@okhdfcbank or 98230xxxx@paytm</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. shubhamkasar@upi"
                      className="w-full px-4 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-code text-neutral-300">
                      Payee / Merchant Display Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={payeeName}
                      onChange={(e) => setPayeeName(e.target.value)}
                      placeholder="e.g. Shubham Kasar / Codagram"
                      className="w-full px-4 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono-code text-neutral-400 space-y-1">
                    <div className="text-[11px] text-[#d4af37] font-semibold">Live Preview UPI String:</div>
                    <div className="text-[11px] text-neutral-300 break-all">
                      upi://pay?pa={upiId}&pn={encodeURIComponent(payeeName)}&cu=INR
                    </div>
                  </div>

                  {upiSaveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>UPI Settings successfully updated in Cloud Firestore!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingUpi}
                    className="w-full py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                  >
                    {savingUpi ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save & Publish UPI Settings</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: ORDERS TABLE */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="text-lg font-heading font-bold text-white">
                      Customer Orders & UPI Payments
                    </h4>
                    <p className="text-xs text-neutral-400 font-mono-code">
                      Real-time records from Cloud Firestore
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Filter by name, order ID, or UTR..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="px-3.5 py-1.5 text-xs font-mono-code bg-black/50 border border-white/[0.08] rounded-xl text-white w-64 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {loadingOrders ? (
                  <div className="py-16 text-center text-xs font-mono-code text-neutral-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#d4af37]" />
                    <span>Loading orders...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center text-xs font-mono-code text-neutral-500">
                    No orders recorded yet.
                  </div>
                ) : (
                  <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-black/40">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono-code">
                        <thead className="bg-white/[0.03] border-b border-white/[0.08] text-neutral-400 uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Item</th>
                            <th className="p-3">Buyer</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">UPI Ref (UTR)</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]">
                          {orders
                            .filter(
                              (o) =>
                                o.buyerName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                                o.orderId?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                                o.utrNumber?.toLowerCase().includes(orderSearch.toLowerCase())
                            )
                            .map((ord) => (
                              <tr key={ord.orderId} className="hover:bg-white/[0.02]">
                                <td className="p-3 font-bold text-white">{ord.orderId}</td>
                                <td className="p-3 text-neutral-300 max-w-xs truncate">
                                  {ord.itemName}
                                </td>
                                <td className="p-3 text-neutral-300">
                                  <div>{ord.buyerName}</div>
                                  <div className="text-[10px] text-neutral-500">{ord.buyerEmail}</div>
                                </td>
                                <td className="p-3 font-semibold text-[#d4af37]">₹{ord.amount}</td>
                                <td className="p-3 font-mono text-emerald-400">
                                  {ord.utrNumber || 'Pending'}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono-code ${
                                      ord.status === 'verified'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                        : ord.status === 'fulfilled'
                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                    }`}
                                  >
                                    {ord.status}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleUpdateOrderStatus(ord.orderId, 'verified')}
                                      className="px-2 py-1 rounded bg-white/[0.05] hover:bg-emerald-500/20 text-[10px] text-neutral-300 hover:text-emerald-400"
                                      title="Mark as Verified"
                                    >
                                      Verify
                                    </button>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(ord.orderId, 'fulfilled')}
                                      className="px-2 py-1 rounded bg-white/[0.05] hover:bg-blue-500/20 text-[10px] text-neutral-300 hover:text-blue-400"
                                      title="Mark as Fulfilled"
                                    >
                                      Fulfill
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STUDENT STORIES & TESTIMONIALS (NEW) */}
            {activeTab === 'student_stories' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#d4af37] uppercase">
                    <Award className="w-4 h-4" />
                    <span>Verified Testimonials Management</span>
                  </div>
                  <h4 className="text-xl font-heading font-bold text-white">
                    Publish Student Transformation Stories to Cloud Firestore
                  </h4>
                  <p className="text-xs text-neutral-400 font-light max-w-2xl">
                    New stories added here are instantly saved to the Firestore <code className="text-white">testimonials</code> collection and display in the live StudentSuccess carousel.
                  </p>
                </div>

                {/* Form to Add New Story */}
                <form onSubmit={handleCreateTestimonial} className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
                  <h5 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#d4af37]" />
                    <span>Add New Verified Student Testimonial</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono-code text-neutral-400">Student Name</label>
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="e.g. Gaurav Deshmukh"
                        className="w-full px-3 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono-code text-neutral-400">Cohort Track</label>
                      <input
                        type="text"
                        required
                        value={newCohortTrack}
                        onChange={(e) => setNewCohortTrack(e.target.value)}
                        placeholder="Full Stack & Distributed Systems"
                        className="w-full px-3 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono-code text-neutral-400">Current Role & Company</label>
                      <input
                        type="text"
                        required
                        value={newCurrentRole}
                        onChange={(e) => setNewCurrentRole(e.target.value)}
                        placeholder="Systems Engineer at ScaleGrid"
                        className="w-full px-3 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono-code text-neutral-400">Verified Capstone Project Title</label>
                      <input
                        type="text"
                        required
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        placeholder="e.g. Distributed Sliding-Window Rate Limiter"
                        className="w-full px-3 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono-code text-neutral-400">Project Performance Metric</label>
                      <input
                        type="text"
                        required
                        value={newProjectMetrics}
                        onChange={(e) => setNewProjectMetrics(e.target.value)}
                        placeholder="Benchmarked at 15,000 req/sec with Redis cluster"
                        className="w-full px-3 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono-code text-neutral-400">Skills Mastered (Comma-separated)</label>
                    <input
                      type="text"
                      value={newSkillsInput}
                      onChange={(e) => setNewSkillsInput(e.target.value)}
                      placeholder="Go, TypeScript, PostgreSQL, Docker, Redis"
                      className="w-full px-3 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono-code text-neutral-400">Student Transformation Quote</label>
                    <textarea
                      rows={3}
                      required
                      value={newQuote}
                      onChange={(e) => setNewQuote(e.target.value)}
                      placeholder="What was their real transformation from certificates to true capability?"
                      className="w-full px-3.5 py-2 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37] resize-none"
                    />
                  </div>

                  {storySuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Testimonial successfully saved to Firestore & live carousel!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingStory}
                    className="py-2.5 px-6 rounded-full text-xs font-mono-code uppercase font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-2"
                  >
                    {savingStory ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Publish Story to Firestore</span>
                  </button>
                </form>

                {/* Existing Published Stories List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-code text-neutral-400">
                    <span>Published Firestore Stories ({testimonials.length})</span>
                    <span>Live in Carousel</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-heading font-bold text-white">
                            {t.studentName}
                          </span>
                          <span className="text-[10px] font-mono-code text-[#d4af37]">
                            {t.id}
                          </span>
                        </div>
                        <div className="text-xs font-mono-code text-neutral-400">
                          {t.currentRole} • {t.cohortTrack}
                        </div>
                        <p className="text-xs text-neutral-300 font-light italic line-clamp-2">
                          "{t.quote}"
                        </p>
                        <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono-code text-emerald-400">
                          Capstone: {t.projectTitle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ADMISSIONS & SUBMISSIONS */}
            {activeTab === 'admissions' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-heading font-bold text-white">
                    Student Applications & Partner Requests
                  </h4>
                  <span className="text-xs font-mono-code text-neutral-400">
                    Total: {submissions.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-code text-[#d4af37] uppercase">
                          {sub.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono-code text-neutral-500">
                          {sub.id}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-heading font-bold text-white">
                          {sub.data?.name || sub.data?.institutionName || sub.data?.company || 'Applicant'}
                        </div>
                        <div className="text-xs font-mono-code text-neutral-400">
                          {sub.data?.email} {sub.data?.phone ? `• ${sub.data.phone}` : ''}
                        </div>
                      </div>

                      {sub.data?.trackOrRole && (
                        <div className="text-xs font-mono-code text-neutral-300 bg-white/[0.03] p-2 rounded">
                          Track: {sub.data.trackOrRole}
                        </div>
                      )}

                      {sub.data?.motivation || sub.data?.notes || sub.data?.context || sub.data?.message ? (
                        <p className="text-xs text-neutral-400 font-light line-clamp-2">
                          "{sub.data.motivation || sub.data.notes || sub.data.context || sub.data.message}"
                        </p>
                      ) : null}

                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-code">
                        <span className="text-neutral-500 uppercase text-[10px]">
                          Status: <strong className="text-white">{sub.status}</strong>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateSubmissionStatus(sub.id, 'reviewing')}
                            className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[10px]"
                          >
                            Reviewing
                          </button>
                          <button
                            onClick={() => handleUpdateSubmissionStatus(sub.id, 'connected')}
                            className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-emerald-500/20 text-[10px] text-emerald-400"
                          >
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
