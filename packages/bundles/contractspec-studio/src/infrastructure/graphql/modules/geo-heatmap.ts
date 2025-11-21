import { gqlSchemaBuilder } from '../builder';
import {
  GeoHeatmapService,
  type H3CellFeature,
} from '../../../application/services/GeoHeatmapService';

export function registerGeoHeatmapSchema(
  builder: typeof gqlSchemaBuilder,
  deps: { heatmap: GeoHeatmapService }
) {
  const BBoxInput = builder.inputType('BBoxInput', {
    fields: (t) => ({
      minLng: t.float({ required: true }),
      minLat: t.float({ required: true }),
      maxLng: t.float({ required: true }),
      maxLat: t.float({ required: true }),
    }),
  });

  const DateRangeInput = builder.inputType('DateRangeInput', {
    fields: (t) => ({
      start: t.string(),
      end: t.string(),
    }),
  });

  const H3CellFeature = builder
    .objectRef<H3CellFeature>('H3CellFeature')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        h3Index: t.string({
          nullable: true,
          resolve: (o) => o.h3Index ?? null,
        }),
        count: t.int({ resolve: (o) => o.count }),
        geometry: t.field({ type: 'JSON', resolve: (o) => o.geometry }),
      }),
    });

  builder.queryField('availabilityHeatmap', (t) =>
    t.field({
      type: [H3CellFeature],
      args: {
        bbox: t.arg({ type: BBoxInput, required: true }),
        date: t.arg.string({ required: true }),
        resolution: t.arg.int(),
      },
      resolve: async (_root, args) => {
        return deps.heatmap.availabilityHeatmap({
          bbox: args.bbox,
          date: new Date(args.date as string),
          resolution: (args.resolution as number | undefined) ?? 7,
        });
      },
      complexity: 15,
    })
  );

  builder.queryField('bookingsHeatmap', (t) =>
    t.field({
      type: [H3CellFeature],
      args: {
        bbox: t.arg({ type: BBoxInput, required: true }),
        dateRange: t.arg({ type: DateRangeInput }),
        resolution: t.arg.int(),
      },
      resolve: async (_root, args) => {
        const range = args.dateRange || {};
        return deps.heatmap.bookingsHeatmap({
          bbox: args.bbox,
          start: range.start ? new Date(range.start) : undefined,
          end: range.end ? new Date(range.end) : undefined,
          resolution: (args.resolution as number | undefined) ?? 7,
        });
      },
      complexity: 15,
    })
  );
}
