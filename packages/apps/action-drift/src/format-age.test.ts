import { test, expect, describe } from "bun:test";
import { formatAge } from "./format-age";

describe("formatAge", () => {
  const NOW = new Date("2025-06-15T12:00:00Z").getTime();

  test("should return 'Never' when isoDate is undefined", () => {
    expect(formatAge(undefined, NOW)).toBe("Never");
  });

  test("should return 'Never' when isoDate is invalid", () => {
    expect(formatAge("not-a-date", NOW)).toBe("Never");
  });

  test("should return 'just now' when date is in the future", () => {
    expect(formatAge("2025-06-16T00:00:00Z", NOW)).toBe("just now");
  });

  test("should return 'just now' for less than a minute ago", () => {
    expect(formatAge("2025-06-15T11:59:30Z", NOW)).toBe("just now");
  });

  test("should return minutes for recent dates", () => {
    expect(formatAge("2025-06-15T11:45:00Z", NOW)).toBe("15 minutes");
  });

  test("should return singular minute", () => {
    expect(formatAge("2025-06-15T11:59:00Z", NOW)).toBe("1 minute");
  });

  test("should return hours for same-day dates", () => {
    expect(formatAge("2025-06-15T06:00:00Z", NOW)).toBe("6 hours");
  });

  test("should return singular hour", () => {
    expect(formatAge("2025-06-15T11:00:00Z", NOW)).toBe("1 hour");
  });

  test("should return days for older dates", () => {
    expect(formatAge("2025-05-23T12:00:00Z", NOW)).toBe("23 days");
  });

  test("should return singular day", () => {
    expect(formatAge("2025-06-14T12:00:00Z", NOW)).toBe("1 day");
  });
});

describe("formatAge - edge cases", () => {
  const NOW = new Date("2025-06-15T12:00:00Z").getTime();

  test("should handle empty string", () => {
    expect(formatAge("", NOW)).toBe("Never");
  });

  test("should handle very old dates (365+ days)", () => {
    expect(formatAge("2024-06-15T12:00:00Z", NOW)).toBe("365 days");
  });

  test("should handle exact boundary: 59 seconds returns 'just now'", () => {
    expect(formatAge("2025-06-15T11:59:01Z", NOW)).toBe("just now");
  });

  test("should handle exact boundary: 59 minutes", () => {
    expect(formatAge("2025-06-15T11:01:00Z", NOW)).toBe("59 minutes");
  });

  test("should handle exact boundary: 23 hours", () => {
    expect(formatAge("2025-06-14T13:00:00Z", NOW)).toBe("23 hours");
  });

  test("should handle dates with timezone offsets", () => {
    // 2025-06-15T06:30:00+05:30 = 2025-06-15T01:00:00Z => 11 hours ago
    expect(formatAge("2025-06-15T06:30:00+05:30", NOW)).toBe("11 hours");
  });

  test("should handle epoch zero (1970-01-01)", () => {
    const result = formatAge("1970-01-01T00:00:00Z", NOW);
    expect(result).toContain("days");
  });
});
