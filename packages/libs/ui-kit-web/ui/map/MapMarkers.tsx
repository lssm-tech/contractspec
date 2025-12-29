'use client';

import * as React from 'react';
import { Marker } from 'react-map-gl/maplibre';

export interface MapPoint {
  id: string;
  lng: number;
  lat: number;
  color?: string;
  size?: number;
  ariaLabel?: string;
  onClick?: () => void;
}

export function MapMarkers({ points }: { points: MapPoint[] }) {
  return (
    <>
      {points.map((p) => (
        <Marker key={p.id} longitude={p.lng} latitude={p.lat} anchor="bottom">
          <button
            role={p.onClick ? 'button' : undefined}
            tabIndex={p.onClick ? 0 : -1}
            aria-label={p.ariaLabel || 'marker'}
            onClick={p.onClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                p.onClick?.();
              }
            }}
            style={{
              width: p.size ?? 14,
              height: p.size ?? 14,
              background: p.color ?? '#2563eb',
              border: '2px solid white',
              borderRadius: 9999,
              boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
              cursor: p.onClick ? 'pointer' : 'default',
            }}
          />
        </Marker>
      ))}
    </>
  );
}
