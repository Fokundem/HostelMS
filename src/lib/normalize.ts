import { format } from 'date-fns';

export function normalizeStatus(value: string | null | undefined) {
  return (value || '').toString().toLowerCase();
}

export function monthNumberToName(month: number) {
  // month: 1..12
  return format(new Date(2000, Math.max(0, month - 1), 1), 'MMMM');
}

export function normalizePaymentType(value: string | null | undefined) {
  // HOSTEL_FEE -> hostel_fee
  return (value || '').toString().toLowerCase();
}

