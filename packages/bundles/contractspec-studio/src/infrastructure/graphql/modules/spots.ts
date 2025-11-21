import { RecurrenceEnum, SpotEnum } from '@lssm/lib.contracts-strit';
import { gqlSchemaBuilder } from '../builder';
// contracts registration is centralized in schema.ts; keep types only here
import {
  prisma,
  SpotDefinitionStatus,
  SpotAvailabilityStatus,
} from '@lssm/app.cli-database-strit';

export function registerSpotsPrismaObjectsSchema() {
  // City type (Prisma object) — required for Spot.city relation
  gqlSchemaBuilder.prismaObject('City', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      name: t.exposeString('name', { nullable: false }),
      code: t.exposeString('code'),
      countryId: t.exposeString('countryId'),
    }),
  });

  // Country type (Prisma object) — required by SpotSeries.country and Spot.country
  gqlSchemaBuilder.prismaObject('PublicCountry', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      name: t.exposeString('name', { nullable: false }),
      code: t.exposeString('code', { nullable: false }),
    }),
  });

  // Address type (Prisma object) — required by SpotSeries.address and Spot.address
  gqlSchemaBuilder.prismaObject('PublicAddress', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      addressLine1: t.exposeString('addressLine1', { nullable: true }),
      addressLine2: t.exposeString('addressLine2', { nullable: true }),
      postalCode: t.exposeString('postalCode', { nullable: true }),
      latitude: t.exposeFloat('latitude', { nullable: true }),
      longitude: t.exposeFloat('longitude', { nullable: true }),
      cityId: t.exposeString('cityId', { nullable: true }),
      countryId: t.exposeString('countryId', { nullable: true }),
    }),
  });

  // Enums for new availability model
  // const SpotDefinitionStatusEnum = gqlSchemaBuilder.enumType(
  //   'SpotDefinitionStatus',
  //   {
  //     values: [
  //       SpotDefinitionStatus.DRAFT,
  //       SpotDefinitionStatus.PUBLISHED,
  //       SpotDefinitionStatus.UNPUBLISHED,
  //     ] as const,
  //   }
  // );

  // const SpotAvailabilityStatusEnum = gqlSchemaBuilder.enumType(
  //   'SpotAvailabilityStatus',
  //   {
  //     values: [
  //       SpotAvailabilityStatus.PUBLISHED,
  //       SpotAvailabilityStatus.BOOKED,
  //       SpotAvailabilityStatus.CANCELLED,
  //     ] as const,
  //   }
  // );

  // SpotDefinition (Prisma object)
  gqlSchemaBuilder.prismaObject('SpotDefinition', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      name: t.exposeString('name', { nullable: false }),
      description: t.exposeString('description', { nullable: true }),
      status: t.field({
        type: SpotEnum.SpotDefinitionStatus().getName() as any,
        resolve: (s) => s.status,
        nullable: false,
      }),
      latitude: t.exposeFloat('latitude', { nullable: true }),
      longitude: t.exposeFloat('longitude', { nullable: true }),
      tags: t.exposeStringList('tags'),
      amenities: t.exposeStringList('amenities'),
      createdAt: t.field({ type: 'Date', resolve: (s) => s.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (s) => s.updatedAt }),
      // relations
      city: t.relation('city', { nullable: false, onNull: 'error' }),
      country: t.relation('country', { nullable: false, onNull: 'error' }),
      address: t.relation('address', { nullable: true }),
      spotAvailabilityDefinition: t.relation('spotAvailabilityDefinition', {
        nullable: true,
      }),
      spotAvailabilities: t.relation('spotAvailabilities'),
      nearbyCommercePoints: t.relation('nearbyCommercePoints'),
      organization: t.relation('organization', { nullable: true }),
    }),
  });

  // SpotAvailabilityDefinition (Prisma object)
  gqlSchemaBuilder.prismaObject('SpotAvailabilityDefinition', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      timezone: t.exposeString('timezone'),
      startDate: t.field({ type: 'Date', resolve: (s) => s.startDate }),
      frequency: t.field({
        type: RecurrenceEnum.RecurrenceFrequency().getName() as any,
        resolve: (s) => s.frequency,
      }),
      interval: t.exposeInt('interval'),
      byWeekday: t.field({
        type: ['Weekday'] as any,
        resolve: (s) => s.byWeekday,
      }),
      byMonthday: t.exposeIntList('byMonthday'),
      endsCount: t.exposeInt('endsCount', { nullable: true }),
      endsAt: t.field({
        type: 'Date',
        nullable: true,
        resolve: (s) => s.endsAt ?? null,
      }),
      isActive: t.exposeBoolean('isActive'),
      feeReference: t.exposeString('feeReference', { nullable: true }),
      maxCapacity: t.exposeInt('maxCapacity'),
      createdAt: t.field({ type: 'Date', resolve: (s) => s.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (s) => s.updatedAt }),
      // relations
      spotDefinition: t.relation('spotDefinition', { nullable: false }),
      availabilities: t.relation('availabilities'),
      organization: t.relation('organization', { nullable: true }),
    }),
  });

  // SpotAvailability (Prisma object)
  gqlSchemaBuilder.prismaObject('SpotAvailability', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      date: t.field({ type: 'Date', resolve: (s) => s.date }),
      status: t.field({
        type: SpotEnum.SpotAvailabilityStatus().getName() as any,
        resolve: (s) => s.status,
        nullable: false,
      }),
      publishedAt: t.field({ type: 'Date', resolve: (s) => s.publishedAt }),
      publishedBy: t.exposeString('publishedBy', { nullable: true }),
      currentCapacity: t.exposeInt('currentCapacity'),
      createdAt: t.field({ type: 'Date', resolve: (s) => s.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (s) => s.updatedAt }),
      // relations
      spotDefinition: t.relation('spotDefinition', { nullable: false }),
      spotAvailabilityDefinition: t.relation('spotAvailabilityDefinition', {
        nullable: false,
      }),
      bookings: t.relation('bookings'),
      organization: t.relation('organization'),
    }),
  });

  gqlSchemaBuilder.prismaObject('CommercePoint', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      name: t.exposeString('name'),
      type: t.exposeString('type'),
      latitude: t.exposeFloat('latitude', { nullable: true }),
      longitude: t.exposeFloat('longitude', { nullable: true }),
      address: t.relation('address', { nullable: true }),
      siret: t.exposeString('siret', { nullable: true }),
      nafCode: t.exposeString('nafCode', { nullable: true }),
      businessName: t.exposeString('businessName', { nullable: true }),
      source: t.exposeString('source'),
      externalId: t.exposeString('externalId', { nullable: true }),
      amenities: t.exposeStringList('amenities'),
      isActive: t.exposeBoolean('isActive'),
      verified: t.exposeBoolean('verified'),
      createdAt: t.field({ type: 'Date', resolve: (s) => s.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (s) => s.updatedAt }),
    }),
  });
}
