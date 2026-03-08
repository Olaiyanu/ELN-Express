
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Bike, 
  BarChart3, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Filter,
  X,
  Phone,
  Menu,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Check,
  XCircle,
  Eye,
  FileText,
  Loader2,
  Star,
  MessageSquare,
  MapPin,
  Banknote,
  Trash2,
  Settings,
  AlertTriangle,
  Gavel,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '../components/Logo';
import { User, Order, OrderStatus, UserRole, VerificationStatus, Notification } from '../types';
import { mockDb, PricingRule, Dispute } from '../services/mockDb';
import { useLanguage } from '../src/contexts/LanguageContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Area,
  Legend
} from 'recharts';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const { t: translations } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = () => {
      const data = mockDb.getNotifications(user.uid);
      setNotifications(data);
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user.uid]);

  const pendingVerifications = mockDb.getUsers().filter(u => (u.role === UserRole.RIDER || u.role === UserRole.MERCHANT) && u.verificationStatus === VerificationStatus.PENDING).length;
  const pendingDisputes = mockDb.getDisputes().filter(d => d.status === 'pending').length;

  const NavItem = ({ to, icon: Icon, label, badgeCount }: { to: string, icon: any, label: string, badgeCount?: number }) => {
    const isActive = location.pathname.includes(to);
    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center justify-between px-5 py-4 rounded-full transition-all duration-300 ${
          isActive 
            ? 'bg-eln-primary text-white shadow-xl shadow-eln-primary/20' 
            : 'text-gray-500 hover:text-eln-primary hover:bg-eln-primary/5'
        }`}
      >
        <div className="flex items-center space-x-4">
          <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`} />
          <span className="font-bold text-sm tracking-tight">{label}</span>
        </div>
        {badgeCount && badgeCount > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-eln-primary' : 'bg-eln-primary text-white'}`}>
            {badgeCount}
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-3 mb-12 px-4">
        <Logo className="h-10" showText={true} />
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem to="/admin-dashboard/overview" icon={LayoutDashboard} label="Overview" />
        <NavItem to="/admin-dashboard/orders" icon={Package} label="Delivery Management" />
        <NavItem to="/admin-dashboard/controls" icon={ShieldCheck} label="Rider & Merchant Control" badgeCount={pendingVerifications} />
        <NavItem to="/admin-dashboard/pricing" icon={Banknote} label="Pricing Rules" />
        <NavItem to="/admin-dashboard/withdrawals" icon={Wallet} label="Withdrawals" badgeCount={mockDb.getWithdrawals().filter(w => w.status === 'pending').length} />
        <NavItem to="/admin-dashboard/reports" icon={BarChart3} label="Reporting" />
        <NavItem to="/admin-dashboard/disputes" icon={Gavel} label="Dispute Handling" badgeCount={pendingDisputes} />
      </nav>

      <div className="pt-8 border-t border-gray-100 space-y-2">
        <button onClick={onLogout} className="flex items-center space-x-4 px-5 py-4 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 w-full transition-all group">
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-tight">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden relative bg-eln-bg">
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
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden p-8 flex flex-col shadow-2xl border-r border-gray-100 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button 
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-8 hidden lg:flex h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative w-full">
        <header className="sticky top-0 z-30 bg-eln-bg/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <button 
              className="p-2 -ml-2 text-gray-400 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-sm sm:text-lg font-black text-gray-900 truncate tracking-tight uppercase">
              {location.pathname.split('/').pop()?.replace('-', ' ').toUpperCase() || 'ADMIN PANEL'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
             <div className="flex items-center space-x-2 sm:space-x-3 border-l border-gray-100 pl-2 sm:pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Administrator</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-eln-primary text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-eln-primary/20 select-none">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="overview" element={<AdminOverview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="controls" element={<AdminControls />} />
            <Route path="pricing" element={<AdminPricingRules />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="disputes" element={<AdminDisputes />} />
            <Route path="/" element={<AdminOverview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const AdminOverview = () => {
  const orders = mockDb.getOrders();
  const riders = mockDb.getUsers().filter(u => u.role === UserRole.RIDER);
  const merchants = mockDb.getUsers().filter(u => u.role === UserRole.MERCHANT);
  
  const stats = [
    { label: "Total Deliveries", value: orders.length, icon: Package, color: "text-eln-primary", bg: "bg-eln-primary/5" },
    { label: "Active Riders", value: riders.filter(r => r.isAvailable).length, icon: Bike, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Merchants", value: merchants.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Success Rate", value: "96%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex items-center gap-6"
          >
            <div className={`${stat.bg} ${stat.color} p-5 rounded-3xl flex-shrink-0`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">System Performance</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={[
              { name: 'Mon', orders: 12 }, { name: 'Tue', orders: 19 }, { name: 'Wed', orders: 15 },
              { name: 'Thu', orders: 22 }, { name: 'Fri', orders: 30 }, { name: 'Sat', orders: 25 }, { name: 'Sun', orders: 10 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
              <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontWeight: 800 }} />
              <Bar dataKey="orders" fill="#FF7A00" radius={[6, 6, 0, 0]} barSize={40} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState<Order[]>(mockDb.getOrders());
  const [showAssignModal, setShowAssignModal] = useState<Order | null>(null);
  const [riderSearch, setRiderSearch] = useState('');
  
  const riders = mockDb.getUsers().filter(u => 
    u.role === UserRole.RIDER && 
    u.verificationStatus === VerificationStatus.VERIFIED &&
    u.isAvailable === true
  );

  const handleAssignRider = (rider: User) => {
    if (showAssignModal) {
      mockDb.updateOrderStatus(showAssignModal.id, OrderStatus.ASSIGNED, rider.uid, rider.name);
      setAllOrders(mockDb.getOrders());
      setShowAssignModal(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Delivery Management</h3>
          <div className="flex items-center space-x-2">
            <span className="bg-eln/5 text-eln px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-eln/10">
              {allOrders.length} Total Shipments
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-8 py-5">Ref</th>
                <th className="px-8 py-5">Merchant</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Rider</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 font-black text-eln-primary">#{order.id.slice(0, 6)}</td>
                  <td className="px-8 py-5 font-black text-eln-orange-deep">{order.merchantName}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${
                      order.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600' : 'bg-eln-primary/5 text-eln-primary'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-gray-500 text-xs">
                    {order.riderName || 'Unassigned'}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {order.status === OrderStatus.PENDING && (
                      <button 
                        onClick={() => setShowAssignModal(order)}
                        className="text-[10px] bg-eln-primary text-white px-4 py-2 rounded-xl hover:bg-eln-primary/90 transition-all font-black uppercase tracking-widest shadow-lg shadow-eln-primary/20"
                      >
                        Assign Rider
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-eln-orange-deep/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-eln-orange-deep">Assign Rider</h3>
              <button onClick={() => setShowAssignModal(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search riders..." 
                  value={riderSearch}
                  onChange={(e) => setRiderSearch(e.target.value)}
                  className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-eln-primary font-bold text-sm"
                />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {riders.filter(r => r.name.toLowerCase().includes(riderSearch.toLowerCase())).map(rider => (
                  <button 
                    key={rider.uid}
                    onClick={() => handleAssignRider(rider)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-eln-primary/5 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-eln-primary/10 text-eln-primary flex items-center justify-center font-bold">
                        {rider.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-gray-900 text-sm">{rider.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{rider.phone}</p>
                      </div>
                    </div>
                    <Plus className="h-5 w-5 text-eln-primary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminControls = () => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'merchants' | 'riders'>('verifications');
  const [users, setUsers] = useState<User[]>(mockDb.getUsers());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<User | null>(null);

  const pendingVerifications = users.filter(u => u.verificationStatus === VerificationStatus.PENDING);
  const merchants = users.filter(u => u.role === UserRole.MERCHANT);
  const riders = users.filter(u => u.role === UserRole.RIDER);

  const handleAction = (uid: string, status: VerificationStatus, reason?: string) => {
    mockDb.updateVerificationStatus(uid, status, reason);
    setUsers(mockDb.getUsers());
    setSelectedUser(null);
    setShowRejectModal(null);
    setRejectionReason('');
  };

  const handleDelete = (uid: string) => {
    if (window.confirm('Delete this user permanently?')) {
      mockDb.deleteUser(uid);
      setUsers(mockDb.getUsers());
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-gray-100 self-start inline-flex">
        {[
          { id: 'verifications', label: 'Verifications', count: pendingVerifications.length },
          { id: 'merchants', label: 'Merchants', count: merchants.length },
          { id: 'riders', label: 'Riders', count: riders.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${
              activeTab === tab.id ? 'bg-eln-primary text-white shadow-lg shadow-eln-primary/20' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${activeTab === tab.id ? 'bg-white text-eln-primary' : 'bg-gray-100 text-gray-400'}`}>{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'verifications' ? pendingVerifications : activeTab === 'merchants' ? merchants : riders).map(u => (
          <div key={u.uid} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-14 w-14 bg-eln-primary/10 rounded-2xl flex items-center justify-center text-eln-primary font-black text-xl">
                {u.name.charAt(0)}
              </div>
              <button onClick={() => handleDelete(u.uid)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div>
              <h4 className="font-black text-eln-orange-deep text-lg">{u.businessName || u.name}</h4>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{u.role} • {u.phone || 'No Phone'}</p>
              {u.verificationStatus === VerificationStatus.REJECTED && (
                <p className="text-[10px] text-red-500 font-bold mt-2">Rejected: {u.rejectionReason}</p>
              )}
            </div>
            {activeTab === 'verifications' ? (
              <div className="space-y-3">
                <button onClick={() => setSelectedUser(u)} className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-eln-primary hover:text-white transition-all">Review Documents</button>
                <div className="flex space-x-3">
                  <button onClick={() => handleAction(u.uid, VerificationStatus.VERIFIED)} className="flex-1 py-3 bg-eln-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-eln-primary/20">Approve</button>
                  <button onClick={() => setShowRejectModal(u)} className="px-4 py-3 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest">Reject</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setSelectedUser(u)} className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-eln-primary hover:text-white transition-all">View Details</button>
            )}
          </div>
        ))}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-eln-orange-deep/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl space-y-8 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-eln-orange-deep">User Verification</h3>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Basic Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-[10px] font-black uppercase text-gray-400">Full Name</span>
                      <span className="text-sm font-bold text-gray-900">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-[10px] font-black uppercase text-gray-400">Email</span>
                      <span className="text-sm font-bold text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-[10px] font-black uppercase text-gray-400">Role</span>
                      <span className="text-sm font-bold uppercase text-gray-900">{selectedUser.role}</span>
                    </div>
                    {selectedUser.plateNumber && (
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-[10px] font-black uppercase text-gray-400">Plate Number</span>
                        <span className="text-sm font-bold text-eln-primary">{selectedUser.plateNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedUser.verificationStatus === VerificationStatus.PENDING && (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleAction(selectedUser.uid, VerificationStatus.VERIFIED)}
                      className="flex-1 py-4 bg-eln-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-eln-primary/20"
                    >
                      Approve Rider
                    </button>
                    <button 
                      onClick={() => {
                        setShowRejectModal(selectedUser);
                        setSelectedUser(null);
                      }}
                      className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Verification Documents</h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedUser.idCardUrl ? (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-gray-400">Government ID</p>
                      <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={selectedUser.idCardUrl} alt="ID Card" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                      <p className="text-xs text-gray-400 font-bold">No ID Uploaded</p>
                    </div>
                  )}

                  {selectedUser.selfieUrl ? (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-gray-400">Selfie Verification</p>
                      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 max-w-[200px] mx-auto">
                        <img src={selectedUser.selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                      <p className="text-xs text-gray-400 font-bold">No Selfie Uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-eln-orange-deep/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-eln-orange-deep">Reject Verification</h3>
              <button onClick={() => setShowRejectModal(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Reason for Rejection</label>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. ID card is blurry or expired..."
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm h-32 resize-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button 
                onClick={() => handleAction(showRejectModal.uid, VerificationStatus.REJECTED, rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-600/20 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPricingRules = () => {
  const [rules, setRules] = useState<PricingRule[]>(mockDb.getPricingRules());
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

  const handleToggle = (rule: PricingRule) => {
    const updated = { ...rule, isActive: !rule.isActive };
    mockDb.savePricingRule(updated);
    setRules(mockDb.getPricingRules());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRule) {
      mockDb.savePricingRule(editingRule);
      setRules(mockDb.getPricingRules());
      setEditingRule(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Pricing Rules</h2>
          <p className="text-sm text-gray-500 font-medium">Manage delivery fees and surge pricing logic.</p>
        </div>
        <button 
          onClick={() => setEditingRule({ id: Math.random().toString(36).substring(7), name: '', baseFee: 0, perKmFee: 0, surgeMultiplier: 1, isActive: true })}
          className="px-8 py-4 bg-eln-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-eln-primary/20 hover:scale-105 transition-all"
        >
          Add New Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
            {!rule.isActive && <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] z-10" />}
            <div className="flex justify-between items-start relative z-20">
              <div>
                <h4 className="text-xl font-black text-gray-900">{rule.name}</h4>
                <p className={`text-[10px] font-black uppercase tracking-widest ${rule.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditingRule(rule)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-eln-primary transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleToggle(rule)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${rule.isActive ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}
                >
                  {rule.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 relative z-20">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Base Fee</p>
                <p className="text-sm font-black text-gray-900">₦{rule.baseFee}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Per KM</p>
                <p className="text-sm font-black text-gray-900">₦{rule.perKmFee}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Surge</p>
                <p className="text-sm font-black text-eln-primary">{rule.surgeMultiplier}x</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingRule && (
        <div className="fixed inset-0 bg-eln-orange-deep/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-eln-orange-deep">Edit Rule</h3>
              <button onClick={() => setEditingRule(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Rule Name</label>
                <input required type="text" value={editingRule.name} onChange={e => setEditingRule({...editingRule, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Base Fee (₦)</label>
                  <input required type="number" value={editingRule.baseFee} onChange={e => setEditingRule({...editingRule, baseFee: Number(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Per KM (₦)</label>
                  <input required type="number" value={editingRule.perKmFee} onChange={e => setEditingRule({...editingRule, perKmFee: Number(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Surge Multiplier</label>
                <input required type="number" step="0.1" value={editingRule.surgeMultiplier} onChange={e => setEditingRule({...editingRule, surgeMultiplier: Number(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900" />
              </div>
              <button type="submit" className="w-full py-5 bg-eln-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-eln-primary/20">Save Rule</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState(mockDb.getWithdrawals());
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    mockDb.updateWithdrawalStatus(id, status);
    setWithdrawals(mockDb.getWithdrawals());
  };

  const filteredWithdrawals = withdrawals.filter(w => filter === 'all' || w.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Withdrawal Requests</h2>
          <p className="text-sm text-gray-500 font-medium">Review and process rider payout requests.</p>
        </div>
        <div className="flex bg-white p-1 rounded-full shadow-sm border border-gray-100">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-eln-primary text-white shadow-lg shadow-eln-primary/20' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredWithdrawals.length > 0 ? (
          filteredWithdrawals.sort((a, b) => b.createdAt - a.createdAt).map((w) => (
            <div key={w.id} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-eln-primary/20 transition-all">
              <div className="flex items-center space-x-6">
                <div className={`p-4 rounded-2xl ${w.status === 'pending' ? 'bg-eln-primary/5 text-eln-primary' : w.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request #{w.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tight ${
                      w.status === 'pending' ? 'bg-eln-primary/10 text-eln-primary' : 
                      w.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {w.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-eln-orange-deep">{w.riderName}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Banknote className="h-3 w-3" />
                      <span>{w.bankDetails.bankName} • {w.bankDetails.accountNumber}</span>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {new Date(w.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">₦{w.amount.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{w.bankDetails.accountName}</p>
                </div>
                {w.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAction(w.id, 'approved')}
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-600/10"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleAction(w.id, 'rejected')}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-600/10"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-4xl border border-dashed border-gray-200">
            <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No withdrawal requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminReports = () => {
  const orders = mockDb.getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
  
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Reporting</h2>
          <p className="text-sm text-gray-500 font-medium">Financial and operational performance metrics.</p>
        </div>
        <button className="px-8 py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Download CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-4xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-tight">Revenue Growth</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Jan', rev: 400000 }, { name: 'Feb', rev: 600000 }, { name: 'Mar', rev: 800000 },
                { name: 'Apr', rev: 700000 }, { name: 'May', rev: 900000 }, { name: 'Jun', rev: 1200000 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} tickFormatter={v => `₦${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', fontWeight: 800 }} />
                <Bar dataKey="rev" fill="#FF7A00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-gradient-eln-deep p-10 rounded-4xl text-white flex flex-col justify-between shadow-2xl shadow-eln-orange-deep/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Total Platform Revenue</p>
            <h4 className="text-5xl font-black tracking-tighter">₦{totalRevenue.toLocaleString()}</h4>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold border-b border-white/10 pb-2">
              <span className="text-white/60">Platform Fee (15%)</span>
              <span>₦{(totalRevenue * 0.15).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold border-b border-white/10 pb-2">
              <span className="text-white/60">Rider Payouts</span>
              <span>₦{(totalRevenue * 0.85).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDisputes = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDb.getDisputes());
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const handleResolve = (id: string, resolution: string) => {
    const dispute = disputes.find(d => d.id === id);
    if (dispute) {
      dispute.status = 'resolved';
      dispute.resolution = resolution;
      mockDb.saveDispute(dispute);
      setDisputes(mockDb.getDisputes());
      setSelectedDispute(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Dispute Handling</h2>
          <p className="text-sm text-gray-500 font-medium">Resolve conflicts between merchants and riders.</p>
        </div>
        <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
          <span className="text-xs font-black text-red-600 uppercase tracking-widest">{disputes.filter(d => d.status === 'pending').length} Active Disputes</span>
        </div>
      </div>

      <div className="space-y-4">
        {disputes.map(dispute => (
          <div key={dispute.id} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-eln-primary/20 transition-all">
            <div className="flex items-center space-x-6">
              <div className={`p-4 rounded-2xl ${dispute.status === 'pending' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #{dispute.orderId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tight ${dispute.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {dispute.status}
                  </span>
                </div>
                <h4 className="text-lg font-black text-eln-orange-deep">{dispute.userName}</h4>
                <p className="text-xs text-gray-500 font-medium">{dispute.reason}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedDispute(dispute)}
              className="px-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-eln-primary hover:text-white transition-all"
            >
              {dispute.status === 'pending' ? 'Resolve Dispute' : 'View Resolution'}
            </button>
          </div>
        ))}
      </div>

      {selectedDispute && (
        <div className="fixed inset-0 bg-eln-orange-deep/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-eln-orange-deep">Dispute Details</h3>
              <button onClick={() => setSelectedDispute(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Reason for Dispute</p>
                <p className="text-sm font-bold text-gray-900">{selectedDispute.reason}</p>
              </div>
              {selectedDispute.status === 'pending' ? (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Resolution Notes</label>
                  <textarea id="resolution" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm h-32 resize-none" placeholder="Enter resolution details..."></textarea>
                  <button 
                    onClick={() => handleResolve(selectedDispute.id, (document.getElementById('resolution') as HTMLTextAreaElement).value)}
                    className="w-full py-5 bg-eln-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-eln-primary/20"
                  >
                    Confirm Resolution
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 p-6 rounded-3xl space-y-2 border border-green-100">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Resolution</p>
                  <p className="text-sm font-bold text-green-900">{selectedDispute.resolution}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
