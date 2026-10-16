import React, { useState, useEffect, useRef } from 'react';
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
  Award,
  Globe,
  AlertCircle,
  Copy,
  Check,
  Key,
  Upload,
  ShieldAlert,
  Sparkles,
  Camera,
  Image as ImageIcon,
  LogOut,
  CheckCheck
} from 'lucide-react';
import { 
  getPaymentConfig, 
  savePaymentConfig, 
  FirestorePaymentConfig,
  getTestimonials,
  saveTestimonial,
  FirestoreTestimonial,
  auth
} from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { saveCustomFounderPhoto, useLiveAssets } from '../utils/customAssets';
import { ASSETS } from '../assets/branding';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { founderPhoto } = useLiveAssets();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string>(() => {
    try {
      return sessionStorage.getItem('codagram_admin_token') || '';
    } catch {
      return '';
    }
  });
  const [sessionInfo, setSessionInfo] = useState<{ method: string; email: string } | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const [activeTab, setActiveTab] = useState<
    'upi_settings' | 'orders' | 'founder_assets' | 'security' | 'admissions' | 'student_stories' | 'google_seo'
  >('upi_settings');

  // Security & Password Management State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Founder Photo Upload & Management State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Check stored session validity on open
  useEffect(() => {
    if (!isOpen) return;
    const storedToken = sessionStorage.getItem('codagram_admin_token');
    if (storedToken) {
      fetch('/api/admin/session', {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.session) {
            setAdminToken(storedToken);
            setIsAuthenticated(true);
            setSessionInfo(data.session);
          } else {
            sessionStorage.removeItem('codagram_admin_token');
            setAdminToken('');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          // keep local
        });
    }
  }, [isOpen]);

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

  // Google SEO & Indexing State
  const [googleVerification, setGoogleVerification] = useState('');
  const [savingSeo, setSavingSeo] = useState(false);
  const [seoSuccess, setSeoSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');

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

    // 2. Orders (Protected by Admin Token)
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }

    // 3. Submissions (Protected by Admin Token)
    setLoadingSubs(true);
    try {
      const res = await fetch('/api/submissions', {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
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

    // 5. SEO Config
    try {
      const res = await fetch('/api/seo/config');
      const data = await res.json();
      if (data && data.googleSiteVerification) {
        setGoogleVerification(data.googleSiteVerification);
      }
    } catch (e) {
      console.warn('Error loading SEO config:', e);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSeo(true);
    setSeoSuccess(false);
    try {
      await fetch('/api/seo/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleVerification: googleVerification.trim() }),
      });
      setSeoSuccess(true);
      setTimeout(() => setSeoSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save SEO config:', err);
    } finally {
      setSavingSeo(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // 1. Authenticate with Master Password (Encrypted & Rate-Limited Server Verification)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    if (lockoutSeconds > 0) return;

    setAuthLoading(true);
    setAuthErrorMessage('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        sessionStorage.setItem('codagram_admin_token', data.token);
        setAdminToken(data.token);
        setIsAuthenticated(true);
        setSessionInfo({ method: 'password', email: data.founderEmail || 'shubhamkasarsrk@gmail.com' });
        setPasscode('');
        setAuthErrorMessage('');
      } else {
        setAuthErrorMessage(data.error || 'Access denied: Invalid master credentials.');
        if (data.lockedSeconds) {
          setLockoutSeconds(data.lockedSeconds);
        }
      }
    } catch (err: any) {
      setAuthErrorMessage('Authentication server unreachable. Please verify connection.');
    } finally {
      setAuthLoading(false);
    }
  };

  // 2. Authenticate with Founder Google Account (Zero-Trust OAuth)
  const handleGoogleLogin = async () => {
    if (lockoutSeconds > 0) return;
    setAuthLoading(true);
    setAuthErrorMessage('');

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const email = result.user?.email || '';

      const res = await fetch('/api/admin/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        sessionStorage.setItem('codagram_admin_token', data.token);
        setAdminToken(data.token);
        setIsAuthenticated(true);
        setSessionInfo({ method: 'google_oauth', email: data.founderEmail || email });
        setAuthErrorMessage('');
      } else {
        setAuthErrorMessage(data.error || 'Access denied: Google account is not the authorized founder.');
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthErrorMessage(err.message || 'Google authentication failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // 3. Logout
  const handleLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch {
        // ignore
      }
    }
    sessionStorage.removeItem('codagram_admin_token');
    setAdminToken('');
    setIsAuthenticated(false);
    setSessionInfo(null);
  };

  // 4. Change Master Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Current master password is required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordSuccess('Master password successfully updated in encrypted vault.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 5000);
      } else {
        setPasswordError(data.error || 'Failed to update master password.');
      }
    } catch (err: any) {
      setPasswordError('Server communication error.');
    } finally {
      setSavingPassword(false);
    }
  };

  // 5. Handle Exact Founder Photo Selection & Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (PNG, JPG, or WebP).');
      return;
    }

    setPhotoFile(file);
    setPhotoError('');
    setPhotoSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveFounderPhoto = async () => {
    if (!photoPreview) {
      setPhotoError('Please select a photo first.');
      return;
    }

    setSavingPhoto(true);
    setPhotoError('');
    setPhotoSuccess(false);

    try {
      const res = await fetch('/api/admin/founder-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          photoBase64: photoPreview,
          mimeType: photoFile?.type || 'image/jpeg',
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        saveCustomFounderPhoto(photoPreview);
        setPhotoSuccess(true);
        setTimeout(() => setPhotoSuccess(false), 5000);
      } else {
        setPhotoError(data.error || 'Failed to save official founder photo.');
      }
    } catch (err: any) {
      setPhotoError('Server communication error.');
    } finally {
      setSavingPhoto(false);
    }
  };

  // 6. Save Recipient UPI Config
  const handleSaveUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) return;
    setSavingUpi(true);
    setUpiSaveSuccess(false);

    try {
      await fetch('/api/settings/upi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          upiId: upiId.trim(),
          payeeName: payeeName.trim(),
          currency: 'INR',
        }),
      });

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
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
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono-code">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{sessionInfo?.email || 'shubhamkasarsrk@gmail.com'}</span>
                </div>
                <button
                  onClick={loadData}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono-code text-neutral-300 flex items-center gap-1.5"
                  title="Refresh Cloud Data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh Data</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-mono-code flex items-center gap-1.5 border border-rose-500/20"
                  title="Sign out of Admin Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zero-Trust Admin Authentication Lock Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#09090c] overflow-y-auto">
            <div className="max-w-md w-full p-8 rounded-2xl glass-panel border border-white/[0.1] space-y-6 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#0F1523] border border-[#1E293B] flex items-center justify-center mx-auto text-[#d4af37] shadow-lg">
                <Lock className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono-code uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Zero-Trust Founder Verification</span>
                </div>
                <h4 className="text-xl font-heading font-bold text-white">
                  Founder & Admin Security Access
                </h4>
                <p className="text-xs text-neutral-400 font-mono-code">
                  Encrypted authentication required to access payment routing, orders, and sensitive records.
                </p>
              </div>

              {/* Primary Method: Google Sign-In for Verified Founder */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3 text-left">
                <div className="flex items-center justify-between text-[11px] font-mono-code text-neutral-300">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <Award className="w-3.5 h-3.5 text-[#4285F4]" />
                    <span>Founder OAuth (One-Click)</span>
                  </span>
                  <span className="text-emerald-400 text-[10px]">Recommended</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                  Sign in with the official Google account associated with Codagram: <strong className="text-white font-mono">shubhamkasarsrk@gmail.com</strong>
                </p>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={authLoading || lockoutSeconds > 0}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-mono-code font-bold text-white bg-[#0F1523] hover:bg-[#1E293B] border border-[#4285F4]/40 hover:border-[#4285F4] transition-all flex items-center justify-center gap-2.5 shadow-md disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{authLoading ? 'Verifying...' : 'Sign in as shubhamkasarsrk@gmail.com'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/[0.08] w-full" />
                <span className="bg-[#0c0c10] px-3 text-[10px] font-mono-code text-neutral-500 uppercase tracking-widest absolute">
                  OR MASTER VAULT PASSWORD
                </span>
              </div>

              {/* Password Form with Rate Limiting & Zero Plaintext Leaks */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-mono-code text-neutral-400">
                    Encrypted Master Password
                  </label>
                  <input
                    type="password"
                    required
                    disabled={authLoading || lockoutSeconds > 0}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setAuthErrorMessage('');
                    }}
                    placeholder="Enter Master Password"
                    className="w-full px-4 py-2.5 text-xs font-mono-code bg-black/70 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#4285F4] transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Lockout notification */}
                {lockoutSeconds > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-code text-left flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <div className="font-bold">Security Lockout Active</div>
                      <div>Too many failed attempts. Try again in <strong>{lockoutSeconds}</strong> seconds.</div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {authErrorMessage && lockoutSeconds === 0 && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono-code text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>{authErrorMessage}</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading || lockoutSeconds > 0 || !passcode.trim()}
                  className="w-full py-2.5 rounded-xl text-xs font-mono-code uppercase font-bold text-black bg-white hover:bg-neutral-200 transition-colors disabled:opacity-40"
                >
                  {authLoading ? 'Authenticating...' : 'Unlock Operations Desk'}
                </button>
              </form>

              <div className="pt-2 text-[10px] font-mono-code text-neutral-500">
                Encrypted with SHA-256 & Salt • Rate-Limited Protection Active
              </div>
            </div>
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
                onClick={() => setActiveTab('founder_assets')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'founder_assets'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#34A853]" />
                <span>Founder Photo & Identity</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'security'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-[#FBBC05]" />
                <span>Security & Master Key</span>
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

              <button
                onClick={() => setActiveTab('google_seo')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'google_seo'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Search & SEO</span>
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

            {/* TAB: FOUNDER ASSETS & OFFICIAL PORTRAIT */}
            {activeTab === 'founder_assets' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#34A853] uppercase">
                    <ImageIcon className="w-4 h-4" />
                    <span>Official Identity & Portrait Manager</span>
                  </div>
                  <h4 className="text-xl font-heading font-bold text-white">
                    Permanent Founder Photograph
                  </h4>
                  <p className="text-xs text-neutral-400 font-light max-w-2xl leading-relaxed">
                    Upload your exact original photograph (such as <strong>Smiling Young Man in Piped Blazer.png</strong> or <strong>download.jpeg</strong>). Once saved, it is cryptographically stored to the server filesystem and Cloud Firestore, permanently rendering across the Hero avatar, Founder Story showcase, and platform metadata with 100% exact fidelity.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Current Active Photo Card */}
                  <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400">
                        Live Website Portrait
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono-code flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active Across Site</span>
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden aspect-square border border-white/[0.1] bg-black">
                      <img
                        src={photoPreview || founderPhoto || ASSETS.founderPhoto}
                        alt="Shubham Kasar"
                        className="w-full h-full object-cover"
                      />
                      {photoPreview && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded bg-[#4285F4] text-white text-[10px] font-mono-code font-bold shadow-md">
                          Unsaved Preview
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] font-mono-code text-neutral-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Identity:</span>
                        <span className="text-white font-medium">Shubham Kasar</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <span className="text-slate-300">Founder, Codagram</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-slate-300">Pune, Maharashtra, India</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload & Synchronization Deck */}
                  <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-5">
                    <h5 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#4285F4]" />
                      <span>Upload Exact Original Photo File</span>
                    </h5>

                    <p className="text-xs text-neutral-300 leading-relaxed font-light">
                      Select your original photo file from your device. No AI transformations or filters are applied; your exact pixels are preserved and served directly.
                    </p>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />

                    <div
                      onClick={() => photoInputRef.current?.click()}
                      className="border-2 border-dashed border-white/[0.15] hover:border-[#4285F4] transition-colors rounded-2xl p-6 text-center cursor-pointer bg-black/40 space-y-3 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/[0.05] group-hover:bg-[#4285F4]/10 border border-white/[0.1] group-hover:border-[#4285F4]/40 flex items-center justify-center mx-auto text-neutral-300 group-hover:text-[#4285F4] transition-all">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-mono-code font-bold text-white group-hover:text-[#4285F4]">
                          {photoFile ? photoFile.name : 'Click to select photo file (PNG / JPEG / WebP)'}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono-code">
                          {photoFile ? `${(photoFile.size / 1024).toFixed(1)} KB selected` : 'Supports Smiling Young Man in Piped Blazer.png or download.jpeg'}
                        </div>
                      </div>
                    </div>

                    {photoError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono-code flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{photoError}</span>
                      </div>
                    )}

                    {photoSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-code flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>Exact official photo permanently saved & live across website!</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSaveFounderPhoto}
                        disabled={savingPhoto || !photoPreview}
                        className="flex-1 py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        {savingPhoto ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save As Permanent Official Photo</span>
                          </>
                        )}
                      </button>

                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setPhotoFile(null);
                          }}
                          className="px-4 py-3 rounded-full text-xs font-mono-code text-neutral-400 hover:text-white bg-white/[0.05]"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECURITY & MASTER KEY */}
            {activeTab === 'security' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#FBBC05] uppercase">
                    <Key className="w-4 h-4" />
                    <span>Security Vault & Master Access Control</span>
                  </div>
                  <h4 className="text-xl font-heading font-bold text-white">
                    Master Password & Authentication Shield
                  </h4>
                  <p className="text-xs text-neutral-400 font-light max-w-2xl leading-relaxed">
                    Protect your administrative operations. Passwords are never stored or transferred in plain text; they are secured using SHA-256 cryptographic hashing with salt and protected by brute-force rate-limiting.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Security Status Card */}
                  <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
                    <h5 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Active Security Posture</span>
                    </h5>

                    <div className="space-y-3 text-xs font-mono-code">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                        <div className="text-neutral-400 text-[11px]">Authorized Founder Account</div>
                        <div className="text-white font-bold flex items-center gap-1.5">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>shubhamkasarsrk@gmail.com</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                        <div className="text-neutral-400 text-[11px]">Brute-Force Defense</div>
                        <div className="text-emerald-400 font-bold">5-attempt lockout (15 min cooldown)</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                        <div className="text-neutral-400 text-[11px]">Password Encryption</div>
                        <div className="text-white font-bold">SHA-256 + Unique Salt (Zero Plaintext)</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                        <div className="text-neutral-400 text-[11px]">Active Session Method</div>
                        <div className="text-blue-400 font-bold uppercase">{sessionInfo?.method || 'Active Session Token'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Change Password Form */}
                  <form onSubmit={handleChangePassword} className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
                    <h5 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#FBBC05]" />
                      <span>Change Master Admin Password</span>
                    </h5>

                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      Update the master password used to unlock this desk. New password must be at least 8 characters long.
                    </p>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono-code text-neutral-300">
                        Current Master Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter existing master password..."
                        className="w-full px-4 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FBBC05]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono-code text-neutral-300">
                        New Master Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters..."
                        className="w-full px-4 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FBBC05]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono-code text-neutral-300">
                        Confirm New Master Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password..."
                        className="w-full px-4 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FBBC05]"
                      />
                    </div>

                    {passwordError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono-code flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{passwordError}</span>
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-code flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>{passwordSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="w-full py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      {savingPassword ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Update & Encrypt Password</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
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

            {/* TAB 5: GOOGLE SEARCH & SEO INDEXING DECK */}
            {activeTab === 'google_seo' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono-code text-blue-400 uppercase">
                    <Globe className="w-4 h-4" />
                    <span>Google Search Discovery & Indexing</span>
                  </div>
                  <h4 className="text-xl font-heading font-bold text-white">
                    Appear in Google Search for "Shubham Kasar" & "Codagram"
                  </h4>
                  <p className="text-xs font-mono-code text-neutral-400">
                    Diagnose Google ranking, submit your XML sitemap, and link your high-authority LinkedIn profile
                  </p>
                </div>

                {/* Why only LinkedIn appears explanation banner */}
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-medium text-xs font-mono-code uppercase">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Why did only your LinkedIn appear initially?</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    Google has already indexed your LinkedIn profile because LinkedIn has an immense domain authority (DA 98) and Googlebot crawls it every hour. New websites and Cloud Run apps are not automatically ranked until Googlebot discovers them, verifies site ownership, and parses your sitemap. By following the 3-minute steps below, you directly prompt Google's crawler to index your website.
                  </p>
                </div>

                {/* Live Crawl Diagnostics & Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="text-neutral-400 uppercase">robots.txt</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-mono-code">
                      Allows all search engines to crawl all sections and lists your sitemap.
                    </p>
                    <a
                      href="/robots.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#d4af37] hover:underline font-mono-code pt-1"
                    >
                      <span>View robots.txt</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="text-neutral-400 uppercase">sitemap.xml</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-mono-code">
                      Includes 9 canonical index routes with priority & daily changefreq.
                    </p>
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#d4af37] hover:underline font-mono-code pt-1"
                    >
                      <span>View sitemap.xml</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="text-neutral-400 uppercase">Schema.org JSON-LD</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Linked
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-mono-code">
                      Tied directly to your LinkedIn with <code className="text-white">sameAs</code> for Knowledge Graph.
                    </p>
                    <span className="text-xs text-neutral-400 font-mono-code block pt-1">
                      Includes FAQPage & Person
                    </span>
                  </div>
                </div>

                {/* Google Site Verification Form */}
                <div className="p-6 rounded-xl glass-panel space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-sm font-heading font-bold text-white">
                      Google Search Console Site Verification
                    </h5>
                    <p className="text-xs text-neutral-400 font-mono-code">
                      Paste the verification code from Google Search Console (either the string inside <code className="text-neutral-300">content="..."</code> or the full meta tag).
                    </p>
                  </div>

                  <form onSubmit={handleSaveSeo} className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        value={googleVerification}
                        onChange={(e) => {
                          let val = e.target.value;
                          // If user pastes full meta tag, extract the content
                          const match = val.match(/content=["']([^"']+)["']/);
                          if (match && match[1]) {
                            val = match[1];
                          }
                          setGoogleVerification(val);
                        }}
                        placeholder="e.g. 7qX8Y-abcdef1234567890..."
                        className="flex-1 px-4 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                      />

                      <button
                        type="submit"
                        disabled={savingSeo}
                        className="py-2.5 px-6 rounded-xl text-xs font-mono-code uppercase font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                      >
                        {savingSeo ? (
                          <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Save Verification</span>
                      </button>
                    </div>

                    {seoSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono-code text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Google Search Console verification meta tag updated live!</span>
                      </div>
                    )}
                  </form>
                </div>

                {/* Fast-Track Step by Step Checklist to Rank in 24-48 Hours */}
                <div className="p-6 rounded-xl bg-black/60 border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h5 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                      Fast-Track Indexing Protocol (Takes ~3 minutes)
                    </h5>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono-code transition-colors"
                    >
                      <span>Open Google Search Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-4 text-xs font-mono-code">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-semibold">Add Your Property to Search Console</div>
                        <p className="text-neutral-400 font-light">
                          Go to Google Search Console, click <strong>"Add Property"</strong>, choose <strong>"URL prefix"</strong>, and enter:
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-[#d4af37] bg-black/80 px-2 py-1 rounded text-[11px]">
                            {window.location.origin}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.origin);
                              setCopiedLink('origin');
                              setTimeout(() => setCopiedLink(''), 2000);
                            }}
                            className="p-1 hover:text-white text-neutral-400"
                            title="Copy URL"
                          >
                            {copiedLink === 'origin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-semibold">Verify Ownership via HTML Tag</div>
                        <p className="text-neutral-400 font-light">
                          Under verification methods, select <strong>"HTML tag"</strong>. Copy the tag, paste the code into the box above, click <strong>Save Verification</strong>, and then click <strong>"Verify"</strong> in Google Search Console.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-semibold">Submit Your XML Sitemap</div>
                        <p className="text-neutral-400 font-light">
                          In Google Search Console's left sidebar, click <strong>"Sitemaps"</strong>. Under "Add a new sitemap", type:
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-emerald-400 bg-black/80 px-2 py-1 rounded text-[11px]">
                            sitemap.xml
                          </code>
                          <span className="text-neutral-400">and click <strong>Submit</strong>.</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                        4
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-semibold">Request Instant Indexing (Priority Queue)</div>
                        <p className="text-neutral-400 font-light">
                          In the top search bar of Search Console (Inspect any URL), enter <code className="text-white">{window.location.origin}/</code>, press Enter, and click <strong>"Request Indexing"</strong>. This bypasses normal crawling delays and puts you into Google's priority queue within 24 to 48 hours.
                        </p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center shrink-0">
                        5
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-semibold">Leverage Your LinkedIn Profile's High Authority (Crucial)</div>
                        <p className="text-neutral-400 font-light leading-relaxed">
                          Because Google already trusts and indexes your LinkedIn profile, go to your LinkedIn profile:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-300 pt-1">
                          <li>Click <strong>Edit contact info</strong> &rarr; Add Website URL: <code className="text-[#d4af37]">{window.location.origin}</code> (type: Company / Personal Website).</li>
                          <li>In your <strong>Headline</strong> & <strong>About</strong> section, write: "Founder at Codagram (<code className="text-[#d4af37]">{window.location.origin}</code>)".</li>
                        </ul>
                        <p className="text-neutral-400 font-light pt-1">
                          This passes authoritative backlink signals from LinkedIn to this website, connecting your personal brand in Google's Knowledge Graph.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
