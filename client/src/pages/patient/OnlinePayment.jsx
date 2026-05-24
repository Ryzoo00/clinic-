import React, { useState } from 'react';
import { CreditCard, DollarSign, Shield, CheckCircle, Wallet, Building2, Smartphone, ArrowLeft, Sparkles, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OnlinePayment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setSuccess(true);
    toast.success('Payment successful!');
    setTimeout(() => navigate('/patient'), 3000);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] animate-fadeIn">
        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-12 text-center max-w-md w-full">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-t-2xl"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25 animate-scaleIn">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const methods = [
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Rupay' },
    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
    { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
    { id: 'cash', label: 'Cash at Clinic', icon: Wallet, desc: 'Pay at the reception' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Online Payment</h1>
            <p className="text-emerald-200 mt-1">Secure payment gateway</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-3 px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= s ? 'bg-gradient-to-br from-medical-500 to-medical-600 text-white shadow-md' : 'bg-gray-100 dark:bg-dark-700 text-gray-400'
            }`}>
              {s}
            </div>
            <div className={`h-0.5 flex-1 transition-all duration-300 ${step > s ? 'bg-gradient-to-r from-medical-500 to-medical-400' : 'bg-gray-200 dark:bg-dark-700'}`} />
          </div>
        ))}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          step >= 3 ? 'bg-gradient-to-br from-medical-500 to-medical-600 text-white shadow-md' : 'bg-gray-100 dark:bg-dark-700 text-gray-400'
        }`}>
          3
        </div>
      </div>

      <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 md:p-8">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500 rounded-t-2xl"></div>

        {step === 1 && (
          <div className="space-y-4 mt-2 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Payment Method</h2>
            {methods.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  onClick={() => { setPaymentMethod(m.id); setStep(2); }}
                  className="group flex items-center gap-4 p-5 rounded-xl bg-gray-50/50 dark:bg-dark-700/20 border border-gray-100 dark:border-dark-700 cursor-pointer hover:border-medical-200 dark:hover:border-medical-800 hover:bg-medical-50/50 dark:hover:bg-medical-900/10 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-500 to-medical-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{m.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{m.desc}</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 -rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-5 mt-2 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <button type="button" onClick={() => setStep(1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-medical-50 to-medical-100/50 dark:from-medical-900/20 dark:to-medical-900/10 border border-medical-200 dark:border-medical-800 flex items-center gap-3">
              {paymentMethod === 'card' && <CreditCard className="w-6 h-6 text-medical-600" />}
              {paymentMethod === 'upi' && <Smartphone className="w-6 h-6 text-medical-600" />}
              {paymentMethod === 'netbanking' && <Building2 className="w-6 h-6 text-medical-600" />}
              {paymentMethod === 'cash' && <Wallet className="w-6 h-6 text-medical-600" />}
              <span className="text-sm font-medium text-medical-700 dark:text-medical-400 capitalize">{paymentMethod.replace('-', ' ')}</span>
            </div>

            {paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2"><CreditCard className="w-4 h-4 text-medical-500" /> Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expiry</label>
                    <input type="text" placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CVV</label>
                    <input type="text" placeholder="***" maxLength={4} value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '') })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2"><Smartphone className="w-4 h-4 text-medical-500" /> UPI ID</label>
                <input type="text" placeholder="username@upi" className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
              </div>
            )}

            {(paymentMethod === 'netbanking' || paymentMethod === 'cash') && (
              <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-center">
                <Building2 className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">You'll be redirected to complete this payment</p>
              </div>
            )}

            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl font-medium hover:from-medical-600 hover:to-medical-700 shadow-lg shadow-medical-500/25 transition-all duration-200">
              Continue to Review
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-5 mt-2 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <button type="button" onClick={() => setStep(2)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Payment</h2>
            </div>

            <div className="p-5 rounded-xl bg-gray-50 dark:bg-dark-700/30 border border-gray-100 dark:border-dark-700">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-dark-700">
                <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{paymentMethod.replace('-', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Amount</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">$150.00</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-400">Your payment is secured with 256-bit SSL encryption</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Pay $150.00</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlinePayment;
