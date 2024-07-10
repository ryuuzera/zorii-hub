import {
  format,
  formatDistanceToNow,
  isThisMonth,
  isThisWeek,
  isToday,
  isYesterday,
} from '../../client/node_modules/date-fns';

export function formatDate(date: Date) {
  const now = new Date();

  if (isToday(date)) {
    return `today, ${formatDistanceToNow(date, { addSuffix: true })}`;
  }

  if (isYesterday(date)) {
    return `yesterday, ${format(date, 'HH:mm')}`;
  }

  if (isThisWeek(date)) {
    return `this week, ${format(date, 'EEEE')}`;
  }

  if (isThisMonth(date)) {
    return `this month, ${format(date, 'dd MMM')}`;
  }

  return `last ${format(date, 'MMMM')}`;
}

export function secondsToMinutesString(seconds: number): string {
  const minutes: number = Math.floor(seconds / 60);
  const remainingSeconds: number = parseInt(seconds.toString()) % 60;
  const formattedMinutes: string = minutes.toString().padStart(2, '0');
  const formattedSeconds: string = remainingSeconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
