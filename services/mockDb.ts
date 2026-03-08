
import { User, UserRole, Order, OrderStatus, VerificationStatus, WithdrawalRequest, Notification } from '../types';

const USERS_KEY = 'eln_users';
const ORDERS_KEY = 'eln_orders';
const WITHDRAWALS_KEY = 'eln_withdrawals';
const NOTIFICATIONS_KEY = 'eln_notifications';
const PRICING_KEY = 'eln_pricing';
const DISPUTES_KEY = 'eln_disputes';

export interface PricingRule {
  id: string;
  name: string;
  baseFee: number;
  perKmFee: number;
  surgeMultiplier: number;
  isActive: boolean;
}

export interface Dispute {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: number;
  resolution?: string;
}

// Initial Seed Orders
const defaultOrders: Order[] = [
  {
    id: 'order-101',
    merchantId: 'merchant-1',
    merchantName: 'Zara Lagos',
    pickupAddress: 'Victoria Island, Lagos',
    deliveryAddress: 'Lekki Phase 1, Lagos',
    customerName: 'Bisi Akande',
    customerPhone: '08099887766',
    status: OrderStatus.PENDING,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    paymentMethod: 'Card',
    paymentConfirmed: true,
    lat: 6.4311,
    lng: 3.4158
  },
  {
    id: 'order-102',
    merchantId: 'merchant-1',
    merchantName: 'Zara Lagos',
    pickupAddress: 'Victoria Island, Lagos',
    deliveryAddress: 'Ikeja, Lagos',
    customerName: 'Chidi Okafor',
    customerPhone: '08122334455',
    status: OrderStatus.PENDING,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
    paymentMethod: 'Cash',
    paymentConfirmed: false,
    lat: 6.4483,
    lng: 3.4500
  },
  {
    id: 'order-103',
    merchantId: 'merchant-1',
    merchantName: 'Zara Lagos',
    pickupAddress: 'Victoria Island, Lagos',
    deliveryAddress: 'Surulere, Lagos',
    customerName: 'Funmi Adebayo',
    customerPhone: '07033445566',
    status: OrderStatus.PENDING,
    createdAt: Date.now() - 10800000,
    updatedAt: Date.now() - 10800000,
    paymentMethod: 'Card',
    paymentConfirmed: true,
    lat: 6.4250,
    lng: 3.3900
  }
];

// Initial Seed Data
const defaultUsers: User[] = [
  { uid: 'admin-1', name: 'Admin User', email: 'admin@eln.com', role: UserRole.ADMIN, isEmailConfirmed: true },
  { uid: 'merchant-1', name: 'Zara Lagos', email: 'zara@merchant.com', role: UserRole.MERCHANT, businessName: 'Zara Boutique', isEmailConfirmed: true, walletBalance: 25000 },
  { 
    uid: 'rider-1', 
    name: 'Tunde Speed', 
    email: 'tunde@rider.com', 
    role: UserRole.RIDER, 
    phone: '08012345678',
    verificationStatus: VerificationStatus.VERIFIED,
    isAvailable: true,
    walletBalance: 5000,
    lastWithdrawalDate: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
    isEmailConfirmed: true
  }
];

export const mockDb = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : defaultUsers;
  },
  
  saveUser: (user: User) => {
    const users = mockDb.getUsers();
    const existingIndex = users.findIndex(u => u.uid === user.uid);
    if (existingIndex > -1) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getOrders: (): Order[] => {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : defaultOrders;
  },

  saveOrder: (order: Order) => {
    const orders = mockDb.getOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    if (existingIndex > -1) {
      orders[existingIndex] = order;
    } else {
      orders.push(order);
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  updateOrderStatus: (orderId: string, status: OrderStatus, riderId?: string, riderName?: string) => {
    const orders = mockDb.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const oldStatus = order.status;
      order.status = status;
      order.updatedAt = Date.now();
      if (riderId) order.riderId = riderId;
      if (riderName) order.riderName = riderName;
      mockDb.saveOrder(order);

      // Notify Merchant
      mockDb.addNotification({
        id: Math.random().toString(36).substring(2, 11),
        userId: order.merchantId,
        title: 'Order Status Updated',
        message: `Order #${order.id.slice(0, 8)} is now ${status}.`,
        type: 'order',
        read: false,
        createdAt: Date.now()
      });

      // Notify Rider if assigned
      if (status === OrderStatus.ASSIGNED && riderId) {
        mockDb.addNotification({
          id: Math.random().toString(36).substring(2, 11),
          userId: riderId,
          title: 'New Mission Assigned',
          message: `You have been assigned to order #${order.id.slice(0, 8)}. Items: ${order.itemsDescription || 'N/A'}. Verification Code: ${order.verificationCode}.`,
          type: 'order',
          read: false,
          createdAt: Date.now()
        });
      }

      // If order is delivered, update rider wallet
      if (status === OrderStatus.DELIVERED && oldStatus !== OrderStatus.DELIVERED && order.riderId) {
        const users = mockDb.getUsers();
        const rider = users.find(u => u.uid === order.riderId);
        if (rider) {
          const fee = order.deliveryFee || 1500; // Default fee if not set
          rider.walletBalance = (rider.walletBalance || 0) + fee;
          mockDb.saveUser(rider);
        }
      }
    }
  },

  updatePaymentStatus: (orderId: string, status: 'completed' | 'failed') => {
    const orders = mockDb.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.paymentStatus = status;
      order.paymentConfirmed = status === 'completed';
      order.updatedAt = Date.now();
      mockDb.saveOrder(order);
    }
  },

  getWithdrawals: (): WithdrawalRequest[] => {
    const data = localStorage.getItem(WITHDRAWALS_KEY);
    return data ? JSON.parse(data) : [];
  },

  requestWithdrawal: (request: WithdrawalRequest) => {
    const withdrawals = mockDb.getWithdrawals();
    withdrawals.push(request);
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));

    // Notify Admin
    mockDb.addNotification({
      id: Math.random().toString(36).substring(2, 11),
      userId: 'admin-1',
      title: 'New Withdrawal Request',
      message: `${request.riderName} requested a withdrawal of ₦${request.amount.toLocaleString()}`,
      type: 'withdrawal',
      read: false,
      createdAt: Date.now()
    });
  },

  updateWithdrawalStatus: (id: string, status: 'approved' | 'rejected') => {
    const withdrawals = mockDb.getWithdrawals();
    const req = withdrawals.find(w => w.id === id);
    if (req) {
      req.status = status;
      localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));

      if (status === 'approved') {
        const users = mockDb.getUsers();
        const rider = users.find(u => u.uid === req.riderId);
        if (rider) {
          rider.walletBalance = (rider.walletBalance || 0) - req.amount;
          rider.lastWithdrawalDate = Date.now();
          mockDb.saveUser(rider);
        }
      }

      // Notify Rider
      mockDb.addNotification({
        id: Math.random().toString(36).substring(2, 11),
        userId: req.riderId,
        title: `Withdrawal ${status === 'approved' ? 'Successful' : 'Rejected'}`,
        message: status === 'approved' 
          ? `Your withdrawal of ₦${req.amount.toLocaleString()} has been processed.` 
          : `Your withdrawal of ₦${req.amount.toLocaleString()} was rejected.`,
        type: 'withdrawal',
        read: false,
        createdAt: Date.now()
      });
    }
  },

  getNotifications: (userId: string): Notification[] => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: Notification[] = data ? JSON.parse(data) : [];
    return all.filter(n => n.userId === userId);
  },

  addNotification: (notification: Notification) => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: Notification[] = data ? JSON.parse(data) : [];
    all.push(notification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
  },

  markNotificationRead: (id: string) => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: Notification[] = data ? JSON.parse(data) : [];
    const n = all.find(x => x.id === id);
    if (n) {
      n.read = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
    }
  },

  markAllNotificationsRead: (userId: string) => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: Notification[] = data ? JSON.parse(data) : [];
    let changed = false;
    all.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
    }
  },
  
  deleteNotification: (id: string) => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: Notification[] = data ? JSON.parse(data) : [];
    const filtered = all.filter(n => n.id !== id);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
  },

  clearAllNotifications: (userId: string) => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: Notification[] = data ? JSON.parse(data) : [];
    const filtered = all.filter(n => n.userId !== userId);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
  },

  updateVerificationStatus: (uid: string, status: VerificationStatus, reason?: string) => {
    const users = mockDb.getUsers();
    const user = users.find(u => u.uid === uid);
    if (user) {
      user.verificationStatus = status;
      if (reason) user.rejectionReason = reason;
      mockDb.saveUser(user);

      // Notify User
      mockDb.addNotification({
        id: Math.random().toString(36).substring(2, 11),
        userId: uid,
        title: status === VerificationStatus.VERIFIED ? 'Account Verified' : 'Verification Update',
        message: status === VerificationStatus.VERIFIED 
          ? 'Congratulations! Your rider account has been verified. You can now start accepting jobs.' 
          : `Your verification was ${status}.${reason ? ` Reason: ${reason}` : ''}`,
        type: 'system',
        read: false,
        createdAt: Date.now()
      });
    }
  },

  submitVerification: (uid: string, data: { idCardUrl: string, selfieUrl: string, plateNumber: string }) => {
    const users = mockDb.getUsers();
    const user = users.find(u => u.uid === uid);
    if (user) {
      user.verificationStatus = VerificationStatus.PENDING;
      user.idCardUrl = data.idCardUrl;
      user.selfieUrl = data.selfieUrl;
      user.plateNumber = data.plateNumber;
      mockDb.saveUser(user);

      // Notify Admin
      mockDb.addNotification({
        id: Math.random().toString(36).substring(2, 11),
        userId: 'admin-1',
        title: 'New Rider Verification',
        message: `${user.name} has submitted documents for verification.`,
        type: 'system',
        read: false,
        createdAt: Date.now()
      });
    }
  },
  
  deleteUser: (uid: string) => {
    const users = mockDb.getUsers();
    const userToDelete = users.find(u => u.uid === uid);
    if (!userToDelete) return;

    // 1. Delete User
    const filteredUsers = users.filter(u => u.uid !== uid);
    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));

    // 2. Cascade Delete Orders
    const orders = mockDb.getOrders();
    let filteredOrders;
    if (userToDelete.role === UserRole.MERCHANT) {
      // Delete all orders created by this merchant
      filteredOrders = orders.filter(o => o.merchantId !== uid);
    } else if (userToDelete.role === UserRole.RIDER) {
      // Delete orders assigned to this rider
      filteredOrders = orders.filter(o => o.riderId !== uid);
    } else {
      filteredOrders = orders;
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(filteredOrders));

    // 3. Cascade Delete Withdrawals (for riders)
    const withdrawals = mockDb.getWithdrawals();
    const filteredWithdrawals = withdrawals.filter(w => w.riderId !== uid);
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(filteredWithdrawals));

    // 4. Cascade Delete Notifications
    const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifications: Notification[] = notificationsData ? JSON.parse(notificationsData) : [];
    const filteredNotifications = allNotifications.filter(n => n.userId !== uid);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filteredNotifications));
  },

  deleteOrder: (orderId: string) => {
    const orders = mockDb.getOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(filtered));
  },
  
  rateOrder: (orderId: string, rating: number, feedback: string) => {
    const orders = mockDb.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.rating = rating;
      order.feedback = feedback;
      mockDb.saveOrder(order);
    }
  },

  getPricingRules: (): PricingRule[] => {
    const data = localStorage.getItem(PRICING_KEY);
    return data ? JSON.parse(data) : [
      { id: '1', name: 'Standard Lagos', baseFee: 1500, perKmFee: 100, surgeMultiplier: 1, isActive: true },
      { id: '2', name: 'Rush Hour', baseFee: 2500, perKmFee: 150, surgeMultiplier: 1.5, isActive: false }
    ];
  },

  savePricingRule: (rule: PricingRule) => {
    const rules = mockDb.getPricingRules();
    const idx = rules.findIndex(r => r.id === rule.id);
    if (idx > -1) rules[idx] = rule;
    else rules.push(rule);
    localStorage.setItem(PRICING_KEY, JSON.stringify(rules));
  },

  getDisputes: (): Dispute[] => {
    const data = localStorage.getItem(DISPUTES_KEY);
    return data ? JSON.parse(data) : [
      { id: 'd1', orderId: 'order-101', userId: 'merchant-1', userName: 'Zara Lagos', reason: 'Rider was very late', status: 'pending', createdAt: Date.now() - 86400000 }
    ];
  },

  saveDispute: (dispute: Dispute) => {
    const disputes = mockDb.getDisputes();
    const idx = disputes.findIndex(d => d.id === dispute.id);
    if (idx > -1) disputes[idx] = dispute;
    else disputes.push(dispute);
    localStorage.setItem(DISPUTES_KEY, JSON.stringify(disputes));
  }
};
