import { format, isThisMonth, isThisWeek, isToday } from '../../client/node_modules/date-fns';

export function formatDate(date: Date) {
  if (isToday(date)) {
    return 'today';
  }

  if (isThisWeek(date)) {
    return 'last week';
  }

  if (isThisMonth(date)) {
    return 'last month';
  }

  return format(date, 'MMMM');
}
