import React, { useState } from 'react';
import {
  QrCode,
  CreditCard,
  Building,
  Banknote,
  ShieldCheck,
  Lock,
  X,
  CheckCircle,
  Loader2,
  Copy,
  Check
} from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, amount, onSuccess }) {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardName, setCardName] = useState('Rajesh Sharma');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [processing, setProcessing] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('royalmarbles@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProcessPayment = () => {
    setProcessing(true);

    let methodLabel = 'UPI / QR Code';
    if (paymentMethod === 'card') methodLabel = 'Credit/Debit Card (Visa/Mastercard)';
    if (paymentMethod === 'netbanking') methodLabel = `Net Banking (${selectedBank})`;
    if (paymentMethod === 'cod') methodLabel = 'Cash / NEFT on Safe Crate Inspection';

    setTimeout(() => {
      setProcessing(false);
      onSuccess({
        payment_method: methodLabel,
        transaction_id: `TXN_${Date.now().toString(36).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-bold text-base tracking-wide">
              Krushna Devghar Secure Payment Gateway
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-1 rounded-lg text-stone-400 hover:text-white transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount to pay */}
        <div className="bg-amber-50/70 px-6 py-4 border-b border-amber-200/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-900 font-medium">Total Payable (Incl. 12% GST & Insurance):</p>
            <p className="text-2xl font-black font-mono text-stone-900">
              ₹{Number(amount).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Tabs for Payment Mode */}
        <div className="grid grid-cols-4 border-b border-stone-200 bg-stone-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition ${
              paymentMethod === 'upi'
                ? 'border-amber-600 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition ${
              paymentMethod === 'card'
                ? 'border-amber-600 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('netbanking')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition ${
              paymentMethod === 'netbanking'
                ? 'border-amber-600 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Net Banking</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('cod')}
            className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition ${
              paymentMethod === 'cod'
                ? 'border-amber-600 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>COD / Token</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {paymentMethod === 'upi' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-stone-600">
                Scan this QR code with any UPI App (GPay, PhonePe, Paytm, BHIM)
              </p>

              {/* Dynamic QR Code Box */}
              <div className="inline-block p-4 bg-white border-2 border-dashed border-amber-400 rounded-2xl shadow-inner">
                <div className="w-44 h-44 mx-auto bg-stone-900 rounded-xl p-3 flex flex-col items-center justify-between text-white relative">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <QrCode className="w-28 h-28 text-white" />
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-bold">
                    KRUSHNA DEVGHAR UPI
                  </span>
                </div>
              </div>

              {/* Copy UPI ID */}
              <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
                <div className="text-xs bg-stone-100 px-3 py-2 rounded-lg font-mono border border-stone-200 text-stone-700 flex-1 truncate">
                  krushnadevghar@icici
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Enter User UPI ID */}
              <div className="text-left mt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Or enter your UPI ID:
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-3 text-xs text-left">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="Full Name on Card"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength="4"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="•••"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="space-y-3 text-left">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Your Bank
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 text-left rounded-lg border font-medium transition ${
                      selectedBank === bank
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2 text-left">
              <h4 className="font-bold text-stone-900 text-sm">
                Pay Upon Delivery & Uncrating Inspection
              </h4>
              <p className="leading-relaxed">
                For high-value marble and granite consignments, our logistics team delivers in a specialized shock-absorbing wooden crate.
              </p>
              <p className="text-amber-800 font-medium">
                • You can verify the product with the delivery executive before completing remaining payment via UPI, NEFT, or Cash.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={processing}
              className="w-full py-3.5 px-4 gold-btn font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Contacting Bank & Authorizing ₹{Number(amount).toLocaleString('en-IN')}...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay ₹{Number(amount).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-stone-500 text-center mt-2">
              🔒 Safe & Guaranteed by Krushna Devghar Makrana Payment Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
