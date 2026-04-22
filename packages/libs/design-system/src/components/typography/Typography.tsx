'use client';

import { Text as WebText } from '@contractspec/lib.ui-kit-web/ui/text';
import {
	BlockQuote as WebBlockQuote,
	Code as WebCode,
	H1 as WebH1,
	H2 as WebH2,
	H3 as WebH3,
	H4 as WebH4,
	Large as WebLarge,
	Lead as WebLead,
	Muted as WebMuted,
	P as WebP,
	Small as WebSmall,
} from '@contractspec/lib.ui-kit-web/ui/typography';
import * as React from 'react';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
} from '../primitives/themed';

type ThemedTextProps = React.ComponentProps<typeof WebText> &
	ThemedPrimitiveProps;
type ThemedTypographyProps<TComponent extends React.ElementType> =
	React.ComponentProps<TComponent> & ThemedPrimitiveProps;

function useThemedTypography({
	defaultComponentKey,
	componentKey,
	themeVariant,
	className,
}: ThemedPrimitiveProps & {
	defaultComponentKey: string;
	className?: string;
}) {
	return useThemedPrimitive({
		defaultComponentKey,
		componentKey,
		themeVariant,
		className,
	});
}

export function Text({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTextProps) {
	const themed = useThemedTypography({
		defaultComponentKey: 'Text',
		componentKey,
		themeVariant,
		className,
	});
	return <WebText {...themed.props} {...props} className={themed.className} />;
}

export function H1({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebH1>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'H1',
		componentKey,
		themeVariant,
		className,
	});
	return <WebH1 {...themed.props} {...props} className={themed.className} />;
}

export function H2({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebH2>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'H2',
		componentKey,
		themeVariant,
		className,
	});
	return <WebH2 {...themed.props} {...props} className={themed.className} />;
}

export function H3({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebH3>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'H3',
		componentKey,
		themeVariant,
		className,
	});
	return <WebH3 {...themed.props} {...props} className={themed.className} />;
}

export function H4({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebH4>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'H4',
		componentKey,
		themeVariant,
		className,
	});
	return <WebH4 {...themed.props} {...props} className={themed.className} />;
}

export function P({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebP>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'P',
		componentKey,
		themeVariant,
		className,
	});
	return <WebP {...themed.props} {...props} className={themed.className} />;
}

export function Lead({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebLead>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'Lead',
		componentKey,
		themeVariant,
		className,
	});
	return <WebLead {...themed.props} {...props} className={themed.className} />;
}

export function Large({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebLarge>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'Large',
		componentKey,
		themeVariant,
		className,
	});
	return <WebLarge {...themed.props} {...props} className={themed.className} />;
}

export function Small({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebSmall>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'Small',
		componentKey,
		themeVariant,
		className,
	});
	return <WebSmall {...themed.props} {...props} className={themed.className} />;
}

export function Muted({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebMuted>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'Muted',
		componentKey,
		themeVariant,
		className,
	});
	return <WebMuted {...themed.props} {...props} className={themed.className} />;
}

export function Code({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebCode>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'Code',
		componentKey,
		themeVariant,
		className,
	});
	return <WebCode {...themed.props} {...props} className={themed.className} />;
}

export function BlockQuote({
	componentKey,
	themeVariant,
	className,
	...props
}: ThemedTypographyProps<typeof WebBlockQuote>) {
	const themed = useThemedTypography({
		defaultComponentKey: 'BlockQuote',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebBlockQuote {...themed.props} {...props} className={themed.className} />
	);
}
