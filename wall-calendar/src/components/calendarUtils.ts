export type ThemeName = 'coral' | 'ocean' | 'forest' | 'lavender' | 'amber'

export interface CalendarDate {
  year: number
  month: number // 0-indexed
  day: number
}

export interface Theme {
  name: ThemeName
  label: string
  accent: string
  accentLight: string
  accentMid: string
  rangeAccent: string
  rangeBg: string
  dotColor: string
}

export const THEMES: Record<ThemeName, Theme> = {
  coral: {
    name: 'coral', label: 'Coral',
    accent: '#C2450A', accentLight: '#FDF0EA', accentMid: '#E8845A',
    rangeAccent: '#2563EB', rangeBg: '#EBF4FD', dotColor: '#C2450A',
  },
  ocean: {
    name: 'ocean', label: 'Ocean',
    accent: '#1251A3', accentLight: '#E8F0FD', accentMid: '#5585D8',
    rangeAccent: '#0E7490', rangeBg: '#ECFEFF', dotColor: '#1251A3',
  },
  forest: {
    name: 'forest', label: 'Forest',
    accent: '#166534', accentLight: '#F0FDF4', accentMid: '#4ADE80',
    rangeAccent: '#15803D', rangeBg: '#F0FDF4', dotColor: '#166534',
  },
  lavender: {
    name: 'lavender', label: 'Lavender',
    accent: '#5B21B6', accentLight: '#F5F3FF', accentMid: '#A78BFA',
    rangeAccent: '#7C3AED', rangeBg: '#F5F3FF', dotColor: '#5B21B6',
  },
  amber: {
    name: 'amber', label: 'Amber',
    accent: '#92400E', accentLight: '#FFFBEB', accentMid: '#F59E0B',
    rangeAccent: '#B45309', rangeBg: '#FFFBEB', dotColor: '#92400E',
  },
}

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const HOLIDAYS: Record<string, string> = {
  '2026-01-01': "New Year's Day",
  '2026-01-19': 'MLK Day',
  '2026-02-02': 'Groundhog Day',
  '2026-02-14': "Valentine's Day",
  '2026-02-16': "Presidents' Day",
  '2026-03-17': 'St. Patrick\'s Day',
  '2026-04-05': 'Easter Sunday',
  '2026-05-10': "Mother's Day",
  '2026-05-25': 'Memorial Day',
  '2026-06-19': 'Juneteenth',
  '2026-06-21': "Father's Day",
  '2026-07-04': 'Independence Day',
  '2026-09-07': 'Labor Day',
  '2026-10-12': 'Columbus Day',
  '2026-10-31': 'Halloween',
  '2026-11-11': 'Veterans Day',
  '2026-11-26': 'Thanksgiving',
  '2026-12-25': 'Christmas',
  '2026-12-31': "New Year's Eve",
}

export function formatDateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function compareDates(a: CalendarDate, b: CalendarDate): number {
  const av = a.year * 10000 + a.month * 100 + a.day
  const bv = b.year * 10000 + b.month * 100 + b.day
  return av < bv ? -1 : av > bv ? 1 : 0
}

export function isInRange(date: CalendarDate, start: CalendarDate | null, end: CalendarDate | null): boolean {
  if (!start || !end) return false
  return compareDates(date, start) >= 0 && compareDates(date, end) <= 0
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}
