export interface Product {
  id?: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock?: number;
  unit: string;
  sku?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  
  // Fashion Specific Fields
  brand?: string;
  size?: string;
  color?: string;
  material?: string;
  gender?: 'Homme' | 'Femme' | 'Unisexe' | 'Enfant';
}

export interface Category {
  id?: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface StockMovement {
  id?: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: Date;
  userId: string;
  createdAt: Date;
}
