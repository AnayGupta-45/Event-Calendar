import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  isSameMonth
} from 'date-fns';

export function getCalendarDays(date) {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  
  const days = [];
  let day = start;
  
  while (day <= end) {
    days.push({
      date: new Date(day),
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day),
      dateString: format(day, 'yyyy-MM-dd')
    });
    day = addDays(day, 1);
  }
  
  return days;
}

export function goToNextMonth(date) {
  return addMonths(date, 1);
}

export function goToPrevMonth(date) {
  return subMonths(date, 1);
}

export function formatMonth(date) {
  return format(date, 'MMMM yyyy');
}

export function formatTime(date) {
  return format(date, 'HH:mm');
}

export function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

export function isSameDate(date1, date2) {
  return isSameDay(date1, date2);
}
