import { Prisma } from '../generated/prisma/client';

export function toJsonValue(value: unknown): Prisma.JsonValue {
  return value as unknown as Prisma.JsonValue;
}

export function toInputJson(value: unknown): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

export function toJsonNullValue(
  value: unknown
): Prisma.JsonNullValueInput | Prisma.InputJsonValue {
  if (value === null) {
    return Prisma.JsonNull;
  }
  return value as unknown as Prisma.InputJsonValue;
}

export function toNullableJsonValue(
  value: unknown
): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue {
  if (value === null || value === undefined) {
    return Prisma.JsonNull;
  }
  return value as unknown as Prisma.InputJsonValue;
}
