'use client';
import { usePathname } from 'next/navigation';
import * as React from 'react';

export function NextRouteAnnouncer() {
	const pathname = usePathname();
	const [message, setMessage] = React.useState('');

	React.useEffect(() => {
		// announce current document title whenever pathname changes
		if (typeof document !== 'undefined') {
			setMessage(document.title || pathname || '');
		}
	}, [pathname]);

	return (
		<div aria-live="polite" aria-atomic="true" className="sr-only">
			{message}
		</div>
	);
}
