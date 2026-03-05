
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, ShieldCheck, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import Logo from '../components/Logo';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('orderId');
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      const foundOrder = mockDb.getOrders().find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        navigate('/merchant-dashboard');
      }
    } else {
      navigate('/merchant-dashboard');
    }
  }, [orderId, navigate]);

  const handlePaystackPayment = () => {
    setIsLoading(true);
    setStatus('processing');

    // Simulate Paystack Popup & Processing
    setTimeout(() => {
      mockDb.updatePaymentStatus(orderId!, 'completed');
      setStatus('success');
      setIsLoading(false);
      
      // Redirect back after 2 seconds
      setTimeout(() => {
        navigate('/merchant-dashboard');
      }, 2000);
    }, 3000);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-eln/5 p-8 sm:p-12 border border-gray-100"
        >
          {status === 'idle' && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Secure Payment</h2>
                <p className="text-sm text-gray-500 font-medium">Complete your dispatch request payment</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Order ID</span>
                  <span className="text-xs font-bold text-gray-900">#{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Delivery Fee</span>
                  <span className="text-lg font-black text-eln">₦{(order.deliveryFee || 1500).toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex items-center space-x-3 text-gray-400">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <p className="text-[10px] font-bold leading-tight">Secured by Paystack. Your data is encrypted and safe.</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handlePaystackPayment}
                  className="w-full py-5 bg-[#09A5DB] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#09A5DB]/20 flex items-center justify-center space-x-3 active:scale-95 transition-all"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pay with Paystack</span>
                </button>
                
                <button 
                  onClick={() => navigate('/merchant-dashboard')}
                  className="w-full py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Cancel and Return</span>
                </button>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="py-12 text-center space-y-6">
              <div className="relative h-24 w-24 mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="absolute inset-0 border-4 border-eln/10 border-t-eln rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-eln animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900">Processing Payment</h3>
                <p className="text-sm text-gray-500 font-medium">Please do not refresh the page...</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-12 text-center space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-24 w-24 bg-green-50 rounded-full mx-auto flex items-center justify-center"
              >
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900">Payment Successful!</h3>
                <p className="text-sm text-gray-500 font-medium">Your dispatch request has been activated.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-12 text-center space-y-6">
              <div className="h-24 w-24 bg-red-50 rounded-full mx-auto flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900">Payment Failed</h3>
                <p className="text-sm text-gray-500 font-medium">Something went wrong. Please try again.</p>
              </div>
              <button 
                onClick={() => setStatus('idle')}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
            ELN LOGISTICS • SECURE CHECKOUT
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
