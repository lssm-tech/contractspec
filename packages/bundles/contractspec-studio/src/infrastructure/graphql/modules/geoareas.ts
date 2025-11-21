import {
  GeoAreasService,
  type GeoAreaFeature,
} from '../../../application/services/GeoAreasService';
import { gqlSchemaBuilder } from '../builder';
import { GeoAdminLevel } from '@lssm/app.cli-database-strit';

export function registerGeoAreasSchema(
  builder: typeof gqlSchemaBuilder,
  deps: { geoAreas: GeoAreasService }
) {
  const GeoAdminLevelEnum = builder.enumType('GeoAdminLevel', {
    values: [
      GeoAdminLevel.CONTINENT,
      GeoAdminLevel.COUNTRY,
      GeoAdminLevel.REGION,
      GeoAdminLevel.PROVINCE,
      GeoAdminLevel.DEPARTMENT,
      GeoAdminLevel.COUNTY,
      GeoAdminLevel.DISTRICT,
      GeoAdminLevel.ARRONDISSEMENT,
      GeoAdminLevel.CANTON,
      GeoAdminLevel.CITY,
      GeoAdminLevel.COMMUNE,
      GeoAdminLevel.WARD,
      GeoAdminLevel.NEIGHBOURHOOD,
    ] as const,
  });

  // Prisma-backed AdminArea (kept for future relational needs)
  builder.prismaObject('GeoArea', {
    fields: (t) => ({
      id: t.exposeString('id', { nullable: false }),
      name: t.exposeString('name', { nullable: false }),
      code: t.exposeString('code', { nullable: true }),
      level: t.field({
        type: GeoAdminLevelEnum,
        resolve: (o) => o.level,
        nullable: false,
      }),
    }),
  });

  // Lightweight feature with precomputed center + geometry
  const GeoAreaFeatureType = builder
    .objectRef<GeoAreaFeature>('GeoAreaFeature')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id, nullable: false }),
        name: t.string({ resolve: (o) => o.name, nullable: false }),
        code: t.string({
          nullable: true,
          resolve: (o) => o.code ?? null,
        }),
        level: t.field({
          type: GeoAdminLevelEnum,
          resolve: (o) => o.level,
          nullable: false,
        }),
        centerLng: t.float({
          nullable: true,
          resolve: (o) => o.centerLng ?? null,
        }),
        centerLat: t.float({
          nullable: true,
          resolve: (o) => o.centerLat ?? null,
        }),
        geometry: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (o) => o.geometry ?? null,
        }),
      }),
    });

  builder.queryField('geoAreasSearch', (t) =>
    t.field({
      type: [GeoAreaFeatureType],
      args: { q: t.arg.string({ required: true }), limit: t.arg.int() },
      resolve: async (_root, args) =>
        deps.geoAreas.searchByName(args.q, args.limit ?? 20),
      complexity: 10,
    })
  );

  builder.queryField('geoAreasInBBox', (t) =>
    t.field({
      type: [GeoAreaFeatureType],
      args: {
        minLng: t.arg.float({ required: true }),
        minLat: t.arg.float({ required: true }),
        maxLng: t.arg.float({ required: true }),
        maxLat: t.arg.float({ required: true }),
        limit: t.arg.int(),
      },
      resolve: async (_root, args) => {
        const { minLng, minLat, maxLng, maxLat, limit } = args;
        if (
          minLng == null ||
          minLat == null ||
          maxLng == null ||
          maxLat == null
        ) {
          // Required by the schema, but guard for type safety
          return [];
        }
        return deps.geoAreas.byBBox({
          minLng,
          minLat,
          maxLng,
          maxLat,
          limit: limit ?? 200,
        });
      },
      complexity: 15,
    })
  );

  builder.queryField('geoAreasByLevel', (t) =>
    t.field({
      type: [GeoAreaFeatureType],
      args: {
        level: t.arg({ type: GeoAdminLevelEnum, required: true }),
        minLng: t.arg.float(),
        minLat: t.arg.float(),
        maxLng: t.arg.float(),
        maxLat: t.arg.float(),
        limit: t.arg.int(),
      },
      resolve: async (_root, args) => {
        const { level, minLng, minLat, maxLng, maxLat, limit } = args;
        if (level == null) {
          // Required by the schema, but guard for type safety
          return [];
        }
        const bbox =
          minLng != null && minLat != null && maxLng != null && maxLat != null
            ? { minLng, minLat, maxLng, maxLat }
            : undefined;
        return deps.geoAreas.byLevel(level, bbox, limit ?? 500);
      },
      complexity: 15,
    })
  );

  builder.queryField('geoAreaGeometry', (t) =>
    t.field({
      type: 'JSON',
      args: { id: t.arg.id({ required: true }) },
      resolve: async (_root, args) => {
        const id = typeof args.id === 'string' ? args.id : String(args.id);
        return deps.geoAreas.geometry(id);
      },
      complexity: 5,
    })
  );
}
