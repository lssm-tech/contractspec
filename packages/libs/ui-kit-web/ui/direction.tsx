'use client';

import * as React from 'react';

type Direction = 'ltr' | 'rtl';

const DirectionContext = React.createContext<Direction>('ltr');

export interface DirectionProviderProps {
	children: React.ReactNode;
	dir?: Direction;
}

export function DirectionProvider({
	children,
	dir = 'ltr',
}: DirectionProviderProps) {
	return (
		<DirectionContext.Provider value={dir}>
			{children}
		</DirectionContext.Provider>
	);
}

export function useDirection() {
	return React.useContext(DirectionContext);
}
