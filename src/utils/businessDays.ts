import dayjs, { Dayjs } from "dayjs";

/**
 * Calculates the number of business days (weekdays) from a given date to today
 * Excludes weekends (Saturday and Sunday)
 *
 * @param fundedDate - The start date (dayjs object or date string)
 * @returns Number of business days, or undefined if date is invalid
 */
export function calculateBusinessDays(
  fundedDate: Dayjs | string | Date | null | undefined,
): number | undefined {
  if (!fundedDate) {
    return undefined;
  }

  const startDate = dayjs(fundedDate);
  if (!startDate.isValid()) {
    return undefined;
  }

  const today = dayjs().startOf("day");
  const start = startDate.startOf("day");

  if (start.isAfter(today)) {
    return 0;
  }

  let businessDays = 0;
  let currentDate = start;

  while (currentDate.isBefore(today) || currentDate.isSame(today, "day")) {
    const dayOfWeek = currentDate.day(); // 0 = Sunday, 6 = Saturday
    // Count only weekdays (Monday-Friday, i.e., 1-5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      businessDays++;
    }
    currentDate = currentDate.add(1, "day");
  }

  return businessDays;
}
