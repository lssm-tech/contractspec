'use client';

import * as React from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';

export interface H3FeatureProperties {
  id: string;
  h3Index?: string;
  count: number;
}

export interface H3HeatmapProps {
  id?: string;
  data: GeoJSON.FeatureCollection<
    GeoJSON.Polygon | GeoJSON.MultiPolygon,
    H3FeatureProperties
  >;
  colorStops?: [number, string][]; // [count, color]
  maxCount?: number; // for normalization
}

function buildChoroplethPaint(
  stops: [number, string][],
  _maxCount: number | undefined
) {
  const scaleStops = (stops || []).map(([c, col]) => [c, col]);
  return {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'count'],
      ...scaleStops.flat(),
    ],
    'fill-opacity': 0.6,
  } as const;
}

export function MapHeatmapH3(props: H3HeatmapProps) {
  const {
    id = 'h3-heatmap',
    data,
    colorStops = [
      [0, '#22c55e'],
      [5, '#eab308'],
      [10, '#ef4444'],
    ],
    maxCount,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fillLayer: any = {
    id: `${id}-fill`,
    type: 'fill',
    paint: buildChoroplethPaint(colorStops, maxCount),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineLayer: any = {
    id: `${id}-outline`,
    type: 'line',
    paint: {
      'line-color': '#ffffff',
      'line-width': 0.25,
      'line-opacity': 0.25,
    },
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Source id={id} type="geojson" data={data as any}>
      <Layer {...fillLayer} />
      <Layer {...lineLayer} />
    </Source>
  );
}
