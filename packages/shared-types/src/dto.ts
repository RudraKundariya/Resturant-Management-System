import { TableStatus, AlertType, ItemStatus } from './enums';

export interface ScanTableDto {
  tableToken: string;
}

export interface ScanTableResponse {
  sessionToken: string;
  table: {
    id: string;
    label: string;
    floorName: string;
    capacity: number;
  };
  session: {
    id: string;
    guestCount?: number;
    startedAt: string;
  };
}

export interface UpdateSessionDto {
  guestCount?: number;
  guestPhone?: string;
}

export interface CartItemDto {
  menuItemId: string;
  variantId?: string;
  quantity: number;
  selectedModifierIds?: string[];
  note?: string;
}

export interface PlaceOrderDto {
  items: CartItemDto[];
  notes?: string;
}

export interface RaiseAlertDto {
  type: AlertType;
  message?: string;
}

export interface OverrideTableStatusDto {
  status: TableStatus;
  reason: string;
}

export interface StaffLoginDto {
  email: string;
  password: string;
}

export interface StaffPinLoginDto {
  restaurantId: string;
  pin: string;
  staffId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    restaurantId: string;
    name: string;
    role: string;
    email?: string;
  };
}

