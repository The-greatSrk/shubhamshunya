import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  ExternalLink, 
  Smartphone, 
  ShieldCheck, 
  RefreshCw, 
  CreditCard,
  QrCode
} from 'lucide-react';
import { getPaymentConfig, FirestorePaymentConfig } from '../lib/firebase';

export interface PaymentItem {
  itemType: 'book' | 'course_registration';
  itemName: string;
  amount: number;
  description: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PaymentItem | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, item }) => {
  const [step, setStep] = useState<'details' | 'pay' | 'success'>('details');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [utrNumber, setUtrNumber] = useState('');

  // Payment settings from Firestore/backend
  const [paymentConfig, setPaymentConfig] = useState<FirestorePaymentConfig>({
    upiId: 'shubhamkasar@upi',
    payeeName: 'Shubham Kasar',
    currency: 'INR',
    updatedAt: '',
  });

  const [orderId, setOrderId] = useState('');
  const [upiIntentUri, setUpiIntentUri] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch active UPI ID from Firestore/backend on mount
  useEffect(() => {
    if (isOpen) {
      getPaymentConfig().then((cfg) => {
        if (cfg?.upiId) {
          setPaymentConfig(cfg);
        }
      });
      // Generate temporary order token
      setOrderId(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
      setStep('details');
      setUtrNumber('');
    }
  }, [isOpen]);

  // Construct NPCI Standard UPI URI
  useEffect(() => {
    if (item && paymentConfig.upiId) {
      const pa = paymentConfig.upiId.trim();
      const pn = encodeURIComponent(paymentConfig.payeeName.trim());
      const am = item.amount.toFixed(2);
      const tn = encodeURIComponent(`Order ${orderId} - ${item.itemName}`);
      const uri = `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tn=${tn}&cu=INR`;
      setUpiIntentUri(uri);

      if (step === 'pay' && qrCanvasRef.current) {
        QRCode.toCanvas(qrCanvasRef.current, uri, {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#08080a',
            light: '#ffffff',
          },
        }).catch((err) => console.error('QR code render error:', err));
      }
    }
  }, [item, paymentConfig, orderId, step]);

  if (!isOpen || !item) return null;

  const handleProceedToPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim()) return;
    setSubmittingOrder(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: item.itemType,
          itemName: item.itemName,
          amount: item.amount,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          buyerPhone: buyerPhone.trim(),
          shippingAddress: shippingAddress.trim(),
        }),
      });
      const data = await res.json();
      if (data.order?.orderId) {
        setOrderId(data.order.orderId);
      }
      if (data.activeUpiId) {
        setPaymentConfig((prev) => ({
          ...prev,
          upiId: data.activeUpiId,
          payeeName: data.payeeName || prev.payeeName,
        }));
      }
      setStep('pay');
    } catch (err) {
      console.error('Order creation error:', err);
      setStep('pay');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleConfirmUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) return;
    setSubmittingOrder(true);

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'pending_verification',
          utrNumber: utrNumber.trim(),
        }),
      });
      setStep('success');
    } catch (err) {
      console.error(err);
      setStep('success');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(paymentConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0c0c10] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl text-neutral-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#08080a]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#d4af37]">
              Instant UPI Checkout • Zero Fees
            </span>
            <h3 className="text-base sm:text-lg font-heading font-bold text-white">
              {item.itemName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Item summary banner */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono-code uppercase text-neutral-400">
                {item.itemType === 'book' ? 'Book Publication' : 'Engineering Cohort Seat'}
              </span>
              <div className="text-xs text-neutral-300 font-light">{item.description}</div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono-code text-neutral-400">Total Due</span>
              <div className="text-xl sm:text-2xl font-heading font-black text-white">
                ₹{item.amount}
              </div>
            </div>
          </div>

          {/* STEP 1: Customer Details */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPay} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono-code text-neutral-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono-code text-neutral-400">Email Address (For receipt)</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full px-3.5 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono-code text-neutral-400">Phone (WhatsApp / SMS)</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full px-3.5 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {item.itemType === 'book' && (
                <div className="space-y-1">
                  <label className="text-xs font-mono-code text-neutral-400">
                    Physical Delivery Address & Pincode (If ordering printed copy)
                  </label>
                  <textarea
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Flat/House, Street, Area, City, State, PIN..."
                    className="w-full px-3.5 py-2.5 text-xs font-mono-code bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submittingOrder}
                className="w-full py-3.5 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                {submittingOrder ? (
                  <span>Generating Payment Matrix...</span>
                ) : (
                  <>
                    <span>Proceed to UPI Payment (₹{item.amount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Scannable UPI QR & Deep-Links */}
          {step === 'pay' && (
            <div className="space-y-6">
              {/* Recipient UPI ID Card with 1-click copy */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-code text-neutral-400">
                  <span>Pay directly to UPI VPA:</span>
                  <span className="text-[#d4af37]">Verified Payee: {paymentConfig.payeeName}</span>
                </div>
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-black/60 border border-white/[0.06]">
                  <span className="font-mono-code text-sm font-semibold text-white tracking-wider">
                    {paymentConfig.upiId}
                  </span>
                  <button
                    onClick={handleCopyUpiId}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.08] hover:bg-white/[0.15] text-xs font-mono-code text-neutral-200 transition-colors"
                  >
                    {copiedUpi ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic QR Code Canvas */}
              <div className="flex flex-col items-center justify-center space-y-3 p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  <canvas ref={qrCanvasRef} className="block" />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-xs font-mono-code text-neutral-300 font-medium">
                    Scan with Google Pay, PhonePe, Paytm, or BHIM
                  </p>
                  <p className="text-[11px] font-mono-code text-neutral-500">
                    Exact Amount: ₹{item.amount} • Order Token: {orderId}
                  </p>
                </div>
              </div>

              {/* 1-Tap Mobile Deep-Link Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-neutral-400">
                  Or launch your UPI app directly:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={upiIntentUri}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-center text-xs font-mono-code text-neutral-200 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Google Pay</span>
                  </a>
                  <a
                    href={upiIntentUri}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-center text-xs font-mono-code text-neutral-200 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>PhonePe</span>
                  </a>
                  <a
                    href={upiIntentUri}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-center text-xs font-mono-code text-neutral-200 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>Paytm</span>
                  </a>
                  <a
                    href={upiIntentUri}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-center text-xs font-mono-code text-neutral-200 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <Smartphone className="w-4 h-4 text-[#d4af37]" />
                    <span>Any UPI App</span>
                  </a>
                </div>
              </div>

              {/* UTR Entry Form */}
              <form onSubmit={handleConfirmUtr} className="p-4 rounded-xl bg-black/60 border border-[#d4af37]/30 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono-code text-[#d4af37] flex items-center justify-between">
                    <span>Enter 12-Digit UPI UTR / Transaction Ref:</span>
                    <span className="text-[10px] text-neutral-400">Found in payment receipt</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 429182749102"
                    className="w-full px-3.5 py-2.5 text-xs font-mono-code bg-black border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingOrder || !utrNumber.trim()}
                  className="w-full py-3 rounded-full text-xs font-mono-code uppercase tracking-wider font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingOrder ? (
                    <span>Verifying Transaction...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Confirm Payment & Generate Receipt</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Order Success & Digital Receipt */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-heading font-bold text-white">
                  Payment Recorded Successfully
                </h4>
                <p className="text-xs font-mono-code text-[#d4af37]">
                  Order Reference: {orderId}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/[0.08] text-left space-y-2 text-xs font-mono-code text-neutral-300 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-neutral-500">Item:</span>
                  <span className="text-white font-medium">{item.itemName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-neutral-500">Amount Paid:</span>
                  <span className="text-white font-bold">₹{item.amount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-neutral-500">Buyer:</span>
                  <span className="text-white">{buyerName} ({buyerEmail})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-neutral-500">UPI Ref (UTR):</span>
                  <span className="text-emerald-400 font-mono">{utrNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Status:</span>
                  <span className="text-[#d4af37]">Pending Admin Verification</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                A confirmation has been logged to Cloud Firestore. Shubham and the Codagram team will verify the payment and fulfill your order / cohort access credentials via email.
              </p>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono-code hover:bg-neutral-200 transition-colors"
              >
                Close Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
