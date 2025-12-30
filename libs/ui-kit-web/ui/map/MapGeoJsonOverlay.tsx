'use client';

import * as React from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';

export interface GeoJsonOverlayProps {
  id?: string;
  data: GeoJSON.FeatureCollection;
  fillColor?: string;
  fillOpacity?: number;
  lineColor?: string;
  lineWidth?: number;
  lineOpacity?: number;
}

export function MapGeoJsonOverlay(props: GeoJsonOverlayProps) {
  const {
    id = 'geojson-overlay',
    data,
    fillColor = '#2563eb',
    fillOpacity = 0.25,
    lineColor = '#1e40af',
    lineWidth = 1.5,
    lineOpacity = 0.8,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fillLayer: any = {
    id: `${id}-fill`,
    type: 'fill',
    paint: {
      'fill-color': fillColor,
      'fill-opacity': fillOpacity,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outlineLayer: any = {
    id: `${id}-outline`,
    type: 'line',
    paint: {
      'line-color': lineColor,
      'line-width': lineWidth,
      'line-opacity': lineOpacity,
    },
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Source id={id} type="geojson" data={data as any}>
      <Layer {...fillLayer} />
      <Layer {...outlineLayer} />
    </Source>
  );
}
