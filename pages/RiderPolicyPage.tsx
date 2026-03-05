
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ShieldCheck, CheckCircle2, AlertCircle, Info, Bike, Heart, Shield, Zap, Settings, Clock, Globe, FileText } from 'lucide-react';
import { motion } from 'motion/react';

const RiderPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const policyContent = `
ELN Express Limited Rider Onboarding & Conduct Policy

1. Purpose
This policy defines the requirements, responsibilities, and conduct expected of all riders working with ELN.
It ensures safety, accountability, operational efficiency, and brand integrity.

2. Rider Eligibility Requirements
To be onboarded, rider must provide:
• Valid government-issued ID
• Valid rider’s license
• Bike documents
• Passport photograph
• Guarantor information (with Valid identification)
• Smartphone with internet access
• Knowledge of assigned delivery zones
• Proof of residence
Failure to provide complete documentation disqualifies onboarding.

3. Rider Engagement Status
Riders may be engaged as:
• Independent dispatch riders
• Contract riders
ELN reserves the right to assign, suspend, or terminate engagement at its discretion.

4. Code of Conduct
All riders must:
1. Be punctual and professional.
2. Dress appropriately while on duty.
3. Communicate respectfully with merchants, customers, and ELN staff.
4. Follow delivery instructions strictly.
5. Protect customer goods at all times.
Abusive behaviour, negligence, or dishonesty will result in disciplinary action.

5. Delivery & Communication Protocol
Riders must:
• Confirm pickup before leaving the merchant location.
• Contact customers before arrival.
• Confirm delivery completion immediately.
• Report delays, incidents, or failed deliveries promptly to operations.
No rider should independently cancel or return an order without authorization.

6. Payment & Payout
• Rider payouts are based on completed deliveries.
• ELN commission is deducted as agreed.
• Payout schedules will be communicated clearly.
No payment is made for failed or cancelled deliveries unless approved.

7. Performance Monitoring
Rider performance will be tracked based on:
• Delivery success rate
• Timeliness
• Cash accuracy
• Customer feedback
• Compliance with instructions
Consistently poor performance may lead to reduced job allocation or removal.

8. Suspension & Termination
ELN reserves the right to suspend or terminate riders for:
• Theft or fraud
• Cash discrepancies
• Repeated failed deliveries
• Insubordination
• Damage to goods
• Safety violations

9. Agreement & Acceptance
By accepting deliveries from ELN, the rider agrees to comply with this policy and acknowledges that violations may result in suspension, termination, or recovery of losses.
    `;
    const blob = new Blob([policyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ELN_Rider_Policy.txt';
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
                RIDER <br /> <span className="text-white/40">CONDUCT</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-lg font-medium max-w-2xl mx-auto"
              >
                The ELN Express standard for safety, accountability, and operational excellence.
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
                  This policy defines the requirements, responsibilities, and conduct expected of all riders working with ELN. It ensures safety, accountability, operational efficiency, and brand integrity.
                </p>
              </section>

              <section className="space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-eln/10">02</span>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Eligibility</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Valid government ID', 
                    'Valid rider’s license', 
                    'Bike documents', 
                    'Passport photograph',
                    'Guarantor info',
                    'Smartphone + Data',
                    'Zone knowledge',
                    'Proof of residence'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-eln/10 transition-colors">
                      <div className="h-2 w-2 bg-eln rounded-full" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-4">
                  * Failure to provide complete documentation disqualifies onboarding.
                </p>
              </section>
            </div>

            {/* 03. Engagement & 04. Code of Conduct */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-eln/10">03</span>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Engagement</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Independent Dispatch', desc: 'Flexible gig-based engagement', icon: Globe },
                    { title: 'Contract Riders', desc: 'Structured full-time partnership', icon: Zap },
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
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Code of Conduct</h2>
                </div>
                <div className="space-y-4">
                  {[
                    'Be punctual and professional at all times',
                    'Dress appropriately while on duty',
                    'Communicate respectfully with all stakeholders',
                    'Follow delivery instructions strictly',
                    'Protect customer goods at all times'
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

            {/* Protocol & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <section className="p-10 bg-gray-50 rounded-[3rem] space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-eln/10">05</span>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Delivery Protocol</h2>
                </div>
                <ul className="space-y-4">
                  {[
                    'Confirm pickup at merchant location',
                    'Contact customers before arrival',
                    'Confirm delivery completion immediately',
                    'Promptly report delays or incidents'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm font-bold text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-eln" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="p-10 bg-eln rounded-[3rem] space-y-6 text-white">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-white/20">06</span>
                  <h2 className="text-xl font-black text-white tracking-tight">Payment & Payout</h2>
                </div>
                <ul className="space-y-4">
                  {[
                    'Payouts based on completed deliveries',
                    'Agreed commission automatically deducted',
                    'Clear payout schedules communicated',
                    'No payment for unauthorized cancellations'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm font-bold text-white/80">
                      <Zap className="h-4 w-4 text-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Performance Monitoring */}
            <section className="bg-gray-900 p-12 sm:p-16 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Settings className="h-40 w-40 text-white" />
              </div>
              <div className="relative z-10 space-y-12">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-white/20">07</span>
                  <h2 className="text-2xl font-black text-white tracking-tight">Performance Monitoring</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[
                    { label: 'Success Rate', icon: CheckCircle2 },
                    { label: 'Timeliness', icon: Clock },
                    { label: 'Cash Accuracy', icon: Zap },
                    { label: 'Feedback', icon: Heart },
                    { label: 'Compliance', icon: Shield },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 text-center space-y-3">
                      <item.icon className="h-6 w-6 text-eln" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Termination & Agreement */}
            <div className="space-y-12">
              <section className="p-10 bg-red-50 rounded-[2.5rem] border border-red-100 space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-red-100">08</span>
                  <h2 className="text-xl font-black text-red-600 uppercase tracking-widest">Suspension</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Theft or fraudulent activity',
                    'Unresolved cash discrepancies',
                    'Repeated failed delivery attempts',
                    'Insubordination or abusive behavior',
                    'Negligent damage to customer goods',
                    'Violation of safety protocols'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 text-xs font-bold text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Agreement & Acceptance</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  By accepting deliveries from ELN, the rider agrees to comply with this policy and acknowledges that violations may result in suspension, termination, or recovery of losses.
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

export default RiderPolicyPage;
