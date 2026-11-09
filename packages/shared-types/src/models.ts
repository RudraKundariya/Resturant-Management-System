import {
  UserRole,
  TableStatus,
  SessionStatus,
  OrderStatus,
  ItemStatus,
  BillStatus,
  PaymentMethod,
  PaymentStatus,
  AlertType,
  AlertStatus,
  TaskStatus,
  ActorType,
} from './enums';

export interface RestaurantSettings {
  gstRate: number; // e.g. 5.0
  serviceChargeRate: number; // e.g. 0.0 or 5.0
  currency: string; // 'INR'
  orderApprovalRequired: boolean; // default false
  guestPhoneRequired: boolean; // default false
  sessionIdleTimeoutMin: number; // e.g. 15
  alertThresholds: {
    callWaiterEscalationSec: number; // 90s
    requestBillEscalationSec: number; // 120s
    longWaitWithoutOrderMin: number; // 10 min
    orderDelayedToleranceMin: number; // 5 min
    unattendedTableMin: number; // 25 min
    longStayMin: number; // 90 min
    cleaningDelayMin: number; // 5 min
  };
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  gstin?: string;
  currency: string;
  timezone: string;
  settings: RestaurantSettings;
  createdAt: string;
}

export interface StaffUser {
  id: string;
  restaurantId: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface Floor {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
}

export interface Table {
  id: string;
  restaurantId: string;
  floorId: string;
  label: string;
  capacity: number;
  shape: 'round' | 'square' | 'rect';
  posX: number;
  posY: number;
  width: number;
  height: number;
  status: TableStatus;
  statusChangedAt: string;
  currentSessionId?: string;
  qrToken: string;
  assignedWaiterId?: string;
  isActive: boolean;
}

export interface TableSession {
  id: string;
  restaurantId: string;
  tableId: string;
  status: SessionStatus;
  openedBy: ActorType;
  guestCount?: number;
  guestPhone?: string;
  startedAt: string;
  endedAt?: string;
  lastActivityAt?: string;
  closeReason?: string;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  taxRate: number;
  imageUrl?: string;
  isVeg: boolean;
  isAvailable: boolean;
  prepTimeMin: number;
  tags: string[];
  sortOrder: number;
}

