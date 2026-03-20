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

export function getFullImageUrl(path: string | null | undefined) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Ensure we don't double up on slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `http://localhost:8000${cleanPath}`;
}

