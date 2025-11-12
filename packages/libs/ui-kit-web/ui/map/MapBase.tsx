'use client';

import * as React from 'react';
import type { CSSProperties, ReactNode } from 'react';
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
  onMoveEnd?: (bbox: BBox) => void;
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
    onMoveEnd,
    onMapRef,
    children,
  } = props;

  const mapRef = React.useRef<MapRef | null>(null);

  React.useEffect(() => {
    onMapRef?.(mapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef.current]);

  // const handleMoveEnd = React.useCallback(() => {
  //   if (!onMoveEnd) return;
  //   const b = mapRef.current?.getBounds();
  //   if (!b) return;
  //   // maplibre-gl bounds → [[minLng,minLat],[maxLng,maxLat]]
  //   const arr = (b as any).toArray?.() as [number, number][] | undefined;
  //   if (!arr || arr.length < 2) return;
  //   const [sw, ne] = arr;
  //   onMoveEnd({ minLng: sw[0], minLat: sw[1], maxLng: ne[0], maxLat: ne[1] });
  // }, [onMoveEnd]);

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

export default MapBase;
