import { format } from 'date-fns';
import { TimeRemaining } from '../types/dashboard';

/**
 * Formats a date string to time format (h:mm a)
 * @param dateString - The date string to format
 * @returns Formatted time string
 */
export const formatTime = (dateString: string): string => {
  return format(new Date(dateString), "h:mm a");
};

/**
 * Calculates time remaining between now and target date
 * @param targetDate - The target date to calculate time until
 * @returns TimeRemaining object with days, hours, minutes, and seconds
 */
export const calculateTimeRemaining = (targetDate: string): TimeRemaining => {
  const now = new Date();
  const target = new Date(targetDate);
  const difference = target.getTime() - now.getTime();

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hrs: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    secs: Math.floor((difference % (1000 * 60)) / 1000)
  };
};


export function getMonthDays(month: number, year: number): Date[] {
  const days: Date[] = []
  const lastDay = new Date(year, month + 1, 0)

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }

  return days
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear()
}

export function getTime(date: Date): string {
  const time = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date);
  return time;
}
