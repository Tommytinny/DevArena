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