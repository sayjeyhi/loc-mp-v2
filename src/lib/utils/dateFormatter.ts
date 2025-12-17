import dayjs from "dayjs";

/**
 * Centralized date formatter utility
 * Formats a date according to the specified format string
 * Defaults to YYYY-MM-DD format if no format is provided
 *
 * @param date - The date to format (Date, string, or dayjs object)
 * @param format - Optional format string (defaults to "YYYY-MM-DD")
 * @returns Formatted date string, or empty string if date is invalid
 *
 * @example
 * formatDate(new Date()) // "2024-01-15"
 * formatDate(new Date(), "MM/DD/YYYY") // "01/15/2024"
 * formatDate("2024-01-15") // "2024-01-15"
 * formatDate("2024-01-15", "DD/MM/YYYY") // "15/01/2024"
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  format: string = "DD-MM-YYYY",
): string {
  if (!date) {
    return "";
  }

  const dayjsDate = dayjs(date);

  if (!dayjsDate.isValid()) {
    return "";
  }

  return dayjsDate.format(format);
}
