
export enum UserRole {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  RIDER = 'rider'
}

export enum OrderStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  businessName?: string;
  phone?: string;
  isAvailable?: boolean;
  profilePicture?: string;
  // Verification fields
  verificationStatus?: VerificationStatus;
  idCardUrl?: string;
  selfieUrl?: string;
  plateNumber?: string;
  rejectionReason?: string;
  // Merchant specific
  pickupAddresses?: string[];
  natureOfGoods?: string;
  // Wallet
  walletBalance?: number;
  lastWithdrawalDate?: number;
  isEmailConfirmed?: boolean;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
}

export interface Order {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantPhone?: string;
  riderId?: string;
  riderName?: string;
  riderPlateNumber?: string;
  pickupAddress: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  itemsDescription?: string;
  paymentMethod: string;
  paymentConfirmed: boolean;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  deliveryFee?: number;
  lat?: number;
  lng?: number;
  rating?: number;
  feedback?: string;
}

export interface WithdrawalRequest {
  id: string;
  riderId: string;
  riderName: string;
  amount: number;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string; // Target user (admin or specific user)
  title: string;
  message: string;
  type: 'withdrawal' | 'order' | 'system';
  read: boolean;
  createdAt: number;
}

export interface RiderProfile {
  uid: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  activeOrderId?: string;
}

export interface MerchantProfile {
  uid: string;
  businessName: string;
  email: string;
  contactName: string;
  phone: string;
}
