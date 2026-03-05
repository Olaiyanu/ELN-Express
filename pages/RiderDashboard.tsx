
import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  LogOut, 
  MapPin, 
  CheckCircle2, 
  Package, 
  Navigation, 
  RefreshCw, 
  X, 
  Menu, 
  Check,
  Ban,
  Power,
  ToggleLeft,
  ToggleRight,
  Wallet,
  Bell,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '../components/Logo';
import RiderMap from '../components/RiderMap';
import { User as UserType, Order, OrderStatus, VerificationStatus, Notification } from '../types';
import { mockDb } from '../services/mockDb';
import { useLanguage } from '../src/contexts/LanguageContext';

interface RiderDashboardProps {
  user: UserType;
  onLogout: () => void;
}

const RiderDashboard: React.FC<RiderDashboardProps> = ({ user, onLogout }) => {
  const { t: translations } = useLanguage();
  const t = translations.rider;
  const common = translations.common;

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [newRequests, setNewRequests] = useState<Order[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'map' | 'earnings'>('jobs');
  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [allPendingOrders, setAllPendingOrders] = useState<Order[]>([]);
  const [localUser, setLocalUser] = useState<UserType>(user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = () => {
    const data = mockDb.getNotifications(user.uid);
    setNotifications(data);
  };

  const fetchOrders = () => {
    const all = mockDb.getOrders();
    const riderJobs = all.filter(o => o.riderId === user.uid).sort((a, b) => b.updatedAt - a.updatedAt);
    setOrders(riderJobs);
    
    const pending = all.filter(o => o.status === OrderStatus.PENDING);
    setAllPendingOrders(pending);
    
    const active = riderJobs.find(o => o.status === OrderStatus.IN_TRANSIT);
    const assigned = riderJobs.filter(o => o.status === OrderStatus.ASSIGNED);
    
    setActiveOrder(active || null);
    setNewRequests(assigned);
  };

  useEffect(() => {
    const refreshUser = () => {
      const users = mockDb.getUsers();
      const current = users.find(u => u.uid === user.uid);
      if (current) {
        setLocalUser(current);
        localStorage.setItem('eln_current_user', JSON.stringify(current));
      }
    };
    
    refreshUser();
    fetchOrders();
    refreshNotifications();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setRiderLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Location error:", err)
      );
    }
    
    const interval = setInterval(() => {
      refreshUser();
      fetchOrders();
      refreshNotifications();
    }, 3000);
    return () => clearInterval(interval);
  }, [user.uid]);

  const handleToggleAvailability = () => {
    const newStatus = !localUser.isAvailable;
    const updatedUser = { ...localUser, isAvailable: newStatus };
    setLocalUser(updatedUser);
    mockDb.saveUser(updatedUser);
    localStorage.setItem('eln_current_user', JSON.stringify(updatedUser));
  };

  const handleAccept = (orderId: string) => {
    mockDb.updateOrderStatus(orderId, OrderStatus.IN_TRANSIT, user.uid, user.name);
    fetchOrders();
  };

  const handleDecline = (orderId: string) => {
    mockDb.updateOrderStatus(orderId, OrderStatus.PENDING, '', '');
    fetchOrders();
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    mockDb.updateOrderStatus(orderId, status);
    fetchOrders();
  };

  const NotificationBell = () => (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-eln hover:text-white transition-all relative border border-gray-100"
      >
        <Bell className="h-5 w-5" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setShowNotifications(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh] z-10"
            >
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h4 className="font-black text-xs uppercase tracking-widest text-gray-900">Job Notifications</h4>
                <button onClick={() => setShowNotifications(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        mockDb.markNotificationRead(n.id);
                        refreshNotifications();
                      }}
                      className={`p-4 rounded-2xl transition-all cursor-pointer border ${n.read ? 'bg-white border-gray-100' : 'bg-eln/5 border-eln/10'}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.read ? 'bg-gray-100 text-gray-400' : 'bg-eln text-white'}`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-gray-900 mb-0.5">{n.title}</p>
                          <p className="text-[11px] text-gray-500 leading-relaxed">{n.message}</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleTimeString()}</p>
                        </div>
                        {!n.read && <div className="h-2 w-2 bg-eln rounded-full mt-1" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8 px-4">
      <div className="flex items-center space-x-3 px-4 mb-12">
        <Logo className="h-7" showText={true} variant="white" />
      </div>

      <nav className="flex-1 space-y-2">
        <button 
          onClick={() => { setActiveTab('jobs'); setIsMobileMenuOpen(false); }}
          className={`flex items-center space-x-3 w-full px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'jobs' ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <Package className={`h-5 w-5 ${activeTab === 'jobs' ? 'text-white' : 'text-white/30'}`} />
          <span className="font-black text-xs uppercase tracking-widest">Active Jobs</span>
        </button>

        <button 
          onClick={() => { setActiveTab('map'); setIsMobileMenuOpen(false); }}
          className={`flex items-center space-x-3 w-full px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'map' ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <MapPin className={`h-5 w-5 ${activeTab === 'map' ? 'text-white' : 'text-white/30'}`} />
          <span className="font-black text-xs uppercase tracking-widest">Navigation</span>
        </button>

        <button 
          onClick={() => { setActiveTab('earnings'); setIsMobileMenuOpen(false); }}
          className={`flex items-center space-x-3 w-full px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'earnings' ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
          <Wallet className={`h-5 w-5 ${activeTab === 'earnings' ? 'text-white' : 'text-white/30'}`} />
          <span className="font-black text-xs uppercase tracking-widest">Earnings</span>
        </button>
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="px-4 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white/10 overflow-hidden">
              <img src={localUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(localUser.name)}&background=034287&color=fff`} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">{localUser.name}</p>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Professional Rider</p>
            </div>
          </div>
          <button 
            onClick={handleToggleAvailability}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${localUser.isAvailable ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}
          >
            <div className="flex items-center space-x-2">
              <Power className="h-4 w-4" />
              <span className="font-black text-[10px] uppercase tracking-widest">{localUser.isAvailable ? 'Online' : 'Offline'}</span>
            </div>
            {localUser.isAvailable ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
          </button>
        </div>
        <button onClick={onLogout} className="flex items-center space-x-3 w-full px-5 py-4 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut className="h-5 w-5" />
          <span className="font-black text-xs uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-eln/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-eln z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-eln flex flex-col hidden lg:flex h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-30 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400 lg:hidden hover:bg-gray-50 rounded-xl transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">
              Rider Dashboard <span className="text-gray-200 mx-2">/</span> <span className="text-gray-900">{activeTab}</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <span className={`text-[10px] font-black uppercase tracking-widest ${localUser.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                {localUser.isAvailable ? 'Available' : 'Offline'}
              </span>
              <button onClick={handleToggleAvailability} className="focus:outline-none">
                {localUser.isAvailable ? <ToggleRight className="h-6 w-6 text-eln" /> : <ToggleLeft className="h-6 w-6 text-gray-300" />}
              </button>
            </div>
            <NotificationBell />
            <button onClick={fetchOrders} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-eln hover:bg-eln/5 transition-colors border border-gray-100">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full">
          {activeTab === 'jobs' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Missions</h2>
                  <p className="text-sm text-gray-500 font-medium">Manage your current deliveries and incoming requests.</p>
                </div>
              </div>

              {!localUser.isAvailable && (
                <div className="bg-white p-12 rounded-[2.5rem] text-center space-y-6 border border-dashed border-gray-200 shadow-sm">
                  <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center text-gray-300 mx-auto">
                    <Ban className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900">You are currently Offline</h3>
                    <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">Go online to start receiving high-priority fashion delivery missions in your area.</p>
                  </div>
                  <button 
                    onClick={handleToggleAvailability}
                    className="px-8 py-4 bg-eln text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-eln/20 hover:scale-105 transition-all active:scale-95"
                  >
                    Go Online Now
                  </button>
                </div>
              )}

              {localUser.isAvailable && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Active Order Card */}
                  <div className="space-y-4">
                    <h3 className="font-black text-eln text-[10px] uppercase tracking-widest flex items-center space-x-2">
                      <div className="h-1 w-1 rounded-full bg-eln animate-pulse" />
                      <span>Current Mission</span>
                    </h3>
                    {activeOrder ? (
                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6">
                           <span className="text-[9px] bg-eln/10 text-eln px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-eln/20">In Transit</span>
                        </div>
                        <div className="flex items-center space-x-4">
                           <div className="bg-eln/5 p-3 rounded-2xl text-eln"><Package className="h-6 w-6" /></div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Merchant Partner</p>
                              <p className="font-black text-xl text-gray-900">{activeOrder.merchantName}</p>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
                              <div className="flex items-center space-x-3">
                                 <MapPin className="h-4 w-4 text-eln" />
                                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dropoff Destination</p>
                              </div>
                              <div>
                                 <p className="font-black text-base text-gray-800 mb-1">{activeOrder.customerName}</p>
                                 <p className="text-xs text-gray-500 font-medium leading-relaxed">{activeOrder.deliveryAddress}</p>
                              </div>
                           </div>
                           
                           <div className="flex flex-col space-y-3">
                             <button 
                                onClick={() => setActiveTab('map')}
                                className="w-full py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all shadow-sm"
                             >
                               <Navigation className="h-4 w-4" />
                               <span>Open Navigation</span>
                             </button>
                             <button 
                                onClick={() => updateStatus(activeOrder.id, OrderStatus.DELIVERED)} 
                                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 flex items-center justify-center space-x-2 active:scale-95 transition-all"
                             >
                               <CheckCircle2 className="h-4 w-4" />
                               <span>Confirm Successful Delivery</span>
                             </button>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-12 rounded-[2.5rem] text-center space-y-4 border border-dashed border-gray-200 shadow-sm">
                        <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center text-gray-300 mx-auto opacity-50">
                          <Bike className="h-8 w-8" />
                        </div>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No active mission</p>
                      </div>
                    )}
                  </div>

                  {/* New Requests List */}
                  <div className="space-y-4">
                    <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center space-x-2">
                      <div className="h-1 w-1 rounded-full bg-gray-300" />
                      <span>New Requests ({newRequests.length})</span>
                    </h3>
                    <div className="space-y-4">
                      {newRequests.length > 0 ? (
                        newRequests.map((req) => (
                          <div key={req.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:border-eln/30 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center space-x-3">
                                <div className="bg-eln/5 p-2.5 rounded-xl text-eln">
                                  <Package className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 text-sm tracking-tight">Mission #{req.id.slice(0, 8)}</p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">₦2,500.00 • Standard</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{new Date(req.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Pickup</p>
                                  <p className="font-bold text-gray-800 text-xs truncate">{req.merchantName}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Dropoff</p>
                                  <p className="font-bold text-gray-800 text-xs truncate">{req.customerName}</p>
                               </div>
                            </div>
                            <div className="flex space-x-3">
                               <button onClick={() => handleAccept(req.id)} className="flex-1 bg-eln text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-eln/20 active:scale-95 transition-all">
                                 <Check className="h-4 w-4" />
                                 <span>Accept</span>
                               </button>
                               <button onClick={() => handleDecline(req.id)} className="flex-1 bg-gray-50 text-gray-400 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 border border-gray-100 active:scale-95 transition-all">
                                 <Ban className="h-4 w-4" />
                                 <span>Decline</span>
                               </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white p-12 rounded-[2.5rem] text-center space-y-4 border border-dashed border-gray-200 shadow-sm">
                          <RefreshCw className="h-8 w-8 text-gray-200 mx-auto animate-spin-slow" />
                          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Scanning for requests...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'map' ? (
            <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Live Navigation</h2>
                  <p className="text-sm text-gray-500 font-medium">Real-time view of your location and nearby fashion delivery requests.</p>
                </div>
              </div>
              
              <div className="flex-1 min-h-[500px] relative rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm bg-white">
                {!localUser.isAvailable && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center space-y-6 p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl max-w-sm mx-auto">
                      <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center text-gray-400 mx-auto">
                        <Ban className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900">Map Offline</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">You must be online to view the live dispatch map and accept nearby requests.</p>
                      </div>
                      <button 
                        onClick={handleToggleAvailability}
                        className="w-full py-4 bg-eln text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-eln/20 hover:scale-105 transition-all active:scale-95"
                      >
                        Go Online
                      </button>
                    </div>
                  </div>
                )}
                <RiderMap 
                  riderLocation={riderLocation}
                  nearbyRequests={allPendingOrders}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Earnings Summary</h2>
                  <p className="text-sm text-gray-500 font-medium">Manage your professional earnings and payouts.</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between min-w-[320px] relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Available Balance</p>
                    <p className="text-4xl font-black text-gray-900">₦{(localUser.walletBalance || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-eln/5 p-4 rounded-2xl text-eln group-hover:scale-110 transition-transform duration-500">
                    <Wallet className="h-10 w-10" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Payout History</h3>
                    <button className="text-[10px] font-black text-eln uppercase tracking-widest hover:underline">Request Withdrawal</button>
                  </div>
                  
                  <div className="space-y-4">
                    {mockDb.getWithdrawals().filter(w => w.riderId === localUser.uid).length > 0 ? (
                      mockDb.getWithdrawals().filter(w => w.riderId === localUser.uid).sort((a, b) => b.createdAt - a.createdAt).map((w) => (
                        <div key={w.id} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${w.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                              <Wallet className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-sm">Withdrawal Request</p>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(w.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-gray-900">₦{w.amount.toLocaleString()}</p>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${w.status === 'approved' ? 'text-emerald-600' : 'text-orange-600'}`}>{w.status}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-[10px] font-black uppercase tracking-widest">No payout history</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-eln text-white p-8 rounded-[2.5rem] shadow-xl shadow-eln/20 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-black mb-2">Weekly Performance</h3>
                    <p className="text-white/60 text-sm font-medium mb-8">You've completed {orders.filter(o => o.status === OrderStatus.DELIVERED).length} missions this week.</p>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Success Rate</p>
                          <p className="text-2xl font-black">98.5%</p>
                        </div>
                        <div className="h-12 w-1 bg-white/20 rounded-full relative overflow-hidden">
                          <div className="absolute bottom-0 left-0 right-0 bg-white h-[98.5%]" />
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Avg. Time</p>
                          <p className="text-2xl font-black">24m</p>
                        </div>
                        <div className="h-12 w-1 bg-white/20 rounded-full relative overflow-hidden">
                          <div className="absolute bottom-0 left-0 right-0 bg-white h-[70%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="mt-12 w-full py-4 bg-white text-eln rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center space-x-2">
                    <span>View Full Report</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RiderDashboard;
