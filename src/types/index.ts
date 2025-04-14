
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  allergens: string;
  weight: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';
export type DeliveryMethod = 'DELIVERY' | 'PICKUP';

export interface OrderDetails {
  id?: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'DELIVERING' 
  | 'DELIVERED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  orders?: OrderDetails[];
}
