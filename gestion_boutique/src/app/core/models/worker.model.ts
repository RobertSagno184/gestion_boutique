export interface Worker {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  role: string;
  hourlyRate?: number;
  monthlySalary?: number;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id?: string;
  userId: string;
  workerId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id?: string;
  workerId: string;
  type: 'salary' | 'bonus' | 'advance' | 'other';
  amount: number;
  currency: string;
  paymentDate: Date;
  period?: {
    start: Date;
    end: Date;
  };
  description?: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile';
  createdAt: Date;
  userId: string;
}
