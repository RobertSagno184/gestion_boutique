export interface Transaction {
  id?: string;
  type: 'sale' | 'expense' | 'payment';
  amount: number;
  currency: string;
  description: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  reference?: string;
  metadata?: {
    productIds?: string[];
    workerId?: string;
    paymentMethod?: 'cash' | 'card' | 'mobile';
    [key: string]: any;
  };
}

export interface Sale extends Transaction {
  type: 'sale';
  items: SaleItem[];
  customerName?: string;
  customerPhone?: string;
  totalAmount: number;
  discount?: number;
  tax?: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
