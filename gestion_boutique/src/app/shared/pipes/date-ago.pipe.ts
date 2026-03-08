import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

@Pipe({
  name: 'dateAgo',
  standalone: true
})
export class DateAgoPipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }
}
