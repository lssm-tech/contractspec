import {
	Copy,
	ExternalLink,
	FileText,
	MapPin,
	Phone,
	Search,
	User,
} from 'lucide-react';
import type * as React from 'react';
import type {
	ObjectReferenceHandlerProps,
	ObjectReferenceIconRenderContext,
} from './types';

const KIND_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
	address: MapPin,
	phone: Phone,
	user: User,
	customer: User,
	file: FileText,
	url: ExternalLink,
	custom: Search,
	copy: Copy,
	map: MapPin,
	phoneAction: Phone,
	'external-link': ExternalLink,
};

export function ReferenceIcon({
	context,
	iconRenderer,
}: {
	context: ObjectReferenceIconRenderContext;
	iconRenderer?: ObjectReferenceHandlerProps['iconRenderer'];
}) {
	if (iconRenderer) {
		return <>{iconRenderer(context)}</>;
	}

	const Icon = KIND_ICON[context.iconKey] ?? Search;
	return <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />;
}

export { Search as ReferenceSearchIcon };
