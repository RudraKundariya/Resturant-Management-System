import { TableStatus, ItemStatus, AlertType, AlertStatus, TaskStatus, PaymentStatus, BillStatus } from './enums';

export interface TableUpdatedPayload {
  tableId: string;
  status: TableStatus;
  guestCount?: number;
  statusChangedAt: string;
  alertCount: number;
}

export interface SessionOpenedClosedPayload {
  sessionId: string;
  tableId: string;
  reason?: string;
}

export interface OrderPlacedPayload {
  orderId: string;
  tableId: string;
  tableLabel: string;
  orderNo: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    instructions?: string;
  }>;
}

export interface ItemStatusPayload {
  orderItemId: string;
  orderId: string;
  status: ItemStatus;
  acceptedAt?: string;
  readyAt?: string;
  servedAt?: string;
}

export interface AlertRaisedUpdatedPayload {
  alertId: string;
  tableId: string;
  type: AlertType;
  severity: number;
  status: AlertStatus;
  assigneeId?: string;
}

export interface CleaningTaskPayload {
  taskId: string;
  tableId: string;
  status: TaskStatus;
  priority: number;
}

export interface BillUpdatedPayload {
  billId: string;
  sessionId: string;
  total: number;
  amountPaid: number;
  status: BillStatus;
}

export interface PaymentStatusPayload {
  paymentId: string;
  billId: string;
  status: PaymentStatus;
  method: string;
}

export interface MenuAvailabilityPayload {
  itemId: string;
  isAvailable: boolean;
}

export interface CartUpdatedPayload {
  sessionId: string;
  items: Array<{
    menuItemId: string;
    variantId?: string;
    quantity: number;
    modifiers: Array<{ id: string; name: string; priceDelta: number }>;
    note?: string;
  }>;
}

