
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ShieldCheck, CheckCircle2, AlertCircle, Info, FileText, Users, Globe, Zap, Clock, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const MerchantPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const policyContent = `
ELN Logistics Merchant Onboarding Policy

1. Purpose
This Merchant policy defines the requirements, responsibilities, and service standards for merchants partnering with ELN.
Our goal is to maintain reliable operations and high customer satisfaction.

2. Eligibility Requirements
To onboard with ELN, a merchant must provide:
• Registered business name
• Primary contact person
• Phone number & email
• Pickup address(es)
• Valid identification
• Nature of goods handled
ELN reserves the right to approve or decline applications based on operational fit.

3. Service Scope
ELN provides:
• Order pickup from agreed locations
• Last-mile delivery
• Delivery confirmation
• Exception reporting (failed, returned, cancelled)

4. Merchant Responsibilities
Merchants must:
• Package items securely.
• Provide accurate customer details.
• Ensure orders are ready at pickup time.
• Maintain respectful communication with riders and operations staff.

5. Order Submission Standard
Each order must include:
• Customer name
• Phone number
• Full address with landmarks
• Delivery fee
Incomplete information may delay dispatch.

6. Pricing & Commission
Delivery fees follow agreed rate cards.
ELN commission applies per successful delivery.

7. Failed Deliveries
A delivery may fail due to:
• customer unreachable
• incorrect address
• customer rejection
• safety concerns
Reattempts or returns may attract additional charges.

8. Communication Protocol
Official communication channels:
• Operations WhatsApp
• Dispatch line
• Assigned account contact
All escalations must go through operations.

9. Service Level Expectations
ELN commits to:
✔ professional rider conduct
✔ timely updates
✔ accurate tracking
✔ transparent reporting
Merchants are expected to reciprocate with preparedness and clarity.

10. Suspension or Termination
ELN may suspend service for:
• repeated misinformation
• delayed payments
• abusive behavior
• fraudulent activity

11. Merchant Agreement & Acceptance
By signing below, the Merchant acknowledges and agrees that:
• All information provided during onboarding is accurate and complete.
• The Merchant has read, understood, and agrees to comply with the ELN Merchant Onboarding Policy.
• ELN Logistics Limited is authorized to handle deliveries.
• Disputes regarding delivery status or service issues must be reported within 24 hours of occurrence.
• ELN may suspend or terminate service in cases of policy breach, misinformation, abusive conduct, delayed payments, or fraudulent activity.
• ELN shall not be liable for damages resulting from inadequate packaging, incorrect customer information, or prohibited items.
• Service rates, and operational terms may be updated with prior notice.
    `;
    const blob = new Blob([policyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ELN_Merchant_Policy.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-eln/10 selection:text-eln">
      {/* Hero Section */}
      <header className="relative bg-eln overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.button 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(-1)}
              className="group flex items-center space-x-2 text-white/60 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em]"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Return to Signup</span>
            </motion.button>
            
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none"
              >
                MERCHANT <br /> <span className="text-white/40">ONBOARDING</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-lg font-medium max-w-2xl mx-auto"
              >
                Defining the standards of excellence for our logistics partnership network.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <button 
                onClick={handleDownload}
                className="px-8 py-4 bg-white text-eln rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
              >
                <Download className="h-4 w-4" />
                <span>Download Official Policy</span>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden"
        >
          <div className="p-8 sm:p-20 space-y-24">
            
            {/* 01. Purpose & 02. Eligibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <section className="space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-eln/10">01</span>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Purpose</h2>
                </div>
                <p className="text-gray-500 leading-relaxed font-medium text-lg">
                  This policy defines the requirements, responsibilities, and service standards for merchants partnering with ELN. Our goal is to maintain reliable operations and high customer satisfaction.
                </p>
              </section>

              <section className="space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-eln/10">02</span>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Eligibility</h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {['Registered business name', 'Primary contact person', 'Phone number & email', 'Pickup address(es)', 'Valid identification', 'Nature of goods handled'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-eln/10 transition-colors">
                      <div className="h-2 w-2 bg-eln rounded-full" />
                      <span className="text-sm font-bold text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 03. Service Scope & 04. Responsibilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-eln/10">03</span>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Service Scope</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Order Pickup', desc: 'From agreed locations', icon: Globe },
                    { title: 'Last-mile Delivery', desc: 'Reliable doorstep service', icon: Zap },
                    { title: 'Confirmation', desc: 'Instant delivery proof', icon: CheckCircle2 },
                    { title: 'Reporting', desc: 'Exception tracking', icon: FileText },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4 group">
                      <div className="p-3 bg-eln/5 rounded-xl text-eln group-hover:bg-eln group-hover:text-white transition-all">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-eln/10">04</span>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Responsibilities</h2>
                </div>
                <div className="space-y-4">
                  {[
                    'Package items securely for transit',
                    'Provide accurate customer details',
                    'Ensure orders are ready at pickup time',
                    'Maintain respectful communication'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4 p-5 border border-gray-100 rounded-3xl hover:shadow-lg hover:shadow-eln/5 transition-all">
                      <div className="h-8 w-8 bg-eln/10 rounded-full flex items-center justify-center text-eln font-black text-xs">
                        {i + 1}
                      </div>
                      <span className="text-sm font-bold text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Standards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { id: "05", title: "Order Standards", desc: "Customer name, phone, full address with landmarks, and delivery fee are mandatory.", icon: Clock },
                { id: "06", title: "Pricing Model", desc: "Fees follow agreed rate cards. Commission applies per successful delivery.", icon: Zap },
                { id: "07", title: "Failed Deliveries", desc: "Reattempts or returns may attract additional charges for logistics recovery.", icon: AlertCircle },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4 group hover:bg-eln transition-all">
                  <item.icon className="h-6 w-6 text-eln group-hover:text-white transition-colors" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 group-hover:text-white">{item.title}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed group-hover:text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Commitments */}
            <section className="bg-eln p-12 sm:p-16 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield className="h-40 w-40 text-white" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-white/20">09</span>
                  <h2 className="text-2xl font-black text-white tracking-tight">ELN Commitments</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['Professional rider conduct', 'Timely status updates', 'Accurate GPS tracking', 'Transparent reporting'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                      <span className="text-sm font-black text-white uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Termination & Agreement */}
            <div className="space-y-12">
              <section className="p-10 bg-red-50 rounded-[2.5rem] border border-red-100 space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-red-100">10</span>
                  <h2 className="text-xl font-black text-red-600 uppercase tracking-widest">Suspension</h2>
                </div>
                <p className="text-red-700 font-medium leading-relaxed">
                  ELN reserves the right to suspend service for repeated misinformation, delayed payments, abusive behavior, or fraudulent activity. Integrity is the foundation of our network.
                </p>
              </section>

              <section className="space-y-6 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Agreement & Acceptance</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  By signing up, the Merchant acknowledges that all information provided is accurate, they have read and understood this policy, and ELN Logistics Limited is authorized to handle deliveries.
                </p>
                <div className="pt-8">
                  <button 
                    onClick={() => navigate('/signup')}
                    className="px-12 py-5 bg-eln text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-eln/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    Accept & Continue
                  </button>
                </div>
              </section>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MerchantPolicyPage;
