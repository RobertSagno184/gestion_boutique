export const CURRENCY = 'GNF'; // Franc Guinéen
export const CURRENCY_SYMBOL = 'FG';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

export const MIN_STOCK_ALERT = 5;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces' },
  { value: 'card', label: 'Carte' },
  { value: 'mobile', label: 'Mobile Money' }
] as const;

export const TASK_STATUSES = [
  { value: 'pending', label: 'En attente', color: 'yellow' },
  { value: 'in_progress', label: 'En cours', color: 'blue' },
  { value: 'completed', label: 'Terminé', color: 'green' },
  { value: 'cancelled', label: 'Annulé', color: 'red' }
] as const;

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Basse', color: 'gray' },
  { value: 'medium', label: 'Moyenne', color: 'yellow' },
  { value: 'high', label: 'Haute', color: 'red' }
] as const;
