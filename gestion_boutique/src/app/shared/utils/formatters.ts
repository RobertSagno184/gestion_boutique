import { CURRENCY, CURRENCY_SYMBOL } from './constants';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

export function formatCurrency(amount: number): string {
  // Formatage personnalisé pour le Franc Guinéen
  const formattedNumber = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
  return `${formattedNumber} ${CURRENCY_SYMBOL}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
