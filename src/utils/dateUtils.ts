/**
 * Formats a Date object or timestamp into "DD | MONTH YYYY" with uppercase month.
 * Example: 13 | AUGUST 2026
 */
export function formatGenerationDate(dateInput?: Date | string | number): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} | ${month} ${year}`;
}
