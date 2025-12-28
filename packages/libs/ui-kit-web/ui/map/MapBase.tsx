'use client';

import type { CSSProperties, ReactNode } from 'react';
import * as React from 'react';
import Map, {
  type MapRef,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl/maplibre';

const DEFAULT_STYLE =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export interface BBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface MapBaseProps {
  initialViewState?: { longitude: number; latitude: number; zoom: number };
  styleUrl?: string;
  style?: CSSProperties;
  showControls?: boolean;
  showCssLink?: boolean;
  onMapRef?: (ref: MapRef | null) => void;
  children?: ReactNode;
}

export function MapBase(props: MapBaseProps) {
  const {
    initialViewState = { longitude: 2.3522, latitude: 48.8566, zoom: 5 },
    styleUrl = DEFAULT_STYLE,
    style,
    showControls = true,
    showCssLink = true,
    onMapRef,
    children,
  } = props;

  const mapRef = React.useRef<MapRef | null>(null);

  React.useEffect(() => {
    onMapRef?.(mapRef.current);
  }, [mapRef.current]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...(style || {}),
      }}
    >
      {showCssLink && (
        <link
          href="https://unpkg.com/maplibre-gl@4.7.0/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      )}
      <Map
        ref={mapRef}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mapLib={import('maplibre-gl') as unknown as any}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={styleUrl}
        // onMoveEnd={handleMoveEnd}
        maplibreLogo={false}
      >
        {showControls && (
          <>
            <ScaleControl position="bottom-left" />
            <NavigationControl position="bottom-left" />
          </>
        )}
        {children}
      </Map>
    </div>
  );
}
