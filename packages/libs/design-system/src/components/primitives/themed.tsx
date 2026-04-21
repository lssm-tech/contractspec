'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as React from 'react';
import {
	resolveTranslationNode,
	resolveTranslationString,
	useDesignSystemTranslation,
} from '../../i18n/translation';
import {
	componentTokensToCssVars,
	useComponentTheme,
} from '../../theme/runtime';

export interface ThemedPrimitiveProps {
	componentKey?: string;
	themeVariant?: string;
	labelI18n?: string;
	placeholderI18n?: string;
	descriptionI18n?: string;
	errorI18n?: string;
	ariaLabelI18n?: string;
}

export function useThemedPrimitive({
	defaultComponentKey,
	componentKey,
	themeVariant,
	className,
	style,
}: {
	defaultComponentKey: string;
	componentKey?: string;
	themeVariant?: string;
	className?: string;
	style?: React.CSSProperties;
}) {
	const componentTheme = useComponentTheme(
		componentKey ?? defaultComponentKey,
		themeVariant
	);
	const themedClassName =
		typeof componentTheme.props.className === 'string'
			? componentTheme.props.className
			: undefined;
	const themedStyle = componentTokensToCssVars(componentTheme.tokens);

	return {
		props: componentTheme.props,
		className: cn(themedClassName, className),
		style: {
			...themedStyle,
			...style,
		},
	};
}

export function useTranslatedText() {
	const translate = useDesignSystemTranslation();

	return React.useCallback(
		(value: string | undefined) => resolveTranslationString(value, translate),
		[translate]
	);
}

export function useTranslatedNode() {
	const translate = useDesignSystemTranslation();

	return React.useCallback(
		(value: React.ReactNode) => resolveTranslationNode(value, translate),
		[translate]
	);
}
