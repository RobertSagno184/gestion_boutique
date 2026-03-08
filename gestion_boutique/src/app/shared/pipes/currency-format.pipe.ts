import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '../utils/formatters';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return formatCurrency(0);
    }
    return formatCurrency(value);
  }
}
