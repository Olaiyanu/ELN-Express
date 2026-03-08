
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
  Plus, 
  Package, 
  History, 
  LogOut, 
  MapPin, 
  User as UserIcon, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Menu, 
  X, 
  Loader2, 
  DollarSign,
  AlertCircle,
  Check,
  Star,
  MessageSquare,
  Bike,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NotificationBell from '../components/NotificationBell';
import { User as UserType, Order, OrderStatus, Notification } from '../types';
import { mockDb } from '../services/mockDb';
import { useLanguage } from '../src/contexts/LanguageContext';

interface MerchantDashboardProps {
  user: UserType;
  onLogout: () => void;
}

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ user, onLogout }) => {
  const { t: translations } = useLanguage();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'request' | 'history' | 'estimate'>('request');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<UserType | null>(null);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    businessName: user.businessName || '',
    phone: user.phone || '',
    profilePicture: user.profilePicture || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Price Estimate State
  const [estimateData, setEstimateData] = useState({ pickup: 'Victoria Island', dropoff: '', weight: 'Standard' });
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  // New Order State
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    pickupAddress: 'Lagos Fashion Hub, Victoria Island',
    itemsDescription: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    refreshOrders();
    const interval = setInterval(refreshOrders, 5000);
    return () => clearInterval(interval);
  }, [user.uid]);

  const refreshOrders = () => {
    const allOrders = mockDb.getOrders();
    setOrders(allOrders.filter(o => o.merchantId === user.uid).sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleCalculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const base = 1500;
    const weightMulti = estimateData.weight === 'Heavy' ? 1.5 : 1;
    setCalculatedPrice(base * weightMulti);
  };

  const handleAddressChange = (val: string) => {
    setNewOrder({ ...newOrder, deliveryAddress: val });
    setIsVerified(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsVerifying(true);
    setShowSuggestions(true);
    typingTimeoutRef.current = setTimeout(() => {
      setSuggestions([
        `${val}, Victoria Island, Lagos`,
        `${val}, Ikoyi, Lagos`,
        `${val}, Lekki Phase 1, Lagos`
      ]);
      setIsVerifying(false);
    }, 500);
  };

  const selectSuggestion = (suggestion: string) => {
    setNewOrder({ ...newOrder, deliveryAddress: suggestion });
    setShowSuggestions(false);
    setIsVerified(true);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const order: Order = {
      id: Math.random().toString(36).substring(2, 11).toUpperCase(),
      merchantId: user.uid,
      merchantName: user.businessName || user.name,
      merchantPhone: user.phone || '0800-ELN-MERCHANT',
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      customerEmail: newOrder.customerEmail,
      deliveryAddress: newOrder.deliveryAddress,
      pickupAddress: newOrder.pickupAddress,
      itemsDescription: newOrder.itemsDescription,
      verificationCode: verificationCode,
      status: OrderStatus.PENDING,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      paymentMethod: 'Online',
      paymentConfirmed: false,
      deliveryFee: 1500
    };
    mockDb.saveOrder(order);
    
    // Simulate sending email to customer
    console.log(`[MOCK EMAIL] To: ${newOrder.customerEmail} | Message: Your delivery code is ${verificationCode}. Please provide this to the rider upon delivery.`);
    
    refreshOrders();
    setShowCreateModal(false);
    resetForm();
    navigate(`/payment?orderId=${order.id}`);
  };

  const resetForm = () => {
    setNewOrder({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      deliveryAddress: '',
      pickupAddress: 'Lagos Fashion Hub, Victoria Island',
      itemsDescription: ''
    });
    setIsVerified(false);
    setSuggestions([]);
  };

  const handleViewRiderProfile = (riderId: string) => {
    const users = mockDb.getUsers();
    const rider = users.find(u => u.uid === riderId);
    if (rider) setSelectedRider(rider);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: profileForm.name,
        businessName: profileForm.businessName,
        phone: profileForm.phone,
        profilePicture: profileForm.profilePicture
      };
      mockDb.saveUser(updatedUser);
      setIsSavingProfile(false);
      setShowProfileModal(false);
      // In a real app, we'd update the global user state. 
      // For this demo, we'll suggest a refresh or the parent will handle it if we pass a callback.
      // Since 'user' is a prop, we should ideally have an 'onUpdateUser' prop.
      window.location.reload(); // Simplest way to reflect changes in this mock setup
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8 px-4">
      <div className="flex items-center space-x-3 px-4 mb-12">
        <Logo className="h-7" showText={true} variant="white" />
      </div>

      <nav className="flex-1 space-y-2">
        <button 
          onClick={() => { setActiveTab('request'); setIsMobileMenuOpen(false); }}
          className={`flex items-center space-x-3 w-full px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'request' ? 'bg-eln-primary text-white shadow-lg shadow-eln-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <Plus className={`h-5 w-5 ${activeTab === 'request' ? 'text-white' : 'text-slate-500'}`} />
          <span className="font-black text-xs uppercase tracking-widest">New Request</span>
        </button>

        <button 
          onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }}
          className={`flex items-center space-x-3 w-full px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'history' ? 'bg-eln-primary text-white shadow-lg shadow-eln-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <History className={`h-5 w-5 ${activeTab === 'history' ? 'text-white' : 'text-slate-500'}`} />
          <span className="font-black text-xs uppercase tracking-widest">Tracking & History</span>
        </button>

        <button 
          onClick={() => { setActiveTab('estimate'); setIsMobileMenuOpen(false); }}
          className={`flex items-center space-x-3 w-full px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'estimate' ? 'bg-eln-primary text-white shadow-lg shadow-eln-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <DollarSign className={`h-5 w-5 ${activeTab === 'estimate' ? 'text-white' : 'text-slate-500'}`} />
          <span className="font-black text-xs uppercase tracking-widest">Price Estimate</span>
        </button>
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5">
        <button onClick={onLogout} className="flex items-center space-x-3 w-full px-5 py-4 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut className="h-5 w-5" />
          <span className="font-black text-xs uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-eln-bg overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-eln-orange-deep/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-950 z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-slate-950 flex flex-col hidden lg:flex h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        <header className="bg-eln-bg px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-30 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400 lg:hidden hover:bg-gray-50 rounded-xl transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">
              Merchant Hub <span className="text-gray-200 mx-2">/</span> <span className="text-slate-900">{activeTab}</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <NotificationBell userId={user.uid} />
             <button 
               onClick={() => setShowProfileModal(true)}
               className="h-10 w-10 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 hover:ring-2 hover:ring-eln-primary transition-all"
             >
                <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF7A00&color=fff`} alt="" className="h-full w-full object-cover" />
             </button>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full">
          {activeTab === 'request' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Delivery Request</h2>
                  <p className="text-sm text-gray-500 font-medium">Create a new high-priority fashion delivery mission.</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-8 py-4 bg-eln-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-eln-primary/20 hover:scale-105 transition-all"
                >
                  Start New Request
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div className="bg-eln-primary/5 w-12 h-12 rounded-2xl flex items-center justify-center text-eln-primary">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900">Professional Dispatch</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Our elite fleet of riders is ready to handle your luxury fashion items with the utmost care and speed.</p>
                  </div>
                  <ul className="space-y-3">
                    {['Real-time tracking', 'Professional riders', 'Secure handling', 'Instant confirmation'].map((item, i) => (
                      <li key={i} className="flex items-center space-x-3 text-xs font-bold text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-eln-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-eln-deep p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl shadow-eln-orange-deep/20">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-xl font-black">Quick Estimate</h3>
                    <p className="text-white/60 text-sm">Need to know the cost before you book? Use our professional estimator.</p>
                    <button 
                      onClick={() => setActiveTab('estimate')}
                      className="w-full py-4 bg-white text-eln-orange-deep rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      Check Prices
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'history' ? (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tracking & History</h2>
                  <p className="text-sm text-gray-500 font-medium">Monitor your active deliveries and review past missions.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Missions:</span>
                  <span className="text-xs font-black text-slate-900">{orders.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {orders.length > 0 ? (
                  orders.map(order => (
                    <div key={order.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group transition-all hover:border-eln-primary/20 hover:shadow-xl hover:shadow-black/5">
                      <div className="flex items-center space-x-6 flex-1 min-w-0">
                        <div className={`h-16 w-16 rounded-3xl flex-shrink-0 flex items-center justify-center ${order.status === OrderStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-eln-primary/5 group-hover:text-eln-primary transition-colors'}`}>
                          <Package className="h-8 w-8" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">#{order.id.slice(0, 8)}</span>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-600' : 
                              order.status === OrderStatus.PENDING ? 'bg-amber-100 text-amber-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 truncate mb-3">{order.customerName}</h3>
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                            <div className="flex items-center text-xs text-gray-500 font-medium">
                              <MapPin className="h-4 w-4 mr-2 text-slate-300" />
                              <span className="truncate max-w-[200px]">{order.deliveryAddress}</span>
                            </div>
                            {order.riderName && (
                              <button 
                                onClick={() => order.riderId && handleViewRiderProfile(order.riderId)} 
                                className="flex items-center text-xs font-black text-slate-400 hover:text-eln-primary transition-colors"
                              >
                                <Bike className="h-4 w-4 mr-2" />
                                <span>{order.riderName}</span>
                              </button>
                            )}
                            <div className="flex items-center text-xs text-gray-400 font-medium">
                              <Clock className="h-4 w-4 mr-2 text-slate-300" />
                              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between lg:justify-end lg:space-x-10 border-t lg:border-t-0 pt-6 lg:pt-0 border-gray-50">
                        <div className="text-left lg:text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Fee</p>
                          <p className="text-2xl font-black text-slate-900">₦{order.deliveryFee?.toLocaleString()}</p>
                        </div>
                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-eln-primary hover:text-white transition-all shadow-sm">
                          <History className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-24 rounded-[4xl] border border-dashed border-gray-200 text-center space-y-6">
                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <Package className="h-12 w-12 text-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-900 text-2xl font-black">No missions yet</p>
                      <p className="text-gray-400 font-medium text-sm max-w-xs mx-auto">Your delivery history will appear here once you start dispatching luxury items.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('request')}
                      className="px-8 py-4 bg-eln-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-eln-primary/20 hover:scale-105 transition-all"
                    >
                      Start First Mission
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Price Estimate</h2>
                <p className="text-sm text-gray-500 font-medium">Get an instant quote for your fashion delivery.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                  <form onSubmit={handleCalculateEstimate} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pickup Area</label>
                      <input 
                        type="text" 
                        value={estimateData.pickup}
                        readOnly
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-400 cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Dropoff Destination</label>
                      <input 
                        type="text" 
                        placeholder="Enter destination address..."
                        value={estimateData.dropoff}
                        onChange={e => setEstimateData({...estimateData, dropoff: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Package Weight</label>
                      <select 
                        value={estimateData.weight}
                        onChange={e => setEstimateData({...estimateData, weight: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900"
                      >
                        <option>Standard</option>
                        <option>Heavy</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-5 bg-eln-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-eln-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Calculate Quote
                    </button>
                  </form>
                </div>

                <div className="flex flex-col justify-center">
                  {calculatedPrice ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-eln-deep text-white p-12 rounded-[3rem] text-center space-y-6 shadow-2xl shadow-eln-orange-deep/30"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Estimated Delivery Fee</p>
                      <p className="text-6xl font-black">₦{calculatedPrice.toLocaleString()}</p>
                      <div className="h-px bg-white/10 w-full" />
                      <p className="text-xs text-white/60 leading-relaxed">This is a professional estimate based on current traffic and distance. Final price may vary slightly.</p>
                      <button 
                        onClick={() => { setActiveTab('request'); setShowCreateModal(true); }}
                        className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                      >
                        Book Now
                      </button>
                    </motion.div>
                  ) : (
                    <div className="text-center space-y-4 p-12">
                      <DollarSign className="h-16 w-16 text-gray-200 mx-auto" />
                      <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Enter details to see quote</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New Request Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-eln-orange-deep/60 backdrop-blur-lg z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl p-6 sm:p-12 space-y-8 overflow-y-auto max-h-[95vh]"
            >
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-slate-900">New Request</h3>
                      <button onClick={() => setShowCreateModal(false)} className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                      </button>
                    </div>
              <form onSubmit={handleCreateOrder} className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer Name</label>
                      <div className="relative">
                         <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                         <input required type="text" value={newOrder.customerName} onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} placeholder="e.g. Linda Evangelista" className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone</label>
                      <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                         <input required type="tel" value={newOrder.customerPhone} onChange={e => setNewOrder({...newOrder, customerPhone: e.target.value})} placeholder="+234 800 000 0000" className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900" />
                      </div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer Email</label>
                    <div className="relative">
                       <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <input required type="email" value={newOrder.customerEmail} onChange={e => setNewOrder({...newOrder, customerEmail: e.target.value})} placeholder="customer@example.com" className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900" />
                    </div>
                 </div>
                 
                 <div className="space-y-1 relative">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Delivery Address</label>
                      {isVerified && <span className="text-[9px] font-black uppercase text-green-600">Verified Address</span>}
                    </div>
                    <div className="relative">
                       <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${isVerified ? 'text-green-500' : 'text-gray-300'}`} />
                       <input required type="text" value={newOrder.deliveryAddress} onChange={e => handleAddressChange(e.target.value)} placeholder="Building or street..." className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900" />
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[70]">
                         {suggestions.map((s, i) => (
                           <button key={i} type="button" onClick={() => selectSuggestion(s)} className="w-full text-left px-5 py-4 hover:bg-gray-50 border-b last:border-b-0 border-gray-50 text-xs font-bold text-gray-700">{s}</button>
                         ))}
                      </div>
                    )}
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Package Description</label>
                    <textarea value={newOrder.itemsDescription} onChange={e => setNewOrder({...newOrder, itemsDescription: e.target.value})} placeholder="e.g. 2 Evening Gowns" className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary h-24 font-bold text-gray-900 resize-none"></textarea>
                 </div>
                 <button type="submit" className="w-full py-5 bg-eln-primary text-white font-black rounded-2xl shadow-2xl shadow-eln-primary/40 uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                   Request Dispatch
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rider Profile Modal */}
      <AnimatePresence>
        {selectedRider && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRider(null)} className="absolute inset-0 bg-eln-orange-deep/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden relative z-10 p-12 text-center">
              <div className="inline-block p-2 bg-white rounded-[2.5rem] shadow-xl mb-6">
                <div className="h-28 w-28 rounded-[2rem] overflow-hidden bg-gray-100">
                  <img src={selectedRider.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRider.name)}&background=FF7A00&color=fff`} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedRider.name}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-eln-primary mb-8">Elite Fleet Rider</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Vehicle No.</p>
                  <p className="text-sm font-black text-gray-900">{selectedRider.plateNumber || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Rating</p>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-black text-gray-900">4.9</span>
                  </div>
                </div>
              </div>
              <a href={`tel:${selectedRider.phone}`} className="w-full py-4 bg-eln-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-eln-primary/20 flex items-center justify-center space-x-3 hover:scale-[1.02] transition-all">
                <Phone className="h-4 w-4" />
                <span>Call Rider</span>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 bg-eln-orange-deep/60 backdrop-blur-lg z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 sm:p-12 space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Edit Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-[2rem] overflow-hidden bg-gray-100 border-2 border-gray-100">
                      <img 
                        src={profileForm.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF7A00&color=fff`} 
                        alt="" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-[2rem] cursor-pointer transition-opacity">
                      <Camera className="h-6 w-6" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Click to change photo</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={profileForm.name} 
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Business Name</label>
                    <input 
                      required 
                      type="text" 
                      value={profileForm.businessName} 
                      onChange={e => setProfileForm({...profileForm, businessName: e.target.value})} 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Phone Number</label>
                    <input 
                      required 
                      type="tel" 
                      value={profileForm.phone} 
                      onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-gray-900" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSavingProfile}
                  className="w-full py-5 bg-eln-primary text-white font-black rounded-2xl shadow-2xl shadow-eln-primary/40 uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSavingProfile ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Support */}
      <motion.a 
        href="https://wa.me/2348000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[100] h-16 w-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:bg-green-600 transition-all group"
      >
        <MessageSquare className="h-8 w-8" />
        <span className="absolute right-full mr-4 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          WhatsApp Support
        </span>
      </motion.a>
    </div>
  );
};

export default MerchantDashboard;
