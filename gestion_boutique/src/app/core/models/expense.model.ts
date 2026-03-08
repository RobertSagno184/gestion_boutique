export interface Expense {
  id?: string;
  type: ExpenseType;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile' | 'card';
  reference?: string;
  workerId?: string; // Si c'est un paiement de salaire
  workerName?: string;
  supplier?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseType = 'general' | 'salary' | 'supply' | 'utility' | 'rent' | 'transport' | 'maintenance' | 'other';

export type ExpenseCategory = 
  | 'salaire'
  | 'avance_salaire'
  | 'bonus'
  | 'loyer'
  | 'electricite'
  | 'eau'
  | 'internet'
  | 'telephone'
  | 'transport'
  | 'fournitures'
  | 'marchandises'
  | 'reparation'
  | 'entretien'
  | 'impots'
  | 'assurance'
  | 'publicite'
  | 'autre';

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string; color: string }[] = [
  { value: 'salaire', label: 'Salaire', icon: 'fa-user-tie', color: 'blue' },
  { value: 'avance_salaire', label: 'Avance salaire', icon: 'fa-hand-holding-dollar', color: 'indigo' },
  { value: 'bonus', label: 'Bonus/Prime', icon: 'fa-gift', color: 'purple' },
  { value: 'loyer', label: 'Loyer', icon: 'fa-building', color: 'orange' },
  { value: 'electricite', label: 'Électricité', icon: 'fa-bolt', color: 'yellow' },
  { value: 'eau', label: 'Eau', icon: 'fa-droplet', color: 'cyan' },
  { value: 'internet', label: 'Internet', icon: 'fa-wifi', color: 'teal' },
  { value: 'telephone', label: 'Téléphone', icon: 'fa-phone', color: 'green' },
  { value: 'transport', label: 'Transport', icon: 'fa-truck', color: 'amber' },
  { value: 'fournitures', label: 'Fournitures', icon: 'fa-box', color: 'lime' },
  { value: 'marchandises', label: 'Achat marchandises', icon: 'fa-boxes-stacked', color: 'emerald' },
  { value: 'reparation', label: 'Réparation', icon: 'fa-wrench', color: 'red' },
  { value: 'entretien', label: 'Entretien', icon: 'fa-broom', color: 'pink' },
  { value: 'impots', label: 'Impôts/Taxes', icon: 'fa-landmark', color: 'slate' },
  { value: 'assurance', label: 'Assurance', icon: 'fa-shield-halved', color: 'sky' },
  { value: 'publicite', label: 'Publicité', icon: 'fa-bullhorn', color: 'rose' },
  { value: 'autre', label: 'Autre', icon: 'fa-ellipsis', color: 'gray' }
];

export const PAYMENT_METHODS_EXPENSE: { value: string; label: string; icon: string }[] = [
  { value: 'cash', label: 'Espèces', icon: 'fa-money-bill-wave' },
  { value: 'mobile', label: 'Mobile Money', icon: 'fa-mobile-screen' },
  { value: 'bank_transfer', label: 'Virement bancaire', icon: 'fa-building-columns' },
  { value: 'card', label: 'Carte bancaire', icon: 'fa-credit-card' }
];
